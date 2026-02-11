const nodemailer = require('nodemailer');

/**
 * Configuration du transporteur email
 * Utilise Brevo (API SMTP) si BREVO_API_KEY est défini,
 * sinon fallback sur SMTP OVH classique
 */
let transporter;

if (process.env.BREVO_API_KEY) {
    // Brevo SMTP relay (fonctionne sur Render car port 587 Brevo n'est pas bloqué)
    transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_LOGIN || process.env.SMTP_USER || 'Contact@lasphere.xyz',
            pass: process.env.BREVO_API_KEY
        }
    });
    console.log('📧 Email configuré via Brevo SMTP relay');
} else {
    // Fallback SMTP OVH classique (pour serveur dédié)
    const smtpPort = parseInt(process.env.SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'ssl0.ovh.net',
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: process.env.SMTP_USER || 'Contact@lasphere.xyz',
            pass: process.env.SMTP_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
    });
    console.log('📧 Email configuré via SMTP OVH');
}

/**
 * Vérifier la configuration email
 */
async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('✅ Configuration email vérifiée');
        return true;
    } catch (error) {
        console.error('❌ Erreur configuration email:', error.message);
        return false;
    }
}

/**
 * Template HTML de base pour les emails
 */
function getEmailTemplate(content) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 4px 20px rgba(0, 217, 255, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo {
                    font-size: 24px;
                    font-weight: bold;
                    color: #00D9FF;
                    margin-bottom: 10px;
                }
                .content {
                    background: white;
                    padding: 30px;
                    border-radius: 8px;
                    color: #333;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #00D9FF 0%, #7B2FF7 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🌐 LA SPHERE</div>
                </div>
                <div class="content">
                    ${content}
                </div>
                <div class="footer">
                    <p>&copy; 2026 La Sphere | Toutes les informations sont confidentielles</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

module.exports = {
    transporter,
    verifyEmailConfig,
    getEmailTemplate
};
