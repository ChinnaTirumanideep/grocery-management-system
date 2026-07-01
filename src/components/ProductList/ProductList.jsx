import ProductCard from '../ProductCard/ProductCard';

function ProductList({ products, onView, onEdit, onDuplicate, onDelete, formatCurrency, formatDate, isOwner }) {
  if (!products.length) {
    return <div className="empty-state">No inventory items match the current filters.</div>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onView={onView}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          isOwner={isOwner}
        />
      ))}
    </div>
  );
}

export default ProductList;
