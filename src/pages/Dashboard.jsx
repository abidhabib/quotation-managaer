import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useQuotationStore } from '../../store/quotationStore';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const { getDashboardStats, quotations, initialize } = useQuotationStore();
  const stats = getDashboardStats();

  useEffect(() => {
    initialize();
  }, []);

  const statCards = [
    {
      title: 'Total Quotations',
      value: stats.totalQuotations,
      icon: FileText,
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: 'var(--success)',
      bg: 'var(--success-light)',
    },
    {
      title: 'Approved',
      value: stats.approvedQuotations,
      icon: CheckCircle,
      color: 'var(--success)',
      bg: 'var(--success-light)',
    },
    {
      title: 'Pending',
      value: stats.pendingQuotations,
      icon: Clock,
      color: 'var(--warning)',
      bg: 'var(--warning-light)',
    },
  ];

  const recentQuotations = quotations
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your quotation activity</p>
        </div>
        <Link to="/quotations/new">
          <Button variant="primary" size="md">
            <Plus size={18} />
            New Quotation
          </Button>
        </Link>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-stat" padding={false}>
              <div className="stat-card-content">
                <div 
                  className="stat-card-icon"
                  style={{ background: stat.bg, color: stat.color }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <p className="stat-label">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <Card className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Status Distribution</h3>
          </div>
          <div className="status-chart">
            {Object.entries(stats.statusDistribution).map(([status, count]) => {
              const percentage = stats.totalQuotations > 0 
                ? (count / stats.totalQuotations) * 100 
                : 0;
              return (
                <div key={status} className="status-bar-item">
                  <div className="status-bar-label">
                    <span className={`badge badge-${status}`}>{status}</span>
                    <span>{count}</span>
                  </div>
                  <div className="status-bar">
                    <div 
                      className={`status-bar-fill status-bar-${status}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {stats.totalQuotations === 0 && (
              <p className="empty-message">No quotations yet</p>
            )}
          </div>
        </Card>

        <Card className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Quotations</h3>
            <Link to="/quotations" className="view-all-link">View All</Link>
          </div>
          <div className="recent-list">
            {recentQuotations.length > 0 ? (
              recentQuotations.map((quote) => (
                <Link 
                  key={quote.id} 
                  to={`/quotations/${quote.id}`}
                  className="recent-item"
                >
                  <div className="recent-item-info">
                    <p className="recent-item-title">{quote.quotationNumber}</p>
                    <p className="recent-item-subtitle">{quote.customerName}</p>
                  </div>
                  <div className="recent-item-meta">
                    <span className={`badge badge-${quote.status}`}>
                      {quote.status}
                    </span>
                    <span className="recent-item-amount">
                      {formatCurrency(quote.total)}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state-small">
                <FileText size={32} className="empty-icon" />
                <p>No quotations yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="dashboard-card">
        <div className="card-header">
          <h3 className="card-title">Monthly Activity</h3>
        </div>
        <div className="monthly-chart">
          {stats.monthlyData.length > 0 ? (
            <div className="monthly-bars">
              {stats.monthlyData.map((month, index) => {
                const maxValue = Math.max(...stats.monthlyData.map(m => m.count));
                const height = maxValue > 0 ? (month.count / maxValue) * 100 : 0;
                return (
                  <div key={index} className="monthly-bar-container">
                    <div 
                      className="monthly-bar"
                      style={{ height: `${height}%` }}
                    />
                    <span className="monthly-label">{month.month}</span>
                    <span className="monthly-count">{month.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-small">
              <TrendingUp size={32} className="empty-icon" />
              <p>No activity data yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
