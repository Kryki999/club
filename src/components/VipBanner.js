import React from 'react';
import './VipBanner.css';

function VipBanner({ onOpenReservation }) {
    return (
        <section
            className="vip-banner"
            style={{
                backgroundImage: `url('/vipbanner.jpg')`
            }}
        >
            <div className="vip-overlay"></div>
            <div className="vip-content">
                <h1 className="vip-title">Loża VIP</h1>
                <h2 className="vip-subtitle">Wyjątkowe Doznania</h2>
                <p className="vip-description">
                    Odkryj world ekskluzywnej rozrywki w naszej luksusowej loży
                </p>
                <button onClick={onOpenReservation} className="vip-button">Zarezerwuj Lożę</button>
            </div>
        </section>
    );
}

export default VipBanner;
