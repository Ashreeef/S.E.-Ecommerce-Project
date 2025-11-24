import '@/styles/admin-dashboard.css';

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Welcome to your admin dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-label">Total Orders</h3>
          <p className="stat-value">1,234</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Total Revenue</h3>
          <p className="stat-value">$45,678</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Products</h3>
          <p className="stat-value">567</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Customers</h3>
          <p className="stat-value">8,901</p>
        </div>
      </div>
    </div>
  );
}


