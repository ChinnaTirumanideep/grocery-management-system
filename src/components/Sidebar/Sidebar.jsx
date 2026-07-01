function Sidebar({ activePage, onNavigate, isOwner }) {
  const menuItems = isOwner ? ['Dashboard', 'Products', 'Categories', 'Reports', 'Settings'] : ['Dashboard', 'Products', 'Categories'];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">🛒 Grocery Hub</div>
      <div className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item}
            className={`nav-item ${activePage === item ? 'active' : ''}`}
            onClick={() => onNavigate(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
