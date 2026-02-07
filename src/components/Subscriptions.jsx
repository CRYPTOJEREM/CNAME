
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
        <section className="partners-section" style={{ marginTop: '40px' }}>
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
                        style={plan.popular ? {
                            border: '3px solid #FFD700',
                            boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
                        } : {}}
                    >
                        {plan.popular && (
                            <div className="partner-badge popular" style={{ background: '#FFD700', color: '#0A0E27' }}>
                                🔥 LE PLUS POPULAIRE
                            </div>
                        )}

                        <div className="partner-logo" style={{ background: plan.badgeColor }}>
                            <div className="partner-logo-text" style={{ fontSize: '32px' }}>
                                {plan.name.split(' ')[0]}
                            </div>
                        </div>

                        <h3 className="partner-name">{plan.name.split(' ')[1]}</h3>

                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '42px', fontWeight: '900', color: '#00D9FF', marginBottom: '5px' }}>
                                {plan.price === 0 ? 'GRATUIT' : `${plan.price}€`}
                            </div>
                            <div style={{ color: '#7B8BA8', fontSize: '14px' }}>
                                {plan.period}
                            </div>
                            {plan.price > 0 && (
                                <div style={{ color: '#FFD700', fontSize: '12px', marginTop: '5px' }}>
                                    ou {plan.priceEth} ETH / {plan.priceUsdt} USDT
                                </div>
                            )}
                        </div>

                        <div className="partner-features" style={{ textAlign: 'left', marginBottom: '25px' }}>
                            {plan.features.map((feature, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '10px 0',
                                        color: feature.startsWith('✅') ? '#B8C5D6' : '#7B8BA8',
                                        fontSize: '13px',
                                        borderBottom: '1px solid rgba(123, 47, 247, 0.1)'
                                    }}
                                >
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <button
                            className="partner-btn"
                            onClick={() => handleSubscribe(plan)}
                            disabled={plan.disabled}
                            style={plan.disabled ? {
                                opacity: 0.5,
                                cursor: 'not-allowed',
                                background: 'rgba(123, 139, 168, 0.3)'
                            } : plan.popular ? {
                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.4)'
                            } : {}}
                        >
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal de paiement */}
            {showPaymentModal && selectedPlan && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #0D1229 0%, #1A1F3A 100%)',
                        borderRadius: '24px',
                        padding: '40px',
                        maxWidth: '600px',
                        width: '100%',
                        border: '2px solid rgba(0, 217, 255, 0.3)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'none',
                                border: 'none',
                                color: '#FF3366',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{ color: '#00D9FF', marginBottom: '10px', textAlign: 'center' }}>
                            💳 Finaliser votre abonnement
                        </h2>
                        <p style={{ color: '#7B8BA8', textAlign: 'center', marginBottom: '30px' }}>
                            {selectedPlan.name} - {selectedPlan.price}€{selectedPlan.period}
                        </p>

                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ color: '#FFFFFF', fontSize: '16px', marginBottom: '15px' }}>
                                Choisir la cryptomonnaie de paiement:
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                {cryptoOptions.map((crypto) => (
                                    <button
                                        key={crypto.id}
                                        onClick={() => setPaymentMethod(crypto.id)}
                                        style={{
                                            padding: '15px',
                                            background: paymentMethod === crypto.id
                                                ? `linear-gradient(135deg, ${crypto.color}40, ${crypto.color}20)`
                                                : 'rgba(26, 31, 58, 0.5)',
                                            border: paymentMethod === crypto.id
                                                ? `2px solid ${crypto.color}`
                                                : '2px solid rgba(123, 47, 247, 0.2)',
                                            borderRadius: '12px',
                                            color: '#FFFFFF',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <div style={{ fontSize: '24px', marginBottom: '5px' }}>{crypto.icon}</div>
                                        {crypto.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(0, 217, 255, 0.1)',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '25px',
                            border: '1px solid rgba(0, 217, 255, 0.3)'
                        }}>
                            <div style={{ color: '#00D9FF', fontSize: '14px', marginBottom: '10px' }}>
                                💰 Montant à payer:
                            </div>
                            <div style={{ color: '#FFFFFF', fontSize: '32px', fontWeight: '900' }}>
                                {getPrice(selectedPlan)}
                            </div>
                            <div style={{ color: '#7B8BA8', fontSize: '12px', marginTop: '5px' }}>
                                ≈ {selectedPlan.price} EUR
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255, 215, 0, 0.1)',
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '25px',
                            border: '1px solid rgba(255, 215, 0, 0.3)'
                        }}>
                            <div style={{ color: '#FFD700', fontSize: '12px', marginBottom: '8px' }}>
                                📍 Adresse de paiement:
                            </div>
                            <div style={{
                                color: '#FFFFFF',
                                fontSize: '11px',
                                wordBreak: 'break-all',
                                fontFamily: 'monospace',
                                background: 'rgba(0, 0, 0, 0.3)',
                                padding: '10px',
                                borderRadius: '8px',
                                marginBottom: '10px'
                            }}>
                                {PAYMENT_ADDRESS}
                            </div>
                            <button
                                onClick={copyAddress}
                                style={{
                                    background: 'rgba(255, 215, 0, 0.2)',
                                    border: '1px solid #FFD700',
                                    color: '#FFD700',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    width: '100%'
                                }}
                            >
                                📋 Copier l'adresse
                            </button>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="partner-btn"
                            style={{
                                width: '100%',
                                padding: '18px',
                                fontSize: '16px',
                                background: 'linear-gradient(135deg, #00D9FF, #7B2FF7)',
                                marginBottom: '15px'
                            }}
                        >
                            🚀 Payer avec MetaMask
                        </button>

                        <p style={{
                            color: '#7B8BA8',
                            fontSize: '11px',
                            textAlign: 'center',
                            lineHeight: '1.6'
                        }}>
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
