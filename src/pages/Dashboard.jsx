import { 
  FileText, CheckCircle, Clock, AlertCircle, TrendingUp, DollarSign 
} from 'lucide-react';
import { useQuotationStore } from '../store/quotationStore';
import { formatCurrency, formatDate } from '../utils/helpers';

const statsCards = [
  { title: 'Total Quotations', icon: FileText, key: 'total', color: 'bg-espresso' },
  { title: 'Total Value', icon: DollarSign, key: 'value', color: 'bg-gold', isCurrency: true },
  { title: 'Approved', icon: CheckCircle, key: 'approved', color: 'bg-green-600' },
  { title: 'Pending', icon: Clock, key: 'pending', color: 'bg-blue-500' },
];

export default function Dashboard() {
  const { quotations } = useQuotationStore();

  const stats = {
    total: quotations.length,
    value: quotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0),
    approved: quotations.filter(q => q.status === 'approved').length,
    pending: quotations.filter(q => ['draft', 'sent'].includes(q.status)).length,
  };

  const recentQuotations = quotations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-espresso">Dashboard</h1>
        <p className="text-taupe mt-1">Overview of your quotation activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div 
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-taupe">{stat.title}</p>
                <p className="text-2xl font-bold text-espresso mt-1">
                  {stat.isCurrency 
                    ? formatCurrency(stats[stat.key])
                    : stats[stat.key]
                  }
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Quotations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-espresso">Recent Quotations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-taupe uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentQuotations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-taupe">
                    No quotations yet. Create your first quotation to get started.
                  </td>
                </tr>
              ) : (
                recentQuotations.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-espresso">
                      {q.quotationNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-taupe">
                      {q.customerName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-espresso">
                      {formatCurrency(q.grandTotal || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${q.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                        ${q.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
                        ${q.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
                        ${q.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                        ${q.status === 'expired' ? 'bg-orange-100 text-orange-800' : ''}
                      `}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-taupe">
                      {formatDate(q.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
