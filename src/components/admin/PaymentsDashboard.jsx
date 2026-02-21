import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { CheckCircle2, CreditCard, Lightbulb, Loader2, RefreshCw, Wallet, XCircle } from 'lucide-react';

const PaymentsDashboard = () => {
    const [payments, setPayments] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        status: 'all',
        startDate: '',
        endDate: ''
    })

    useEffect(() => {
        fetchPayments()
    }, [filters])

    const fetchPayments = async () => {
        try {
            setLoading(true)
            const params = {}
            if (filters.status !== 'all') params.status = filters.status
            if (filters.startDate) params.startDate = filters.startDate
            if (filters.endDate) params.endDate = filters.endDate

            const response = await api.get('/admin/payments', { params })
            setPayments(response.data.data)
            setStats(response.data.stats)
        } catch (error) {
            console.error('Erreur chargement payments:', error)
            alert('Erreur lors du chargement des paiements')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            completed: { icon: <CheckCircle2 size={14} />, text: 'Complété', color: '#4CAF50' },
            pending: { icon: <Loader2 size={14} />, text: 'En attente', color: '#FF9800' },
            failed: { icon: <XCircle size={14} />, text: 'Échoué', color: '#F44336' }
        }
        const badge = badges[status] || badges.pending
        return (
            <span className="payment-status" style={{ background: badge.color }}>
                {badge.icon} {badge.text}
            </span>
        )
    }

    return (
        <div className="payments-dashboard">
            <div className="management-header">
                <h2><Wallet size={16} /> Gestion des Paiements</h2>
                <button onClick={fetchPayments} className="btn-refresh"><RefreshCw size={16} /> Actualiser</button>
            </div>

            {/* Statistiques */}
            {stats && (
                <div className="stats-cards">
                    <div className="stats-card">
                        <div className="stats-icon"><CreditCard size={16} /></div>
                        <div className="stats-content">
                            <div className="stats-label">Total Paiements</div>
                            <div className="stats-value">{stats.total}</div>
                        </div>
                    </div>
                    <div className="stats-card success">
                        <div className="stats-icon"><CheckCircle2 size={16} /></div>
                        <div className="stats-content">
                            <div className="stats-label">Complétés</div>
                            <div className="stats-value">{stats.completed}</div>
                        </div>
                    </div>
                    <div className="stats-card pending">
                        <div className="stats-icon"><Loader2 size={16} /></div>
                        <div className="stats-content">
                            <div className="stats-label">En attente</div>
                            <div className="stats-value">{stats.pending}</div>
                        </div>
                    </div>
                    <div className="stats-card error">
                        <div className="stats-icon"><XCircle size={16} /></div>
                        <div className="stats-content">
                            <div className="stats-label">Échoués</div>
                            <div className="stats-value">{stats.failed}</div>
                        </div>
                    </div>
                    <div className="stats-card revenue">
                        <div className="stats-icon"><Wallet size={16} /></div>
                        <div className="stats-content">
                            <div className="stats-label">Revenus Totaux</div>
                            <div className="stats-value">{stats.totalRevenue.toFixed(2)} €</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="filters-bar">
                <div className="filter-group">
                    <label>Statut:</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="filter-select"
                    >
                        <option value="all">Tous</option>
                        <option value="completed">Complétés</option>
                        <option value="pending">En attente</option>
                        <option value="failed">Échoués</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Du:</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="filter-input"
                    />
                </div>
                <div className="filter-group">
                    <label>Au:</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="filter-input"
                    />
                </div>
                {(filters.startDate || filters.endDate || filters.status !== 'all') && (
                    <button
                        onClick={() => setFilters({ status: 'all', startDate: '', endDate: '' })}
                        className="btn-reset-filters"
                    >
                        <RefreshCw size={16} /> Réinitialiser
                    </button>
                )}
            </div>

            {/* Liste des paiements */}
            {loading ? (
                <div className="loading">Chargement des paiements...</div>
            ) : (
                <div className="payments-table-wrapper">
                    {payments.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun paiement trouvé</p>
                        </div>
                    ) : (
                        <table className="payments-table">
                            <thead>
                                <tr>
                                    <th>ID Commande</th>
                                    <th>Plan</th>
                                    <th>Prix</th>
                                    <th>Statut</th>
                                    <th>Telegram</th>
                                    <th>Date</th>
                                    <th>ID Utilisateur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => (
                                    <tr key={payment.id}>
                                        <td className="payment-id">
                                            <span className="order-id" title={payment.orderId}>
                                                {payment.orderId ? payment.orderId.slice(0, 12) + '...' : '-'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`plan-badge plan-${payment.planId}`}>
                                                {payment.planName || payment.planId}
                                            </span>
                                        </td>
                                        <td className="payment-price">{payment.price ? payment.price.toFixed(2) + ' €' : '-'}</td>
                                        <td>{getStatusBadge(payment.status)}</td>
                                        <td>
                                            {payment.telegramAdded ? (
                                                <span className="telegram-added"><CheckCircle2 size={16} /> Ajouté</span>
                                            ) : (
                                                <span className="telegram-pending"><Loader2 size={16} /> En attente</span>
                                            )}
                                        </td>
                                        <td className="payment-date">
                                            {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="payment-user">
                                            <span className="user-id" title={payment.userId}>
                                                {payment.userId ? payment.userId.slice(0, 8) + '...' : '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Informations supplémentaires */}
            <div className="payments-info">
                <div className="info-card">
                    <h4><Lightbulb size={16} /> Informations</h4>
                    <ul>
                        <li>Les paiements sont traites en cryptomonnaies via notre prestataire</li>
                        <li>Un webhook confirme automatiquement les paiements complétés</li>
                        <li>Les utilisateurs sont ajoutés au groupe Telegram VIP automatiquement</li>
                        <li>Les statuts sont mis à jour en temps réel</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PaymentsDashboard
