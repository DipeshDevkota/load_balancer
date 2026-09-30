import { servers } from "./config";

let currentServer = 0;

// Get only healthy servers
export function getHealthyServers() {
  return servers.filter((server) => server.healthy);
}

// Used for normal requests
export function getNextServer() {
  const healthyServers = getHealthyServers();

  if (healthyServers.length === 0) {
    return null;
  }

  // Make sure currentServer is within the array range
  currentServer = currentServer % healthyServers.length;

  const server = healthyServers[currentServer];

  // Move to the next server for the next request
  currentServer = (currentServer + 1) % healthyServers.length;

  return server.url;
}

// Used when the current server fails
export function getNextRetryServer(attemptedServers: string[]) {
  const healthyServers = getHealthyServers().filter(
    (server) => !attemptedServers.includes(server.url),
  );

  if (healthyServers.length === 0) {
    return null;
  }

  // For retry, simply choose the first
  // healthy server that hasn't been tried
  return healthyServers[0].url;
}

export function incrementRequestCount(serverUrl: string) {
  const server = servers.find((server) => server.url == serverUrl);

  if (server) {
    server.requests++;
  }
}
