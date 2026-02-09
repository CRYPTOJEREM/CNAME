const fs = require('fs');
const path = require('path');

// Utiliser database.production.json en production, database.json en développement
const isProduction = process.env.NODE_ENV === 'production';
const DB_FILENAME = isProduction ? 'database.production.json' : 'database.json';
const DB_FILE = path.join(__dirname, '..', DB_FILENAME);

// Log du fichier utilisé au démarrage
console.log(`📦 Base de données : ${DB_FILENAME} (${isProduction ? 'PRODUCTION' : 'DÉVELOPPEMENT'})`);

/**
 * Charger la base de données JSON
 */
function loadDB() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Erreur lecture database.json:', error.message);
        // Retourner structure vide si erreur
        return {
            users: [],
            payments: [],
            emailVerifications: [],
            refreshTokens: [],
            memberContent: [],
            newsletterSubscribers: []
        };
    }
}

/**
 * Sauvegarder la base de données JSON
 */
function saveDB(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('❌ Erreur écriture database.json:', error.message);
        return false;
    }
}

/**
 * Ajouter un élément à une collection
 */
function addToCollection(collectionName, item) {
    const db = loadDB();
    if (!db[collectionName]) {
        db[collectionName] = [];
    }
    db[collectionName].push(item);
    return saveDB(db);
}

/**
 * Trouver un élément dans une collection
 */
function findInCollection(collectionName, query) {
    const db = loadDB();
    const collection = db[collectionName] || [];

    return collection.find(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
    });
}

/**
 * Trouver tous les éléments correspondant à un query
 */
function findAllInCollection(collectionName, query = {}) {
    const db = loadDB();
    const collection = db[collectionName] || [];

    if (Object.keys(query).length === 0) {
        return collection;
    }

    return collection.filter(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
    });
}

/**
 * Mettre à jour un élément dans une collection
 */
function updateInCollection(collectionName, query, updates) {
    const db = loadDB();
    const collection = db[collectionName] || [];

    const index = collection.findIndex(item => {
        return Object.keys(query).every(key => item[key] === query[key]);
    });

    if (index !== -1) {
        collection[index] = { ...collection[index], ...updates, updatedAt: new Date().toISOString() };
        db[collectionName] = collection;
        return saveDB(db) ? collection[index] : null;
    }

    return null;
}

/**
 * Supprimer un élément d'une collection
 */
function deleteFromCollection(collectionName, query) {
    const db = loadDB();
    const collection = db[collectionName] || [];

    const filteredCollection = collection.filter(item => {
        return !Object.keys(query).every(key => item[key] === query[key]);
    });

    db[collectionName] = filteredCollection;
    return saveDB(db);
}

module.exports = {
    loadDB,
    saveDB,
    readDatabase: loadDB,  // Alias pour compatibilité
    writeDatabase: saveDB, // Alias pour compatibilité
    addToCollection,
    findInCollection,
    findAllInCollection,
    updateInCollection,
    deleteFromCollection
};
