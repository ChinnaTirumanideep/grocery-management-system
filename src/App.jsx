import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/ProductList/ProductList';
import ProductForm from './components/ProductForm/ProductForm';
import Filters from './components/Filters/Filters';
import Statistics from './components/Statistics/Statistics';
import Reports from './components/Reports/Reports';
import Modal from './components/Modal/Modal';

const STORAGE_KEY = 'grocery-inventory-data';
const CATEGORY_OPTIONS = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Bakery',
  'Snacks',
  'Beverages',
  'Frozen Foods',
  'Grocery',
  'Cleaning Supplies',
  'Personal Care'
];

const UNIT_OPTIONS = ['kg', 'g', 'litre', 'ml', 'packets', 'pieces'];

const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    name: 'Fresh Apples',
    category: 'Fruits',
    brand: 'Nature Fresh',
    quantity: 12,
    unit: 'kg',
    costPrice: 120,
    sellingPrice: 180,
    supplier: 'Green Valley Farms',
    manufacturingDate: '2026-06-01',
    expiryDate: '2026-07-15',
    barcode: 'APPL001',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=600&q=80',
    status: 'Available'
  },
  {
    id: 'p2',
    name: 'Milk',
    category: 'Dairy',
    brand: 'Dairy Best',
    quantity: 4,
    unit: 'litre',
    costPrice: 90,
    sellingPrice: 120,
    supplier: 'Bright Dairy',
    manufacturingDate: '2026-06-20',
    expiryDate: '2026-07-05',
    barcode: 'MILK002',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80',
    status: 'Low Stock'
  },
  {
    id: 'p3',
    name: 'Bread Loaf',
    category: 'Bakery',
    brand: 'Golden Crust',
    quantity: 0,
    unit: 'pieces',
    costPrice: 55,
    sellingPrice: 80,
    supplier: 'City Bakery',
    manufacturingDate: '2026-06-22',
    expiryDate: '2026-06-30',
    barcode: 'BRD003',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    status: 'Out of Stock'
  }
];

const initialActivities = [
  { id: 'a1', message: 'Inventory initialized with starter products', time: 'Just now' },
  { id: 'a2', message: 'Low stock alert for Milk', time: '5 min ago' }
];

