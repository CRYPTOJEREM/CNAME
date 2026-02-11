const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {
    findInCollection,
    findAllInCollection,
    addToCollection,
    updateInCollection
} = require('../config/database');

/**
 * Créer un nouvel utilisateur
 */
async function createUser(userData) {
    const { email, password, firstName, lastName, telegramUsername, bitunixUid } = userData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = findInCollection('users', { email });
    if (existingUser) {
        throw new Error('Un compte avec cet email existe déjà');
    }

    // Vérifier si le pseudo Telegram est déjà utilisé
    if (telegramUsername) {
        const existingTelegram = findInCollection('users', { telegramUsername });
        if (existingTelegram) {
            throw new Error('Ce pseudo Telegram est déjà utilisé');
        }
    }

    // Hash le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = {
        id: uuidv4(),
        email,
        passwordHash,
        firstName,
        lastName,
        telegramUsername: telegramUsername || null,
        bitunixUid: bitunixUid || null,
        emailVerified: false,
        subscriptionStatus: 'free',
        subscriptionExpiresAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    addToCollection('users', user);

    // Retourner l'utilisateur sans le passwordHash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

/**
 * Trouver un utilisateur par email
 */
async function findUserByEmail(email) {
    return findInCollection('users', { email });
}

/**
 * Trouver un utilisateur par ID
 */
async function findUserById(userId) {
    return findInCollection('users', { id: userId });
}

/**
 * Trouver un utilisateur par pseudo Telegram
 */
async function findUserByTelegram(telegramUsername) {
    return findInCollection('users', { telegramUsername });
}

/**
 * Mettre à jour un utilisateur
 */
async function updateUser(userId, updates) {
    // Ne pas permettre de modifier certains champs
    const allowedUpdates = ['firstName', 'lastName', 'telegramUsername', 'bitunixUid', 'emailVerified', 'subscriptionStatus', 'subscriptionExpiresAt'];
    const filteredUpdates = {};

    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            filteredUpdates[key] = updates[key];
        }
    });

    const updatedUser = updateInCollection('users', { id: userId }, filteredUpdates);
    if (!updatedUser) {
        throw new Error('Utilisateur introuvable');
    }

    // Retourner sans le passwordHash
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
}

/**
 * Vérifier le mot de passe d'un utilisateur
 */
async function verifyPassword(user, password) {
    return await bcrypt.compare(password, user.passwordHash);
}

/**
 * Changer le mot de passe d'un utilisateur
 */
async function changePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updatedUser = updateInCollection('users', { id: userId }, { passwordHash });

    if (!updatedUser) {
        throw new Error('Utilisateur introuvable');
    }

    return true;
}

/**
 * Obtenir les informations utilisateur sans données sensibles
 */
async function getUserPublicData(userId) {
    const user = await findUserById(userId);
    if (!user) {
        throw new Error('Utilisateur introuvable');
    }

    // Retourner uniquement les données publiques
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        telegramUsername: user.telegramUsername,
        bitunixUid: user.bitunixUid,
        emailVerified: user.emailVerified,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        createdAt: user.createdAt
    };
}

/**
 * Obtenir tous les utilisateurs (admin)
 */
async function getAllUsers() {
    const users = findAllInCollection('users');
    return users.map(user => {
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByTelegram,
    updateUser,
    verifyPassword,
    changePassword,
    getUserPublicData,
    getAllUsers
};
