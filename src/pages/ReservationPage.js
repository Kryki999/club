import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClubMap from '../components/ClubMap';
import EventInfoCard from '../components/EventInfoCard';
import './ReservationPage.css';

function ReservationPage({ onOpenReservation, onOpenCheckout }) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const initialEventId = queryParams.get('eventId');
    const initialEventName = queryParams.get('eventName');
    const initialEventDate = queryParams.get('eventDate');
    const initialEventImage = queryParams.get('eventImage');

    const [selectedEvent, setSelectedEvent] = useState(initialEventId ? {
        id: initialEventId,
        name: initialEventName || 'Event',
        date: initialEventDate,
        image: initialEventImage
    } : null);

    // Reset scroll position to top on page mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Update state if location changes
    useEffect(() => {
        const eventId = queryParams.get('eventId');
        const eventName = queryParams.get('eventName');
        const eventDate = queryParams.get('eventDate');
        const eventImage = queryParams.get('eventImage');

        console.log('🔍 ReservationPage - URL params:', {
            eventId,
            eventName,
            eventDate,
            eventImage
        });

        if (eventId) {
            setSelectedEvent({
                id: eventId,
                name: eventName || 'Event',
                date: eventDate,
                image: eventImage
            });
        } else {
            // Optional: Redirect to home or show error if no event selected
            // navigate('/');
        }
    }, [queryParams]);

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
                    <div className="event-section">
                        <EventInfoCard
                            eventName={selectedEvent.name}
                            eventDate={selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString('pl-PL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) : ''}
                            eventImage={selectedEvent.image}
                        />

                        <button className="change-event-btn" onClick={onOpenReservation}>
                            Zmień wydarzenie
                        </button>
                    </div>

                    <div className="map-legend">
                        <div className="legend-item">
                            <div className="legend-color legend-available"></div>
                            <span>Wolne</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color legend-pending"></div>
                            <span>W trakcie rezerwacji</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color legend-reserved"></div>
                            <span>Zarezerwowane</span>
                        </div>
                    </div>

                    <div className="map-wrapper">
                        <ClubMap
                            eventId={selectedEvent.id}
                            eventName={selectedEvent.name}
                            eventDate={selectedEvent.date}
                            eventImage={selectedEvent.image}
                            onOpenCheckout={onOpenCheckout}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReservationPage;
