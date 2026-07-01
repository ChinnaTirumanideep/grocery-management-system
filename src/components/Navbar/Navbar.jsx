function Navbar({ title, onAddProduct, isDarkMode, onToggleTheme, activeRole, onRoleChange, isOwner }) {
  return (
    <header className="navbar">
      <div className="nav-title">{title}</div>
      <div className="nav-actions">
        <div className="role-switch">
          <button className={`role-chip ${activeRole === 'owner' ? 'active' : ''}`} onClick={() => onRoleChange('owner')}>
            Owner
          </button>
          <button className={`role-chip ${activeRole === 'customer' ? 'active' : ''}`} onClick={() => onRoleChange('customer')}>
            Customer
          </button>
        </div>
        <button className="secondary-btn" onClick={onToggleTheme}>
          {isDarkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        {isOwner && (
          <button className="primary-btn" onClick={onAddProduct}>
            + Add Product
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
