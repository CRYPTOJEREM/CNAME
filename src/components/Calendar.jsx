
import React, { useState, useEffect } from 'react'

const Calendar = () => {
    const [eventsByDay, setEventsByDay] = useState({})
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchCalendarData = async () => {
        setRefreshing(true)
        try {
            // Calculer la date de début (aujourd'hui) et de fin (dans 7 jours)
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);

            const formatDate = (date) => date.toISOString().split('T')[0];
            const d1 = formatDate(today);
            const d2 = formatDate(nextWeek);

            // Utilisation de l'API Trading Economics (gratuite - guest:guest)
            const url = `https://api.tradingeconomics.com/calendar/country/united%20states?c=guest:guest&d1=${d1}&d2=${d2}&f=json`;
            console.log('Fetching calendar data from:', url);

            const response = await fetch(url);
            const events = await response.json();

            if (!events || events.length === 0) {
                // Fallback to static data if API fails or returns empty (common with guest key sometimes)
                console.warn("No events from API, using fallback would be ideal here if strictly needed.");
                // For now let's just show empty or handle it gracefull.
                // Actually, let's inject some dummy data if empty for demo purposes if the API key limit is hit.
                // But for now, let's stick to the logic.
            }

            // Grouper par jour
            const grouped = {};
            if (events && Array.isArray(events)) {
                events.forEach(event => {
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
        } catch (error) {
            console.error('Erreur API Calendrier:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchCalendarData();
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
                <h1 style={{ color: '#FFFFFF' }}>News de la Semaine</h1>
                <div className="subtitle" style={{ color: '#00D9FF', fontSize: '16px', fontWeight: 600 }}>Événements économiques majeurs (USA)</div>
                <button
                    id="refresh-calendar-btn"
                    className="btn btn-secondary"
                    style={{ marginTop: '20px', display: 'inline-block' }}
                    onClick={fetchCalendarData}
                    disabled={refreshing}
                >
                    {refreshing ? '🔄 Actualisation...' : '🔄 Actualiser'}
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#7B8BA8' }}>Chargement du calendrier...</div>
            ) : Object.keys(eventsByDay).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#7B8BA8' }}>Aucun événement majeur trouvé pour cette semaine (ou limite API atteinte).</div>
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
                                            <span className="data-value" style={{ fontWeight: 'bold', color: '#00D9FF' }}>{event.actual}</span>
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
