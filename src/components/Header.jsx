
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    Globe, Home, Newspaper, CalendarDays, BarChart3,
    GraduationCap, Gem, MessageCircle, Shield, Lock,
    Sparkles, Star, User, LogOut, ChevronDown
} from 'lucide-react'

const Header = ({ activeTab, setActiveTab }) => {
    const [scrolled, setScrolled] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, isAuthenticated, logout } = useAuth()

    useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 50)
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Fermer le menu quand on clique ailleurs
    useEffect(() => {
        const closeMenu = () => setUserMenuOpen(false)
        if (userMenuOpen) {
            document.addEventListener('click', closeMenu)
        }
        return () => document.removeEventListener('click', closeMenu)
    }, [userMenuOpen])

    const handleLogout = () => {
        logout()
        setUserMenuOpen(false)
    }

    // Fonction pour gérer le clic sur un onglet (ferme le menu mobile)
    const handleTabClick = (tab) => {
        setActiveTab(tab)
        setMobileMenuOpen(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getStatusIcon = (status) => {
        if (status === 'premium') return <Star size={12} />
        if (status === 'vip') return <Gem size={12} />
        return null
    }

    const getStatusLabel = (status) => {
        if (status === 'premium') return 'Premium'
        if (status === 'vip') return 'VIP'
        return 'Gratuit'
    }

    return (
        <nav className={scrolled ? 'scrolled' : ''}>
            <div className="nav-container">
                <div className="logo" onClick={() => handleTabClick('accueil')}>
                    <span className="logo-icon"><Globe size={22} /></span>
                    <span className="logo-text">LA SPHERE</span>
                </div>

                {/* Bouton Hamburger (visible uniquement sur mobile) */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Menu de navigation"
                >
                    <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>

                <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <li>
                        <button onClick={() => handleTabClick('accueil')} className={activeTab === 'accueil' ? 'active' : ''}>
                            <span className="nav-icon"><Home size={16} /></span>
                            <span className="nav-text">Accueil</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleTabClick('actualites')} className={activeTab === 'actualites' ? 'active' : ''}>
                            <span className="nav-icon"><Newspaper size={16} /></span>
                            <span className="nav-text">Actualités</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleTabClick('calendrier')} className={activeTab === 'calendrier' ? 'active' : ''}>
                            <span className="nav-icon"><CalendarDays size={16} /></span>
                            <span className="nav-text">Calendrier</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleTabClick('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>
                            <span className="nav-icon"><BarChart3 size={16} /></span>
                            <span className="nav-text">Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleTabClick('apprentissage')} className={activeTab === 'apprentissage' ? 'active' : ''}>
                            <span className="nav-icon"><GraduationCap size={16} /></span>
                            <span className="nav-text">Formation</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => handleTabClick('abonnements')}
                            className={`${activeTab === 'abonnements' ? 'active' : ''} abonnements-btn`}
                        >
                            <span className="nav-icon"><Gem size={16} /></span>
                            <span className="nav-text">Abonnements</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleTabClick('assistance')} className={activeTab === 'assistance' ? 'active' : ''}>
                            <span className="nav-icon"><MessageCircle size={16} /></span>
                            <span className="nav-text">Support</span>
                        </button>
                    </li>

                    {/* Lien Admin (uniquement pour les admins) */}
                    {isAuthenticated && user?.role === 'admin' && (
                        <li>
                            <button onClick={() => handleTabClick('admin')} className={`${activeTab === 'admin' ? 'active' : ''} admin-btn`}>
                                <span className="nav-icon"><Shield size={16} /></span>
                                <span className="nav-text">Admin</span>
                            </button>
                        </li>
                    )}

                    {/* Section Authentification */}
                    <li className="auth-section">
                        {!isAuthenticated ? (
                            <>
                                <button onClick={() => handleTabClick('login')} className="auth-btn login-btn">
                                    <Lock size={14} /> Connexion
                                </button>
                                <button onClick={() => handleTabClick('register')} className="auth-btn register-btn">
                                    <Sparkles size={14} /> Inscription
                                </button>
                            </>
                        ) : (
                            <div className="user-menu-container">
                                <button
                                    className="user-menu-trigger"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setUserMenuOpen(!userMenuOpen)
                                    }}
                                >
                                    <div className="user-avatar">
                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                    </div>
                                    <span className="user-name">{user.firstName}</span>
                                    <span className={`subscription-badge ${user.subscriptionStatus}`}>
                                        {getStatusIcon(user.subscriptionStatus)}
                                    </span>
                                    <ChevronDown size={14} className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`} />
                                </button>

                                {userMenuOpen && (
                                    <div className="user-dropdown">
                                        <div className="dropdown-header">
                                            <div className="dropdown-user-info">
                                                <div className="dropdown-avatar">
                                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="dropdown-name">{user.firstName} {user.lastName}</div>
                                                    <div className="dropdown-email">{user.email}</div>
                                                </div>
                                            </div>
                                            <div className={`dropdown-badge ${user.subscriptionStatus}`}>
                                                {getStatusIcon(user.subscriptionStatus)} {getStatusLabel(user.subscriptionStatus)}
                                            </div>
                                        </div>

                                        <div className="dropdown-divider"></div>

                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                handleTabClick('membre')
                                                setUserMenuOpen(false)
                                            }}
                                        >
                                            <span className="dropdown-icon"><User size={16} /></span>
                                            <span>Espace Membre</span>
                                        </button>

                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                handleTabClick('abonnements')
                                                setUserMenuOpen(false)
                                            }}
                                        >
                                            <span className="dropdown-icon"><Gem size={16} /></span>
                                            <span>Gérer l'abonnement</span>
                                        </button>

                                        <div className="dropdown-divider"></div>

                                        <button
                                            className="dropdown-item logout"
                                            onClick={() => {
                                                handleLogout()
                                                setMobileMenuOpen(false)
                                            }}
                                        >
                                            <span className="dropdown-icon"><LogOut size={16} /></span>
                                            <span>Déconnexion</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header
