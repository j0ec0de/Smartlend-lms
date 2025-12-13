import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

export default function ApplyLoan() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    // Watch values for live calculation (if needed simpler for now)
    const amount = watch('amount');
    const tenure = watch('tenure_months');

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setServerError('');
        try {
            // Prepare payload (convert types if necessary)
            const payload = {
                ...data,
                amount: parseFloat(data.amount),
                tenure_months: parseInt(data.tenure_months),
                interest_rate: parseFloat(data.interest_rate),
                monthly_salary: parseFloat(data.monthly_salary),
                credit_history: parseFloat(data.credit_history)
            };
            await api.post('/loans/apply', payload);
            navigate('/');
        } catch (error) {
            if (error.response?.data?.message) {
                setServerError(error.response.data.message);
            } else {
                setServerError('Failed to submit application. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        &larr; Back to Dashboard
                    </Button>
                </div>

                <Card>
                    <div className="mb-6 border-b pb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Apply for a Loan</h1>
                        <p className="text-gray-500 mt-1">Fill in the details below to request a new loan.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                            <Button type="button" variant="secondary" className="mr-3" onClick={() => navigate('/')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
