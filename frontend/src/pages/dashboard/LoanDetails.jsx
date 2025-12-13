import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Upload, FileText, CheckCircle, Clock, Percent } from 'lucide-react';

export default function LoanDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchLoanDetails();
    }, [id]);

    const fetchLoanDetails = async () => {
        try {
            // 1. Fetch Loan Details - we might need to filter from my-loans if there's no direct single loan endpoint for user
            // or we can assume there is one or use list and find. 
            // Checking routes... loan_routes.py has /apply and /my-loans. No /:id.
            // Admin has /loans (all). 
            // SO: We must fetch all my-loans and find the one with matching ID. 
            const { data } = await api.get('/loans/my-loans');
            const foundLoan = data.find(l => l.id === parseInt(id));

            if (foundLoan) {
                setLoan(foundLoan);
                // 2. Fetch Repayment Schedule if approved
                if (foundLoan.status === 'Approved') {
                    const repResponse = await api.get(`/repayments/${id}`);
                    setSchedule(repResponse.data);
                }
            } else {
                // handle not found
            }
        } catch (error) {
            console.error("Error fetching loan details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post(`/documents/upload/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Refresh details to show uploaded doc if API returns it, or just show success
            alert('Document uploaded successfully!');
            setFile(null);
            // Ideally fetch loan again to update documents list if it was included in loan object
            fetchLoanDetails();
        } catch (error) {
            console.error(error);
            setUploadError('Failed to upload document.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!loan) return <div className="text-center py-12">Loan not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
                    &larr; Back to Dashboard
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Loan Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{loan.loan_type}</h2>
                                    <p className="text-sm text-gray-500">ID: #{loan.id}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${loan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {loan.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Amount</span>
                                    <p className="text-xl font-bold text-gray-900">{formatCurrency(loan.amount)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Monthly EMI</span>
                                    <p className="text-xl font-bold text-indigo-600">
                                        {schedule.length > 0 ? formatCurrency(schedule[0].amount) : 'N/A'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Interest Rate</span>
                                    <p className="text-lg font-semibold">{loan.interest_rate}%</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-500 text-sm">Tenure</span>
                                    <p className="text-lg font-semibold">{loan.tenure_months} Months</p>
                                </div>
                            </div>
                        </Card>

                        {/* Repayment Schedule */}
                        {loan.status === 'Approved' && schedule.length > 0 && (
                            <Card>
                                <h3 className="text-lg font-bold mb-4">Repayment Schedule</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {schedule.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(item.date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(item.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right Column: Actions & Documents */}
                    <div className="space-y-6">
                        {/* Upload Documents */}
                        <Card>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Upload size={20} /> Upload Documents
                            </h3>
                            <form onSubmit={handleUpload}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Document (PDF/Image)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                </div>
                                {uploadError && <p className="text-xs text-red-600 mb-2">{uploadError}</p>}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!file || uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </Button>
                            </form>
                        </Card>

                        {/* Uploaded Documents List could go here if the API returned it in loan details */}
                        <Card>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText size={20} /> Uploaded Documents
                            </h3>
                            <div className="space-y-3">
                                {loan.documents && loan.documents.length > 0 ? (
                                    loan.documents.map((doc) => (
                                        <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 rounded text-sm">
                                            <span className="truncate max-w-[150px] text-gray-700" title={doc.name}>{doc.name}</span>
                                            <Button
                                                variant="secondary"
                                                className="text-xs px-2 py-1"
                                                onClick={async () => {
                                                    try {
                                                        const response = await api.get(`/documents/my-view/${doc.id}`, {
                                                            responseType: 'blob'
                                                        });
                                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                                        const link = document.createElement('a');
                                                        link.href = url;
                                                        link.setAttribute('target', '_blank'); // Open in new tab
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        link.remove();
                                                    } catch (e) {
                                                        console.error("View failed", e);
                                                        alert("Failed to view document");
                                                    }
                                                }}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No documents uploaded yet.</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
