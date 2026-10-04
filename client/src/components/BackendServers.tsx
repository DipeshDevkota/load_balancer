
import type { Server } from "../types";

interface Props {
  servers: Server[];
}

function BackendServers({ servers }: Props) {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>Backend Servers</h2>
          <p>Real-time server health and traffic</p>
        </div>

        <span className="server-count">
          {servers.filter((server) => server.healthy).length}
          /{servers.length} Healthy
        </span>
      </div>

      <div className="servers-grid">
        {servers.map((server, index) => {
          const successPercentage =
            server.requestCount > 0
              ? Math.round(
                  (server.successCount / server.requestCount) * 100
                )
              : 0;

          return (
            <div
              className={`server-card ${
                server.healthy ? "" : "server-down"
              }`}
              key={server.url}
            >
              <div className="server-header">
                <div className="server-title">
                  <div className="server-icon">
                    {index + 1}
                  </div>

                  <div>
                    <h3>Backend Server {index + 1}</h3>
                    <p>{server.url}</p>
                  </div>
                </div>

                <span
                  className={`status-badge ${
                    server.healthy ? "healthy" : "unhealthy"
                  }`}
                >
                  {server.healthy ? "● Healthy" : "● Offline"}
                </span>
              </div>

              <div className="server-divider" />

              <div className="server-metrics">
                <div>
                  <span>Requests</span>
                  <strong>{server.requestCount}</strong>
                </div>

                <div>
                  <span>Success</span>
                  <strong className="success-number">
                    {server.successCount}
                  </strong>
                </div>

                <div>
                  <span>Failures</span>
                  <strong className="failure-number">
                    {server.failureCount}
                  </strong>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-label">
                  <span>Success Rate</span>
                  <strong>{successPercentage}%</strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${successPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BackendServers;