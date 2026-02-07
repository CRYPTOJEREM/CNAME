
import React from 'react'

const Header = ({ activeTab, setActiveTab }) => {
    return (
        <nav>
            <div className="nav-container">
                <div className="logo" onClick={() => setActiveTab('accueil')}>
                    <span>LA SPHERE</span>
                </div>
                <ul className="nav-links">
                    <li><button onClick={() => setActiveTab('accueil')} className={activeTab === 'accueil' ? 'active' : ''}>Accueil</button></li>
                    <li><button onClick={() => setActiveTab('actualites')} className={activeTab === 'actualites' ? 'active' : ''}>Actualités</button></li>
                    <li><button onClick={() => setActiveTab('calendrier')} className={activeTab === 'calendrier' ? 'active' : ''}>Calendrier Éco</button></li>
                    <li><button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard Crypto</button></li>
                    <li><button onClick={() => setActiveTab('apprentissage')} className={activeTab === 'apprentissage' ? 'active' : ''}>Apprentissage</button></li>
                    <li><button
                        onClick={() => setActiveTab('abonnements')}
                        className={`${activeTab === 'abonnements' ? 'active' : ''} abonnements-btn`}
                    >
                        💎 Abonnements
                    </button></li>
                    <li><button onClick={() => setActiveTab('assistance')} className={activeTab === 'assistance' ? 'active' : ''}>Assistance</button></li>
                </ul>
            </div>
        </nav>
    )
}

export default Header
