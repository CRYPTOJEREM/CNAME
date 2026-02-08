/**
 * Mode DEMO du Bot Telegram
 * Permet de tester toutes les fonctionnalités sans avoir à configurer Telegram
 */

class TelegramBotDemo {
    constructor() {
        this.logs = [];
        this.simulatedMessages = [];
        console.log('🎭 Mode DEMO Telegram activé - Aucune configuration requise!');
    }

    log(message) {
        const timestamp = new Date().toISOString();
        this.logs.push({ timestamp, message });
        console.log(`[TelegramDemo] ${message}`);
    }

    launch() {
        this.log('✅ Bot Telegram DEMO démarré avec succès');
        this.log('📋 Toutes les fonctionnalités sont simulées');
        this.log('🔗 API de test disponible sur /api/telegram-demo');
    }

    stop() {
        this.log('🛑 Bot Telegram DEMO arrêté');
    }

    async sendInviteLink(username, planName) {
        this.log(`📨 [DEMO] Envoi invitation à @${username} pour ${planName}`);

        const simulatedInvite = {
            username: username,
            planName: planName,
            inviteLink: `https://t.me/+DEMO_INVITE_${Date.now()}`,
            expiresIn: '24h',
            timestamp: new Date().toISOString()
        };

        this.simulatedMessages.push({
            type: 'invite',
            to: username,
            message: `🎉 Félicitations!\n\nVotre paiement pour le plan ${planName} a été confirmé!\n\n💎 Lien d'invitation: ${simulatedInvite.inviteLink}\n\n⏰ Expire dans 24h`,
            data: simulatedInvite
        });

        this.log(`✅ [DEMO] Invitation envoyée à @${username}`);
        return true;
    }

    async notifyAdmins(message) {
        this.log(`📢 [DEMO] Notification admin: ${message}`);

        this.simulatedMessages.push({
            type: 'admin_notification',
            to: 'admins',
            message: message,
            timestamp: new Date().toISOString()
        });

        return true;
    }

    // Simuler une commande utilisateur
    simulateCommand(command, username = 'demo_user') {
        this.log(`🎮 [DEMO] Commande reçue: ${command} de @${username}`);

        let response = '';

        switch (command) {
            case '/start':
                response = `🌐 Bienvenue sur La Sphere, ${username}!\n\n` +
                    `Je suis votre assistant personnel pour:\n` +
                    `✨ Accéder aux formations exclusives\n` +
                    `💎 Rejoindre le groupe VIP après paiement\n` +
                    `📊 Consulter votre statut d'abonnement\n` +
                    `💬 Obtenir du support`;
                break;

            case '/help':
                response = `📚 Commandes disponibles:\n\n` +
                    `👤 Utilisateur:\n` +
                    `/start - Message d'accueil\n` +
                    `/status - Vérifier votre statut\n` +
                    `/abonnements - Voir les plans\n` +
                    `/support - Contacter le support\n\n` +
                    `💎 VIP:\n` +
                    `/formations - Accéder aux formations\n` +
                    `/signaux - Signaux de trading\n` +
                    `/analyse - Analyse de marché`;
                break;

            case '/status':
                response = `✅ Statut de votre abonnement\n\n` +
                    `💎 Plan: VIP\n` +
                    `💰 Montant: $49.99\n` +
                    `📅 Date d'achat: ${new Date().toLocaleDateString('fr-FR')}\n` +
                    `🎯 Statut: ✅ Actif`;
                break;

            case '/abonnements':
                response = `💎 Nos Abonnements Premium\n\n` +
                    `⭐ PREMIUM - $29.99/mois\n` +
                    `• Calendrier économique avancé\n` +
                    `• Dashboard crypto en temps réel\n` +
                    `• Formations de base\n\n` +
                    `💎 VIP - $49.99/mois\n` +
                    `• Tout Premium +\n` +
                    `• Groupe Telegram VIP\n` +
                    `• Signaux de trading\n` +
                    `• Analyses de marché`;
                break;

            case '/signaux':
                response = `📊 Signaux de Trading du Jour\n\n` +
                    `🔴 BTC/USDT\n` +
                    `Entrée: $42,500\n` +
                    `TP1: $43,200 ✅\n` +
                    `TP2: $44,000\n` +
                    `SL: $41,800\n\n` +
                    `🟢 ETH/USDT\n` +
                    `Entrée: $2,250\n` +
                    `TP1: $2,320\n` +
                    `SL: $2,180`;
                break;

            case '/analyse':
                response = `📈 Analyse de Marché Quotidienne\n\n` +
                    `🗓️ ${new Date().toLocaleDateString('fr-FR')}\n\n` +
                    `📊 Bitcoin (BTC)\n` +
                    `Tendance: 🟢 Haussière\n` +
                    `Support: $41,800\n` +
                    `Résistance: $44,000\n\n` +
                    `💎 Ethereum (ETH)\n` +
                    `Tendance: 🟢 Haussière\n` +
                    `Support: $2,180\n` +
                    `Résistance: $2,400`;
                break;

            case '/stats':
                response = `📊 Statistiques La Sphere\n\n` +
                    `👥 Groupe VIP: 42 membres\n` +
                    `💰 Paiements confirmés: 38\n` +
                    `💵 Revenus totaux: $1,899.62\n` +
                    `👤 Utilisateurs vérifiés: 45`;
                break;

            default:
                response = `❓ Commande inconnue: ${command}\nTapez /help pour voir les commandes disponibles.`;
        }

        this.simulatedMessages.push({
            type: 'command_response',
            command: command,
            from: username,
            response: response,
            timestamp: new Date().toISOString()
        });

        this.log(`✅ [DEMO] Réponse envoyée pour ${command}`);
        return response;
    }

    // Simuler un nouveau membre rejoignant le groupe
    simulateNewMember(username) {
        this.log(`👋 [DEMO] Nouveau membre: @${username}`);

        const welcomeMessage = `🎉 Bienvenue @${username} dans le groupe VIP de La Sphere!\n\n` +
            `💎 Vous avez maintenant accès à:\n` +
            `• Signaux de trading en temps réel (/signaux)\n` +
            `• Analyses de marché quotidiennes (/analyse)\n` +
            `• Formations exclusives (/formations)\n` +
            `• Support VIP prioritaire\n\n` +
            `📚 Tapez /help pour voir toutes les commandes.`;

        this.simulatedMessages.push({
            type: 'welcome',
            to: username,
            message: welcomeMessage,
            timestamp: new Date().toISOString()
        });

        this.log(`✅ [DEMO] Message de bienvenue envoyé à @${username}`);
        return welcomeMessage;
    }

    // Obtenir les logs
    getLogs() {
        return this.logs;
    }

    // Obtenir les messages simulés
    getMessages() {
        return this.simulatedMessages;
    }

    // Obtenir les statistiques
    getStats() {
        return {
            totalLogs: this.logs.length,
            totalMessages: this.simulatedMessages.length,
            messagesByType: this.simulatedMessages.reduce((acc, msg) => {
                acc[msg.type] = (acc[msg.type] || 0) + 1;
                return acc;
            }, {}),
            uptime: 'Mode DEMO',
            status: 'running'
        };
    }

    // Effacer les logs et messages
    clear() {
        this.logs = [];
        this.simulatedMessages = [];
        this.log('🗑️ [DEMO] Logs et messages effacés');
    }
}

module.exports = TelegramBotDemo;
