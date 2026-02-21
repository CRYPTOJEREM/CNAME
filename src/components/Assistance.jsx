
import React, { useState } from 'react'
import { AlertTriangle, BarChart3, HelpCircle, Mail, MessageCircle, ScrollText, Smartphone, Wallet } from 'lucide-react';

const Assistance = () => {
    const [showFAQ, setShowFAQ] = useState(false)

    return (
        <section className="assistance-section">
            <div className="assistance-container">
                <div className="section-title">
                    <h2><MessageCircle size={22} /> ASSISTANCE & INFORMATIONS LÉGALES</h2>
                    <p>Tout ce que vous devez savoir sur La Sphere</p>
                </div>

                {/* Avertissement important */}
                <div className="warning-box">
                    <div className="warning-icon"><AlertTriangle size={16} /></div>
                    <div className="warning-content">
                        <h3>Avertissement Important</h3>
                        <p><strong>AUCUNE INFORMATION FOURNIE SUR CE SITE NE CONSTITUE UN CONSEIL FINANCIER.</strong></p>
                        <p>Les contenus, analyses, opinions et informations partagés sur La Sphere sont fournis <strong>à titre purement éducatif et informatif</strong>.</p>
                        <p><strong>Trading et investissement comportent des risques :</strong> Vous pouvez perdre tout ou partie de votre capital.</p>
                        <p><strong>Faites vos propres recherches (DYOR) :</strong> Avant toute décision d'investissement.</p>
                    </div>
                </div>

                {/* Support & Contact */}
                <div className="assistance-grid">
                    <div className="assistance-card">
                        <span className="assistance-icon"><Mail size={16} /></span>
                        <h3>Contact Email</h3>
                        <p>Pour toute question, suggestion ou problème technique</p>
                        <a href="mailto:contact@lasphere.xyz" className="assistance-btn">contact@lasphere.xyz</a>
                    </div>

                    <div className="assistance-card">
                        <span className="assistance-icon"><MessageCircle size={16} /></span>
                        <h3>Support Discord</h3>
                        <p>Assistance en temps réel via notre serveur Discord</p>
                        <a href="#" target="_blank" className="assistance-btn">Rejoindre Discord</a>
                    </div>

                    <div className="assistance-card">
                        <span className="assistance-icon"><Smartphone size={16} /></span>
                        <h3>Telegram Support</h3>
                        <p>Support prioritaire pour les membres VIP</p>
                        <a href="#" target="_blank" className="assistance-btn">Contacter sur Telegram</a>
                    </div>

                    <div className="assistance-card">
                        <span className="assistance-icon"><HelpCircle size={16} /></span>
                        <h3>FAQ</h3>
                        <p>Réponses aux questions fréquentes</p>
                        <button onClick={() => setShowFAQ(!showFAQ)} className="assistance-btn">{showFAQ ? 'Masquer la FAQ' : 'Voir la FAQ'}</button>
                    </div>
                </div>

                {/* FAQ Section */}
                {showFAQ && (
                    <div id="faq-section" className="faq-section">
                        <h3 className="faq-section-title">Questions Fréquentes</h3>

                        <div className="faq-item">
                            <div className="faq-question"><Wallet size={16} /> Les services de La Sphere sont-ils gratuits ?</div>
                            <div className="faq-answer">Oui ! Le site, le Dashboard Crypto, le Calendrier Économique et le groupe Telegram gratuit sont 100% gratuits.</div>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question"><BarChart3 size={16} /> D'où proviennent les données du Dashboard ?</div>
                            <div className="faq-answer">Les données crypto proviennent de l'API CoinGecko et sont actualisées toutes les 30 secondes.</div>
                        </div>
                        {/* More FAQ items omitted for brevity */}
                    </div>
                )}

                {/* Mentions Légales */}
                <div className="legal-section">
                    <h3><ScrollText size={16} /> Conditions Générales d'Utilisation (CGU)</h3>
                    <div className="legal-box">
                        <h4>1. Acceptation des conditions</h4>
                        <p>En accédant et en utilisant le site La Sphere, vous acceptez sans réserve les présentes CGU.</p>
                    </div>
                    {/* More legal boxes omitted for brevity */}
                </div>
            </div>
        </section>
    )
}

export default Assistance
