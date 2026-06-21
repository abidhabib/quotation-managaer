import { useState } from 'react';
import { Plus, Search, FileText, Eye, Download } from 'lucide-react';
import { useQuotationStore } from '../store/quotationStore';
import { useCustomerStore } from '../store/customerStore';
import { formatCurrency, formatDate } from '../utils/helpers';
import Button from '../components/Button';
import Modal from '../components/Modal';

export default function Quotations() {
  const { quotations, addQuotation } = useQuotationStore();
  const { customers } = useCustomerStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '', customerEmail: '', items: [{ name: '', description: '', quantity: 1, price: 0 }]
  });

  const filteredQuotations = searchQuery 
    ? quotations.filter(q => q.quotationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.customerName?.toLowerCase().includes(searchQuery.toLowerCase()))
    : quotations;

  const handleSubmit = (e) => {
    e.preventDefault();
    const subtotal = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    addQuotation({ ...formData, subtotal, grandTotal: subtotal });
    setIsModalOpen(false);
    setFormData({ customerName: '', customerEmail: '', items: [{ name: '', description: '', quantity: 1, price: 0 }] });
  };

  const addItem = () => {
    setFormData({...formData, items: [...formData.items, { name: '', description: '', quantity: 1, price: 0 }]});
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({...formData, items: newItems});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-espresso">Quotations</h1><p className="text-taupe mt-1">Create and manage quotations</p></div>
        <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4 mr-2" />New Quotation</Button>
      </div>

      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe" />
        <input type="text" placeholder="Search quotations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold" /></div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full"><thead className="bg-gray-50"><tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Number</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Customer</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Amount</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase">Date</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-taupe uppercase">Actions</th>
        </tr></thead><tbody className="divide-y divide-gray-100">{filteredQuotations.length === 0 ? (
          <tr><td colSpan={6} className="px-6 py-12 text-center text-taupe">No quotations yet.</td></tr>
        ) : filteredQuotations.map((q) => (<tr key={q.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 text-sm font-medium text-espresso">{q.quotationNumber}</td>
          <td className="px-6 py-4 text-sm text-taupe">{q.customerName}</td>
          <td className="px-6 py-4 text-sm font-medium text-espresso">{formatCurrency(q.grandTotal || 0)}</td>
          <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
            ${q.status==='approved'?'bg-green-100 text-green-800':q.status==='draft'?'bg-gray-100 text-gray-700':q.status==='sent'?'bg-blue-100 text-blue-800':'bg-red-100 text-red-800'}`}>{q.status}</span></td>
          <td className="px-6 py-4 text-sm text-taupe">{formatDate(q.createdAt)}</td>
          <td className="px-6 py-4 text-right"><div className="flex items-center justify-end space-x-2">
            <button className="p-2 text-taupe hover:text-gold"><Eye className="w-4 h-4"/></button>
            <button className="p-2 text-taupe hover:text-gold"><Download className="w-4 h-4"/></button>
          </div></td>
        </tr>))}</tbody></table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Quotation" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-espresso mb-1.5">Customer</label>
              <select value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold">
                <option value="">Select customer</option>
                {customers.map(c => <option key={c.id} value={c.name}>{c.name} ({c.company})</option>)}
              </select></div>
            <Input label="Customer Email" type="email" value={formData.customerEmail} onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} /></div>
          
          <div className="border-t pt-4"><h3 className="text-sm font-medium text-espresso mb-3">Items</h3>
            {formData.items.map((item, idx) => (<div key={idx} className="grid grid-cols-12 gap-2 mb-3 items-start">
              <input placeholder="Item name" value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)}
                className="col-span-4 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)}
                className="col-span-4 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value)||0)}
                className="col-span-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <input type="number" placeholder="Price" value={item.price} onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value)||0)}
                className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <div className="col-span-1 text-right text-sm font-medium text-espresso">${(item.price * item.quantity).toFixed(2)}</div>
            </div>))}
            <Button type="button" variant="ghost" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-1"/>Add Item</Button></div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Quotation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
