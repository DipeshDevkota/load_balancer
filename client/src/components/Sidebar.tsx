
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">LB</div>

        <div>
          <h2>LoadFlow</h2>
          <span>Infrastructure Monitor</span>
        </div>
      </div>

      <nav>
        <div className="nav-item active">
          <span>▦</span>
          Dashboard
        </div>

        <div className="nav-item">
          <span>◉</span>
          Servers
        </div>

        <div className="nav-item">
          <span>◈</span>
          Traffic
        </div>

        <div className="nav-item">
          <span>⚙</span>
          Settings
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="connection-status">
          <span className="pulse" />

          <div>
            <strong>System Online</strong>
            <small>Load balancer :3000</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;