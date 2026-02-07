
import React, { useState, useEffect } from 'react'

const News = () => {
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const [news, setNews] = useState([])
    const [error, setError] = useState(null)

    const categorizeNews = (title, description) => {
        const text = `${title} ${description}`.toLowerCase()
        if (text.includes('bitcoin') || text.includes('btc')) return 'bitcoin'
        if (text.includes('ethereum') || text.includes('eth')) return 'ethereum'
        if (text.includes('defi') || text.includes('decentralized')) return 'defi'
        if (text.includes('nft') || text.includes('non-fungible')) return 'nft'
        if (text.includes('regulation') || text.includes('sec') || text.includes('regulatory')) return 'regulation'
        if (text.includes('solana') || text.includes('cardano') || text.includes('altcoin') || text.includes('binance') || text.includes('ripple') || text.includes('xrp')) return 'altcoin'
        return 'default'
    }

    const fetchNewsFromAPI = async () => {
        try {
            setLoading(true)
            setError(null)

            // Utiliser l'API CryptoCompare News (gratuite, pas de clé nécessaire)
            const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN')
            const data = await response.json()

            if (data.Response === 'Success' && data.Data) {
                const formattedNews = data.Data.slice(0, 12).map(item => ({
                    title: item.title,
                    url: item.url,
                    image: item.imageurl || 'https://via.placeholder.com/400x240/1A1F3A/00D9FF?text=Crypto+News',
                    excerpt: item.body.substring(0, 150) + '...',
                    date: getTimeAgo(item.published_on * 1000),
                    category: categorizeNews(item.title, item.body),
                    source: item.source_info.name
                }))
                setNews(formattedNews)

                // Sauvegarder dans le cache
                localStorage.setItem('cryptoNewsCache', JSON.stringify(formattedNews))
                localStorage.setItem('cryptoNewsCacheTime', Date.now().toString())
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des actualités:', err)
            setError('Impossible de charger les actualités. Utilisation du cache.')

            // Utiliser le cache en cas d'erreur
            const cached = localStorage.getItem('cryptoNewsCache')
            if (cached) {
                setNews(JSON.parse(cached))
            } else {
                // Fallback data en cas d'échec total
                setNews(getFallbackNews())
            }
        } finally {
            setLoading(false)
        }
    }

    const getTimeAgo = (timestamp) => {
        const now = Date.now()
        const diff = now - timestamp
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const days = Math.floor(hours / 24)

        if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`
        if (hours > 0) return `Il y a ${hours}h`
        const minutes = Math.floor(diff / (1000 * 60))
        return `Il y a ${minutes}min`
    }

    const getFallbackNews = () => [
        {
            title: "Bitcoin franchit les 100 000$ : Une nouvelle ère pour la crypto",
            url: "https://cryptoast.fr",
            image: "https://via.placeholder.com/400x240/1A1F3A/F7931A?text=Bitcoin",
            excerpt: "Le Bitcoin atteint un nouveau record historique. Les analystes de La Sphere prévoient une continuation...",
            date: "Il y a 2h",
            category: "bitcoin",
            source: "La Sphere"
        },
        {
            title: "Ethereum 2.0 : Migration réussie vers la preuve d'enjeu",
            url: "https://cryptoast.fr",
            image: "https://via.placeholder.com/400x240/1A1F3A/627EEA?text=Ethereum",
            excerpt: "La transition d'Ethereum s'est déroulée sans accroc, marquant une étape majeure...",
            date: "Il y a 5h",
            category: "ethereum",
            source: "La Sphere"
        },
        {
            title: "Les protocoles DeFi enregistrent 50 milliards de TVL",
            url: "https://cryptoast.fr",
            image: "https://via.placeholder.com/400x240/1A1F3A/7B2FF7?text=DeFi",
            excerpt: "La finance décentralisée continue sa croissance exponentielle...",
            date: "Hier",
            category: "defi",
            source: "La Sphere"
        },
        {
            title: "Régulation crypto : L'UE adopte le cadre MiCA",
            url: "https://cryptoast.fr",
            image: "https://via.placeholder.com/400x240/1A1F3A/FF3366?text=Regulation",
            excerpt: "L'Union Européenne finalise son cadre réglementaire pour les crypto-actifs...",
            date: "Il y a 1 jour",
            category: "regulation",
            source: "La Sphere"
        },
        {
            title: "Solana dépasse Ethereum en transactions quotidiennes",
            url: "https://cryptoast.fr",
            image: "https://via.placeholder.com/400x240/1A1F3A/00D9FF?text=Solana",
            excerpt: "La blockchain Solana enregistre un nouveau record de transactions...",
            date: "Il y a 1 jour",
            category: "altcoin",
            source: "La Sphere"
        },
        {
            title: "Les NFTs reviennent en force en 2026",
            url: "https://cryptoast.fr",
            image: "https://via.placeholder.com/400x240/1A1F3A/FFD700?text=NFT",
            excerpt: "Le marché des NFTs connaît un regain d'intérêt avec +200% de volumes...",
            date: "Il y a 2 jours",
            category: "nft",
            source: "La Sphere"
        },
        {
            title: "Cardano : Mise à jour majeure du réseau prévue",
            url: "https://cryptoast.fr",
            image: "https://via.placeholder.com/400x240/1A1F3A/00D9FF?text=Cardano",
            excerpt: "Une mise à jour importante devrait améliorer les performances de Cardano...",
            date: "Il y a 2 jours",
            category: "altcoin",
            source: "La Sphere"
        },
        {
            title: "Le staking Ethereum dépasse 20 millions d'ETH",
            url: "https://cryptoast.fr",
            image: "https://via.placeholder.com/400x240/1A1F3A/627EEA?text=Staking",
            excerpt: "Record historique avec 16% de l'offre totale d'ETH stakée...",
            date: "Il y a 3 jours",
            category: "ethereum",
            source: "La Sphere"
        }
    ];

    useEffect(() => {
        // Vérifier le cache (valide pendant 30 minutes)
        const cached = localStorage.getItem('cryptoNewsCache')
        const cacheTime = localStorage.getItem('cryptoNewsCacheTime')

        if (cached && cacheTime) {
            const cacheAge = Date.now() - parseInt(cacheTime)
            const thirtyMinutes = 30 * 60 * 1000

            if (cacheAge < thirtyMinutes) {
                console.log('📦 Utilisation du cache des actualités')
                setNews(JSON.parse(cached))
                setLoading(false)
                return
            }
        }

        // Sinon, récupérer depuis l'API
        fetchNewsFromAPI()
    }, []);

    const handleFilter = (category) => {
        setFilter(category);
    }

    const filteredNews = filter === 'all' ? news : news.filter(n => n.category === filter);

    const getCategoryClass = (cat) => {
        const classes = {
            'bitcoin': 'category-bitcoin',
            'ethereum': 'category-ethereum',
            'altcoin': 'category-altcoin',
            'defi': 'category-defi',
            'nft': 'category-nft',
            'regulation': 'category-regulation'
        };
        return classes[cat] || 'category-default';
    }

    const getCategoryLabel = (cat) => {
        const labels = {
            'bitcoin': '₿ Bitcoin',
            'ethereum': 'Ξ Ethereum',
            'altcoin': '🪙 Altcoin',
            'defi': '💎 DeFi',
            'nft': '🎨 NFT',
            'regulation': '⚖️ Régulation'
        };
        return labels[cat] || '📰 Actualité';
    }

    const refreshNews = () => {
        console.log('🔄 Actualisation manuelle des actualités')
        fetchNewsFromAPI()
    }

    return (
        <section className="news-section">
            <div className="news-header">
                <div className="news-badge">📰 EN TEMPS RÉEL</div>
                <h1>ACTUALITÉS CRYPTO</h1>
                <p>
                    Les dernières news du monde de la cryptomonnaie, mises à jour en temps réel depuis CryptoCompare
                </p>
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}
            </div>

            <div className="news-controls">
                <div className="news-filter">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => handleFilter('all')}>Toutes</button>
                    <button className={`filter-btn ${filter === 'bitcoin' ? 'active' : ''}`} onClick={() => handleFilter('bitcoin')}>Bitcoin</button>
                    <button className={`filter-btn ${filter === 'ethereum' ? 'active' : ''}`} onClick={() => handleFilter('ethereum')}>Ethereum</button>
                    <button className={`filter-btn ${filter === 'altcoin' ? 'active' : ''}`} onClick={() => handleFilter('altcoin')}>Altcoins</button>
                    <button className={`filter-btn ${filter === 'defi' ? 'active' : ''}`} onClick={() => handleFilter('defi')}>DeFi</button>
                </div>
                <button className="refresh-news-btn" onClick={refreshNews}>
                    <span id="refresh-icon">🔄</span>
                    <span id="refresh-text">Actualiser</span>
                </button>
            </div>

            <div id="news-container">
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p className="loading-text">Chargement des actualités...</p>
                    </div>
                ) : (
                    <div className="news-grid">
                        {filteredNews.map((item, index) => (
                            <div className="news-card" data-category={item.category} key={index}>
                                <div className="news-image">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="news-content">
                                    <div className="news-meta">
                                        <span className={`news-category ${getCategoryClass(item.category)}`}>
                                            {getCategoryLabel(item.category)}
                                        </span>
                                        <span className="news-date">🕐 {item.date}</span>
                                    </div>
                                    <h3 className="news-title">{item.title}</h3>
                                    <p className="news-excerpt">{item.excerpt}</p>
                                    <div className="news-footer">
                                        <span className="news-source">📰 {item.source}</span>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="read-more">Lire la suite →</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default News
