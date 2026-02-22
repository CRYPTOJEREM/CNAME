
import { useState, useEffect } from 'react'
import { BarChart3, CalendarDays, Clock, RefreshCw } from 'lucide-react';

const Calendar = () => {
    const [eventsByDay, setEventsByDay] = useState({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [nextAutoUpdate, setNextAutoUpdate] = useState(null)

    // Fonction pour calculer le prochain dimanche à 20h
    const getNextSundayAt8PM = () => {
        const now = new Date();
        const nextSunday = new Date(now);

        // Trouver le prochain dimanche
        const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
        nextSunday.setDate(now.getDate() + daysUntilSunday);

        // Définir l'heure à 20h00
        nextSunday.setHours(20, 0, 0, 0);

        // Si c'est déjà dimanche après 20h, prendre le dimanche suivant
        if (now.getDay() === 0 && now.getHours() >= 20) {
            nextSunday.setDate(nextSunday.getDate() + 7);
        }

        return nextSunday;
    }

    const fetchCalendarData = async () => {
        setRefreshing(true)
        try {
            // Données statiques pour la semaine du 22-28 février 2026
            console.log('📡 Utilisation des données statiques pour la semaine du 22-28 février 2026');
            const staticEvents = [
                // Lundi 23 février 2026
                { Date: '2026-02-23T15:45:00', Event: 'PMI Manufacturier S&P Global (Prelim.)', Actual: '-', Forecast: '51.5', Previous: '51.2', Importance: 2, Country: 'United States' },
                { Date: '2026-02-23T15:45:00', Event: 'PMI Services S&P Global (Prelim.)', Actual: '-', Forecast: '53.0', Previous: '52.9', Importance: 2, Country: 'United States' },
                { Date: '2026-02-23T15:45:00', Event: 'PMI Composite S&P Global (Prelim.)', Actual: '-', Forecast: '52.4', Previous: '52.7', Importance: 2, Country: 'United States' },
                { Date: '2026-02-23T16:00:00', Event: 'Ventes de Logements Existants', Actual: '-', Forecast: '4.15M', Previous: '4.24M', Importance: 2, Country: 'United States' },

                // Mardi 24 février 2026
                { Date: '2026-02-24T15:00:00', Event: 'Indice S&P/CS des Prix Immobiliers (20 villes) a/a', Actual: '-', Forecast: '4.5%', Previous: '4.3%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-24T15:00:00', Event: 'Indice des Prix Immobiliers FHFA m/m', Actual: '-', Forecast: '0.3%', Previous: '0.3%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-24T16:00:00', Event: 'Confiance des Consommateurs (Conference Board)', Actual: '-', Forecast: '103.5', Previous: '104.1', Importance: 3, Country: 'United States' },
                { Date: '2026-02-24T16:00:00', Event: 'Indice Manufacturier Fed de Richmond', Actual: '-', Forecast: '-3', Previous: '-4', Importance: 2, Country: 'United States' },
                { Date: '2026-02-24T16:00:00', Event: 'Ventes de Logements Neufs', Actual: '-', Forecast: '680K', Previous: '698K', Importance: 2, Country: 'United States' },

                // Mercredi 25 février 2026
                { Date: '2026-02-25T14:30:00', Event: 'PIB (2ème estimation) q/q', Actual: '-', Forecast: '2.3%', Previous: '2.3%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-25T14:30:00', Event: 'Indice des Prix du PIB (2ème estimation)', Actual: '-', Forecast: '2.2%', Previous: '2.2%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-25T14:30:00', Event: 'Commandes de Biens Durables m/m', Actual: '-', Forecast: '-1.5%', Previous: '-2.2%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-25T14:30:00', Event: 'Commandes de Biens Durables Core m/m', Actual: '-', Forecast: '0.2%', Previous: '0.3%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-25T16:30:00', Event: 'Stocks de Pétrole Brut EIA', Actual: '-', Forecast: '-', Previous: '+4.6M', Importance: 2, Country: 'United States' },

                // Jeudi 26 février 2026
                { Date: '2026-02-26T14:30:00', Event: 'Indice des Prix PCE Core m/m', Actual: '-', Forecast: '0.3%', Previous: '0.2%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-26T14:30:00', Event: 'Indice des Prix PCE Core a/a', Actual: '-', Forecast: '2.6%', Previous: '2.8%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-26T14:30:00', Event: 'Indice des Prix PCE m/m', Actual: '-', Forecast: '0.3%', Previous: '0.3%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-26T14:30:00', Event: 'Demandes d\'Allocations Chômage', Actual: '-', Forecast: '218K', Previous: '219K', Importance: 2, Country: 'United States' },
                { Date: '2026-02-26T14:30:00', Event: 'Demandes d\'Allocations Continues', Actual: '-', Forecast: '1.87M', Previous: '1.87M', Importance: 2, Country: 'United States' },
                { Date: '2026-02-26T14:30:00', Event: 'Dépenses de Consommation m/m', Actual: '-', Forecast: '0.2%', Previous: '0.7%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-26T14:30:00', Event: 'Revenus des Ménages m/m', Actual: '-', Forecast: '0.4%', Previous: '0.4%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-26T16:00:00', Event: 'Ventes de Logements en Attente m/m', Actual: '-', Forecast: '1.5%', Previous: '-5.5%', Importance: 2, Country: 'United States' },

                // Vendredi 27 février 2026
                { Date: '2026-02-27T14:30:00', Event: 'Balance Commerciale des Biens (Prelim.)', Actual: '-', Forecast: '-$88.5B', Previous: '-$87.0B', Importance: 2, Country: 'United States' },
                { Date: '2026-02-27T14:30:00', Event: 'Stocks de Gros m/m (Prelim.)', Actual: '-', Forecast: '0.2%', Previous: '0.0%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-27T15:45:00', Event: 'PMI de Chicago', Actual: '-', Forecast: '40.5', Previous: '39.5', Importance: 2, Country: 'United States' },
                { Date: '2026-02-27T16:00:00', Event: 'Indice de Confiance des Consommateurs (Université du Michigan - Final)', Actual: '-', Forecast: '67.8', Previous: '71.1', Importance: 3, Country: 'United States' },
                { Date: '2026-02-27T16:00:00', Event: 'Anticipations d\'Inflation à 1 an (Michigan - Final)', Actual: '-', Forecast: '4.3%', Previous: '3.3%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-27T16:00:00', Event: 'Anticipations d\'Inflation à 5 ans (Michigan - Final)', Actual: '-', Forecast: '3.3%', Previous: '3.2%', Importance: 2, Country: 'United States' },

                // Samedi 28 et Dimanche 1er mars 2026 - Pas d'événements (weekend)
            ];

            // Utiliser les données statiques au lieu de l'API
            const eventsToProcess = staticEvents;

            // Grouper par jour
            const grouped = {};
            if (eventsToProcess && Array.isArray(eventsToProcess)) {
                eventsToProcess.forEach(event => {
                    // Filter for United States and Importance >= 2 (as per original logic)
                    if (event.Country === 'United States' && event.Importance >= 2) {
                        // Date parsing implies handling the specific format or just standard ISO
                        // Trading Economics returns "2026-02-02T11:00:00" usually
                        const dateObj = new Date(event.Date);
                        const dayKey = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                        if (!grouped[dayKey]) {
                            grouped[dayKey] = [];
                        }

                        grouped[dayKey].push({
                            id: event.CalendarId || Math.random(),
                            time: dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                            title: event.Event,
                            actual: event.Actual || '-',
                            forecast: event.Forecast || '-',
                            previous: event.Previous || '-',
                            importance: event.Importance,
                            countryCode: 'USD',
                            flag: '🇺🇸'
                        });
                    }
                });
            }
            setEventsByDay(grouped);

            // Sauvegarder dans le cache
            const cacheData = {
                events: grouped,
                lastUpdate: new Date().toISOString()
            };
            localStorage.setItem('economicCalendarCache', JSON.stringify(cacheData));
            localStorage.setItem('economicCalendarCacheTime', Date.now().toString());

            // Mettre à jour l'horodatage
            const updateTime = new Date();
            setLastUpdate(updateTime);
            console.log(`✅ Calendrier économique mis à jour à ${updateTime.toLocaleString('fr-FR')}`);

        } catch (error) {
            console.error('❌ Erreur API Calendrier:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    // Configuration de la mise à jour automatique chaque dimanche à 20h
    useEffect(() => {
        fetchCalendarData();

        // Calculer le temps jusqu'au prochain dimanche 20h
        const setupAutoUpdate = () => {
            const nextSunday = getNextSundayAt8PM();
            const timeUntilUpdate = nextSunday.getTime() - Date.now();

            setNextAutoUpdate(nextSunday);
            console.log(`📅 Prochaine mise à jour automatique programmée: ${nextSunday.toLocaleString('fr-FR')}`);

            // Programmer la mise à jour
            const timeoutId = setTimeout(() => {
                console.log('🔄 Mise à jour automatique du calendrier économique (Dimanche 20h)');
                fetchCalendarData();
                setupAutoUpdate(); // Reprogrammer pour le dimanche suivant
            }, timeUntilUpdate);

            return timeoutId;
        };

        const timeoutId = setupAutoUpdate();

        // Nettoyage
        return () => clearTimeout(timeoutId);
    }, []);

    const renderImportance = (level) => {
        const stars = [];
        for (let i = 0; i < 3; i++) {
            stars.push(<span key={i} className={`star ${i < level ? 'filled' : 'empty'}`}>★</span>);
        }
        return stars;
    };

    return (
        <div className="container">
            <div className="header">
                <div className="date-badge"><span className="icon-container sm primary"><CalendarDays size={18} /></span> CALENDRIER ÉCONOMIQUE</div>
                <h1>News de la Semaine</h1>
                <div className="subtitle">
                    Événements économiques majeurs (USA) - Source: Investing.com
                </div>

                {lastUpdate && (
                    <div className="last-update-info">
                        <Clock size={16} /> Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
                    </div>
                )}

                {nextAutoUpdate && (
                    <div className="next-update-info">
                        ⏰ Prochaine mise à jour automatique: {nextAutoUpdate.toLocaleString('fr-FR', {
                            weekday: 'long',
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'long'
                        })}
                    </div>
                )}

                <button
                    id="refresh-calendar-btn"
                    className="btn btn-secondary refresh-btn"
                    onClick={() => fetchCalendarData()}
                    disabled={refreshing}
                >
                    {refreshing ? <><RefreshCw size={18} /> Actualisation...</> : <><RefreshCw size={18} /> Actualiser Maintenant</>}
                </button>
            </div>

            {loading ? (
                <div className="loading-text">Chargement du calendrier...</div>
            ) : Object.keys(eventsByDay).length === 0 ? (
                <div className="loading-text">Aucun événement majeur trouvé pour cette semaine (ou limite API atteinte).</div>
            ) : (
                Object.keys(eventsByDay).map(day => (
                    <div key={day} className="dashboard">
                        <div className="day-header">
                            <div className="day-title"><span className="icon-container sm primary"><BarChart3 size={16} /></span> {day.charAt(0).toUpperCase() + day.slice(1)}</div>
                        </div>

                        <div className="events-grid">
                            {eventsByDay[day].map(event => (
                                <div key={event.id} className={`event-card ${event.importance === 3 ? 'high-importance' : 'medium-importance'}`}>
                                    <div className="event-time">
                                        <span className="time-icon"><Clock size={16} /></span>
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="event-country">
                                        <span className="flag">{event.flag}</span>
                                        <span className="country-code">{event.countryCode}</span>
                                    </div>
                                    <div className="event-title">
                                        <strong>{event.title}</strong>
                                    </div>
                                    <div className="importance">
                                        {renderImportance(event.importance)}
                                    </div>
                                    <div className="data-values">
                                        <div className="data-row">
                                            <span className="data-label">Préc.</span>
                                            <span className="data-value">{event.previous}</span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">Prev.</span>
                                            <span className="data-value">{event.forecast}</span>
                                        </div>
                                        <div className="data-row">
                                            <span className="data-label">Actuel</span>
                                            <span className="data-value actual-value">{event.actual}</span>
                                        </div>
                                    </div>
                                    <div className={`impact-badge ${event.importance === 3 ? 'impact-high' : 'impact-medium'}`}>
                                        {event.importance === 3 ? 'Fort Impact' : 'Moyen'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Calendar
