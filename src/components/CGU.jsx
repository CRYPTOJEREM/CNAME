import React from 'react'

const CGU = () => {
    return (
        <section className="cgu-section">
            <div className="cgu-container">
                <div className="cgu-header">
                    <h1>📜 Conditions Générales d'Utilisation</h1>
                    <p className="cgu-update">Dernière mise à jour : 8 février 2026</p>
                </div>

                <div className="cgu-content">
                    {/* Article 1 */}
                    <div className="cgu-article">
                        <h2>1. Objet et Acceptation</h2>
                        <p>
                            Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'accès et
                            l'utilisation de la plateforme <strong>La Sphere</strong> (ci-après "le Site"), accessible à
                            l'adresse <a href="https://lasphere.xyz">lasphere.xyz</a>.
                        </p>
                        <p>
                            En accédant et en utilisant le Site, vous acceptez sans réserve les présentes CGU.
                            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.
                        </p>
                        <div className="cgu-note">
                            <span className="note-icon">💡</span>
                            <span>L'utilisation du Site implique l'acceptation pleine et entière des CGU en vigueur au moment de votre connexion.</span>
                        </div>
                    </div>

                    {/* Article 2 */}
                    <div className="cgu-article">
                        <h2>2. Présentation du Service</h2>
                        <p>
                            <strong>La Sphere</strong> est une plateforme communautaire dédiée aux cryptomonnaies,
                            proposant les services suivants :
                        </p>
                        <ul className="cgu-list">
                            <li>📊 <strong>Dashboard crypto en temps réel</strong> - Suivi des prix et analyses de marché</li>
                            <li>📅 <strong>Calendrier économique</strong> - Événements importants et actualités</li>
                            <li>🎓 <strong>Formations et contenus éducatifs</strong> - Tutoriels, vidéos et guides</li>
                            <li>💎 <strong>Abonnements Premium et VIP</strong> - Accès à du contenu exclusif</li>
                            <li>💬 <strong>Communauté Telegram</strong> - Groupe VIP et support</li>
                            <li>📰 <strong>Actualités crypto</strong> - Veille quotidienne du secteur</li>
                        </ul>
                        <p>
                            Le Site fournit des <strong>informations à caractère éducatif et informatif</strong>
                            et ne constitue en aucun cas un conseil en investissement financier.
                        </p>
                    </div>

                    {/* Article 3 */}
                    <div className="cgu-article">
                        <h2>3. Inscription et Compte Utilisateur</h2>

                        <h3>3.1 Création de Compte</h3>
                        <p>
                            L'accès à certaines fonctionnalités du Site nécessite la création d'un compte utilisateur.
                            Lors de votre inscription, vous devez fournir :
                        </p>
                        <ul className="cgu-list">
                            <li>✉️ Une adresse email valide</li>
                            <li>👤 Votre prénom et nom</li>
                            <li>📱 Votre nom d'utilisateur Telegram (optionnel mais requis pour l'accès au groupe VIP)</li>
                            <li>🔐 Un mot de passe sécurisé</li>
                        </ul>

                        <h3>3.2 Vérification Email</h3>
                        <p>
                            Un email de vérification sera envoyé à l'adresse indiquée. Vous devez cliquer sur le lien
                            de confirmation dans les 24 heures pour activer votre compte.
                        </p>

                        <h3>3.3 Responsabilité du Compte</h3>
                        <p>
                            Vous êtes responsable de la confidentialité de vos identifiants. Toute activité effectuée
                            avec votre compte est présumée avoir été effectuée par vous. En cas de suspicion d'utilisation
                            non autorisée, contactez immédiatement l'équipe de La Sphere.
                        </p>

                        <div className="cgu-warning">
                            <span className="warning-icon">⚠️</span>
                            <div>
                                <strong>Important :</strong> Vous devez avoir au moins 18 ans pour créer un compte
                                et utiliser les services de La Sphere.
                            </div>
                        </div>
                    </div>

                    {/* Article 4 */}
                    <div className="cgu-article">
                        <h2>4. Abonnements et Paiements</h2>

                        <h3>4.1 Types d'Abonnements</h3>
                        <p>Le Site propose différents niveaux d'abonnement :</p>
                        <ul className="cgu-list">
                            <li>🆓 <strong>Gratuit</strong> - Accès aux fonctionnalités de base (dashboard, calendrier, actualités)</li>
                            <li>⭐ <strong>Premium</strong> - Accès au contenu exclusif, signaux de trading, groupe Telegram</li>
                            <li>💎 <strong>VIP</strong> - Accès complet incluant formations avancées, analyses personnalisées, webinaires</li>
                        </ul>

                        <h3>4.2 Modalités de Paiement</h3>
                        <p>
                            Les paiements sont traites via notre prestataire de paiement securise et peuvent etre effectues en
                            cryptomonnaies (Bitcoin, Ethereum, USDT, etc.). Les tarifs sont affiches en euros (EUR)
                            et convertis au taux en vigueur lors du paiement.
                        </p>

                        <h3>4.3 Durée et Renouvellement</h3>
                        <p>
                            Les abonnements Premium et VIP sont valables pour une durée de <strong>30 jours</strong>
                            à compter de la confirmation du paiement. Les abonnements ne sont pas renouvelés automatiquement.
                        </p>

                        <h3>4.4 Politique de Remboursement</h3>
                        <p>
                            Conformément à la nature numérique et immédiate des services fournis :
                        </p>
                        <ul className="cgu-list">
                            <li>❌ Les paiements en cryptomonnaies sont <strong>non remboursables</strong></li>
                            <li>✅ Aucun remboursement après accès au contenu premium</li>
                            <li>⚖️ Exception : en cas d'erreur technique avérée empêchant l'accès aux services</li>
                        </ul>

                        <div className="cgu-note">
                            <span className="note-icon">💡</span>
                            <span>
                                Vous pouvez tester gratuitement les fonctionnalités de base avant de souscrire
                                à un abonnement payant.
                            </span>
                        </div>
                    </div>

                    {/* Article 5 */}
                    <div className="cgu-article">
                        <h2>5. Accès Groupe Telegram VIP</h2>
                        <p>
                            Les abonnés Premium et VIP bénéficient d'un accès au groupe Telegram privé de La Sphere.
                        </p>

                        <h3>5.1 Ajout au Groupe</h3>
                        <p>
                            Après confirmation de votre paiement, vous recevrez une invitation automatique au groupe
                            Telegram à l'adresse indiquée lors de votre inscription. L'ajout est effectué dans un
                            délai maximum de 24 heures.
                        </p>

                        <h3>5.2 Règles du Groupe</h3>
                        <p>En rejoignant le groupe Telegram, vous vous engagez à :</p>
                        <ul className="cgu-list">
                            <li>🤝 Respecter les autres membres de la communauté</li>
                            <li>🚫 Ne pas spammer, insulter ou harceler</li>
                            <li>📊 Partager des analyses constructives et argumentées</li>
                            <li>❌ Ne pas faire de publicité ou de promotion non autorisée</li>
                            <li>🔒 Respecter la confidentialité des échanges du groupe</li>
                        </ul>

                        <div className="cgu-warning">
                            <span className="warning-icon">⚠️</span>
                            <div>
                                <strong>Sanction :</strong> Tout manquement aux règles du groupe peut entraîner
                                l'exclusion immédiate sans remboursement.
                            </div>
                        </div>
                    </div>

                    {/* Article 6 */}
                    <div className="cgu-article">
                        <h2>6. Avertissement sur les Risques</h2>

                        <h3>6.1 Nature des Contenus</h3>
                        <p>
                            Les informations, analyses et formations fournies sur La Sphere ont un
                            <strong> caractère purement éducatif et informatif</strong>. Elles ne constituent
                            en aucun cas :
                        </p>
                        <ul className="cgu-list">
                            <li>❌ Un conseil en investissement financier personnalisé</li>
                            <li>❌ Une recommandation d'achat ou de vente d'actifs</li>
                            <li>❌ Une garantie de performance ou de résultats</li>
                        </ul>

                        <h3>6.2 Risques des Cryptomonnaies</h3>
                        <div className="cgu-warning">
                            <span className="warning-icon">⚠️</span>
                            <div>
                                <strong>Avertissement Important :</strong>
                                <p style={{ marginTop: '10px' }}>
                                    Le trading et l'investissement en cryptomonnaies comportent des
                                    <strong> risques de perte en capital importants</strong>. Les marchés crypto
                                    sont extrêmement volatils et non régulés dans de nombreux pays.
                                </p>
                                <p>
                                    <strong>N'investissez que ce que vous pouvez vous permettre de perdre.</strong>
                                </p>
                            </div>
                        </div>

                        <h3>6.3 Responsabilité de l'Utilisateur</h3>
                        <p>
                            Vous êtes seul responsable de vos décisions d'investissement. La Sphere et ses
                            collaborateurs ne peuvent être tenus responsables des pertes financières résultant
                            de l'utilisation des informations présentes sur le Site.
                        </p>
                    </div>

                    {/* Article 7 */}
                    <div className="cgu-article">
                        <h2>7. Propriété Intellectuelle</h2>
                        <p>
                            L'ensemble du contenu présent sur le Site (textes, images, vidéos, logos, graphiques,
                            code source, etc.) est la propriété exclusive de La Sphere ou de ses partenaires et est
                            protégé par les lois françaises et internationales sur la propriété intellectuelle.
                        </p>

                        <h3>7.1 Utilisation Autorisée</h3>
                        <p>Vous êtes autorisé à :</p>
                        <ul className="cgu-list">
                            <li>✅ Consulter et utiliser le contenu pour un usage personnel et non commercial</li>
                            <li>✅ Partager des liens vers le Site</li>
                        </ul>

                        <h3>7.2 Utilisation Interdite</h3>
                        <p>Il est strictement interdit de :</p>
                        <ul className="cgu-list">
                            <li>❌ Copier, reproduire, modifier ou distribuer le contenu sans autorisation écrite</li>
                            <li>❌ Utiliser le contenu à des fins commerciales</li>
                            <li>❌ Extraire ou télécharger massivement les données du Site (scraping)</li>
                            <li>❌ Supprimer les mentions de copyright ou de propriété</li>
                        </ul>
                    </div>

                    {/* Article 8 */}
                    <div className="cgu-article">
                        <h2>8. Protection des Données Personnelles</h2>
                        <p>
                            La Sphere s'engage à protéger vos données personnelles conformément au Règlement Général
                            sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                        </p>

                        <h3>8.1 Données Collectées</h3>
                        <p>Nous collectons les données suivantes :</p>
                        <ul className="cgu-list">
                            <li>👤 Données d'identification (nom, prénom, email)</li>
                            <li>📱 Nom d'utilisateur Telegram</li>
                            <li>💳 Donnees de paiement (traitees par notre prestataire securise)</li>
                            <li>📊 Données de navigation et d'utilisation (cookies, logs)</li>
                        </ul>

                        <h3>8.2 Utilisation des Données</h3>
                        <p>Vos données sont utilisées pour :</p>
                        <ul className="cgu-list">
                            <li>✅ Gérer votre compte et vos abonnements</li>
                            <li>✅ Vous fournir l'accès aux services</li>
                            <li>✅ Vous contacter par email (notifications, newsletter)</li>
                            <li>✅ Améliorer nos services</li>
                        </ul>

                        <h3>8.3 Vos Droits</h3>
                        <p>Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition
                        concernant vos données. Pour exercer ces droits, contactez-nous à :
                        <strong> contact@lasphere.xyz</strong></p>

                        <div className="cgu-note">
                            <span className="note-icon">🔒</span>
                            <span>
                                Vos données ne sont jamais vendues à des tiers. Consultez notre Politique de
                                Confidentialité pour plus de détails.
                            </span>
                        </div>
                    </div>

                    {/* Article 9 */}
                    <div className="cgu-article">
                        <h2>9. Limitation de Responsabilité</h2>

                        <h3>9.1 Disponibilité du Service</h3>
                        <p>
                            La Sphere s'efforce d'assurer l'accès au Site 24h/24 et 7j/7, mais ne peut garantir
                            une disponibilité continue. Le Site peut être temporairement indisponible pour des
                            raisons de maintenance, de pannes techniques ou de force majeure.
                        </p>

                        <h3>9.2 Exactitude des Informations</h3>
                        <p>
                            Les données de marché et les informations affichées sur le Site proviennent de sources
                            tierces (CoinGecko, etc.). La Sphere ne garantit pas l'exactitude, l'exhaustivité ou
                            l'actualité de ces informations.
                        </p>

                        <h3>9.3 Liens Externes</h3>
                        <p>
                            Le Site peut contenir des liens vers des sites tiers. La Sphere n'a aucun contrôle
                            sur ces sites et décline toute responsabilité quant à leur contenu.
                        </p>
                    </div>

                    {/* Article 10 */}
                    <div className="cgu-article">
                        <h2>10. Résiliation et Suspension</h2>

                        <h3>10.1 Par l'Utilisateur</h3>
                        <p>
                            Vous pouvez à tout moment supprimer votre compte en nous contactant. La suppression
                            entraîne la perte de l'accès à tous les contenus premium sans remboursement.
                        </p>

                        <h3>10.2 Par La Sphere</h3>
                        <p>
                            La Sphere se réserve le droit de suspendre ou de supprimer votre compte sans préavis
                            ni remboursement en cas de :
                        </p>
                        <ul className="cgu-list">
                            <li>❌ Violation des présentes CGU</li>
                            <li>❌ Comportement inapproprié ou nuisible</li>
                            <li>❌ Tentative de fraude ou d'abus</li>
                            <li>❌ Non-paiement ou litige sur un paiement</li>
                        </ul>
                    </div>

                    {/* Article 11 */}
                    <div className="cgu-article">
                        <h2>11. Modification des CGU</h2>
                        <p>
                            La Sphere se réserve le droit de modifier les présentes CGU à tout moment.
                            Les modifications entrent en vigueur dès leur publication sur le Site.
                        </p>
                        <p>
                            Les utilisateurs seront informés des modifications importantes par email ou via
                            une notification sur le Site. L'utilisation continue du Site après modification
                            vaut acceptation des nouvelles conditions.
                        </p>
                    </div>

                    {/* Article 12 */}
                    <div className="cgu-article">
                        <h2>12. Loi Applicable et Juridiction</h2>
                        <p>
                            Les présentes CGU sont régies par le droit français. En cas de litige, et à défaut
                            de résolution amiable, les tribunaux français seront seuls compétents.
                        </p>
                    </div>

                    {/* Article 13 */}
                    <div className="cgu-article">
                        <h2>13. Contact</h2>
                        <p>
                            Pour toute question concernant les présentes CGU ou l'utilisation du Site, vous
                            pouvez nous contacter :
                        </p>
                        <div className="cgu-contact">
                            <div className="contact-item">
                                <span className="contact-icon">✉️</span>
                                <div>
                                    <strong>Email :</strong> contact@lasphere.xyz
                                </div>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">💬</span>
                                <div>
                                    <strong>Telegram :</strong> @LaSphereSupport
                                </div>
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">🌐</span>
                                <div>
                                    <strong>Site Web :</strong> <a href="https://lasphere.xyz">lasphere.xyz</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer CGU */}
                    <div className="cgu-footer">
                        <p>
                            <strong>La Sphere</strong> - Plateforme communautaire crypto
                        </p>
                        <p>
                            Dernière mise à jour : 8 février 2026
                        </p>
                        <p className="cgu-disclaimer">
                            ⚠️ <strong>Avertissement :</strong> Le trading de cryptomonnaies comporte des risques
                            importants de perte en capital. N'investissez que ce que vous pouvez vous permettre de perdre.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CGU
