import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useQuotationStore } from '../../store/quotationStore';
import { useCustomerStore } from '../../store/customerStore';
import { useProductStore } from '../../store/productStore';
import { useSettingsStore } from '../../store/settingsStore';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { formatCurrency, generateQuotationNumber } from '../../utils/helpers';
import './QuotationCreate.css';

const QuotationCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const duplicateId = searchParams.get('duplicate');

  const { 
    createQuotation, 
    updateQuotation, 
    getQuotationById,
    initialize: initQuotations 
  } = useQuotationStore();
  const { customers, initialize: initCustomers } = useCustomerStore();
  const { products, initialize: initProducts } = useProductStore();
  const { settings, initialize: initSettings } = useSettingsStore();

  const [formData, setFormData] = React.useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    items: [],
    notes: '',
    terms: '',
    validDays: settings.defaultValidityDays || 30,
  });

  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [customerModalOpen, setCustomerModalOpen] = React.useState(false);

  useEffect(() => {
    initQuotations();
    initCustomers();
    initProducts();
    initSettings();
  }, []);

  // Load existing quotation for edit or duplicate
  useEffect(() => {
    if (editId || duplicateId) {
      const id = editId || duplicateId;
      const quotation = getQuotationById(id);
      if (quotation) {
        setFormData({
          customerId: quotation.customerId || '',
          customerName: quotation.customerName,
          customerEmail: quotation.customerEmail || '',
          customerPhone: quotation.customerPhone || '',
          customerAddress: quotation.customerAddress || '',
          items: duplicateId ? quotation.items.map(item => ({
            ...item,
            id: Date.now() + Math.random()
          })) : quotation.items.map(item => ({
            ...item,
            id: item.id || Date.now() + Math.random()
          })),
          notes: quotation.notes || '',
          terms: quotation.terms || settings.defaultTerms || '',
          validDays: quotation.validDays || settings.defaultValidityDays || 30,
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        terms: settings.defaultTerms || '',
        validDays: settings.defaultValidityDays || 30,
      }));
    }
  }, [editId, duplicateId, settings]);

  // Auto-fill customer details when customer is selected
  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find(c => c.id === formData.customerId);
      if (customer) {
        setFormData(prev => ({
          ...prev,
          customerName: customer.name,
          customerEmail: customer.email || '',
          customerPhone: customer.phone || '',
          customerAddress: customer.address || '',
        }));
      }
    }
  }, [formData.customerId, customers]);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      productId: '',
      name: '',
      description: '',
      quantity: 1,
      price: 0,
      discount: 0,
      tax: settings.defaultTax || 0,
      total: 0,
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const updateItem = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value };
          
          // Auto-fill from product
          if (field === 'productId' && value) {
            const product = products.find(p => p.id === value);
            if (product) {
              updated.name = product.name;
              updated.description = product.description || '';
              updated.price = product.price;
              updated.tax = product.tax || settings.defaultTax || 0;
              updated.unit = product.unit || 'unit';
            }
          }
          
          // Calculate item total
          const subtotal = updated.quantity * updated.price;
          const discountAmount = subtotal * (updated.discount / 100);
          const afterDiscount = subtotal - discountAmount;
          const taxAmount = afterDiscount * (updated.tax / 100);
          updated.total = afterDiscount + taxAmount;
          
          return updated;
        }
        return item;
      }),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);

    const discountTotal = formData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.price;
      return sum + (itemSubtotal * (item.discount / 100));
    }, 0);

    const afterDiscount = subtotal - discountTotal;
    const taxTotal = formData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.price;
      const itemDiscount = itemSubtotal * (item.discount / 100);
      const itemAfterDiscount = itemSubtotal - itemDiscount;
      return sum + (itemAfterDiscount * (item.tax / 100));
    }, 0);

    const total = afterDiscount + taxTotal;

    return { subtotal, discountTotal, taxTotal, total };
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      formData.items.forEach((item, index) => {
        if (!item.name.trim()) {
          newErrors[`item_${index}_name`] = 'Item name is required';
        }
        if (item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
        }
        if (item.price < 0) {
          newErrors[`item_${index}_price`] = 'Price cannot be negative';
        }
        if (item.discount < 0 || item.discount > 100) {
          newErrors[`item_${index}_discount`] = 'Discount must be between 0 and 100';
        }
        if (item.tax < 0 || item.tax > 100) {
          newErrors[`item_${index}_tax`] = 'Tax must be between 0 and 100';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status = 'draft') => {
    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const totals = calculateTotals();
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + parseInt(formData.validDays));

      const quotationData = {
        ...formData,
        status,
        validUntil: validUntil.toISOString(),
        validDays: parseInt(formData.validDays),
        ...totals,
        quotationNumber: editId 
          ? getQuotationById(editId)?.quotationNumber 
          : generateQuotationNumber(),
      };

      if (editId) {
        await updateQuotation(editId, quotationData);
      } else {
        await createQuotation(quotationData);
      }

      navigate('/quotations');
    } catch (error) {
      console.error('Error saving quotation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {editId ? 'Edit Quotation' : 'New Quotation'}
          </h1>
          <p className="page-subtitle">
            {editId ? 'Update quotation details' : 'Create a new quotation for your customer'}
          </p>
        </div>
        <div className="header-actions">
          <Button variant="secondary" size="md" onClick={() => navigate('/quotations')}>
            <X size={18} />
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            size="md" 
            onClick={() => handleSubmit('draft')}
            disabled={submitting}
          >
            <Save size={18} />
            Save Draft
          </Button>
          {!editId && (
            <Button 
              variant="primary" 
              size="md" 
              onClick={() => handleSubmit('sent')}
              disabled={submitting}
            >
              Create & Send
            </Button>
          )}
        </div>
      </div>

      <div className="form-grid">
        <Card>
          <h3 className="card-title">Customer Information</h3>
          
          <div className="form-group">
            <label>Select Customer</label>
            <div className="input-with-button">
              <select
                value={formData.customerId}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                className="form-select"
              >
                <option value="">Choose a customer...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/customers')}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Customer Name *</label>
              <Input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter customer name"
                error={errors.customerName}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <Input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="customer@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <Input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="form-group">
              <label>Validity (Days)</label>
              <Input
                type="number"
                value={formData.validDays}
                onChange={(e) => setFormData(prev => ({ ...prev, validDays: e.target.value }))}
                min="1"
                max="365"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <Input
              type="text"
              value={formData.customerAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
              placeholder="Enter customer address"
            />
          </div>
        </Card>

        <Card>
          <h3 className="card-title">Items</h3>
          
          {errors.items && (
            <div className="form-error">{errors.items}</div>
          )}

          <div className="items-editor">
            {formData.items.map((item, index) => (
              <div key={item.id} className="item-row">
                <div className="item-row-header">
                  <span className="item-number">Item {index + 1}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    disabled={formData.items.length === 1}
                  >
                    <Trash2 size={16} className="text-danger" />
                  </Button>
                </div>

                <div className="item-row-grid">
                  <div className="form-group">
                    <label>Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(item.id, 'productId', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select product...</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Item Name *</label>
                    <Input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Enter item name"
                      error={errors[`item_${index}_name`]}
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Description</label>
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="form-group">
                    <label>Quantity *</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      error={errors[`item_${index}_quantity`]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Price *</label>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      error={errors[`item_${index}_price`]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Discount (%)</label>
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      error={errors[`item_${index}_discount`]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Tax (%)</label>
                    <Input
                      type="number"
                      value={item.tax}
                      onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.1"
                      error={errors[`item_${index}_tax`]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Total</label>
                    <div className="item-total">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button 
            variant="secondary" 
            size="md" 
            onClick={addItem}
            className="mt-md"
          >
            <Plus size={18} />
            Add Item
          </Button>
        </Card>

        <Card>
          <h3 className="card-title">Summary</h3>
          
          <div className="summary-section">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discountTotal > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-{formatCurrency(totals.discountTotal)}</span>
              </div>
            )}
            {totals.taxTotal > 0 && (
              <div className="summary-row">
                <span>Tax</span>
                <span>{formatCurrency(totals.taxTotal)}</span>
              </div>
            )}
            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="card-title">Additional Information</h3>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Terms & Conditions</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
              placeholder="Enter terms and conditions..."
              className="form-textarea"
              rows="4"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuotationCreate;
