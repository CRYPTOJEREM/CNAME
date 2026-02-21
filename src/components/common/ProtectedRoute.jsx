import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { Gem, Lock, Sparkles, TrendingUp } from 'lucide-react';

const ProtectedRoute = ({ children, requireSubscription = null }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (!isAuthenticated) {
        return (
            <div className="auth-required-overlay">
                <div className="auth-required-modal">
                    <div className="modal-icon"><Lock size={16} /></div>
                    <h2>Authentification Requise</h2>
                    <p>Vous devez être connecté pour accéder à cette page.</p>
                    <div className="auth-buttons">
                        <button
                            onClick={() => window.activeTabSetter('login')}
                            className="btn btn-primary"
                        >
                            <Lock size={14} /> Se connecter
                        </button>
                        <button
                            onClick={() => window.activeTabSetter('register')}
                            className="btn btn-secondary"
                        >
                            <Sparkles size={14} /> Créer un compte
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Vérifier niveau d'abonnement si requis
    if (requireSubscription) {
        const levels = { free: 0, premium: 1, vip: 2 };
        const userLevel = levels[user.subscriptionStatus] || 0;
        const requiredLevel = levels[requireSubscription] || 0;

        if (userLevel < requiredLevel) {
            return (
                <div className="subscription-required-overlay">
                    <div className="subscription-required-modal">
                        <div className="modal-icon"><Gem size={16} /></div>
                        <h2>Abonnement Requis</h2>
                        <p>
                            Cette section nécessite un abonnement{' '}
                            <strong>{requireSubscription.toUpperCase()}</strong>.
                        </p>
                        <p className="current-sub">
                            Votre abonnement actuel : <strong>{user.subscriptionStatus.toUpperCase()}</strong>
                        </p>
                        <button
                            onClick={() => window.activeTabSetter('abonnements')}
                            className="btn btn-primary"
                        >
                            <TrendingUp size={16} /> Voir les Abonnements
                        </button>
                    </div>
                </div>
            );
        }
    }

    return children;
};

export default ProtectedRoute;