function getProductStatus(product) {
  const quantity = Number(product.quantity);
  const now = new Date();
  const expiryDate = product.expiryDate ? new Date(product.expiryDate) : null;
  const daysToExpiry = expiryDate ? Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)) : null;

  if (quantity === 0) return 'Out of Stock';
  if (quantity < 10) return 'Low Stock';
  if (daysToExpiry !== null && daysToExpiry <= 7 && daysToExpiry >= 0) return 'Expiring Soon';
  return 'Available';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function App() {
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState(initialActivities);
  const [activePage, setActivePage] = useState('Dashboard');
  const [activeRole, setActiveRole] = useState('owner');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expiringFilter, setExpiringFilter] = useState(false);
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProducts(parsed.products || DEFAULT_PRODUCTS);
        setActivities(parsed.activities || initialActivities);
        setIsDarkMode(Boolean(parsed.isDarkMode));
        setActiveRole(parsed.activeRole || 'owner');
      } catch {
        setProducts(DEFAULT_PRODUCTS);
        setActivities(initialActivities);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
      setActivities(initialActivities);
    }

    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ products, activities, isDarkMode, activeRole })
      );
    }
  }, [products, activities, isDarkMode, activeRole, loading]);

  useEffect(() => {
    if (activeRole === 'customer' && (activePage === 'Reports' || activePage === 'Settings')) {
      setActivePage('Products');
    }
  }, [activeRole, activePage]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const enrichedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        status: getProductStatus(product)
      })),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const next = enrichedProducts.filter((product) => {
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.supplier.toLowerCase().includes(term);

      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || product.status === statusFilter;
      const matchesExpiring = !expiringFilter || (product.expiryDate && new Date(product.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      const matchesLowStock = !lowStockFilter || product.quantity < 10;

      return matchesSearch && matchesCategory && matchesStatus && matchesExpiring && matchesLowStock;
    });

    next.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'quantity') return Number(b.quantity) - Number(a.quantity);
      if (sortBy === 'price') return Number(b.sellingPrice) - Number(a.sellingPrice);
      if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
      return 0;
    });

    return next;
  }, [enrichedProducts, searchTerm, categoryFilter, statusFilter, expiringFilter, lowStockFilter, sortBy]);

  const metrics = useMemo(() => {
    const totalProducts = enrichedProducts.length;
    const totalStock = enrichedProducts.reduce((sum, product) => sum + Number(product.quantity), 0);
    const lowStockItems = enrichedProducts.filter((product) => product.quantity > 0 && product.quantity < 10).length;
    const outOfStockItems = enrichedProducts.filter((product) => product.quantity === 0).length;
    const inventoryValue = enrichedProducts.reduce((sum, product) => sum + Number(product.quantity) * Number(product.costPrice), 0);
    const averagePrice = totalProducts ? enrichedProducts.reduce((sum, product) => sum + Number(product.sellingPrice), 0) / totalProducts : 0;
    const totalCategories = new Set(enrichedProducts.map((product) => product.category)).size;
    const expiredProducts = enrichedProducts.filter((product) => product.expiryDate && new Date(product.expiryDate) < new Date()).length;

    return {
      totalProducts,
      totalStock,
      lowStockItems,
      outOfStockItems,
      inventoryValue,
      averagePrice,
      totalCategories,
      expiredProducts
    };
  }, [enrichedProducts]);

  const recentActivities = useMemo(() => activities.slice(0, 5), [activities]);
  const isOwner = activeRole === 'owner';

  const showToast = (message) => setToast(message);

  const resetForm = () => {
    setModalType(null);
    setSelectedProduct(null);
    setFormInitialValues(null);
  };

  const handleAddProduct = () => {
    setModalType('form');
    setFormInitialValues({
      name: '',
      category: CATEGORY_OPTIONS[0],
      brand: '',
      quantity: 0,
      unit: UNIT_OPTIONS[0],
      costPrice: 0,
      sellingPrice: 0,
      supplier: '',
      manufacturingDate: '',
      expiryDate: '',
      barcode: '',
      imageUrl: ''
    });
  };

  const handleEditProduct = (product) => {
    setModalType('form');
    setSelectedProduct(product);
    setFormInitialValues(product);
  };

  const handleViewProduct = (product) => {
    setModalType('details');
    setSelectedProduct(product);
  };

  const handleDuplicateProduct = (product) => {
    const duplicated = {
      ...product,
      id: uuidv4(),
      name: `${product.name} (Copy)`
    };
    setProducts((curr) => [duplicated, ...curr]);
    setActivities((curr) => [{ id: uuidv4(), message: `Duplicated ${duplicated.name}`, time: 'Just now' }, ...curr]);
    showToast('Product duplicated');
  };

  const handleDeleteRequest = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const target = products.find((product) => product.id === deleteId);
    setProducts((curr) => curr.filter((product) => product.id !== deleteId));
    setActivities((curr) => [{ id: uuidv4(), message: `Deleted ${target?.name || 'product'}`, time: 'Just now' }, ...curr]);
    showToast('Product deleted');
    setDeleteId(null);
  };

  const handleSubmitProduct = (values) => {
    const normalized = {
      ...values,
      quantity: Number(values.quantity),
      costPrice: Number(values.costPrice),
      sellingPrice: Number(values.sellingPrice),
      status: getProductStatus({ ...values, quantity: Number(values.quantity) })
    };

    if (!normalized.name || !normalized.category || !normalized.brand || !normalized.supplier || !normalized.unit || !normalized.manufacturingDate || !normalized.expiryDate) {
      showToast('Please fill in all required fields');
      return;
    }

    if (normalized.sellingPrice <= 0 || normalized.costPrice <= 0) {
      showToast('Prices must be greater than zero');
      return;
    }

    if (normalized.quantity < 0) {
      showToast('Quantity cannot be negative');
      return;
    }

    if (new Date(normalized.expiryDate) < new Date(normalized.manufacturingDate)) {
      showToast('Expiry date cannot be before manufacturing date');
      return;
    }

    if (selectedProduct) {
      setProducts((curr) => curr.map((product) => (product.id === selectedProduct.id ? { ...product, ...normalized } : product)));
      setActivities((curr) => [{ id: uuidv4(), message: `Updated ${normalized.name}`, time: 'Just now' }, ...curr]);
      showToast('Product updated');
    } else {
      const newProduct = { id: uuidv4(), ...normalized };
      setProducts((curr) => [newProduct, ...curr]);
      setActivities((curr) => [{ id: uuidv4(), message: `Added ${normalized.name}`, time: 'Just now' }, ...curr]);
      showToast('Product added');
    }

    resetForm();
  };

  return (
    <div className={`app-shell ${isDarkMode ? 'dark' : 'light'}`}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} isOwner={isOwner} />
      <div className="main-panel">
        <Navbar
          title={activePage}
          onAddProduct={handleAddProduct}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((curr) => !curr)}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          isOwner={isOwner}
        />

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading inventory dashboard...</p>
          </div>
        ) : (
          <div className="page-content">
            {activePage === 'Dashboard' && (
              isOwner ? (
                <Dashboard
                  metrics={metrics}
                  activities={recentActivities}
                  onViewProducts={() => setActivePage('Products')}
                  onViewReports={() => setActivePage('Reports')}
                />
              ) : (
                <div className="card-grid">
                  <div className="info-card">
                    <h3>Welcome, Customer</h3>
                    <p>Browse fresh products, check availability, and discover the best deals in our grocery store.</p>
                  </div>
                  <div className="info-card">
                    <h3>Available Today</h3>
                    <p className="metric-value">{metrics.totalProducts}</p>
                    <p className="muted">Products ready to view</p>
                  </div>
                  <div className="info-card">
                    <h3>Low Stock Items</h3>
                    <p className="metric-value">{metrics.lowStockItems}</p>
                    <p className="muted">Watch these items closely</p>
                  </div>
                </div>
              )
            )}

            {activePage === 'Products' && (
              <>
                <Statistics metrics={metrics} />
                <Filters
                  categories={CATEGORY_OPTIONS}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  expiringFilter={expiringFilter}
                  onExpiringChange={setExpiringFilter}
                  lowStockFilter={lowStockFilter}
                  onLowStockChange={setLowStockFilter}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
                <ProductList
                  products={filteredProducts}
                  onView={handleViewProduct}
                  onEdit={handleEditProduct}
                  onDuplicate={handleDuplicateProduct}
                  onDelete={handleDeleteRequest}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  isOwner={isOwner}
                />
              </>
            )}

            {activePage === 'Categories' && (
              <div className="card-grid">
                {CATEGORY_OPTIONS.map((category) => {
                  const count = enrichedProducts.filter((product) => product.category === category).length;
                  return (
                    <div key={category} className="info-card">
                      <h3>{category}</h3>
                      <p>{count} products</p>
                    </div>
                  );
                })}
              </div>
            )}

            {activePage === 'Reports' && isOwner && <Reports products={enrichedProducts} metrics={metrics} />}

            {activePage === 'Settings' && isOwner && (
              <div className="settings-card">
                <h2>Preferences</h2>
                <p>Switch between light and dark mode to customize your workspace.</p>
                <button className="primary-btn" onClick={() => setIsDarkMode((curr) => !curr)}>
                  Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
                </button>
                <button className="secondary-btn" onClick={() => {
                  setProducts(DEFAULT_PRODUCTS);
                  setActivities(initialActivities);
                  showToast('Inventory reset');
                }}>
                  Reset Demo Data
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {modalType === 'form' && (
        <Modal title={selectedProduct ? 'Edit Product' : 'Add Product'} onClose={resetForm}>
          <ProductForm
            initialValues={formInitialValues}
            categories={CATEGORY_OPTIONS}
            units={UNIT_OPTIONS}
            onSubmit={handleSubmitProduct}
            onCancel={resetForm}
          />
        </Modal>
      )}

      {modalType === 'details' && selectedProduct && (
        <Modal title="Product Details" onClose={resetForm}>
          <div className="details-card">
            <img src={selectedProduct.imageUrl || 'https://via.placeholder.com/300x180'} alt={selectedProduct.name} className="details-image" />
            <h3>{selectedProduct.name}</h3>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Brand:</strong> {selectedProduct.brand}</p>
            <p><strong>Quantity:</strong> {selectedProduct.quantity} {selectedProduct.unit}</p>
            <p><strong>Cost Price:</strong> {formatCurrency(selectedProduct.costPrice)}</p>
            <p><strong>Selling Price:</strong> {formatCurrency(selectedProduct.sellingPrice)}</p>
            <p><strong>Supplier:</strong> {selectedProduct.supplier}</p>
            <p><strong>Manufacturing Date:</strong> {formatDate(selectedProduct.manufacturingDate)}</p>
            <p><strong>Expiry Date:</strong> {formatDate(selectedProduct.expiryDate)}</p>
            <p><strong>Status:</strong> <span className={`status-pill status-${selectedProduct.status.toLowerCase().replace(/\s+/g, '-')}`}>{selectedProduct.status}</span></p>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
          <div className="confirmation-box">
            <p>Delete this product from inventory?</p>
            <div className="confirm-actions">
              <button className="secondary-btn" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="danger-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
