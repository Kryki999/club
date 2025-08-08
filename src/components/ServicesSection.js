import React from 'react';
import './ServicesSection.css';

function ServicesSection() {
    const services = [
        {
            id: 1,
            text: 'Cocktail Bar'
        },
        {
            id: 2,
            text: 'Eventy Firmowe'
        },
        {
            id: 3,
            text: 'Selekcja najlepszych alkoholi'
        },
        {
            id: 4,
            text: 'Najlepsi artyści w Polsce'
        },
        {
            id: 5,
            text: 'Komfortowe loże'
        },
        {
            id: 6,
            text: 'Strefa VIP'
        },
        {
            id: 7,
            text: 'Najlepsza lokalizacja w Ostródzie'
        }
    ];

    return (
        <section className="services-section">
            <div className="services-container">
                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <span className="service-text">{service.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ServicesSection; 