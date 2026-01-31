import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './EventPickerModal.css';

const EventPickerModal = ({ isOpen, onSelectEvent, onClose }) => {
    const { cart } = useCart();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchEvents();
        }
    }, [isOpen]);

    // TESTOWE DANE - bez podłączania Strapi
    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Mock data dla demo - 2 wydarzenia
            const mockEvents = [
                {
                    id: 1,
                    name: 'OSTRÓDA FOLK FESTIVAL – Górale na Mazurach!',
                    date: '2026-05-17T20:00:00Z',
                    image: '/folk.png'
                },
                {
                    id: 2,
                    name: 'Summer Vibes',
                    date: '2026-06-22T21:00:00Z',
                    image: '/letnia5.jpg'
                }
            ];

            // Symulacja opóźnienia
            await new Promise(resolve => setTimeout(resolve, 500));
            setEvents(mockEvents);
        } catch (err) {
            console.error('❌ Błąd pobierania wydarzeń:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Oryginalny kod fetch ze Strapi (zakomentowany)
    /*
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
    */

    const normalizeEventId = (id) => id ? String(id) : null;

    const handleEventClick = (event) => {
        console.log('🔍 EventPickerModal - handleEventClick:', {
            eventId: event.id,
            eventName: event.name,
            cartEventId: cart.eventId,
            cartEventName: cart.eventName,
            hasCartItems: !!cart.eventId
        });

        // Check if cart has items
        if (cart.eventId) {
            const cartEventId = normalizeEventId(cart.eventId);
            const clickedEventId = normalizeEventId(event.id);

            // Check by ID first, then by name as fallback
            const isSameById = cartEventId === clickedEventId;
            const isSameByName = cart.eventName && event.name &&
                cart.eventName.toLowerCase().trim() === event.name.toLowerCase().trim();
            const isSameEvent = isSameById || isSameByName;

            console.log('🔍 Comparison:', {
                cartEventId,
                clickedEventId,
                isSameById,
                isSameByName,
                isSameEvent
            });

            if (isSameEvent) {
                // Same event - proceed to reservation without alert
                console.log('✅ Same event - allowing selection');
                setAlertMessage(null);
                // Use cart's eventId if matched by name to ensure consistency
                const eventToPass = isSameByName && !isSameById
                    ? { ...event, id: cart.eventId }
                    : event;
                console.log('📤 Passing event with id:', eventToPass.id);
                onSelectEvent(eventToPass);
            } else {
                // Different event - show error
                console.log('❌ Different event - blocking selection');
                setAlertMessage({
                    type: 'error',
                    text: `Masz już produkty z "${cart.eventName}" w koszyku. Usuń je lub przejdź do płatności aby zarezerwować lożę na inne wydarzenie.`
                });
            }
        } else {
            // Empty cart - allow selection
            console.log('✅ Empty cart - allowing selection');
            setAlertMessage(null);
            onSelectEvent(event);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="event-picker-overlay" onClick={onClose}>
            <div className="event-picker-content" onClick={e => e.stopPropagation()}>
                <button className="event-picker-close" onClick={onClose}>&times;</button>
                <h2 className="event-picker-title">Wybierz wydarzenie</h2>
                <p className="event-picker-subtitle">Wybierz datę, aby zobaczyć dostępne loże</p>

                {alertMessage && (
                    <div className={`event-picker-alert event-picker-alert-${alertMessage.type}`}>
                        <span>{alertMessage.text}</span>
                        {alertMessage.type === 'error' && (
                            <button
                                className="alert-close-btn"
                                onClick={() => setAlertMessage(null)}
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}

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
                                    onClick={() => handleEventClick(event)}
                                >
                                    {event.image && (
                                        <img
                                            src={event.image}
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
