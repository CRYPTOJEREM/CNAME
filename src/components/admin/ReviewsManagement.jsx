import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const ReviewsManagement = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('pending') // pending, approved, all

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admin/reviews')
            setReviews(response.data.data)
        } catch (error) {
            console.error('Erreur chargement reviews:', error)
            alert('Erreur lors du chargement des avis')
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (reviewId) => {
        try {
            await api.put(`/admin/reviews/${reviewId}/approve`)
            alert('Avis approuvé avec succès')
            fetchReviews()
        } catch (error) {
            console.error('Erreur approbation review:', error)
            alert('Erreur lors de l\'approbation')
        }
    }

    const handleReject = async (reviewId) => {
        if (!confirm('Êtes-vous sûr de vouloir rejeter cet avis ?')) return

        try {
            await api.delete(`/admin/reviews/${reviewId}`)
            alert('Avis rejeté et supprimé')
            fetchReviews()
        } catch (error) {
            console.error('Erreur suppression review:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const getFilteredReviews = () => {
        if (filter === 'pending') return reviews.filter(r => !r.approved)
        if (filter === 'approved') return reviews.filter(r => r.approved)
        return reviews
    }

    const filteredReviews = getFilteredReviews()
    const pendingCount = reviews.filter(r => !r.approved).length
    const approvedCount = reviews.filter(r => r.approved).length

    const renderStars = (rating) => '⭐'.repeat(rating)

    return (
        <div className="reviews-management">
            <div className="management-header">
                <h2>⭐ Gestion des Avis Clients</h2>
                <button onClick={fetchReviews} className="btn-refresh">🔄 Actualiser</button>
            </div>

            {/* Stats */}
            <div className="stats-cards">
                <div className="stats-card">
                    <div className="stats-icon">💬</div>
                    <div className="stats-content">
                        <div className="stats-label">Total Avis</div>
                        <div className="stats-value">{reviews.length}</div>
                    </div>
                </div>
                <div className="stats-card pending">
                    <div className="stats-icon">⏳</div>
                    <div className="stats-content">
                        <div className="stats-label">En attente</div>
                        <div className="stats-value">{pendingCount}</div>
                    </div>
                </div>
                <div className="stats-card success">
                    <div className="stats-icon">✅</div>
                    <div className="stats-content">
                        <div className="stats-label">Approuvés</div>
                        <div className="stats-value">{approvedCount}</div>
                    </div>
                </div>
            </div>

            {/* Filtres */}
            <div className="filters-bar">
                <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    ⏳ En attente ({pendingCount})
                </button>
                <button
                    className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                    onClick={() => setFilter('approved')}
                >
                    ✅ Approuvés ({approvedCount})
                </button>
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    📋 Tous ({reviews.length})
                </button>
            </div>

            {/* Liste des avis */}
            {loading ? (
                <div className="loading">Chargement des avis...</div>
            ) : filteredReviews.length === 0 ? (
                <div className="empty-state">
                    <p>
                        {filter === 'pending' && 'Aucun avis en attente de modération'}
                        {filter === 'approved' && 'Aucun avis approuvé'}
                        {filter === 'all' && 'Aucun avis soumis'}
                    </p>
                </div>
            ) : (
                <div className="reviews-grid">
                    {filteredReviews.map(review => (
                        <div key={review.id} className={`review-admin-card ${review.approved ? 'approved' : 'pending'}`}>
                            <div className="review-admin-header">
                                <div className="review-user-info">
                                    <div className="user-avatar">
                                        {review.userFirstName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4>{review.userFirstName}</h4>
                                        <span className={`user-badge ${review.userSubscriptionLevel}`}>
                                            {review.userSubscriptionLevel === 'premium' ? '⭐ Premium' : '💎 VIP'}
                                        </span>
                                    </div>
                                </div>
                                <div className="review-status-badge">
                                    {review.approved ? (
                                        <span className="badge-approved">✅ Approuvé</span>
                                    ) : (
                                        <span className="badge-pending">⏳ En attente</span>
                                    )}
                                </div>
                            </div>

                            <div className="review-rating-display">
                                {renderStars(review.rating)} ({review.rating}/5)
                            </div>

                            <h3 className="review-admin-title">{review.title}</h3>
                            <p className="review-admin-message">{review.message}</p>

                            <div className="review-admin-meta">
                                <span>📅 {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>

                            <div className="review-admin-actions">
                                {!review.approved && (
                                    <button
                                        onClick={() => handleApprove(review.id)}
                                        className="btn-approve"
                                    >
                                        ✅ Approuver
                                    </button>
                                )}
                                <button
                                    onClick={() => handleReject(review.id)}
                                    className="btn-reject"
                                >
                                    {review.approved ? '🗑️ Supprimer' : '❌ Rejeter'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ReviewsManagement
