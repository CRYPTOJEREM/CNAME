
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { BarChart3, Brain, Clock, Flame, Gem, Globe, GraduationCap, Lock, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';

const Learning = ({ setActiveTab }) => {
    const [category, setCategory] = useState('trading')
    const { isAuthenticated } = useAuth()

    const tradingModules = [
        {
            icon: <span className="icon-container primary"><BarChart3 size={22} /></span>, title: "Module 1 : Les Bases de l'Analyse Technique",
            videos: [
                { id: "dQw4w9WgXcQ", title: "Supports et Résistances", desc: "Apprenez à identifier et tracer vos niveaux clés pour anticiper les mouvements de prix.", level: "debutant", duration: "15:30" },
                { id: "dQw4w9WgXcQ", title: "Les Figures Chartistes", desc: "Comprendre les patterns classiques : triangles, drapeaux, têtes-épaules.", level: "debutant", duration: "22:45" },
                { id: "dQw4w9WgXcQ", title: "Les Moyennes Mobiles", desc: "Utiliser les MM20, MM50, MM200 pour identifier les tendances.", level: "intermediaire", duration: "18:20" }
            ]
        },
        {
            icon: <span className="icon-container primary"><TrendingUp size={22} /></span>, title: "Module 2 : Indicateurs Techniques Avancés",
            videos: [
                { id: "dQw4w9WgXcQ", title: "RSI et Divergences", desc: "Maîtriser le RSI pour détecter les sur-achats et sur-ventes.", level: "intermediaire", duration: "25:10" },
                { id: "dQw4w9WgXcQ", title: "MACD et Signaux", desc: "Utiliser le MACD pour confirmer les tendances et les retournements.", level: "intermediaire", duration: "20:35" },
                { id: "dQw4w9WgXcQ", title: "Ichimoku Cloud", desc: "Analyser les tendances avec l'indicateur japonais Ichimoku.", level: "avance", duration: "30:15" }
            ]
        },
        {
            icon: <span className="icon-container primary"><Target size={22} /></span>, title: "Module 3 : Stratégies de Trading",
            videos: [
                { id: "dQw4w9WgXcQ", title: "Stratégie Swing Trading", desc: "Capturer les mouvements de plusieurs jours avec le swing trading.", level: "intermediaire", duration: "28:40" },
                { id: "dQw4w9WgXcQ", title: "Day Trading Crypto", desc: "Techniques pour trader intraday sur les crypto-monnaies.", level: "avance", duration: "35:20" },
                { id: "dQw4w9WgXcQ", title: "Gestion du Risque", desc: "Risk/Reward, stop-loss, et taille de position optimale.", level: "intermediaire", duration: "22:50" }
            ]
        }
    ]

    const defiModules = [
        {
            icon: <span className="icon-container secondary"><Globe size={22} /></span>, title: "Module 1 : Introduction à la DeFi",
            videos: [
                { id: "dQw4w9WgXcQ", title: "Qu'est-ce que la DeFi ?", desc: "Comprendre les bases de la finance décentralisée.", level: "debutant", duration: "12:30" },
                { id: "dQw4w9WgXcQ", title: "Wallets et Sécurité", desc: "Configurer MetaMask et sécuriser vos fonds.", level: "debutant", duration: "18:45" },
                { id: "dQw4w9WgXcQ", title: "Les DEX Expliqués", desc: "Utiliser Uniswap, PancakeSwap et autres DEX.", level: "intermediaire", duration: "25:10" }
            ]
        },
        {
            icon: <span className="icon-container accent"><Gem size={22} /></span>, title: "Module 2 : Staking et Yield Farming",
            videos: [
                { id: "dQw4w9WgXcQ", title: "Le Staking Expliqué", desc: "Comment staker vos cryptos et gagner des récompenses.", level: "intermediaire", duration: "20:30" },
                { id: "dQw4w9WgXcQ", title: "Yield Farming Basics", desc: "Fournir de la liquidité et optimiser vos rendements.", level: "intermediaire", duration: "28:15" },
                { id: "dQw4w9WgXcQ", title: "Impermanent Loss", desc: "Comprendre et gérer la perte impermanente.", level: "avance", duration: "22:40" }
            ]
        },
        {
            icon: <span className="icon-container primary"><Lock size={22} /></span>, title: "Module 3 : Protocoles DeFi Avancés",
            videos: [
                { id: "dQw4w9WgXcQ", title: "Lending et Borrowing", desc: "Prêter et emprunter avec Aave et Compound.", level: "avance", duration: "30:20" },
                { id: "dQw4w9WgXcQ", title: "Options et Dérivés DeFi", desc: "Trader des options on-chain avec dYdX.", level: "avance", duration: "35:50" },
                { id: "dQw4w9WgXcQ", title: "Bridge et Cross-Chain", desc: "Transférer vos actifs entre différentes blockchains.", level: "avance", duration: "24:15" }
            ]
        }
    ]

    const psychoModules = [
        {
            icon: <span className="icon-container primary"><Brain size={22} /></span>, title: "Module 1 : Psychologie du Trader",
            videos: [
                { id: "dQw4w9WgXcQ", title: "Contrôler ses Émotions", desc: "Gérer la peur et la cupidité en trading.", level: "debutant", duration: "16:30" },
                { id: "dQw4w9WgXcQ", title: "Discipline et Routine", desc: "Créer une routine de trading efficace.", level: "debutant", duration: "14:20" },
                { id: "dQw4w9WgXcQ", title: "Gérer les Pertes", desc: "Accepter et apprendre de ses erreurs.", level: "intermediaire", duration: "19:45" }
            ]
        },
        {
            icon: <span className="icon-container primary"><Flame size={22} /></span>, title: "Module 2 : Mindset Gagnant",
            videos: [
                { id: "dQw4w9WgXcQ", title: "Patience et Long Terme", desc: "Adopter une vision long terme dans ses investissements.", level: "intermediaire", duration: "18:30" },
                { id: "dQw4w9WgXcQ", title: "Éviter le FOMO", desc: "Ne pas succomber à la peur de rater une opportunité.", level: "intermediaire", duration: "15:40" },
                { id: "dQw4w9WgXcQ", title: "Confiance en soi", desc: "Développer la confiance dans ses analyses.", level: "avance", duration: "21:25" }
            ]
        },
        {
            icon: <span className="icon-container primary"><Zap size={22} /></span>, title: "Module 3 : Gestion du Capital",
            videos: [
                { id: "dQw4w9WgXcQ", title: "Money Management", desc: "Principes fondamentaux de gestion de capital.", level: "intermediaire", duration: "23:10" },
                { id: "dQw4w9WgXcQ", title: "Diversification", desc: "Construire un portefeuille équilibré.", level: "intermediaire", duration: "20:35" },
                { id: "dQw4w9WgXcQ", title: "Position Sizing", desc: "Calculer la taille optimale de vos positions.", level: "avance", duration: "26:50" }
            ]
        }
    ]

    const getModules = () => {
        if (category === 'trading') return tradingModules
        if (category === 'defi') return defiModules
        if (category === 'psycho') return psychoModules
        return []
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
                                    <div className="video-container" style={{ position: 'relative' }}>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${video.id}`}
                                            allowFullScreen
                                            title={video.title}
                                            style={!isAuthenticated ? { filter: 'blur(10px)', pointerEvents: 'none' } : {}}
                                        ></iframe>
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
