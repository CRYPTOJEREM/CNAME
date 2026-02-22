import React, { useState, useEffect } from 'react'
import api from '../../services/api'

const ContestManagement = () => {
    const [participants, setParticipants] = useState([])
    const [winners, setWinners] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('participants')
    const [drawing, setDrawing] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [partRes, winRes] = await Promise.all([
                api.get('/admin/contest/participants'),
                api.get('/admin/contest/winners')
            ])
            setParticipants(partRes.data.data || [])
            setWinners(winRes.data.data || [])
        } catch (error) {
            console.error('Erreur chargement concours:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDraw = async () => {
        if (!confirm(`Lancer le tirage au sort pour cette semaine ?\n\n${participants.length} participant(s) eligible(s).`)) return

        try {
            setDrawing(true)
            const response = await api.post('/admin/contest/draw')
            const winner = response.data.data
            alert(`Gagnant : ${winner.userName}\nEmail : ${winner.userEmail}\nBitunix UID : ${winner.bitunixUid}`)
            fetchData()
        } catch (error) {
            alert(error.response?.data?.error || 'Erreur lors du tirage')
        } finally {
            setDrawing(false)
        }
    }

    const handleNotify = async (winnerId) => {
        try {
            await api.put(`/admin/contest/winners/${winnerId}/notify`)
            fetchData()
        } catch (error) {
            alert('Erreur lors de la notification')
        }
    }

    const formatWeek = (start, end) => {
        const s = new Date(start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        const e = new Date(end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        return `${s} - ${e}`
    }

    if (loading) return <div className="loading">Chargement...</div>

    return (
        <div className="contest-management">
            <div className="management-header">
                <h2>Concours Hebdomadaire $1,000</h2>
                <button onClick={fetchData} className="btn-refresh">Actualiser</button>
            </div>

            <div className="admin-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                    className={`admin-nav-btn ${activeTab === 'participants' ? 'active' : ''}`}
                    onClick={() => setActiveTab('participants')}
                >
                    Participants ({participants.length})
                </button>
                <button
                    className={`admin-nav-btn ${activeTab === 'winners' ? 'active' : ''}`}
                    onClick={() => setActiveTab('winners')}
                >
                    Historique gagnants ({winners.length})
                </button>
            </div>

            {activeTab === 'participants' && (
                <>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ color: '#ccc' }}>
                            {participants.length} utilisateur(s) avec un Bitunix UID = eligible(s) au tirage.
                            <br />
                            <small style={{ color: '#999' }}>Condition : le compte Bitunix doit etre actif (trading).</small>
                        </p>
                        <button
                            onClick={handleDraw}
                            disabled={drawing || participants.length === 0}
                            className="btn btn-primary"
                            style={{ padding: '12px 24px', fontSize: '16px' }}
                        >
                            {drawing ? 'Tirage en cours...' : 'Lancer le tirage'}
                        </button>
                    </div>

                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Bitunix UID</th>
                                    <th>Telegram</th>
                                    <th>Statut</th>
                                    <th>Inscription</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.bitunixUid}</td>
                                        <td>{user.telegramUsername || '-'}</td>
                                        <td>
                                            <span className="status-badge" style={{ color: user.subscriptionStatus === 'vip' ? '#2E90FA' : user.subscriptionStatus === 'premium' ? '#FBBF24' : '#888' }}>
                                                {user.subscriptionStatus.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                                    </tr>
                                ))}
                                {participants.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                            Aucun participant eligible. Les utilisateurs doivent avoir un Bitunix UID.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'winners' && (
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Semaine</th>
                                <th>Gagnant</th>
                                <th>Email</th>
                                <th>Bitunix UID</th>
                                <th>Prix</th>
                                <th>Notifie</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {winners.map(w => (
                                <tr key={w.id}>
                                    <td>{formatWeek(w.weekStart, w.weekEnd)}</td>
                                    <td>{w.userName}</td>
                                    <td>{w.userEmail}</td>
                                    <td>{w.bitunixUid}</td>
                                    <td style={{ color: '#2E90FA', fontWeight: 'bold' }}>${w.prize}</td>
                                    <td>
                                        {w.notified ? (
                                            <span className="badge-success">Oui</span>
                                        ) : (
                                            <span className="badge-warning">Non</span>
                                        )}
                                    </td>
                                    <td>
                                        {!w.notified && (
                                            <button
                                                onClick={() => handleNotify(w.id)}
                                                className="btn-edit"
                                                title="Marquer comme notifie"
                                            >
                                                Notifier
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {winners.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        Aucun tirage effectue pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ContestManagement
