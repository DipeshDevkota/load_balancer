import express from "express";
import httpProxy from "http-proxy";
import http from "http";

const app = express();
const PORT = 3000;

const MAX_RETRIES = 2;

const servers = [
  {
    url: "http://localhost:3001",
    healthy: false,
  },

  { url: "http://localhost:3002", healthy: false },
  {
    url: "http://localhost:3003",
    healthy: false,
  },
];

async function checkHealth(server: string): Promise<boolean> {
  return new Promise((resolve) => {
    const request = http.get(`${server}/health`, (res) => {
      resolve(res.statusCode === 200);
    });

    request.on("error", () => {
      resolve(false);
    });

    request.setTimeout(2000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function updateHealthStatus() {
  for (const server of servers) {
    server.healthy = await checkHealth(server.url);
    console.log(`${server.url} healthy : ${server.healthy}`);
  }
}

function getHealthyServers() {
  return servers.filter((server) => server.healthy);
}

function getNextHealthyServer(attemptedServers: string[]) {
  const healthyServers = getHealthyServers().filter(
    (server) => !attemptedServers.includes(server.url),
  );

  if (healthyServers.length === 0) {
    return null;
  }

  const server = healthyServers[currentServer % healthyServers.length];
  currentServer = (currentServer + 1) % healthyServers.length;

  return server.url;
}

let currentServer = 0;
const proxy = httpProxy.createProxyServer();

proxy.on("error", (error, req, res) => {
  console.log("Proxy error:", error.message);
});

app.use((req, res) => {
  let retryCount = 0;

  const attemptedServers: string[] = [];
  const healthyServers = getHealthyServers();
  if (healthyServers.length === 0) {
    return res.status(503).json({
      message: " No healthy servers available",
    });
  }
  const target = healthyServers[currentServer % healthyServers.length].url;
  attemptedServers.push(target);
  console.log(`Forwarding request to ${target}`);

  currentServer = (currentServer + 1) % healthyServers.length;

  proxy.web(
    req,
    res,
    {
      target,
    },
    (error) => {
      retryCount++;

      if (retryCount > MAX_RETRIES) {
        return res.status(503).json({
          message: "Maximum retries exceeded",
        });
      }
      console.log(`Request failed for ${target}`);
      console.log(error.message);

      const failedServer = servers.find((server) => server.url === target);

      if (failedServer) {
        failedServer.healthy = false;
        console.log(`${target} marked as unhealthy`);
      }

      const retryTarget = getNextHealthyServer(attemptedServers);
      if (!retryTarget) {
        return res.status(503).json({
          message: "No healthy servers available",
        });
      }

      console.log(`Failing over to ${retryTarget}`);

      attemptedServers.push(retryTarget);
      proxy.web(req, res, {
        target: retryTarget,
      });
    },
  );
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on http://localhost:${PORT}`);
});

updateHealthStatus();

setInterval(() => {
  updateHealthStatus();
}, 15000);
