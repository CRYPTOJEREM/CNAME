const { transporter, getEmailTemplate } = require('../config/email');

/**
 * Envoyer un email de vérification
 */
async function sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}?tab=verify-email&token=${verificationToken}`;

    const content = `
        <h2>Bienvenue ${user.firstName} !</h2>
        <p>Merci de vous etre inscrit sur <strong>La Sphere</strong>.</p>
        <p>Pour activer votre compte, veuillez verifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verifier mon email
            </a>
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Ou copiez ce lien dans votre navigateur :<br>
            <a href="${verificationUrl}" style="color: #007bff;">${verificationUrl}</a>
        </p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            Ce lien expire dans 24 heures.
            Si vous n'avez pas cree de compte sur La Sphere, vous pouvez ignorer cet email.
        </p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"La Sphere" <contact@lasphere.xyz>',
        to: user.email,
        subject: 'Verifiez votre email - La Sphere',
        html: getEmailTemplate(content),
        text: `Bienvenue ${user.firstName} !\n\nMerci de vous etre inscrit sur La Sphere.\n\nPour activer votre compte, cliquez sur ce lien :\n${verificationUrl}\n\nCe lien expire dans 24 heures.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de verification envoye a ${user.email}`);
        return true;
    } catch (error) {
        console.error('Erreur envoi email:', error.message);
        throw new Error('Erreur lors de l\'envoi de l\'email de verification');
    }
}

/**
 * Envoyer un email de bienvenue apres verification
 */
async function sendWelcomeEmail(user) {
    const content = `
        <h2>Votre compte est active !</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Votre email a ete verifie avec succes. Bienvenue dans la communaute <strong>La Sphere</strong> !</p>
        <p>Vous pouvez maintenant vous connecter et acceder a tous nos services.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Acceder a La Sphere
            </a>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"La Sphere" <contact@lasphere.xyz>',
        to: user.email,
        subject: 'Bienvenue sur La Sphere !',
        html: getEmailTemplate(content),
        text: `Bonjour ${user.firstName},\n\nVotre email a ete verifie avec succes. Bienvenue sur La Sphere !\n\nConnectez-vous sur ${process.env.FRONTEND_URL}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de bienvenue envoye a ${user.email}`);
        return true;
    } catch (error) {
        console.error('Erreur envoi email bienvenue:', error.message);
        return false;
    }
}

/**
 * Envoyer un email de confirmation de paiement
 */
async function sendPaymentConfirmationEmail(user, paymentDetails) {
    const content = `
        <h2>Paiement confirme</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Nous avons bien recu votre paiement pour l'abonnement <strong>${paymentDetails.planName}</strong>.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Plan :</strong> ${paymentDetails.planName}</p>
            <p><strong>Montant :</strong> ${paymentDetails.price} EUR</p>
            <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        <p>Votre abonnement est maintenant actif.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}?tab=membre" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Acceder a mon espace membre
            </a>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"La Sphere" <contact@lasphere.xyz>',
        to: user.email,
        subject: `Paiement confirme - ${paymentDetails.planName}`,
        html: getEmailTemplate(content),
        text: `Bonjour ${user.firstName},\n\nNous avons bien recu votre paiement pour ${paymentDetails.planName} (${paymentDetails.price} EUR).\n\nVotre abonnement est actif.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de confirmation paiement envoye a ${user.email}`);
        return true;
    } catch (error) {
        console.error('Erreur envoi email confirmation paiement:', error.message);
        return false;
    }
}

/**
 * Envoyer un email de reset de mot de passe
 */
async function sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}?tab=reset-password&token=${resetToken}`;

    const content = `
        <h2>Reinitialisation de votre mot de passe</h2>
        <p>Bonjour ${user.firstName},</p>
        <p>Vous avez demande a reinitialiser votre mot de passe sur La Sphere.</p>
        <p>Cliquez sur le bouton ci-dessous pour creer un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reinitialiser mon mot de passe
            </a>
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Ou copiez ce lien dans votre navigateur :<br>
            <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
        </p>
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            Ce lien expire dans 1 heure.
            Si vous n'avez pas demande cette reinitialisation, ignorez cet email.
        </p>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"La Sphere" <contact@lasphere.xyz>',
        to: user.email,
        subject: 'Reinitialisation de votre mot de passe - La Sphere',
        html: getEmailTemplate(content),
        text: `Bonjour ${user.firstName},\n\nVous avez demande a reinitialiser votre mot de passe.\n\nCliquez sur ce lien :\n${resetUrl}\n\nCe lien expire dans 1 heure.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de reset mot de passe envoye a ${user.email}`);
        return true;
    } catch (error) {
        console.error('Erreur envoi email reset:', error.message);
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPaymentConfirmationEmail,
    sendPasswordResetEmail
};
