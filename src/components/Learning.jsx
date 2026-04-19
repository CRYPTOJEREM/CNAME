
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { BarChart3, Brain, Clock, Flame, Gem, Globe, GraduationCap, Lock, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import memberService from '../services/memberService';

const Learning = ({ setActiveTab }) => {
    const [category, setCategory] = useState('trading')
    const [formations, setFormations] = useState([])
    const [loading, setLoading] = useState(true)
    const { isAuthenticated, user } = useAuth()

    // Charger les formations depuis l'API
    useEffect(() => {
        const loadFormations = async () => {
            try {
                if (isAuthenticated) {
                    const response = await memberService.getFormations();
                    setFormations(response.formations || []);
                }
            } catch (error) {
                console.error('Erreur chargement formations:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFormations();
    }, [isAuthenticated])

    // Grouper les formations par catégorie et les transformer en modules
    const getModules = () => {
        if (!formations.length) return [];

        const categoryMap = {
            'trading': 'trading',
            'defi': 'defi',
            'psycho': 'psychologie'
        };

        const targetCategory = categoryMap[category];
        const categoryFormations = formations.filter(f => f.category === targetCategory);

        // Icônes par catégorie
        const iconMap = {
            'trading': [
                <span className="icon-container primary" key="icon-1"><BarChart3 size={22} /></span>,
                <span className="icon-container primary" key="icon-2"><TrendingUp size={22} /></span>,
                <span className="icon-container primary" key="icon-3"><Target size={22} /></span>,
                <span className="icon-container primary" key="icon-4"><Zap size={22} /></span>
            ],
            'defi': [
                <span className="icon-container secondary" key="icon-1"><Globe size={22} /></span>,
                <span className="icon-container accent" key="icon-2"><Gem size={22} /></span>,
                <span className="icon-container primary" key="icon-3"><Lock size={22} /></span>
            ],
            'psychologie': [
                <span className="icon-container primary" key="icon-1"><Brain size={22} /></span>,
                <span className="icon-container primary" key="icon-2"><Flame size={22} /></span>,
                <span className="icon-container primary" key="icon-3"><Zap size={22} /></span>
            ]
        };

        // Transformer les formations en modules avec vidéos
        return categoryFormations.map((formation, index) => ({
            icon: iconMap[targetCategory]?.[index % iconMap[targetCategory].length] || <span className="icon-container primary"><GraduationCap size={22} /></span>,
            title: formation.title,
            formationId: formation.id,
            level: formation.level,
            progress: formation.progress,
            videos: formation.modules?.map(mod => ({
                id: mod.videoUrl?.split('/').pop() || 'dQw4w9WgXcQ',
                title: mod.title,
                desc: formation.description,
                level: formation.level === 'free' ? 'debutant' : formation.level === 'premium' ? 'intermediaire' : 'avance',
                duration: mod.duration || '20:00'
            })) || []
        }));
    }

    return (
        <section className="learning-section">
            <div className="learning-header">
                <div className="learning-badge"><span className="icon-container sm primary"><GraduationCap size={18} /></span> FORMATION COMPLÈTE</div>
                <h1>PARCOURS D'APPRENTISSAGE</h1>
                <p>
                    Apprenez le trading et la crypto de zéro à expert grâce à notre parcours pédagogique structuré.
                    Chaque module contient des vidéos détaillées pour vous accompagner dans votre progression.
                </p>
            </div>

            <div className="category-selector scroll-reveal">
                <h3 className="category-title"><span className="icon-container sm primary"><Target size={16} /></span> Choisissez Votre Parcours</h3>
                <div className="category-buttons">
                    <button className={`category-btn ${category === 'trading' ? 'active' : ''}`} onClick={() => setCategory('trading')}>
                        <span className="cat-icon"><span className="icon-container lg primary"><BarChart3 size={26} /></span></span>
                        <span className="cat-name">Parcours Trading</span>
                        <span className="cat-desc">Analyse technique & stratégies</span>
                    </button>
                    <button className={`category-btn ${category === 'defi' ? 'active' : ''}`} onClick={() => setCategory('defi')}>
                        <span className="cat-icon"><span className="icon-container lg secondary"><Globe size={26} /></span></span>
                        <span className="cat-name">Parcours DeFi</span>
                        <span className="cat-desc">Finance Décentralisée & Web3</span>
                    </button>
                    <button className={`category-btn ${category === 'psycho' ? 'active' : ''}`} onClick={() => setCategory('psycho')}>
                        <span className="cat-icon"><span className="icon-container lg primary"><Brain size={26} /></span></span>
                        <span className="cat-name">Psychologie</span>
                        <span className="cat-desc">Mindset & Gestion du risque</span>
                    </button>
                </div>
            </div>

            <div className="category-content scroll-reveal">
                {getModules().map((module, moduleIndex) => (
                    <div key={moduleIndex} className="module-section">
                        <div className="module-title">
                            <span>{module.icon} {module.title}</span>
                        </div>
                        <div className="module-subtitle">
                            {module.videos.length} vidéos • Niveau {module.videos[0].level}
                        </div>
                        <div className="videos-grid">
                            {module.videos.map((video, videoIndex) => (
                                <div key={videoIndex} className="video-module-card">
                                    <div className="video-container" style={{ position: 'relative', cursor: isAuthenticated ? 'pointer' : 'default' }}
                                         onClick={() => isAuthenticated && window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}>
                                        {/* Thumbnail YouTube au lieu d'iframe pour éviter erreurs WebGL */}
                                        <img
                                            src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                            alt={video.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                filter: !isAuthenticated ? 'blur(10px)' : 'none'
                                            }}
                                        />
                                        {/* Play button */}
                                        {isAuthenticated && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '68px',
                                                height: '48px',
                                                background: 'rgba(255, 0, 0, 0.9)',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}>
                                                <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
                                                    <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                                                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                                                </svg>
                                            </div>
                                        )}
                                        {!isAuthenticated && (
                                            <div
                                                className="video-overlay"
                                                onClick={() => setActiveTab('register')}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'rgba(0, 0, 0, 0.85)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.95)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.85)'}
                                            >
                                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                                    <div style={{ fontSize: '48px', marginBottom: '15px' }}><Lock size={48} /></div>
                                                    <h3 style={{ color: 'var(--accent-blue)', marginBottom: '10px', fontSize: '1.3rem' }}>
                                                        Contenu Réservé aux Membres
                                                    </h3>
                                                    <p style={{ color: '#fff', marginBottom: '20px', fontSize: '1rem' }}>
                                                        Créez un compte gratuit pour accéder à toutes nos formations
                                                    </p>
                                                    <div style={{
                                                        background: 'linear-gradient(135deg, #2E90FA 0%, #6366F1 100%)',
                                                        color: '#000',
                                                        padding: '12px 30px',
                                                        borderRadius: '8px',
                                                        fontWeight: 'bold',
                                                        display: 'inline-block',
                                                        fontSize: '1rem'
                                                    }}>
                                                        <Sparkles size={18} /> Créer un Compte Gratuit
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="video-module-info">
                                        <span className={`video-level level-${video.level}`}>
                                            {video.level === 'debutant' ? '🟢 Débutant' :
                                             video.level === 'intermediaire' ? '🟡 Intermédiaire' :
                                             '🔴 Avancé'}
                                        </span>
                                        <div className="video-module-title">{video.title}</div>
                                        <div className="video-module-description">{video.desc}</div>
                                        <div className="video-stats">
                                            <div className="video-stat"><Clock size={14} /> {video.duration}</div>
                                            {!isAuthenticated && (
                                                <div className="video-stat" style={{ color: 'var(--accent-blue)' }}>
                                                    <Lock size={16} /> Inscription requise
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Learning
