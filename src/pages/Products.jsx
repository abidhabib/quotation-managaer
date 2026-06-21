import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, searchProducts } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', price: '', unit: 'pcs'
  });

  const filteredProducts = searchQuery ? searchProducts(searchQuery) : products;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, price: parseFloat(formData.price) || 0 };
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    closeModal();
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', category: '', price: '', unit: 'pcs' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Products & Services</h1>
          <p className="text-taupe mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe" />
        <input type="text" placeholder="Search products..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Unit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-taupe uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-taupe">No products found.</td></tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-espresso">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-taupe">{p.category}</td>
                  <td className="px-6 py-4 text-sm text-taupe truncate max-w-xs">{p.description}</td>
                  <td className="px-6 py-4 text-sm font-medium text-espresso">${p.price}</td>
                  <td className="px-6 py-4 text-sm text-taupe">{p.unit}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => openModal(p)} className="p-2 text-taupe hover:text-gold"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-taupe hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <Input label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          <div><label className="block text-sm font-medium text-espresso mb-1.5">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" rows={3} /></div>
          <Input label="Price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <div><label className="block text-sm font-medium text-espresso mb-1.5">Unit</label>
            <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
              <option value="pcs">Pieces</option><option value="hrs">Hours</option><option value="days">Days</option><option value="units">Units</option>
            </select></div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{editingProduct ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
