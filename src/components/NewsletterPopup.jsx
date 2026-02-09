import { useState, useEffect } from 'react';
import newsletterService from '../services/newsletterService';

const NewsletterPopup = () => {
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        // Ne pas afficher si déjà inscrit ou déjà fermé cette session
        if (
            localStorage.getItem('newsletterSubscribed') ||
            sessionStorage.getItem('newsletterPopupDismissed')
        ) {
            return;
        }

        const handleScroll = () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
            if (scrollPercent > 0.5) {
                setVisible(true);
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClose = () => {
        setVisible(false);
        sessionStorage.setItem('newsletterPopupDismissed', 'true');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || loading) return;

        setLoading(true);
        try {
            await newsletterService.subscribe(email, 'popup');
            setStatus('success');
            localStorage.setItem('newsletterSubscribed', 'true');
            setTimeout(() => setVisible(false), 2000);
        } catch (error) {
            if (error.response?.status === 409) {
                setStatus('exists');
                localStorage.setItem('newsletterSubscribed', 'true');
                setTimeout(() => setVisible(false), 2000);
            } else {
                setStatus('error');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <div className="newsletter-popup-overlay" onClick={handleClose}>
            <div className="newsletter-popup-card" onClick={(e) => e.stopPropagation()}>
                <button className="newsletter-popup-close" onClick={handleClose}>✕</button>

                <h3 className="newsletter-popup-title">Ne manquez aucune opportunité</h3>
                <p className="newsletter-popup-text">
                    Recevez nos meilleures analyses crypto et alertes marché directement par email.
                </p>

                {status === 'success' ? (
                    <p className="newsletter-popup-success">✅ Inscription réussie !</p>
                ) : status === 'exists' ? (
                    <p className="newsletter-popup-success">ℹ️ Vous êtes déjà inscrit !</p>
                ) : (
                    <form className="newsletter-popup-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre adresse email"
                            className="newsletter-popup-input"
                            disabled={loading}
                            required
                        />
                        <button type="submit" className="newsletter-popup-btn" disabled={loading}>
                            {loading ? '...' : "S'inscrire gratuitement"}
                        </button>
                        {status === 'error' && (
                            <p className="newsletter-popup-error">❌ Une erreur est survenue</p>
                        )}
                    </form>
                )}

                <p className="newsletter-popup-privacy">Pas de spam. Désinscription en un clic.</p>
            </div>
        </div>
    );
};

export default NewsletterPopup;
