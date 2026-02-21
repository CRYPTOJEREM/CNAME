
import { useState } from 'react'
import newsletterService from '../services/newsletterService'
import { AlertTriangle, CheckCircle2, Mail, Scale, ScrollText, XCircle } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | 'exists'
    const [statusMessage, setStatusMessage] = useState('');

    const handleCGUClick = (e) => {
        e.preventDefault();
        if (window.activeTabSetter) {
            window.activeTabSetter('cgu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!email || loading) return;

        setLoading(true);
        setStatus(null);

        try {
            await newsletterService.subscribe(email, 'footer');
            setStatus('success');
            setStatusMessage('Inscription réussie !');
            setEmail('');
            localStorage.setItem('newsletterSubscribed', 'true');
        } catch (error) {
            if (error.response?.status === 409) {
                setStatus('exists');
                setStatusMessage('Cet email est déjà inscrit');
            } else {
                setStatus('error');
                setStatusMessage('Une erreur est survenue');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer>
            {/* Newsletter */}
            <div className="footer-newsletter">
                <div className="footer-newsletter-content">
                    <h3 className="footer-newsletter-title">Restez informé</h3>
                    <p className="footer-newsletter-text">Recevez nos analyses et actualités crypto directement dans votre boîte mail.</p>
                    <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre adresse email"
                            className="footer-newsletter-input"
                            disabled={loading}
                            required
                        />
                        <button type="submit" className="footer-newsletter-btn" disabled={loading}>
                            {loading ? '...' : "S'inscrire"}
                        </button>
                    </form>
                    {status && (
                        <p className={`footer-newsletter-status ${status}`}>
                            {status === 'success' && <CheckCircle2 size={16} />} {status === 'error' && <XCircle size={16} />} {status === 'exists' && 'ℹ️'} {statusMessage}
                        </p>
                    )}
                </div>
            </div>

            <div className="footer-warning">
                <p className="footer-warning-title"><AlertTriangle size={18} /> AVERTISSEMENT IMPORTANT</p>
                <p className="footer-warning-text">
                    <strong>AUCUN CONSEIL FINANCIER</strong> : Les informations fournies sur ce site sont à titre éducatif uniquement.
                    Le trading comporte des risques de perte en capital. Ne tradez jamais plus que ce que vous pouvez vous permettre de perdre.
                    Effectuez vos propres recherches (DYOR) avant tout investissement.
                </p>
            </div>
            <p>&copy; 2026 La Sphere | Données fournies à titre informatif uniquement</p>
            <p className="footer-author">Par CRYPTOJEREM - La Sphere</p>
            <p className="footer-links">
                <a href="#cgu" onClick={handleCGUClick} className="footer-link"><ScrollText size={16} /> CGU</a> •
                <a href="#cgu" onClick={handleCGUClick} className="footer-link"><Scale size={16} /> Politique de Confidentialité</a> •
                <a href="mailto:contact@lasphere.xyz" className="footer-link"><Mail size={16} /> Contact</a>
            </p>
        </footer>
    )
}

export default Footer
