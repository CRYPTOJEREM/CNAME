/**
 * Service pour l'espace membre
 * Appels API pour accéder au contenu exclusif, profil, abonnement
 */

import api from './api';

// ==========================================
// PROFIL UTILISATEUR
// ==========================================

/**
 * Obtenir le profil utilisateur
 */
export async function getProfile() {
    const response = await api.get('/member/profile');
    return response.data;
}

/**
 * Mettre à jour le profil
 */
export async function updateProfile(updates) {
    const response = await api.put('/member/profile', updates);
    return response.data;
}

// ==========================================
// CONTENU MEMBRE
// ==========================================

/**
 * Obtenir tout le contenu accessible
 */
export async function getContent() {
    const response = await api.get('/member/content');
    return response.data;
}

/**
 * Obtenir un contenu spécifique par ID
 */
export async function getContentById(contentId) {
    const response = await api.get(`/member/content/${contentId}`);
    return response.data;
}

// ==========================================
// FORMATIONS
// ==========================================

/**
 * Obtenir toutes les formations accessibles
 */
export async function getFormations() {
    const response = await api.get('/member/formations');
    return response.data;
}

/**
 * Obtenir une formation spécifique
 */
export async function getFormationById(formationId) {
    const response = await api.get(`/member/formations/${formationId}`);
    return response.data;
}

// ==========================================
// ABONNEMENT
// ==========================================

/**
 * Obtenir les détails de l'abonnement
 */
export async function getSubscription() {
    const response = await api.get('/member/subscription');
    return response.data;
}

// ==========================================
// HISTORIQUE PAIEMENTS
// ==========================================

/**
 * Obtenir l'historique des paiements
 */
export async function getPaymentHistory() {
    const response = await api.get('/member/payments');
    return response.data;
}

const memberService = {
    getProfile,
    updateProfile,
    getContent,
    getContentById,
    getFormations,
    getFormationById,
    getSubscription,
    getPaymentHistory
};

export default memberService;
