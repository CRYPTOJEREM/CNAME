const { readDatabase, writeDatabase } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Script pour créer 9 formations avec 54+ modules
 * Inspiré du système "The Real World"
 */

const formations = [
    // ========== TRADING (4 formations) ==========
    {
        id: `formation-${uuidv4()}`,
        title: "Analyse Technique Débutant",
        slug: "analyse-technique-debutant",
        type: "formation",
        level: "free",
        category: "trading",
        description: "Apprenez les bases de l'analyse technique pour comprendre les graphiques et anticiper les mouvements de prix. Formation gratuite accessible à tous.",
        thumbnail: "",
        duration: "3h30",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "Introduction à l'Analyse Technique", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "15:30" },
            { id: `mod-${uuidv4()}`, title: "Supports et Résistances", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "22:45" },
            { id: `mod-${uuidv4()}`, title: "Les Figures Chartistes Classiques", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "18:20" },
            { id: `mod-${uuidv4()}`, title: "Les Moyennes Mobiles (MM20, MM50, MM200)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "25:10" },
            { id: `mod-${uuidv4()}`, title: "Les Tendances et Canaux", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "20:35" },
            { id: `mod-${uuidv4()}`, title: "Volume et Indicateurs de Volume", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, duration: "19:15" },
            { id: `mod-${uuidv4()}`, title: "Timeframes: Quelle Unité de Temps Choisir?", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 6, duration: "17:40" }
        ]
    },
    {
        id: `formation-${uuidv4()}`,
        title: "Trading Avancé - Indicateurs & Stratégies",
        slug: "trading-avance",
        type: "formation",
        level: "premium",
        category: "trading",
        description: "Maîtrisez les indicateurs techniques avancés et développez vos propres stratégies de trading gagnantes. Formation réservée aux membres Premium.",
        thumbnail: "",
        duration: "5h45",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "RSI - Relative Strength Index", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "25:10" },
            { id: `mod-${uuidv4()}`, title: "MACD - Moving Average Convergence Divergence", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "28:30" },
            { id: `mod-${uuidv4()}`, title: "Bollinger Bands et Volatilité", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "22:15" },
            { id: `mod-${uuidv4()}`, title: "Ichimoku Cloud - Indicateur Complet", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "35:20" },
            { id: `mod-${uuidv4()}`, title: "Fibonacci Retracements et Extensions", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "30:45" },
            { id: `mod-${uuidv4()}`, title: "Divergences: RSI, MACD, Volume", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, duration: "27:10" },
            { id: `mod-${uuidv4()}`, title: "Stratégie Swing Trading", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 6, duration: "32:50" }
        ]
    },
    {
        id: `formation-${uuidv4()}`,
        title: "Stratégies Professionnelles",
        slug: "strategies-professionnelles",
        type: "formation",
        level: "vip",
        category: "trading",
        description: "Les stratégies avancées utilisées par les traders professionnels. Scalping, arbitrage, market making. Formation exclusive VIP.",
        thumbnail: "",
        duration: "8h20",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "Introduction au Trading Professionnel", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "18:30" },
            { id: `mod-${uuidv4()}`, title: "Scalping: Stratégies Court Terme", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "42:15" },
            { id: `mod-${uuidv4()}`, title: "Day Trading: Ouvrir et Fermer dans la Journée", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "38:50" },
            { id: `mod-${uuidv4()}`, title: "Position Trading: Vision Long Terme", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "35:20" },
            { id: `mod-${uuidv4()}`, title: "Arbitrage entre Exchanges", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "45:10" },
            { id: `mod-${uuidv4()}`, title: "Market Making et Liquidité", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, duration: "40:25" },
            { id: `mod-${uuidv4()}`, title: "Trading Algorithmique - Introduction", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 6, duration: "48:30" },
            { id: `mod-${uuidv4()}`, title: "Backtesting: Tester vos Stratégies", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 7, duration: "35:40" },
            { id: `mod-${uuidv4()}`, title: "Gestion Avancée du Risque", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 8, duration: "32:15" },
            { id: `mod-${uuidv4()}`, title: "Psychologie du Trader Pro", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 9, duration: "28:45" }
        ]
    },
    {
        id: `formation-${uuidv4()}`,
        title: "Scalping & Day Trading Expert",
        slug: "scalping-day-trading",
        type: "formation",
        level: "vip",
        category: "trading",
        description: "Devenez un expert du scalping et du day trading. Techniques avancées, outils professionnels, gestion du stress. VIP uniquement.",
        thumbnail: "",
        duration: "7h15",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "Mindset du Scalper", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "22:30" },
            { id: `mod-${uuidv4()}`, title: "Outils et Plateformes pour Scalper", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "35:20" },
            { id: `mod-${uuidv4()}`, title: "Scalping 1-Minute Charts", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "42:15" },
            { id: `mod-${uuidv4()}`, title: "Scalping 5-Minute Charts", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "38:50" },
            { id: `mod-${uuidv4()}`, title: "Order Flow et Carnet d'Ordres", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "45:40" },
            { id: `mod-${uuidv4()}`, title: "Lecture de la Tape (Time & Sales)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, duration: "40:25" },
            { id: `mod-${uuidv4()}`, title: "Day Trading: Stratégies Intraday", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 6, duration: "48:30" },
            { id: `mod-${uuidv4()}`, title: "Gestion des Émotions en Scalping", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 7, duration: "28:45" }
        ]
    },

    // ========== DEFI (3 formations) ==========
    {
        id: `formation-${uuidv4()}`,
        title: "Bases DeFi - Finance Décentralisée",
        slug: "bases-defi",
        type: "formation",
        level: "free",
        category: "defi",
        description: "Découvrez la finance décentralisée (DeFi): wallets, DEX, tokens. Formation gratuite pour démarrer dans la DeFi en toute sécurité.",
        thumbnail: "",
        duration: "3h15",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "Qu'est-ce que la DeFi?", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "16:30" },
            { id: `mod-${uuidv4()}`, title: "Wallets: MetaMask, Trust Wallet", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "25:45" },
            { id: `mod-${uuidv4()}`, title: "Sécurité: Seed Phrases et Private Keys", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "22:30" },
            { id: `mod-${uuidv4()}`, title: "DEX Expliqués: Uniswap, PancakeSwap", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "28:15" },
            { id: `mod-${uuidv4()}`, title: "Swapper des Tokens", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "20:10" },
            { id: `mod-${uuidv4()}`, title: "Gas Fees et Optimisation", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, duration: "18:40" },
            { id: `mod-${uuidv4()}`, title: "Éviter les Scams dans la DeFi", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 6, duration: "24:25" }
        ]
    },
    {
        id: `formation-${uuidv4()}`,
        title: "Yield Farming & Staking Avancé",
        slug: "yield-farming-staking",
        type: "formation",
        level: "premium",
        category: "defi",
        description: "Maîtrisez le yield farming et le staking pour générer des revenus passifs. Stratégies, risques, optimisation. Premium.",
        thumbnail: "",
        duration: "4h50",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "Introduction au Staking", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "20:30" },
            { id: `mod-${uuidv4()}`, title: "Staking ETH 2.0", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "28:15" },
            { id: `mod-${uuidv4()}`, title: "Liquid Staking: Lido, Rocket Pool", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "32:40" },
            { id: `mod-${uuidv4()}`, title: "Yield Farming: Concepts et Stratégies", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "35:20" },
            { id: `mod-${uuidv4()}`, title: "Fournir de la Liquidité (LP Tokens)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "30:15" },
            { id: `mod-${uuidv4()}`, title: "Impermanent Loss - Comprendre et Gérer", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, duration: "28:50" }
        ]
    },
    {
        id: `formation-${uuidv4()}`,
        title: "DeFi Avancé - Protocoles Complexes",
        slug: "defi-avance",
        type: "formation",
        level: "vip",
        category: "defi",
        description: "Protocoles DeFi avancés: lending, borrowing, options, dérivés. Pour utilisateurs expérimentés. VIP uniquement.",
        thumbnail: "",
        duration: "6h40",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "Lending & Borrowing: Aave, Compound", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "35:20" },
            { id: `mod-${uuidv4()}`, title: "Flash Loans: Arbitrages Instantanés", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "42:15" },
            { id: `mod-${uuidv4()}`, title: "Options DeFi: Hegic, Dopex", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "38:50" },
            { id: `mod-${uuidv4()}`, title: "Perpetuals: dYdX, GMX", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "45:30" },
            { id: `mod-${uuidv4()}`, title: "Bridges Cross-Chain: Sécurité et Risques", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "32:40" },
            { id: `mod-${uuidv4()}`, title: "Layer 2 Solutions: Optimism, Arbitrum", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, duration: "40:15" },
            { id: `mod-${uuidv4()}`, title: "Real Yield vs Ponzinomics", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 6, duration: "28:30" },
            { id: `mod-${uuidv4()}`, title: "Smart Contract Audits: Lire et Comprendre", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 7, duration: "37:20" }
        ]
    },

    // ========== PSYCHOLOGIE (2 formations) ==========
    {
        id: `formation-${uuidv4()}`,
        title: "Psychologie du Trader - Fondamentaux",
        slug: "psychologie-trader",
        type: "formation",
        level: "free",
        category: "psychologie",
        description: "Maîtrisez vos émotions et développez le mindset gagnant du trader. Discipline, gestion du stress, routine. Gratuit.",
        thumbnail: "",
        duration: "2h45",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "Les Émotions du Trader: Peur et Cupidité", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "18:30" },
            { id: `mod-${uuidv4()}`, title: "Créer une Routine de Trading", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "22:15" },
            { id: `mod-${uuidv4()}`, title: "Gérer les Pertes et Drawdowns", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "25:40" },
            { id: `mod-${uuidv4()}`, title: "Éviter le FOMO (Fear Of Missing Out)", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "20:35" },
            { id: `mod-${uuidv4()}`, title: "Patience et Vision Long Terme", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "19:20" },
            { id: `mod-${uuidv4()}`, title: "Journal de Trading: Documenter vos Trades", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, duration: "24:45" }
        ]
    },
    {
        id: `formation-${uuidv4()}`,
        title: "Discipline & Money Management",
        slug: "discipline-money-management",
        type: "formation",
        level: "premium",
        category: "psychologie",
        description: "Gestion du capital, position sizing, risk management. Devenez un trader discipliné et rentable. Premium.",
        thumbnail: "",
        duration: "4h10",
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        modules: [
            { id: `mod-${uuidv4()}`, title: "Money Management: Les Bases", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 0, duration: "28:30" },
            { id: `mod-${uuidv4()}`, title: "Position Sizing: Combien Investir?", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, duration: "32:15" },
            { id: `mod-${uuidv4()}`, title: "Risk/Reward Ratio Optimal", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, duration: "25:40" },
            { id: `mod-${uuidv4()}`, title: "Diversification de Portefeuille", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, duration: "30:20" },
            { id: `mod-${uuidv4()}`, title: "Discipline: Respecter son Plan de Trading", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, duration: "23:25" }
        ]
    }
];

