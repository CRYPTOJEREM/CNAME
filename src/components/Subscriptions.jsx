
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

const Subscriptions = () => {
    const { isAuthenticated, user } = useAuth()
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState('eth')

    // Adresse de réception des paiements
    const PAYMENT_ADDRESS = '0xa1FB5Fa1F917BC1D4BC9C2F883f07eF878100a77'

    const subscriptionPlans = [
        {
            id: 'free',
            name: '🆓 GRATUIT',
            price: 0,
            currency: 'EUR',
            period: 'À vie',
            badge: 'Communauté',
            badgeColor: 'rgba(0, 217, 255, 0.2)',
            features: [
                '✅ Accès au Dashboard Crypto en temps réel',
                '✅ Calendrier économique US',
                '✅ Actualités crypto quotidiennes',
                '✅ Groupe Telegram gratuit',
                '✅ Accès aux vidéos YouTube/Twitch',
                '❌ Analyses premium',
                '❌ Signaux de trading',
                '❌ Support prioritaire',
                '❌ Formations exclusives'
            ],
            buttonText: 'Déjà actif',
            disabled: true
        },
        {
            id: 'premium',
            name: '⭐ PREMIUM',
            price: 29.99,
            priceEth: '0.015',
            priceUsdt: '30',
            currency: 'EUR',
            period: '/mois',
            badge: 'Populaire',
            badgeColor: 'rgba(255, 215, 0, 0.2)',
            popular: true,
            features: [
                '✅ Tout du plan GRATUIT',
                '✅ Analyses techniques quotidiennes',
                '✅ Signaux de trading (5-10/semaine)',
                '✅ Alertes prix personnalisées',
                '✅ Groupe Telegram Premium',
                '✅ Webinaires mensuels exclusifs',
                '✅ Support prioritaire 24/7',
                '✅ Accès anticipé aux nouvelles features',
                '❌ Formations avancées exclusives'
            ],
            buttonText: 'Choisir Premium',
            disabled: false
        },
        {
            id: 'vip',
            name: '💎 VIP',
            price: 99.99,
            priceEth: '0.05',
            priceUsdt: '100',
            currency: 'EUR',
            period: '/mois',
            badge: 'Elite',
            badgeColor: 'rgba(123, 47, 247, 0.2)',
            features: [
                '✅ Tout du plan PREMIUM',
                '✅ Analyses approfondies quotidiennes',
                '✅ Signaux de trading illimités',
                '✅ Appels vidéo 1-on-1 mensuels',
                '✅ Formations avancées exclusives',
                '✅ Portfolio review personnalisé',
                '✅ Accès à la salle de trading privée',
                '✅ NFTs exclusifs La Sphere',
                '✅ Réductions partenaires'
            ],
            buttonText: 'Choisir VIP',
            disabled: false
        }
    ]

    const cryptoOptions = [
        { id: 'eth', name: 'Ethereum (ETH)', icon: 'Ξ', color: '#627EEA' },
        { id: 'usdt', name: 'Tether (USDT)', icon: '₮', color: '#26A17B' },
        { id: 'bnb', name: 'BNB', icon: '🔸', color: '#F3BA2F' },
        { id: 'usdc', name: 'USD Coin (USDC)', icon: '💵', color: '#2775CA' }
    ]

    const handleSubscribe = (plan) => {
        if (plan.disabled) return
        setSelectedPlan(plan)
        setShowPaymentModal(true)
    }

    const handleNowPaymentsCheckout = async (plan) => {
        // Vérifier si l'utilisateur est connecté
        if (!isAuthenticated) {
            const shouldLogin = window.confirm(
                '🔐 Vous devez être connecté pour souscrire à un abonnement.\n\n' +
                'Voulez-vous vous connecter maintenant ?'
            )
            if (shouldLogin) {
                // Rediriger vers la page de connexion
                window.activeTabSetter('login')
            }
            return
        }

        // Vérifier si l'utilisateur a un pseudo Telegram
        if (!user.telegramUsername && (plan.id === 'premium' || plan.id === 'vip')) {
            const shouldAddTelegram = window.confirm(
                '📱 Un pseudo Telegram est requis pour les abonnements Premium/VIP.\n\n' +
                'Voulez-vous ajouter votre pseudo Telegram dans votre profil maintenant ?'
            )
            if (shouldAddTelegram) {
                window.activeTabSetter('membre')
            }
            return
        }

        // Envoyer les informations au backend
        try {
            const response = await api.post('/create-payment', {
                planId: plan.id,
                planName: plan.name,
                price: plan.price
            })

            if (response.data.success && response.data.invoiceUrl) {
                // Ouvrir la page de paiement NOWPayments
                window.open(response.data.invoiceUrl, '_blank')
                setShowPaymentModal(false)
                alert(
                    '✅ Page de paiement ouverte!\n\n' +
                    'Après confirmation du paiement, votre abonnement sera automatiquement activé.' +
                    (user.telegramUsername ? '\nVous recevrez également une invitation Telegram.' : '')
                )
            } else {
                alert('❌ Erreur lors de la création du paiement')
            }
        } catch (error) {
            console.error('Erreur:', error)
            if (error.response?.status === 401) {
                alert('❌ Session expirée. Veuillez vous reconnecter.')
                window.activeTabSetter('login')
            } else {
                alert('❌ Erreur lors de la création du paiement. Veuillez réessayer.')
            }
        }
    }

    const getPrice = (plan) => {
        if (paymentMethod === 'eth') return plan.priceEth + ' ETH'
        if (paymentMethod === 'usdt' || paymentMethod === 'usdc') return plan.priceUsdt + ' ' + paymentMethod.toUpperCase()
        if (paymentMethod === 'bnb') return (parseFloat(plan.priceEth) * 0.3).toFixed(3) + ' BNB'
        return plan.price + ' ' + plan.currency
    }

    const handlePayment = async () => {
        if (!window.ethereum) {
            alert('⚠️ Veuillez installer MetaMask pour effectuer des paiements crypto!')
            window.open('https://metamask.io/download/', '_blank')
            return
        }

        try {
            // Demander la connexion au wallet
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const account = accounts[0]

            // Calculer le montant en Wei (pour ETH)
            let amount
            if (paymentMethod === 'eth') {
                amount = (parseFloat(selectedPlan.priceEth) * 1e18).toString(16)
            } else {
                // Pour les stablecoins, il faudrait utiliser un contrat ERC-20
                alert('⚠️ Les paiements en stablecoins seront bientôt disponibles. Utilisez ETH pour le moment.')
                return
            }

            // Préparer la transaction
            const transactionParameters = {
                from: account,
                to: PAYMENT_ADDRESS,
                value: '0x' + amount,
                gas: '0x5208', // 21000 gas
            }

            // Envoyer la transaction
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            })

            alert(`✅ Paiement envoyé! Hash de transaction: ${txHash}\n\nVotre abonnement sera activé sous quelques minutes.`)
            setShowPaymentModal(false)

            // Ici, vous devriez normalement envoyer le txHash à votre backend pour vérification
            console.log('Transaction hash:', txHash)
            console.log('Plan:', selectedPlan.id)
            console.log('User address:', account)

        } catch (error) {
            console.error('Erreur de paiement:', error)
            alert('❌ Erreur lors du paiement: ' + error.message)
        }
    }

    const copyAddress = () => {
        navigator.clipboard.writeText(PAYMENT_ADDRESS)
        alert('✅ Adresse copiée dans le presse-papier!')
    }

    return (
        <section className="partners-section">
            {/* Hero Section - Présentation du groupe */}
            <div className="subscription-hero">
                <div className="hero-content">
                    <div className="hero-badge-container">
                        <div className="hero-badge">💎 COMMUNAUTÉ PREMIUM</div>
                        <div className="hero-badge-live">🔴 +47 membres cette semaine</div>
                    </div>
                    <h1 className="hero-title">
                        Rejoignez <span className="gradient-text">La Sphere</span>
                        <br />
                        <span className="hero-subtitle">La Communauté Crypto Elite Francophone</span>
                    </h1>
                    <p className="hero-description">
                        Plus de <strong className="highlight-number">2 000+ traders</strong> nous font déjà confiance pour maximiser leurs gains.
                        <br />
                        Ne laissez plus passer les opportunités qui peuvent changer votre vie.
                    </p>

                    {/* CTA Hero */}
                    <div className="hero-cta-container">
                        <button className="hero-cta-primary" onClick={() => {
                            document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
                        }}>
                            <span className="cta-icon">🚀</span>
                            <span>Commencer Maintenant</span>
                            <span className="cta-arrow">→</span>
                        </button>
                        <button className="hero-cta-secondary" onClick={() => {
                            document.querySelector('.why-join-section').scrollIntoView({ behavior: 'smooth' });
                        }}>
                            En savoir plus
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="hero-trust-badges">
                        <div className="trust-badge">
                            <span className="trust-icon">✅</span>
                            <span className="trust-text">Paiement 100% sécurisé</span>
                        </div>
                        <div className="trust-badge">
                            <span className="trust-icon">🔒</span>
                            <span className="trust-text">Données chiffrées</span>
                        </div>
                        <div className="trust-badge">
                            <span className="trust-icon">⚡</span>
                            <span className="trust-text">Accès instantané</span>
                        </div>
                        <div className="trust-badge">
                            <span className="trust-icon">🎯</span>
                            <span className="trust-text">Sans engagement</span>
                        </div>
                    </div>

                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-icon">👥</div>
                            <div className="hero-stat-value">2K+</div>
                            <div className="hero-stat-label">Membres actifs</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-icon">⭐</div>
                            <div className="hero-stat-value">4.9/5</div>
                            <div className="hero-stat-label">Note moyenne</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-icon">💰</div>
                            <div className="hero-stat-value">+287%</div>
                            <div className="hero-stat-label">ROI moyen 2025</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-icon">📡</div>
                            <div className="hero-stat-value">150+</div>
                            <div className="hero-stat-label">Signaux/mois</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section - Témoignages */}
            <div className="testimonials-section">
                <h2 className="section-title">⭐ Ils ont transformé leur trading avec La Sphere</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Grâce aux signaux de La Sphere, j'ai fait x15 sur $PEPE en 3 jours.
                            Les analyses sont précises et le groupe est ultra réactif. Meilleur investissement 2025 !"
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">M</div>
                            <div className="testimonial-info">
                                <div className="testimonial-name">Maxime R.</div>
                                <div className="testimonial-role">Membre VIP depuis 6 mois</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card featured">
                        <div className="testimonial-badge">💎 TÉMOIGNAGE VÉRIFIÉ</div>
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Je suis passé de débutant à trader rentable en 4 mois. Les formations sont complètes,
                            le support est incroyable. J'ai récupéré mon investissement en 2 semaines !"
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">S</div>
                            <div className="testimonial-info">
                                <div className="testimonial-name">Sarah L.</div>
                                <div className="testimonial-role">Membre Premium • +€12,450 en gains</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Les calls memecoins sont juste INSANES. J'ai chopé $WIF à 0.02$ grâce à leur veille.
                            Aujourd'hui c'est mon meilleur trade de l'année. Merci La Sphere 🚀"
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">T</div>
                            <div className="testimonial-info">
                                <div className="testimonial-name">Thomas B.</div>
                                <div className="testimonial-role">Membre VIP depuis 1 an</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section - À propos de La Sphere */}
            <div className="about-sphere-section">
                <div className="about-sphere-content">
                    <h2 className="section-title">🌐 Qu'est-ce que La Sphere ?</h2>
                    <p className="section-description">
                        La Sphere est une communauté exclusive de passionnés de crypto qui partagent un objectif commun :
                        maximiser leurs gains dans l'univers des cryptomonnaies, du Web3 et des memecoins.
                    </p>

                    <div className="about-features-grid">
                        <div className="about-feature">
                            <div className="about-feature-icon">📊</div>
                            <h3 className="about-feature-title">Analyses Professionnelles</h3>
                            <p className="about-feature-text">
                                Analyses techniques et fondamentales quotidiennes sur les meilleures opportunités du marché crypto.
                            </p>
                        </div>

                        <div className="about-feature">
                            <div className="about-feature-icon">📡</div>
                            <h3 className="about-feature-title">Signaux de Trading</h3>
                            <p className="about-feature-text">
                                Signaux en temps réel avec points d'entrée, take profit et stop loss précis pour maximiser vos profits.
                            </p>
                        </div>

                        <div className="about-feature">
                            <div className="about-feature-icon">🎓</div>
                            <h3 className="about-feature-title">Formations Exclusives</h3>
                            <p className="about-feature-text">
                                Masterclass complètes sur le trading, l'analyse technique, les memecoins et le Web3.
                            </p>
                        </div>

                        <div className="about-feature">
                            <div className="about-feature-icon">👥</div>
                            <h3 className="about-feature-title">Communauté Active</h3>
                            <p className="about-feature-text">
                                Groupe Telegram privé avec des traders actifs, partage d'expériences et entraide quotidienne.
                            </p>
                        </div>

                        <div className="about-feature">
                            <div className="about-feature-icon">🚀</div>
                            <h3 className="about-feature-title">Memecoins en Avant-Première</h3>
                            <p className="about-feature-text">
                                Découvrez les prochains x10-x100 avant tout le monde grâce à notre veille constante du marché.
                            </p>
                        </div>

                        <div className="about-feature">
                            <div className="about-feature-icon">💬</div>
                            <h3 className="about-feature-title">Support Prioritaire</h3>
                            <p className="about-feature-text">
                                Équipe dédiée disponible 24/7 pour répondre à toutes vos questions et vous accompagner.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section - Résultats Réels */}
            <div className="results-section">
                <h2 className="section-title">📈 Des résultats concrets, pas des promesses</h2>
                <div className="results-grid">
                    <div className="result-card">
                        <div className="result-icon">💰</div>
                        <div className="result-number">+287%</div>
                        <div className="result-label">ROI moyen des membres VIP en 2025</div>
                    </div>
                    <div className="result-card">
                        <div className="result-icon">📊</div>
                        <div className="result-number">78%</div>
                        <div className="result-label">Taux de réussite des signaux</div>
                    </div>
                    <div className="result-card">
                        <div className="result-icon">🎯</div>
                        <div className="result-number">x42</div>
                        <div className="result-label">Meilleur call memecoin (WIF)</div>
                    </div>
                    <div className="result-card">
                        <div className="result-icon">⚡</div>
                        <div className="result-number">&lt;24h</div>
                        <div className="result-label">Temps de réponse du support</div>
                    </div>
                </div>
            </div>

            {/* Section - Pourquoi rejoindre La Sphere */}
            <div className="why-join-section">
                <h2 className="section-title">💡 4 raisons de nous rejoindre dès aujourd'hui</h2>
                <p className="section-description">
                    Découvrez ce qui fait de La Sphere la communauté crypto n°1 en France
                </p>
                <div className="why-join-grid">
                    <div className="why-join-card">
                        <div className="why-join-header">
                            <div className="why-join-number">01</div>
                            <div className="why-join-icon">⏰</div>
                        </div>
                        <h3 className="why-join-title">Gagnez un temps précieux</h3>
                        <p className="why-join-text">
                            Arrêtez de perdre des heures devant les charts. Nos analystes professionnels scannent
                            le marché 24/7 et vous livrent les meilleures opportunités en temps réel.
                        </p>
                        <div className="why-join-benefit">
                            <span className="benefit-check">✓</span> Analyses prêtes à l'emploi
                        </div>
                        <div className="why-join-benefit">
                            <span className="benefit-check">✓</span> Signaux avec point d'entrée précis
                        </div>
                    </div>

                    <div className="why-join-card">
                        <div className="why-join-header">
                            <div className="why-join-number">02</div>
                            <div className="why-join-icon">🛡️</div>
                        </div>
                        <h3 className="why-join-title">Évitez les erreurs coûteuses</h3>
                        <p className="why-join-text">
                            Profitez de 5+ ans d'expérience collective. Ne tombez plus dans les pièges des scams,
                            des faux signaux et des stratégies qui ne fonctionnent pas.
                        </p>
                        <div className="why-join-benefit">
                            <span className="benefit-check">✓</span> Formation complète incluse
                        </div>
                        <div className="why-join-benefit">
                            <span className="benefit-check">✓</span> Support dédié 24/7
                        </div>
                    </div>

                    <div className="why-join-card">
                        <div className="why-join-header">
                            <div className="why-join-number">03</div>
                            <div className="why-join-icon">🚀</div>
                        </div>
                        <h3 className="why-join-title">Accédez aux meilleures opportunités</h3>
                        <p className="why-join-text">
                            Soyez les premiers informés des memecoins x10-x100, des IDO prometteuses et des
                            airdrops lucratifs avant qu'ils n'explosent.
                        </p>
                        <div className="why-join-benefit">
                            <span className="benefit-check">✓</span> Veille 24/7 sur les memecoins
                        </div>
                        <div className="why-join-benefit">
                            <span className="benefit-check">✓</span> Accès early aux nouveaux projets
                        </div>
                    </div>

                    <div className="why-join-card">
                        <div className="why-join-header">
                            <div className="why-join-number">04</div>
                            <div className="why-join-icon">📚</div>
                        </div>
                        <h3 className="why-join-title">Devenez un trader rentable</h3>
                        <p className="why-join-text">
                            Formations de A à Z, webinaires exclusifs, coaching personnalisé. Passez de débutant
                            à trader profitable en quelques mois.
                        </p>
                        <div className="why-join-benefit">
                            <span className="benefit-check">✓</span> Masterclass mensuelles
                        </div>
                        <div className="why-join-benefit">
                            <span className="benefit-check">✓</span> Communauté d'entraide active
                        </div>
                    </div>
                </div>
            </div>

            {/* Section - Plans d'abonnement */}
            <div className="plans-section">
                <div className="partners-header">
                    <h2 className="partners-title">💎 Choisissez votre plan</h2>
                    <p className="partners-subtitle">
                        Investissez dans votre réussite. Tous les plans incluent une garantie satisfait ou remboursé.
                    </p>
                    <div className="pricing-guarantee">
                        <span className="guarantee-icon">🛡️</span>
                        <span className="guarantee-text">Satisfait ou remboursé sous 7 jours</span>
                    </div>
                </div>

                <div className="partners-grid">
                {subscriptionPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`partner-card ${plan.popular ? 'popular-plan' : ''}`}
                    >
                        {plan.popular && (
                            <div className="partner-badge popular">
                                🔥 LE PLUS POPULAIRE
                            </div>
                        )}

                        <div className="partner-logo" style={{ background: plan.badgeColor }}>
                            <div className="partner-logo-text">
                                {plan.name.split(' ')[0]}
                            </div>
                        </div>

                        <h3 className="partner-name">{plan.name.split(' ')[1]}</h3>

                        <div className="partner-price">
                            <div className="price-main">
                                {plan.price === 0 ? 'GRATUIT' : `${plan.price}€`}
                            </div>
                            <div className="price-period">
                                {plan.period}
                            </div>
                            {plan.price > 0 && (
                                <div className="price-crypto">
                                    ou {plan.priceEth} ETH / {plan.priceUsdt} USDT
                                </div>
                            )}
                        </div>

                        <div className="partner-features">
                            {plan.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`partner-feature ${feature.startsWith('✅') ? 'active' : 'inactive'}`}
                                >
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <button
                            className={`partner-btn ${plan.disabled ? 'disabled' : ''} ${plan.popular ? 'popular' : ''}`}
                            onClick={() => handleSubscribe(plan)}
                            disabled={plan.disabled}
                        >
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
                </div>
            </div>

            {/* Section - Bonus et Garanties */}
            <div className="bonus-section">
                <h2 className="section-title">🎁 Bonus exclusifs pour les nouveaux membres</h2>
                <div className="bonus-grid">
                    <div className="bonus-card">
                        <div className="bonus-icon">📚</div>
                        <h3 className="bonus-title">Guide Complet du Trading Crypto</h3>
                        <div className="bonus-value">Valeur: 97€</div>
                        <p className="bonus-description">
                            Ebook de 150+ pages couvrant tous les fondamentaux du trading crypto, de l'analyse technique aux stratégies avancées.
                        </p>
                    </div>

                    <div className="bonus-card">
                        <div className="bonus-icon">🎯</div>
                        <h3 className="bonus-title">Template d'Analyse Personnel</h3>
                        <div className="bonus-value">Valeur: 47€</div>
                        <p className="bonus-description">
                            Nos templates exclusifs utilisés par nos analystes pros pour identifier les meilleures opportunités.
                        </p>
                    </div>

                    <div className="bonus-card">
                        <div className="bonus-icon">📊</div>
                        <h3 className="bonus-title">Accès à notre Portfolio Tracker</h3>
                        <div className="bonus-value">Valeur: 29€/mois</div>
                        <p className="bonus-description">
                            Suivez vos performances en temps réel avec notre outil de tracking développé en interne.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section - Garanties */}
            <div className="guarantees-section">
                <h2 className="section-title">🛡️ Notre engagement envers vous</h2>
                <div className="guarantees-grid">
                    <div className="guarantee-item">
                        <div className="guarantee-icon-large">✅</div>
                        <h3 className="guarantee-title">Satisfait ou Remboursé</h3>
                        <p className="guarantee-text">
                            Testez La Sphere pendant 7 jours. Si vous n'êtes pas satisfait, nous vous remboursons intégralement, sans poser de questions.
                        </p>
                    </div>

                    <div className="guarantee-item">
                        <div className="guarantee-icon-large">🔒</div>
                        <h3 className="guarantee-title">Paiement 100% Sécurisé</h3>
                        <p className="guarantee-text">
                            Transactions chiffrées via blockchain. Vos données bancaires ne sont jamais stockées. Conforme aux normes de sécurité les plus strictes.
                        </p>
                    </div>

                    <div className="guarantee-item">
                        <div className="guarantee-icon-large">⚡</div>
                        <h3 className="guarantee-title">Accès Immédiat</h3>
                        <p className="guarantee-text">
                            Dès votre paiement validé, vous recevez vos accès sous 5 minutes maximum. Commencez à profiter du contenu immédiatement.
                        </p>
                    </div>

                    <div className="guarantee-item">
                        <div className="guarantee-icon-large">🎯</div>
                        <h3 className="guarantee-title">Sans Engagement</h3>
                        <p className="guarantee-text">
                            Résiliez quand vous voulez, en un clic. Pas de frais cachés, pas de période d'engagement minimum. Vous êtes libre.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section - FAQ */}
            <div className="faq-section">
                <h2 className="section-title">❓ Questions Fréquentes</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h3 className="faq-question">💳 Quels moyens de paiement acceptez-vous ?</h3>
                        <p className="faq-answer">
                            Nous acceptons plus de 200 cryptomonnaies via NOWPayments : Bitcoin (BTC), Ethereum (ETH),
                            USDT, USDC, BNB, et bien d'autres. Le paiement est 100% sécurisé et anonyme.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">📱 Comment rejoindre le groupe Telegram ?</h3>
                        <p className="faq-answer">
                            Après votre paiement, vous recevrez automatiquement une invitation au groupe Telegram VIP
                            dans les 5 minutes. Assurez-vous d'avoir entré votre pseudo Telegram lors du paiement.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">🔄 Puis-je résilier mon abonnement ?</h3>
                        <p className="faq-answer">
                            Oui, vous pouvez résilier à tout moment. Il n'y a pas d'engagement. Votre accès restera actif
                            jusqu'à la fin de votre période payée.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">📊 Les signaux sont-ils rentables ?</h3>
                        <p className="faq-answer">
                            Nos signaux ont un taux de réussite moyen de 75-80%. Cependant, le trading comporte des risques.
                            Nous recommandons de ne jamais investir plus que ce que vous pouvez vous permettre de perdre.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">🎓 Y a-t-il du contenu pour débutants ?</h3>
                        <p className="faq-answer">
                            Absolument ! Nous proposons des formations complètes pour tous les niveaux, du débutant complet
                            au trader avancé. Notre communauté est très accueillante pour les nouveaux arrivants.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">⚡ Puis-je passer de Premium à VIP ?</h3>
                        <p className="faq-answer">
                            Oui, vous pouvez upgrader votre abonnement à tout moment. Contactez notre support pour bénéficier
                            d'un crédit proportionnel à votre abonnement actuel.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal de paiement - Design moderne et propre */}
            {showPaymentModal && selectedPlan && (
                <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
                    <div className="payment-modal-new" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="modal-header-new">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="modal-close-new"
                            >
                                ✕
                            </button>
                            <div className="modal-icon-new">{selectedPlan.name.split(' ')[0]}</div>
                            <h2 className="modal-title-new">Finaliser votre abonnement</h2>
                            <div className="modal-plan-badge">{selectedPlan.name}</div>
                        </div>

                        {/* Récapitulatif */}
                        <div className="modal-summary">
                            <div className="summary-row">
                                <span className="summary-label">Plan sélectionné</span>
                                <span className="summary-value">{selectedPlan.name.split(' ')[1]}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Période</span>
                                <span className="summary-value">{selectedPlan.period}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row summary-total">
                                <span className="summary-label">Total à payer</span>
                                <span className="summary-value-large">{selectedPlan.price}€</span>
                            </div>
                        </div>

                        {/* Avantages */}
                        <div className="modal-benefits">
                            <div className="benefit-card">
                                <div className="benefit-icon">🔒</div>
                                <div className="benefit-content">
                                    <div className="benefit-title">Paiement 100% sécurisé</div>
                                    <div className="benefit-text">Traitement via NOWPayments</div>
                                </div>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">💎</div>
                                <div className="benefit-content">
                                    <div className="benefit-title">200+ Cryptomonnaies</div>
                                    <div className="benefit-text">Bitcoin, Ethereum, USDT, etc.</div>
                                </div>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">⚡</div>
                                <div className="benefit-content">
                                    <div className="benefit-title">Accès instantané</div>
                                    <div className="benefit-text">Activation sous 5 minutes</div>
                                </div>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">📱</div>
                                <div className="benefit-content">
                                    <div className="benefit-title">Telegram VIP</div>
                                    <div className="benefit-text">Ajout automatique au groupe</div>
                                </div>
                            </div>
                        </div>

                        {/* Bouton personnalisé NOWPayments */}
                        <button
                            onClick={() => handleNowPaymentsCheckout(selectedPlan)}
                            className="payment-button-new"
                        >
                            <span className="payment-button-icon">🚀</span>
                            <span className="payment-button-text">Payer avec Crypto</span>
                            <span className="payment-button-badge">NOWPayments</span>
                        </button>

                        {/* Lien NOWPayments alternatif */}
                        <div className="payment-alternative">
                            <p className="payment-alternative-text">Ou utilisez le lien direct :</p>
                            <a
                                href="https://nowpayments.io/payment/?iid=6131926923&source=button"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="payment-nowpayments-link"
                            >
                                <img
                                    src="https://nowpayments.io/images/embeds/payment-button-white.svg"
                                    alt="Bouton de paiement Bitcoin et crypto par NOWPayments"
                                    className="payment-nowpayments-img"
                                />
                            </a>
                        </div>

                        {/* Note importante */}
                        <div className="modal-note">
                            <div className="modal-note-icon">ℹ️</div>
                            <div className="modal-note-content">
                                <strong>Processus de paiement :</strong>
                                <ol className="modal-note-list">
                                    <li>Cliquez sur "Payer avec Crypto"</li>
                                    <li>Entrez votre pseudo Telegram</li>
                                    <li>Sélectionnez votre cryptomonnaie</li>
                                    <li>Effectuez le paiement</li>
                                    <li>Recevez votre invitation Telegram automatiquement</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="partners-disclaimer">
                <p className="partners-disclaimer-title">🔒 PAIEMENTS SÉCURISÉS</p>
                <p className="partners-disclaimer-text">
                    Les paiements sont effectués directement via blockchain, garantissant transparence et sécurité.
                    Aucune donnée bancaire n'est stockée. Vous pouvez résilier votre abonnement à tout moment.
                </p>
            </div>
        </section>
    )
}

export default Subscriptions
