import express from "express";
import httpProxy from "http-proxy";
import http from "http";

const app = express();
const PORT = 3000;

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

let currentServer = 0;
const proxy = httpProxy.createProxyServer();

app.use((req, res) => {
  const healthyServers = getHealthyServers();
  if (healthyServers.length === 0) {
    return res.status(503).json({
      message: " No healthy servers available",
    });
  }
  const target = healthyServers[currentServer % healthyServers.length].url;
  console.log(`Forwarding request to ${target}`);

  currentServer = (currentServer + 1) % healthyServers.length;

  proxy.web(req, res, {
    target,
  });
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on http://localhost:${PORT}`);
});

updateHealthStatus();

setInterval(() => {
  updateHealthStatus();
}, 5000);
