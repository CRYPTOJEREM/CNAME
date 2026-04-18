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
            newsletterSubscribers: [],
            dailyVideos: [],
            dailyComments: [],
            userProgress: []
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

/**
 * Seed du compte admin au démarrage
 */
async function seedAdmin() {
    const bcrypt = require('bcryptjs');
    const { v4: uuidv4 } = require('uuid');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lasphere.com';
    const adminPassword = process.env.ADMIN_PASSWORD;

    // En production, le mot de passe admin DOIT être défini
    if (isProduction && !adminPassword) {
        console.error('❌ ERREUR FATALE: ADMIN_PASSWORD non défini en production');
        console.error('   Veuillez définir une variable d\'environnement ADMIN_PASSWORD forte');
        process.exit(1);
    }

    // Valider la force du mot de passe en production
    if (isProduction && adminPassword) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/;
        if (!passwordRegex.test(adminPassword)) {
            console.error('❌ ERREUR FATALE: ADMIN_PASSWORD trop faible');
            console.error('   Le mot de passe doit contenir au minimum:');
            console.error('   - 12 caractères');
            console.error('   - 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial');
            process.exit(1);
        }
    }

    // Fallback sécurisé en développement uniquement
    const finalPassword = adminPassword || 'Admin@2026!DevOnly!';

    const db = loadDB();
    if (!db.users) db.users = [];

    const existingAdmin = db.users.find(u => u.email === adminEmail);

    if (!existingAdmin) {
        const hash = await bcrypt.hash(finalPassword, 10);
        db.users.push({
            id: uuidv4(),
            email: adminEmail,
            passwordHash: hash,
            firstName: 'Admin',
            lastName: 'La Sphere',
            telegramUsername: '@admin_lasphere',
            emailVerified: true,
            subscriptionStatus: 'vip',
            subscriptionExpiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(),
            role: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        saveDB(db);
        console.log(`✅ Compte admin créé : ${adminEmail}`);
    } else {
        const hash = await bcrypt.hash(finalPassword, 10);
        existingAdmin.passwordHash = hash;
        existingAdmin.updatedAt = new Date().toISOString();
        saveDB(db);
        console.log(`✅ Compte admin mis à jour : ${adminEmail}`);
    }
}

module.exports = {
    loadDB,
    saveDB,
    readDatabase: loadDB,
    writeDatabase: saveDB,
    addToCollection,
    findInCollection,
    findAllInCollection,
    updateInCollection,
    deleteFromCollection,
    seedAdmin
};
