
import React from 'react'

const Footer = () => {
    const handleCGUClick = (e) => {
        e.preventDefault();
        if (window.activeTabSetter) {
            window.activeTabSetter('cgu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer>
            <div className="footer-warning">
                <p className="footer-warning-title">⚠️ AVERTISSEMENT IMPORTANT</p>
                <p className="footer-warning-text">
                    <strong>AUCUN CONSEIL FINANCIER</strong> : Les informations fournies sur ce site sont à titre éducatif uniquement.
                    Le trading comporte des risques de perte en capital. Ne tradez jamais plus que ce que vous pouvez vous permettre de perdre.
                    Effectuez vos propres recherches (DYOR) avant tout investissement.
                </p>
            </div>
            <p>&copy; 2026 La Sphere | Données fournies à titre informatif uniquement</p>
            <p className="footer-author">Par CRYPTOJEREM - La Sphere</p>
            <p className="footer-links">
                <a href="#cgu" onClick={handleCGUClick} className="footer-link">📜 CGU</a> •
                <a href="#cgu" onClick={handleCGUClick} className="footer-link">⚖️ Politique de Confidentialité</a> •
                <a href="mailto:contact@lasphere.xyz" className="footer-link">✉️ Contact</a>
            </p>
        </footer>
    )
}

export default Footer
