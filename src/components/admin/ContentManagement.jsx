import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { BookOpen, CheckCircle2, Clock, Gem, Plus, Star, Trash2, XCircle } from 'lucide-react';

const ContentManagement = () => {
    const [contents, setContents] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingContent, setEditingContent] = useState(null)
    const [creatingContent, setCreatingContent] = useState(false)
    const [filters, setFilters] = useState({
        level: 'all',
        type: 'all',
        category: 'all'
    })

    useEffect(() => {
        fetchContents()
    }, [filters])

    const fetchContents = async () => {
        try {
            setLoading(true)
            const params = {}
            if (filters.level !== 'all') params.level = filters.level
            if (filters.type !== 'all') params.type = filters.type
            if (filters.category !== 'all') params.category = filters.category

            const response = await api.get('/admin/content', { params })
            setContents(response.data.data)
        } catch (error) {
            console.error('Erreur chargement content:', error)
            alert('Erreur lors du chargement du contenu')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setCreatingContent(true)
        setEditingContent({
            title: '',
            slug: '',
            type: 'video',
            level: 'free',
            category: 'trading',
            description: '',
            content: '',
            thumbnail: '',
            duration: '',
            modules: [],
            tags: [],
            published: true
        })
    }

    const handleEdit = (content) => {
        setCreatingContent(false)
        setEditingContent({ ...content })
    }

    const handleSave = async () => {
        try {
            if (creatingContent) {
                await api.post('/admin/content', editingContent)
                alert('Contenu créé avec succès')
            } else {
                await api.put(`/admin/content/${editingContent.id}`, editingContent)
                alert('Contenu mis à jour avec succès')
            }
            setEditingContent(null)
            setCreatingContent(false)
            fetchContents()
        } catch (error) {
            console.error('Erreur save content:', error)
            alert(error.response?.data?.error || 'Erreur lors de l\'enregistrement')
        }
    }

    const handleDelete = async (contentId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return

        try {
            await api.delete(`/admin/content/${contentId}`)
            alert('Contenu supprimé avec succès')
            fetchContents()
        } catch (error) {
            console.error('Erreur delete content:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const getTypeIcon = (type) => {
        const icons = {
            video: '🎥',
            article: '📄',
            formation: <BookOpen size={16} />,
            signal: '📡',
            webinar: '🎤'
        }
        return icons[type] || '📄'
    }

    const getLevelBadge = (level) => {
        const badges = {
            free: { icon: '🆓', color: 'var(--text-tertiary)' },
            premium: { icon: <Star size={16} />, color: 'var(--accent-gold)' },
            vip: { icon: <Gem size={16} />, color: 'var(--accent-blue)' }
        }
        const badge = badges[level] || badges.free
        return (
            <span className="level-badge" style={{ background: badge.color }}>
                {badge.icon} {level.toUpperCase()}
            </span>
        )
    }

    return (
        <div className="content-management">
            <div className="management-header">
                <h2><BookOpen size={22} /> Gestion du Contenu</h2>
                <button onClick={handleCreate} className="btn-create">➕ Nouveau Contenu</button>
            </div>

            {/* Filtres */}
            <div className="filters-bar">
                <select
                    value={filters.level}
                    onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                    className="filter-select"
                >
                    <option value="all">Tous les niveaux</option>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                </select>
                <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="filter-select"
                >
                    <option value="all">Tous les types</option>
                    <option value="video">Vidéo</option>
                    <option value="article">Article</option>
                    <option value="formation">Formation</option>
                    <option value="signal">Signal</option>
                    <option value="webinar">Webinaire</option>
                </select>
                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="filter-select"
                >
                    <option value="all">Toutes les catégories</option>
                    <option value="trading">Trading</option>
                    <option value="web3">Web3</option>
                    <option value="memecoin">Memecoin</option>
                </select>
            </div>

            {loading ? (
                <div className="loading">Chargement du contenu...</div>
            ) : (
                <div className="content-grid">
                    {contents.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun contenu trouvé avec ces filtres</p>
                        </div>
                    ) : (
                        contents.map(content => (
                            <div key={content.id} className="content-card">
                                <div className="content-header">
                                    <span className="content-type">{getTypeIcon(content.type)} {content.type}</span>
                                    {getLevelBadge(content.level)}
                                </div>
                                <h3 className="content-title">{content.title}</h3>
                                <p className="content-description">{content.description}</p>
                                <div className="content-meta">
                                    <span>📁 {content.category}</span>
                                    {content.duration && <span><Clock size={14} /> {content.duration}</span>}
                                    <span>{content.published ? <><CheckCircle2 size={14} /> Publié</> : <><XCircle size={14} /> Brouillon</>}</span>
                                </div>
                                <div className="content-actions">
                                    <button onClick={() => handleEdit(content)} className="btn-edit">✏️ Modifier</button>
                                    <button onClick={() => handleDelete(content.id)} className="btn-delete">🗑️</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal d'édition/création */}
            {editingContent && (
                <div className="modal-overlay" onClick={() => {
                    setEditingContent(null)
                    setCreatingContent(false)
                }}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{creatingContent ? '➕ Nouveau Contenu' : '✏️ Modifier le Contenu'}</h3>
                            <button onClick={() => {
                                setEditingContent(null)
                                setCreatingContent(false)
                            }} className="btn-close">✖</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group flex-2">
                                    <label>Titre *</label>
                                    <input
                                        type="text"
                                        value={editingContent.title}
                                        onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                                        className="form-input"
                                        placeholder="Titre du contenu"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Slug</label>
                                    <input
                                        type="text"
                                        value={editingContent.slug}
                                        onChange={(e) => setEditingContent({ ...editingContent, slug: e.target.value })}
                                        className="form-input"
                                        placeholder="titre-du-contenu"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type *</label>
                                    <select
                                        value={editingContent.type}
                                        onChange={(e) => setEditingContent({ ...editingContent, type: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="video">Vidéo</option>
                                        <option value="article">Article</option>
                                        <option value="formation">Formation</option>
                                        <option value="signal">Signal</option>
                                        <option value="webinar">Webinaire</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Niveau *</label>
                                    <select
                                        value={editingContent.level}
                                        onChange={(e) => setEditingContent({ ...editingContent, level: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="free">Free</option>
                                        <option value="premium">Premium</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Catégorie</label>
                                    <select
                                        value={editingContent.category}
                                        onChange={(e) => setEditingContent({ ...editingContent, category: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="trading">Trading</option>
                                        <option value="web3">Web3</option>
                                        <option value="memecoin">Memecoin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editingContent.description}
                                    onChange={(e) => setEditingContent({ ...editingContent, description: e.target.value })}
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Description du contenu..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Contenu (URL ou HTML)</label>
                                <textarea
                                    value={editingContent.content}
                                    onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                                    className="form-textarea"
                                    rows="4"
                                    placeholder="https://www.youtube.com/embed/... ou <h2>HTML...</h2>"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Durée (ex: 15:30)</label>
                                    <input
                                        type="text"
                                        value={editingContent.duration}
                                        onChange={(e) => setEditingContent({ ...editingContent, duration: e.target.value })}
                                        className="form-input"
                                        placeholder="15:30"
                                    />
                                </div>
                                <div className="form-group flex-2">
                                    <label>Miniature (URL)</label>
                                    <input
                                        type="text"
                                        value={editingContent.thumbnail}
                                        onChange={(e) => setEditingContent({ ...editingContent, thumbnail: e.target.value })}
                                        className="form-input"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* Modules - uniquement pour les formations */}
                            {editingContent.type === 'formation' && (
                                <div className="form-group" style={{ marginBottom: '20px' }}>
                                    <label style={{ marginBottom: '8px', display: 'block', fontWeight: '700' }}>
                                        <BookOpen size={14} style={{ marginRight: '6px' }} />
                                        Modules de la formation
                                    </label>
                                    <p style={{ color: 'var(--text-secondary, #888)', fontSize: '13px', marginBottom: '12px', marginTop: 0 }}>
                                        Chaque module a un titre et une URL YouTube embed. L'ordre determine la progression.
                                    </p>

                                    {(editingContent.modules || []).map((mod, index) => {
                                        const modTitle = typeof mod === 'string' ? mod : (mod.title || '');
                                        const modVideoUrl = typeof mod === 'string' ? '' : (mod.videoUrl || '');

                                        return (
                                            <div key={index} style={{
                                                display: 'flex',
                                                gap: '8px',
                                                marginBottom: '8px',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{
                                                    color: 'var(--accent-blue, #2E90FA)',
                                                    fontWeight: '800',
                                                    minWidth: '28px',
                                                    fontSize: '14px',
                                                    textAlign: 'center'
                                                }}>
                                                    #{index + 1}
                                                </span>
                                                <input
                                                    type="text"
                                                    value={modTitle}
                                                    onChange={(e) => {
                                                        const newModules = [...(editingContent.modules || [])];
                                                        if (typeof newModules[index] === 'string') {
                                                            newModules[index] = { id: `mod-${Date.now()}-${index}`, title: e.target.value, videoUrl: '', order: index };
                                                        } else {
                                                            newModules[index] = { ...newModules[index], title: e.target.value };
                                                        }
                                                        setEditingContent({ ...editingContent, modules: newModules });
                                                    }}
                                                    className="form-input"
                                                    placeholder="Titre du module"
                                                    style={{ flex: 1 }}
                                                />
                                                <input
                                                    type="text"
                                                    value={modVideoUrl}
                                                    onChange={(e) => {
                                                        const newModules = [...(editingContent.modules || [])];
                                                        if (typeof newModules[index] === 'string') {
                                                            newModules[index] = { id: `mod-${Date.now()}-${index}`, title: newModules[index], videoUrl: e.target.value, order: index };
                                                        } else {
                                                            newModules[index] = { ...newModules[index], videoUrl: e.target.value };
                                                        }
                                                        setEditingContent({ ...editingContent, modules: newModules });
                                                    }}
                                                    className="form-input"
                                                    placeholder="https://www.youtube.com/embed/..."
                                                    style={{ flex: 1 }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newModules = (editingContent.modules || []).filter((_, i) => i !== index);
                                                        newModules.forEach((m, i) => { if (typeof m !== 'string') m.order = i; });
                                                        setEditingContent({ ...editingContent, modules: newModules });
                                                    }}
                                                    className="btn-delete"
                                                    style={{ padding: '8px', minWidth: '36px' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newModules = [...(editingContent.modules || [])];
                                            newModules.push({
                                                id: `mod-${Date.now()}`,
                                                title: '',
                                                videoUrl: '',
                                                order: newModules.length
                                            });
                                            setEditingContent({ ...editingContent, modules: newModules });
                                        }}
                                        className="btn-edit"
                                        style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <Plus size={14} /> Ajouter un module
                                    </button>
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Publié</label>
                                    <select
                                        value={editingContent.published}
                                        onChange={(e) => setEditingContent({ ...editingContent, published: e.target.value === 'true' })}
                                        className="form-select"
                                    >
                                        <option value="true">Oui</option>
                                        <option value="false">Brouillon</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => {
                                setEditingContent(null)
                                setCreatingContent(false)
                            }} className="btn-cancel">Annuler</button>
                            <button onClick={handleSave} className="btn-save">💾 Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ContentManagement
