import { useState, useEffect } from 'react';

function ProductForm({ initialValues, categories, units, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialValues || {
    name: '',
    category: categories[0],
    brand: '',
    quantity: 0,
    unit: units[0],
    costPrice: 0,
    sellingPrice: 0,
    supplier: '',
    manufacturingDate: '',
    expiryDate: '',
    barcode: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (initialValues) {
      setForm(initialValues);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <form
      className="form-grid"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <label>
        Product Name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>
      <label>
        Brand
        <input name="brand" value={form.brand} onChange={handleChange} required />
      </label>
      <label>
        Quantity
        <input name="quantity" type="number" min="0" value={form.quantity} onChange={handleChange} required />
      </label>
      <label>
        Unit
        <select name="unit" value={form.unit} onChange={handleChange}>
          {units.map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </label>
      <label>
        Cost Price
        <input name="costPrice" type="number" min="0" value={form.costPrice} onChange={handleChange} required />
      </label>
      <label>
        Selling Price
        <input name="sellingPrice" type="number" min="0" value={form.sellingPrice} onChange={handleChange} required />
      </label>
      <label>
        Supplier
        <input name="supplier" value={form.supplier} onChange={handleChange} required />
      </label>
      <label>
        Manufacturing Date
        <input name="manufacturingDate" type="date" value={form.manufacturingDate} onChange={handleChange} required />
      </label>
      <label>
        Expiry Date
        <input name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required />
      </label>
      <label>
        Barcode
        <input name="barcode" value={form.barcode} onChange={handleChange} />
      </label>
      <label>
        Image URL
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
      </label>
      <div className="form-actions">
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="primary-btn">Save Product</button>
      </div>
    </form>
  );
}

export default ProductForm;
