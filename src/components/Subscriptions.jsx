
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import ReviewSubmissionForm from './reviews/ReviewSubmissionForm'
import ReviewsList from './reviews/ReviewsList'

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
            {/* Hero Section avec Vidéo */}
            <div className="subscription-hero-visual">
                <div className="hero-grid">
                    <div className="hero-content-left">
                        <div className="hero-badge">La Sphere</div>
                        <h1 className="hero-title-visual">
                            Développez vos compétences en trading crypto
                        </h1>
                        <p className="hero-description-visual">
                            Une plateforme d'apprentissage et d'accompagnement pour progresser dans l'univers
                            des cryptomonnaies, du Web3 et du trading.
                        </p>

                        <div className="hero-highlights">
                            <div className="highlight-item">
                                <span className="highlight-icon">📊</span>
                                <span className="highlight-text">Analyses quotidiennes</span>
                            </div>
                            <div className="highlight-item">
                                <span className="highlight-icon">🎓</span>
                                <span className="highlight-text">Formations complètes</span>
                            </div>
                            <div className="highlight-item">
                                <span className="highlight-icon">👥</span>
                                <span className="highlight-text">Communauté active</span>
                            </div>
                        </div>

                        <button className="hero-cta-visual" onClick={() => {
                            document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Découvrir les plans
                        </button>
                    </div>

                    <div className="hero-video-container">
                        <div className="video-wrapper">
                            {/* Placeholder pour vidéo - Remplacer l'URL par votre vidéo de présentation */}
                            <iframe
                                className="hero-video"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                title="Présentation La Sphere"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                            <div className="video-overlay">
                                <span className="video-badge">🎥 Découvrez La Sphere en vidéo</span>
                            </div>
                        </div>

                        <div className="video-stats">
                            <div className="video-stat">
                                <span className="stat-icon">✅</span>
                                <span className="stat-label">Contenu vérifié</span>
                            </div>
                            <div className="video-stat">
                                <span className="stat-icon">🎯</span>
                                <span className="stat-label">Formation structurée</span>
                            </div>
                            <div className="video-stat">
                                <span className="stat-icon">💬</span>
                                <span className="stat-label">Support inclus</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section - Les défis du trading crypto */}
            <div className="challenges-section">
                <div className="about-sphere-content">
                    <h2 className="section-title">Les défis du trading de cryptomonnaies</h2>
                    <p className="section-description">
                        Le marché crypto évolue 24/7 avec une volatilité importante. Sans les bonnes ressources
                        et connaissances, il est facile de se perdre dans la masse d'informations disponibles.
                    </p>

                    <div className="about-features-grid">
                        <div className="about-feature visual-card">
                            <div className="feature-icon-large">🌐</div>
                            <h3 className="about-feature-title">Information dispersée</h3>
                            <p className="about-feature-text">
                                Des milliers de sources d'information contradictoires rendent difficile l'identification
                                des analyses fiables et pertinentes.
                            </p>
                        </div>

                        <div className="about-feature visual-card">
                            <div className="feature-icon-large">📈</div>
                            <h3 className="about-feature-title">Courbe d'apprentissage</h3>
                            <p className="about-feature-text">
                                L'analyse technique, la gestion du risque et la psychologie du trading demandent
                                un apprentissage structuré et progressif.
                            </p>
                        </div>

                        <div className="about-feature visual-card">
                            <div className="feature-icon-large">⏰</div>
                            <h3 className="about-feature-title">Veille chronophage</h3>
                            <p className="about-feature-text">
                                Suivre les évolutions du marché, analyser les projets et identifier les opportunités
                                nécessite du temps et de l'expertise.
                            </p>
                        </div>

                        <div className="about-feature visual-card">
                            <div className="feature-icon-large">🤔</div>
                            <h3 className="about-feature-title">Solitude du trader</h3>
                            <p className="about-feature-text">
                                Trader seul sans retour d'expérience ni échanges avec d'autres passionnés
                                limite la progression et l'apprentissage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section - Notre approche */}
            <div className="approach-section">
                <div className="about-sphere-content">
                    <h2 className="section-title">Notre approche</h2>
                    <p className="section-description">
                        La Sphere centralise les ressources essentielles pour votre progression dans le trading crypto,
                        du contenu éducatif gratuit aux outils avancés pour les traders confirmés.
                    </p>

                    <div className="about-features-grid">
                        <div className="about-feature visual-card">
                            <div className="feature-icon-large">🆓</div>
                            <h3 className="about-feature-title">Contenu gratuit accessible</h3>
                            <p className="about-feature-text">
                                Calendrier économique en temps réel, dashboard crypto live, articles et formations de base
                                pour débuter sans risque.
                            </p>
                        </div>

                        <div className="about-feature visual-card">
                            <div className="feature-icon-large">🎓</div>
                            <h3 className="about-feature-title">Formations structurées</h3>
                            <p className="about-feature-text">
                                Parcours d'apprentissage progressif couvrant l'analyse technique, la gestion du risque
                                et les stratégies de trading adaptées à tous les niveaux.
                            </p>
                        </div>

                        <div className="about-feature visual-card">
                            <div className="feature-icon-large">📊</div>
                            <h3 className="about-feature-title">Analyses quotidiennes</h3>
                            <p className="about-feature-text">
                                Décryptage des mouvements du marché, identification des tendances et signaux de trading
                                pour accompagner vos décisions d'investissement.
                            </p>
                        </div>

                        <div className="about-feature visual-card">
                            <div className="feature-icon-large">👥</div>
                            <h3 className="about-feature-title">Communauté d'entraide</h3>
                            <p className="about-feature-text">
                                Échanges avec d'autres traders francophones, partage d'expériences et accès à un support
                                pour vos questions techniques et stratégiques.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section - Valeur concrète par niveau */}
            <div className="value-proposition-section">
                <h2 className="section-title">Progressez à votre rythme</h2>
                <p className="section-description">
                    Trois niveaux d'accès pour s'adapter à vos objectifs et votre expérience
                </p>
                <div className="why-join-grid">
                    <div className="why-join-card">
                        <h3 className="why-join-title">Niveau Gratuit</h3>
                        <p className="why-join-text">
                            Accédez aux outils essentiels : calendrier économique, dashboard crypto, 12 formations de base
                            sur le trading, la blockchain et les memecoins pour comprendre les fondamentaux.
                        </p>
                    </div>

                    <div className="why-join-card">
                        <h3 className="why-join-title">Niveau Premium</h3>
                        <p className="why-join-text">
                            Analyses techniques quotidiennes, signaux de trading avec points d'entrée et objectifs,
                            formations avancées, groupe Telegram privé et support prioritaire pour progresser rapidement.
                        </p>
                    </div>

                    <div className="why-join-card">
                        <h3 className="why-join-title">Niveau VIP</h3>
                        <p className="why-join-text">
                            Tout le contenu Premium + formations exclusives de trading algorithmique, webinaires mensuels en direct,
                            sessions de coaching personnalisées et analyses approfondies de votre portefeuille.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section - Pourquoi un abonnement */}
            <div className="why-subscription-section">
                <div className="about-sphere-content">
                    <h2 className="section-title">Pourquoi un abonnement ?</h2>
                    <p className="section-description">
                        Le contenu gratuit vous permet de vous familiariser avec les bases. Les abonnements Premium et VIP
                        donnent accès aux ressources avancées nécessaires pour développer une stratégie de trading efficace
                        et prendre des décisions éclairées sur un marché en constante évolution.
                    </p>
                    <div className="subscription-benefits">
                        <div className="benefit-item">
                            <h4>Gain de temps considérable</h4>
                            <p>
                                Les analyses et signaux quotidiens vous évitent des heures de recherche et d'analyse.
                                Concentrez-vous sur vos décisions de trading plutôt que sur la collecte d'informations.
                            </p>
                        </div>
                        <div className="benefit-item">
                            <h4>Accélération de l'apprentissage</h4>
                            <p>
                                Les formations structurées et le coaching vous permettent de progresser en quelques mois
                                plutôt qu'en années d'essais-erreurs coûteux sur le marché.
                            </p>
                        </div>
                        <div className="benefit-item">
                            <h4>Réduction des erreurs</h4>
                            <p>
                                Bénéficiez de l'expérience collective pour éviter les pièges classiques : FOMO, mauvaise
                                gestion du risque, arnaques et projets douteux.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section - Plans d'abonnement */}
            <div className="plans-section">
                <div className="partners-header">
                    <h2 className="partners-title">Choisissez votre niveau d'accès</h2>
                    <p className="partners-subtitle">
                        Commencez gratuitement, évoluez vers Premium ou VIP selon vos objectifs.
                        Période d'essai de 7 jours avec remboursement intégral.
                    </p>
                </div>

                <div className="partners-grid">
                {subscriptionPlans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`partner-card ${plan.popular ? 'popular-plan' : ''}`}
                    >

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

            {/* Section - Informations importantes */}
            <div className="guarantees-section">
                <h2 className="section-title">Informations importantes</h2>
                <div className="guarantees-grid">
                    <div className="guarantee-item">
                        <h3 className="guarantee-title">Satisfait ou Remboursé</h3>
                        <p className="guarantee-text">
                            Période d'essai de 7 jours avec remboursement intégral si le service ne répond pas à vos attentes.
                        </p>
                    </div>

                    <div className="guarantee-item">
                        <h3 className="guarantee-title">Paiement Sécurisé</h3>
                        <p className="guarantee-text">
                            Transactions chiffrées via blockchain. Aucune donnée bancaire n'est stockée sur nos serveurs.
                        </p>
                    </div>

                    <div className="guarantee-item">
                        <h3 className="guarantee-title">Accès Rapide</h3>
                        <p className="guarantee-text">
                            Activation de votre compte sous 5 minutes après validation du paiement.
                        </p>
                    </div>

                    <div className="guarantee-item">
                        <h3 className="guarantee-title">Sans Engagement</h3>
                        <p className="guarantee-text">
                            Résiliation possible à tout moment. Aucune période d'engagement minimum requise.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section - Avis Clients */}
            <div className="reviews-section">
                <h2 className="section-title">Avis de nos membres</h2>

                {/* Formulaire de soumission (Premium/VIP uniquement) */}
                {isAuthenticated && (user.subscriptionStatus === 'premium' || user.subscriptionStatus === 'vip') && (
                    <div className="review-form-container">
                        <h3>Partagez votre expérience</h3>
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginBottom: '30px' }}>
                            Votre retour d'expérience aide les futurs membres à mieux comprendre notre communauté.
                        </p>
                        <ReviewSubmissionForm />
                    </div>
                )}

                {/* Liste des avis approuvés (visible par tous) */}
                <ReviewsList />

                {/* Message pour non-membres */}
                {!isAuthenticated && (
                    <div className="reviews-cta">
                        <p>
                            Les membres Premium et VIP peuvent partager leur expérience et contribuer à la communauté.
                        </p>
                    </div>
                )}
            </div>

            {/* Section - FAQ */}
            <div className="faq-section">
                <h2 className="section-title">Questions Fréquentes</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h3 className="faq-question">Quels moyens de paiement acceptez-vous ?</h3>
                        <p className="faq-answer">
                            Nous acceptons les cryptomonnaies via NOWPayments : Bitcoin (BTC), Ethereum (ETH),
                            USDT, USDC, BNB, et de nombreuses autres options. Les paiements sont sécurisés par blockchain.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Comment rejoindre le groupe Telegram ?</h3>
                        <p className="faq-answer">
                            Vous recevrez une invitation automatique au groupe Telegram dans les 5 minutes suivant votre paiement.
                            Pensez à renseigner votre pseudo Telegram lors de votre inscription.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Puis-je résilier mon abonnement ?</h3>
                        <p className="faq-answer">
                            Oui, la résiliation est possible à tout moment sans engagement de durée.
                            Votre accès reste actif jusqu'à la fin de la période déjà payée.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Les signaux de trading sont-ils fiables ?</h3>
                        <p className="faq-answer">
                            Les signaux sont fournis à titre informatif pour accompagner vos décisions. Le trading comporte des risques.
                            N'investissez jamais plus que ce que vous pouvez vous permettre de perdre.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Y a-t-il du contenu pour débutants ?</h3>
                        <p className="faq-answer">
                            Oui, les formations sont adaptées à tous les niveaux, du débutant au trader expérimenté.
                            La communauté est ouverte aux nouveaux membres souhaitant apprendre.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">Puis-je passer de Premium à VIP ?</h3>
                        <p className="faq-answer">
                            Oui, vous pouvez changer de plan à tout moment. Contactez le support pour obtenir
                            un crédit proportionnel basé sur votre abonnement actuel.
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
