import { useState, useEffect } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { useQuotationStore } from '../store/quotationStore';
import { formatCurrency } from '../utils/helpers';

export default function Dashboard() {
  const { quotations, loading } = useQuotationStore();
  const [stats, setStats] = useState({
    total: 0,
    totalValue: 0,
    approved: 0,
    pending: 0,
    expired: 0
  });

  useEffect(() => {
    calculateStats();
  }, [quotations]);

  const calculateStats = () => {
    const today = new Date();
    const statsData = quotations.reduce(
      (acc, quote) => {
        acc.total++;
        acc.totalValue += quote.grandTotal || 0;

        if (quote.status === 'approved') acc.approved++;
        if (['draft', 'sent'].includes(quote.status)) acc.pending++;
        
        const expiryDate = new Date(quote.expiryDate);
        if (expiryDate < today && quote.status !== 'approved' && quote.status !== 'rejected') {
          acc.expired++;
        }

        return acc;
      },
      { total: 0, totalValue: 0, approved: 0, pending: 0, expired: 0 }
    );

    setStats(statsData);
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

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Overview of your quotation activity</p>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <span className="stat-label">Total Quotations</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Total Value</span>
            <span className="stat-value">{formatCurrency(stats.totalValue)}</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-label">Approved</span>
            <span className="stat-value">{stats.approved}</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <span className="stat-label">Expired</span>
            <span className="stat-value">{stats.expired}</span>
          </div>
        </Card>
      </div>

      <div className="dashboard-section">
        <h2>Recent Quotations</h2>
        {quotations.length === 0 ? (
          <Card className="empty-state">
            <p>No quotations yet. Create your first quotation to get started.</p>
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
                </tr>
              </thead>
              <tbody>
                {quotations.slice(0, 5).map((quote) => (
                  <tr key={quote.id}>
                    <td className="font-medium">{quote.quoteNumber}</td>
                    <td>{quote.customerName}</td>
                    <td>{new Date(quote.createdAt).toLocaleDateString()}</td>
                    <td>{formatCurrency(quote.grandTotal)}</td>
                    <td>
                      <Badge color={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
