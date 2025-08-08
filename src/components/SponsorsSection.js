import React from 'react';
import './SponsorsSection.css';

function SponsorsSection() {
    const sponsors = [
        {
            id: 1,
            name: "Partner 1",
            logo: "https://via.placeholder.com/200x100?text=Sponsor+1"
        },
        {
            id: 2,
            name: "Partner 2",
            logo: "https://via.placeholder.com/200x100?text=Sponsor+2"
        },
        {
            id: 3,
            name: "Partner 3",
            logo: "https://via.placeholder.com/200x100?text=Sponsor+3"
        },
    ];

    return (
        <section className="sponsors-section">
            <div className="sponsors-container">
                {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="sponsor-card">
                        <img src={sponsor.logo} alt={sponsor.name} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SponsorsSection; 