
import React from 'react'

const Footer = () => {
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
                <a href="#" className="footer-link">CGU</a> •
                <a href="#" className="footer-link">Mentions Légales</a> •
                <a href="mailto:contact@lasphere.xyz" className="footer-link">Contact</a>
            </p>
        </footer>
    )
}

export default Footer
