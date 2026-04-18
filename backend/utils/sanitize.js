const xss = require('xss');

/**
 * Sanitize user input pour prévenir les attaques XSS
 * @param {string} input - Texte à sanitizer
 * @returns {string} - Texte sanitized
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return input;
    }

    // Configuration XSS - permet certaines balises basiques mais retire les scripts
    return xss(input, {
        whiteList: {
            // Autoriser seulement les balises de formatage basique
            b: [],
            i: [],
            em: [],
            strong: [],
            p: [],
            br: [],
            a: ['href', 'title'],
            ul: [],
            ol: [],
            li: []
        },
        stripIgnoreTag: true, // Supprimer toutes les balises non autorisées
        stripIgnoreTagBody: ['script'] // Supprimer complètement les balises script
    });
}

/**
 * Sanitize un objet récursivement
 * @param {Object} obj - Objet à sanitizer
 * @returns {Object} - Objet sanitized
 */
function sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return typeof obj === 'string' ? sanitizeInput(obj) : obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    const sanitized = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            sanitized[key] = sanitizeObject(obj[key]);
        }
    }
    return sanitized;
}

module.exports = {
    sanitizeInput,
    sanitizeObject
};
