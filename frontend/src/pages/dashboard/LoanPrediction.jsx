import { Link } from 'react-router-dom';
import { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import mlService from '../../services/mlService';
import { Loader2, ArrowLeft } from "lucide-react";

const LoanPrediction = () => {
    const [formData, setFormData] = useState({
        loan_amount: '',
        cibil_score: '',
        income_annum: '',
        loan_term: '',
        no_of_dependents: '',
        education: 'Graduate',
        self_employed: 'No',
        residential_assets_value: '',
        commercial_assets_value: '',
        luxury_assets_value: '',
        bank_asset_value: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Convert numeric fields from string to number
            const payload = {
                ...formData,
                loan_amount: parseFloat(formData.loan_amount),
                cibil_score: parseFloat(formData.cibil_score),
                income_annum: parseFloat(formData.income_annum),
                loan_term: parseFloat(formData.loan_term),
                no_of_dependents: parseFloat(formData.no_of_dependents),
                residential_assets_value: parseFloat(formData.residential_assets_value),
                commercial_assets_value: parseFloat(formData.commercial_assets_value),
                luxury_assets_value: parseFloat(formData.luxury_assets_value),
                bank_asset_value: parseFloat(formData.bank_asset_value),
            };

            const response = await mlService.predictLoanApproval(payload);
            setResult(response);
        } catch (err) {
            setError('Failed to get prediction. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-6">
                <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mb-4">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Loan Approval Predictor</h1>
            </div>

            <Card className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Check Your Approval Chances</h2>
                    <p className="text-gray-500 mt-1">
                        Fill in the details below to see the likelihood of approval based on our advanced ML model.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700">Personal Details</h3>

                            <Input
                                label="Number of Dependents"
                                id="no_of_dependents"
                                name="no_of_dependents"
                                type="number"
                                placeholder="e.g. 2"
                                min="0"
                                value={formData.no_of_dependents}
                                onChange={handleChange}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                                <select
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Graduate">Graduate</option>
                                    <option value="Not Graduate">Not Graduate</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Self Employed</label>
                                <select
                                    name="self_employed"
                                    value={formData.self_employed}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </div>

                            <Input
                                label="Annual Income (₹)"
                                id="income_annum"
                                name="income_annum"
                                type="number"
                                placeholder="e.g. 5000000"
                                value={formData.income_annum}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="CIBIL Score"
                                id="cibil_score"
                                name="cibil_score"
                                type="number"
                                placeholder="e.g. 750"
                                min="300"
                                max="900"
                                value={formData.cibil_score}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Loan & Assets */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700">Loan & Assets</h3>

                            <Input
                                label="Loan Amount (₹)"
                                id="loan_amount"
                                name="loan_amount"
                                type="number"
                                placeholder="e.g. 1000000"
                                value={formData.loan_amount}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Loan Term (Years)"
                                id="loan_term"
                                name="loan_term"
                                type="number"
                                placeholder="e.g. 12"
                                value={formData.loan_term}
                                onChange={handleChange}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Residential Assets (₹)"
                                    id="residential_assets_value"
                                    name="residential_assets_value"
                                    type="number"
                                    placeholder="0"
                                    value={formData.residential_assets_value}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Commercial Assets (₹)"
                                    id="commercial_assets_value"
                                    name="commercial_assets_value"
                                    type="number"
                                    placeholder="0"
                                    value={formData.commercial_assets_value}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Luxury Assets (₹)"
                                    id="luxury_assets_value"
                                    name="luxury_assets_value"
                                    type="number"
                                    placeholder="0"
                                    value={formData.luxury_assets_value}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Bank Assets (₹)"
                                    id="bank_asset_value"
                                    name="bank_asset_value"
                                    type="number"
                                    placeholder="0"
                                    value={formData.bank_asset_value}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-6" disabled={loading}>
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Predicting...
                            </div>
                        ) : (
                            'Predict Approval'
                        )}
                    </Button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {result && (
                    <div className={`mt-6 p-6 rounded-md border text-center ${result.status === 'Approved'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        <h3 className="text-2xl font-bold mb-2">Prediction Result</h3>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="text-lg">
                                Status: <span className="font-bold text-3xl ml-2">{result.status}</span>
                            </div>
                            <div className="text-gray-600">
                                Probability of Approval: <span className="font-semibold text-lg">{(result.probability * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LoanPrediction;
