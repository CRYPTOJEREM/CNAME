
import React, { useState, useEffect } from 'react'

const Dashboard = () => {
    const [cryptoData, setCryptoData] = useState([])
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(null)

    // Fonction pour formater les nombres
    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'Md';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    }

    // Fonction pour formater le prix
    const formatPrice = (price) => {
        if (!price) return '0.00';
        if (price >= 1000) return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        if (price >= 1) return price.toFixed(2);
        return price.toFixed(4);
    }

    // Fonction pour obtenir l'icône crypto
    const getCryptoIcon = (symbol) => {
        const icons = {
            'btc': '₿', 'eth': 'Ξ', 'usdt': '₮', 'bnb': '🔸', 'sol': '◎',
            'xrp': '◈', 'usdc': '💵', 'ada': '₳', 'avax': '🔺', 'doge': '🐕',
            'dot': '⚫', 'matic': '🟣', 'link': '🔗', 'shib': '🐕', 'trx': '⭕',
            'dai': '💎', 'atom': '⚛️', 'uni': '🦄', 'ltc': 'Ł', 'etc': '💚'
        };
        return icons[symbol.toLowerCase()] || '🪙';
    }

    // Fonction pour obtenir la classe du badge
    const getBadgeClass = (change24h, change7d) => {
        if (change24h > 5 || change7d > 10) return 'badge-trend';
        if (change24h > 2 || change7d > 5) return 'badge-hot';
        return 'badge-watch';
    }

    // Fonction pour obtenir le texte du badge
    const getBadgeText = (symbol, change24h, change7d) => {
        if (symbol.toLowerCase() === 'btc') return '🔥 Dominance';
        if (change24h > 5) return '🚀 Hausse';
        if (change24h > 2) return '📈 Momentum';
        if (change7d > 10) return '⚡ Actif';
        if (Math.abs(change24h) < 0.5) return '💎 Stable';
        return '👀 À suivre';
    }

    // Fonction pour générer les points du chart
    const generateChartPoints = (change) => {
        const isPositive = change >= 0;
        if (isPositive) {
            return '0,22 20,20 40,16 60,12 80,10';
        } else {
            return '0,10 20,12 40,16 60,20 80,24';
        }
    }

    const fetchCryptoData = async () => {
        try {
            console.log('Fetching crypto data...');
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h,7d');
            const data = await response.json();
            setCryptoData(data);
            setLoading(false);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 30000); // Actualiser toutes les 30 secondes
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <div className="header">
                <div className="date-badge">
                    {lastUpdate ? `🔄 MISE À JOUR : ${lastUpdate.toLocaleTimeString('fr-FR')}` : '🔄 CHARGEMENT...'}
                </div>
                <h1 style={{ color: '#FFFFFF' }}>Dashboard Crypto</h1>
                <div className="subtitle" style={{ color: '#00D9FF', fontSize: '16px', fontWeight: 600 }}>Top 20 des cryptomonnaies par capitalisation</div>
            </div>

            <div className="dashboard">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#7B8BA8' }}>Chargement des données...</div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Crypto</th>
                                <th>Prix</th>
                                <th>24h</th>
                                <th>7j</th>
                                <th>Cap. Marché</th>
                                <th>Volume 24h</th>
                                <th>Tendance</th>
                                <th>Chart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cryptoData.map((coin, index) => {
                                const change24h = coin.price_change_percentage_24h || 0;
                                const change7d = coin.price_change_percentage_7d_in_currency || 0;

                                return (
                                    <tr key={coin.id}>
                                        <td className="rank">{index + 1}</td>
                                        <td>
                                            <div className="crypto-info">
                                                <div className="crypto-icon">{getCryptoIcon(coin.symbol)}</div>
                                                <div className="crypto-name">
                                                    <span className="crypto-title">{coin.name}</span>
                                                    <span className="crypto-symbol">{coin.symbol.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="price">{formatPrice(coin.current_price)} €</td>
                                        <td><span className={`change ${change24h >= 0 ? 'positive' : 'negative'}`}>{change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%</span></td>
                                        <td><span className={`change ${change7d >= 0 ? 'positive' : 'negative'}`}>{change7d >= 0 ? '+' : ''}{change7d.toFixed(2)}%</span></td>
                                        <td className="market-cap">
                                            {formatNumber(coin.market_cap)} €
                                            <span className="market-cap-small">{formatNumber(coin.total_volume)} volume</span>
                                        </td>
                                        <td className="volume">{formatNumber(coin.total_volume)} €</td>
                                        <td><span className={`performance-badge ${getBadgeClass(change24h, change7d)}`}>{getBadgeText(coin.symbol, change24h, change7d)}</span></td>
                                        <td>
                                            <svg className="mini-chart" viewBox="0 0 80 32">
                                                <polyline className={`chart-line ${change24h >= 0 ? 'chart-positive' : 'chart-negative'}`} points={generateChartPoints(change24h)} />
                                            </svg>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default Dashboard
