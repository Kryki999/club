import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClubMap from '../components/ClubMap';
import './ReservationPage.css';

function ReservationPage({ onOpenReservation }) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialEventId = queryParams.get('eventId');
    const initialEventName = queryParams.get('eventName');

    const [selectedEvent, setSelectedEvent] = useState(initialEventId ? { id: initialEventId, name: initialEventName || 'Event' } : null);

    // Reset scroll position to top on page mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Update state if location changes
    useEffect(() => {
        const eventId = queryParams.get('eventId');
        const eventName = queryParams.get('eventName');
        if (eventId) {
            setSelectedEvent({ id: eventId, name: eventName || 'Event' });
        } else {
            // Optional: Redirect to home or show error if no event selected
            // navigate('/');
        }
    }, [location.search]);

    if (!selectedEvent) {
        return (
            <div className="reservation-page">
                <div className="reservation-container">
                    <div className="no-event-selected">
                        <h2>Nie wybrano wydarzenia</h2>
                        <p>Wróć na stronę główną i wybierz wydarzenie z listy.</p>
                        <button className="primary-btn" onClick={() => navigate('/')}>
                            Powrót do strony głównej
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reservation-page">
            <div className="reservation-header">
                <h1>Rezerwacja Loży</h1>
                <p>Zapewnij sobie najlepsze miejsce w klubie</p>
            </div>

            <div className="reservation-container">
                <div className="booking-interface">
                    <div className="selected-event-card">
                        <div className="event-info">
                            <span>Wybrane wydarzenie:</span>
                            <h3>{selectedEvent.name}</h3>
                            {selectedEvent.date && <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>}
                        </div>
                        <button className="secondary-btn" onClick={onOpenReservation}>
                            Zmień wydarzenie
                        </button>
                    </div>

                    <div className="map-wrapper">
                        <ClubMap eventId={selectedEvent.id} eventName={selectedEvent.name} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReservationPage;
