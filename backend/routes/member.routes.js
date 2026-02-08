/**
 * Routes de l'espace membre
 * Toutes les routes sont protégées par authMiddleware
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const { findUserById, updateUser } = require('../services/userService');
const {
    getContentByLevel,
    getFormationsByLevel,
    getFormationById,
    getContentById
} = require('../services/contentService');
const { readDatabase } = require('../config/database');

// ==========================================
// GET /api/member/profile - Profil utilisateur
// ==========================================
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        // Retourner les infos utilisateur sans données sensibles
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                telegramUsername: user.telegramUsername,
                emailVerified: user.emailVerified,
                subscriptionStatus: user.subscriptionStatus,
                subscriptionExpiresAt: user.subscriptionExpiresAt,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur récupération profil:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// ==========================================
// PUT /api/member/profile - Modifier profil
// ==========================================
router.put('/profile',
    authMiddleware,
    [
        body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
        body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
        body('telegramUsername').optional().trim().matches(/^@?[a-zA-Z0-9_]{5,32}$/)
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: 'Données invalides',
                    details: errors.array()
                });
            }

            const { firstName, lastName, telegramUsername } = req.body;
            const updates = {};

            if (firstName) updates.firstName = firstName;
            if (lastName) updates.lastName = lastName;
            if (telegramUsername) {
                // Assurer le @ au début
                updates.telegramUsername = telegramUsername.startsWith('@')
                    ? telegramUsername
                    : `@${telegramUsername}`;
            }

            const updatedUser = await updateUser(req.user.id, updates);

            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    telegramUsername: updatedUser.telegramUsername,
                    emailVerified: updatedUser.emailVerified,
                    subscriptionStatus: updatedUser.subscriptionStatus,
                    subscriptionExpiresAt: updatedUser.subscriptionExpiresAt
                }
            });
        } catch (error) {
            console.error('Erreur mise à jour profil:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur serveur'
            });
        }
    }
);

// ==========================================
// GET /api/member/content - Contenu accessible
// ==========================================
router.get('/content', authMiddleware, async (req, res) => {
    try {
        const userLevel = req.user.subscriptionStatus || 'free';
        const content = getContentByLevel(userLevel);

        res.json({
            success: true,
            userLevel: userLevel,
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
// GET /api/member/content/:id - Détails d'un contenu
// ==========================================
router.get('/content/:id', authMiddleware, async (req, res) => {
    try {
        const userLevel = req.user.subscriptionStatus || 'free';
        const content = getContentById(req.params.id, userLevel);

        if (!content) {
            return res.status(404).json({
                success: false,
                error: 'Contenu introuvable'
            });
        }

        if (content.locked) {
            return res.status(403).json({
                success: false,
                error: 'Abonnement insuffisant',
                requiredLevel: content.requiredLevel,
                currentLevel: userLevel
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
// GET /api/member/formations - Liste des formations
// ==========================================
router.get('/formations', authMiddleware, async (req, res) => {
    try {
        const userLevel = req.user.subscriptionStatus || 'free';
        const formations = getFormationsByLevel(userLevel);

        res.json({
            success: true,
            userLevel: userLevel,
            formations: formations
        });
    } catch (error) {
        console.error('Erreur récupération formations:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// ==========================================
// GET /api/member/formations/:id - Détails formation
// ==========================================
router.get('/formations/:id', authMiddleware, async (req, res) => {
    try {
        const userLevel = req.user.subscriptionStatus || 'free';
        const formation = getFormationById(req.params.id, userLevel);

        if (!formation) {
            return res.status(404).json({
                success: false,
                error: 'Formation introuvable ou accès refusé'
            });
        }

        res.json({
            success: true,
            formation: formation
        });
    } catch (error) {
        console.error('Erreur récupération formation:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// ==========================================
// GET /api/member/subscription - Détails abonnement
// ==========================================
router.get('/subscription', authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        // Calculer les jours restants
        let daysRemaining = null;
        if (user.subscriptionExpiresAt) {
            const expiryDate = new Date(user.subscriptionExpiresAt);
            const now = new Date();
            daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        }

        res.json({
            success: true,
            subscription: {
                status: user.subscriptionStatus,
                expiresAt: user.subscriptionExpiresAt,
                daysRemaining: daysRemaining,
                isActive: daysRemaining === null || daysRemaining > 0
            }
        });
    } catch (error) {
        console.error('Erreur récupération abonnement:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

// ==========================================
// GET /api/member/payments - Historique paiements
// ==========================================
router.get('/payments', authMiddleware, async (req, res) => {
    try {
        const db = readDatabase();
        const userPayments = db.payments.filter(p => p.userId === req.user.id);

        // Trier par date (plus récent en premier)
        userPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            payments: userPayments.map(p => ({
                id: p.id,
                planName: p.planName,
                price: p.price,
                status: p.status,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
            }))
        });
    } catch (error) {
        console.error('Erreur récupération paiements:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
});

module.exports = router;
