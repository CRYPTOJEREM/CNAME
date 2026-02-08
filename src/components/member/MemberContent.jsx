/**
 * MemberContent - Contenu exclusif filtré par niveau d'abonnement
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import memberService from '../../services/memberService';

const MemberContent = () => {
    const { user } = useAuth();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedContent, setSelectedContent] = useState(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            const data = await memberService.getContent();
            setContent(data);
        } catch (error) {
            console.error('Erreur chargement contenu:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        const icons = {
            video: '🎥',
            article: '📄',
            formation: '🎓',
            webinar: '📹',
            signal: '📊'
        };
        return icons[type] || '📚';
    };

    const getLevelBadge = (level) => {
        const badges = {
            free: { icon: '🆓', label: 'GRATUIT', color: '#7B8BA8' },
            premium: { icon: '⭐', label: 'PREMIUM', color: '#FFD700' },
            vip: { icon: '💎', label: 'VIP', color: '#00D9FF' }
        };
        return badges[level] || badges.free;
    };

    const filteredContent = filter === 'all'
        ? content
        : content.filter(item => item.type === filter);

    if (loading) {
        return <div style={{ color: '#FFFFFF', textAlign: 'center', padding: '40px' }}>Chargement...</div>;
    }

    if (selectedContent) {
        return (
            <div>
                <button
                    onClick={() => setSelectedContent(null)}
                    style={{
                        background: 'linear-gradient(135deg, #00D9FF, #7B2FF7)',
                        border: 'none',
                        color: '#0A0E27',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginBottom: '25px'
                    }}
                >
                    ← Retour au contenu
                </button>

                <div style={{
                    background: 'linear-gradient(135deg, #0D1229 0%, #1A1F3A 100%)',
                    borderRadius: '24px',
                    padding: '40px',
                    border: '2px solid rgba(123, 47, 247, 0.3)'
                }}>
                    {selectedContent.type === 'video' && (
                        <iframe
                            src={selectedContent.content}
                            title={selectedContent.title}
                            frameBorder="0"
                            allowFullScreen
                            style={{
                                width: '100%',
                                height: '500px',
                                borderRadius: '12px',
                                marginBottom: '25px'
                            }}
                        />
                    )}
                    <h2 style={{ color: '#FFFFFF', marginBottom: '15px' }}>{selectedContent.title}</h2>
                    <p style={{ color: '#7B8BA8' }}>{selectedContent.description}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 style={{
                color: '#00D9FF',
                fontSize: '28px',
                fontWeight: '900',
                marginBottom: '30px',
                textShadow: '0 0 20px rgba(0, 217, 255, 0.5)'
            }}>
                📚 Contenu Exclusif
            </h2>

            {/* Filtres */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '30px',
                flexWrap: 'wrap'
            }}>
                {[
                    { id: 'all', icon: '📚', label: 'Tout' },
                    { id: 'video', icon: '🎥', label: 'Vidéos' },
                    { id: 'article', icon: '📄', label: 'Articles' },
                    { id: 'formation', icon: '🎓', label: 'Formations' }
                ].map(filterBtn => (
                    <button
                        key={filterBtn.id}
                        onClick={() => setFilter(filterBtn.id)}
                        style={{
                            background: filter === filterBtn.id
                                ? 'linear-gradient(135deg, #00D9FF, #7B2FF7)'
                                : 'rgba(26, 31, 58, 0.5)',
                            border: filter === filterBtn.id
                                ? 'none'
                                : '2px solid rgba(123, 47, 247, 0.3)',
                            color: filter === filterBtn.id ? '#0A0E27' : '#FFFFFF',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>{filterBtn.icon}</span>
                        <span>{filterBtn.label}</span>
                    </button>
                ))}
            </div>

            {/* Grid de contenu */}
            {filteredContent.length === 0 ? (
                <div style={{
                    background: 'rgba(26, 31, 58, 0.5)',
                    border: '2px dashed rgba(123, 47, 247, 0.3)',
                    borderRadius: '20px',
                    padding: '60px 40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>📭</div>
                    <p style={{ color: '#7B8BA8', fontSize: '16px' }}>
                        Aucun contenu disponible dans cette catégorie
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '25px'
                }}>
                    {filteredContent.map((item) => {
                        const badge = getLevelBadge(item.level);
                        return (
                            <div
                                key={item.id}
                                onClick={() => setSelectedContent(item)}
                                style={{
                                    background: 'linear-gradient(135deg, #0D1229 0%, #1A1F3A 100%)',
                                    border: '2px solid rgba(123, 47, 247, 0.3)',
                                    borderRadius: '20px',
                                    padding: '0',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
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
                                {/* Thumbnail */}
                                <div style={{
                                    width: '100%',
                                    paddingTop: '56.25%',
                                    position: 'relative',
                                    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(123, 47, 247, 0.1))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: '60px'
                                    }}>
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        right: '15px',
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
                                </div>

                                {/* Contenu */}
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{
                                        color: '#FFFFFF',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        marginBottom: '10px'
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{
                                        color: '#7B8BA8',
                                        fontSize: '14px',
                                        marginBottom: '15px',
                                        lineHeight: '1.5'
                                    }}>
                                        {item.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        fontSize: '13px',
                                        color: '#00D9FF'
                                    }}>
                                        <span>{getTypeIcon(item.type)} {item.type}</span>
                                        {item.modules && item.modules.length > 0 && (
                                            <span>• {item.modules.length} modules</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MemberContent;
