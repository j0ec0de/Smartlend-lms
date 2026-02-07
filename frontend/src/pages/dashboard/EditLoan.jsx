import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

export default function EditLoan() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        fetchLoanDetails();
    }, [id]);

    const fetchLoanDetails = async () => {
        try {
            // Ideally we should have a get-single-loan endpoint for owner.
            // But reuse existing or filter from list? or Admin endpoint?
            // Wait, we don't have get-single-loan for user in the routes I saw!
            // I only saw get_my_loans.
            // I can fetch all and find one, or add get_loan endpoint.
            // Adding get_loan endpoint is better.

            // For now, let's try assuming /loan/:id might exist or I should add it.
            // Admin has /admin/loan/:id (AdminLoanDetails).
            // User has LoanDetails page which uses /loan/:id...

            // ONE MOMENT! frontend/src/pages/dashboard/LoanDetails.jsx implies there IS a way to get details?
            // Let's check LoanDetails.jsx to see what API it calls.

            const { data } = await api.get('/loans/my-loans');
            const loan = data.find(l => l.id === parseInt(id));

            if (!loan) {
                setServerError('Loan not found');
                setIsLoading(false);
                return;
            }

            if (loan.status !== 'Pending' && loan.status !== 'pending') {
                setServerError('Cannot edit a loan that is not pending');
                // Maybe redirect after a timeout?
            }

            // Populate form
            reset({
                loan_type: loan.type,
                amount: loan.amount,
                tenure_months: loan.tenure_months,
                interest_rate: loan.interest_rate,
                monthly_salary: loan.monthly_salary,
                credit_history: loan.credit_history
            });
            setIsLoading(false);

        } catch (error) {
            console.error("Failed to fetch loan", error);
            setServerError("Failed to load loan details.");
            setIsLoading(false);
        }
    };

    // WAIT. I need to check backend get_my_loans again.
    // It returns: id, amount, status, type, tenure_months, interest_rate, date, documents, ai_analysis.
    // IT DOES NOT RETURN monthly_salary OR credit_history.
    // So I cannot pre-fill those fields unless I update the backend.

    // I MUST UPDATE THE BACKEND FIRST to return full details.

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setServerError('');
        try {
            const payload = {
                ...data,
                amount: parseFloat(data.amount),
                tenure_months: parseInt(data.tenure_months),
                interest_rate: parseFloat(data.interest_rate),
                monthly_salary: parseFloat(data.monthly_salary),
                credit_history: parseFloat(data.credit_history)
            };
            await api.put(`/loans/${id}`, payload);
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.data?.error) {
                setServerError(error.response.data.error);
            } else if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('Failed to update application. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                        &larr; Back to Dashboard
                    </Button>
                </div>

                <Card>
                    <div className="mb-6 border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Loan Application</h1>
                        <p className="text-gray-500 mt-1">Update your loan details.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Same fields as ApplyLoan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                                <select
                                    {...register('loan_type', { required: 'Loan Type is required' })}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select Type</option>
                                    <option value="Personal Loan">Personal Loan</option>
                                    <option value="Home Loan">Home Loan</option>
                                    <option value="Car Loan">Car Loan</option>
                                    <option value="Education Loan">Education Loan</option>
                                </select>
                                {errors.loan_type && <p className="mt-1 text-sm text-red-600">{errors.loan_type.message}</p>}
                            </div>

                            <Input
                                label="Loan Amount (₹)"
                                type="number"
                                step="1000"
                                {...register('amount', { required: 'Amount is required', min: { value: 1000, message: 'Minimum amount is 1000' } })}
                                error={errors.amount?.message}
                            />

                            <Input
                                label="Tenure (Months)"
                                type="number"
                                {...register('tenure_months', { required: 'Tenure is required', min: { value: 1, message: 'Minimum tenure is 1 month' } })}
                                error={errors.tenure_months?.message}
                            />

                            <Input
                                label="Interest Rate (%)"
                                type="number"
                                step="0.1"
                                {...register('interest_rate', { required: 'Interest Rate is required' })}
                                error={errors.interest_rate?.message}
                            />

                            <Input
                                label="Monthly Salary (₹)"
                                type="number"
                                {...register('monthly_salary', { required: 'Salary is required' })}
                                error={errors.monthly_salary?.message}
                            />

                            <Input
                                label="Credit Score"
                                type="number"
                                placeholder="e.g. 750"
                                {...register('credit_history', { required: 'Credit Score is required' })}
                                error={errors.credit_history?.message}
                            />
                        </div>

                        {serverError && (
                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                {serverError}
                            </div>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button type="button" variant="secondary" className="mr-3" onClick={() => navigate('/dashboard')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Application'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
