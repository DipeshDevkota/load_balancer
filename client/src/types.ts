export interface Server {
  url: string;
  healthy: boolean;
  requestCount: number;
  successCount: number;
  failureCount: number;
}

export interface ServerStatsResponse {
  url: string;
  healthy: boolean;
  requests: number;
  successes: number;
  failures: number;
}
