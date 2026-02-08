import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import UserManagement from './UserManagement'
import ProductManagement from './ProductManagement'
import ContentManagement from './ContentManagement'
import PaymentsDashboard from './PaymentsDashboard'
import api from '../../services/api'

const AdminPanel = () => {
    const { user } = useAuth()
    const [activeSection, setActiveSection] = useState('stats')
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admin/stats')
            setStats(response.data.data)
        } catch (error) {
            console.error('Erreur chargement stats:', error)
        } finally {
            setLoading(false)
        }
    }

    // Vérifier que l'utilisateur est admin
    if (!user || user.role !== 'admin') {
        return (
            <section className="admin-section">
                <div className="access-denied">
                    <h1>🚫 Accès Refusé</h1>
                    <p>Vous devez être administrateur pour accéder à cette page.</p>
                </div>
            </section>
        )
    }

    return (
        <section className="admin-section">
            <div className="admin-container">
                {/* Header Admin */}
                <div className="admin-header">
                    <div>
                        <h1>🛡️ Panel d'Administration</h1>
                        <p>Gestion complète de La Sphere</p>
                    </div>
                    <div className="admin-user-info">
                        <span className="admin-badge">ADMIN</span>
                        <span>{user.firstName} {user.lastName}</span>
                    </div>
                </div>

                {/* Navigation Admin */}
                <div className="admin-nav">
                    <button
                        className={`admin-nav-btn ${activeSection === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveSection('stats')}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Statistiques</span>
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveSection('users')}
                    >
                        <span className="nav-icon">👥</span>
                        <span>Utilisateurs</span>
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveSection('products')}
                    >
                        <span className="nav-icon">💎</span>
                        <span>Produits</span>
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'content' ? 'active' : ''}`}
                        onClick={() => setActiveSection('content')}
                    >
                        <span className="nav-icon">📚</span>
                        <span>Contenu</span>
                    </button>
                    <button
                        className={`admin-nav-btn ${activeSection === 'payments' ? 'active' : ''}`}
                        onClick={() => setActiveSection('payments')}
                    >
                        <span className="nav-icon">💰</span>
                        <span>Paiements</span>
                    </button>
                </div>

                {/* Contenu Admin */}
                <div className="admin-content">
                    {activeSection === 'stats' && (
                        <div className="stats-dashboard">
                            {loading ? (
                                <div className="loading">Chargement des statistiques...</div>
                            ) : stats ? (
                                <>
                                    <h2>📈 Vue d'ensemble</h2>

                                    {/* Stats Utilisateurs */}
                                    <div className="stats-grid">
                                        <div className="stat-card">
                                            <div className="stat-icon">👥</div>
                                            <div className="stat-content">
                                                <div className="stat-label">Total Utilisateurs</div>
                                                <div className="stat-value">{stats.users.total}</div>
                                                <div className="stat-details">
                                                    <span className="stat-detail free">🆓 {stats.users.free} Free</span>
                                                    <span className="stat-detail premium">⭐ {stats.users.premium} Premium</span>
                                                    <span className="stat-detail vip">💎 {stats.users.vip} VIP</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">✉️</div>
                                            <div className="stat-content">
                                                <div className="stat-label">Emails Vérifiés</div>
                                                <div className="stat-value">{stats.users.emailVerified}</div>
                                                <div className="stat-progress">
                                                    <div
                                                        className="stat-progress-bar"
                                                        style={{ width: `${(stats.users.emailVerified / stats.users.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">💰</div>
                                            <div className="stat-content">
                                                <div className="stat-label">Revenus Totaux</div>
                                                <div className="stat-value">{stats.payments.totalRevenue.toFixed(2)} €</div>
                                                <div className="stat-details">
                                                    <span className="stat-detail success">✅ {stats.payments.completed} complétés</span>
                                                    <span className="stat-detail pending">⏳ {stats.payments.pending} en attente</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">📚</div>
                                            <div className="stat-content">
                                                <div className="stat-label">Contenus</div>
                                                <div className="stat-value">{stats.content.total}</div>
                                                <div className="stat-details">
                                                    <span className="stat-detail">🆓 {stats.content.free}</span>
                                                    <span className="stat-detail">⭐ {stats.content.premium}</span>
                                                    <span className="stat-detail">💎 {stats.content.vip}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">💎</div>
                                            <div className="stat-content">
                                                <div className="stat-label">Produits</div>
                                                <div className="stat-value">{stats.products.total}</div>
                                                <div className="stat-details">
                                                    <span className="stat-detail success">✅ {stats.products.active} actifs</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">📄</div>
                                            <div className="stat-content">
                                                <div className="stat-label">Paiements</div>
                                                <div className="stat-value">{stats.payments.total}</div>
                                                <div className="stat-details">
                                                    <span className="stat-detail success">✅ {stats.payments.completed}</span>
                                                    <span className="stat-detail pending">⏳ {stats.payments.pending}</span>
                                                    <span className="stat-detail error">❌ {stats.payments.failed}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={fetchStats} className="btn-refresh">
                                        🔄 Actualiser les statistiques
                                    </button>
                                </>
                            ) : (
                                <div className="error">Impossible de charger les statistiques</div>
                            )}
                        </div>
                    )}

                    {activeSection === 'users' && <UserManagement />}
                    {activeSection === 'products' && <ProductManagement />}
                    {activeSection === 'content' && <ContentManagement />}
                    {activeSection === 'payments' && <PaymentsDashboard />}
                </div>
            </div>
        </section>
    )
}

export default AdminPanel
