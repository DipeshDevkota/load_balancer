import "dotenv/config";

export const PORT = Number(process.env.PORT) || 3000;

export const MAX_RETRIES = Number(process.env.MAX_RETRIES) || 2;

export const HEALTH_CHECK_INTERVAL =
  Number(process.env.HEALTH_CHECK_INTERVAL) || 15000;

const isDocker = process.env.DOCKER === "true";

const backendHost = isDocker ? "backend" : "localhost";

export const servers = [
  {
    url: `http://${isDocker ? "backend1" : backendHost}:3001`,
    healthy: false,
    requests: 0,
    successes: 0,
    failures: 0,
  },
  {
    url: `http://${isDocker ? "backend2" : backendHost}:3002`,
    healthy: false,
    requests: 0,
    successes: 0,
    failures: 0,
  },
  {
    url: `http://${isDocker ? "backend3" : backendHost}:3003`,
    healthy: false,
    requests: 0,
    successes: 0,
    failures: 0,
  },
];
