import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { AlertTriangle, CalendarDays, Gem, Loader2, MessageCircle, Star } from 'lucide-react';

const ReviewsList = () => {
    const [reviews, setReviews] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            setError('')

            // Récupérer les avis et les stats en parallèle
            const [reviewsRes, statsRes] = await Promise.all([
                api.get('/reviews'),
                api.get('/reviews/stats')
            ])

            setReviews(reviewsRes.data.data)
            setStats(statsRes.data.data)
        } catch (err) {
            console.error('Erreur chargement reviews:', err)
            setError('Impossible de charger les avis pour le moment')
        } finally {
            setLoading(false)
        }
    }

    const getInitials = (firstName) => {
        return firstName.charAt(0).toUpperCase()
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const renderStars = (rating) => {
        return Array.from({ length: rating }, (_, i) => <Star key={i} size={14} fill="currentColor" />)
    }

    if (loading) {
        return (
            <div className="reviews-loading">
                <div className="loading-spinner"><Loader2 size={16} /></div>
                <p>Chargement des avis...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="reviews-error">
                <span className="error-icon"><AlertTriangle size={16} /></span>
                <p>{error}</p>
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="reviews-empty">
                <div className="empty-icon"><MessageCircle size={16} /></div>
                <h3>Aucun avis pour le moment</h3>
                <p>Soyez le premier membre à partager votre expérience !</p>
            </div>
        )
    }

    return (
        <div className="reviews-display">
            {/* Stats Overview */}
            {stats && stats.totalReviews > 0 && (
                <div className="reviews-stats-overview">
                    <div className="stats-item">
                        <div className="stats-number">{stats.totalReviews}</div>
                        <div className="stats-label">Avis vérifiés</div>
                    </div>
                    <div className="stats-item highlighted">
                        <div className="stats-number">{stats.averageRating}/5</div>
                        <div className="stats-label">Note moyenne</div>
                        <div className="stats-stars">{renderStars(Math.round(stats.averageRating))}</div>
                    </div>
                    <div className="stats-item">
                        <div className="stats-number">{stats.ratingsBreakdown[5]}</div>
                        <div className="stats-label">Avis 5 étoiles</div>
                    </div>
                </div>
            )}

            {/* Reviews Grid */}
            <div className="reviews-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="review-author">
                                <div className="author-avatar">
                                    {getInitials(review.userFirstName)}
                                </div>
                                <div className="author-info">
                                    <h4>{review.userFirstName}</h4>
                                    <span className={`author-badge ${review.userSubscriptionLevel}`}>
                                        {review.userSubscriptionLevel === 'premium' ? <><Star size={16} /> Premium</> : <><Gem size={16} /> VIP</>}
                                    </span>
                                </div>
                            </div>
                            <div className="review-rating">
                                {renderStars(review.rating)}
                            </div>
                        </div>
                        <h3 className="review-title">{review.title}</h3>
                        <p className="review-message">{review.message}</p>
                        <div className="review-date">
                            <CalendarDays size={16} /> {formatDate(review.createdAt)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReviewsList
