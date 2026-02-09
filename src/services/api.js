import axios from 'axios';

// Utilise la variable d'environnement pour l'URL de l'API
// En développement: http://localhost:3001
// En production: URL du backend Render
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// DEBUG: Afficher l'URL utilisée dans la console
console.log('🔧 API_URL configurée:', API_URL);
console.log('🔧 VITE_API_URL depuis env:', import.meta.env.VITE_API_URL);

// Instance Axios avec configuration
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Intercepteur de requête - ajouter JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponse - gérer refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Ne pas intercepter les routes d'auth (login, register, refresh)
        const isAuthRoute = originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/register') ||
            originalRequest.url?.includes('/auth/refresh');

        // Si 401 et pas déjà retryé et pas une route d'auth, tenter refresh
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
            originalRequest._retry = true;

            try {
                const storedRefreshToken = localStorage.getItem('refreshToken');
                if (!storedRefreshToken) {
                    localStorage.removeItem('accessToken');
                    return Promise.reject(error);
                }
                const { data } = await axios.post(
                    `${API_URL}/auth/refresh`,
                    { refreshToken: storedRefreshToken }
                );
                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
