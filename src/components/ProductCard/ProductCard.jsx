function ProductCard({ product, onView, onEdit, onDuplicate, onDelete, formatCurrency, formatDate, isOwner }) {
  return (
    <article className="product-card">
      <img src={product.imageUrl || 'https://via.placeholder.com/300x180'} alt={product.name} className="product-image" />
      <div className="product-actions">
        <span className={`status-pill status-${product.status.toLowerCase().replace(/\s+/g, '-')}`}>{product.status}</span>
      </div>
      <h3>{product.name}</h3>
      <p className="muted">{product.category} • {product.brand}</p>
      <p><strong>Qty:</strong> {product.quantity} {product.unit}</p>
      <p><strong>Price:</strong> {formatCurrency(product.sellingPrice)}</p>
      <p><strong>Expiry:</strong> {formatDate(product.expiryDate)}</p>
      <p><strong>Supplier:</strong> {product.supplier}</p>
      <div className="product-actions">
        <button className="secondary-btn" onClick={() => onView(product)}>View</button>
        {isOwner && (
          <>
            <button className="secondary-btn" onClick={() => onEdit(product)}>Edit</button>
            <button className="secondary-btn" onClick={() => onDuplicate(product)}>Duplicate</button>
            <button className="danger-btn" onClick={() => onDelete(product.id)}>Delete</button>
          </>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
