
function LoadBalancerCard() {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <h2>Load Balancer</h2>
          <p>Traffic distribution entry point</p>
        </div>

        <span className="status-badge healthy">
          ● Operational
        </span>
      </div>

      <div className="load-balancer-card">
        <div className="lb-icon">⇄</div>

        <div className="lb-info">
          <h3>Load Balancer</h3>
          <p>http://localhost:3000</p>
        </div>

        <div className="lb-details">
          <div>
            <span>Algorithm</span>
            <strong>Round Robin</strong>
          </div>

          <div>
            <span>Health Checks</span>
            <strong>Enabled</strong>
          </div>

          <div>
            <span>Retry Limit</span>
            <strong>2</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoadBalancerCard;