
import { useState } from 'react'
import './index.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import News from './components/News'
import Calendar from './components/Calendar'
import Dashboard from './components/Dashboard'
import Learning from './components/Learning'
import Assistance from './components/Assistance'

function App() {
  const [activeTab, setActiveTab] = useState('accueil')

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
            <Learning />
          </div>
        )}

        {activeTab === 'assistance' && (
          <div id="assistance" className="tab-content active">
            <Assistance />
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
      </main>

      <Footer />
    </>
  )
}

export default App
