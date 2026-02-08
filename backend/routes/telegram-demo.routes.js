const express = require('express');
const router = express.Router();

// Cette route sera utilisée par le serveur qui passe le botService
module.exports = (botService) => {
    // ==========================================
    // GET /api/telegram-demo - Dashboard du bot
    // ==========================================
    router.get('/', (req, res) => {
        if (!botService) {
            return res.status(503).json({
                success: false,
                error: 'Bot Telegram non disponible'
            });
        }

        const stats = botService.getStats ? botService.getStats() : { status: 'unknown' };
        const logs = botService.getLogs ? botService.getLogs() : [];
        const messages = botService.getMessages ? botService.getMessages() : [];

        res.json({
            success: true,
            mode: 'DEMO',
            stats: stats,
            recentLogs: logs.slice(-10),
            recentMessages: messages.slice(-5),
            info: {
                message: '🎭 Mode DEMO Telegram - Testez toutes les fonctionnalités sans configuration!',
                endpoints: {
                    'GET /api/telegram-demo': 'Dashboard du bot',
                    'POST /api/telegram-demo/command': 'Tester une commande',
                    'POST /api/telegram-demo/invite': 'Tester une invitation',
                    'POST /api/telegram-demo/new-member': 'Simuler un nouveau membre',
                    'GET /api/telegram-demo/logs': 'Voir tous les logs',
                    'GET /api/telegram-demo/messages': 'Voir tous les messages',
                    'DELETE /api/telegram-demo/clear': 'Effacer logs et messages'
                }
            }
        });
    });

    // ==========================================
    // POST /api/telegram-demo/command - Tester une commande
    // ==========================================
    router.post('/command', (req, res) => {
        if (!botService || !botService.simulateCommand) {
            return res.status(503).json({
                success: false,
                error: 'Mode DEMO non disponible'
            });
        }

        const { command, username } = req.body;

        if (!command) {
            return res.status(400).json({
                success: false,
                error: 'Paramètre "command" requis (ex: /start, /help, /status)'
            });
        }

        const response = botService.simulateCommand(command, username || 'demo_user');

        res.json({
            success: true,
            command: command,
            username: username || 'demo_user',
            response: response
        });
    });

    // ==========================================
    // POST /api/telegram-demo/invite - Tester une invitation
    // ==========================================
    router.post('/invite', async (req, res) => {
        if (!botService) {
            return res.status(503).json({
                success: false,
                error: 'Bot Telegram non disponible'
            });
        }

        const { username, planName } = req.body;

        if (!username || !planName) {
            return res.status(400).json({
                success: false,
                error: 'Paramètres "username" et "planName" requis'
            });
        }

        try {
            await botService.sendInviteLink(username, planName);

            res.json({
                success: true,
                message: `Invitation envoyée à @${username} pour ${planName}`,
                username: username,
                planName: planName
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==========================================
    // POST /api/telegram-demo/new-member - Simuler nouveau membre
    // ==========================================
    router.post('/new-member', (req, res) => {
        if (!botService || !botService.simulateNewMember) {
            return res.status(503).json({
                success: false,
                error: 'Mode DEMO non disponible'
            });
        }

        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'Paramètre "username" requis'
            });
        }

        const welcomeMessage = botService.simulateNewMember(username);

        res.json({
            success: true,
            message: `Nouveau membre @${username} ajouté au groupe`,
            username: username,
            welcomeMessage: welcomeMessage
        });
    });

    // ==========================================
    // GET /api/telegram-demo/logs - Voir tous les logs
    // ==========================================
    router.get('/logs', (req, res) => {
        if (!botService || !botService.getLogs) {
            return res.status(503).json({
                success: false,
                error: 'Mode DEMO non disponible'
            });
        }

        const logs = botService.getLogs();

        res.json({
            success: true,
            total: logs.length,
            logs: logs
        });
    });

    // ==========================================
    // GET /api/telegram-demo/messages - Voir tous les messages
    // ==========================================
    router.get('/messages', (req, res) => {
        if (!botService || !botService.getMessages) {
            return res.status(503).json({
                success: false,
                error: 'Mode DEMO non disponible'
            });
        }

        const messages = botService.getMessages();

        res.json({
            success: true,
            total: messages.length,
            messages: messages
        });
    });

    // ==========================================
    // DELETE /api/telegram-demo/clear - Effacer logs et messages
    // ==========================================
    router.delete('/clear', (req, res) => {
        if (!botService || !botService.clear) {
            return res.status(503).json({
                success: false,
                error: 'Mode DEMO non disponible'
            });
        }

        botService.clear();

        res.json({
            success: true,
            message: 'Logs et messages effacés'
        });
    });

    // ==========================================
    // POST /api/telegram-demo/simulate-payment - Simuler paiement complet
    // ==========================================
    router.post('/simulate-payment', async (req, res) => {
        if (!botService) {
            return res.status(503).json({
                success: false,
                error: 'Bot Telegram non disponible'
            });
        }

        const { username, planName, price } = req.body;

        if (!username || !planName) {
            return res.status(400).json({
                success: false,
                error: 'Paramètres "username" et "planName" requis'
            });
        }

        try {
            // Simuler le flow complet
            botService.log(`💳 [DEMO] Paiement reçu: @${username} - ${planName} - $${price || '49.99'}`);
            await botService.sendInviteLink(username, planName);
            await botService.notifyAdmins(`💰 Nouveau paiement: @${username} - ${planName}`);

            res.json({
                success: true,
                message: 'Flow de paiement complet simulé',
                steps: [
                    '✅ Paiement reçu',
                    '✅ Invitation envoyée à l\'utilisateur',
                    '✅ Admins notifiés'
                ],
                username: username,
                planName: planName
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    return router;
};
