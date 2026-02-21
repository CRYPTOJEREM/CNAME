/**
 * SubscriptionStatus - Widget affichant le statut de l'abonnement
 * Affiche le niveau, la date d'expiration, et propose l'upgrade
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import memberService from '../../services/memberService';
import { CheckCircle2, Gem, Sparkles, Star } from 'lucide-react';

const SubscriptionStatus = ({ setActiveTab }) => {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubscription();
    }, []);

    const loadSubscription = async () => {
        try {
            const response = await memberService.getSubscription();
            setSubscription(response.subscription);
        } catch (error) {
            console.error('Erreur chargement abonnement:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLevelInfo = (level) => {
        const levels = {
            free: {
                icon: '🆓',
                text: 'FREE',
                color: '#6c757d',
                description: 'Accès au contenu gratuit'
            },
            premium: {
                icon: <Star size={14} />,
                text: 'PREMIUM',
                color: '#7B2FF7',
                description: 'Accès au contenu Premium'
            },
            vip: {
                icon: <Gem size={14} />,
                text: 'VIP',
                color: '#00D9FF',
                description: 'Accès complet à tout le contenu'
            }
        };
        return levels[level] || levels.free;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="dashboard-card subscription-status-card">
                <div className="loading-skeleton">Chargement...</div>
            </div>
        );
    }

    const levelInfo = getLevelInfo(user.subscriptionStatus);
    const canUpgrade = user.subscriptionStatus === 'free' || user.subscriptionStatus === 'premium';

    return (
        <div className="dashboard-card subscription-status-card">
            <div className="subscription-header">
                <div className="subscription-icon" style={{ backgroundColor: levelInfo.color }}>
                    {levelInfo.icon}
                </div>
                <div className="subscription-info">
                    <h3>Mon Abonnement</h3>
                    <p className="subscription-level" style={{ color: levelInfo.color }}>
                        {levelInfo.text}
                    </p>
                </div>
            </div>

            <div className="subscription-details">
                <p className="subscription-description">{levelInfo.description}</p>

                {subscription && subscription.expiresAt && (
                    <div className="subscription-expiry">
                        <div className="expiry-label">Expire le :</div>
                        <div className="expiry-date">{formatDate(subscription.expiresAt)}</div>
                        {subscription.daysRemaining !== null && (
                            <div
                                className={`expiry-days ${subscription.daysRemaining < 7 ? 'expiring-soon' : ''}`}
                            >
                                {subscription.daysRemaining > 0
                                    ? `${subscription.daysRemaining} jours restants`
                                    : 'Expiré'}
                            </div>
                        )}
                    </div>
                )}

                {!subscription?.expiresAt && user.subscriptionStatus === 'free' && (
                    <div className="subscription-message">
                        <p>Débloquez du contenu exclusif avec un abonnement Premium ou VIP !</p>
                    </div>
                )}
            </div>

            {canUpgrade && (
                <button
                    className="btn btn-primary subscription-upgrade-btn"
                    onClick={() => setActiveTab('abonnements')}
                >
                    {user.subscriptionStatus === 'free' ? <><Sparkles size={14} /> Passer Premium/VIP</> : <><Gem size={14} /> Passer VIP</>}
                </button>
            )}

            {!canUpgrade && subscription?.isActive && (
                <div className="subscription-active">
                    <span className="active-icon"><CheckCircle2 size={16} /></span>
                    <span>Abonnement actif</span>
                </div>
            )}
        </div>
    );
};

export default SubscriptionStatus;
