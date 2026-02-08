const express = require('express');
const router = express.Router();
const { authMiddleware, requireAdmin } = require('../middleware/auth');
const { readDatabase, writeDatabase } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Middleware: toutes les routes admin nécessitent auth + admin
router.use(authMiddleware);
router.use(requireAdmin);

// ============================================
// GESTION DES UTILISATEURS
// ============================================

/**
 * GET /api/admin/users
 * Liste tous les utilisateurs avec filtres et pagination
 */
router.get('/users', async (req, res) => {
    try {
        const { search, subscriptionStatus, page = 1, limit = 20 } = req.query;
        const db = readDatabase();

        let users = db.users;

        // Filtrer par recherche (email, nom, prénom)
        if (search) {
            const searchLower = search.toLowerCase();
            users = users.filter(u =>
                u.email.toLowerCase().includes(searchLower) ||
                u.firstName.toLowerCase().includes(searchLower) ||
                u.lastName.toLowerCase().includes(searchLower)
            );
        }

        // Filtrer par statut d'abonnement
        if (subscriptionStatus) {
            users = users.filter(u => u.subscriptionStatus === subscriptionStatus);
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedUsers = users.slice(startIndex, endIndex);

        // Retirer les mots de passe des résultats
        const safeUsers = paginatedUsers.map(u => {
            const { passwordHash, ...userWithoutPassword } = u;
            return userWithoutPassword;
        });

        res.json({
            success: true,
            data: safeUsers,
            pagination: {
                total: users.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(users.length / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des utilisateurs',
            details: error.message
        });
    }
});

/**
 * GET /api/admin/users/:id
 * Récupérer un utilisateur spécifique
 */
router.get('/users/:id', async (req, res) => {
    try {
        const db = readDatabase();
        const user = db.users.find(u => u.id === req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur introuvable'
            });
        }

        const { passwordHash, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de l\'utilisateur',
            details: error.message
        });
    }
});

/**
 * PUT /api/admin/users/:id
 * Modifier un utilisateur
 */
router.put('/users/:id', async (req, res) => {
    try {
        const db = readDatabase();
        const userIndex = db.users.findIndex(u => u.id === req.params.id);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur introuvable'
            });
        }

        const { firstName, lastName, email, telegramUsername, subscriptionStatus, subscriptionExpiresAt, role, emailVerified } = req.body;

        // Mettre à jour les champs fournis
        if (firstName) db.users[userIndex].firstName = firstName;
        if (lastName) db.users[userIndex].lastName = lastName;
        if (email) db.users[userIndex].email = email;
        if (telegramUsername) db.users[userIndex].telegramUsername = telegramUsername;
        if (subscriptionStatus) db.users[userIndex].subscriptionStatus = subscriptionStatus;
        if (subscriptionExpiresAt) db.users[userIndex].subscriptionExpiresAt = subscriptionExpiresAt;
        if (role) db.users[userIndex].role = role;
        if (typeof emailVerified === 'boolean') db.users[userIndex].emailVerified = emailVerified;

        db.users[userIndex].updatedAt = new Date().toISOString();

        writeDatabase(db);

        const { passwordHash, ...userWithoutPassword } = db.users[userIndex];

        res.json({
            success: true,
            message: 'Utilisateur mis à jour avec succès',
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour de l\'utilisateur',
            details: error.message
        });
    }
});

/**
 * DELETE /api/admin/users/:id
 * Supprimer un utilisateur
 */
router.delete('/users/:id', async (req, res) => {
    try {
        const db = readDatabase();
        const userIndex = db.users.findIndex(u => u.id === req.params.id);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur introuvable'
            });
        }

        // Empêcher la suppression de son propre compte
        if (db.users[userIndex].id === req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Vous ne pouvez pas supprimer votre propre compte'
            });
        }

        db.users.splice(userIndex, 1);
        writeDatabase(db);

        res.json({
            success: true,
            message: 'Utilisateur supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression de l\'utilisateur',
            details: error.message
        });
    }
});

// ============================================
// GESTION DES PRODUITS
// ============================================

/**
 * GET /api/admin/products
 * Liste tous les produits
 */
router.get('/products', async (req, res) => {
    try {
        const db = readDatabase();

        res.json({
            success: true,
            data: db.products || []
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des produits',
            details: error.message
        });
    }
});

/**
 * POST /api/admin/products
 * Créer un nouveau produit
 */
router.post('/products', async (req, res) => {
    try {
        const { name, slug, description, price, currency, duration, features, level, active } = req.body;

        if (!name || !slug || !price || !level) {
            return res.status(400).json({
                success: false,
                error: 'Champs requis: name, slug, price, level'
            });
        }

        const db = readDatabase();

        // Vérifier que le slug n'existe pas déjà
        if (db.products && db.products.find(p => p.slug === slug)) {
            return res.status(400).json({
                success: false,
                error: 'Un produit avec ce slug existe déjà'
            });
        }

        const newProduct = {
            id: `prod-${uuidv4()}`,
            name,
            slug,
            description: description || '',
            price: parseFloat(price),
            currency: currency || 'EUR',
            duration: parseInt(duration) || 30,
            features: features || [],
            level,
            active: active !== undefined ? active : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!db.products) {
            db.products = [];
        }

        db.products.push(newProduct);
        writeDatabase(db);

        res.json({
            success: true,
            message: 'Produit créé avec succès',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la création du produit',
            details: error.message
        });
    }
});

