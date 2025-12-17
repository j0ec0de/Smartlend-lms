import api from './api';

const mlService = {
    predictLoanApproval: async (data) => {
        const response = await api.post('/ml/predict', data);
        return response.data;
    },
};

export default mlService;
