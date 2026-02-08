
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
            {/* Vidéo ultra-wide en haut */}
            <div className="video-hero-centered">
                <div className="video-container-ultrawide">
                    <iframe
                        className="hero-video-main"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                        title="Présentation La Sphere"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Stats live sous la vidéo */}
                <div className="hero-stats-bar">
                    <div className="stat-item">
                        <span className="stat-value">Quotidien</span>
                        <span className="stat-label">Analyses marché</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">24/7</span>
                        <span className="stat-label">Support actif</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">Temps réel</span>
                        <span className="stat-label">Signaux trading</span>
                    </div>
                </div>

                {/* Bouton CTA principal */}
                <button className="cta-main-centered" onClick={() => {
                    document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
                }}>
                    Accéder maintenant
                </button>

                {/* Trust badges */}
                <div className="trust-badges-line">
                    <span className="trust-item">✓ Paiement sécurisé</span>
                    <span className="trust-item">✓ Accès immédiat</span>
                    <span className="trust-item">✓ Garantie 7 jours</span>
                </div>
            </div>

            {/* Valeur ajoutée - Design fluide sans carrés */}
            <div className="value-section-clean">
                <h2 className="clean-title">Ce que vous obtenez avec La Sphere</h2>

                <div className="value-list-clean">
                    <div className="value-item-clean">
                        <span className="value-icon-clean">📊</span>
                        <div className="value-content-clean">
                            <h3>Analyses quotidiennes du marché</h3>
                            <p>Décryptage des tendances, identification des opportunités et signaux de trading pour accompagner vos décisions</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean">🎓</span>
                        <div className="value-content-clean">
                            <h3>Formations complètes de A à Z</h3>
                            <p>Du débutant au trader avancé, parcours structuré couvrant l'analyse technique, la gestion du risque et les stratégies</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean">💬</span>
                        <div className="value-content-clean">
                            <h3>Groupe Telegram VIP privé</h3>
                            <p>Échanges en direct avec la communauté, partage d'expériences et support disponible pour vos questions</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean">🔔</span>
                        <div className="value-content-clean">
                            <h3>Alertes et signaux en temps réel</h3>
                            <p>Notifications instantanées sur les mouvements importants et opportunités identifiées par nos analystes</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean">📚</span>
                        <div className="value-content-clean">
                            <h3>Bibliothèque de ressources</h3>
                            <p>Accès à l'ensemble des formations, analyses passées, templates et outils pour progresser à votre rythme</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean">🎯</span>
                        <div className="value-content-clean">
                            <h3>Support prioritaire</h3>
                            <p>Réponses rapides à vos questions techniques et stratégiques pour ne jamais être bloqué</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Abonnement unique - Design simple et centré */}
            <div className="plans-section">
                <h2 className="clean-title">Abonnement Premium</h2>
                <p className="clean-subtitle">
                    Accès complet à toutes les fonctionnalités et ressources de La Sphere
                </p>

                <div className="single-plan-centered">
                    {subscriptionPlans.filter(plan => plan.id === 'premium').map((plan) => (
                        <div key={plan.id} className="plan-card-clean">
                            <div className="plan-price-clean">
                                <span className="price-amount">{plan.price}€</span>
                                <span className="price-period-clean">/mois</span>
                            </div>

                            <div className="plan-features-clean">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="feature-line-clean">
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <button
                                className="plan-btn-clean"
                                onClick={() => handleSubscribe(plan)}
                            >
                                Rejoindre maintenant
                            </button>

                            <p className="plan-guarantee">Satisfait ou remboursé sous 7 jours</p>
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
