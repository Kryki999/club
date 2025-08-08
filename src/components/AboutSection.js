import React from 'react';
import { RiPhoneFill } from 'react-icons/ri';
import letniaAboutImage from '../assets/letniaabout.jpg';
import './AboutSection.css';

function AboutSection() {
    return (
        <section className="about-section">
            <div className="about-container">
                <div className="about-content">
                    <div className="about-text">
                        <h2 className="about-title">LETNIA STRZEFA - NAJLEPSZY KLUB W OSTRÓDZIE</h2>
                        <div className="about-description">
                            <p>
                                Witaj w Letniej Strefie. Najlepszy klub w Ostródzie zaprasza wymagających.
                                Jeśli szukasz stylowego, wysmakowanego miejsca, w którym jest wszystko najlepsze,
                                co może zaoferować Ostróda nocą, to jesteś we właściwym miejscu.
                            </p>
                            <p>
                                Szalony wieczór panieński lub kawalerski, elegancki event firmowy,
                                a może urodziny w klubie? Każda okazja jest dobra, by rozsmakować się
                                w rozrywce z najwyższej półki.
                            </p>
                        </div>
                        <div className="about-contact">
                            <div className="contact-header">
                                <h3>Skontaktuj się z nami</h3>
                                <div className="phone-number">
                                    <RiPhoneFill />
                                    <span>+48 723 235 555</span>
                                </div>
                            </div>
                            <button className="call-button">
                                <RiPhoneFill />
                                ZADZWOŃ
                            </button>
                        </div>
                    </div>
                    <div className="about-image">
                        <img
                            src={letniaAboutImage}
                            alt="Letnia Strefa Ostróda"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutSection; 