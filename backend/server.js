// Charger les variables d'environnement en premier
require('dotenv').config();

// ==========================================
// SÉCURITÉ - Vérifications au démarrage
// ==========================================

const isProduction = process.env.NODE_ENV === 'production';

// JWT_SECRET obligatoire en production
if (isProduction && !process.env.JWT_SECRET) {
    console.error('❌ ERREUR FATALE: JWT_SECRET non défini en production');
    console.error('   Veuillez définir la variable d\'environnement JWT_SECRET');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET non défini - utilisez une clé forte en production');
}

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const TelegramBotService = require('./services/telegramBot');
const TelegramBotDemo = require('./services/telegramBotDemo');
const { readDatabase, writeDatabase, seedAdmin } = require('./config/database');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// CONFIGURATION - Maintenant dans .env
// ==========================================

const CONFIG = {
    NOWPAYMENTS_API_KEY: process.env.NOWPAYMENTS_API_KEY || 'YOUR_NOWPAYMENTS_API_KEY',
    NOWPAYMENTS_IPN_SECRET: process.env.NOWPAYMENTS_IPN_SECRET || 'YOUR_IPN_SECRET_KEY',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN',
    TELEGRAM_VIP_GROUP_ID: process.env.TELEGRAM_VIP_GROUP_ID || '-1001234567890',
    SITE_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001'
};

// Importer la configuration email pour vérification
const { verifyEmailConfig } = require('./config/email');

// ==========================================
// MIDDLEWARE
// ==========================================

// Configuration CORS pour accepter plusieurs domaines
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://lasphere.xyz',
    'https://www.lasphere.xyz',
    'https://cname.vercel.app'
];

// Ajouter dynamiquement les URLs Vercel de déploiement/preview
if (process.env.FRONTEND_URL) {
    const frontendUrls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
    frontendUrls.forEach(url => {
        if (!allowedOrigins.includes(url)) {
            allowedOrigins.push(url);
        }
    });
}

