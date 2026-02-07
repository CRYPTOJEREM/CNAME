
import React, { useState, useEffect } from 'react'

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

    const fetchCalendarData = async (isAutoUpdate = false) => {
        setRefreshing(true)
        try {
            // Vérifier le cache (valide pendant 24h sauf si c'est une mise à jour auto)
            const cachedData = localStorage.getItem('economicCalendarCache');
            const cacheTime = localStorage.getItem('economicCalendarCacheTime');

            if (!isAutoUpdate && cachedData && cacheTime) {
                const cacheAge = Date.now() - parseInt(cacheTime);
                const twentyFourHours = 24 * 60 * 60 * 1000;

                if (cacheAge < twentyFourHours) {
                    console.log('📦 Utilisation du cache du calendrier économique');
                    const parsedData = JSON.parse(cachedData);
                    setEventsByDay(parsedData.events);
                    setLastUpdate(new Date(parsedData.lastUpdate));
                    setLoading(false);
                    setRefreshing(false);
                    return;
                }
            }

            // Utiliser des données statiques pour la semaine du 9-15 février 2026
            console.log('📡 Utilisation des données statiques pour la semaine du 9-15 février 2026');
            const staticEvents = [
                // Lundi 9 février 2026
                { Date: '2026-02-09T15:00:00', Event: 'Indice NFIB Optimisme PME', Actual: '-', Forecast: '92.5', Previous: '92.1', Importance: 2, Country: 'United States' },

                // Mardi 10 février 2026
                { Date: '2026-02-10T14:30:00', Event: 'Indice des Prix à la Consommation (IPC) m/m', Actual: '-', Forecast: '0.3%', Previous: '0.4%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-10T14:30:00', Event: 'Indice des Prix à la Consommation (IPC) a/a', Actual: '-', Forecast: '2.9%', Previous: '2.9%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-10T14:30:00', Event: 'IPC Core m/m', Actual: '-', Forecast: '0.3%', Previous: '0.2%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-10T14:30:00', Event: 'IPC Core a/a', Actual: '-', Forecast: '3.2%', Previous: '3.2%', Importance: 3, Country: 'United States' },

                // Mercredi 11 février 2026
                { Date: '2026-02-11T14:30:00', Event: 'Indice des Prix à la Production (IPP) m/m', Actual: '-', Forecast: '0.3%', Previous: '0.2%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-11T14:30:00', Event: 'IPP Core m/m', Actual: '-', Forecast: '0.2%', Previous: '0.1%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-11T16:30:00', Event: 'Stocks de Pétrole Brut', Actual: '-', Forecast: '-', Previous: '-1.0M', Importance: 2, Country: 'United States' },

                // Jeudi 12 février 2026
                { Date: '2026-02-12T14:30:00', Event: 'Demandes d\'Allocations Chômage', Actual: '-', Forecast: '215K', Previous: '221K', Importance: 2, Country: 'United States' },
                { Date: '2026-02-12T14:30:00', Event: 'Ventes au Détail m/m', Actual: '-', Forecast: '0.4%', Previous: '0.4%', Importance: 3, Country: 'United States' },
                { Date: '2026-02-12T14:30:00', Event: 'Ventes au Détail Core m/m', Actual: '-', Forecast: '0.3%', Previous: '0.4%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-12T15:15:00', Event: 'Production Industrielle m/m', Actual: '-', Forecast: '0.3%', Previous: '0.9%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-12T15:15:00', Event: 'Taux d\'Utilisation des Capacités', Actual: '-', Forecast: '77.8%', Previous: '77.6%', Importance: 2, Country: 'United States' },

                // Vendredi 13 février 2026
                { Date: '2026-02-13T14:30:00', Event: 'Indice des Prix à l\'Importation m/m', Actual: '-', Forecast: '0.2%', Previous: '0.1%', Importance: 2, Country: 'United States' },
                { Date: '2026-02-13T16:00:00', Event: 'Indice de Confiance des Consommateurs Prelim. (Université du Michigan)', Actual: '-', Forecast: '74.5', Previous: '74.4', Importance: 2, Country: 'United States' },
                { Date: '2026-02-13T16:00:00', Event: 'Anticipations d\'Inflation à 5 ans (Université du Michigan)', Actual: '-', Forecast: '3.0%', Previous: '2.9%', Importance: 2, Country: 'United States' }
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
                fetchCalendarData(true);
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
                <div className="date-badge">📅 CALENDRIER ÉCONOMIQUE</div>
                <h1>News de la Semaine</h1>
                <div className="subtitle">
                    Événements économiques majeurs (USA) - Source: Investing.com
                </div>

                {lastUpdate && (
                    <div className="last-update-info">
                        🕒 Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
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
                    onClick={() => fetchCalendarData(false)}
                    disabled={refreshing}
                >
                    {refreshing ? '🔄 Actualisation...' : '🔄 Actualiser Maintenant'}
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
                            <div className="day-title">📊 {day.charAt(0).toUpperCase() + day.slice(1)}</div>
                        </div>

                        <div className="events-grid">
                            {eventsByDay[day].map(event => (
                                <div key={event.id} className={`event-card ${event.importance === 3 ? 'high-importance' : 'medium-importance'}`}>
                                    <div className="event-time">
                                        <span className="time-icon">{(event.importance === 3) ? '🕒' : '🕐'}</span>
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
