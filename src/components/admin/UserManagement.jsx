import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { CheckCircle2, Gem, RefreshCw, Search, Star, Users, XCircle } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [editingUser, setEditingUser] = useState(null)
    const [pagination, setPagination] = useState({ page: 1, limit: 20 })

    useEffect(() => {
        fetchUsers()
    }, [searchTerm, filterStatus, pagination.page])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const params = {
                page: pagination.page,
                limit: pagination.limit
            }
            if (searchTerm) params.search = searchTerm
            if (filterStatus !== 'all') params.subscriptionStatus = filterStatus

            const response = await api.get('/admin/users', { params })
            setUsers(response.data.data)
            setPagination(response.data.pagination)
        } catch (error) {
            console.error('Erreur chargement users:', error)
            alert('Erreur lors du chargement des utilisateurs')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (user) => {
        setEditingUser({ ...user })
    }

    const handleSave = async () => {
        try {
            await api.put(`/admin/users/${editingUser.id}`, editingUser)
            alert('Utilisateur mis à jour avec succès')
            setEditingUser(null)
            fetchUsers()
        } catch (error) {
            console.error('Erreur update user:', error)
            alert('Erreur lors de la mise à jour')
        }
    }

    const handleDelete = async (userId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

        try {
            await api.delete(`/admin/users/${userId}`)
            alert('Utilisateur supprimé avec succès')
            fetchUsers()
        } catch (error) {
            console.error('Erreur delete user:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const getStatusBadge = (status) => {
        const badges = {
            free: { icon: '🆓', color: '#888' },
            premium: { icon: <Star size={16} />, color: '#FBBF24' },
            vip: { icon: <Gem size={16} />, color: '#2E90FA' }
        }
        const badge = badges[status] || badges.free
        return (
            <span className="status-badge" style={{ color: badge.color }}>
                {badge.icon} {status.toUpperCase()}
            </span>
        )
    }

    return (
        <div className="user-management">
            <div className="management-header">
                <h2><Users size={22} /> Gestion des Utilisateurs</h2>
                <button onClick={fetchUsers} className="btn-refresh"><RefreshCw size={16} /> Actualiser</button>
            </div>

            {/* Filtres et Recherche */}
            <div className="filters-bar">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Rechercher par email, nom, prénom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-group">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="vip">VIP</option>
                    </select>
                </div>
            </div>

            {/* Liste des utilisateurs */}
            {loading ? (
                <div className="loading">Chargement des utilisateurs...</div>
            ) : (
                <>
                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Nom</th>
                                    <th>Bitunix UID</th>
                                    <th>Telegram</th>
                                    <th>Statut</th>
                                    <th>Email Vérifié</th>
                                    <th>Inscription</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                                            Aucun utilisateur trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.email}</td>
                                            <td>{user.firstName} {user.lastName}</td>
                                            <td>{user.bitunixUid || '-'}</td>
                                            <td>{user.telegramUsername || '-'}</td>
                                            <td>{getStatusBadge(user.subscriptionStatus)}</td>
                                            <td>
                                                {user.emailVerified ? (
                                                    <span className="badge-success"><CheckCircle2 size={16} /> Vérifié</span>
                                                ) : (
                                                    <span className="badge-warning"><XCircle size={16} /> Non vérifié</span>
                                                )}
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="btn-edit"
                                                        title="Modifier"
                                                    >
                                                        ✏️
                                                    </button>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="btn-delete"
                                                            title="Supprimer"
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                disabled={pagination.page === 1}
                                className="btn-page"
                            >
                                ← Précédent
                            </button>
                            <span className="page-info">
                                Page {pagination.page} / {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                disabled={pagination.page >= pagination.totalPages}
                                className="btn-page"
                            >
                                Suivant →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal d'édition */}
            {editingUser && (
                <div className="modal-overlay" onClick={() => setEditingUser(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Modifier l'utilisateur</h3>
                            <button onClick={() => setEditingUser(null)} className="btn-close">✖</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Prénom</label>
                                    <input
                                        type="text"
                                        value={editingUser.firstName}
                                        onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        value={editingUser.lastName}
                                        onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Telegram</label>
                                    <input
                                        type="text"
                                        value={editingUser.telegramUsername || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, telegramUsername: e.target.value })}
                                        className="form-input"
                                        placeholder="@username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Bitunix UID</label>
                                    <input
                                        type="text"
                                        value={editingUser.bitunixUid || ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, bitunixUid: e.target.value })}
                                        className="form-input"
                                        placeholder="12345678"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Statut Abonnement</label>
                                    <select
                                        value={editingUser.subscriptionStatus}
                                        onChange={(e) => setEditingUser({ ...editingUser, subscriptionStatus: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="free">Free</option>
                                        <option value="premium">Premium</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Email Vérifié</label>
                                    <select
                                        value={editingUser.emailVerified}
                                        onChange={(e) => setEditingUser({ ...editingUser, emailVerified: e.target.value === 'true' })}
                                        className="form-select"
                                    >
                                        <option value="true">Oui</option>
                                        <option value="false">Non</option>
                                    </select>
                                </div>
                            </div>
                            {editingUser.subscriptionStatus !== 'free' && (
                                <div className="form-group">
                                    <label>Expiration Abonnement</label>
                                    <input
                                        type="datetime-local"
                                        value={editingUser.subscriptionExpiresAt ? new Date(editingUser.subscriptionExpiresAt).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => setEditingUser({ ...editingUser, subscriptionExpiresAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
                                        className="form-input"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setEditingUser(null)} className="btn-cancel">Annuler</button>
                            <button onClick={handleSave} className="btn-save">💾 Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserManagement
