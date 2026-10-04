
interface Props {
  totalRequests: number;
  healthyServers: number;
  totalServers: number;
  unhealthyServers: number;
  totalFailures: number;
  totalSuccesses: number;
  successRate: string;
}

function OverviewCards({
  totalRequests,
  healthyServers,
  totalServers,
  unhealthyServers,
  totalFailures,
  totalSuccesses,
  successRate,
}: Props) {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-top">
          <span>Total Requests</span>
          <div className="stat-icon blue">↗</div>
        </div>
        <h2>{totalRequests.toLocaleString()}</h2>
        <p className="positive">Live traffic</p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Healthy Servers</span>
          <div className="stat-icon green">✓</div>
        </div>
        <h2>{healthyServers}</h2>
        <p>
          <span className="green-text">{healthyServers}</span>
          {" "}of {totalServers} servers online
        </p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Failed Requests</span>
          <div className="stat-icon red">!</div>
        </div>
        <h2>{totalFailures}</h2>
        <p>
          {unhealthyServers > 0
            ? `${unhealthyServers} server(s) unhealthy`
            : "All backend servers healthy"}
        </p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Success Rate</span>
          <div className="stat-icon purple">%</div>
        </div>
        <h2>{successRate}%</h2>
        <p className="positive">
          {totalSuccesses.toLocaleString()} successful
        </p>
      </div>
    </section>
  );
}

export default OverviewCards;