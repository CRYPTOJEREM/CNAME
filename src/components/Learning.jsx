
import React, { useState } from 'react'

const Learning = () => {
    const [category, setCategory] = useState('trading')

    return (
        <section className="learning-section">
            <div className="learning-header">
                <div className="learning-badge">🎓 FORMATION COMPLÈTE</div>
                <h1>PARCOURS D'APPRENTISSAGE</h1>
                <p>
                    Apprenez le trading et la crypto de zéro à expert grâce à notre parcours pédagogique structuré.
                    Chaque module contient des vidéos détaillées pour vous accompagner dans votre progression.
                </p>
            </div>

            <div className="category-selector">
                <h3 className="category-title">🎯 Choisissez Votre Parcours</h3>
                <div className="category-buttons">
                    <button className={`category-btn ${category === 'trading' ? 'active' : ''}`} onClick={() => setCategory('trading')}>
                        <span className="cat-icon">📊</span>
                        <span className="cat-name">Parcours Trading</span>
                        <span className="cat-desc">Analyse technique & stratégies</span>
                    </button>
                    <button className={`category-btn ${category === 'defi' ? 'active' : ''}`} onClick={() => setCategory('defi')}>
                        <span className="cat-icon">🌐</span>
                        <span className="cat-name">Parcours DeFi</span>
                        <span className="cat-desc">Finance Décentralisée & Web3</span>
                    </button>
                    <button className={`category-btn ${category === 'psycho' ? 'active' : ''}`} onClick={() => setCategory('psycho')}>
                        <span className="cat-icon">🧠</span>
                        <span className="cat-name">Psychologie</span>
                        <span className="cat-desc">Mindset & Gestion du risque</span>
                    </button>
                </div>
            </div>

            <div className="category-content">
                {category === 'trading' && (
                    <div className="module-section">
                        <div className="module-title">
                            <span>📊 Module 1 : Les Bases de l'Analyse Technique</span>
                        </div>
                        <div className="videos-grid">
                            <div className="video-module-card">
                                <div className="video-container">
                                    <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen></iframe>
                                </div>
                                <div className="video-module-info">
                                    <span className="video-level level-debutant">Débutant</span>
                                    <div className="video-module-title">Supports et Résistances</div>
                                    <div className="video-module-description">Apprenez à tracer vos niveaux clés.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Placeholders for other categories */}
                {category !== 'trading' && <div style={{ textAlign: 'center', padding: '50px', color: '#7B8BA8' }}>Contenu à venir pour {category}...</div>}
            </div>
        </section>
    )
}

export default Learning
