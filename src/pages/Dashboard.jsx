import { 
  FileText, CheckCircle, Clock, AlertCircle, DollarSign, TrendingUp 
} from 'lucide-react';
import { useQuotationStore } from '../store/quotationStore';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const quotations = useQuotationStore((state) => state.quotations);

  const stats = [
    {
      name: 'Total Quotations',
      value: quotations.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Total Value',
      value: formatCurrency(
        quotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0)
      ),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Approved',
      value: quotations.filter((q) => q.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Pending',
      value: quotations.filter((q) => q.status === 'sent').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const recentQuotations = [...quotations]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/quotations/new" className="btn-primary">
          New Quotation
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Quotations */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Quotations</h2>
        {recentQuotations.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No quotations yet</p>
            <Link to="/quotations/new" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
              Create your first quotation
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Quote #</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotations.map((quote) => (
                  <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-primary-600">
                      <Link to={`/quotations/${quote.id}`}>{quote.quoteNumber}</Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{quote.customerName}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {formatCurrency(quote.grandTotal)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[quote.status]}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(quote.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
