import React from 'react';
import './ContactSection.css';

const ContactSection = () => {
    return (
        <section className="contact-section">
            <h2 className="contact-title">Kontakt</h2>
            <div className="contact-container">
                <div className="contact-info">
                    <div className="contact-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <h3>Adres</h3>
                        <p>ul. Przykładowa 123</p>
                        <p>00-000 Warszawa</p>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <h3>Telefon</h3>
                        <p>+48 123 456 789</p>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-envelope"></i>
                        <h3>Email</h3>
                        <p>kontakt@klub.pl</p>
                    </div>
                </div>
                <form className="contact-form">
                    <input type="text" placeholder="Imię i nazwisko" required />
                    <input type="email" placeholder="Email" required />
                    <textarea placeholder="Wiadomość" required></textarea>
                    <button type="submit">Wyślij</button>
                </form>
            </div>
        </section>
    );
};

export default ContactSection; 