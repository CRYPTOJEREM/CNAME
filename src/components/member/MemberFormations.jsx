/**
 * MemberFormations - Formations progressives avec deblocage sequentiel
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import memberService from '../../services/memberService';
import { BookOpen, CheckCircle, ChevronLeft, Gem, GraduationCap, Lock, Play, Star } from 'lucide-react';

const MemberFormations = () => {
    const { user } = useAuth();
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        loadFormations();
    }, []);

    const loadFormations = async () => {
        try {
            const response = await memberService.getFormations();
            setFormations(response.formations || []);
        } catch (error) {
            console.error('Erreur chargement formations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormationClick = async (formationId) => {
        try {
            const response = await memberService.getFormationById(formationId);
            setSelectedFormation(response.formation);

            // Auto-sélectionner le premier module disponible
            const modules = response.formation.modules || [];
            const firstUnlocked = modules.find(m => m.unlocked && !m.completed);
            const firstModule = firstUnlocked || modules.find(m => m.unlocked) || modules[0];

            if (firstModule) {
                setActiveModule(firstModule.id);
            }
        } catch (error) {
            console.error('Erreur chargement formation:', error);
        }
    };

    const handleModuleComplete = async (formationId, moduleId) => {
        setCompleting(true);
        try {
            const response = await memberService.completeFormationModule(formationId, moduleId);
            if (response.success) {
                setSelectedFormation(response.formation);
                // Trouver le prochain module debloque
                const modules = response.formation.modules || [];
                const currentIndex = modules.findIndex(m => m.id === moduleId);
                const nextModule = modules[currentIndex + 1];
                if (nextModule && nextModule.unlocked) {
                    setActiveModule(nextModule.id);
                }
            }
        } catch (error) {
            console.error('Erreur completion module:', error);
        } finally {
            setCompleting(false);
        }
    };

    const getLevelBadge = (level) => {
        const badges = {
            free: { icon: null, label: 'GRATUIT', color: 'var(--text-secondary)' },
            premium: { icon: <Star size={14} />, label: 'PREMIUM', color: 'var(--accent-gold)' },
            vip: { icon: <Gem size={14} />, label: 'VIP', color: 'var(--accent-blue)' }
        };
        return badges[level] || badges.free;
    };

    if (loading) {
        return <div style={{ color: 'var(--text-primary)', textAlign: 'center', padding: '40px' }}>Chargement...</div>;
    }

    // ==========================================
    // VUE DETAILLEE - Formation avec timeline
    // ==========================================
    if (selectedFormation) {
        const badge = getLevelBadge(selectedFormation.level);
        const modules = selectedFormation.modules || [];
        const progress = selectedFormation.progress || { completed: 0, total: 0, percentage: 0 };
        const currentModule = activeModule ? modules.find(m => m.id === activeModule) : null;

        return (
            <div>
                {/* Bouton retour */}
                <button
                    onClick={() => { setSelectedFormation(null); setActiveModule(null); }}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text-secondary)',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '25px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                    <ChevronLeft size={18} /> Retour aux formations
                </button>

                {/* Header formation + progression globale */}
                <div style={{
                    background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                    borderRadius: '20px',
                    padding: '30px',
                    border: '2px solid rgba(191, 90, 242, 0.3)',
                    marginBottom: '25px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px', fontWeight: '900', marginBottom: '8px', margin: 0 }}>
                                {selectedFormation.title}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: '8px 0 0 0' }}>
                                {selectedFormation.description}
                            </p>
                        </div>
                        <div style={{
                            background: badge.color,
                            color: 'var(--text-on-accent)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            marginLeft: '15px'
                        }}>
                            {badge.icon} {badge.label}
                        </div>
                    </div>

                    {/* Barre de progression globale */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                {progress.completed}/{progress.total} modules termines
                            </span>
                            <span style={{
                                color: progress.percentage === 100 ? '#34D399' : 'var(--accent-blue)',
                                fontWeight: '700'
                            }}>
                                {progress.percentage}%
                            </span>
                        </div>
                        <div style={{
                            height: '8px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.08)',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                borderRadius: '4px',
                                background: progress.percentage === 100
                                    ? 'linear-gradient(90deg, #34D399, #10B981)'
                                    : 'linear-gradient(90deg, #2E90FA, #A855F7)',
                                width: `${progress.percentage}%`,
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Layout principal : timeline + video */}
                <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>

                    {/* Colonne gauche : Timeline des modules */}
                    <div style={{ flex: '0 0 340px', minWidth: '280px' }}>
                        <h3 style={{
                            color: 'var(--text-primary)',
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <BookOpen size={18} /> Parcours d'apprentissage
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {modules.map((mod, index) => {
                                const isActive = activeModule === mod.id;
                                const isClickable = mod.unlocked;

                                return (
                                    <div key={mod.id} style={{ display: 'flex', gap: '15px' }}>
                                        {/* Cercle + ligne verticale */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                                            <div
                                                onClick={() => isClickable && setActiveModule(mod.id)}
                                                style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '50%',
                                                    background: mod.completed
                                                        ? 'linear-gradient(135deg, #34D399, #10B981)'
                                                        : mod.unlocked
                                                            ? isActive
                                                                ? 'linear-gradient(135deg, #2E90FA, #A855F7)'
                                                                : 'linear-gradient(135deg, rgba(46, 144, 250, 0.3), rgba(168, 85, 247, 0.3))'
                                                            : 'rgba(255,255,255,0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: mod.completed || mod.unlocked ? '#fff' : 'rgba(255,255,255,0.3)',
                                                    fontWeight: '800',
                                                    fontSize: '14px',
                                                    cursor: isClickable ? 'pointer' : 'default',
                                                    transition: 'all 0.3s',
                                                    border: isActive ? '2px solid #2E90FA' : '2px solid transparent',
                                                    boxShadow: isActive ? '0 0 15px rgba(46, 144, 250, 0.4)' : 'none'
                                                }}
                                            >
                                                {mod.completed ? <CheckCircle size={20} /> : mod.unlocked ? index + 1 : <Lock size={16} />}
                                            </div>
                                            {/* Ligne connectrice */}
                                            {index < modules.length - 1 && (
                                                <div style={{
                                                    width: '2px',
                                                    height: '35px',
                                                    background: mod.completed
                                                        ? 'linear-gradient(180deg, #10B981, rgba(255,255,255,0.08))'
                                                        : 'rgba(255,255,255,0.08)',
                                                    transition: 'all 0.3s'
                                                }} />
                                            )}
                                        </div>

                                        {/* Info module */}
                                        <div
                                            onClick={() => isClickable && setActiveModule(mod.id)}
                                            style={{
                                                cursor: isClickable ? 'pointer' : 'default',
                                                opacity: mod.unlocked ? 1 : 0.4,
                                                paddingBottom: index < modules.length - 1 ? '15px' : '0',
                                                flex: 1,
                                                background: isActive ? 'rgba(46, 144, 250, 0.08)' : 'transparent',
                                                borderRadius: '10px',
                                                padding: '10px 12px',
                                                transition: 'all 0.2s',
                                                marginTop: '-2px'
                                            }}
                                        >
                                            <div style={{
                                                color: isActive ? '#2E90FA' : 'var(--text-primary)',
                                                fontSize: '14px',
                                                fontWeight: '700',
                                                marginBottom: '4px'
                                            }}>
                                                {mod.title}
                                            </div>
                                            <div style={{
                                                fontSize: '12px',
                                                color: mod.completed ? '#34D399' : mod.unlocked ? 'var(--text-secondary)' : 'rgba(255,255,255,0.3)',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                {mod.completed ? (
                                                    <><CheckCircle size={12} /> Termine</>
                                                ) : mod.unlocked ? (
                                                    <><Play size={12} /> Disponible</>
                                                ) : (
                                                    <><Lock size={12} /> Verrouille</>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Colonne droite : Lecteur video */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        {currentModule ? (
                            <div style={{
                                background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                                borderRadius: '20px',
                                padding: '25px',
                                border: '2px solid rgba(46, 144, 250, 0.3)'
                            }}>
                                <h3 style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    marginBottom: '20px',
                                    margin: '0 0 20px 0'
                                }}>
                                    {currentModule.title}
                                </h3>

                                {currentModule.videoUrl ? (
                                    <div style={{
                                        position: 'relative',
                                        paddingBottom: '56.25%',
                                        height: 0,
                                        overflow: 'hidden',
                                        borderRadius: '12px',
                                        marginBottom: '20px'
                                    }}>
                                        <iframe
                                            src={currentModule.videoUrl}
                                            title={currentModule.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                border: '2px solid rgba(46, 144, 250, 0.2)',
                                                borderRadius: '12px'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '2px dashed rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        padding: '60px 30px',
                                        textAlign: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <Play size={40} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '12px' }} />
                                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Video bientot disponible</p>
                                    </div>
                                )}

                                {/* Bouton marquer comme vu */}
                                {!currentModule.completed ? (
                                    <button
                                        onClick={() => handleModuleComplete(selectedFormation.id, currentModule.id)}
                                        disabled={completing}
                                        style={{
                                            background: completing
                                                ? 'rgba(255,255,255,0.1)'
                                                : 'linear-gradient(135deg, #34D399, #10B981)',
                                            border: 'none',
                                            color: '#fff',
                                            padding: '14px 28px',
                                            borderRadius: '12px',
                                            fontWeight: '700',
                                            cursor: completing ? 'wait' : 'pointer',
                                            fontSize: '15px',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <CheckCircle size={18} />
                                        {completing ? 'En cours...' : 'Marquer comme vu'}
                                    </button>
                                ) : (
                                    <div style={{
                                        background: 'rgba(52, 211, 153, 0.1)',
                                        border: '2px solid rgba(52, 211, 153, 0.3)',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        color: '#34D399',
                                        fontWeight: '700',
                                        fontSize: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}>
                                        <CheckCircle size={18} /> Module termine !
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                                borderRadius: '20px',
                                padding: '60px 30px',
                                border: '2px solid rgba(255,255,255,0.05)',
                                textAlign: 'center'
                            }}>
                                <Play size={50} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: '15px' }} />
                                <h3 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                                    Selectionnez un module
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                                    Cliquez sur un module debloque dans le parcours pour commencer
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // LISTE DES FORMATIONS - Cards avec progression
    // ==========================================
    return (
        <div>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{
                    color: 'var(--accent-blue)',
                    fontSize: '28px',
                    fontWeight: '900',
                    marginBottom: '10px',
                    textShadow: '0 0 20px rgba(10, 132, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <GraduationCap size={28} /> Mes Formations
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
                    Progressez a votre rythme, module par module
                </p>
            </div>

            {formations.length === 0 ? (
                <div style={{
                    background: 'rgba(20, 20, 40, 0.5)',
                    border: '2px dashed rgba(191, 90, 242, 0.3)',
                    borderRadius: '20px',
                    padding: '60px 40px',
                    textAlign: 'center'
                }}>
                    <GraduationCap size={50} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '15px' }} />
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', marginBottom: '10px' }}>
                        Aucune formation disponible
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px', margin: 0 }}>
                        Il n'y a pas encore de formations pour votre niveau d'abonnement
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '25px'
                }}>
                    {formations.map((formation) => {
                        const badge = getLevelBadge(formation.level);
                        const progress = formation.progress || { completed: 0, total: 0, percentage: 0 };
                        const moduleCount = (formation.modules || []).length;
                        const buttonLabel = progress.percentage === 100
                            ? 'Formation terminee'
                            : progress.completed > 0
                                ? 'Continuer la formation'
                                : 'Commencer la formation';

                        return (
                            <div
                                key={formation.id}
                                onClick={() => handleFormationClick(formation.id)}
                                style={{
                                    background: 'linear-gradient(135deg, #0C0C1D 0%, #141428 100%)',
                                    border: '2px solid rgba(191, 90, 242, 0.3)',
                                    borderRadius: '20px',
                                    padding: '30px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.border = '2px solid rgba(10, 132, 255, 0.5)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.border = '2px solid rgba(191, 90, 242, 0.3)';
                                }}
                            >
                                {/* Badge niveau */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: badge.color,
                                    color: 'var(--text-on-accent)',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    {badge.icon} {badge.label}
                                </div>

                                {/* Icone */}
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '16px',
                                    background: progress.percentage === 100
                                        ? 'linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.2))'
                                        : 'linear-gradient(135deg, rgba(10, 132, 255, 0.2), rgba(191, 90, 242, 0.2))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '18px'
                                }}>
                                    {progress.percentage === 100
                                        ? <CheckCircle size={28} style={{ color: '#34D399' }} />
                                        : <GraduationCap size={28} style={{ color: 'var(--accent-blue)' }} />
                                    }
                                </div>

                                {/* Titre */}
                                <h3 style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    marginBottom: '10px'
                                }}>
                                    {formation.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    marginBottom: '18px'
                                }}>
                                    {formation.description}
                                </p>

                                {/* Modules count */}
                                {moduleCount > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: 'var(--accent-blue)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        marginBottom: '12px'
                                    }}>
                                        <BookOpen size={14} />
                                        <span>{moduleCount} modules</span>
                                    </div>
                                )}

                                {/* Barre de progression */}
                                {progress.total > 0 && (
                                    <div style={{ marginBottom: '18px' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '12px',
                                            marginBottom: '6px'
                                        }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                {progress.completed}/{progress.total}
                                            </span>
                                            <span style={{
                                                color: progress.percentage === 100 ? '#34D399' : 'var(--accent-blue)',
                                                fontWeight: '700'
                                            }}>
                                                {progress.percentage}%
                                            </span>
                                        </div>
                                        <div style={{
                                            height: '5px',
                                            borderRadius: '3px',
                                            background: 'rgba(255,255,255,0.08)',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                borderRadius: '3px',
                                                background: progress.percentage === 100
                                                    ? 'linear-gradient(90deg, #34D399, #10B981)'
                                                    : 'linear-gradient(90deg, #2E90FA, #A855F7)',
                                                width: `${progress.percentage}%`,
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                    </div>
                                )}

                                {/* Bouton */}
                                <button style={{
                                    background: progress.percentage === 100
                                        ? 'rgba(52, 211, 153, 0.15)'
                                        : 'rgba(191, 90, 242, 0.2)',
                                    border: progress.percentage === 100
                                        ? '2px solid rgba(52, 211, 153, 0.4)'
                                        : '2px solid rgba(191, 90, 242, 0.5)',
                                    color: progress.percentage === 100
                                        ? '#34D399'
                                        : 'var(--accent-blue)',
                                    padding: '10px 18px',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'all 0.3s'
                                }}
                                    onMouseOver={(e) => {
                                        e.stopPropagation();
                                        if (progress.percentage !== 100) {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #2E90FA, #A855F7)';
                                            e.currentTarget.style.color = '#fff';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        e.stopPropagation();
                                        if (progress.percentage !== 100) {
                                            e.currentTarget.style.background = 'rgba(191, 90, 242, 0.2)';
                                            e.currentTarget.style.color = 'var(--accent-blue)';
                                        }
                                    }}
                                >
                                    {buttonLabel} {progress.percentage !== 100 ? '→' : ''}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MemberFormations;