async function seedFormations() {
    try {
        const db = readDatabase();

        // Supprimer les anciennes formations de type "formation"
        db.memberContent = db.memberContent.filter(c => c.type !== 'formation');

        // Ajouter les nouvelles formations
        db.memberContent.push(...formations);

        writeDatabase(db);

        console.log('✅ Formations créées avec succès!');
        console.log(`📊 Total: ${formations.length} formations`);
        console.log(`📚 Total modules: ${formations.reduce((acc, f) => acc + f.modules.length, 0)}`);
        console.log('\nRépartition par niveau:');
        console.log(`  - Free: ${formations.filter(f => f.level === 'free').length} formations`);
        console.log(`  - Premium: ${formations.filter(f => f.level === 'premium').length} formations`);
        console.log(`  - VIP: ${formations.filter(f => f.level === 'vip').length} formations`);
        console.log('\nRépartition par catégorie:');
        console.log(`  - Trading: ${formations.filter(f => f.category === 'trading').length} formations`);
        console.log(`  - DeFi: ${formations.filter(f => f.category === 'defi').length} formations`);
        console.log(`  - Psychologie: ${formations.filter(f => f.category === 'psychologie').length} formations`);

    } catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        process.exit(1);
    }
}

// Exécuter le seed
seedFormations();
