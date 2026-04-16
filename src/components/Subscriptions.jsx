
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import ReviewSubmissionForm from './reviews/ReviewSubmissionForm'
import ReviewsList from './reviews/ReviewsList'
import { AlertTriangle, BarChart3, Bell, BookOpen, CheckCircle2, Gem, GraduationCap, Lock, LogOut, MessageCircle, Rocket, Shield, Smartphone, Star, Target, XCircle, Zap } from 'lucide-react';

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
            name: 'GRATUIT',
            price: 0,
            currency: 'EUR',
            period: 'À vie',
            badge: 'Communauté',
            badgeColor: 'rgba(10, 132, 255, 0.2)',
            features: [
                { included: true, text: 'Accès au Dashboard Crypto en temps réel' },
                { included: true, text: 'Calendrier économique US' },
                { included: true, text: 'Actualités crypto quotidiennes' },
                { included: true, text: 'Groupe Telegram gratuit' },
                { included: true, text: 'Accès aux vidéos YouTube/Twitch' },
                { included: false, text: 'Analyses premium' },
                { included: false, text: 'Signaux de trading' },
                { included: false, text: 'Support prioritaire' },
                { included: false, text: 'Formations exclusives' }
            ],
            buttonText: 'Déjà actif',
            disabled: true
        },
        {
            id: 'premium',
            name: 'PREMIUM',
            nameIcon: <Star size={18} />,
            price: 29.99,
            priceEth: '0.015',
            priceUsdt: '30',
            currency: 'EUR',
            period: '/mois',
            badge: 'Populaire',
            badgeColor: 'rgba(255, 214, 10, 0.2)',
            popular: true,
            features: [
                { included: true, text: 'Tout du plan GRATUIT' },
                { included: true, text: 'Analyses techniques quotidiennes' },
                { included: true, text: 'Signaux de trading (5-10/semaine)' },
                { included: true, text: 'Alertes prix personnalisées' },
                { included: true, text: 'Groupe Telegram Premium' },
                { included: true, text: 'Webinaires mensuels exclusifs' },
                { included: true, text: 'Support prioritaire 24/7' },
                { included: true, text: 'Accès anticipé aux nouvelles features' },
                { included: false, text: 'Formations avancées exclusives' }
            ],
            buttonText: 'Choisir Premium',
            disabled: false
        },
        {
            id: 'vip',
            name: 'VIP',
            nameIcon: <Gem size={18} />,
            price: 99.99,
            priceEth: '0.05',
            priceUsdt: '100',
            currency: 'EUR',
            period: '/mois',
            badge: 'Elite',
            badgeColor: 'rgba(191, 90, 242, 0.2)',
            features: [
                { included: true, text: 'Tout du plan PREMIUM' },
                { included: true, text: 'Analyses approfondies quotidiennes' },
                { included: true, text: 'Signaux de trading illimités' },
                { included: true, text: 'Appels vidéo 1-on-1 mensuels' },
                { included: true, text: 'Formations avancées exclusives' },
                { included: true, text: 'Portfolio review personnalisé' },
                { included: true, text: 'Accès à la salle de trading privée' },
                { included: true, text: 'NFTs exclusifs La Sphere' },
                { included: true, text: 'Réductions partenaires' }
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
                'Vous devez être connecté pour souscrire à un abonnement.\n\n' +
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
                'Un pseudo Telegram est requis pour les abonnements Premium/VIP.\n\n' +
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
                    'Page de paiement ouverte!\n\n' +
                    'Après confirmation du paiement, votre abonnement sera automatiquement activé.' +
                    (user.telegramUsername ? '\nVous recevrez également une invitation Telegram.' : '')
                )
            } else {
                alert('Erreur lors de la création du paiement')
            }
        } catch (error) {
            console.error('Erreur:', error)
            if (error.response?.status === 401) {
                alert('Session expirée. Veuillez vous reconnecter.')
                window.activeTabSetter('login')
            } else {
                alert('Erreur lors de la création du paiement. Veuillez réessayer.')
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
            alert('Veuillez installer MetaMask pour effectuer des paiements crypto!')
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
                alert('Les paiements en stablecoins seront bientôt disponibles. Utilisez ETH pour le moment.')
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

            alert(`Paiement envoyé! Hash de transaction: ${txHash}\n\nVotre abonnement sera activé sous quelques minutes.`)
            setShowPaymentModal(false)

            // Ici, vous devriez normalement envoyer le txHash à votre backend pour vérification
            console.log('Transaction hash:', txHash)
            console.log('Plan:', selectedPlan.id)
            console.log('User address:', account)

        } catch (error) {
            console.error('Erreur de paiement:', error)
            alert('Erreur lors du paiement: ' + error.message)
        }
    }

    const copyAddress = () => {
        navigator.clipboard.writeText(PAYMENT_ADDRESS)
        alert('Adresse copiée dans le presse-papier!')
    }

    return (
        <section className="partners-section">
            {/* Hero Section - Clean & Direct */}
            <div className="subscription-hero-clean scroll-reveal">
                <div className="hero-badge-clean">
                    <Rocket size={16} /> REJOIGNEZ LA COMMUNAUTÉ
                </div>
                <h1 className="hero-title-clean">
                    Tradez avec Confiance.<br />
                    <span className="gradient-text">Rejoignez La Sphere.</span>
                </h1>
                <p className="hero-subtitle-clean">
                    Analyses quotidiennes, signaux en temps réel et une communauté de traders actifs 24/7.<br />
                    Tout ce dont vous avez besoin pour progresser en trading crypto.
                </p>

                {/* Stats inline */}
                <div className="hero-stats-inline">
                    <div className="stat-inline">
                        <span className="stat-number-inline">2K</span>
                        <span className="stat-label-inline">Membres actifs</span>
                    </div>
                    <div className="stat-divider-inline"></div>
                    <div className="stat-inline">
                        <span className="stat-number-inline">24/7</span>
                        <span className="stat-label-inline">Support</span>
                    </div>
                    <div className="stat-divider-inline"></div>
                    <div className="stat-inline">
                        <span className="stat-number-inline">50+</span>
                        <span className="stat-label-inline">Lives réalisés</span>
                    </div>
                </div>

                {/* CTA principal */}
                <button className="cta-hero-primary" onClick={() => {
                    document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
                }}>
                    <Rocket size={18} /> Voir les Plans
                </button>

                {/* Trust badges */}
                <div className="trust-badges-clean">
                    <span className="trust-badge-item"><CheckCircle2 size={14} /> Satisfait ou remboursé 7j</span>
                    <span className="trust-badge-item"><CheckCircle2 size={14} /> Accès immédiat</span>
                    <span className="trust-badge-item"><CheckCircle2 size={14} /> Sans engagement</span>
                </div>
            </div>

            {/* Section Problème + Solution côte à côte */}
            <div className="story-section combo-section scroll-reveal">
                <div className="combo-grid">
                    <div className="combo-left">
                        <span className="combo-label combo-label-problem">Le problème</span>
                        <h2 className="story-title">Vous passez des heures à analyser les marchés...</h2>
                        <p className="story-text">
                            Vous scrutez les graphiques, le marché fait l'inverse. Vous ratez les bons points d'entrée, vous sortez trop tôt.
                        </p>
                        <p className="story-text highlight-text">
                            D'autres traders partagent leurs gains... alors que vous stagnez.
                        </p>
                    </div>
                    <div className="combo-divider"></div>
                    <div className="combo-right">
                        <span className="combo-label combo-label-solution">La solution</span>
                        <h2 className="story-title dream-title">Et si vous aviez les mêmes infos que les meilleurs ?</h2>
                        <p className="story-text">
                            Chaque matin une analyse complète, des alertes en temps réel, et une communauté de traders qui partagent leurs stratégies.
                        </p>
                        <p className="story-text highlight-text">
                            C'est exactement ce que La Sphere vous offre.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section Solution - 6 items en grille horizontale */}
            <div className="value-section-clean scroll-reveal">
                <h2 className="clean-title">Voici ce qui change dès aujourd'hui</h2>
                <p className="section-subtitle">Tout ce dont vous avez besoin pour trader sereinement, au même endroit.</p>

                <div className="value-list-clean">
                    <div className="value-item-clean">
                        <span className="value-icon-clean"><span className="icon-container primary"><BarChart3 size={24} /></span></span>
                        <div className="value-content-clean">
                            <h3>Analyses quotidiennes</h3>
                            <p>Décryptage complet du marché avec niveaux clés et opportunités chaque matin.</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean"><span className="icon-container secondary"><Bell size={24} /></span></span>
                        <div className="value-content-clean">
                            <h3>Alertes temps réel</h3>
                            <p>Notifications instantanées sur les mouvements importants directement sur votre téléphone.</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean"><span className="icon-container primary"><MessageCircle size={24} /></span></span>
                        <div className="value-content-clean">
                            <h3>Groupe privé actif</h3>
                            <p>Communauté de traders qui partagent positions, analyses et s'entraident au quotidien.</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean"><span className="icon-container primary"><GraduationCap size={24} /></span></span>
                        <div className="value-content-clean">
                            <h3>Formations complètes</h3>
                            <p>Parcours structuré du débutant au trader confirmé : analyse technique, gestion du risque.</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean"><span className="icon-container primary"><BookOpen size={24} /></span></span>
                        <div className="value-content-clean">
                            <h3>Bibliothèque de ressources</h3>
                            <p>Templates, outils et analyses passées au même endroit pour progresser vite.</p>
                        </div>
                    </div>

                    <div className="value-item-clean">
                        <span className="value-icon-clean"><span className="icon-container primary"><Target size={24} /></span></span>
                        <div className="value-content-clean">
                            <h3>Support réactif</h3>
                            <p>Une question ? Notre équipe vous répond rapidement pour vous débloquer.</p>
                        </div>
                    </div>
                </div>

                {/* CTA intermédiaire - centré */}
                <div className="cta-center-wrapper">
                    <button className="cta-story-inline" onClick={() => {
                        document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
                    }}>
                        Je veux accéder à La Sphere
                    </button>
                </div>
            </div>

            {/* Plans Section - Design 3 colonnes */}
            <div className="plans-section">
                <h2 className="clean-title">Choisissez votre niveau d'accès</h2>
                <p className="clean-subtitle">
                    Tous les plans incluent l'accès à la communauté et aux outils essentiels
                </p>

                <div className="plans-grid-three">
                    {subscriptionPlans.filter(plan => plan.id !== 'vip').map((plan) => (
                        <div key={plan.id} className={`plan-card-modern ${plan.popular ? 'plan-popular' : ''} ${plan.id === 'free' ? 'plan-free' : ''}`}>
                            {plan.popular && <div className="plan-badge-popular">⭐ POPULAIRE</div>}

                            <div className="plan-header-modern">
                                <div className="plan-name-modern">
                                    {plan.nameIcon && <span className="plan-icon-modern">{plan.nameIcon}</span>}
                                    <span>{plan.name}</span>
                                </div>
                                <div className="plan-price-modern">
                                    {plan.price === 0 ? (
                                        <span className="price-free">GRATUIT</span>
                                    ) : (
                                        <>
                                            <span className="price-amount-modern">{plan.price}€</span>
                                            <span className="price-period-modern">/mois</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="plan-features-modern">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className={`feature-line-modern ${!feature.included ? 'feature-excluded' : ''}`}>
                                        {feature.included ? (
                                            <CheckCircle2 size={16} className="feature-check-icon" />
                                        ) : (
                                            <XCircle size={16} className="feature-cross-icon" />
                                        )}
                                        <span>{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`plan-btn-modern ${plan.id === 'free' ? 'btn-free' : plan.popular ? 'btn-popular' : ''}`}
                                onClick={() => handleSubscribe(plan)}
                                disabled={plan.disabled}
                            >
                                {plan.buttonText}
                            </button>

                            {plan.price > 0 && (
                                <p className="plan-guarantee-modern">
                                    <Shield size={14} /> Garantie satisfait ou remboursé 7 jours
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Barre de garanties horizontale */}
            <div className="guarantees-bar scroll-reveal">
                <div className="guarantee-pill"><span className="icon-container sm primary"><Shield size={16} /></span> Satisfait ou remboursé 7j</div>
                <div className="guarantee-pill"><span className="icon-container sm secondary"><Lock size={16} /></span> Paiement sécurisé</div>
                <div className="guarantee-pill"><span className="icon-container sm primary"><Zap size={16} /></span> Accès immédiat</div>
                <div className="guarantee-pill"><span className="icon-container sm primary"><LogOut size={16} /></span> Sans engagement</div>
            </div>

            {/* Section finale - Compact */}
            <div className="story-section final-section">
                <div className="story-content">
                    <h2 className="story-title">Le marché n'attend pas.</h2>
                    <p className="story-text">
                        Chaque jour sans les bonnes informations, c'est une opportunité manquée.
                        Testez La Sphere pendant 7 jours — si vous n'êtes pas convaincu, vous êtes remboursé intégralement.
                    </p>

                    <button className="cta-final-push" onClick={() => {
                        document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' });
                    }}>
                        Je rejoins La Sphere maintenant
                    </button>
                </div>
            </div>

            {/* Section - Avis Clients */}
            <div className="reviews-section scroll-reveal">
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
            <div className="faq-section scroll-reveal">
                <h2 className="section-title">Questions Fréquentes</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h3 className="faq-question">Quels moyens de paiement acceptez-vous ?</h3>
                        <p className="faq-answer">
                            Nous acceptons les cryptomonnaies : Bitcoin (BTC), Ethereum (ETH),
                            USDT, USDC, BNB, et de nombreuses autres options. Les paiements sont securises par blockchain.
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
                                <div className="benefit-icon"><Lock size={18} /></div>
                                <div className="benefit-content">
                                    <div className="benefit-title">Paiement 100% sécurisé</div>
                                    <div className="benefit-text">Transaction chiffree sur la blockchain</div>
                                </div>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon"><Gem size={20} /></div>
                                <div className="benefit-content">
                                    <div className="benefit-title">200+ Cryptomonnaies</div>
                                    <div className="benefit-text">Bitcoin, Ethereum, USDT, etc.</div>
                                </div>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon"><Zap size={18} /></div>
                                <div className="benefit-content">
                                    <div className="benefit-title">Accès instantané</div>
                                    <div className="benefit-text">Activation sous 5 minutes</div>
                                </div>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon"><Smartphone size={16} /></div>
                                <div className="benefit-content">
                                    <div className="benefit-title">Telegram VIP</div>
                                    <div className="benefit-text">Ajout automatique au groupe</div>
                                </div>
                            </div>
                        </div>

                        {/* Bouton de paiement crypto */}
                        <button
                            onClick={() => handleNowPaymentsCheckout(selectedPlan)}
                            className="payment-button-new"
                        >
                            <span className="payment-button-icon"><Rocket size={20} /></span>
                            <span className="payment-button-text">Payer avec Crypto</span>
                            <span className="payment-button-badge">Crypto</span>
                        </button>

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
                <p className="partners-disclaimer-title"><Lock size={18} /> PAIEMENTS SÉCURISÉS</p>
                <p className="partners-disclaimer-text">
                    Les paiements sont effectués directement via blockchain, garantissant transparence et sécurité.
                    Aucune donnée bancaire n'est stockée. Vous pouvez résilier votre abonnement à tout moment.
                </p>
            </div>
        </section>
    )
}

export default Subscriptions
