import React, { useState, useEffect } from 'react';
import './EventPickerModal.css';

const EventPickerModal = ({ isOpen, onSelectEvent, onClose }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchEvents();
        }
    }, [isOpen]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.REACT_APP_STRAPI_API_URL || 'http://localhost:1337';
            const response = await fetch(`${apiUrl}/api/wydarzenias/upcoming`);

            if (!response.ok) {
                throw new Error('Nie udało się pobrać wydarzeń');
            }

            const data = await response.json();
            setEvents(data.data || []);
        } catch (err) {
            console.error('❌ Błąd pobierania wydarzeń:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="event-picker-overlay" onClick={onClose}>
            <div className="event-picker-content" onClick={e => e.stopPropagation()}>
                <button className="event-picker-close" onClick={onClose}>&times;</button>
                <h2 className="event-picker-title">Wybierz wydarzenie</h2>
                <p className="event-picker-subtitle">Wybierz datę, aby zobaczyć dostępne loże</p>

                {loading ? (
                    <div className="event-picker-loading">Ładowanie wydarzeń...</div>
                ) : error ? (
                    <div className="event-picker-error">{error}</div>
                ) : (
                    <div className="event-list">
                        {events.length > 0 ? (
                            events.map(event => (
                                <div
                                    key={event.id}
                                    className="event-item"
                                    onClick={() => onSelectEvent(event)}
                                >
                                    {event.image && (
                                        <img
                                            src={`${process.env.REACT_APP_STRAPI_API_URL || 'http://localhost:1337'}${event.image}`}
                                            alt={event.name}
                                            className="event-item-image"
                                        />
                                    )}
                                    <div className="event-item-info">
                                        <h3 className="event-item-name">{event.name}</h3>
                                        <p className="event-item-date">
                                            {new Date(event.date).toLocaleDateString('pl-PL', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <button className="event-item-select">Wybierz</button>
                                </div>
                            ))
                        ) : (
                            <div className="event-empty">Brak nadchodzących wydarzeń</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventPickerModal;
