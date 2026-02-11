const nodemailer = require('nodemailer');
const https = require('https');

/**
 * Configuration du transporteur email
 *
 * Sur Render free tier, TOUS les ports SMTP sortants sont bloqués.
 * On utilise donc l'API HTTP Brevo (port 443) quand BREVO_API_KEY est défini.
 * Sur serveur dédié, on utilise le SMTP OVH classique.
 */

const useBrevoApi = !!process.env.BREVO_API_KEY;

// Transporter SMTP classique (pour serveur dédié ou fallback)
const smtpPort = parseInt(process.env.SMTP_PORT) || 465;
const smtpTransporter = nodemailer.createTransport({
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

/**
 * Envoyer un email via l'API HTTP Brevo (port 443, jamais bloqué)
 */
function sendViaBrevoApi(mailOptions) {
    return new Promise((resolve, reject) => {
        const fromEmail = (process.env.SMTP_USER || 'contact@lasphere.xyz').toLowerCase();
        const fromName = 'La Sphere';

        const data = JSON.stringify({
            sender: { name: fromName, email: fromEmail },
            to: [{ email: mailOptions.to }],
            subject: mailOptions.subject,
            htmlContent: mailOptions.html
        });

        const options = {
            hostname: 'api.brevo.com',
            port: 443,
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY,
                'content-type': 'application/json',
                'content-length': Buffer.byteLength(data)
            }
        };

        console.log(`📤 Brevo API: envoi à ${mailOptions.to}, sujet: ${mailOptions.subject}, from: ${fromEmail}`);

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`📨 Brevo API response: ${res.statusCode} - ${body}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    const parsed = JSON.parse(body);
                    resolve({
                        messageId: parsed.messageId || 'brevo-' + Date.now(),
                        response: `Brevo API ${res.statusCode} OK`
                    });
                } else {
                    reject(new Error(`Brevo API error ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

/**
 * Transporter compatible - utilise Brevo API HTTP ou SMTP selon la config
 */
const transporter = {
    sendMail: async (mailOptions) => {
        if (useBrevoApi) {
            return sendViaBrevoApi(mailOptions);
        }
        return smtpTransporter.sendMail(mailOptions);
    },
    verify: async () => {
        if (useBrevoApi) {
            // Test l'API Brevo avec un appel simple
            return new Promise((resolve, reject) => {
                const options = {
                    hostname: 'api.brevo.com',
                    port: 443,
                    path: '/v3/account',
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'api-key': process.env.BREVO_API_KEY
                    }
                };

                const req = https.request(options, (res) => {
                    let body = '';
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        if (res.statusCode === 200) {
                            resolve(true);
                        } else {
                            reject(new Error(`Brevo API verify failed: ${res.statusCode} ${body}`));
                        }
                    });
                });

                req.on('error', reject);
                req.end();
            });
        }
        return smtpTransporter.verify();
    },
    options: {
        host: useBrevoApi ? 'api.brevo.com (HTTP API)' : (process.env.SMTP_HOST || 'ssl0.ovh.net')
    }
};

console.log(useBrevoApi ? '📧 Email configuré via Brevo HTTP API' : '📧 Email configuré via SMTP OVH');

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
