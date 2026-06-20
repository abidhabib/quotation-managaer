import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock,
  Send,
  AlertTriangle
} from 'lucide-react';
import { useQuotationStore } from '../../store/quotationStore';
import { useSettingsStore } from '../../store/settingsStore';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './QuotationDetail.css';

const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuotationById, updateQuotationStatus, deleteQuotation, generatePDF } = useQuotationStore();
  const { settings } = useSettingsStore();
  
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState('');
  const quotation = getQuotationById(id);

  if (!quotation) {
    return (
      <div className="page">
        <div className="empty-state">
          <h2>Quotation not found</h2>
          <p>The quotation you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate('/quotations')}>
            Back to Quotations
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (status) => {
    setNewStatus(status);
    setStatusModalOpen(true);
  };

  const confirmStatusChange = () => {
    updateQuotationStatus(quotation.id, newStatus);
    setStatusModalOpen(false);
    setNewStatus('');
  };

  const canEdit = quotation.status === 'draft';
  const canChangeStatus = quotation.status !== 'approved' && quotation.status !== 'expired';

  const statusActions = {
    draft: [
      { label: 'Send Quotation', value: 'sent', icon: Send },
      { label: 'Mark as Approved', value: 'approved', icon: CheckCircle },
      { label: 'Mark as Rejected', value: 'rejected', icon: XCircle },
    ],
    sent: [
      { label: 'Mark as Approved', value: 'approved', icon: CheckCircle },
      { label: 'Mark as Rejected', value: 'rejected', icon: XCircle },
    ],
    approved: [],
    rejected: [
      { label: 'Mark as Draft', value: 'draft', icon: Edit },
    ],
    expired: [
      { label: 'Mark as Draft', value: 'draft', icon: Edit },
    ],
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="header-left">
          <Button variant="ghost" size="sm" onClick={() => navigate('/quotations')}>
            <ArrowLeft size={18} />
            Back
          </Button>
          <div>
            <h1 className="page-title">{quotation.quotationNumber}</h1>
            <p className="page-subtitle">
              Created {formatDate(quotation.createdAt)} • Status: <span className={`badge badge-${quotation.status}`}>{quotation.status}</span>
            </p>
          </div>
        </div>
        <div className="header-actions">
          {canEdit && (
            <Link to={`/quotations/new?edit=${quotation.id}`}>
              <Button variant="secondary" size="md">
                <Edit size={18} />
                Edit
              </Button>
            </Link>
          )}
          <Button 
            variant="secondary" 
            size="md"
            onClick={() => generatePDF(quotation.id)}
          >
            <Printer size={18} />
            Print / PDF
          </Button>
          {canChangeStatus && statusActions[quotation.status]?.length > 0 && (
            <div className="dropdown-container">
              <select
                onChange={(e) => handleStatusChange(e.target.value)}
                value=""
                className="status-select"
              >
                <option value="">Change Status</option>
                {statusActions[quotation.status].map((action) => (
                  <option key={action.value} value={action.value}>
                    {action.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {quotation.status === 'expired' && (
        <Card className="warning-card">
          <AlertTriangle size={20} className="warning-icon" />
          <p>This quotation has expired and is no longer valid.</p>
        </Card>
      )}

      <div className="detail-grid">
        <Card className="detail-card">
          <h3 className="card-title">Customer Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Customer Name</label>
              <p>{quotation.customerName}</p>
            </div>
            {quotation.customerEmail && (
              <div className="info-item">
                <label>Email</label>
                <p>{quotation.customerEmail}</p>
              </div>
            )}
            {quotation.customerPhone && (
              <div className="info-item">
                <label>Phone</label>
                <p>{quotation.customerPhone}</p>
              </div>
            )}
            {quotation.customerAddress && (
              <div className="info-item info-full">
                <label>Address</label>
                <p>{quotation.customerAddress}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="detail-card">
          <h3 className="card-title">Quotation Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Valid Until</label>
              <p>{formatDate(quotation.validUntil)}</p>
            </div>
            <div className="info-item">
              <label>Currency</label>
              <p>{settings.currency || 'USD'}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding={false}>
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Discount</th>
                <th className="text-right">Tax</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td className="description-cell">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{formatCurrency(item.price)}</td>
                  <td className="text-right">{item.discount}%</td>
                  <td className="text-right">{item.tax}%</td>
                  <td className="text-right font-weight-bold">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="totals-section">
          <div className="totals-row">
            <span>Subtotal</span>
            <span>{formatCurrency(quotation.subtotal)}</span>
          </div>
          {quotation.discountTotal > 0 && (
            <div className="totals-row discount">
              <span>Discount</span>
              <span>-{formatCurrency(quotation.discountTotal)}</span>
            </div>
          )}
          {quotation.taxTotal > 0 && (
            <div className="totals-row">
              <span>Tax</span>
              <span>{formatCurrency(quotation.taxTotal)}</span>
            </div>
          )}
          <div className="totals-row grand-total">
            <span>Grand Total</span>
            <span>{formatCurrency(quotation.total)}</span>
          </div>
        </div>
      </Card>

      {quotation.notes && (
        <Card>
          <h3 className="card-title">Notes</h3>
          <p className="notes-content">{quotation.notes}</p>
        </Card>
      )}

      {quotation.terms && (
        <Card>
          <h3 className="card-title">Terms & Conditions</h3>
          <p className="notes-content">{quotation.terms}</p>
        </Card>
      )}

      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Confirm Status Change"
      >
        <div className="modal-content">
          <p>
            Are you sure you want to change the status of <strong>{quotation.quotationNumber}</strong> to{' '}
            <span className={`badge badge-${newStatus}`}>{newStatus}</span>?
          </p>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmStatusChange}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuotationDetail;