app.use(cors({
    origin: function (origin, callback) {
        // Autoriser les requêtes sans origin (curl, healthchecks, server-to-server)
        // Exemples: curl depuis le serveur, monitoring tools, scripts internes
        if (!origin) {
            return callback(null, true);
        }

        // Vérifier si l'origin est dans la liste autorisée (whitelist stricte)
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ CORS bloqué pour:', origin);
            console.log('   Origins autorisés:', allowedOrigins.join(', '));
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Compression gzip/brotli pour optimiser la taille des réponses
const compression = require('compression');
app.use(compression());

app.use(express.json({ limit: '10mb' })); // Limite taille body
app.use(cookieParser());

// Servir les fichiers statiques (page de test Telegram)
app.use(express.static(require('path').join(__dirname, 'public')));

// ==========================================
// ROUTES D'AUTHENTIFICATION
// ==========================================

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// ==========================================
// ROUTES ESPACE MEMBRE
// ==========================================

const memberRoutes = require('./routes/member.routes');
app.use('/api/member', memberRoutes);

// ==========================================
// ROUTES ADMIN
// ==========================================

const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

// ==========================================
// ROUTES ANALYSE DU JOUR
// ==========================================

const dailyAnalysisRoutes = require('./routes/dailyAnalysis.routes');
app.use('/api/daily-analysis', dailyAnalysisRoutes);

// ==========================================
// ROUTES REVIEWS (AVIS CLIENTS)
// ==========================================

const reviewsRoutes = require('./routes/reviews.routes');
app.use('/api/reviews', reviewsRoutes);

// Routes Newsletter
const newsletterRoutes = require('./routes/newsletter.routes');
app.use('/api/newsletter', newsletterRoutes);

// Route diagnostic email (admin uniquement via query secret)
app.get('/api/test-email', async (req, res) => {
    const secret = req.query.secret;
    if (secret !== (process.env.JWT_SECRET || '').slice(0, 10)) {
        return res.status(403).json({ error: 'Non autorisé' });
    }

    const { transporter } = require('./config/email');
    const testTo = req.query.to || process.env.SMTP_USER;

    // Étape 1: Vérifier la connexion SMTP
    try {
        await transporter.verify();
        console.log('✅ Connexion SMTP OK');
    } catch (verifyErr) {
        return res.json({
            success: false,
            step: 'SMTP verify',
            error: verifyErr.message,
            code: verifyErr.code,
            config: {
                brevoKeySet: !!process.env.BREVO_API_KEY,
                brevoKeyLength: process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.length : 0,
                brevoLogin: process.env.BREVO_LOGIN || 'NOT SET',
                transporterHost: transporter.options?.host || 'unknown',
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                user: process.env.SMTP_USER,
                from: process.env.EMAIL_FROM
            }
        });
    }

    // Étape 2: Envoyer un email de test
    const { getEmailTemplate } = require('./config/email');
    const type = req.query.type || 'simple';

    let subject, html;
    if (type === 'verification') {
        subject = 'Verifiez votre email - La Sphere';
        html = getEmailTemplate(`
            <h2>Bienvenue !</h2>
            <p>Ceci est un test du template de verification.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://lasphere.xyz" style="display: inline-block; padding: 12px 30px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Verifier mon email
                </a>
            </div>
        `);
    } else {
        subject = 'Test Email - La Sphere';
        html = '<h1>Test OK</h1><p>Si vous recevez cet email, la configuration SMTP fonctionne.</p>';
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"La Sphere" <contact@lasphere.xyz>',
            to: testTo,
            subject,
            html
        });
        res.json({
            success: true,
            message: `Email envoyé à ${testTo}`,
            type,
            messageId: info.messageId,
            response: info.response
        });
    } catch (sendErr) {
        res.json({
            success: false,
            step: 'sendMail',
            error: sendErr.message,
            code: sendErr.code
        });
    }
});

// Route publique Carousel (sans auth)
app.get('/api/carousel', (req, res) => {
    try {
        const db = readDatabase();
        const videos = (db.carouselVideos || [])
            .filter(v => v.active)
            .sort((a, b) => a.order - b.order);
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
});

// ==========================================
// INITIALISATION TELEGRAM BOT
// ==========================================

// Initialiser le bot Telegram avec toutes les fonctionnalités
let botService = null;
if (CONFIG.TELEGRAM_BOT_TOKEN &&
    CONFIG.TELEGRAM_BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN' &&
    CONFIG.TELEGRAM_BOT_TOKEN !== 'your-telegram-bot-token') {
    botService = new TelegramBotService(CONFIG.TELEGRAM_BOT_TOKEN, CONFIG.TELEGRAM_VIP_GROUP_ID);
    botService.launch();

    // Gérer l'arrêt gracieux
    process.once('SIGINT', () => { try { botService.stop('SIGINT'); } catch(e) {} });
    process.once('SIGTERM', () => { try { botService.stop('SIGTERM'); } catch(e) {} });
} else {
    // Mode DEMO - permet de tester sans configuration Telegram
    botService = new TelegramBotDemo();
    botService.launch();
    console.log('🎭 Mode DEMO activé - API de test: /api/telegram-demo');
}

// ==========================================
// ROUTES TELEGRAM DEMO
// ==========================================

const telegramDemoRoutes = require('./routes/telegram-demo.routes')(botService);
app.use('/api/telegram-demo', telegramDemoRoutes);

// La base de données est maintenant gérée par database.json via readDatabase/writeDatabase

// ==========================================
// API ENDPOINTS
// ==========================================

// Route de base pour tester que le serveur fonctionne
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend La Sphere API v1.0',
        endpoints: {
            auth: '/api/auth/*',
            member: '/api/member/*',
            public: '/api/public/*',
            payments: '/api/*',
            health: '/health'
        }
    });
});

// Health check endpoint pour monitoring
app.get('/health', (req, res) => {
    const db = readDatabase();
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
            users: db.users?.length || 0,
            payments: db.payments?.length || 0
        }
    });
});

// Créer un paiement NOWPayments (protégé - utilisateur doit être connecté)