/**
 * PUT /api/admin/products/:id
 * Modifier un produit
 */
router.put('/products/:id', async (req, res) => {
    try {
        const db = readDatabase();
        const productIndex = db.products?.findIndex(p => p.id === req.params.id);

        if (productIndex === undefined || productIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Produit introuvable'
            });
        }

        const { name, slug, description, price, currency, duration, features, level, active } = req.body;

        // Mettre à jour les champs fournis
        if (name) db.products[productIndex].name = name;
        if (slug) db.products[productIndex].slug = slug;
        if (description) db.products[productIndex].description = description;
        if (price) db.products[productIndex].price = parseFloat(price);
        if (currency) db.products[productIndex].currency = currency;
        if (duration) db.products[productIndex].duration = parseInt(duration);
        if (features) db.products[productIndex].features = features;
        if (level) db.products[productIndex].level = level;
        if (typeof active === 'boolean') db.products[productIndex].active = active;

        db.products[productIndex].updatedAt = new Date().toISOString();

        writeDatabase(db);

        res.json({
            success: true,
            message: 'Produit mis à jour avec succès',
            data: db.products[productIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour du produit',
            details: error.message
        });
    }
});

/**
 * DELETE /api/admin/products/:id
 * Supprimer un produit
 */
router.delete('/products/:id', async (req, res) => {
    try {
        const db = readDatabase();
        const productIndex = db.products?.findIndex(p => p.id === req.params.id);

        if (productIndex === undefined || productIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Produit introuvable'
            });
        }

        db.products.splice(productIndex, 1);
        writeDatabase(db);

        res.json({
            success: true,
            message: 'Produit supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression du produit',
            details: error.message
        });
    }
});

// ============================================
// GESTION DU CONTENU
// ============================================

/**
 * GET /api/admin/content
 * Liste tout le contenu avec filtres
 */
router.get('/content', async (req, res) => {
    try {
        const { level, type, category, published } = req.query;
        const db = readDatabase();

        let content = db.memberContent || [];

        // Filtres
        if (level) content = content.filter(c => c.level === level);
        if (type) content = content.filter(c => c.type === type);
        if (category) content = content.filter(c => c.category === category);
        if (published !== undefined) content = content.filter(c => c.published === (published === 'true'));

        res.json({
            success: true,
            data: content
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du contenu',
            details: error.message
        });
    }
});

/**
 * POST /api/admin/content
 * Créer un nouveau contenu
 */
router.post('/content', async (req, res) => {
    try {
        const { title, slug, type, level, category, description, content, thumbnail, duration, modules, tags, published } = req.body;

        if (!title || !type || !level) {
            return res.status(400).json({
                success: false,
                error: 'Champs requis: title, type, level'
            });
        }

        const db = readDatabase();

        const newContent = {
            id: `content-${uuidv4()}`,
            title,
            slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
            type,
            level,
            category: category || 'trading',
            description: description || '',
            content: content || '',
            thumbnail: thumbnail || '',
            duration: duration || '',
            modules: modules || [],
            tags: tags || [],
            published: published !== undefined ? published : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (!db.memberContent) {
            db.memberContent = [];
        }

        db.memberContent.push(newContent);
        writeDatabase(db);

        res.json({
            success: true,
            message: 'Contenu créé avec succès',
            data: newContent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la création du contenu',
            details: error.message
        });
    }
});

/**
 * PUT /api/admin/content/:id
 * Modifier un contenu
 */
router.put('/content/:id', async (req, res) => {
    try {
        const db = readDatabase();
        const contentIndex = db.memberContent?.findIndex(c => c.id === req.params.id);

        if (contentIndex === undefined || contentIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Contenu introuvable'
            });
        }

        const { title, slug, type, level, category, description, content, thumbnail, duration, modules, tags, published } = req.body;

        // Mettre à jour les champs fournis
        if (title) db.memberContent[contentIndex].title = title;
        if (slug) db.memberContent[contentIndex].slug = slug;
        if (type) db.memberContent[contentIndex].type = type;
        if (level) db.memberContent[contentIndex].level = level;
        if (category) db.memberContent[contentIndex].category = category;
        if (description) db.memberContent[contentIndex].description = description;
        if (content) db.memberContent[contentIndex].content = content;
        if (thumbnail) db.memberContent[contentIndex].thumbnail = thumbnail;
        if (duration) db.memberContent[contentIndex].duration = duration;
        if (modules) db.memberContent[contentIndex].modules = modules;
        if (tags) db.memberContent[contentIndex].tags = tags;
        if (typeof published === 'boolean') db.memberContent[contentIndex].published = published;

        db.memberContent[contentIndex].updatedAt = new Date().toISOString();

        writeDatabase(db);

        res.json({
            success: true,
            message: 'Contenu mis à jour avec succès',
            data: db.memberContent[contentIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la mise à jour du contenu',
            details: error.message
        });
    }
});

