
import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div className="footer-warning">
                <p style={{ color: '#FF3366', fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>⚠️ AVERTISSEMENT IMPORTANT</p>
                <p style={{ fontSize: '13px', maxWidth: '900px', margin: '0 auto 20px' }}>
                    <strong>AUCUN CONSEIL FINANCIER</strong> : Les informations fournies sur ce site sont à titre éducatif uniquement.
                    Le trading comporte des risques de perte en capital. Ne tradez jamais plus que ce que vous pouvez vous permettre de perdre.
                    Effectuez vos propres recherches (DYOR) avant tout investissement.
                </p>
            </div>
            <p>&copy; 2026 La Sphere | Données fournies à titre informatif uniquement</p>
            <p style={{ marginTop: '10px', color: '#00D9FF', fontWeight: 600 }}>Par CRYPTOJEREM - La Sphere</p>
            <p style={{ marginTop: '15px', fontSize: '12px' }}>
                <a href="#" style={{ color: '#7B8BA8', textDecoration: 'none' }}>CGU</a> •
                <a href="#" style={{ color: '#7B8BA8', textDecoration: 'none' }}>Mentions Légales</a> •
                <a href="mailto:contact@lasphere.xyz" style={{ color: '#7B8BA8', textDecoration: 'none' }}>Contact</a>
            </p>
        </footer>
    )
}

export default Footer
