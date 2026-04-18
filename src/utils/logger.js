/**
 * Logger utilitaire qui n'affiche les logs qu'en mode développement
 * En production, les logs sont désactivés pour améliorer les performances
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
    log: (...args) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },

    warn: (...args) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },

    error: (...args) => {
        // Les erreurs sont toujours affichées (même en prod pour le debugging)
        console.error(...args);
    },

    info: (...args) => {
        if (isDevelopment) {
            console.info(...args);
        }
    },

    debug: (...args) => {
        if (isDevelopment) {
            console.debug(...args);
        }
    }
};

// Export par défaut pour utilisation simple
export default logger;
