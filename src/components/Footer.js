import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">

                <p className="footer-logo">Letnia Strefa</p>


                <div className="footer-nav">
                    <ul>
                        <li><a href="/wydarzenia">Wydarzenia</a></li>
                        <li><a href="/galeria">Galeria</a></li>
                        <li><a href="/rezerwacja">Rezerwacja Loży</a></li>
                        <li><a href="/kontakt">Kontakt</a></li>
                        <li><a href="/opinie">Opinie</a></li>
                        <li><a href="/dojazd">Dojazd</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-copyright">
                    © 2025 Letnia Strefa. All rights reserved.
                </div>
                <div className="footer-social">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-tiktok"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer; 