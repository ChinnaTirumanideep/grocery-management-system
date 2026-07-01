function Dashboard({ metrics, activities, onViewProducts, onViewReports }) {
  return (
    <>
      <div className="card-grid">
        <div className="metric-card">
          <div className="metric-label">Total Products</div>
          <div className="metric-value">{metrics.totalProducts}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Stock</div>
          <div className="metric-value">{metrics.totalStock}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Low Stock</div>
          <div className="metric-value">{metrics.lowStockItems}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Out of Stock</div>
          <div className="metric-value">{metrics.outOfStockItems}</div>
        </div>
      </div>

      <div className="card-grid">
        <div className="info-card">
          <h3>Inventory Value</h3>
          <p className="metric-value">${metrics.inventoryValue.toLocaleString()}</p>
          <p className="muted">Current stock cost</p>
        </div>
        <div className="info-card">
          <h3>Average Price</h3>
          <p className="metric-value">${metrics.averagePrice.toFixed(0)}</p>
          <p className="muted">Average selling price</p>
        </div>
        <div className="info-card">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <strong>{activity.message}</strong>
                <div className="muted">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-grid">
        <div className="info-card">
          <h3>Quick Actions</h3>
          <div className="product-actions">
            <button className="primary-btn" onClick={onViewProducts}>Manage Products</button>
            <button className="secondary-btn" onClick={onViewReports}>Open Reports</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
