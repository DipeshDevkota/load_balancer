
import type { Server } from "../types";

interface Props {
  servers: Server[];
  totalRequests: number;
}

function TrafficDistribution({ servers, totalRequests }: Props) {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>Traffic Distribution</h2>
          <p>Requests handled by each backend</p>
        </div>
      </div>

      <div className="traffic-card">
        {servers.map((server, index) => {
          const percentage =
            totalRequests > 0
              ? (server.requestCount / totalRequests) * 100
              : 0;

          return (
            <div className="traffic-row" key={server.url}>
              <div className="traffic-server">
                <div className="mini-server">{index + 1}</div>
                <span>Backend {index + 1}</span>
              </div>

              <div className="traffic-progress">
                <div className="traffic-bar">
                  <div
                    className="traffic-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <strong>{percentage.toFixed(1)}%</strong>

              <span className="request-number">
                {server.requestCount} requests
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TrafficDistribution;