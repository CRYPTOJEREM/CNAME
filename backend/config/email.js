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

        const payload = {
            sender: { name: fromName, email: fromEmail },
            to: [{ email: mailOptions.to }],
            subject: mailOptions.subject,
            htmlContent: mailOptions.html
        };
        if (mailOptions.text) {
            payload.textContent = mailOptions.text;
        }
        const data = JSON.stringify(payload);

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
 * Template HTML moderne et professionnel pour les emails
 * Design responsive, compatible tous clients email
 */
function getEmailTemplate(content, ctaText = '', ctaLink = '') {
    const currentYear = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>La Sphere</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <!-- Wrapper complet -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7fa; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Container principal -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">

                    <!-- Header avec gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                                LA SPHERE
                            </h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 300; letter-spacing: 1px;">
                                Crypto Trading Premium
                            </p>
                        </td>
                    </tr>

                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 50px 40px; color: #2d3748; font-size: 16px; line-height: 1.8;">
                            ${content}
                        </td>
                    </tr>

                    ${ctaText && ctaLink ? `
                    <!-- Call to Action -->
                    <tr>
                        <td style="padding: 0 40px 50px 40px; text-align: center;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                                        <a href="${ctaLink}" target="_blank" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">
                                            ${ctaText}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    ` : ''}

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <div style="border-top: 1px solid #e2e8f0;"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; text-align: center; background-color: #f8fafc;">
                            <p style="margin: 0 0 15px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                                <strong style="color: #4a5568;">La Sphere</strong><br>
                                Votre plateforme de trading crypto premium
                            </p>
                            <p style="margin: 0 0 15px 0;">
                                <a href="https://lasphere.xyz" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 500; font-size: 14px;">
                                    lasphere.xyz
                                </a>
                            </p>
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                © ${currentYear} La Sphere. Tous droits réservés.
                            </p>
                            <p style="margin: 10px 0 0 0; color: #cbd5e0; font-size: 11px;">
                                Vous recevez cet email car vous êtes inscrit sur La Sphere
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Spacer après le container -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
                    <tr>
                        <td style="padding: 20px 0; text-align: center;">
                            <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                Problème d'affichage ? <a href="${process.env.FRONTEND_URL}" target="_blank" style="color: #667eea; text-decoration: none;">Voir dans le navigateur</a>
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>`;
}

module.exports = {
    transporter,
    verifyEmailConfig,
    getEmailTemplate
};
