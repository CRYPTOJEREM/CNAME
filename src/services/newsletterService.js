import api from './api';

const newsletterService = {
    subscribe: async (email, source = 'unknown') => {
        const response = await api.post('/newsletter/subscribe', { email, source });
        return response.data;
    },

    unsubscribe: async (email) => {
        const response = await api.post('/newsletter/unsubscribe', { email });
        return response.data;
    }
};

export default newsletterService;
