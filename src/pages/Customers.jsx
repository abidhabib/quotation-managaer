import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Building } from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { formatCurrency } from '../../utils/helpers';
import './Customers.css';

const Customers = () => {
  const { customers, createCustomer, updateCustomer, deleteCustomer, initialize } = useCustomerStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [customerToDelete, setCustomerToDelete] = React.useState(null);
  const [editingCustomer, setEditingCustomer] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = React.useState({});

  useEffect(() => {
    initialize();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        company: customer.company || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        notes: customer.notes || '',
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
      });
    }
    setErrors({});
    setModalOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      createCustomer(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">Manage your customer relationships</p>
        </div>
        <Button variant="primary" size="md" onClick={() => openModal()}>
          <Plus size={18} />
          New Customer
        </Button>
      </div>

      <Card padding={false}>
        <div className="customers-filters">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <Input
              type="text"
              placeholder="Search customers..."
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
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <span className="customer-name">{customer.name}</span>
                    </td>
                    <td>{customer.company || '-'}</td>
                    <td>{customer.email || '-'}</td>
                    <td>{customer.phone || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/quotations?customer=${customer.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openModal(customer)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(customer)}
                        >
                          <Trash2 size={16} className="text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <Building size={48} className="empty-icon" />
                      <h3>No customers found</h3>
                      <p>Add your first customer to get started</p>
                      <Button variant="primary" size="md" onClick={() => openModal()}>
                        <Plus size={18} />
                        New Customer
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
        title={editingCustomer ? 'Edit Customer' : 'New Customer'}
      >
        <div className="modal-form">
          <div className="form-group">
            <label>Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter customer name"
              error={errors.name}
            />
          </div>

          <div className="form-group">
            <label>Company</label>
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Enter company name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="customer@email.com"
                error={errors.email}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <Input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter address"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes..."
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingCustomer ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Customer"
      >
        <div className="modal-content">
          <p>
            Are you sure you want to delete <strong>{customerToDelete?.name}</strong>?
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

export default Customers;