app.post('/api/create-payment', authMiddleware, async (req, res) => {
    try {
        const { planId, planName, price } = req.body;
        const user = req.user;

        // Valider les données
        if (!planId || !planName || !price) {
            return res.status(400).json({
                success: false,
                error: 'Données manquantes'
            });
        }

        // Créer le paiement avec NOWPayments
        const orderId = `${planId}-${user.id}-${Date.now()}`;
        const paymentData = {
            price_amount: price,
            price_currency: 'eur',
            pay_currency: 'btc', // Devise par défaut, l'utilisateur peut changer
            order_id: orderId,
            order_description: `Abonnement ${planName} - La Sphere`,
            ipn_callback_url: `${CONFIG.BACKEND_URL}/api/nowpayments-webhook`,
            success_url: `${CONFIG.SITE_URL}?payment=success`,
            cancel_url: `${CONFIG.SITE_URL}?payment=cancel`,
        };

        const response = await axios.post(
            'https://api.nowpayments.io/v1/invoice',
            paymentData,
            {
                headers: {
                    'x-api-key': CONFIG.NOWPAYMENTS_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Sauvegarder dans la base de données avec userId
        const db = readDatabase();
        const newPayment = {
            id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            paymentId: response.data.id,
            orderId: orderId,
            userId: user.id,
            planId,
            planName,
            price,
            status: 'pending',
            invoiceUrl: response.data.invoice_url,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.payments.push(newPayment);
        writeDatabase(db);

        console.log(`✅ Paiement créé: ${response.data.id} pour utilisateur ${user.email}`);

        res.json({
            success: true,
            invoiceUrl: response.data.invoice_url,
            paymentId: response.data.id
        });

    } catch (error) {
        console.error('❌ Erreur création paiement:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur',
            details: error.response?.data || error.message
        });
    }
});

// Webhook NOWPayments (IPN - Instant Payment Notification)
app.post('/api/nowpayments-webhook', async (req, res) => {
    try {
        // Vérifier la signature pour sécurité
        const receivedSignature = req.headers['x-nowpayments-sig'];
        const payload = JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac('sha512', CONFIG.NOWPAYMENTS_IPN_SECRET)
            .update(payload)
            .digest('hex');

        if (receivedSignature !== expectedSignature) {
            console.log('⚠️ Signature invalide');
            return res.status(403).json({ error: 'Signature invalide' });
        }

        const { payment_id, payment_status, order_id } = req.body;

        console.log(`📦 Webhook reçu: ${payment_id} - Status: ${payment_status}`);

        // Si le paiement est confirmé
        if (payment_status === 'finished' || payment_status === 'confirmed') {
            const db = readDatabase();
            const payment = db.payments.find(p => p.orderId === order_id);

            if (payment && payment.status !== 'completed') {
                console.log(`✅ Paiement confirmé: ${payment.planName}`);

                // Trouver l'utilisateur
                const userIndex = db.users.findIndex(u => u.id === payment.userId);
                if (userIndex === -1) {
                    console.error('❌ Utilisateur introuvable pour le paiement');
                    return res.json({ success: false, error: 'Utilisateur introuvable' });
                }

                const user = db.users[userIndex];

                // Calculer la date d'expiration selon le plan
                const now = new Date();
                let expirationDate;
                let newStatus;

                if (payment.planName.toLowerCase().includes('vip')) {
                    newStatus = 'vip';
                    expirationDate = new Date(now.setFullYear(now.getFullYear() + 1)); // 1 an
                } else if (payment.planName.toLowerCase().includes('premium')) {
                    newStatus = 'premium';
                    expirationDate = new Date(now.setMonth(now.getMonth() + 1)); // 1 mois
                } else {
                    newStatus = 'free';
                    expirationDate = null;
                }

                // Mettre à jour l'utilisateur
                db.users[userIndex].subscriptionStatus = newStatus;
                db.users[userIndex].subscriptionExpiresAt = expirationDate ? expirationDate.toISOString() : null;

                // Marquer le paiement comme complété
                const paymentIndex = db.payments.findIndex(p => p.orderId === order_id);
                db.payments[paymentIndex].status = 'completed';
                db.payments[paymentIndex].updatedAt = new Date().toISOString();

                writeDatabase(db);

                console.log(`✅ Abonnement ${newStatus} activé pour ${user.email}`);

                // Envoyer l'invitation Telegram si applicable et si username présent
                if ((newStatus === 'premium' || newStatus === 'vip') && user.telegramUsername && botService) {
                    try {
                        const cleanUsername = user.telegramUsername.replace('@', '');
                        await botService.sendInviteLink(cleanUsername, payment.planName);
                        console.log(`✅ Invitation Telegram envoyée à @${cleanUsername}`);
                    } catch (telegramError) {
                        console.error(`❌ Erreur Telegram pour @${user.telegramUsername}:`, telegramError.message);

                        // Notifier les admins
                        if (botService.notifyAdmins) {
                            await botService.notifyAdmins(
                                `⚠️ ATTENTION: Abonnement activé mais impossible d'ajouter @${user.telegramUsername}\n` +
                                `Email: ${user.email}\nPlan: ${payment.planName}`
                            );
                        }
                    }
                }
            }
        }

        res.json({ success: true });

    } catch (error) {
        console.error('❌ Erreur webhook:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Liste des paiements (pour admin uniquement - PROTÉGÉ)
app.get('/api/payments', authMiddleware, async (req, res) => {
    try {
        // Vérifier que l'utilisateur est admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Accès refusé - Réservé aux administrateurs'
            });
        }

        const db = readDatabase();

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const offset = (page - 1) * limit;

        const payments = db.payments || [];
        const paginatedPayments = payments.slice(offset, offset + limit);

        res.json({
            success: true,
            data: paginatedPayments,
            pagination: {
                total: payments.length,
                page,
                limit,
                totalPages: Math.ceil(payments.length / limit)
            }
        });
    } catch (error) {
        console.error('Erreur récupération paiements:', error);
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
});

// ==========================================
// CONTENU GRATUIT PUBLIC (sans authentification)
// ==========================================

// Obtenir le contenu gratuit
app.get('/api/public/content', (req, res) => {
    try {
        const db = readDatabase();

        // Filtrer uniquement le contenu gratuit et publié
        const freeContent = db.memberContent.filter(content =>
            content.level === 'free' && content.published
        ).map(content => ({
            id: content.id,
            title: content.title,
            type: content.type,
            level: content.level,
            category: content.category || 'trading',
            description: content.description,
            thumbnail: content.thumbnail || null,
            duration: content.duration || null,
            createdAt: content.createdAt
        }));

        res.json({
            success: true,
            content: freeContent
        });
    } catch (error) {
        console.error('Erreur récupération contenu gratuit:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// Obtenir un contenu gratuit spécifique
app.get('/api/public/content/:id', (req, res) => {
    try {
        const db = readDatabase();
        const content = db.memberContent.find(c =>
            c.id === req.params.id &&
            c.level === 'free' &&
            c.published
        );

        if (!content) {
            return res.status(404).json({
                success: false,
                error: 'Contenu introuvable'
            });
        }

        res.json({
            success: true,
            content: content
        });
    } catch (error) {
        console.error('Erreur récupération contenu:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// ==========================================
// GESTION GLOBALE DES ERREURS
// ==========================================

// 404 handler - Route non trouvée
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée',
        path: req.path
    });
});

// Global error handler - Doit être en dernier
app.use((err, req, res, next) => {
    console.error('❌ Erreur non gérée:', {
        message: err.message,
        stack: isProduction ? undefined : err.stack,
        path: req.path,
        method: req.method
    });

    // Ne pas exposer les détails d'erreur en production
    const statusCode = err.statusCode || 500;
    const message = isProduction ? 'Erreur serveur interne' : err.message;

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(isProduction ? {} : { stack: err.stack })
    });
});

// ==========================================
// DÉMARRAGE SERVEUR
// ==========================================

app.listen(PORT, async () => {
    // Seed admin au démarrage (crée ou met à jour le compte admin)
    await seedAdmin();

    console.log(`
╔═══════════════════════════════════════════════════╗
║   🚀 Backend La Sphere démarré sur port ${PORT}     ║
╚═══════════════════════════════════════════════════╝

📝 Configuration NOWPayments & Telegram:
   - API Key NOWPayments: ${CONFIG.NOWPAYMENTS_API_KEY === 'YOUR_NOWPAYMENTS_API_KEY' ? '❌ Non configurée' : '✅ Configurée'}
   - IPN Secret: ${CONFIG.NOWPAYMENTS_IPN_SECRET === 'YOUR_IPN_SECRET_KEY' ? '❌ Non configuré' : '✅ Configuré'}
   - Bot Telegram Token: ${CONFIG.TELEGRAM_BOT_TOKEN === 'YOUR_TELEGRAM_BOT_TOKEN' ? '❌ Non configuré' : '✅ Configuré'}
   - Groupe VIP ID: ${CONFIG.TELEGRAM_VIP_GROUP_ID === '-1001234567890' ? '❌ Non configuré' : '✅ Configuré'}

🔐 Configuration Authentification:
   - JWT Secret: ${process.env.JWT_SECRET ? '✅ Configuré' : '❌ Non configuré'}
   - SMTP Email: ${process.env.SMTP_USER ? '✅ Configuré' : '❌ Non configuré'}
    `);

    // Vérifier la configuration email
    if (process.env.SMTP_USER) {
        await verifyEmailConfig();
    }

    console.log(`
🔗 Endpoints disponibles:
   📧 Authentification:
   - POST /api/auth/register
   - POST /api/auth/login
   - POST /api/auth/logout
   - POST /api/auth/refresh
   - GET  /api/auth/verify-email
   - POST /api/auth/resend-verification
   - GET  /api/auth/me

   👤 Espace Membre (🔒 protégé):
   - GET  /api/member/profile
   - PUT  /api/member/profile
   - GET  /api/member/content
   - GET  /api/member/content/:id
   - GET  /api/member/formations
   - GET  /api/member/formations/:id
   - GET  /api/member/subscription
   - GET  /api/member/payments

   💳 Paiements:
   - POST /api/create-payment
   - POST /api/nowpayments-webhook
   - GET  /api/payments

⚠️  Si des éléments sont non configurés, créez un fichier .env (voir .env.example)
    `);
});
