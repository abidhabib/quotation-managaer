import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye, Copy } from 'lucide-react';
import { useQuotationStore } from '../../store/quotationStore';
import { useCustomerStore } from '../../store/customerStore';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './Quotations.css';

const Quotations = () => {
  const { quotations, deleteQuotation, initialize } = useQuotationStore();
  const { customers } = useCustomerStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('');
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [quotationToDelete, setQuotationToDelete] = React.useState(null);

  React.useEffect(() => {
    initialize();
  }, []);

  const filteredQuotations = quotations.filter((quote) => {
    const matchesSearch = 
      quote.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (quote) => {
    setQuotationToDelete(quote);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (quotationToDelete) {
      deleteQuotation(quotationToDelete.id);
      setDeleteModalOpen(false);
      setQuotationToDelete(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    return `badge badge-${status.toLowerCase()}`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quotations</h1>
          <p className="page-subtitle">Manage and track all your quotations</p>
        </div>
        <Link to="/quotations/new">
          <Button variant="primary" size="md">
            <Plus size={18} />
            New Quotation
          </Button>
        </Link>
      </div>

      <Card padding={false}>
        <div className="quotations-filters">
          <div className="filter-group">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <Input
                type="text"
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quotation #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((quote) => (
                  <tr key={quote.id}>
                    <td>
                      <Link to={`/quotations/${quote.id}`} className="quote-link">
                        {quote.quotationNumber}
                      </Link>
                    </td>
                    <td>{quote.customerName}</td>
                    <td>{formatDate(quote.createdAt)}</td>
                    <td>{formatCurrency(quote.total)}</td>
                    <td>
                      <span className={getStatusBadgeClass(quote.status)}>
                        {quote.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/quotations/${quote.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        {quote.status === 'draft' && (
                          <Link to={`/quotations/new?duplicate=${quote.id}`}>
                            <Button variant="ghost" size="sm">
                              <Copy size={16} />
                            </Button>
                          </Link>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(quote)}
                        >
                          <Trash2 size={16} className="text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <FileText size={48} className="empty-icon" />
                      <h3>No quotations found</h3>
                      <p>Create your first quotation to get started</p>
                      <Link to="/quotations/new">
                        <Button variant="primary" size="md">
                          <Plus size={18} />
                          New Quotation
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Quotation"
      >
        <div className="modal-content">
          <p>
            Are you sure you want to delete quotation <strong>{quotationToDelete?.quotationNumber}</strong>?
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

export default Quotations;
