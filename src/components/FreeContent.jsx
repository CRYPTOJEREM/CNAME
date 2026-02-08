/**
 * FreeContent - Contenu gratuit visible par tous
 * Mais nécessite un compte pour accéder au contenu (vidéos, articles)
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FreeContent = ({ setActiveTab }) => {
    const { isAuthenticated } = useAuth();
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContent, setSelectedContent] = useState(null);
    const [activeCategory, setActiveCategory] = useState('trading');
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        loadFreeContent();
    }, []);

    const loadFreeContent = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/public/content`);
            setContent(response.data.content || []);
        } catch (error) {
            console.error('Erreur chargement contenu gratuit:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContentClick = async (contentItem) => {
        // Vérifier si l'utilisateur est connecté
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        // Si connecté, charger et afficher le contenu
        try {
            const response = await axios.get(`${API_URL}/api/public/content/${contentItem.id}`);
            setSelectedContent(response.data.content);
        } catch (error) {
            console.error('Erreur chargement contenu:', error);
            alert('Erreur lors du chargement du contenu');
        }
    };

    if (loading) {
        return (
            <section className="learning-section">
                <div className="loading-spinner">Chargement...</div>
            </section>
        );
    }

    // Affichage du contenu sélectionné
    if (selectedContent) {
        return (
            <section className="learning-section">
                <div className="free-content-viewer">
                    <button
                        className="btn btn-back"
                        onClick={() => setSelectedContent(null)}
                        style={{
                            background: 'linear-gradient(135deg, #00D9FF, #7B2FF7)',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            color: '#0A0E27',
                            fontWeight: '700',
                            cursor: 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        ← Retour au contenu gratuit
                    </button>

                    <div className="video-module-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        {selectedContent.type === 'video' && selectedContent.content && (
                            <div className="video-container">
                                <iframe
                                    src={selectedContent.content}
                                    title={selectedContent.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ width: '100%', height: '500px', borderRadius: '12px' }}
                                />
                            </div>
                        )}

                        <div className="video-module-info">
                            <span className="video-level level-debutant">🌱 DÉBUTANT - GRATUIT</span>
                            <h3 className="video-module-title">{selectedContent.title}</h3>
                            <p className="video-module-description">{selectedContent.description}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Liste du contenu gratuit - Style HTML original
    return (
        <section className="learning-section">
            {/* Modal de connexion requise */}
            {showLoginModal && (
                <div
                    className="login-modal-overlay"
                    onClick={() => setShowLoginModal(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(10, 14, 39, 0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000
                    }}
                >
                    <div
                        className="login-modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(135deg, #0D1229 0%, #1A1F3A 100%)',
                            borderRadius: '24px',
                            padding: '40px',
                            maxWidth: '500px',
                            width: '90%',
                            border: '2px solid rgba(123, 47, 247, 0.3)',
                            position: 'relative'
                        }}
                    >
                        <button
                            className="login-modal-close"
                            onClick={() => setShowLoginModal(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'transparent',
                                border: 'none',
                                color: '#7B8BA8',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔒</div>
                            <h2 style={{
                                color: '#00D9FF',
                                fontSize: '28px',
                                fontWeight: '900',
                                marginBottom: '15px'
                            }}>
                                Créez un compte gratuit
                            </h2>
                            <p style={{ color: '#7B8BA8', fontSize: '16px' }}>
                                Pour accéder à ce contenu gratuit, vous devez créer un compte.
                                C'est rapide et 100% gratuit !
                            </p>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 0'
                            }}>
                                <span style={{ fontSize: '20px' }}>✅</span>
                                <span style={{ color: '#FFFFFF' }}>Accès à tout le contenu gratuit</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 0'
                            }}>
                                <span style={{ fontSize: '20px' }}>✅</span>
                                <span style={{ color: '#FFFFFF' }}>Dashboard crypto en temps réel</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 0'
                            }}>
                                <span style={{ fontSize: '20px' }}>✅</span>
                                <span style={{ color: '#FFFFFF' }}>Calendrier économique</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 0'
                            }}>
                                <span style={{ fontSize: '20px' }}>✅</span>
                                <span style={{ color: '#FFFFFF' }}>Actualités quotidiennes</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button
                                onClick={() => {
                                    setShowLoginModal(false);
                                    setActiveTab('register');
                                }}
                                style={{
                                    background: 'linear-gradient(135deg, #00D9FF, #7B2FF7)',
                                    border: 'none',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    color: '#0A0E27',
                                    fontWeight: '700',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                ✨ Créer un compte gratuit
                            </button>
                            <button
                                onClick={() => {
                                    setShowLoginModal(false);
                                    setActiveTab('login');
                                }}
                                style={{
                                    background: 'rgba(123, 47, 247, 0.2)',
                                    border: '2px solid rgba(123, 47, 247, 0.5)',
                                    padding: '15px',
                                    borderRadius: '12px',
                                    color: '#00D9FF',
                                    fontWeight: '700',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                🔐 J'ai déjà un compte
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="learning-header">
                <div className="learning-badge">🎓 FORMATION COMPLÈTE</div>
                <h1>PARCOURS D'APPRENTISSAGE</h1>
                <p>
                    Apprenez le trading et la crypto de zéro à expert grâce à notre parcours pédagogique structuré.
                    {!isAuthenticated && (
                        <strong> Créez un compte gratuit pour accéder aux contenus complets.</strong>
                    )}
                </p>
            </div>

            {/* Sélecteur de Parcours */}
            <div className="category-selector">
                <h3 className="category-title">🎯 Choisissez Votre Parcours</h3>
                <div className="category-buttons">
                    <button
                        className={`category-btn ${activeCategory === 'trading' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('trading')}
                    >
                        <span className="cat-icon">📊</span>
                        <span className="cat-name">Trading</span>
                        <span className="cat-desc">Analyse technique & stratégies</span>
                    </button>
                    <button
                        className={`category-btn ${activeCategory === 'web3' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('web3')}
                    >
                        <span className="cat-icon">🌐</span>
                        <span className="cat-name">Web3 & DeFi</span>
                        <span className="cat-desc">Blockchain & finance décentralisée</span>
                    </button>
                    <button
                        className={`category-btn ${activeCategory === 'memecoin' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('memecoin')}
                    >
                        <span className="cat-icon">🚀</span>
                        <span className="cat-name">Memecoins</span>
                        <span className="cat-desc">Tendances & opportunités rapides</span>
                    </button>
                </div>
            </div>

            {/* CONTENU TRADING */}
            {activeCategory === 'trading' && (
                <div className="category-content">
                    {/* MODULE 1: LES BASES */}
                    <div className="module-section">
                        <h2 className="module-title">
                            <span>🌱</span>
                            <span>MODULE 1 : Les Bases de la Crypto</span>
                        </h2>
                        <p className="module-subtitle">
                            Commencez votre voyage dans l'univers des cryptomonnaies. Découvrez les concepts fondamentaux,
                            la blockchain, et les premiers pas pour sécuriser vos actifs numériques.
                        </p>

                        <div className="videos-grid">
                            {content.filter(c => c.category === 'trading' && c.type === 'video').map((item) => (
                                <div
                                    key={item.id}
                                    className="video-module-card"
                                    onClick={() => handleContentClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="video-container">
                                        <div style={{
                                            width: '100%',
                                            paddingTop: '56.25%',
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(123, 47, 247, 0.1))',
                                            borderRadius: '12px',
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
                                                ▶️
                                            </div>
                                        </div>
                                    </div>
                                    <div className="video-module-info">
                                        <span className="video-level level-debutant">🌱 DÉBUTANT - GRATUIT</span>
                                        <h3 className="video-module-title">{item.title}</h3>
                                        <p className="video-module-description">{item.description}</p>
                                        <div className="video-stats">
                                            <div className="video-stat">⏱️ 15 min</div>
                                            <div className="video-stat">👁️ 25K vues</div>
                                            <div className="video-stat">📚 Gratuit</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {content.filter(c => c.category === 'trading' && c.type === 'article').map((item) => (
                                <div
                                    key={item.id}
                                    className="video-module-card"
                                    onClick={() => handleContentClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="video-container">
                                        <div style={{
                                            width: '100%',
                                            paddingTop: '56.25%',
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(123, 47, 247, 0.1))',
                                            borderRadius: '12px',
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
                                                📄
                                            </div>
                                        </div>
                                    </div>
                                    <div className="video-module-info">
                                        <span className="video-level level-debutant">🌱 DÉBUTANT - GRATUIT</span>
                                        <h3 className="video-module-title">{item.title}</h3>
                                        <p className="video-module-description">{item.description}</p>
                                        <div className="video-stats">
                                            <div className="video-stat">📖 Article</div>
                                            <div className="video-stat">👁️ 18K vues</div>
                                            <div className="video-stat">📚 Gratuit</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENU WEB3 */}
            {activeCategory === 'web3' && (
                <div className="category-content">
                    <div className="module-section">
                        <h2 className="module-title">
                            <span>🌐</span>
                            <span>MODULE : Web3 & DeFi</span>
                        </h2>
                        <p className="module-subtitle">
                            Plongez dans l'univers du Web3 et de la finance décentralisée.
                            Découvrez les protocoles, les opportunités et les risques de la DeFi.
                        </p>
                        <div className="videos-grid">
                            {content.filter(c => c.category === 'web3' && c.type === 'video').map((item) => (
                                <div
                                    key={item.id}
                                    className="video-module-card"
                                    onClick={() => handleContentClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="video-container">
                                        <div style={{
                                            width: '100%',
                                            paddingTop: '56.25%',
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(123, 47, 247, 0.1))',
                                            borderRadius: '12px',
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
                                                ▶️
                                            </div>
                                        </div>
                                    </div>
                                    <div className="video-module-info">
                                        <span className="video-level level-debutant">🌐 WEB3 - GRATUIT</span>
                                        <h3 className="video-module-title">{item.title}</h3>
                                        <p className="video-module-description">{item.description}</p>
                                        <div className="video-stats">
                                            <div className="video-stat">⏱️ 15 min</div>
                                            <div className="video-stat">👁️ 15K vues</div>
                                            <div className="video-stat">📚 Gratuit</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {content.filter(c => c.category === 'web3' && c.type === 'article').map((item) => (
                                <div
                                    key={item.id}
                                    className="video-module-card"
                                    onClick={() => handleContentClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="video-container">
                                        <div style={{
                                            width: '100%',
                                            paddingTop: '56.25%',
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(123, 47, 247, 0.1))',
                                            borderRadius: '12px',
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
                                                📄
                                            </div>
                                        </div>
                                    </div>
                                    <div className="video-module-info">
                                        <span className="video-level level-debutant">🌐 WEB3 - GRATUIT</span>
                                        <h3 className="video-module-title">{item.title}</h3>
                                        <p className="video-module-description">{item.description}</p>
                                        <div className="video-stats">
                                            <div className="video-stat">📖 Article</div>
                                            <div className="video-stat">👁️ 12K vues</div>
                                            <div className="video-stat">📚 Gratuit</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENU MEMECOINS */}
            {activeCategory === 'memecoin' && (
                <div className="category-content">
                    <div className="module-section">
                        <h2 className="module-title">
                            <span>🚀</span>
                            <span>MODULE : Memecoins</span>
                        </h2>
                        <p className="module-subtitle">
                            Apprenez à identifier et trader les memecoins.
                            Stratégies, risques et opportunités dans l'univers volatile des memes.
                        </p>
                        <div className="videos-grid">
                            {content.filter(c => c.category === 'memecoin' && c.type === 'video').map((item) => (
                                <div
                                    key={item.id}
                                    className="video-module-card"
                                    onClick={() => handleContentClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="video-container">
                                        <div style={{
                                            width: '100%',
                                            paddingTop: '56.25%',
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(123, 47, 247, 0.1))',
                                            borderRadius: '12px',
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
                                                ▶️
                                            </div>
                                        </div>
                                    </div>
                                    <div className="video-module-info">
                                        <span className="video-level level-debutant">🚀 MEMECOIN - GRATUIT</span>
                                        <h3 className="video-module-title">{item.title}</h3>
                                        <p className="video-module-description">{item.description}</p>
                                        <div className="video-stats">
                                            <div className="video-stat">⏱️ 12 min</div>
                                            <div className="video-stat">👁️ 30K vues</div>
                                            <div className="video-stat">📚 Gratuit</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {content.filter(c => c.category === 'memecoin' && c.type === 'article').map((item) => (
                                <div
                                    key={item.id}
                                    className="video-module-card"
                                    onClick={() => handleContentClick(item)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="video-container">
                                        <div style={{
                                            width: '100%',
                                            paddingTop: '56.25%',
                                            position: 'relative',
                                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(123, 47, 247, 0.1))',
                                            borderRadius: '12px',
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
                                                📄
                                            </div>
                                        </div>
                                    </div>
                                    <div className="video-module-info">
                                        <span className="video-level level-debutant">🚀 MEMECOIN - GRATUIT</span>
                                        <h3 className="video-module-title">{item.title}</h3>
                                        <p className="video-module-description">{item.description}</p>
                                        <div className="video-stats">
                                            <div className="video-stat">📖 Article</div>
                                            <div className="video-stat">👁️ 22K vues</div>
                                            <div className="video-stat">📚 Gratuit</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default FreeContent;
