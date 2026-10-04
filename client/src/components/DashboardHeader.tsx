
interface Props {
  lastUpdated: Date | null;
}

function DashboardHeader({ lastUpdated }: Props) {
  return (
    <header className="header">
      <div>
        <h1>Dashboard</h1>
        <p>
          Monitor your load balancer and backend infrastructure
        </p>
      </div>

      <div className="header-right">
        <div className="live-status">
          <span className="pulse" />
          Live
        </div>

        <div className="updated">
          Updated{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString()
            : "--"}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;