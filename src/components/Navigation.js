import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone } from 'react-icons/fi';
import { RiInstagramFill } from 'react-icons/ri';
import { AiFillFacebook, AiFillTikTok } from 'react-icons/ai';
import './Navigation.css';

function Navigation({ onOpenReservation }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleReservationClick = (e) => {
        if (e) e.preventDefault();
        setIsMenuOpen(false); // Close mobile menu if open
        onOpenReservation();
    };

    return (
        <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>

            <div className="nav-brand">
                <Link to="/">Letnia Strefa</Link>
            </div>

            <div className="nav-mobile-right">
                <a href="https://instagram.com" className="nav-social" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <RiInstagramFill size={28} />
                </a>
                <a href="https://facebook.com" className="nav-social" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <AiFillFacebook size={28} />
                </a>
                <a href="https://tiktok.com" className="nav-social" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <AiFillTikTok size={28} />
                </a>
                <a href="tel:+48753333456" className="nav-button phone">
                    <FiPhone className="phone-icon" />
                    <span className="phone-text">+48 753 333 456</span>
                    <span className="phone-rezerwuj">REZERWUJ</span>
                </a>
                <button className="hamburger" onClick={toggleMenu}>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </button>
            </div>

            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <button className="close-mobile-menu" onClick={toggleMenu} aria-label="Zamknij menu" style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: 32, color: '#fff', cursor: 'pointer', zIndex: 1002 }}>&times;</button>
                <Link to="/" className="mobile-link" onClick={toggleMenu}>Home</Link>
                <a href="/#wydarzenia" className="mobile-link" onClick={toggleMenu}>Wydarzenia</a>
                <a
                    href="#rezerwacja"
                    className="mobile-link"
                    onClick={handleReservationClick}
                >
                    Rezerwacja Loży
                </a>
                <a href="/#galeria" className="mobile-link" onClick={toggleMenu}>Galeria</a>
                <a href="/#kontakt" className="mobile-link" onClick={toggleMenu}>Kontakt</a>
            </div>
        </nav>
    );
}

export default Navigation; 