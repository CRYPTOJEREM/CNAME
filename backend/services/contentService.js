/**
 * Service de gestion du contenu membre
 * Gère l'accès au contenu basé sur le niveau d'abonnement
 */

const { readDatabase, writeDatabase } = require('../config/database');

/**
 * Obtenir tout le contenu filtré par niveau d'abonnement
 * @param {string} userLevel - 'free', 'premium', ou 'vip'
 * @returns {Array} Contenu accessible
 */
function getContentByLevel(userLevel) {
    const db = readDatabase();
    const levels = { free: 0, premium: 1, vip: 2 };
    const userLevelValue = levels[userLevel] || 0;

    // Filtrer le contenu publié et accessible selon le niveau
    return db.memberContent.filter(content => {
        const contentLevel = levels[content.level] || 0;
        return content.published && contentLevel <= userLevelValue;
    }).map(content => ({
        id: content.id,
        title: content.title,
        type: content.type,
        level: content.level,
        description: content.description,
        thumbnail: content.thumbnail || null,
        duration: content.duration || null,
        createdAt: content.createdAt
    }));
}

/**
 * Obtenir toutes les formations accessibles
 * @param {string} userLevel - Niveau d'abonnement
 * @returns {Array} Formations accessibles
 */
function getFormationsByLevel(userLevel) {
    const db = readDatabase();
    const levels = { free: 0, premium: 1, vip: 2 };
    const userLevelValue = levels[userLevel] || 0;

    return db.memberContent.filter(content => {
        const contentLevel = levels[content.level] || 0;
        return content.published &&
               content.type === 'formation' &&
               contentLevel <= userLevelValue;
    });
}

/**
 * Obtenir une formation par ID
 * @param {string} formationId - ID de la formation
 * @param {string} userLevel - Niveau d'abonnement
 * @returns {Object|null} Formation complète ou null
 */
function getFormationById(formationId, userLevel) {
    const db = readDatabase();
    const formation = db.memberContent.find(c => c.id === formationId && c.type === 'formation');

    if (!formation || !formation.published) {
        return null;
    }

    // Vérifier si l'utilisateur a accès
    const levels = { free: 0, premium: 1, vip: 2 };
    const userLevelValue = levels[userLevel] || 0;
    const contentLevel = levels[formation.level] || 0;

    if (contentLevel > userLevelValue) {
        return null; // Pas accès
    }

    return formation;
}

/**
 * Obtenir le contenu par ID
 * @param {string} contentId - ID du contenu
 * @param {string} userLevel - Niveau d'abonnement
 * @returns {Object|null} Contenu complet ou null
 */
function getContentById(contentId, userLevel) {
    const db = readDatabase();
    const content = db.memberContent.find(c => c.id === contentId);

    if (!content || !content.published) {
        return null;
    }

    // Vérifier l'accès
    const levels = { free: 0, premium: 1, vip: 2 };
    const userLevelValue = levels[userLevel] || 0;
    const contentLevel = levels[content.level] || 0;

    if (contentLevel > userLevelValue) {
        return {
            ...content,
            locked: true,
            requiredLevel: content.level
        };
    }

    return content;
}

/**
 * Obtenir les statistiques du contenu pour l'admin
 * @returns {Object} Statistiques
 */
function getContentStats() {
    const db = readDatabase();
    const content = db.memberContent || [];

    return {
        total: content.length,
        published: content.filter(c => c.published).length,
        byType: content.reduce((acc, c) => {
            acc[c.type] = (acc[c.type] || 0) + 1;
            return acc;
        }, {}),
        byLevel: content.reduce((acc, c) => {
            acc[c.level] = (acc[c.level] || 0) + 1;
            return acc;
        }, {})
    };
}

/**
 * Créer du nouveau contenu (admin)
 * @param {Object} contentData - Données du contenu
 * @returns {Object} Contenu créé
 */
