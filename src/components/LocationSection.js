import React from 'react';
import { RiMapPinLine, RiFacebookFill, RiInstagramFill } from 'react-icons/ri';
import { FaTiktok } from 'react-icons/fa';
import './LocationSection.css';

const LocationSection = () => {
    return (
        <section className="location-section">
            <div className="location-overlay">
                <h2 className="location-title">MAPA DOJAZDU</h2>
            </div>
            <div className="map-container">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2380.095964393019!2d19.95096467699319!3d53.69696415837013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd4e2e2e2e2e2f%3A0x2e2e2e2e2e2e2e2e!2sS%C5%82owackiego%2038A%2C%2014-100%20Ostr%C3%B3da!5e0!3m2!1spl!2spl!4v1710000000000!5m2!1spl!2spl"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokalizacja na mapie"
                />
            </div>
            <div className="location-footer">
                <div className="location-info">
                    <div className="address-item">
                        <RiMapPinLine className="location-icon" />
                        <div className="address-text">
                            <span className="address-street">Słowackiego 38A</span>
                            <span className="address-city">14-100 Ostróda</span>
                        </div>
                    </div>
                </div>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <RiFacebookFill />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <RiInstagramFill />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
                        <FaTiktok />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default LocationSection; 