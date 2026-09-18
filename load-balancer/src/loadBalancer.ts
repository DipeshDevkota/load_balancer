import express from "express";
import httpProxy from "http-proxy";

const app = express();
const PORT = 3000;

const servers = [
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
];

let currentServer = 0;
const proxy = httpProxy.createProxyServer();

app.use((req, res) => {
  const target = servers[currentServer];
  console.log(`Forwarding request to ${target}`);

  currentServer = (currentServer + 1) % servers.length;

  proxy.web(req, res, {
    target,
  });
});

app.listen(PORT, () => {
  console.log(`Load Balancer running on http://localhost:${PORT}`);
});
