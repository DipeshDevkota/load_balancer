import express from "express";
import httpProxy from "http-proxy";

import { PORT, MAX_RETRIES, HEALTH_CHECK_INTERVAL, servers } from "./config";

import { updateHealthStatus } from "./healthChecker";

import {
  getNextServer,
  getNextRetryServer,
  incrementRequestCount,
  incrementFailureCount,
  incrementSuccessCount,
} from "./serverManager";

const app = express();

const proxy = httpProxy.createProxyServer();

proxy.on("proxyRes", (proxyRes, req) => {
  console.log(`Backend responded with status:${proxyRes.statusCode}`);
});

proxy.on("error", (error) => {
  console.log("Proxy error:", error.message);
});

app.get("/stats", (req, res) => {
  res.json(servers);
});
app.use((req, res) => {
  const startTime = Date.now();

  let retryCount = 0;

  const attemptedServers: string[] = [];

  const target = getNextServer();

  if (!target) {
    return res.status(503).json({
      message: "No healthy servers available",
    });
  }

  incrementRequestCount(target);
  attemptedServers.push(target);

  console.log(`[LOAD BALANCER] ${req.method} ${req.url} -> ${target}`);

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    console.log(
      `[LOAD BALANCER] ${req.method} ${req.url} | ${res.statusCode} | ${duration}ms`,
    );
  });

  function forwardRequest(target: string) {
    proxy.once("proxyRes", (proxyRes) => {
      if (
        proxyRes.statusCode &&
        proxyRes.statusCode >= 200 &&
        proxyRes.statusCode < 400
      ) {
        incrementSuccessCount(target);
      }
    });

    proxy.web(
      req,
      res,
      {
        target,
      },
      (error) => {
        retryCount++;

        incrementFailureCount(target);
        console.log(`Request failed for ${target}`);

        console.log(error.message);

        const failedServer = servers.find((server) => server.url === target);

        if (failedServer) {
          failedServer.healthy = false;

          console.log(`${target} marked as unhealthy`);
        }

        if (retryCount > MAX_RETRIES) {
          return res.status(503).json({
            message: "Maximum retries exceeded",
          });
        }

        const retryTarget = getNextRetryServer(attemptedServers);

        if (!retryTarget) {
          return res.status(503).json({
            message: "No healthy servers available",
          });
        }

        console.log(`Failing over to ${retryTarget}`);

        attemptedServers.push(retryTarget);

        forwardRequest(retryTarget);
      },
    );
  }

  forwardRequest(target);
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on http://localhost:${PORT}`);
});

updateHealthStatus();

setInterval(() => {
  updateHealthStatus();
}, HEALTH_CHECK_INTERVAL);
