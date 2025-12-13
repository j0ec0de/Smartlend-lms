import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, FileText, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Added import

export default function UserDashboard() {
    const { user } = useAuth(); // Get user
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
            return;
        }
        fetchLoans();
    }, [user, navigate]);

    const fetchLoans = async () => {
        try {
            const { data } = await api.get('/loans/my-loans');
            setLoans(data);
        } catch (error) {
            console.error("Failed to fetch loans", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    // Redirect Admin to Admin Dashboard
    // Although the user object is available from NavbarContext, we can access it via useAuth too if we want to be strict here.
    // Or handle it in RouteGuards.
    // Let's do it here specifically for UserDashboard
    // Wait, UserDashboard uses useAuth via Navbar...
    // Let's import useAuth.

    /*
       We need to import useAuth at top.
       If user.role === 'admin' -> Navigate to /admin.
    */
    if (user && user.role === 'admin') {
        navigate('/admin');
        return null; // Render nothing while redirecting
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
                    <Link to="/apply-loan">
                        <Button className="flex items-center gap-2">
                            <Plus size={18} />
                            Apply for New Loan
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : loans.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No loans found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by applying for a new loan.</p>
                        <div className="mt-6">
                            <Link to="/apply-loan">
                                <Button>Apply Now</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {loans.map((loan) => (
                            <Card key={loan.id} className="hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{loan.type}</h3>
                                        <p className="text-sm text-gray-500">Applied on {formatDate(loan.date)}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        loan.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {loan.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="font-medium">{formatCurrency(loan.amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tenure</span>
                                        <span className="font-medium">{loan.tenure_months} months</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Interest Rate</span>
                                        <span className="font-medium">{loan.interest_rate}%</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link to={`/loan/${loan.id}`} className="flex-1">
                                        <Button variant="secondary" className="w-full text-sm">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
