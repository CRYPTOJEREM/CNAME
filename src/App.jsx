
import { useState, lazy, Suspense } from 'react'
import './index.css'
import './responsive.css'
import Header from './components/Header'
import Footer from './components/Footer'
import LoadingSpinner from './components/common/LoadingSpinner'
import NewsletterPopup from './components/NewsletterPopup'
import { useAuth } from './contexts/AuthContext'

// Lazy loading des composants lourds
const Hero = lazy(() => import('./components/Hero'))
const News = lazy(() => import('./components/News'))
const Calendar = lazy(() => import('./components/Calendar'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Assistance = lazy(() => import('./components/Assistance'))
const Subscriptions = lazy(() => import('./components/Subscriptions'))
const Learning = lazy(() => import('./components/Learning'))
const CGU = lazy(() => import('./components/CGU'))
const Login = lazy(() => import('./components/auth/Login'))
const Register = lazy(() => import('./components/auth/Register'))
const EmailVerification = lazy(() => import('./components/auth/EmailVerification'))
const ProtectedRoute = lazy(() => import('./components/common/ProtectedRoute'))
const MemberArea = lazy(() => import('./components/member/MemberArea'))
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'))

function getInitialTab() {
  const params = new URLSearchParams(window.location.search)
  const tab = params.get('tab')
  if (tab) return tab
  return 'accueil'
}

function App() {
  const [activeTab, setActiveTab] = useState(getInitialTab)
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
        <Suspense fallback={<LoadingSpinner />}>
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

          {activeTab === 'cgu' && (
            <div id="cgu" className="tab-content active">
              <CGU />
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

          {/* Panel Admin */}
          {activeTab === 'admin' && (
            <div id="admin" className="tab-content active">
              <AdminPanel />
            </div>
          )}
        </Suspense>
      </main>

      <Footer />
      <NewsletterPopup />
    </>
  )
}

export default App
