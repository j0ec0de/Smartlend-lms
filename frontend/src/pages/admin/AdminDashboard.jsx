import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function AdminDashboard() {
    const [loans, setLoans] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [loansParams, statsParams] = await Promise.all([
                api.get('/admin/loans'),
                api.get('/admin/dashboard/stats')
            ]);
            setLoans(loansParams.data);
            setStats(statsParams.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <Button onClick={fetchDashboardData} variant="outline" size="sm">
                        Refresh
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="space-y-6">
                        {/* Stats Overview */}
                        {stats && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6">
                                    <div className="text-sm font-medium text-gray-500">Total Loans</div>
                                    <div className="mt-2 text-3xl font-bold text-gray-900">{stats.overview.total_loans}</div>
                                </Card>
                                <Card className="p-6">
                                    <div className="text-sm font-medium text-gray-500">AI Predictions</div>
                                    <div className="mt-2 text-3xl font-bold text-indigo-600">{stats.overview.total_ml_predictions}</div>
                                    <div className="text-xs text-indigo-400 mt-1">
                                        {stats.overview.ml_approval_rate}% Approval Rate
                                    </div>
                                </Card>
                                <Card className="p-6">
                                    <div className="text-sm font-medium text-gray-500">ML Confidence</div>
                                    <div className="mt-2 space-y-2">
                                        {Object.entries(stats.confidence_distribution).map(([label, count]) => {
                                            const total = stats.overview.total_ml_predictions || 1;
                                            const pct = (count / total) * 100;
                                            return (
                                                <div key={label} className="text-xs">
                                                    <div className="flex justify-between mb-1">
                                                        <span>{label}</span>
                                                        <span>{count}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-indigo-600 h-1.5 rounded-full"
                                                            style={{ width: `${pct}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </div>
                        )}

                        <h2 className="text-lg font-medium text-gray-900">Loan Applications</h2>

                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loans.map((loan) => (
                                            <tr key={loan.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{loan.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loan.user_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loan.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(loan.amount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {tryFormatDate(loan.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loan.risk_score}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                        loan.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {loan.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link to={`/admin/loan/${loan.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                        Review
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {loans.length === 0 && (
                                    <div className="text-center py-6 text-gray-500">No loans found.</div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

function tryFormatDate(dateStr) {
    try {
        return formatDate(dateStr);
    } catch (e) {
        return dateStr;
    }
}
