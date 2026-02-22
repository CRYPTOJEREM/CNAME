/**
 * PaymentHistory - Historique des paiements de l'utilisateur
 */

import { useState, useEffect } from 'react';
import memberService from '../../services/memberService';
import { CheckCircle2, CreditCard, Loader2, XCircle } from 'lucide-react';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        try {
            const response = await memberService.getPaymentHistory();
            setPayments(response.payments || []);
        } catch (error) {
            console.error('Erreur chargement paiements:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { icon: <Loader2 size={14} />, text: 'En attente', color: '#FBBF24' },
            completed: { icon: <CheckCircle2 size={14} />, text: 'Complété', color: '#64D2FF' },
            failed: { icon: <XCircle size={14} />, text: 'Échoué', color: '#F87171' }
        };
        return badges[status] || badges.pending;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    if (loading) {
        return <div style={{ color: '#FFFFFF', textAlign: 'center', padding: '40px' }}>Chargement...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    color: '#64D2FF',
                    fontSize: '28px',
                    fontWeight: '900',
                    marginBottom: '10px',
                    textShadow: '0 0 20px rgba(100, 210, 255, 0.5)'
                }}>
                    <CreditCard size={16} /> Historique des Paiements
                </h2>
                <p style={{
                    color: '#7B8BA8',
                    fontSize: '15px',
                    margin: 0
                }}>
                    {payments.length} paiement{payments.length !== 1 ? 's' : ''} enregistré{payments.length !== 1 ? 's' : ''}
                </p>
            </div>

            {payments.length === 0 ? (
                <div style={{
                    background: 'rgba(26, 26, 26, 0.5)',
                    border: '2px dashed rgba(191, 90, 242, 0.3)',
                    borderRadius: '20px',
                    padding: '60px 40px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}><CreditCard size={16} /></div>
                    <h3 style={{ color: '#FFFFFF', fontSize: '20px', marginBottom: '10px' }}>
                        Aucun paiement
                    </h3>
                    <p style={{ color: '#7B8BA8', fontSize: '16px', margin: 0 }}>
                        Vous n'avez pas encore effectué de paiement
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    {payments.map((payment) => {
                        const statusBadge = getStatusBadge(payment.status);
                        return (
                            <div
                                key={payment.id}
                                style={{
                                    background: 'linear-gradient(135deg, #111111 0%, #1A1A1A 100%)',
                                    border: '2px solid rgba(191, 90, 242, 0.3)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.border = '2px solid rgba(100, 210, 255, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.border = '2px solid rgba(191, 90, 242, 0.3)';
                                }}
                            >
                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '20px',
                                    paddingBottom: '20px',
                                    borderBottom: '2px solid rgba(191, 90, 242, 0.2)'
                                }}>
                                    <div>
                                        <h3 style={{
                                            color: '#FFFFFF',
                                            fontSize: '20px',
                                            fontWeight: '700',
                                            marginBottom: '6px'
                                        }}>
                                            {payment.planName}
                                        </h3>
                                        <p style={{
                                            color: '#7B8BA8',
                                            fontSize: '14px',
                                            margin: 0
                                        }}>
                                            {formatDate(payment.createdAt)}
                                        </p>
                                    </div>
                                    <div style={{
                                        background: statusBadge.color,
                                        color: '#111111',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {statusBadge.icon} {statusBadge.text}
                                    </div>
                                </div>

                                {/* Body - Détails */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '20px'
                                }}>
                                    {/* Montant */}
                                    <div style={{
                                        background: 'rgba(100, 210, 255, 0.1)',
                                        border: '1px solid rgba(100, 210, 255, 0.3)',
                                        borderRadius: '12px',
                                        padding: '15px'
                                    }}>
                                        <p style={{
                                            color: '#7B8BA8',
                                            fontSize: '13px',
                                            marginBottom: '6px'
                                        }}>
                                            Montant
                                        </p>
                                        <p style={{
                                            color: '#64D2FF',
                                            fontSize: '24px',
                                            fontWeight: '900',
                                            margin: 0
                                        }}>
                                            {formatPrice(payment.price)}
                                        </p>
                                    </div>

                                    {/* ID Transaction */}
                                    <div style={{
                                        background: 'rgba(191, 90, 242, 0.1)',
                                        border: '1px solid rgba(191, 90, 242, 0.3)',
                                        borderRadius: '12px',
                                        padding: '15px'
                                    }}>
                                        <p style={{
                                            color: '#7B8BA8',
                                            fontSize: '13px',
                                            marginBottom: '6px'
                                        }}>
                                            ID de transaction
                                        </p>
                                        <p style={{
                                            color: '#FFFFFF',
                                            fontSize: '14px',
                                            fontFamily: 'monospace',
                                            fontWeight: '600',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {payment.id}
                                        </p>
                                    </div>

                                    {/* Mise à jour si différente */}
                                    {payment.updatedAt && payment.updatedAt !== payment.createdAt && (
                                        <div style={{
                                            background: 'rgba(255, 214, 10, 0.1)',
                                            border: '1px solid rgba(255, 214, 10, 0.3)',
                                            borderRadius: '12px',
                                            padding: '15px'
                                        }}>
                                            <p style={{
                                                color: '#7B8BA8',
                                                fontSize: '13px',
                                                marginBottom: '6px'
                                            }}>
                                                Mise à jour
                                            </p>
                                            <p style={{
                                                color: '#FBBF24',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                margin: 0
                                            }}>
                                                {formatDate(payment.updatedAt)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;
