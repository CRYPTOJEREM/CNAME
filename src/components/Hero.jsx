
import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const FALLBACK_VIDEOS = [
    { id: 'f1', platform: 'youtube', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Analyse du Bitcoin - Correction ou Bull Run ?', description: 'Analyse technique complète du BTC avec les niveaux clés à surveiller.', views: '15K vues', engagement: '890 likes' },
    { id: 'f2', platform: 'twitch', embedUrl: 'https://player.twitch.tv/?video=2354044936&parent=lasphere.xyz&autoplay=false', title: 'Live Trading Session - Analyse des Altcoins', description: 'Session live de 3h avec analyses en direct.', views: '8K vues', engagement: '450 chats' },
    { id: 'f3', platform: 'youtube', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Top 5 des Cryptos à Surveiller en 2026', description: 'Nos prévisions et analyses sur les cryptos prometteuses.', views: '22K vues', engagement: '1.2K likes' },
    { id: 'f4', platform: 'youtube', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Tutoriel Débutant - Acheter sa Première Crypto', description: 'Guide complet pour débutants.', views: '35K vues', engagement: '2.1K likes' },
    { id: 'f5', platform: 'twitch', embedUrl: 'https://player.twitch.tv/?video=2354044936&parent=lasphere.xyz&autoplay=false', title: 'NFP Day - Analyse du Rapport Emploi US', description: 'Rediffusion du live spécial NFP.', views: '12K vues', engagement: '780 chats' },
    { id: 'f6', platform: 'youtube', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Ethereum 2.0 - Tout ce qu\'il faut savoir', description: 'Explication complète de l\'écosystème Ethereum.', views: '18K vues', engagement: '950 likes' }
]

const getYoutubeThumbnail = (embedUrl) => {
    const match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/)
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

const getTwitchVideoId = (embedUrl) => {
    const match = embedUrl.match(/video=(\d+)/)
    return match ? match[1] : null
}

const getVideoUrl = (video) => {
    if (video.platform === 'youtube') {
        const match = video.embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/)
        return match ? `https://www.youtube.com/watch?v=${match[1]}` : video.embedUrl
    }
    const videoId = getTwitchVideoId(video.embedUrl)
    return videoId ? `https://www.twitch.tv/videos/${videoId}` : video.embedUrl
}

const VideoCard = ({ video }) => (
    <a href={getVideoUrl(video)} target="_blank" rel="noopener noreferrer" className="video-card" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="video-thumbnail">
            {video.platform === 'youtube' ? (
                <img src={getYoutubeThumbnail(video.embedUrl)} alt={video.title} />
            ) : (
                <div className="twitch-placeholder">
                    <span>🎮</span>
                </div>
            )}
            <div className="video-play-btn">▶</div>
        </div>
        <div className="video-info">
            <span className={`video-platform platform-${video.platform}`}>
                {video.platform === 'youtube' ? '📺 YOUTUBE' : '🎮 TWITCH'}
            </span>
            <div className="video-title">{video.title}</div>
            <div className="video-description">{video.description}</div>
            <div className="video-stats">
                <div className="stat-item">👁️ {video.views}</div>
                <div className="stat-item">{video.platform === 'youtube' ? '❤️' : '💬'} {video.engagement}</div>
            </div>
        </div>
    </a>
)

const Hero = ({ setActiveTab }) => {
    const [videos, setVideos] = useState(FALLBACK_VIDEOS)

    useEffect(() => {
        axios.get(`${API_URL}/carousel`)
            .then(res => {
                if (res.data.success && res.data.data.length > 0) {
                    setVideos(res.data.data)
                }
            })
            .catch(() => {})
    }, [])

    // Dupliquer pour effet boucle infinie
    const carouselVideos = [...videos, ...videos.slice(0, 2)]

    return (
        <>
            <section className="hero">
                <div className="hero-badge">🌐 L'ÉCOSYSTÈME COMMUNAUTAIRE CRYPTO</div>
                <h1>REJOIGNEZ LA <span className="gradient-text">COMMUNAUTÉ</span><br />CRYPTO LA PLUS ACTIVE</h1>
                <p>Intégrez un groupe de passionnés où vous apprendrez, échangerez et progresserez ensemble dans le monde de la crypto. Analyses partagées, stratégies collaboratives et support communautaire 24/7.</p>
                <div className="cta-buttons">
                    <button onClick={() => setActiveTab('abonnements')} className="btn btn-primary">🤝 Rejoindre la Communauté</button>
                    <button onClick={() => setActiveTab('apprentissage')} className="btn btn-secondary">🎓 Découvrir les Formations</button>
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
                        {carouselVideos.map((video, idx) => (
                            <VideoCard key={`${video.id}-${idx}`} video={video} />
                        ))}
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

                        <div className="ecosystem-card">
                            <span className="ecosystem-icon">🎯</span>
                            <h3>Analyses Expertes</h3>
                            <p>
                                Bénéficiez d'analyses approfondies sur les tendances du marché, les mouvements de capitaux
                                et les corrélations entre marchés traditionnels et crypto.
                            </p>
                        </div>

                        <div className="ecosystem-card">
                            <span className="ecosystem-icon">🔔</span>
                            <h3>Contenu Quotidien</h3>
                            <p>
                                Vidéos YouTube, lives Twitch, posts Twitter et contenus éducatifs publiés régulièrement pour
                                vous tenir informé des dernières tendances crypto.
                            </p>
                        </div>

                        <div className="ecosystem-card">
                            <span className="ecosystem-icon">🤝</span>
                            <h3>Communauté Active</h3>
                            <p>
                                Rejoignez des milliers de membres sur Discord et Telegram. Échangez, apprenez et partagez
                                vos stratégies dans une ambiance bienveillante.
                            </p>
                        </div>
                    </div>

                    <div className="community-box">
                        <div className="community-title">
                            <span>🎬</span>
                            <span>Notre Contenu</span>
                        </div>
                        <div className="community-content">
                            <p className="community-intro">
                                <strong>La Sphere</strong> c'est avant tout une communauté passionnée de crypto et de
                                finance ! Rejoignez-nous sur nos différentes plateformes pour du contenu quotidien, des
                                analyses en direct et échanger avec des traders du monde entier.
                            </p>

                            <div className="content-platforms">
                                <div className="platform-item">
                                    <div className="platform-icon youtube">📺</div>
                                    <div className="platform-info">
                                        <h4>YouTube</h4>
                                        <p>Analyses crypto, tutoriels trading, revues de marché et actualités blockchain</p>
                                        <span className="platform-tag">Vidéos quotidiennes</span>
                                    </div>
                                </div>

                                <div className="platform-item">
                                    <div className="platform-icon twitch">🎮</div>
                                    <div className="platform-info">
                                        <h4>Twitch</h4>
                                        <p>Lives trading en direct, analyse de charts, Q&A et sessions communautaires</p>
                                        <span className="platform-tag">Lives réguliers</span>
                                    </div>
                                </div>

                                <div className="platform-item">
                                    <div className="platform-icon twitter">🐦</div>
                                    <div className="platform-info">
                                        <h4>Twitter / X</h4>
                                        <p>Alertes crypto instantanées, analyses rapides et actualités du marché</p>
                                        <span className="platform-tag">Updates temps réel</span>
                                    </div>
                                </div>

                                <div className="platform-item">
                                    <div className="platform-icon discord">💬</div>
                                    <div className="platform-info">
                                        <h4>Discord</h4>
                                        <p>Communauté active 24/7, salons de discussion, signaux et entraide</p>
                                        <span className="platform-tag">Communauté privée</span>
                                    </div>
                                </div>

                                <div className="platform-item">
                                    <div className="platform-icon telegram">📱</div>
                                    <div className="platform-info">
                                        <h4>Telegram</h4>
                                        <p>Groupe VIP, alertes exclusives et analyses premium</p>
                                        <span className="platform-tag">Accès premium</span>
                                    </div>
                                </div>

                                <div className="platform-item">
                                    <div className="platform-icon tiktok">🎵</div>
                                    <div className="platform-info">
                                        <h4>TikTok</h4>
                                        <p>Tips crypto rapides, actualités et éducation en format court</p>
                                        <span className="platform-tag">Contenu court</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION PARTENAIRES CRYPTO */}
                    <div className="partners-section">
                        <div className="partners-header">
                            <h2 className="partners-title">🤝 NOS PARTENAIRES CRYPTO</h2>
                            <p className="partners-subtitle">Tradez en toute sécurité avec nos plateformes partenaires de confiance</p>
                        </div>

                        <div className="partners-grid">
                            {/* MEXC */}
                            <div className="partner-card">
                                <div className="partner-badge recommended">⭐ RECOMMANDÉ</div>
                                <div className="partner-logo">
                                    <div className="partner-logo-text">MEXC</div>
                                </div>
                                <h3 className="partner-name">MEXC</h3>
                                <p className="partner-description">
                                    Plateforme d'échange crypto leader mondial avec plus de 2000 cryptomonnaies disponibles.
                                </p>
                                <div className="partner-features">
                                    <span className="partner-feature-tag">📊 2000+ Cryptos</span>
                                    <span className="partner-feature-tag">💰 Bonus 10%</span>
                                    <span className="partner-feature-tag">⚡ 0% Frais</span>
                                </div>
                                <a href="https://www.mexc.com" target="_blank" rel="noopener noreferrer" className="partner-btn">
                                    🚀 Rejoindre MEXC
                                </a>
                            </div>

                            {/* BLOFIN */}
                            <div className="partner-card">
                                <div className="partner-badge popular">🔥 POPULAIRE</div>
                                <div className="partner-logo">
                                    <div className="partner-logo-text">BLOFIN</div>
                                </div>
                                <h3 className="partner-name">BLOFIN</h3>
                                <p className="partner-description">
                                    Trading professionnel avec leverage jusqu'à 125x. Interface intuitive et liquidité optimale.
                                </p>
                                <div className="partner-features">
                                    <span className="partner-feature-tag">📈 Leverage 125x</span>
                                    <span className="partner-feature-tag">🎁 Bonus 5000$</span>
                                    <span className="partner-feature-tag">🔒 Sécurisé</span>
                                </div>
                                <a href="https://www.blofin.com" target="_blank" rel="noopener noreferrer" className="partner-btn">
                                    🚀 Rejoindre BLOFIN
                                </a>
                            </div>

                            {/* BITUNIX */}
                            <div className="partner-card">
                                <div className="partner-badge new">💎 NOUVEAU</div>
                                <div className="partner-logo">
                                    <div className="partner-logo-text">BITUNIX</div>
                                </div>
                                <h3 className="partner-name">BITUNIX</h3>
                                <p className="partner-description">
                                    Exchange nouvelle génération avec trading social intégré et signaux automatiques.
                                </p>
                                <div className="partner-features">
                                    <span className="partner-feature-tag">👥 Copy Trading</span>
                                    <span className="partner-feature-tag">🎯 Signaux Auto</span>
                                    <span className="partner-feature-tag">💸 Cashback</span>
                                </div>
                                <div className="partner-contest" style={{
                                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 107, 0, 0.1))',
                                    border: '1px solid rgba(255, 215, 0, 0.3)',
                                    borderRadius: '12px',
                                    padding: '12px 16px',
                                    margin: '15px 0',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#FFD700', fontSize: '14px', fontWeight: '700', margin: 0 }}>
                                        🏆 Concours Gratuit chaque semaine
                                    </p>
                                    <p style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '900', margin: '5px 0' }}>
                                        $1,000 de coupon trading
                                    </p>
                                    <p style={{ color: '#7B8BA8', fontSize: '12px', margin: 0 }}>
                                        Inscrivez-vous avec votre Bitunix UID pour participer !
                                    </p>
                                </div>
                                <a href="https://www.bitunix.com" target="_blank" rel="noopener noreferrer" className="partner-btn">
                                    🚀 Rejoindre BITUNIX
                                </a>
                            </div>
                        </div>

                        <div className="partners-disclaimer">
                            <p className="partners-disclaimer-title">⚠️ AVERTISSEMENT</p>
                            <p className="partners-disclaimer-text">
                                Le trading de cryptomonnaies comporte des risques. Ces liens peuvent contenir des codes de parrainage.
                            </p>
                        </div>
                    </div>

                    <div className="stats-community">
                        <div className="stat-box">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Abonnés YouTube</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">5K+</div>
                            <div className="stat-label">Membres Discord</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Lives réalisés</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Support actif</div>
                        </div>
                    </div>

                    <div className="cta-ecosystem">
                        <h3>Rejoignez la Communauté</h3>
                        <p>Choisissez votre niveau d'accès et rejoignez des milliers de passionnés de crypto</p>

                        <div className="telegram-modules">
                            <div className="telegram-card free">
                                <div className="telegram-badge">🆓 GRATUIT</div>
                                <h4>Groupe Telegram Gratuit</h4>
                                <p>Accès aux discussions communautaires, partage d'analyses et actualités crypto</p>
                                <ul className="telegram-features">
                                    <li>✅ Discussions en temps réel</li>
                                    <li>✅ Partage d'analyses</li>
                                    <li>✅ Actualités crypto</li>
                                    <li>✅ Entraide communautaire</li>
                                </ul>
                                <a href="https://t.me/votre-groupe-gratuit" target="_blank" rel="noopener noreferrer" className="telegram-btn free-btn">
                                    <span>📱</span> Rejoindre Gratuitement
                                </a>
                            </div>

                            <div className="telegram-card vip">
                                <div className="telegram-badge vip-badge">⭐ VIP</div>
                                <h4>Groupe Telegram VIP</h4>
                                <p>Accès premium avec signaux exclusifs, analyses approfondies et support prioritaire</p>
                                <ul className="telegram-features">
                                    <li>✅ Signaux de trading exclusifs</li>
                                    <li>✅ Analyses techniques avancées</li>
                                    <li>✅ Support prioritaire 24/7</li>
                                    <li>✅ Alertes en temps réel</li>
                                    <li>✅ Stratégies de trading</li>
                                    <li>✅ Webinaires privés</li>
                                </ul>
                                <a href="https://t.me/votre-groupe-vip" target="_blank" rel="noopener noreferrer" className="telegram-btn vip-btn">
                                    <span>👑</span> Accéder au VIP
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero
