
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
                    <div className="hero-badge">💎 COMMUNAUTÉ PREMIUM</div>
                    <h1 className="hero-title">Bienvenue dans La Sphere</h1>
                    <p className="hero-description">
                        La communauté francophone n°1 dédiée au trading crypto, Web3 et memecoins.
                        Rejoignez plus de <strong>2 000+ traders actifs</strong> qui font confiance à nos analyses quotidiennes.
                    </p>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-value">2K+</div>
                            <div className="hero-stat-label">Membres actifs</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">95%</div>
                            <div className="hero-stat-label">Taux satisfaction</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">24/7</div>
                            <div className="hero-stat-label">Support disponible</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-value">150+</div>
                            <div className="hero-stat-label">Signaux/mois</div>
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

            {/* Section - Pourquoi rejoindre La Sphere */}
            <div className="why-join-section">
                <h2 className="section-title">💡 Pourquoi rejoindre La Sphere ?</h2>
                <div className="why-join-grid">
                    <div className="why-join-card">
                        <div className="why-join-number">01</div>
                        <h3 className="why-join-title">Gagnez du temps</h3>
                        <p className="why-join-text">
                            Plus besoin de passer des heures à analyser le marché. Nos experts le font pour vous
                            et vous livrent les meilleures opportunités chaque jour.
                        </p>
                    </div>

                    <div className="why-join-card">
                        <div className="why-join-number">02</div>
                        <h3 className="why-join-title">Évitez les erreurs</h3>
                        <p className="why-join-text">
                            Apprenez des meilleurs et évitez les pièges classiques du trading crypto grâce à
                            notre expérience de plusieurs années sur les marchés.
                        </p>
                    </div>

                    <div className="why-join-card">
                        <div className="why-join-number">03</div>
                        <h3 className="why-join-title">Multipliez vos gains</h3>
                        <p className="why-join-text">
                            Accédez à des opportunités exclusives (memecoins early, IDO, airdrops) que vous ne
                            trouverez nulle part ailleurs.
                        </p>
                    </div>

                    <div className="why-join-card">
                        <div className="why-join-number">04</div>
                        <h3 className="why-join-title">Progressez rapidement</h3>
                        <p className="why-join-text">
                            Formations complètes de débutant à expert, webinaires mensuels et coaching personnalisé
                            pour atteindre vos objectifs.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section - Plans d'abonnement */}
            <div className="plans-section">
                <div className="partners-header">
                    <h2 className="partners-title">💎 NOS ABONNEMENTS</h2>
                    <p className="partners-subtitle">
                        Choisissez le plan qui correspond à vos besoins et accédez à des contenus exclusifs
                    </p>
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
