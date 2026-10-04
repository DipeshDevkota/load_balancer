import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
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

import { logInfo, logError, logWarning } from "./logger";

const app = express();
app.use(cors());
const proxy = httpProxy.createProxyServer();

proxy.on("proxyRes", (proxyRes, req) => {
  logInfo(`Backend responded with status: ${proxyRes.statusCode}`);
});

proxy.on("error", (error) => {
  logError(`Proxy error: ${error.message}`);
});

app.get("/stats", (req, res) => {
  res.json(servers);
});

app.use((req, res) => {
  const requestId = randomUUID();
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

  logInfo(`[ID: ${requestId}] ${req.method} ${req.url} -> ${target}`);

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    logInfo(
      `[ID: ${requestId}] ${req.method} ${req.url} | ${res.statusCode} | ${duration}ms`,
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

        logError(`[ID: ${requestId}] Request failed for ${target}`);

        logError(`[ID: ${requestId}] ${error.message}`);

        const failedServer = servers.find((server) => server.url === target);

        if (failedServer) {
          failedServer.healthy = false;

          logWarning(`[ID: ${requestId}] ${target} marked as unhealthy`);
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

        logWarning(`[ID: ${requestId}] Failing over to ${retryTarget}`);

        attemptedServers.push(retryTarget);

        forwardRequest(retryTarget);
      },
    );
  }

  forwardRequest(target);
});

app.listen(PORT, () => {
  logInfo(`Load Balancer running on http://localhost:${PORT}`);
});

updateHealthStatus();

setInterval(() => {
  updateHealthStatus();
}, HEALTH_CHECK_INTERVAL);
