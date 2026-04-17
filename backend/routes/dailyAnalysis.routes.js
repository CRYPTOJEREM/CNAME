const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readDatabase, writeDatabase } = require('../config/database');
const { authMiddleware, requireSubscription, requireAdmin } = require('../middleware/auth');

// ==========================================
// HELPER: Parser YouTube URL
// ==========================================

function extractYouTubeVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// ==========================================
// ROUTES ADMIN - Gestion vidéos du jour
// ==========================================

// GET /admin/videos - Lister toutes les vidéos
router.get('/admin/videos', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const db = readDatabase();
        const dailyVideos = db.dailyVideos || [];
        const dailyComments = db.dailyComments || [];

        const videosWithComments = dailyVideos
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .map(video => ({
                ...video,
                commentCount: dailyComments.filter(c => c.dailyVideoId === video.id).length
            }));

        res.json({ success: true, data: videosWithComments });
    } catch (error) {
        console.error('Erreur GET /admin/videos:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// POST /admin/videos - Publier une vidéo du jour
router.post('/admin/videos', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { title, description, youtubeUrl } = req.body;

        if (!title || !youtubeUrl) {
            return res.status(400).json({ success: false, message: 'Titre et URL YouTube requis' });
        }

        const videoId = extractYouTubeVideoId(youtubeUrl);
        if (!videoId) {
            return res.status(400).json({ success: false, message: 'URL YouTube invalide' });
        }

        const db = readDatabase();
        if (!db.dailyVideos) db.dailyVideos = [];

        const newVideo = {
            id: uuidv4(),
            title,
            description: description || '',
            youtubeUrl,
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            publishedAt: new Date().toISOString(),
            createdBy: req.user.id,
            active: true,
            createdAt: new Date().toISOString()
        };

        db.dailyVideos.push(newVideo);
        writeDatabase(db);

        res.status(201).json({ success: true, message: 'Vidéo du jour publiée', data: newVideo });
    } catch (error) {
        console.error('Erreur POST /admin/videos:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// DELETE /admin/videos/:id - Supprimer une vidéo + ses commentaires
router.delete('/admin/videos/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const db = readDatabase();
        if (!db.dailyVideos) db.dailyVideos = [];
        if (!db.dailyComments) db.dailyComments = [];

        const videoIndex = db.dailyVideos.findIndex(v => v.id === req.params.id);
        if (videoIndex === -1) {
            return res.status(404).json({ success: false, message: 'Vidéo non trouvée' });
        }

        db.dailyVideos.splice(videoIndex, 1);
        db.dailyComments = db.dailyComments.filter(c => c.dailyVideoId !== req.params.id);
        writeDatabase(db);

        res.json({ success: true, message: 'Vidéo et commentaires supprimés' });
    } catch (error) {
        console.error('Erreur DELETE /admin/videos/:id:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// DELETE /admin/comments/:id - Modérer un commentaire
router.delete('/admin/comments/:id', authMiddleware, requireAdmin, async (req, res) => {
    try {
        const db = readDatabase();
        if (!db.dailyComments) db.dailyComments = [];

        const commentIndex = db.dailyComments.findIndex(c => c.id === req.params.id);
        if (commentIndex === -1) {
            return res.status(404).json({ success: false, message: 'Commentaire non trouvé' });
        }

        db.dailyComments.splice(commentIndex, 1);
        writeDatabase(db);

        res.json({ success: true, message: 'Commentaire supprimé' });
    } catch (error) {
        console.error('Erreur DELETE /admin/comments/:id:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// ==========================================
// ROUTES MEMBRE - Accès vidéos du jour
// ==========================================

// GET /today - Vidéo du jour (la plus récente active)
router.get('/today', authMiddleware, requireSubscription('premium'), async (req, res) => {
    try {
        const db = readDatabase();
        const dailyVideos = db.dailyVideos || [];
        const dailyComments = db.dailyComments || [];

        const now = new Date();
        const todayVideo = dailyVideos
            .filter(v => v.active && new Date(v.publishedAt) <= now)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))[0];

        if (!todayVideo) {
            return res.json({ success: true, data: null, message: 'Aucune analyse disponible' });
        }

        res.json({
            success: true,
            data: {
                ...todayVideo,
                commentCount: dailyComments.filter(c => c.dailyVideoId === todayVideo.id).length
            }
        });
    } catch (error) {
        console.error('Erreur GET /today:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// GET /videos - Archive des vidéos passées
router.get('/videos', authMiddleware, requireSubscription('premium'), async (req, res) => {
    try {
        const db = readDatabase();
        const dailyVideos = db.dailyVideos || [];
        const dailyComments = db.dailyComments || [];

        const videos = dailyVideos
            .filter(v => v.active)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .map(video => ({
                ...video,
                commentCount: dailyComments.filter(c => c.dailyVideoId === video.id).length
            }));

        res.json({ success: true, data: videos });
    } catch (error) {
        console.error('Erreur GET /videos:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// GET /videos/:id/comments - Commentaires d'une vidéo
router.get('/videos/:id/comments', authMiddleware, requireSubscription('premium'), async (req, res) => {
    try {
        const db = readDatabase();
        const dailyComments = db.dailyComments || [];

        const comments = dailyComments
            .filter(c => c.dailyVideoId === req.params.id)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.json({ success: true, data: comments });
    } catch (error) {
        console.error('Erreur GET /videos/:id/comments:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// POST /videos/:id/comments - Poster un commentaire
router.post('/videos/:id/comments', authMiddleware, requireSubscription('premium'), async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ success: false, message: 'Le commentaire ne peut pas être vide' });
        }

        if (content.length > 1000) {
            return res.status(400).json({ success: false, message: 'Le commentaire ne doit pas dépasser 1000 caractères' });
        }

        const db = readDatabase();
        if (!db.dailyComments) db.dailyComments = [];

        const video = (db.dailyVideos || []).find(v => v.id === req.params.id);
        if (!video) {
            return res.status(404).json({ success: false, message: 'Vidéo non trouvée' });
        }

        const newComment = {
            id: uuidv4(),
            dailyVideoId: req.params.id,
            userId: req.user.id,
            userName: `${req.user.firstName} ${req.user.lastName?.charAt(0) || ''}.`,
            userSubscription: req.user.subscriptionStatus,
            content: content.trim(),
            createdAt: new Date().toISOString()
        };

        db.dailyComments.push(newComment);
        writeDatabase(db);

        res.status(201).json({ success: true, data: newComment });
    } catch (error) {
        console.error('Erreur POST /videos/:id/comments:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// DELETE /comments/:id - Supprimer son propre commentaire
router.delete('/comments/:id', authMiddleware, requireSubscription('premium'), async (req, res) => {
    try {
        const db = readDatabase();
        if (!db.dailyComments) db.dailyComments = [];

        const commentIndex = db.dailyComments.findIndex(c => c.id === req.params.id);
        if (commentIndex === -1) {
            return res.status(404).json({ success: false, message: 'Commentaire non trouvé' });
        }

        if (db.dailyComments[commentIndex].userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Vous ne pouvez supprimer que vos propres commentaires' });
        }

        db.dailyComments.splice(commentIndex, 1);
        writeDatabase(db);

        res.json({ success: true, message: 'Commentaire supprimé' });
    } catch (error) {
        console.error('Erreur DELETE /comments/:id:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

module.exports = router;