/**
 * DELETE /api/admin/content/:id
 * Supprimer un contenu
 */
router.delete('/content/:id', async (req, res) => {
    try {
        const db = readDatabase();
        const contentIndex = db.memberContent?.findIndex(c => c.id === req.params.id);

        if (contentIndex === undefined || contentIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Contenu introuvable'
            });
        }

        db.memberContent.splice(contentIndex, 1);
        writeDatabase(db);

        res.json({
            success: true,
            message: 'Contenu supprimé avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression du contenu',
            details: error.message
        });
    }
});

// ============================================
// GESTION DES PAIEMENTS
// ============================================

/**
 * GET /api/admin/payments
 * Liste tous les paiements avec stats
 */
router.get('/payments', async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        const db = readDatabase();

        let payments = db.payments || [];

        // Filtrer par statut
        if (status) {
            payments = payments.filter(p => p.status === status);
        }

        // Filtrer par dates
        if (startDate) {
            payments = payments.filter(p => new Date(p.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            payments = payments.filter(p => new Date(p.createdAt) <= new Date(endDate));
        }

        // Calculer des statistiques
        const stats = {
            total: payments.length,
            completed: payments.filter(p => p.status === 'completed').length,
            pending: payments.filter(p => p.status === 'pending').length,
            failed: payments.filter(p => p.status === 'failed').length,
            totalRevenue: payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + (p.price || 0), 0)
        };

        res.json({
            success: true,
            data: payments,
            stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des paiements',
            details: error.message
        });
    }
});

/**
 * GET /api/admin/stats
 * Statistiques globales du site
 */
router.get('/stats', async (req, res) => {
    try {
        const db = readDatabase();

        const stats = {
            users: {
                total: db.users.length,
                free: db.users.filter(u => u.subscriptionStatus === 'free').length,
                premium: db.users.filter(u => u.subscriptionStatus === 'premium').length,
                vip: db.users.filter(u => u.subscriptionStatus === 'vip').length,
                emailVerified: db.users.filter(u => u.emailVerified).length
            },
            payments: {
                total: db.payments.length,
                completed: db.payments.filter(p => p.status === 'completed').length,
                pending: db.payments.filter(p => p.status === 'pending').length,
                failed: db.payments.filter(p => p.status === 'failed').length,
                totalRevenue: db.payments
                    .filter(p => p.status === 'completed')
                    .reduce((sum, p) => sum + (p.price || 0), 0)
            },
            content: {
                total: db.memberContent.length,
                free: db.memberContent.filter(c => c.level === 'free').length,
                premium: db.memberContent.filter(c => c.level === 'premium').length,
                vip: db.memberContent.filter(c => c.level === 'vip').length,
                published: db.memberContent.filter(c => c.published).length
            },
            products: {
                total: db.products?.length || 0,
                active: db.products?.filter(p => p.active).length || 0
            }
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des statistiques',
            details: error.message
        });
    }
});

// ==========================================
// REVIEWS MANAGEMENT
// ==========================================

// @route   GET /api/admin/reviews
// @desc    Get all reviews (pending and approved)
// @access  Admin only
router.get('/reviews', async (req, res) => {
    try {
        const db = readDatabase();

        // Retourner tous les avis avec infos utilisateur
        const reviewsWithUserInfo = db.reviews.map(review => {
            const user = db.users.find(u => u.id === review.userId);
            return {
                ...review,
                userEmail: user?.email || 'Unknown'
            };
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            data: reviewsWithUserInfo
        });
    } catch (error) {
        console.error('Erreur récupération reviews admin:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors du chargement des avis'
        });
    }
});

// @route   PUT /api/admin/reviews/:id/approve
// @desc    Approve a review
// @access  Admin only
router.put('/reviews/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const db = readDatabase();

        const reviewIndex = db.reviews.findIndex(r => r.id === id);
        if (reviewIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Avis introuvable'
            });
        }

        db.reviews[reviewIndex].approved = true;
        db.reviews[reviewIndex].approvedAt = new Date().toISOString();
        writeDatabase(db);

        res.json({
            success: true,
            message: 'Avis approuvé avec succès'
        });
    } catch (error) {
        console.error('Erreur approbation review:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'approbation de l\'avis'
        });
    }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete/reject a review
// @access  Admin only
router.delete('/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = readDatabase();

        const reviewIndex = db.reviews.findIndex(r => r.id === id);
        if (reviewIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Avis introuvable'
            });
        }

        db.reviews.splice(reviewIndex, 1);
        writeDatabase(db);

        res.json({
            success: true,
            message: 'Avis supprimé avec succès'
        });
    } catch (error) {
        console.error('Erreur suppression review:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la suppression de l\'avis'
        });
    }
});

module.exports = router;
