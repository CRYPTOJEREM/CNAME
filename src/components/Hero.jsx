
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

                    {/* SECTION PARTENAIRE CRYPTO — BITUNIX */}
                    <div className="partners-section">
                        <div className="partners-header">
                            <h2 className="partners-title">🤝 NOTRE PARTENAIRE CRYPTO</h2>
                            <p className="partners-subtitle">Tradez sur l'exchange officiel de La Sphere et participez au concours hebdomadaire</p>
                        </div>

                        <div className="bitunix-layout">
                            {/* Grand carre gauche — Presentation */}
                            <div className="bitunix-main-card">
                                <div className="bitunix-badge">💎 PARTENAIRE OFFICIEL</div>
                                <div className="bitunix-logo-wrapper">
                                    <svg viewBox="0 0 200 50" className="bitunix-logo-svg">
                                        <rect width="200" height="50" rx="6" fill="#000000"/>
                                        <path d="M20 15 L30 15 L30 25 L25 25 L25 35 L15 35 L15 25 L20 25 Z" fill="#C8FF00"/>
                                        <circle cx="27" cy="18" r="4" fill="#C8FF00"/>
                                        <text x="42" y="33" fill="#C8FF00" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="22">Bitunix</text>
                                    </svg>
                                </div>
                                <h3 className="bitunix-main-title">BITUNIX</h3>
                                <p className="bitunix-main-description">
                                    Exchange crypto nouvelle generation avec copy trading, signaux automatiques et une interface conçue pour les traders de tous niveaux. Profitez de frais reduits et d'une liquidite optimale.
                                </p>
                                <div className="bitunix-main-tags">
                                    <span className="bitunix-tag">Spot & Futures</span>
                                    <span className="bitunix-tag">Copy Trading</span>
                                    <span className="bitunix-tag">200+ Paires</span>
                                    <span className="bitunix-tag">Signaux Auto</span>
                                </div>
                                <a href="https://www.bitunix.com" target="_blank" rel="noopener noreferrer" className="bitunix-cta-btn">
                                    🚀 Ouvrir un compte Bitunix
                                </a>
                            </div>

                            {/* Petits carres droite — Details */}
                            <div className="bitunix-info-grid">
                                <div className="bitunix-info-card">
                                    <div className="bitunix-info-icon">📈</div>
                                    <h4 className="bitunix-info-title">Trading Avance</h4>
                                    <p className="bitunix-info-text">Leverage jusqu'a 125x sur les futures. Outils pro : TradingView integre, ordres avances, stop-loss.</p>
                                </div>
                                <div className="bitunix-info-card">
                                    <div className="bitunix-info-icon">👥</div>
                                    <h4 className="bitunix-info-title">Copy Trading</h4>
                                    <p className="bitunix-info-text">Copiez les meilleurs traders automatiquement. Suivez leurs positions en temps reel sans effort.</p>
                                </div>
                                <div className="bitunix-info-card">
                                    <div className="bitunix-info-icon">🔒</div>
                                    <h4 className="bitunix-info-title">Securite Maximale</h4>
                                    <p className="bitunix-info-text">Cold storage, authentification 2FA, audits reguliers. Vos fonds sont proteges en permanence.</p>
                                </div>
                                <div className="bitunix-info-card bitunix-contest-card">
                                    <div className="bitunix-info-icon">🏆</div>
                                    <h4 className="bitunix-info-title">Concours $1,000</h4>
                                    <p className="bitunix-info-text">Chaque semaine, un membre gagne $1,000 de coupon trading. Inscrivez-vous avec votre UID pour participer gratuitement !</p>
                                </div>
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
