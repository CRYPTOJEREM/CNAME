import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Vérifier authentification au montage
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Erreur vérification auth:', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { accessToken, refreshToken, user: userData } = await authService.login(email, password);
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    };

    const register = async (userData) => {
        try {
            await authService.register(userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || error.message
            };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Erreur logout:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans AuthProvider');
    }
    return context;
};
