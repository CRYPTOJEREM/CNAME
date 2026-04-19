
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { BarChart3, Brain, Flame, Gem, Globe, GraduationCap, Target, TrendingUp, Zap } from 'lucide-react';
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
                    <div
                        key={moduleIndex}
                        className="formation-card-clickable"
                        style={{
                            background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                            border: '2px solid rgba(191, 90, 242, 0.3)',
                            borderRadius: '16px',
                            padding: '30px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            marginBottom: '25px'
                        }}
                        onClick={() => {
                            if (isAuthenticated) {
                                sessionStorage.setItem('openFormationId', module.formationId);
                                setActiveTab('membre');
                            } else {
                                setActiveTab('register');
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(191, 90, 242, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '48px' }}>{module.icon}</div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '22px', fontWeight: '700' }}>
                                    {module.title}
                                </h3>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <span style={{
                                        background: module.level === 'free' ? 'rgba(34, 197, 94, 0.2)' :
                                                   module.level === 'premium' ? 'rgba(251, 191, 36, 0.2)' :
                                                   'rgba(168, 85, 247, 0.2)',
                                        color: module.level === 'free' ? '#22C55E' :
                                               module.level === 'premium' ? '#FBBF24' :
                                               '#A855F7',
                                        padding: '6px 14px',
                                        borderRadius: '12px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}>
                                        {module.level === 'free' ? '🆓 Gratuit' :
                                         module.level === 'premium' ? '⭐ Premium' :
                                         '💎 VIP'}
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                        {module.videos.length} module{module.videos.length > 1 ? 's' : ''}
                                    </span>
                                    {module.progress > 0 && (
                                        <span style={{ color: 'var(--accent-blue)', fontSize: '14px', fontWeight: '600' }}>
                                            {Math.round(module.progress)}% complété
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div style={{
                                color: 'var(--accent-blue)',
                                fontSize: '36px',
                                transition: 'transform 0.3s'
                            }}>
                                →
                            </div>
                        </div>

                        {module.progress > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    background: 'rgba(191, 90, 242, 0.1)',
                                    borderRadius: '8px',
                                    height: '8px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(90deg, #2E90FA, #A855F7)',
                                        height: '100%',
                                        width: `${module.progress}%`,
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                            </div>
                        )}

                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '15px',
                            marginBottom: 0,
                            lineHeight: '1.6'
                        }}>
                            {isAuthenticated ?
                                `Cliquez pour commencer cette formation et accéder aux ${module.videos.length} modules →` :
                                'Créez un compte gratuit pour accéder à cette formation'}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Learning
