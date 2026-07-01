function Statistics({ metrics }) {
  return (
    <div className="card-grid">
      <div className="statistics-card">
        <h3>Total Products</h3>
        <div className="metric-value">{metrics.totalProducts}</div>
      </div>
      <div className="statistics-card">
        <h3>Total Categories</h3>
        <div className="metric-value">{metrics.totalCategories}</div>
      </div>
      <div className="statistics-card">
        <h3>Inventory Value</h3>
        <div className="metric-value">${metrics.inventoryValue.toLocaleString()}</div>
      </div>
      <div className="statistics-card">
        <h3>Expired Products</h3>
        <div className="metric-value">{metrics.expiredProducts}</div>
      </div>
      <div className="statistics-card">
        <h3>Low Stock Count</h3>
        <div className="metric-value">{metrics.lowStockItems}</div>
      </div>
      <div className="statistics-card">
        <h3>Average Price</h3>
        <div className="metric-value">${metrics.averagePrice.toFixed(0)}</div>
      </div>
    </div>
  );
}

export default Statistics;
