import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { AlertTriangle, CheckCircle2, FileEdit, Loader2, Send, Star } from 'lucide-react';

const ReviewSubmissionForm = () => {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        message: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title.trim() || !formData.message.trim()) {
            setError('Veuillez remplir tous les champs')
            return
        }

        if (formData.message.trim().length < 20) {
            setError('Votre message doit contenir au moins 20 caractères')
            return
        }

        try {
            setSubmitting(true)
            setError('')

            await api.post('/reviews', {
                rating: formData.rating,
                title: formData.title.trim(),
                message: formData.message.trim()
            })

            setSuccess(true)
            setFormData({ rating: 5, title: '', message: '' })

            setTimeout(() => setSuccess(false), 5000)
        } catch (err) {
            console.error('Erreur soumission avis:', err)
            setError(err.response?.data?.error || 'Erreur lors de l\'envoi de votre avis')
        } finally {
            setSubmitting(false)
        }
    }

    const handleRatingClick = (rating) => {
        setFormData({ ...formData, rating })
    }

    return (
        <div className="review-submission-form">
            {success && (
                <div className="review-success-message">
                    <span className="success-icon"><CheckCircle2 size={16} /></span>
                    <div>
                        <h4>Merci pour votre avis !</h4>
                        <p>Votre retour d'expérience sera publié après validation par notre équipe.</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Note globale *</label>
                    <div className="rating-selector">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                className={`star-btn ${star <= formData.rating ? 'active' : ''}`}
                                onClick={() => handleRatingClick(star)}
                            >
                                {star <= formData.rating ? <Star size={14} fill="currentColor" /> : '☆'}
                            </button>
                        ))}
                        <span className="rating-text">
                            {formData.rating}/5 - {
                                formData.rating === 5 ? 'Excellent' :
                                formData.rating === 4 ? 'Très bien' :
                                formData.rating === 3 ? 'Bien' :
                                formData.rating === 2 ? 'Moyen' :
                                'Insuffisant'
                            }
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Titre de votre avis *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Excellente communauté de trading"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        maxLength="100"
                        disabled={submitting}
                    />
                    <small className="char-count">{formData.title.length}/100</small>
                </div>

                <div className="form-group">
                    <label>Votre expérience *</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Partagez votre expérience avec La Sphere : analyses, signaux, communauté, support..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows="6"
                        maxLength="1000"
                        disabled={submitting}
                    />
                    <small className="char-count">{formData.message.length}/1000 (min. 20 caractères)</small>
                </div>

                {error && (
                    <div className="review-error-message">
                        <span className="error-icon"><AlertTriangle size={16} /></span>
                        {error}
                    </div>
                )}

                <div className="form-footer">
                    <p className="review-notice">
                        <FileEdit size={16} /> Votre avis sera publié après validation par notre équipe.
                        Nous nous réservons le droit de modérer les contenus inappropriés.
                    </p>
                    <button
                        type="submit"
                        className="btn-submit-review"
                        disabled={submitting}
                    >
                        {submitting ? <><Loader2 size={16} /> Envoi en cours...</> : <><Send size={16} /> Envoyer mon avis</>}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReviewSubmissionForm
