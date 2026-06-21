import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useQuotationStore } from '../store/quotationStore';
import { useCustomerStore } from '../store/customerStore';
import { useProductStore } from '../store/productStore';
import { formatCurrency, generateQuoteNumber } from '../utils/helpers';

export default function Quotations() {
  const { quotations, addQuotation, updateQuotation, deleteQuotation, loading } = useQuotationStore();
  const { customers } = useCustomerStore();
  const { products } = useProductStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [viewingQuote, setViewingQuote] = useState(null);
  
  const [formData, setFormData] = useState({
    customerId: '',
    items: [],
    discount: 0,
    taxRate: 0,
    notes: '',
    terms: '',
    validityDays: 30
  });

  const filteredQuotations = quotations.filter((quote) => {
    const matchesSearch = 
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (quote = null) => {
    if (quote) {
      setEditingQuote(quote);
      setFormData({
        customerId: quote.customerId,
        items: quote.items || [],
        discount: quote.discount || 0,
        taxRate: quote.taxRate || 0,
        notes: quote.notes || '',
        terms: quote.terms || '',
        validityDays: quote.validityDays || 30
      });
    } else {
      setEditingQuote(null);
      setFormData({
        customerId: '',
        items: [{ id: Date.now(), productId: '', description: '', quantity: 1, price: 0, discount: 0, tax: 0 }],
        discount: 0,
        taxRate: 0,
        notes: '',
        terms: '',
        validityDays: 30
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuote(null);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: Date.now(), productId: '', description: '', quantity: 1, price: 0, discount: 0, tax: 0 }]
    });
  };

  const removeItem = (itemId) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter(item => item.id !== itemId)
      });
    }
  };

  const updateItem = (itemId, field, value) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        
        // Auto-fill from product
        if (field === 'productId' && value) {
          const product = products.find(p => p.id === value);
          if (product) {
            updated.description = product.description;
            updated.price = product.price;
            updated.tax = product.tax;
          }
        }
        
        return updated;
      }
      return item;
    });
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      const itemTotal = (item.price * item.quantity) - (item.discount || 0);
      return sum + itemTotal;
    }, 0);

    const discountTotal = parseFloat(formData.discount) || 0;
    const afterDiscount = subtotal - discountTotal;
    const taxTotal = (afterDiscount * (parseFloat(formData.taxRate) || 0)) / 100;
    const grandTotal = afterDiscount + taxTotal;

    return { subtotal, discountTotal, taxTotal, grandTotal };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId) {
      alert('Please select a customer');
      return;
    }

    if (formData.items.length === 0 || formData.items.every(item => !item.productId && !item.description)) {
      alert('Please add at least one item');
      return;
    }

    const totals = calculateTotals();
    const customer = customers.find(c => c.id === formData.customerId);

    const quoteData = {
      ...formData,
      customerId: formData.customerId,
      customerName: customer?.name || '',
      customerEmail: customer?.email || '',
      customerAddress: customer?.address || '',
      items: formData.items.filter(item => item.productId || item.description),
      ...totals,
      status: editingQuote?.status || 'draft',
      quoteNumber: editingQuote?.quoteNumber || generateQuoteNumber(),
      expiryDate: new Date(Date.now() + (formData.validityDays * 24 * 60 * 60 * 1000)).toISOString()
    };

    try {
      if (editingQuote) {
        await updateQuotation(editingQuote.id, quoteData);
      } else {
        await addQuotation(quoteData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving quotation:', error);
    }
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      await updateQuotation(quoteId, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await deleteQuotation(id);
      } catch (error) {
        console.error('Error deleting quotation:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'gray',
      sent: 'blue',
      approved: 'green',
      rejected: 'red',
      expired: 'orange'
    };
    return colors[status] || 'gray';
  };

  const canEditStatus = (status) => {
    return status !== 'approved' && status !== 'rejected';
  };

  const totals = calculateTotals();

  if (loading) {
    return <div className="loading-state">Loading quotations...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Quotations</h1>
          <p className="subtitle">Create and manage your quotations</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ New Quotation</Button>
      </div>

      <Card className="filters-card">
        <div className="filters-row">
          <Input
            type="text"
            placeholder="Search quotations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="🔍"
            style={{ flex: 1 }}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </Card>

      {filteredQuotations.length === 0 ? (
        <Card className="empty-state">
          <p>{searchTerm || statusFilter !== 'all' ? 'No quotations found matching your filters.' : 'No quotations yet. Create your first quotation to get started.'}</p>
        </Card>
      ) : (
        <Card className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.map((quote) => (
                <tr key={quote.id}>
                  <td className="font-medium">{quote.quoteNumber}</td>
                  <td>{quote.customerName}</td>
                  <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                  <td>{formatCurrency(quote.grandTotal)}</td>
                  <td>
                    <Badge color={getStatusColor(quote.status)}>{quote.status}</Badge>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Button variant="secondary" size="small" onClick={() => setViewingQuote(quote)}>
                        View
                      </Button>
                      {quote.status === 'draft' && (
                        <Button variant="secondary" size="small" onClick={() => handleOpenModal(quote)}>
                          Edit
                        </Button>
                      )}
                      <Button variant="danger" size="small" onClick={() => handleDelete(quote.id)}>
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingQuote ? `Edit ${editingQuote.quoteNumber}` : 'New Quotation'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="modal-form quotation-form">
          <div className="form-group">
            <label>Customer *</label>
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name} ({customer.company})</option>
              ))}
            </select>
          </div>

          <div className="items-section">
            <h3>Items</h3>
            {formData.items.map((item, index) => (
              <div key={item.id} className="item-row">
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(item.id, 'productId', e.target.value)}
                  className="item-select"
                >
                  <option value="">Select Product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="item-input"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  className="item-input small"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="item-input"
                />
                <input
                  type="number"
                  placeholder="Disc"
                  value={item.discount || ''}
                  onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="item-input small"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                  disabled={formData.items.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addItem} size="small">
              + Add Item
            </Button>
          </div>

          <div className="totals-section">
            <div className="totals-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="totals-row">
              <span>Discount:</span>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                step="0.01"
                min="0"
                style={{ width: '100px' }}
              />
            </div>
            <div className="totals-row">
              <span>Tax Rate (%):</span>
              <Input
                type="number"
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                step="0.1"
                min="0"
                max="100"
                style={{ width: '100px' }}
              />
            </div>
            <div className="totals-row total">
              <span>Grand Total:</span>
              <span>{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>

          <div className="form-row">
            <Input
              type="number"
              label="Validity (days)"
              value={formData.validityDays}
              onChange={(e) => setFormData({ ...formData, validityDays: parseInt(e.target.value) || 30 })}
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="2"
              placeholder="Additional notes..."
            />
          </div>

          <div className="form-group">
            <label>Terms & Conditions</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              rows="2"
              placeholder="Payment terms, delivery, etc."
            />
          </div>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {editingQuote ? 'Update' : 'Create'} Quotation
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      {viewingQuote && (
        <Modal
          isOpen={!!viewingQuote}
          onClose={() => setViewingQuote(null)}
          title={`Quotation ${viewingQuote.quoteNumber}`}
          size="large"
        >
          <div className="quotation-view">
            <div className="quote-header">
              <div>
                <h3>{viewingQuote.customerName}</h3>
                <p>{viewingQuote.customerEmail}</p>
                <p>{viewingQuote.customerAddress}</p>
              </div>
              <div className="quote-meta">
                <p><strong>Status:</strong> <Badge color={getStatusColor(viewingQuote.status)}>{viewingQuote.status}</Badge></p>
                <p><strong>Date:</strong> {new Date(viewingQuote.createdAt).toLocaleDateString()}</p>
                <p><strong>Valid Until:</strong> {new Date(viewingQuote.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>

            <table className="quote-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {viewingQuote.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.productId || 'Custom'}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency((item.price * item.quantity) - (item.discount || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="quote-totals">
              <div className="totals-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(viewingQuote.subtotal)}</span>
              </div>
              {viewingQuote.discount > 0 && (
                <div className="totals-row">
                  <span>Discount:</span>
                  <span>-{formatCurrency(viewingQuote.discount)}</span>
                </div>
              )}
              {viewingQuote.taxTotal > 0 && (
                <div className="totals-row">
                  <span>Tax:</span>
                  <span>{formatCurrency(viewingQuote.taxTotal)}</span>
                </div>
              )}
              <div className="totals-row total">
                <span>Grand Total:</span>
                <span>{formatCurrency(viewingQuote.grandTotal)}</span>
              </div>
            </div>

            {viewingQuote.notes && (
              <div className="quote-section">
                <h4>Notes</h4>
                <p>{viewingQuote.notes}</p>
              </div>
            )}

            {viewingQuote.terms && (
              <div className="quote-section">
                <h4>Terms & Conditions</h4>
                <p>{viewingQuote.terms}</p>
              </div>
            )}

            {canEditStatus(viewingQuote.status) && (
              <div className="quote-actions">
                <Button variant="secondary" onClick={() => handleStatusChange(viewingQuote.id, 'sent')}>
                  Mark as Sent
                </Button>
                <Button variant="success" onClick={() => handleStatusChange(viewingQuote.id, 'approved')}>
                  Approve
                </Button>
                <Button variant="danger" onClick={() => handleStatusChange(viewingQuote.id, 'rejected')}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
