const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
    addToCollection,
    findInCollection,
    deleteFromCollection
} = require('../config/database');

// POST /api/newsletter/subscribe
router.post('/subscribe', [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Adresse email invalide' });
        }

        const { email, source, firstName } = req.body;

        // Vérifier doublon
        const existing = findInCollection('newsletterSubscribers', { email });
        if (existing) {
            return res.status(409).json({ error: 'Cet email est déjà inscrit à la newsletter' });
        }

        // Ajouter à la collection
        const subscriber = {
            id: uuidv4(),
            email,
            firstName: firstName || null,
            source: source || 'unknown',
            subscribedAt: new Date().toISOString()
        };

        addToCollection('newsletterSubscribers', subscriber);

        res.status(201).json({ message: 'Inscription à la newsletter réussie' });
    } catch (error) {
        console.error('Erreur newsletter subscribe:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /api/newsletter/unsubscribe
router.post('/unsubscribe', [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Adresse email invalide' });
        }

        const { email } = req.body;

        const existing = findInCollection('newsletterSubscribers', { email });
        if (!existing) {
            return res.status(404).json({ error: 'Email non trouvé dans la newsletter' });
        }

        deleteFromCollection('newsletterSubscribers', { email });

        res.json({ message: 'Désinscription réussie' });
    } catch (error) {
        console.error('Erreur newsletter unsubscribe:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
