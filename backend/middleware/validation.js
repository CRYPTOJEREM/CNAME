const { body, validationResult } = require('express-validator');

/**
 * Middleware pour gérer les erreurs de validation
 */
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation échouée',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
}

/**
 * Validations pour l'inscription
 */
const registerValidation = [
    body('email')
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail()
        .trim(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
        .withMessage('Le mot de passe doit contenir : 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'),

    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le prénom contient des caractères invalides'),

    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le nom contient des caractères invalides'),

    body('telegramUsername')
        .optional()
        .trim()
        .matches(/^@?[a-zA-Z0-9_]{5,32}$/)
        .withMessage('Le pseudo Telegram doit contenir entre 5 et 32 caractères (lettres, chiffres, underscore)')
        .customSanitizer(value => value.replace('@', '')), // Enlever @ si présent

    body('bitunixUid')
        .trim()
        .notEmpty()
        .withMessage('Le Bitunix UID est requis')
        .matches(/^\d{6,12}$/)
        .withMessage('Le Bitunix UID doit contenir entre 6 et 12 chiffres'),

    handleValidationErrors
];

/**
 * Validations pour la connexion
 */
const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Email invalide')
        .normalizeEmail()
        .trim(),

    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis'),

    handleValidationErrors
];

/**
 * Validations pour la modification de profil
 */
const updateProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le prénom contient des caractères invalides'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Le nom doit contenir entre 2 et 50 caractères')
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
        .withMessage('Le nom contient des caractères invalides'),

    body('telegramUsername')
        .optional()
        .trim()
        .matches(/^@?[a-zA-Z0-9_]{5,32}$/)
        .withMessage('Le pseudo Telegram doit contenir entre 5 et 32 caractères')
        .customSanitizer(value => value.replace('@', '')),

    body('bitunixUid')
        .optional()
        .trim()
        .matches(/^\d{6,12}$/)
        .withMessage('Le Bitunix UID doit contenir entre 6 et 12 chiffres'),

    handleValidationErrors
];

/**
 * Validations pour le changement de mot de passe
 */
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Le mot de passe actuel est requis'),

    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
        .withMessage('Le nouveau mot de passe doit contenir : 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'),

    handleValidationErrors
];

/**
 * Validation pour reset password
 */
const resetPasswordValidation = [
    body('token')
        .notEmpty()
        .withMessage('Le token est requis'),

    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/)
        .withMessage('Le nouveau mot de passe doit contenir : 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial'),

    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation,
    resetPasswordValidation
};
