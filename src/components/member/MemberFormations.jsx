/**
 * MemberFormations - Liste et détails des formations
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import memberService from '../../services/memberService';
import { BookOpen, Gem, GraduationCap, Star } from 'lucide-react';

const MemberFormations = () => {
    const { user } = useAuth();
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFormation, setSelectedFormation] = useState(null);

    useEffect(() => {
        loadFormations();
    }, []);

    const loadFormations = async () => {
        try {
            const response = await memberService.getFormations();
            setFormations(response.formations || []);
        } catch (error) {
            console.error('Erreur chargement formations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormationClick = async (formationId) => {
        try {
            const response = await memberService.getFormationById(formationId);
            setSelectedFormation(response.formation);
        } catch (error) {
            console.error('Erreur chargement formation:', error);
        }
    };

    const getLevelBadge = (level) => {
        const badges = {
            free: { icon: '🆓', label: 'GRATUIT', color: '#7B8BA8' },
            premium: { icon: <Star size={14} />, label: 'PREMIUM', color: '#FFD700' },
            vip: { icon: <Gem size={14} />, label: 'VIP', color: '#00D9FF' }
        };
        return badges[level] || badges.free;
    };

    if (loading) {
        return <div style={{ color: '#FFFFFF', textAlign: 'center', padding: '40px' }}>Chargement...</div>;
    }

    // Vue détaillée d'une formation
    if (selectedFormation) {
        const badge = getLevelBadge(selectedFormation.level);
        return (
            <div>
                <button
                    onClick={() => setSelectedFormation(null)}
                    style={{
                        background: 'linear-gradient(135deg, #00D9FF, #7B2FF7)',
                        border: 'none',
                        color: '#0A0E27',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginBottom: '25px',
                        fontSize: '15px'
                    }}
                >
                    ← Retour aux formations
                </button>

                <div style={{
                    background: 'linear-gradient(135deg, #0D1229 0%, #1A1F3A 100%)',
                    borderRadius: '24px',
                    padding: '40px',
                    border: '2px solid rgba(123, 47, 247, 0.3)'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '25px',
                        paddingBottom: '25px',
                        borderBottom: '2px solid rgba(123, 47, 247, 0.2)'
                    }}>
                        <div>
                            <h2 style={{
                                color: '#FFFFFF',
                                fontSize: '28px',
                                fontWeight: '900',
                                marginBottom: '10px'
                            }}>
                                {selectedFormation.title}
                            </h2>
                            <p style={{ color: '#7B8BA8', fontSize: '16px', margin: 0 }}>
                                {selectedFormation.description}
                            </p>
                        </div>
                        <div style={{
                            background: badge.color,
                            color: '#0A0E27',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap'
                        }}>
                            {badge.icon} {badge.label}
                        </div>
                    </div>

                    {/* Modules */}
                    {selectedFormation.modules && selectedFormation.modules.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{
                                color: '#00D9FF',
                                fontSize: '20px',
                                fontWeight: '700',
                                marginBottom: '20px'
                            }}>
                                <BookOpen size={16} /> Programme de la formation
                            </h3>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                {selectedFormation.modules.map((module, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: 'rgba(26, 31, 58, 0.5)',
                                            border: '2px solid rgba(123, 47, 247, 0.3)',
                                            borderRadius: '12px',
                                            padding: '15px 20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px'
                                        }}
                                    >
                                        <div style={{
                                            width: '35px',
                                            height: '35px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #00D9FF, #7B2FF7)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#0A0E27',
                                            fontWeight: '900',
                                            fontSize: '14px',
                                            flexShrink: 0
                                        }}>
                                            {index + 1}
                                        </div>
                                        <div style={{
                                            color: '#FFFFFF',
                                            fontSize: '15px',
                                            fontWeight: '600'
                                        }}>
                                            {module}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contenu vidéo */}
                    {selectedFormation.content && (
                        <div>
                            <h3 style={{
                                color: '#00D9FF',
                                fontSize: '20px',
                                fontWeight: '700',
                                marginBottom: '20px'
                            }}>
                                🎥 Contenu de la formation
                            </h3>
                            {selectedFormation.content.includes('youtube') ? (
                                <iframe
                                    src={selectedFormation.content}
                                    title={selectedFormation.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{
                                        width: '100%',
                                        height: '500px',
                                        borderRadius: '12px',
                                        border: '2px solid rgba(0, 217, 255, 0.3)'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    background: 'rgba(26, 31, 58, 0.5)',
                                    border: '2px solid rgba(123, 47, 247, 0.3)',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    color: '#FFFFFF',
                                    lineHeight: '1.6'
                                }}>
                                    {selectedFormation.content}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Liste des formations
    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    color: '#00D9FF',
                    fontSize: '28px',
                    fontWeight: '900',
                    marginBottom: '10px',
                    textShadow: '0 0 20px rgba(0, 217, 255, 0.5)'
                }}>
                    <GraduationCap size={16} /> Mes Formations
                </h2>
                <p style={{
                    color: '#7B8BA8',
                    fontSize: '15px',
                    margin: 0
                }}>
                    Niveau actuel : <span style={{
                        color: getLevelBadge(user.subscriptionStatus).color,
                        fontWeight: '700'
                    }}>
                        {getLevelBadge(user.subscriptionStatus).icon} {getLevelBadge(user.subscriptionStatus).label}
                    </span>
                </p>
            </div>

            {formations.length === 0 ? (
                <div style={{
                    background: 'rgba(26, 31, 58, 0.5)',
                    border: '2px dashed rgba(123, 47, 247, 0.3)',
                    borderRadius: '20px',
                    padding: '60px 40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}><GraduationCap size={16} /></div>
                    <h3 style={{ color: '#FFFFFF', fontSize: '20px', marginBottom: '10px' }}>
                        Aucune formation disponible
                    </h3>
                    <p style={{ color: '#7B8BA8', fontSize: '16px', margin: 0 }}>
                        Il n'y a pas encore de formations pour votre niveau d'abonnement
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '25px'
                }}>
                    {formations.map((formation) => {
                        const badge = getLevelBadge(formation.level);
                        return (
                            <div
                                key={formation.id}
                                onClick={() => handleFormationClick(formation.id)}
                                style={{
                                    background: 'linear-gradient(135deg, #0D1229 0%, #1A1F3A 100%)',
                                    border: '2px solid rgba(123, 47, 247, 0.3)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.border = '2px solid rgba(0, 217, 255, 0.5)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.border = '2px solid rgba(123, 47, 247, 0.3)';
                                }}
                            >
                                {/* Badge niveau */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: badge.color,
                                    color: '#0A0E27',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    {badge.icon} {badge.label}
                                </div>

                                {/* Icône */}
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(123, 47, 247, 0.2))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '35px',
                                    marginBottom: '20px'
                                }}>
                                    <GraduationCap size={16} />
                                </div>

                                {/* Titre */}
                                <h3 style={{
                                    color: '#FFFFFF',
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    marginBottom: '12px'
                                }}>
                                    {formation.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    color: '#7B8BA8',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    marginBottom: '20px'
                                }}>
                                    {formation.description}
                                </p>

                                {/* Footer - Modules count */}
                                {formation.modules && formation.modules.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#00D9FF',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        marginBottom: '15px'
                                    }}>
                                        <span><BookOpen size={16} /></span>
                                        <span>{formation.modules.length} modules</span>
                                    </div>
                                )}

                                {/* Bouton */}
                                <button style={{
                                    background: 'rgba(123, 47, 247, 0.2)',
                                    border: '2px solid rgba(123, 47, 247, 0.5)',
                                    color: '#00D9FF',
                                    padding: '10px 18px',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'all 0.3s'
                                }}
                                    onMouseOver={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.style.background = 'linear-gradient(135deg, #00D9FF, #7B2FF7)';
                                        e.currentTarget.style.color = '#0A0E27';
                                    }}
                                    onMouseOut={(e) => {
                                        e.stopPropagation();
                                        e.currentTarget.style.background = 'rgba(123, 47, 247, 0.2)';
                                        e.currentTarget.style.color = '#00D9FF';
                                    }}
                                >
                                    Commencer la formation →
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MemberFormations;
