import React, { useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { useProductStore } from '../../store/productStore';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { formatCurrency } from '../../utils/helpers';
import './Products.css';

const Products = () => {
  const { products, createProduct, updateProduct, deleteProduct, initialize } = useProductStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    category: '',
    price: '',
    tax: '',
    unit: 'unit',
  });
  const [errors, setErrors] = React.useState({});

  useEffect(() => {
    initialize();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category || '',
        price: product.price.toString(),
        tax: (product.tax || 0).toString(),
        unit: product.unit || 'unit',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        tax: '',
        unit: 'unit',
      });
    }
    setErrors({});
    setModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }
    if (formData.tax && (parseFloat(formData.tax) < 0 || parseFloat(formData.tax) > 100)) {
      newErrors.tax = 'Tax must be between 0 and 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      tax: parseFloat(formData.tax) || 0,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      createProduct(data);
    }
    setModalOpen(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products & Services</h1>
          <p className="page-subtitle">Manage your product and service catalog</p>
        </div>
        <Button variant="primary" size="md" onClick={() => openModal()}>
          <Plus size={18} />
          New Product
        </Button>
      </div>

      <Card padding={false}>
        <div className="products-filters">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Tax (%)</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <span className="product-name">{product.name}</span>
                    </td>
                    <td>{product.category || '-'}</td>
                    <td className="description-cell">{product.description || '-'}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{product.tax || 0}%</td>
                    <td>{product.unit || 'unit'}</td>
                    <td>
                      <div className="action-buttons">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openModal(product)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 size={16} className="text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <Package size={48} className="empty-icon" />
                      <h3>No products found</h3>
                      <p>Add your first product to get started</p>
                      <Button variant="primary" size="md" onClick={() => openModal()}>
                        <Plus size={18} />
                        New Product
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'New Product'}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
              error={errors.name}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <Input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Electronics, Services"
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="form-select"
              >
                <option value="unit">Unit</option>
                <option value="hour">Hour</option>
                <option value="day">Day</option>
                <option value="kg">Kilogram</option>
                <option value="lb">Pound</option>
                <option value="m">Meter</option>
                <option value="ft">Foot</option>
                <option value="pcs">Pieces</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                error={errors.price}
              />
            </div>
            <div className="form-group">
              <label>Tax (%)</label>
              <Input
                type="number"
                value={formData.tax}
                onChange={(e) => setFormData(prev => ({ ...prev, tax: e.target.value }))}
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                error={errors.tax}
              />
            </div>
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
      >
        <div className="modal-content">
          <p>
            Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
