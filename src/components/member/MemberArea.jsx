/**
 * MemberArea - Dashboard principal de l'espace membre
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MemberProfile from './MemberProfile';
import MemberContent from './MemberContent';
import MemberFormations from './MemberFormations';
import PaymentHistory from './PaymentHistory';
import { BarChart3, BookOpen, CreditCard, Gem, Gift, GraduationCap, Smartphone, Star, User } from 'lucide-react';

const MemberArea = ({ setActiveTab }) => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');

    if (!user) {
        return <div>Chargement...</div>;
    }

    // Calculer les jours restants pour l'abonnement
    const getDaysRemaining = () => {
        if (!user.subscriptionExpiresAt) return null;
        const expirationDate = new Date(user.subscriptionExpiresAt);
        const today = new Date();
        const diffTime = expirationDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysRemaining = getDaysRemaining();

    // Badge selon le niveau d'abonnement
    const getSubscriptionBadge = () => {
        const badges = {
            free: { icon: '🆓', label: 'FREE', color: '#7B8BA8' },
            premium: { icon: <Star size={16} />, label: 'PREMIUM', color: '#FBBF24' },
            vip: { icon: <Gem size={16} />, label: 'VIP', color: '#2E90FA' }
        };
        return badges[user.subscriptionStatus] || badges.free;
    };

    const badge = getSubscriptionBadge();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0C0C1D',
            paddingTop: '100px'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>
                {/* Header de bienvenue */}
                <div style={{
                    background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                    borderRadius: '24px',
                    padding: '40px',
                    marginBottom: '40px',
                    border: '2px solid rgba(191, 90, 242, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        content: '',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #2E90FA 0%, #A855F7 50%, #FBBF24 100%)'
                    }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '60px' }}><User size={16} /></div>
                        <div>
                            <h1 style={{
                                color: '#FFFFFF',
                                fontSize: '32px',
                                fontWeight: '900',
                                marginBottom: '10px'
                            }}>
                                Bienvenue, {user.firstName} {user.lastName}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{
                                    background: `linear-gradient(135deg, ${badge.color}, #A855F7)`,
                                    color: '#0C0C1D',
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    {badge.icon} {badge.label}
                                </span>
                                {user.emailVerified && (
                                    <span style={{ color: '#2E90FA', fontSize: '14px' }}>
                                        ✓ Email vérifié
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {daysRemaining !== null && user.subscriptionStatus !== 'free' && (
                        <div style={{
                            background: 'rgba(10, 132, 255, 0.1)',
                            border: '1px solid rgba(10, 132, 255, 0.3)',
                            borderRadius: '12px',
                            padding: '15px 20px',
                            marginTop: '20px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '20px' }}>⏰</span>
                                <span style={{ color: '#FFFFFF', fontSize: '15px' }}>
                                    {daysRemaining > 0
                                        ? `Votre abonnement expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`
                                        : 'Votre abonnement a expiré'
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation sections */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '40px',
                    overflowX: 'auto',
                    paddingBottom: '10px'
                }}>
                    {[
                        { id: 'dashboard', icon: <BarChart3 size={20} />, label: 'Tableau de Bord' },
                        { id: 'profile', icon: <User size={16} />, label: 'Mon Profil' },
                        { id: 'content', icon: <BookOpen size={16} />, label: 'Contenu Exclusif' },
                        { id: 'formations', icon: <GraduationCap size={16} />, label: 'Formations' },
                        { id: 'payments', icon: <CreditCard size={16} />, label: 'Paiements' }
                    ].map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            style={{
                                background: activeSection === section.id
                                    ? 'linear-gradient(135deg, #2E90FA, #A855F7)'
                                    : 'rgba(20, 20, 40, 0.5)',
                                border: activeSection === section.id
                                    ? 'none'
                                    : '2px solid rgba(191, 90, 242, 0.3)',
                                color: activeSection === section.id ? '#0C0C1D' : '#FFFFFF',
                                padding: '15px 25px',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={(e) => {
                                if (activeSection !== section.id) {
                                    e.target.style.background = 'rgba(191, 90, 242, 0.2)';
                                    e.target.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (activeSection !== section.id) {
                                    e.target.style.background = 'rgba(20, 20, 40, 0.5)';
                                    e.target.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <span>{section.icon}</span>
                            <span>{section.label}</span>
                        </button>
                    ))}
                </div>

                {/* Contenu des sections */}
                {activeSection === 'dashboard' && (
                    <div>
                        <h2 style={{
                            color: '#2E90FA',
                            fontSize: '28px',
                            fontWeight: '900',
                            marginBottom: '30px',
                            textShadow: '0 0 20px rgba(10, 132, 255, 0.5)'
                        }}>
                            <BarChart3 size={20} /> Tableau de Bord
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '25px'
                        }}>
                            {/* Card Abonnement */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                                border: `2px solid ${badge.color}40`,
                                borderRadius: '20px',
                                padding: '30px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    fontSize: '40px',
                                    marginBottom: '15px'
                                }}>
                                    {badge.icon}
                                </div>
                                <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
                                    Mon Abonnement
                                </h3>
                                <p style={{
                                    color: badge.color,
                                    fontSize: '24px',
                                    fontWeight: '900',
                                    marginBottom: '15px'
                                }}>
                                    {badge.label}
                                </p>
                                {user.subscriptionStatus === 'free' ? (
                                    <p style={{ color: '#7B8BA8', fontSize: '14px', marginBottom: '20px' }}>
                                        Accès limité au contenu gratuit
                                    </p>
                                ) : (
                                    <p style={{ color: '#7B8BA8', fontSize: '14px', marginBottom: '20px' }}>
                                        Accès complet à tout le contenu {user.subscriptionStatus === 'vip' ? 'VIP et Premium' : 'Premium'}
                                    </p>
                                )}
                                {daysRemaining !== null && daysRemaining > 0 && (
                                    <div style={{
                                        background: 'rgba(10, 132, 255, 0.1)',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        marginBottom: '15px'
                                    }}>
                                        <p style={{ color: '#2E90FA', fontSize: '13px', margin: 0 }}>
                                            Expire le : {new Date(user.subscriptionExpiresAt).toLocaleDateString('fr-FR')}
                                        </p>
                                        <p style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '700', margin: '5px 0 0 0' }}>
                                            {daysRemaining} jours restants
                                        </p>
                                    </div>
                                )}
                                {user.subscriptionStatus === 'free' && (
                                    <button
                                        onClick={() => setActiveTab('abonnements')}
                                        style={{
                                            background: 'linear-gradient(135deg, #2E90FA, #A855F7)',
                                            border: 'none',
                                            color: '#0C0C1D',
                                            padding: '12px 20px',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            width: '100%'
                                        }}
                                    >
                                        <Star size={16} /> Passer Premium
                                    </button>
                                )}
                            </div>

                            {/* Card Formations */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                                border: '2px solid rgba(191, 90, 242, 0.3)',
                                borderRadius: '20px',
                                padding: '30px'
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '15px' }}><GraduationCap size={16} /></div>
                                <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
                                    Mes Formations
                                </h3>
                                <p style={{ color: '#7B8BA8', fontSize: '14px', marginBottom: '20px' }}>
                                    Accédez à toutes vos formations et suivez votre progression
                                </p>
                                <button
                                    onClick={() => setActiveSection('formations')}
                                    style={{
                                        background: 'rgba(191, 90, 242, 0.2)',
                                        border: '2px solid rgba(191, 90, 242, 0.5)',
                                        color: '#2E90FA',
                                        padding: '12px 20px',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    <BookOpen size={16} /> Voir les Formations
                                </button>
                            </div>

                            {/* Card Contenu Exclusif */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                                border: '2px solid rgba(191, 90, 242, 0.3)',
                                borderRadius: '20px',
                                padding: '30px'
                            }}>
                                <div style={{ fontSize: '40px', marginBottom: '15px' }}><BookOpen size={16} /></div>
                                <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
                                    Contenu Exclusif
                                </h3>
                                <p style={{ color: '#7B8BA8', fontSize: '14px', marginBottom: '20px' }}>
                                    Découvrez le contenu réservé aux membres {user.subscriptionStatus === 'vip' ? 'VIP' : user.subscriptionStatus}
                                </p>
                                <button
                                    onClick={() => setActiveSection('content')}
                                    style={{
                                        background: 'rgba(191, 90, 242, 0.2)',
                                        border: '2px solid rgba(191, 90, 242, 0.5)',
                                        color: '#2E90FA',
                                        padding: '12px 20px',
                                        borderRadius: '10px',
                                        fontWeight: '700',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    🔓 Explorer le Contenu
                                </button>
                            </div>

                            {/* Card Groupe Telegram */}
                            {user.subscriptionStatus !== 'free' && (
                                <div style={{
                                    background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                                    border: '2px solid rgba(10, 132, 255, 0.3)',
                                    borderRadius: '20px',
                                    padding: '30px'
                                }}>
                                    <div style={{ fontSize: '40px', marginBottom: '15px' }}><Smartphone size={16} /></div>
                                    <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
                                        Groupe Telegram VIP
                                    </h3>
                                    <p style={{ color: '#7B8BA8', fontSize: '14px', marginBottom: '20px' }}>
                                        Rejoignez notre communauté privée pour des signaux exclusifs
                                    </p>
                                    <button
                                        style={{
                                            background: 'linear-gradient(135deg, #2E90FA, #2563EB)',
                                            border: 'none',
                                            color: '#FFFFFF',
                                            padding: '12px 20px',
                                            borderRadius: '10px',
                                            fontWeight: '700',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            width: '100%'
                                        }}
                                    >
                                        <Smartphone size={16} /> Rejoindre le Groupe
                                    </button>
                                </div>
                            )}

                            {/* Card Concours Hebdomadaire */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                                border: '2px solid rgba(255, 214, 10, 0.3)',
                                borderRadius: '20px',
                                padding: '30px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: 'linear-gradient(90deg, #FBBF24, #FF6B00)'
                                }} />
                                <div style={{ fontSize: '40px', marginBottom: '15px' }}><Gift size={16} /></div>
                                <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
                                    Concours Hebdomadaire
                                </h3>
                                <p style={{
                                    color: '#FBBF24',
                                    fontSize: '28px',
                                    fontWeight: '900',
                                    marginBottom: '15px'
                                }}>
                                    $1,000
                                </p>
                                <p style={{ color: '#7B8BA8', fontSize: '14px', marginBottom: '10px' }}>
                                    Coupon de trading Bitunix - Participation 100% gratuite !
                                </p>
                                {user.bitunixUid ? (
                                    <div style={{
                                        background: 'rgba(10, 132, 255, 0.1)',
                                        border: '1px solid rgba(10, 132, 255, 0.3)',
                                        borderRadius: '10px',
                                        padding: '12px 15px'
                                    }}>
                                        <p style={{ color: '#2E90FA', fontSize: '14px', fontWeight: '700', margin: 0 }}>
                                            ✓ Vous participez automatiquement !
                                        </p>
                                        <p style={{ color: '#7B8BA8', fontSize: '12px', margin: '5px 0 0 0' }}>
                                            Tirage chaque semaine. Votre compte Bitunix doit etre actif (trading) pour etre eligible.
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{
                                        background: 'rgba(255, 214, 10, 0.1)',
                                        border: '1px solid rgba(255, 214, 10, 0.3)',
                                        borderRadius: '10px',
                                        padding: '12px 15px'
                                    }}>
                                        <p style={{ color: '#FBBF24', fontSize: '14px', fontWeight: '700', margin: 0 }}>
                                            Ajoutez votre Bitunix UID
                                        </p>
                                        <p style={{ color: '#7B8BA8', fontSize: '12px', margin: '5px 0 0 0' }}>
                                            Renseignez votre UID dans votre profil pour participer au tirage.
                                        </p>
                                        <button
                                            onClick={() => setActiveSection('profile')}
                                            style={{
                                                background: 'linear-gradient(135deg, #FBBF24, #FF6B00)',
                                                border: 'none',
                                                color: '#0C0C1D',
                                                padding: '10px 16px',
                                                borderRadius: '8px',
                                                fontWeight: '700',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                marginTop: '10px'
                                            }}
                                        >
                                            Modifier mon profil
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'profile' && <MemberProfile />}
                {activeSection === 'content' && <MemberContent />}
                {activeSection === 'formations' && <MemberFormations />}
                {activeSection === 'payments' && <PaymentHistory />}
            </div>
        </div>
    );
};

export default MemberArea;
