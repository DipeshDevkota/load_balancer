export const PORT = 3000;

export const MAX_RETRIES = 2;

export const HEALTH_CHECK_INTERVAL = 15000;
export const servers = [
  {
    url: "http://localhost:3001",
    healthy: false,
    requests: 0,
    successes: 0,
    failures: 0,
  },
  {
    url: "http://localhost:3002",
    healthy: false,
    requests: 0,
    successes: 0,
    failures: 0,
  },
  {
    url: "http://localhost:3003",
    healthy: false,
    requests: 0,
    successes: 0,
    failures: 0,
  },
];
