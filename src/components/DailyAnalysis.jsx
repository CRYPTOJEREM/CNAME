import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getDailyVideoToday, getDailyVideos, getDailyVideoComments, postDailyVideoComment, deleteDailyVideoComment } from '../services/memberService'
import { TrendingUp, MessageCircle, Send, Trash2, Star, Gem, Calendar, Clock, Play, VideoOff } from 'lucide-react'

function timeAgo(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now - date) / 1000)
    if (seconds < 60) return "À l'instant"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `Il y a ${minutes} min`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Il y a ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
}

const DailyAnalysis = () => {
    const { user } = useAuth()
    const [todayVideo, setTodayVideo] = useState(null)
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [pastVideos, setPastVideos] = useState([])
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        if (selectedVideo) {
            loadComments(selectedVideo.id)
        }
    }, [selectedVideo])

    const loadData = async () => {
        try {
            const [todayRes, archiveRes] = await Promise.all([
                getDailyVideoToday(),
                getDailyVideos()
            ])
            if (todayRes.data) {
                setTodayVideo(todayRes.data)
                setSelectedVideo(todayRes.data)
            }
            if (archiveRes.data) {
                setPastVideos(archiveRes.data)
            }
        } catch (error) {
            console.error('Erreur chargement analyse du jour:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadComments = async (videoId) => {
        try {
            const res = await getDailyVideoComments(videoId)
            if (res.data) setComments(res.data)
        } catch (error) {
            console.error('Erreur chargement commentaires:', error)
        }
    }

    const handleSubmitComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim() || submitting) return
        setSubmitting(true)
        try {
            const res = await postDailyVideoComment(selectedVideo.id, newComment.trim())
            if (res.data) {
                setComments(prev => [...prev, res.data])
                setNewComment('')
            }
        } catch (error) {
            console.error('Erreur envoi commentaire:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteDailyVideoComment(commentId)
            setComments(prev => prev.filter(c => c.id !== commentId))
        } catch (error) {
            console.error('Erreur suppression commentaire:', error)
        }
    }

    const selectVideo = (video) => {
        setSelectedVideo(video)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Chargement...</div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }} className="scroll-reveal">
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(46, 144, 250, 0.15)', border: '1px solid rgba(46, 144, 250, 0.3)',
                        color: 'var(--accent-cyan)', padding: '8px 20px', borderRadius: '50px',
                        fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '20px',
                        textTransform: 'uppercase'
                    }}>
                        <TrendingUp size={16} /> ANALYSE DU JOUR
                    </div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: '800',
                        color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '-0.5px'
                    }}>
                        Votre Recap Marché Quotidien
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.6' }}>
                        Chaque matin, une analyse complète du marché crypto pour commencer la journée.
                    </p>
                </div>

                {/* Vidéo Player */}
                {selectedVideo ? (
                    <div className="scroll-reveal" style={{ marginBottom: '40px' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                            border: '1px solid var(--glass-border)', borderRadius: '20px',
                            overflow: 'hidden'
                        }}>
                            {/* Iframe YouTube 16:9 */}
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                <iframe
                                    src={selectedVideo.embedUrl}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={selectedVideo.title}
                                />
                            </div>

                            {/* Info vidéo */}
                            <div style={{ padding: '25px 30px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        background: 'rgba(46, 144, 250, 0.15)', color: 'var(--accent-cyan)',
                                        padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '600'
                                    }}>
                                        <Calendar size={12} /> {formatDate(selectedVideo.publishedAt)}
                                    </span>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        color: 'var(--text-tertiary)', fontSize: '13px'
                                    }}>
                                        <MessageCircle size={12} /> {selectedVideo.commentCount || comments.length} commentaire{(selectedVideo.commentCount || comments.length) !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                                    {selectedVideo.title}
                                </h2>
                                {selectedVideo.description && (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
                                        {selectedVideo.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div style={{
                        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                        border: '2px dashed var(--glass-border)', borderRadius: '20px',
                        padding: '80px 40px', textAlign: 'center', marginBottom: '40px'
                    }}>
                        <VideoOff size={60} style={{ color: 'var(--text-tertiary)', marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '10px' }}>
                            Aucune analyse disponible
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                            Revenez bientôt pour l'analyse du jour !
                        </p>
                    </div>
                )}

                {/* Section Commentaires */}
                {selectedVideo && (
                    <div className="scroll-reveal" style={{ marginBottom: '50px' }}>
                        <h3 style={{
                            fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)',
                            marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            <MessageCircle size={20} /> Commentaires ({comments.length})
                        </h3>

                        {/* Formulaire commentaire */}
                        <form onSubmit={handleSubmitComment} style={{
                            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                            border: '1px solid var(--glass-border)', borderRadius: '16px',
                            padding: '20px', marginBottom: '25px'
                        }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #2E90FA, #A855F7)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0
                                }}>
                                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Partagez votre avis sur cette analyse..."
                                        maxLength={1000}
                                        style={{
                                            width: '100%', minHeight: '80px', resize: 'vertical',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid var(--glass-border)', borderRadius: '12px',
                                            padding: '14px', color: 'var(--text-primary)', fontSize: '14px',
                                            fontFamily: 'inherit', outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'rgba(46, 144, 250, 0.5)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>
                                            {newComment.length}/1000
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim() || submitting}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                                background: newComment.trim() ? 'linear-gradient(135deg, #2E90FA, #A855F7)' : 'rgba(255,255,255,0.1)',
                                                color: newComment.trim() ? 'white' : 'var(--text-tertiary)',
                                                border: 'none', borderRadius: '10px', padding: '10px 20px',
                                                fontWeight: '600', fontSize: '14px', cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                                                transition: 'all 0.2s', opacity: submitting ? 0.6 : 1
                                            }}
                                        >
                                            <Send size={14} /> {submitting ? 'Envoi...' : 'Publier'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Liste des commentaires */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {comments.length === 0 ? (
                                <div style={{
                                    textAlign: 'center', padding: '40px',
                                    color: 'var(--text-tertiary)', fontSize: '14px'
                                }}>
                                    Aucun commentaire pour le moment. Soyez le premier !
                                </div>
                            ) : (
                                comments.map(comment => (
                                    <div key={comment.id} style={{
                                        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                                        border: '1px solid var(--glass-border)', borderRadius: '14px',
                                        padding: '18px 20px'
                                    }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            {/* Avatar */}
                                            <div style={{
                                                width: '38px', height: '38px', borderRadius: '50%',
                                                background: comment.userSubscription === 'vip'
                                                    ? 'linear-gradient(135deg, #A855F7, #6366F1)'
                                                    : 'linear-gradient(135deg, #2E90FA, #A855F7)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0
                                            }}>
                                                {comment.userName?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                                                        {comment.userName}
                                                    </span>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '2px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: '600',
                                                        background: comment.userSubscription === 'vip' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                                        color: comment.userSubscription === 'vip' ? '#A855F7' : '#FBBF24'
                                                    }}>
                                                        {comment.userSubscription === 'vip' ? <Gem size={10} /> : <Star size={10} />}
                                                        {comment.userSubscription === 'vip' ? 'VIP' : 'Premium'}
                                                    </span>
                                                    <span style={{ color: 'var(--text-tertiary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={10} /> {timeAgo(comment.createdAt)}
                                                    </span>
                                                </div>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                                                    {comment.content}
                                                </p>
                                            </div>
                                            {/* Bouton supprimer (propre commentaire) */}
                                            {comment.userId === user?.id && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        color: 'var(--text-tertiary)', padding: '4px',
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                                    onMouseLeave={(e) => e.target.style.color = 'var(--text-tertiary)'}
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Archive des vidéos passées */}
                {pastVideos.length > 1 && (
                    <div className="scroll-reveal">
                        <h3 style={{
                            fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)',
                            marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            <Play size={20} /> Analyses Précédentes
                        </h3>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '20px'
                        }}>
                            {pastVideos
                                .filter(v => v.id !== selectedVideo?.id)
                                .map(video => (
                                    <div
                                        key={video.id}
                                        onClick={() => selectVideo(video)}
                                        style={{
                                            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
                                            border: '1px solid var(--glass-border)', borderRadius: '16px',
                                            overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)'
                                            e.currentTarget.style.borderColor = 'rgba(46, 144, 250, 0.5)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.borderColor = 'var(--glass-border)'
                                        }}
                                    >
                                        {/* Thumbnail */}
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                                            />
                                            <div style={{
                                                position: 'absolute', inset: 0,
                                                background: 'rgba(0,0,0,0.3)', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    width: '45px', height: '45px', borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.9)', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Play size={20} style={{ color: '#000', marginLeft: '3px' }} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Info */}
                                        <div style={{ padding: '15px 18px' }}>
                                            <div style={{
                                                fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: '600',
                                                marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px'
                                            }}>
                                                <Calendar size={12} />
                                                {new Date(video.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <h4 style={{
                                                fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)',
                                                marginBottom: '6px', lineHeight: '1.3',
                                                overflow: 'hidden', textOverflow: 'ellipsis',
                                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                            }}>
                                                {video.title}
                                            </h4>
                                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MessageCircle size={11} /> {video.commentCount} commentaire{video.commentCount !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DailyAnalysis
