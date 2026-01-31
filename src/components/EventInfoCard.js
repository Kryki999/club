import React from 'react';
import { MdLocationOn } from 'react-icons/md';
import './EventInfoCard.css';

const EventInfoCard = ({ eventName, eventDate, eventImage }) => {
    console.log('🖼️ EventInfoCard - received:', { eventName, eventDate, eventImage });

    return (
        <div className="event-info-card">
            <div className="event-info-image">
                <img
                    src={eventImage || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=200&h=200'}
                    alt={eventName}
                />
            </div>
            <div className="event-info-details">
                <h3 className="event-info-name">{eventName}</h3>
                {eventDate && (
                    <div className="event-info-date">{eventDate}</div>
                )}
                <div className="event-info-venue">
                    <MdLocationOn className="venue-icon" />
                    <span>Letnia Strefa Ostróda</span>
                </div>
                <div className="event-info-address">
                    Słowackiego 38A, 14-100 Ostróda
                </div>
            </div>
        </div>
    );
};

export default EventInfoCard;
