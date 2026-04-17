import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Plus, Trash2, Calendar, MessageCircle, Play, ExternalLink } from 'lucide-react'

function extractYouTubeVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

const DailyVideoManagement = () => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', description: '', youtubeUrl: '' })
    const [submitting, setSubmitting] = useState(false)
    const [previewId, setPreviewId] = useState(null)

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            setLoading(true)
            const response = await api.get('/daily-analysis/admin/videos')
            setVideos(response.data.data || [])
        } catch (error) {
            console.error('Erreur chargement vidéos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUrlChange = (url) => {
        setForm(prev => ({ ...prev, youtubeUrl: url }))
        const videoId = extractYouTubeVideoId(url)
        setPreviewId(videoId)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title.trim() || !form.youtubeUrl.trim()) return
        setSubmitting(true)
        try {
            await api.post('/daily-analysis/admin/videos', {
                title: form.title.trim(),
                description: form.description.trim(),
                youtubeUrl: form.youtubeUrl.trim()
            })
            setForm({ title: '', description: '', youtubeUrl: '' })
            setPreviewId(null)
            setShowForm(false)
            fetchVideos()
        } catch (error) {
            console.error('Erreur publication:', error)
            alert(error.response?.data?.message || 'Erreur lors de la publication')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (videoId) => {
        if (!window.confirm('Supprimer cette vidéo et tous ses commentaires ?')) return
        try {
            await api.delete(`/daily-analysis/admin/videos/${videoId}`)
            fetchVideos()
        } catch (error) {
            console.error('Erreur suppression:', error)
        }
    }

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '30px', flexWrap: 'wrap', gap: '15px'
            }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                        Analyse du Jour
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                        Publiez le recap marché quotidien pour vos membres Premium/VIP
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'linear-gradient(135deg, #2E90FA, #A855F7)',
                        color: 'white', border: 'none', borderRadius: '12px',
                        padding: '12px 24px', fontWeight: '700', fontSize: '14px',
                        cursor: 'pointer', transition: 'all 0.2s'
                    }}
                >
                    <Plus size={18} /> Publier une analyse
                </button>
            </div>

            {/* Formulaire de publication */}
            {showForm && (
                <div style={{
                    background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                    border: '1px solid var(--glass-border)', borderRadius: '16px',
                    padding: '30px', marginBottom: '30px'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '20px' }}>
                        Nouvelle Analyse du Jour
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {/* URL YouTube */}
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    URL YouTube *
                                </label>
                                <input
                                    type="text"
                                    value={form.youtubeUrl}
                                    onChange={(e) => handleUrlChange(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    style={{
                                        width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)', borderRadius: '10px',
                                        color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>

                            {/* Preview YouTube */}
                            {previewId && (
                                <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                    <img
                                        src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                                        alt="Preview"
                                        style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}
                                    />
                                </div>
                            )}

                            {/* Titre */}
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Titre *
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="ex: Analyse du 17 Avril - BTC en range"
                                    style={{
                                        width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)', borderRadius: '10px',
                                        color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                                    Description (optionnel)
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Résumé de l'analyse du jour..."
                                    rows={3}
                                    style={{
                                        width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)', borderRadius: '10px',
                                        color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
                                        resize: 'vertical', fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {/* Boutons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setForm({ title: '', description: '', youtubeUrl: '' }); setPreviewId(null) }}
                                    style={{
                                        padding: '12px 24px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)', borderRadius: '10px',
                                        color: 'var(--text-secondary)', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={!form.title.trim() || !form.youtubeUrl.trim() || submitting}
                                    style={{
                                        padding: '12px 24px',
                                        background: form.title.trim() && form.youtubeUrl.trim() ? 'linear-gradient(135deg, #2E90FA, #A855F7)' : 'rgba(255,255,255,0.1)',
                                        color: 'white', border: 'none', borderRadius: '10px',
                                        fontWeight: '700', fontSize: '14px',
                                        cursor: form.title.trim() && form.youtubeUrl.trim() ? 'pointer' : 'not-allowed',
                                        opacity: submitting ? 0.6 : 1
                                    }}
                                >
                                    {submitting ? 'Publication...' : 'Publier'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Liste des vidéos */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Chargement...
                </div>
            ) : videos.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '60px', color: 'var(--text-tertiary)',
                    border: '2px dashed var(--glass-border)', borderRadius: '16px'
                }}>
                    <Play size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p style={{ fontSize: '16px', fontWeight: '600' }}>Aucune analyse publiée</p>
                    <p style={{ fontSize: '14px' }}>Cliquez sur "Publier une analyse" pour commencer</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {videos.map(video => (
                        <div key={video.id} style={{
                            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                            border: '1px solid var(--glass-border)', borderRadius: '14px',
                            padding: '20px', display: 'flex', gap: '18px', alignItems: 'center'
                        }}>
                            {/* Thumbnail */}
                            <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
                            />
                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{
                                    fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)',
                                    marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                }}>
                                    {video.title}
                                </h4>
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Calendar size={12} />
                                        {new Date(video.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MessageCircle size={12} /> {video.commentCount} commentaire{video.commentCount !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <a
                                    href={video.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: 'rgba(46, 144, 250, 0.15)', color: 'var(--accent-cyan)',
                                        border: 'none', cursor: 'pointer', textDecoration: 'none'
                                    }}
                                >
                                    <ExternalLink size={16} />
                                </a>
                                <button
                                    onClick={() => handleDelete(video.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444',
                                        border: 'none', cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DailyVideoManagement
