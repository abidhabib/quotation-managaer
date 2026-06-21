import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { useProductStore } from '../store/productStore';
import { formatCurrency } from '../utils/helpers';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProductStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    tax: 0,
    unit: 'pcs'
  });

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        price: product.price.toString(),
        tax: product.tax.toString()
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        tax: 0,
        unit: 'pcs'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      tax: parseFloat(formData.tax) || 0
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await addProduct(data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading-state">Loading products...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Products & Services</h1>
          <p className="subtitle">Manage your catalog items</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Add Product</Button>
      </div>

      <Card className="filters-card">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="🔍"
        />
      </Card>

      {filteredProducts.length === 0 ? (
        <Card className="empty-state">
          <p>{searchTerm ? 'No products found matching your search.' : 'No products yet. Add your first product to get started.'}</p>
        </Card>
      ) : (
        <Card className="table-container">
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
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="font-medium">{product.name}</td>
                  <td>{product.category || '-'}</td>
                  <td className="truncate">{product.description}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.tax}%</td>
                  <td>{product.unit}</td>
                  <td>
                    <div className="actions-cell">
                      <Button variant="secondary" size="small" onClick={() => handleOpenModal(product)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="small" onClick={() => handleDelete(product.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            type="text"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            type="text"
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-row">
            <Input
              type="number"
              label="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              step="0.01"
              min="0"
              required
            />

            <Input
              type="number"
              label="Tax (%)"
              value={formData.tax}
              onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
              step="0.1"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Unit</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            >
              <option value="pcs">Pieces</option>
              <option value="hrs">Hours</option>
              <option value="days">Days</option>
              <option value="kg">Kilograms</option>
              <option value="m">Meters</option>
              <option value="l">Liters</option>
              <option value="box">Box</option>
            </select>
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
