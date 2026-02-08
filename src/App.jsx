
import { useState } from 'react'
import './index.css'
import './responsive.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import News from './components/News'
import Calendar from './components/Calendar'
import Dashboard from './components/Dashboard'
import Assistance from './components/Assistance'
import Subscriptions from './components/Subscriptions'
import Learning from './components/Learning'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import EmailVerification from './components/auth/EmailVerification'
import LoadingSpinner from './components/common/LoadingSpinner'
import ProtectedRoute from './components/common/ProtectedRoute'
import MemberArea from './components/member/MemberArea'
import { useAuth } from './contexts/AuthContext'

function App() {
  const [activeTab, setActiveTab] = useState('accueil')
  const { loading } = useAuth()

  // Exposer setActiveTab globalement pour ProtectedRoute
  window.activeTabSetter = setActiveTab

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main>
        {activeTab === 'accueil' && (
          <div id="accueil" className="tab-content active">
            <Hero setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'actualites' && (
          <div id="actualites" className="tab-content active">
            <News />
          </div>
        )}

        {activeTab === 'calendrier' && (
          <div id="calendrier" className="tab-content active">
            <Calendar />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div id="dashboard" className="tab-content active">
            <Dashboard />
          </div>
        )}

        {activeTab === 'apprentissage' && (
          <div id="apprentissage" className="tab-content active">
            <Learning setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'assistance' && (
          <div id="assistance" className="tab-content active">
            <Assistance />
          </div>
        )}

        {activeTab === 'abonnements' && (
          <div id="abonnements" className="tab-content active">
            <Subscriptions />
          </div>
        )}

        {activeTab === 'fonctionnalites' && (
          <div id="fonctionnalites" className="tab-content active">
            <section className="container">
              <div className="section-title">
                <h2>FONCTIONNALITÉS</h2>
                <p>Découvrez tous les outils de La Sphere</p>
              </div>
            </section>
          </div>
        )}

        {/* Pages d'authentification */}
        {activeTab === 'login' && (
          <div id="login" className="tab-content active">
            <Login setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'register' && (
          <div id="register" className="tab-content active">
            <Register setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === 'verify-email' && (
          <div id="verify-email" className="tab-content active">
            <EmailVerification setActiveTab={setActiveTab} />
          </div>
        )}

        {/* Espace Membre */}
        {activeTab === 'membre' && (
          <div id="membre" className="tab-content active">
            <ProtectedRoute>
              <MemberArea setActiveTab={setActiveTab} />
            </ProtectedRoute>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}

export default App
