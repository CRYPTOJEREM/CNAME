
import React from 'react'

const Hero = ({ setActiveTab }) => {
    return (
        <>
            <section className="hero">
                <div className="hero-badge">🚀 VOTRE SOURCE D'INFORMATIONS ÉCONOMIQUES</div>
                <h1>SUIVEZ LES <span className="gradient-text">ÉVÉNEMENTS</span><br />ÉCONOMIQUES MAJEURS</h1>
                <p>Accédez en temps réel aux calendriers économiques, analyses de marchés et actualités financières qui impactent vos investissements.</p>
                <div className="cta-buttons">
                    <button onClick={() => setActiveTab('calendrier')} className="btn btn-primary">📅 Voir le Calendrier</button>
                    <button onClick={() => setActiveTab('fonctionnalites')} className="btn btn-secondary">📊 En Savoir Plus</button>
                </div>
            </section>

            {/* CARROUSEL VIDÉOS YOUTUBE/TWITCH */}
            <section className="carousel-section">
                <div className="carousel-header">
                    <h2 className="carousel-title">🎬 NOS DERNIERS CONTENUS</h2>
                    <p className="carousel-subtitle">Analyses, lives, tutos et actualités crypto en continu</p>
                </div>

                <div className="carousel-container">
                    <div className="carousel-track">
                        {/* Vidéo YouTube 1 */}
                        <div className="video-card">
                            <div className="video-thumbnail">
                                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen></iframe>
                            </div>
                            <div className="video-info">
                                <span className="video-platform platform-youtube">📺 YOUTUBE</span>
                                <div className="video-title">Analyse du Bitcoin - Correction ou Bull Run ?</div>
                                <div className="video-description">Analyse technique complète du BTC avec les niveaux clés à surveiller.</div>
                                <div className="video-stats">
                                    <div className="stat-item">👁️ 15K vues</div>
                                    <div className="stat-item">❤️ 890 likes</div>
                                </div>
                            </div>
                        </div>

                        {/* Vidéo Twitch 1 */}
                        <div className="video-card">
                            <div className="video-thumbnail">
                                <iframe src="https://player.twitch.tv/?video=2354044936&parent=lasphere.xyz&autoplay=false" allowFullScreen></iframe>
                            </div>
                            <div className="video-info">
                                <span className="video-platform platform-twitch">🎮 TWITCH</span>
                                <div className="video-title">Live Trading Session - Analyse des Altcoins</div>
                                <div className="video-description">Session live de 3h avec analyses en direct.</div>
                                <div className="video-stats">
                                    <div className="stat-item">👁️ 8K vues</div>
                                    <div className="stat-item">💬 450 chats</div>
                                </div>
                            </div>
                        </div>

                        {/* Vidéo YouTube 2 */}
                        <div className="video-card">
                            <div className="video-thumbnail">
                                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen></iframe>
                            </div>
                            <div className="video-info">
                                <span className="video-platform platform-youtube">📺 YOUTUBE</span>
                                <div className="video-title">Top 5 des Cryptos à Surveiller en 2026</div>
                                <div className="video-description">Nos prévisions et analyses sur les cryptos prometteuses.</div>
                                <div className="video-stats">
                                    <div className="stat-item">👁️ 22K vues</div>
                                    <div className="stat-item">❤️ 1.2K likes</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION PROJET ÉCOSYSTÈME CRYPTO */}
            <section className="crypto-ecosystem">
                <div className="ecosystem-container">
                    <div className="section-title">
                        <h2>🌐 NOTRE ÉCOSYSTÈME CRYPTO</h2>
                        <p>Un projet innovant au cœur de la révolution blockchain</p>
                    </div>

                    <div className="ecosystem-grid">
                        <div className="ecosystem-card main-card">
                            <div className="card-glow"></div>
                            <span className="ecosystem-icon">🎯</span>
                            <h3>La Vision</h3>
                            <p>
                                <strong>La Sphere</strong> est une communauté de passionnés de crypto et de finance ! Nous
                                créons du contenu quotidien sur YouTube, Twitch et les réseaux sociaux pour démocratiser
                                l'accès à l'information crypto et aider chacun à prendre des décisions éclairées. Notre
                                mission : rendre la crypto accessible à tous, de débutant à expert.
                            </p>
                        </div>

                        <div className="ecosystem-card">
                            <span className="ecosystem-icon">📊</span>
                            <h3>Données en Temps Réel</h3>
                            <p>
                                Suivez les prix, volumes et capitalisations des top cryptomonnaies avec des mises à jour
                                automatiques toutes les 30 secondes. Restez informé des mouvements du marché 24/7.
                            </p>
                        </div>

                        <div className="ecosystem-card">
                            <span className="ecosystem-icon">📅</span>
                            <h3>Calendrier Économique</h3>
                            <p>
                                Ne manquez plus aucun événement économique majeur. Notre calendrier s'actualise
                                automatiquement chaque jour à minuit avec les derniers événements US qui impactent les
                                marchés crypto.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero
