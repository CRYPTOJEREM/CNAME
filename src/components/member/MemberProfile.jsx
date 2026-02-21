/**
 * MemberProfile - Gestion du profil utilisateur
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import memberService from '../../services/memberService';
import { AlertTriangle, CheckCircle2, User, XCircle } from 'lucide-react';

const MemberProfile = () => {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        telegramUsername: user.telegramUsername || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            telegramUsername: user.telegramUsername || ''
        });
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await memberService.updateProfile(formData);
            await refreshUser();
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
            setIsEditing(false);

            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 3000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Erreur lors de la mise à jour'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            telegramUsername: user.telegramUsername || ''
        });
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    return (
        <div>
            <h2 style={{
                color: '#64D2FF',
                fontSize: '28px',
                fontWeight: '900',
                marginBottom: '30px',
                textShadow: '0 0 20px rgba(100, 210, 255, 0.5)'
            }}>
                <User size={16} /> Mon Profil
            </h2>

            <div style={{
                background: 'linear-gradient(135deg, #111111 0%, #1A1A1A 100%)',
                borderRadius: '24px',
                padding: '40px',
                border: '2px solid rgba(191, 90, 242, 0.3)',
                maxWidth: '800px'
            }}>
                {/* Header profil */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '25px',
                    paddingBottom: '30px',
                    borderBottom: '2px solid rgba(191, 90, 242, 0.2)',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #64D2FF, #BF5AF2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        fontWeight: '900',
                        color: '#111111'
                    }}>
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div>
                        <h3 style={{
                            color: '#FFFFFF',
                            fontSize: '24px',
                            fontWeight: '700',
                            marginBottom: '8px'
                        }}>
                            {user.firstName} {user.lastName}
                        </h3>
                        <p style={{
                            color: '#7B8BA8',
                            fontSize: '15px',
                            margin: 0
                        }}>
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Message de succès/erreur */}
                {message.text && (
                    <div style={{
                        background: message.type === 'success'
                            ? 'rgba(100, 210, 255, 0.1)'
                            : 'rgba(255, 77, 77, 0.1)',
                        border: `1px solid ${message.type === 'success' ? 'rgba(100, 210, 255, 0.3)' : 'rgba(255, 77, 77, 0.3)'}`,
                        borderRadius: '12px',
                        padding: '15px 20px',
                        marginBottom: '25px',
                        color: message.type === 'success' ? '#64D2FF' : '#FF453A',
                        fontSize: '15px'
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                    {/* Email (non modifiable) */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{
                            display: 'block',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '10px'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                background: 'rgba(26, 26, 26, 0.3)',
                                border: '2px solid rgba(191, 90, 242, 0.2)',
                                borderRadius: '12px',
                                color: '#7B8BA8',
                                fontSize: '15px',
                                cursor: 'not-allowed'
                            }}
                        />
                        <small style={{
                            display: 'block',
                            color: '#7B8BA8',
                            fontSize: '12px',
                            marginTop: '6px'
                        }}>
                            L'email ne peut pas être modifié
                        </small>
                    </div>

                    {/* Prénom et Nom */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '25px'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                color: '#FFFFFF',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '10px'
                            }}>
                                Prénom *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    background: isEditing ? 'rgba(26, 26, 26, 0.5)' : 'rgba(26, 26, 26, 0.3)',
                                    border: isEditing
                                        ? '2px solid rgba(100, 210, 255, 0.5)'
                                        : '2px solid rgba(191, 90, 242, 0.2)',
                                    borderRadius: '12px',
                                    color: '#FFFFFF',
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                color: '#FFFFFF',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '10px'
                            }}>
                                Nom *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 18px',
                                    background: isEditing ? 'rgba(26, 26, 26, 0.5)' : 'rgba(26, 26, 26, 0.3)',
                                    border: isEditing
                                        ? '2px solid rgba(100, 210, 255, 0.5)'
                                        : '2px solid rgba(191, 90, 242, 0.2)',
                                    borderRadius: '12px',
                                    color: '#FFFFFF',
                                    fontSize: '15px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    {/* Telegram */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '10px'
                        }}>
                            Telegram (@username)
                        </label>
                        <input
                            type="text"
                            name="telegramUsername"
                            value={formData.telegramUsername}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="@votre_username"
                            style={{
                                width: '100%',
                                padding: '14px 18px',
                                background: isEditing ? 'rgba(26, 26, 26, 0.5)' : 'rgba(26, 26, 26, 0.3)',
                                border: isEditing
                                    ? '2px solid rgba(100, 210, 255, 0.5)'
                                    : '2px solid rgba(191, 90, 242, 0.2)',
                                borderRadius: '12px',
                                color: '#FFFFFF',
                                fontSize: '15px',
                                outline: 'none'
                            }}
                        />
                        <small style={{
                            display: 'block',
                            color: '#7B8BA8',
                            fontSize: '12px',
                            marginTop: '6px'
                        }}>
                            Nécessaire pour accéder au groupe Telegram VIP
                        </small>
                    </div>

                    {/* Boutons d'action */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #64D2FF, #BF5AF2)',
                                    border: 'none',
                                    color: '#111111',
                                    padding: '14px 28px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                ✏️ Modifier le profil
                            </button>
                        ) : (
                            <>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        background: 'linear-gradient(135deg, #64D2FF, #BF5AF2)',
                                        border: 'none',
                                        color: '#111111',
                                        padding: '14px 28px',
                                        borderRadius: '12px',
                                        fontWeight: '700',
                                        fontSize: '15px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseOver={(e) => !loading && (e.target.style.transform = 'scale(1.02)')}
                                    onMouseOut={(e) => !loading && (e.target.style.transform = 'scale(1)')}
                                >
                                    {loading ? 'Enregistrement...' : '💾 Enregistrer'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                    style={{
                                        background: 'rgba(191, 90, 242, 0.2)',
                                        border: '2px solid rgba(191, 90, 242, 0.5)',
                                        color: '#64D2FF',
                                        padding: '14px 28px',
                                        borderRadius: '12px',
                                        fontWeight: '700',
                                        fontSize: '15px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    <XCircle size={16} /> Annuler
                                </button>
                            </>
                        )}
                    </div>
                </form>

                {/* Footer infos */}
                <div style={{
                    marginTop: '30px',
                    paddingTop: '25px',
                    borderTop: '2px solid rgba(191, 90, 242, 0.2)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px'
                }}>
                    <div>
                        <p style={{
                            color: '#7B8BA8',
                            fontSize: '13px',
                            marginBottom: '6px'
                        }}>
                            Email vérifié
                        </p>
                        <p style={{
                            color: user.emailVerified ? '#64D2FF' : '#FFD60A',
                            fontSize: '16px',
                            fontWeight: '700',
                            margin: 0
                        }}>
                            {user.emailVerified ? <><CheckCircle2 size={16} /> Oui</> : <><AlertTriangle size={16} /> Non</>}
                        </p>
                    </div>
                    <div>
                        <p style={{
                            color: '#7B8BA8',
                            fontSize: '13px',
                            marginBottom: '6px'
                        }}>
                            Membre depuis
                        </p>
                        <p style={{
                            color: '#FFFFFF',
                            fontSize: '16px',
                            fontWeight: '700',
                            margin: 0
                        }}>
                            {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberProfile;
