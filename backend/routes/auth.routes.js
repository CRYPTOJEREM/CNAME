const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Services
const {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    verifyPassword
} = require('../services/userService');

const {
    sendVerificationEmail,
    sendWelcomeEmail
} = require('../services/emailService');

// Config
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} = require('../config/jwt');

const {
    addToCollection,
    findInCollection,
    updateInCollection,
    deleteFromCollection
} = require('../config/database');

// Middleware
const { authMiddleware } = require('../middleware/auth');
const {
    registerValidation,
    loginValidation
} = require('../middleware/validation');

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 */
router.post('/register', registerValidation, async (req, res) => {
    try {
        const { email, password, firstName, lastName, telegramUsername, newsletterOptIn } = req.body;

        // Créer l'utilisateur
        const user = await createUser({
            email,
            password,
            firstName,
            lastName,
            telegramUsername
        });

        // Inscription newsletter si opt-in
        if (newsletterOptIn) {
            const existingSubscriber = findInCollection('newsletterSubscribers', { email });
            if (!existingSubscriber) {
                addToCollection('newsletterSubscribers', {
                    id: uuidv4(),
                    email,
                    firstName: firstName || null,
                    source: 'register',
                    subscribedAt: new Date().toISOString()
                });
            }
        }

        // Créer un token de vérification email
        const verificationToken = uuidv4();
        addToCollection('emailVerifications', {
            id: uuidv4(),
            userId: user.id,
            token: verificationToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
        });

        // Envoyer l'email de vérification (non-bloquant)
        sendVerificationEmail(user, verificationToken).catch(emailError => {
            console.warn('⚠️ Email de vérification non envoyé:', emailError.message);
        });

        res.status(201).json({
            success: true,
            message: 'Compte créé ! Vérifiez votre boîte mail pour activer votre compte.',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: false
            }
        });

    } catch (error) {
        console.error('❌ Erreur inscription:', error.message);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/auth/login
 * Connexion utilisateur
 */
router.post('/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isValidPassword = await verifyPassword(user, password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier que l'email est vérifié
        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                error: 'Email non vérifié',
                message: 'Veuillez vérifier votre email avant de vous connecter. Consultez votre boîte de réception.'
            });
        }

        // Générer les tokens
        const accessToken = generateAccessToken(user.id, user.email);
        const refreshToken = generateRefreshToken(user.id);

        // Sauvegarder le refresh token
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7); // 7 jours

        addToCollection('refreshTokens', {
            id: uuidv4(),
            userId: user.id,
            token: refreshToken,
            expiresAt: tokenExpiresAt.toISOString(),
            createdAt: new Date().toISOString()
        });

        // Retourner les données utilisateur et les tokens
        const { passwordHash, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Connexion réussie',
            accessToken,
            refreshToken,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('❌ Erreur connexion:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la connexion'
        });
    }
});

/**
 * POST /api/auth/logout
 * Déconnexion utilisateur
 */
router.post('/logout', authMiddleware, async (req, res) => {
    try {
        // Récupérer le refresh token du body ou cookie
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

        if (refreshToken) {
            deleteFromCollection('refreshTokens', { token: refreshToken });
        }

        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });

    } catch (error) {
        console.error('❌ Erreur déconnexion:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la déconnexion'
        });
    }
});

/**
 * POST /api/auth/refresh
 * Rafraîchir le access token
 */
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: 'Refresh token manquant'
            });
        }

        // Vérifier que le token existe en base
        const storedToken = findInCollection('refreshTokens', { token: refreshToken });
        if (!storedToken) {
            return res.status(401).json({
                success: false,
                error: 'Refresh token invalide'
            });
        }

        // Vérifier que le token n'a pas expiré
        if (new Date(storedToken.expiresAt) < new Date()) {
            deleteFromCollection('refreshTokens', { token: refreshToken });
            return res.status(401).json({
                success: false,
                error: 'Refresh token expiré'
            });
        }

        // Vérifier et décoder le token
        const decoded = verifyRefreshToken(refreshToken);

        // Récupérer l'utilisateur
        const user = await findUserById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Utilisateur introuvable'
            });
        }

        // Générer un nouveau access token
        const newAccessToken = generateAccessToken(user.id, user.email);

        res.json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error('❌ Erreur refresh token:', error.message);
        res.status(401).json({
            success: false,
            error: 'Refresh token invalide'
        });
    }
});

/**
 * GET /api/auth/verify-email
 * Vérifier l'email avec le token
 */
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token de vérification manquant'
            });
        }

        // Trouver le token de vérification
        const verification = findInCollection('emailVerifications', { token });

        if (!verification) {
            return res.status(400).json({
                success: false,
                error: 'Token de vérification invalide'
            });
        }

        // Vérifier que le token n'a pas expiré
        if (new Date(verification.expiresAt) < new Date()) {
            return res.status(400).json({
                success: false,
                error: 'Le token de vérification a expiré',
                message: 'Veuillez demander un nouveau lien de vérification'
            });
        }

        // Vérifier que le token n'a pas déjà été utilisé
        if (verification.verified) {
            return res.status(400).json({
                success: false,
                error: 'Email déjà vérifié'
            });
        }

        // Marquer l'email comme vérifié
        await updateUser(verification.userId, { emailVerified: true });

        // Marquer le token comme utilisé
        updateInCollection('emailVerifications', { token }, { verified: true });

        // Récupérer l'utilisateur pour envoyer l'email de bienvenue
        const user = await findUserById(verification.userId);
        if (user) {
            await sendWelcomeEmail(user);
        }

        res.json({
            success: true,
            message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.'
        });

    } catch (error) {
        console.error('❌ Erreur vérification email:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la vérification de l\'email'
        });
    }
});

/**
 * POST /api/auth/resend-verification
 * Renvoyer l'email de vérification
 */
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email requis'
            });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            // Ne pas révéler si l'utilisateur existe ou non
            return res.json({
                success: true,
                message: 'Si un compte existe avec cet email, un nouveau lien de vérification a été envoyé.'
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                error: 'Email déjà vérifié'
            });
        }

        // Générer un nouveau token
        const verificationToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        addToCollection('emailVerifications', {
            id: uuidv4(),
            userId: user.id,
            token: verificationToken,
            expiresAt: expiresAt.toISOString(),
            verified: false,
            createdAt: new Date().toISOString()
        });

        // Envoyer l'email
        await sendVerificationEmail(user, verificationToken);

        res.json({
            success: true,
            message: 'Email de vérification renvoyé'
        });

    } catch (error) {
        console.error('❌ Erreur renvoi vérification:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'envoi de l\'email'
        });
    }
});

/**
 * GET /api/auth/me
 * Obtenir les informations de l'utilisateur connecté
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const { passwordHash, ...userWithoutPassword } = req.user;

        res.json({
            success: true,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('❌ Erreur récupération utilisateur:', error.message);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des informations'
        });
    }
});

module.exports = router;
