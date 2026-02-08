const express = require('express');
const router = express.Router();
const { authMiddleware, requireSubscription } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { readDatabase, writeDatabase } = require('../config/database');

// @route   POST /api/reviews
// @desc    Submit a review (Premium/VIP members only)
// @access  Private
router.post('/',
    authMiddleware,
    requireSubscription('premium'),
    [
        body('rating').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
        body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Le titre doit contenir entre 5 et 100 caractères'),
        body('message').trim().isLength({ min: 20, max: 1000 }).withMessage('Le message doit contenir entre 20 et 1000 caractères')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0].msg });
            }

            const { rating, title, message } = req.body;
            const userId = req.user.id;

            const db = readDatabase();

            // Vérifier si l'utilisateur a déjà laissé un avis récemment (limite 1 avis par semaine)
            const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const recentReview = db.reviews.find(
                r => r.userId === userId && r.createdAt > oneWeekAgo
            );

            if (recentReview) {
                return res.status(429).json({
                    error: 'Vous avez déjà soumis un avis récemment. Veuillez attendre 7 jours.'
                });
            }

            const review = {
                id: uuidv4(),
                userId,
                userFirstName: req.user.firstName,
                userSubscriptionLevel: req.user.subscriptionStatus,
                rating: parseInt(rating),
                title,
                message,
                approved: false,
                createdAt: new Date().toISOString()
            };

            db.reviews.push(review);
            writeDatabase(db);

            res.status(201).json({
                success: true,
                message: 'Merci pour votre avis ! Il sera publié après validation.'
            });
        } catch (error) {
            console.error('Erreur création review:', error);
            res.status(500).json({ error: 'Erreur lors de l\'envoi de votre avis' });
        }
    }
);

// @route   GET /api/reviews
// @desc    Get all approved reviews
// @access  Public
router.get('/', async (req, res) => {
    try {
        const db = readDatabase();

        // Retourner seulement les avis approuvés, triés par date (plus récents d'abord)
        const approvedReviews = db.reviews
            .filter(r => r.approved === true)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(r => ({
                id: r.id,
                userFirstName: r.userFirstName,
                userSubscriptionLevel: r.userSubscriptionLevel,
                rating: r.rating,
                title: r.title,
                message: r.message,
                createdAt: r.createdAt
            }));

        res.json({
            success: true,
            data: approvedReviews
        });
    } catch (error) {
        console.error('Erreur récupération reviews:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des avis' });
    }
});

// @route   GET /api/reviews/stats
// @desc    Get review statistics
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const db = readDatabase();
        const approvedReviews = db.reviews.filter(r => r.approved === true);

        if (approvedReviews.length === 0) {
            return res.json({
                success: true,
                data: {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingsBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                }
            });
        }

        const totalReviews = approvedReviews.length;
        const averageRating = approvedReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

        const ratingsBreakdown = approvedReviews.reduce((acc, r) => {
            acc[r.rating] = (acc[r.rating] || 0) + 1;
            return acc;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

        res.json({
            success: true,
            data: {
                totalReviews,
                averageRating: parseFloat(averageRating.toFixed(1)),
                ratingsBreakdown
            }
        });
    } catch (error) {
        console.error('Erreur stats reviews:', error);
        res.status(500).json({ error: 'Erreur lors du chargement des statistiques' });
    }
});

module.exports = router;
