function Reports({ products, metrics }) {
  const lowStockProducts = products.filter((product) => product.quantity < 10 && product.quantity > 0);
  const expiringProducts = products.filter((product) => product.expiryDate && new Date(product.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const categoryDistribution = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="report-grid">
      <div className="report-card">
        <h3>Inventory Summary</h3>
        <p>Total Products: {metrics.totalProducts}</p>
        <p>Total Stock: {metrics.totalStock}</p>
        <p>Inventory Value: ${metrics.inventoryValue.toLocaleString()}</p>
        <p>Expired Products: {metrics.expiredProducts}</p>
      </div>

      <div className="report-card">
        <h3>Category Distribution</h3>
        {Object.entries(categoryDistribution).map(([name, count]) => (
          <p key={name}>{name}: {count}</p>
        ))}
      </div>

      <div className="report-card">
        <h3>Low Stock Report</h3>
        {lowStockProducts.length ? lowStockProducts.map((product) => (
          <p key={product.id}>{product.name} — {product.quantity} {product.unit}</p>
        )) : <p>No low stock items.</p>}
      </div>

      <div className="report-card">
        <h3>Expiry Report</h3>
        {expiringProducts.length ? expiringProducts.map((product) => (
          <p key={product.id}>{product.name} — {product.expiryDate}</p>
        )) : <p>No products expiring soon.</p>}
      </div>
    </div>
  );
}

export default Reports;
