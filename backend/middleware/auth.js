const { verifyAccessToken } = require('../config/jwt');
const { findUserById } = require('../services/userService');

/**
 * Middleware de vérification JWT
 * Vérifie le token et attache l'utilisateur à req.user
 */
async function authMiddleware(req, res, next) {
    try {
        // Extraire le token du header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Token d\'authentification manquant'
            });
        }

        // Extraire le token
        const token = authHeader.split(' ')[1];

        // Vérifier le token
        const decoded = verifyAccessToken(token);

        // Récupérer l'utilisateur
        const user = await findUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Utilisateur introuvable'
            });
        }

        // Attacher l'utilisateur à la requête
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Token invalide ou expiré',
            details: error.message
        });
    }
}

/**
 * Middleware optionnel de vérification JWT
 * Attache l'utilisateur si token valide, sinon continue sans erreur
 */
async function optionalAuthMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyAccessToken(token);
            const user = await findUserById(decoded.userId);

            if (user) {
                req.user = user;
            }
        }
    } catch (error) {
        // Ignorer les erreurs, continuer sans utilisateur
    }

    next();
}

/**
 * Middleware de vérification du niveau d'abonnement
 * Require qu'un niveau minimum d'abonnement
 */
function requireSubscription(minLevel) {
    return (req, res, next) => {
        const levels = { free: 0, premium: 1, vip: 2 };

        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentification requise'
            });
        }

        const userLevel = levels[req.user.subscriptionStatus] || 0;
        const requiredLevel = levels[minLevel] || 0;

        if (userLevel >= requiredLevel) {
            next();
        } else {
            res.status(403).json({
                success: false,
                error: 'Abonnement insuffisant',
                required: minLevel,
                current: req.user.subscriptionStatus,
                message: `Un abonnement ${minLevel.toUpperCase()} est requis pour accéder à cette ressource`
            });
        }
    };
}

/**
 * Middleware pour vérifier que l'email est vérifié
 */
function requireEmailVerified(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentification requise'
        });
    }

    if (!req.user.emailVerified) {
        return res.status(403).json({
            success: false,
            error: 'Email non vérifié',
            message: 'Veuillez vérifier votre email avant d\'accéder à cette ressource'
        });
    }

    next();
}

module.exports = {
    authMiddleware,
    optionalAuthMiddleware,
    requireSubscription,
    requireEmailVerified
};
