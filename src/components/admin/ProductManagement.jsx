import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { CheckCircle2, Gem, Star, XCircle } from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState(null)
    const [creatingProduct, setCreatingProduct] = useState(false)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await api.get('/admin/products')
            setProducts(response.data.data)
        } catch (error) {
            console.error('Erreur chargement products:', error)
            alert('Erreur lors du chargement des produits')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setCreatingProduct(true)
        setEditingProduct({
            name: '',
            slug: '',
            description: '',
            price: '',
            currency: 'EUR',
            duration: 30,
            features: [''],
            level: 'premium',
            active: true
        })
    }

    const handleEdit = (product) => {
        setCreatingProduct(false)
        setEditingProduct({ ...product })
    }

    const handleSave = async () => {
        try {
            if (creatingProduct) {
                await api.post('/admin/products', editingProduct)
                alert('Produit créé avec succès')
            } else {
                await api.put(`/admin/products/${editingProduct.id}`, editingProduct)
                alert('Produit mis à jour avec succès')
            }
            setEditingProduct(null)
            setCreatingProduct(false)
            fetchProducts()
        } catch (error) {
            console.error('Erreur save product:', error)
            alert(error.response?.data?.error || 'Erreur lors de l\'enregistrement')
        }
    }

    const handleDelete = async (productId) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

        try {
            await api.delete(`/admin/products/${productId}`)
            alert('Produit supprimé avec succès')
            fetchProducts()
        } catch (error) {
            console.error('Erreur delete product:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const addFeature = () => {
        setEditingProduct({
            ...editingProduct,
            features: [...editingProduct.features, '']
        })
    }

    const updateFeature = (index, value) => {
        const newFeatures = [...editingProduct.features]
        newFeatures[index] = value
        setEditingProduct({ ...editingProduct, features: newFeatures })
    }

    const removeFeature = (index) => {
        const newFeatures = editingProduct.features.filter((_, i) => i !== index)
        setEditingProduct({ ...editingProduct, features: newFeatures })
    }

    return (
        <div className="product-management">
            <div className="management-header">
                <h2><Gem size={22} /> Gestion des Produits/Abonnements</h2>
                <button onClick={handleCreate} className="btn-create">➕ Nouveau Produit</button>
            </div>

            {loading ? (
                <div className="loading">Chargement des produits...</div>
            ) : (
                <div className="products-grid">
                    {products.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun produit. Créez-en un avec le bouton ci-dessus.</p>
                        </div>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-header">
                                    <h3>{product.name}</h3>
                                    {product.active ? (
                                        <span className="badge-success"><CheckCircle2 size={16} /> Actif</span>
                                    ) : (
                                        <span className="badge-inactive"><XCircle size={16} /> Inactif</span>
                                    )}
                                </div>
                                <div className="product-body">
                                    <div className="product-price">
                                        <span className="price-value">{product.price} {product.currency}</span>
                                        <span className="price-duration">/ {product.duration} jours</span>
                                    </div>
                                    <div className="product-level">
                                        <span className={`level-badge level-${product.level}`}>
                                            {product.level === 'premium' ? <><Star size={16} /> PREMIUM</> : <><Gem size={16} /> VIP</>}
                                        </span>
                                    </div>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-features">
                                        <strong>Fonctionnalités :</strong>
                                        <ul>
                                            {product.features.slice(0, 3).map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                            {product.features.length > 3 && (
                                                <li>... et {product.features.length - 3} autres</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="product-footer">
                                    <button onClick={() => handleEdit(product)} className="btn-edit">✏️ Modifier</button>
                                    <button onClick={() => handleDelete(product.id)} className="btn-delete">🗑️ Supprimer</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Modal d'édition/création */}
            {editingProduct && (
                <div className="modal-overlay" onClick={() => {
                    setEditingProduct(null)
                    setCreatingProduct(false)
                }}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{creatingProduct ? '➕ Nouveau Produit' : '✏️ Modifier le Produit'}</h3>
                            <button onClick={() => {
                                setEditingProduct(null)
                                setCreatingProduct(false)
                            }} className="btn-close">✖</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nom du produit *</label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        className="form-input"
                                        placeholder="Abonnement Premium"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Slug *</label>
                                    <input
                                        type="text"
                                        value={editingProduct.slug}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                                        className="form-input"
                                        placeholder="premium"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editingProduct.description}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Description du produit..."
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Prix *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                        className="form-input"
                                        placeholder="29.99"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Devise</label>
                                    <select
                                        value={editingProduct.currency}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, currency: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Durée (jours)</label>
                                    <input
                                        type="number"
                                        value={editingProduct.duration}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, duration: e.target.value })}
                                        className="form-input"
                                        placeholder="30"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Niveau *</label>
                                    <select
                                        value={editingProduct.level}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, level: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="premium">Premium</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Statut</label>
                                    <select
                                        value={editingProduct.active}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, active: e.target.value === 'true' })}
                                        className="form-select"
                                    >
                                        <option value="true">Actif</option>
                                        <option value="false">Inactif</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Fonctionnalités</label>
                                <div className="features-list">
                                    {editingProduct.features.map((feature, index) => (
                                        <div key={index} className="feature-item">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => updateFeature(index, e.target.value)}
                                                className="form-input"
                                                placeholder="Fonctionnalité..."
                                            />
                                            <button
                                                onClick={() => removeFeature(index)}
                                                className="btn-remove"
                                                type="button"
                                            >
                                                ➖
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={addFeature} className="btn-add-feature" type="button">
                                        ➕ Ajouter une fonctionnalité
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => {
                                setEditingProduct(null)
                                setCreatingProduct(false)
                            }} className="btn-cancel">Annuler</button>
                            <button onClick={handleSave} className="btn-save">💾 Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductManagement
