
import React, { useState } from 'react'

const Subscriptions = () => {
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

            {/* Modal de paiement */}
            {showPaymentModal && selectedPlan && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="modal-close-btn"
                        >
                            ✕
                        </button>

                        <h2 className="modal-title">
                            💳 Finaliser votre abonnement
                        </h2>
                        <p className="modal-subtitle">
                            {selectedPlan.name} - {selectedPlan.price}€{selectedPlan.period}
                        </p>

                        <div className="payment-method-section">
                            <h3 className="payment-method-title">
                                Choisir la cryptomonnaie de paiement:
                            </h3>
                            <div className="crypto-options-grid">
                                {cryptoOptions.map((crypto) => (
                                    <button
                                        key={crypto.id}
                                        onClick={() => setPaymentMethod(crypto.id)}
                                        className={`crypto-option-btn ${paymentMethod === crypto.id ? 'active' : ''}`}
                                        style={paymentMethod === crypto.id ? {
                                            background: `linear-gradient(135deg, ${crypto.color}40, ${crypto.color}20)`,
                                            borderColor: crypto.color
                                        } : {}}
                                    >
                                        <div className="crypto-icon-large">{crypto.icon}</div>
                                        {crypto.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="payment-amount-box">
                            <div className="amount-label">
                                💰 Montant à payer:
                            </div>
                            <div className="amount-value">
                                {getPrice(selectedPlan)}
                            </div>
                            <div className="amount-equivalent">
                                ≈ {selectedPlan.price} EUR
                            </div>
                        </div>

                        <div className="payment-address-box">
                            <div className="address-label">
                                📍 Adresse de paiement:
                            </div>
                            <div className="address-value">
                                {PAYMENT_ADDRESS}
                            </div>
                            <button
                                onClick={copyAddress}
                                className="copy-address-btn"
                            >
                                📋 Copier l'adresse
                            </button>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="partner-btn payment-submit-btn"
                        >
                            🚀 Payer avec MetaMask
                        </button>

                        <p className="payment-warning-text">
                            ⚠️ Une fois le paiement effectué, votre abonnement sera activé automatiquement sous quelques minutes.
                            Conservez votre hash de transaction comme preuve de paiement.
                        </p>
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
