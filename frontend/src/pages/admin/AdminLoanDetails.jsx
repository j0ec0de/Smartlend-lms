import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

export default function AdminLoanDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchLoanDetails();
    }, [id]);

    const fetchLoanDetails = async () => {
        try {
            // Admin should ideally have a single loan endpoint, but for now we filter from all loans or assume /admin/loans/{id} exists?
            // Checking backend routes... admin_routes.py has NO single loan view. Only list all.
            // We must fetch all and filter. Not scalable but fits current backend.
            const { data } = await api.get('/admin/loans');
            const found = data.find(l => l.id === parseInt(id));
            if (found) {
                setLoan(found);
                // Note: Admin list endpoint doesn't return documents currently in `output` of `get_all_loans`
                // It returns risk_score string. 
                // We might need to add documents to admin list response or create a new endpoint. 
                // Let's check admin_controller.py again. 
                // It returns: id, user_id, amount, type, status, risk_score, date.
                // NO DOCUMENTS.
                // So Admin cannot view documents with current backend unless we modify `get_all_loans` or add `get_loan_details`.
                // Given I modified `get_my_loans` for users, I should probably modify `get_all_loans` too to include docs.
            }
        } catch (error) {
            console.error("Error fetching loan", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to ${newStatus} this loan?`)) return;
        setProcessing(true);
        try {
            await api.put(`/admin/loan/${id}/status`, { status: newStatus });
            alert(`Loan ${newStatus} successfully.`);
            navigate('/admin');
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update status");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!loan) return <div className="text-center py-12">Loan not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
                    &larr; Back to Dashboard
                </Button>

                <Card>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Loan Application #{loan.id}</h1>
                            <p className="text-sm text-gray-500">Applicant User ID: {loan.user_id}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${loan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                loan.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                            }`}>
                            {loan.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <span className="text-gray-500 text-sm">Amount</span>
                            <p className="text-xl font-bold">{formatCurrency(loan.amount)}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Loan Type</span>
                            <p className="text-lg font-medium">{loan.type}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Risk Score Info</span>
                            <p className="text-sm">{loan.risk_score}</p>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm">Date Applied</span>
                            <p className="text-sm">{tryFormatDate(loan.date)}</p>
                        </div>
                    </div>

                    {/* Documents Section - Hidden if no data */}
                    {loan.documents && (
                        <div className="mb-8 border-t pt-6">
                            <h3 className="text-lg font-bold mb-4">Documents</h3>
                            <div className="space-y-2">
                                {loan.documents.length > 0 ? (
                                    loan.documents.map(doc => (
                                        <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <span>{doc.name}</span>
                                            <Button
                                                variant="secondary"
                                                className="text-xs"
                                                onClick={async () => {
                                                    try {
                                                        const response = await api.get(`/documents/view/${doc.id}`, {
                                                            responseType: 'blob'
                                                        });
                                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                                        window.open(url, '_blank');
                                                    } catch (e) {
                                                        console.error(e);
                                                        alert("Failed to view document");
                                                    }
                                                }}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No documents found.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 border-t pt-6">
                        {loan.status === 'Pending' && (
                            <>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => updateStatus('Approved')}
                                    disabled={processing}
                                >
                                    <CheckCircle className="inline w-4 h-4 mr-2" />
                                    Approve Loan
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => updateStatus('Rejected')}
                                    disabled={processing}
                                >
                                    <XCircle className="inline w-4 h-4 mr-2" />
                                    Reject Loan
                                </Button>
                            </>
                        )}
                    </div>
                </Card>
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
