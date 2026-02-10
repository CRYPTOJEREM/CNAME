import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const CarouselManagement = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingVideo, setEditingVideo] = useState(null)
    const [creatingVideo, setCreatingVideo] = useState(false)

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admin/carousel')
            setVideos(response.data.data)
        } catch (error) {
            console.error('Erreur chargement carousel:', error)
            alert('Erreur lors du chargement des vidéos')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setCreatingVideo(true)
        setEditingVideo({
            platform: 'youtube',
            embedUrl: '',
            title: '',
            description: '',
            views: '0 vues',
            engagement: '0 likes',
            active: true
        })
    }

    const handleEdit = (video) => {
        setCreatingVideo(false)
        setEditingVideo({ ...video })
    }

    const handleSave = async () => {
        try {
            if (creatingVideo) {
                await api.post('/admin/carousel', editingVideo)
                alert('Vidéo ajoutée avec succès')
            } else {
                await api.put(`/admin/carousel/${editingVideo.id}`, editingVideo)
                alert('Vidéo mise à jour avec succès')
            }
            setEditingVideo(null)
            setCreatingVideo(false)
            fetchVideos()
        } catch (error) {
            console.error('Erreur save carousel:', error)
            alert(error.response?.data?.error || 'Erreur lors de l\'enregistrement')
        }
    }

    const handleDelete = async (videoId) => {
        if (!confirm('Supprimer cette vidéo du carrousel ?')) return

        try {
            await api.delete(`/admin/carousel/${videoId}`)
            alert('Vidéo supprimée')
            fetchVideos()
        } catch (error) {
            console.error('Erreur delete carousel:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const handleMoveUp = async (video) => {
        const sorted = [...videos].sort((a, b) => a.order - b.order)
        const idx = sorted.findIndex(v => v.id === video.id)
        if (idx <= 0) return

        const prev = sorted[idx - 1]
        try {
            await api.put(`/admin/carousel/${video.id}`, { order: prev.order })
            await api.put(`/admin/carousel/${prev.id}`, { order: video.order })
            fetchVideos()
        } catch (error) {
            console.error('Erreur réordonnement:', error)
        }
    }

    const handleMoveDown = async (video) => {
        const sorted = [...videos].sort((a, b) => a.order - b.order)
        const idx = sorted.findIndex(v => v.id === video.id)
        if (idx >= sorted.length - 1) return

        const next = sorted[idx + 1]
        try {
            await api.put(`/admin/carousel/${video.id}`, { order: next.order })
            await api.put(`/admin/carousel/${next.id}`, { order: video.order })
            fetchVideos()
        } catch (error) {
            console.error('Erreur réordonnement:', error)
        }
    }

    const toggleActive = async (video) => {
        try {
            await api.put(`/admin/carousel/${video.id}`, { active: !video.active })
            fetchVideos()
        } catch (error) {
            console.error('Erreur toggle active:', error)
        }
    }

    return (
        <div className="content-management">
            <div className="management-header">
                <h2>🎬 Gestion du Carrousel</h2>
                <button onClick={handleCreate} className="btn-create">➕ Ajouter une vidéo</button>
            </div>

            {loading ? (
                <div className="loading">Chargement des vidéos...</div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ORDRE</th>
                                <th>PLATEFORME</th>
                                <th>TITRE</th>
                                <th>STATS</th>
                                <th>STATUT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {videos.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                                        Aucune vidéo dans le carrousel
                                    </td>
                                </tr>
                            ) : (
                                videos.map((video, idx) => (
                                    <tr key={video.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontWeight: 'bold', color: '#00D9FF' }}>#{video.order}</span>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <button
                                                        onClick={() => handleMoveUp(video)}
                                                        disabled={idx === 0}
                                                        style={{
                                                            background: 'none', border: 'none', cursor: idx === 0 ? 'default' : 'pointer',
                                                            opacity: idx === 0 ? 0.3 : 1, fontSize: '12px', padding: '0'
                                                        }}
                                                    >▲</button>
                                                    <button
                                                        onClick={() => handleMoveDown(video)}
                                                        disabled={idx === videos.length - 1}
                                                        style={{
                                                            background: 'none', border: 'none', cursor: idx === videos.length - 1 ? 'default' : 'pointer',
                                                            opacity: idx === videos.length - 1 ? 0.3 : 1, fontSize: '12px', padding: '0'
                                                        }}
                                                    >▼</button>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`video-platform platform-${video.platform}`}>
                                                {video.platform === 'youtube' ? '📺 YouTube' : '🎮 Twitch'}
                                            </span>
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{video.title}</strong>
                                                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{video.description}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '13px' }}>
                                                <div>👁️ {video.views}</div>
                                                <div>{video.platform === 'youtube' ? '❤️' : '💬'} {video.engagement}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => toggleActive(video)}
                                                style={{
                                                    background: video.active ? 'rgba(0, 200, 83, 0.2)' : 'rgba(255, 82, 82, 0.2)',
                                                    color: video.active ? '#00C853' : '#FF5252',
                                                    border: `1px solid ${video.active ? '#00C853' : '#FF5252'}`,
                                                    borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontSize: '12px'
                                                }}
                                            >
                                                {video.active ? '✅ Actif' : '❌ Inactif'}
                                            </button>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleEdit(video)} className="btn-edit">✏️</button>
                                                <button onClick={() => handleDelete(video.id)} className="btn-delete">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal d'édition/création */}
            {editingVideo && (
                <div className="modal-overlay" onClick={() => {
                    setEditingVideo(null)
                    setCreatingVideo(false)
                }}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{creatingVideo ? '➕ Nouvelle Vidéo' : '✏️ Modifier la Vidéo'}</h3>
                            <button onClick={() => {
                                setEditingVideo(null)
                                setCreatingVideo(false)
                            }} className="btn-close">✖</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Plateforme *</label>
                                    <select
                                        value={editingVideo.platform}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, platform: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="youtube">YouTube</option>
                                        <option value="twitch">Twitch</option>
                                    </select>
                                </div>
                                <div className="form-group flex-2">
                                    <label>Titre *</label>
                                    <input
                                        type="text"
                                        value={editingVideo.title}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                                        className="form-input"
                                        placeholder="Titre de la vidéo"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>URL Embed *</label>
                                <input
                                    type="text"
                                    value={editingVideo.embedUrl}
                                    onChange={(e) => setEditingVideo({ ...editingVideo, embedUrl: e.target.value })}
                                    className="form-input"
                                    placeholder="https://www.youtube.com/embed/... ou https://player.twitch.tv/?video=..."
                                />
                            </div>

                            {editingVideo.embedUrl && (
                                <div style={{ marginBottom: '15px', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', maxHeight: '250px' }}>
                                    <iframe
                                        src={editingVideo.embedUrl}
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editingVideo.description}
                                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                                    className="form-textarea"
                                    rows="2"
                                    placeholder="Description courte de la vidéo"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Vues</label>
                                    <input
                                        type="text"
                                        value={editingVideo.views}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, views: e.target.value })}
                                        className="form-input"
                                        placeholder="15K vues"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Engagement</label>
                                    <input
                                        type="text"
                                        value={editingVideo.engagement}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, engagement: e.target.value })}
                                        className="form-input"
                                        placeholder="890 likes"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Actif</label>
                                    <select
                                        value={editingVideo.active}
                                        onChange={(e) => setEditingVideo({ ...editingVideo, active: e.target.value === 'true' })}
                                        className="form-select"
                                    >
                                        <option value="true">Oui</option>
                                        <option value="false">Non</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => {
                                setEditingVideo(null)
                                setCreatingVideo(false)
                            }} className="btn-cancel">Annuler</button>
                            <button onClick={handleSave} className="btn-save">💾 Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CarouselManagement
