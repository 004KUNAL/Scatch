import { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import { Plus, Pencil, Trash2, X, Check, Upload, Package, Palette, Tag, IndianRupee, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const emptyForm = { name: '', price: '', discount: '0', bgc: '#1e293b', panelcolor: '#6366f1', textcolor: '#ffffff' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products').then(res => { 
      setProducts(res.data); 
      setLoading(false); 
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openCreate = () => { 
    setForm(emptyForm); 
    setEditId(null); 
    setImageFile(null); 
    setPreviewUrl(null);
    setShowForm(true); 
  };

  const openEdit = (p) => {
    setForm({ 
      name: p.name, 
      price: p.price, 
      discount: p.discount || 0, 
      bgc: p.bgc || '#1e293b', 
      panelcolor: p.panelcolor || '#6366f1', 
      textcolor: p.textcolor || '#ffffff' 
    });
    setEditId(p._id); 
    setImageFile(null); 
    setPreviewUrl(p.image);
    setShowForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editId) {
        await api.put(`/products/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await api.post('/products/create', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  if (loading && products.length === 0) return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="admin-products">
      <div className="section-header">
        <div>
          <h1>Products</h1>
          <p className="section-subtitle">Manage your catalog and product styling</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal glass-panel product-modal-wide">
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="modal-icon-wrap">
                  {editId ? <Pencil size={20} className="text-accent" /> : <Package size={20} className="text-primary" />}
                </div>
                <div>
                  <h3>{editId ? 'Edit Product' : 'Create New Product'}</h3>
                  <p className="text-xs text-soft">Fill in the details below to {editId ? 'update' : 'add'} a product</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="close-modal-btn"><X size={20} /></button>
            </div>
            
            <div className="modal-grid-2col">
              {/* Form Side */}
              <form onSubmit={handleSubmit} className="product-form-compact">
                <div className="form-field">
                  <label><Package size={14} /> Product Name</label>
                  <input name="name" placeholder="Premium Leather Jacket" value={form.name} onChange={handleChange} required />
                </div>
                
                <div className="form-2col">
                  <div className="form-field">
                    <label><IndianRupee size={14} /> Price</label>
                    <input name="price" type="number" placeholder="2999" value={form.price} onChange={handleChange} required />
                  </div>
                  <div className="form-field">
                    <label><Tag size={14} /> Discount (%)</label>
                    <input name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} />
                  </div>
                </div>

                <div className="color-section-label">
                  <Palette size={14} /> Design & Colors
                </div>
                
                <div className="form-3col">
                  <div className="form-field">
                    <label>Background</label>
                    <div className="color-input-mini">
                      <input type="color" name="bgc" value={form.bgc} onChange={handleChange} />
                      <span>{form.bgc}</span>
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Panel</label>
                    <div className="color-input-mini">
                      <input type="color" name="panelcolor" value={form.panelcolor} onChange={handleChange} />
                      <span>{form.panelcolor}</span>
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Text</label>
                    <div className="color-input-mini">
                      <input type="color" name="textcolor" value={form.textcolor} onChange={handleChange} />
                      <span>{form.textcolor}</span>
                    </div>
                  </div>
                </div>

                <div className="form-field">
                  <label><Upload size={14} /> Product Image</label>
                  <div className="compact-upload" onClick={() => fileRef.current.click()}>
                    <Upload size={18} />
                    <span>{imageFile ? imageFile.name : 'Select Image'}</span>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                  </div>
                </div>

                <div className="form-actions mt-4">
                  <button type="button" className="btn-secondary-sm" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-save-full" disabled={saving}>
                    {saving ? <div className="btn-spinner"></div> : <><Check size={18} /> {editId ? 'Save Changes' : 'Create Product'}</>}
                  </button>
                </div>
              </form>

              {/* Preview Side */}
              <div className="preview-side">
                <div className="preview-label"><Eye size={14} /> Live Preview</div>
                <div className="preview-container">
                  <div 
                    className="product-card preview-card" 
                    style={{ '--card-bg': form.bgc, '--text-color': form.textcolor }}
                  >
                    <div className="product-image-wrap" style={{ '--panel-color': form.panelcolor }}>
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="product-image" />
                      ) : (
                        <div className="product-placeholder">✦</div>
                      )}
                      {form.discount > 0 && <span className="discount-badge">{form.discount}% OFF</span>}
                    </div>
                    <div className="product-info">
                      <h3>{form.name || 'Product Title'}</h3>
                      <div className="price-row">
                        <span className="price">₹{form.discount > 0 ? (form.price - (form.price * form.discount / 100)) : (form.price || 0)}</span>
                        {form.discount > 0 && <span className="original-price">₹{form.price || 0}</span>}
                      </div>
                      <button type="button" className="btn-add-cart">Add to Cart</button>
                    </div>
                  </div>
                </div>
                <p className="preview-hint">This is how your product will appear in the shop.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="empty-state-card glass-panel">
          <Package size={48} />
          <h3>No products found</h3>
          <p>Start by adding some products to your marketplace.</p>
          <button className="btn-primary mt-4" onClick={openCreate}>Create Product</button>
        </div>
      ) : (
        <div className="products-table-wrap glass-panel">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Details</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Design Palette</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="product-cell">
                      <div className="table-img-wrap" style={{ background: p.panelcolor }}>
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="table-img" />
                        ) : (
                          <div className="table-img-placeholder">✦</div>
                        )}
                      </div>
                      <div className="product-cell-info">
                        <span className="product-name-text">{p.name}</span>
                        <span className="product-id-text">ID: {p._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="price-text">₹{p.price}</span></td>
                  <td>{p.discount > 0 ? <span className="discount-pill">{p.discount}% OFF</span> : <span className="text-soft">—</span>}</td>
                  <td>
                    <div className="design-palette">
                      <div className="palette-item" style={{ background: p.bgc }} title={`BG: ${p.bgc}`}></div>
                      <div className="palette-item" style={{ background: p.panelcolor }} title={`Panel: ${p.panelcolor}`}></div>
                      <div className="palette-item" style={{ background: p.textcolor }} title={`Text: ${p.textcolor}`}></div>
                    </div>
                  </td>
                  <td>
                    <div className="action-btns-wrap">
                      <button className="icon-btn-edit" onClick={() => openEdit(p)} title="Edit"><Pencil size={16} /></button>
                      <button className="icon-btn-delete" onClick={() => handleDelete(p._id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