function createContent(contentData) {
    const db = readDatabase();
    const { v4: uuidv4 } = require('uuid');

    const newContent = {
        id: uuidv4(),
        title: contentData.title,
        type: contentData.type, // 'video', 'article', 'formation', 'webinar'
        level: contentData.level, // 'free', 'premium', 'vip'
        description: contentData.description,
        content: contentData.content, // URL ou HTML
        thumbnail: contentData.thumbnail || null,
        duration: contentData.duration || null,
        modules: contentData.modules || [],
        published: contentData.published !== undefined ? contentData.published : false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    db.memberContent.push(newContent);
    writeDatabase(db);

    return newContent;
}

/**
 * Mettre à jour du contenu (admin)
 * @param {string} contentId - ID du contenu
 * @param {Object} updates - Mises à jour
 * @returns {Object|null} Contenu mis à jour ou null
 */
function updateContent(contentId, updates) {
    const db = readDatabase();
    const index = db.memberContent.findIndex(c => c.id === contentId);

    if (index === -1) {
        return null;
    }

    db.memberContent[index] = {
        ...db.memberContent[index],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    writeDatabase(db);
    return db.memberContent[index];
}

/**
 * Supprimer du contenu (admin)
 * @param {string} contentId - ID du contenu
 * @returns {boolean} Succès
 */
function deleteContent(contentId) {
    const db = readDatabase();
    const index = db.memberContent.findIndex(c => c.id === contentId);

    if (index === -1) {
        return false;
    }

    db.memberContent.splice(index, 1);
    writeDatabase(db);
    return true;
}

/**
 * Obtenir la progression d'un utilisateur sur une formation
 */
function getUserFormationProgress(userId, formationId) {
    const db = readDatabase();
    const progress = db.userProgress || [];
    return progress.filter(p => p.userId === userId && p.formationId === formationId);
}

/**
 * Marquer un module comme complete (avec validation progressive)
 */
function completeModule(userId, formationId, moduleId) {
    const db = readDatabase();

    const formation = db.memberContent.find(
        c => c.id === formationId && c.type === 'formation'
    );
    if (!formation) {
        return { success: false, error: 'Formation introuvable' };
    }

    // Normaliser les modules (compatibilite ancien format string)
    const modules = (formation.modules || []).map((mod, index) => {
        if (typeof mod === 'string') {
            return { id: `legacy-${index}`, title: mod, videoUrl: '', order: index };
        }
        return mod;
    });

    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) {
        return { success: false, error: 'Module introuvable' };
    }

    const targetModule = modules[moduleIndex];

    if (!db.userProgress) db.userProgress = [];
    const alreadyCompleted = db.userProgress.find(
        p => p.userId === userId && p.formationId === formationId && p.moduleId === moduleId
    );
    if (alreadyCompleted) {
        return { success: true, alreadyCompleted: true };
    }

    // Validation progressive : le module precedent doit etre complete
    if (targetModule.order > 0) {
        const previousModule = modules.find(m => m.order === targetModule.order - 1);
        if (previousModule) {
            const prevCompleted = db.userProgress.find(
                p => p.userId === userId && p.formationId === formationId && p.moduleId === previousModule.id
            );
            if (!prevCompleted) {
                return { success: false, error: 'Vous devez completer le module precedent d\'abord' };
            }
        }
    }

    const { v4: uuidv4 } = require('uuid');
    const progressRecord = {
        id: `progress-${uuidv4()}`,
        userId,
        formationId,
        moduleId,
        completedAt: new Date().toISOString()
    };

    db.userProgress.push(progressRecord);
    writeDatabase(db);

    return { success: true, progress: progressRecord };
}

/**
 * Obtenir une formation enrichie avec la progression utilisateur
 */
function getFormationWithProgress(formationId, userId, userLevel) {
    const formation = getFormationById(formationId, userLevel);
    if (!formation) return null;

    const progress = getUserFormationProgress(userId, formationId);
    const completedModuleIds = new Set(progress.map(p => p.moduleId));

    // Normaliser et trier les modules
    const sortedModules = (formation.modules || []).map((mod, index) => {
        if (typeof mod === 'string') {
            return { id: `legacy-${index}`, title: mod, videoUrl: '', order: index };
        }
        return mod;
    }).sort((a, b) => a.order - b.order);

    const enrichedModules = sortedModules.map((mod, index) => {
        const isCompleted = completedModuleIds.has(mod.id);
        let isUnlocked = false;

        if (mod.order === 0) {
            isUnlocked = true;
        } else {
            const prevModule = sortedModules[index - 1];
            if (prevModule) {
                isUnlocked = completedModuleIds.has(prevModule.id);
            }
        }

        return {
            ...mod,
            completed: isCompleted,
            unlocked: isUnlocked || isCompleted,
            videoUrl: (isUnlocked || isCompleted) ? mod.videoUrl : null
        };
    });

    return {
        ...formation,
        modules: enrichedModules,
        progress: {
            completed: completedModuleIds.size,
            total: sortedModules.length,
            percentage: sortedModules.length > 0
                ? Math.round((completedModuleIds.size / sortedModules.length) * 100)
                : 0
        }
    };
}

module.exports = {
    getContentByLevel,
    getFormationsByLevel,
    getFormationById,
    getFormationWithProgress,
    getContentById,
    getContentStats,
    createContent,
    updateContent,
    deleteContent,
    getUserFormationProgress,
    completeModule
};
