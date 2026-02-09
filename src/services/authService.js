import api from './api';

/**
 * Service d'authentification
 */
export const authService = {
    /**
     * Inscription utilisateur
     */
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Connexion utilisateur
     */
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    /**
     * Déconnexion utilisateur
     */
    async logout() {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/auth/logout', { refreshToken });
        return response.data;
    },

    /**
     * Rafraîchir le access token
     */
    async refreshToken() {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    /**
     * Vérifier l'email avec le token
     */
    async verifyEmail(token) {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        return response.data;
    },

    /**
     * Renvoyer l'email de vérification
     */
    async resendVerification(email) {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    },

    /**
     * Récupérer les informations de l'utilisateur connecté
     */
    async getCurrentUser() {
        const response = await api.get('/auth/me');
        return response.data.user;
    }
};
