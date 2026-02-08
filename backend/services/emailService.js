const { transporter, getEmailTemplate } = require('../config/email');

/**
 * Envoyer un email de vérification
 */
async function sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}?tab=verify-email&token=${verificationToken}`;

    const content = `
        <h2>👋 Bienvenue ${user.firstName} !</h2>
        <p>Merci de vous être inscrit sur <strong>La Sphere</strong>.</p>
        <p>Pour activer votre compte et accéder à tous nos services, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" class="button" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00D9FF 0%, #7B2FF7 100%); color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold;">
                ✅ Vérifier mon email
            </a>
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Ou copiez ce lien dans votre navigateur :<br>
            <a href="${verificationUrl}" style="color: #00D9FF; word-break: break-all;">${verificationUrl}</a>
        </p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            ⚠️ Ce lien expire dans 24 heures.<br>
            Si vous n'avez pas créé de compte sur La Sphere, vous pouvez ignorer cet email en toute sécurité.
        </p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"La Sphere" <noreply@lasphere.com>',
        to: user.email,
        subject: '🌐 Vérifiez votre email - La Sphere',
        html: getEmailTemplate(content)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de vérification envoyé à ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur envoi email:', error.message);
        throw new Error('Erreur lors de l\'envoi de l\'email de vérification');
    }
}

/**
 * Envoyer un email de bienvenue après vérification
 */
async function sendWelcomeEmail(user) {
    const content = `
        <h2>🎉 Votre compte est activé !</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Votre email a été vérifié avec succès. Bienvenue dans la communauté <strong>La Sphere</strong> !</p>
        <h3>🚀 Que faire maintenant ?</h3>
        <ul style="line-height: 2; margin: 20px 0;">
            <li>📊 <strong>Consultez le Dashboard Crypto</strong> pour suivre les prix en temps réel</li>
            <li>📅 <strong>Utilisez le Calendrier Économique</strong> pour ne manquer aucun événement</li>
            <li>🎓 <strong>Accédez aux formations gratuites</strong> dans votre espace membre</li>
            <li>💎 <strong>Découvrez nos abonnements Premium et VIP</strong> pour du contenu exclusif</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" class="button" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00D9FF 0%, #7B2FF7 100%); color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold;">
                🌐 Accéder à La Sphere
            </a>
        </div>
        <p style="margin-top: 20px; color: #666;">
            Si vous avez des questions, n'hésitez pas à nous contacter via la section Assistance.
        </p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"La Sphere" <noreply@lasphere.com>',
        to: user.email,
        subject: '🎉 Bienvenue sur La Sphere !',
        html: getEmailTemplate(content)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de bienvenue envoyé à ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur envoi email bienvenue:', error.message);
        return false; // Ne pas bloquer si l'email de bienvenue échoue
    }
}

/**
 * Envoyer un email de confirmation de paiement
 */
async function sendPaymentConfirmationEmail(user, paymentDetails) {
    const content = `
        <h2>💳 Paiement confirmé !</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Nous avons bien reçu votre paiement pour l'abonnement <strong>${paymentDetails.planName}</strong>.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">📋 Détails du paiement</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0;"><strong>Plan :</strong></td>
                    <td style="padding: 8px 0;">${paymentDetails.planName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>Montant :</strong></td>
                    <td style="padding: 8px 0;">${paymentDetails.price}€</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;"><strong>Date :</strong></td>
                    <td style="padding: 8px 0;">${new Date().toLocaleDateString('fr-FR')}</td>
                </tr>
                ${user.subscriptionExpiresAt ? `
                <tr>
                    <td style="padding: 8px 0;"><strong>Expire le :</strong></td>
                    <td style="padding: 8px 0;">${new Date(user.subscriptionExpiresAt).toLocaleDateString('fr-FR')}</td>
                </tr>
                ` : ''}
            </table>
        </div>
        <h3>✅ Votre abonnement est actif !</h3>
        <p>Vous avez maintenant accès à :</p>
        <ul style="line-height: 2;">
            ${paymentDetails.planId === 'premium' || paymentDetails.planId === 'vip' ? `
            <li>📈 <strong>Analyses techniques quotidiennes</strong></li>
            <li>💹 <strong>Signaux de trading</strong></li>
            <li>📱 <strong>Groupe Telegram Premium</strong></li>
            <li>🎥 <strong>Webinaires exclusifs</strong></li>
            ` : ''}
            ${paymentDetails.planId === 'vip' ? `
            <li>👑 <strong>Contenu VIP exclusif</strong></li>
            <li>📞 <strong>Appels 1-on-1 mensuels</strong></li>
            <li>🎁 <strong>NFTs exclusifs La Sphere</strong></li>
            ` : ''}
        </ul>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}?tab=membre" class="button" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00D9FF 0%, #7B2FF7 100%); color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold;">
                👤 Accéder à mon espace membre
            </a>
        </div>
        <p style="margin-top: 30px; color: #666;">
            Merci pour votre confiance ! 🙏
        </p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"La Sphere" <noreply@lasphere.com>',
        to: user.email,
        subject: `✅ Paiement confirmé - ${paymentDetails.planName}`,
        html: getEmailTemplate(content)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de confirmation paiement envoyé à ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur envoi email confirmation paiement:', error.message);
        return false;
    }
}

/**
 * Envoyer un email de reset de mot de passe
 */
async function sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}?tab=reset-password&token=${resetToken}`;

    const content = `
        <h2>🔐 Réinitialisation de votre mot de passe</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe sur <strong>La Sphere</strong>.</p>
        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" class="button" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00D9FF 0%, #7B2FF7 100%); color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold;">
                🔑 Réinitialiser mon mot de passe
            </a>
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Ou copiez ce lien dans votre navigateur :<br>
            <a href="${resetUrl}" style="color: #00D9FF; word-break: break-all;">${resetUrl}</a>
        </p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            ⚠️ Ce lien expire dans 1 heure.<br>
            Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
        </p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"La Sphere" <noreply@lasphere.com>',
        to: user.email,
        subject: '🔐 Réinitialisation de votre mot de passe - La Sphere',
        html: getEmailTemplate(content)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de reset mot de passe envoyé à ${user.email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur envoi email reset:', error.message);
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPaymentConfirmationEmail,
    sendPasswordResetEmail
};
