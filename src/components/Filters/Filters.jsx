function Filters({
  categories,
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  expiringFilter,
  onExpiringChange,
  lowStockFilter,
  onLowStockChange,
  sortBy,
  onSortChange
}) {
  return (
    <div className="filters-card">
      <h3>Search & Filters</h3>
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search by name, category, or supplier"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <select value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Expiring Soon">Expiring Soon</option>
        </select>
        <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="quantity">Sort by Quantity</option>
          <option value="price">Sort by Price</option>
          <option value="expiry">Sort by Expiry</option>
        </select>
      </div>
      <div className="filter-row">
        <label>
          <input type="checkbox" checked={expiringFilter} onChange={() => onExpiringChange(!expiringFilter)} />
          Expiring soon
        </label>
        <label>
          <input type="checkbox" checked={lowStockFilter} onChange={() => onLowStockChange(!lowStockFilter)} />
          Low stock only
        </label>
      </div>
    </div>
  );
}

export default Filters;
