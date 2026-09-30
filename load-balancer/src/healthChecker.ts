import http from "http";
import { servers } from "./config";

export function checkHealth(server: string): Promise<boolean> {
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

export async function updateHealthStatus() {
  for (const server of servers) {
    server.healthy = await checkHealth(server.url);

    console.log(`${server.url} healthy : ${server.healthy}`);
  }
}
