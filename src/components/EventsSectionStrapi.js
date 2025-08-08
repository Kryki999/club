import React, { useState, useEffect } from 'react';
import { RiFacebookFill } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './EventsSection.css';

function EventsSectionStrapi() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStrapiEvents = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_STRAPI_API_URL}/events?populate=*`);
                const data = await response.json();
                const formattedEvents = data.data.map((event) => ({
                    id: event.id,
                    title: event.attributes.title,
                    date: new Date(event.attributes.date).toLocaleDateString('pl-PL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }),
                    image: event.attributes.image.data.attributes.url,
                    description: event.attributes.description,
                    ticketUrl: event.attributes.ticketUrl,
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Błąd pobierania wydarzeń z Strapi:', error);
                setError(error.message);
                // Fallback: Hardcoded dane
                setEvents([
                    {
                        id: 1,
                        title: 'Mocny Piątek',
                        date: '10.05.2025',
                        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=350&h=500',
                    },
                    {
                        id: 2,
                        title: 'Sobotni Melanż',
                        date: '11.05.2025',
                        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=350&h=500',
                    },
                    {
                        id: 3,
                        title: 'Impreza Otwarcia',
                        date: '17.05.2025',
                        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=350&h=500',
                    },
                    {
                        id: 4,
                        title: 'Summer Vibes',
                        date: '18.05.2025',
                        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=350&h=500',
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchStrapiEvents();
    }, []);

    if (loading) {
        return (
            <section className="events-section">
                <div className="events-header">
                    <h2 className="events-title">WYDARZENIA</h2>
                    <a href="/kalendarz" className="events-button">
                        <RiFacebookFill />
                        Kalendarz Wydarzeń
                    </a>
                </div>
                <div className="events-container">
                    <div className="loading">Ładowanie wydarzeń...</div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="events-section">
                <div className="events-header">
                    <h2 className="events-title">WYDARZENIA</h2>
                    <a href="/kalendarz" className="events-button">
                        <RiFacebookFill />
                        Kalendarz Wydarzeń
                    </a>
                </div>
                <div className="events-container">
                    <div className="error">Błąd ładowania wydarzeń: {error}</div>
                </div>
            </section>
        );
    }

    return (
        <section className="events-section">
            <div className="events-header">
                <h2 className="events-title">WYDARZENIA</h2>
                <a href="/kalendarz" className="events-button">
                    <RiFacebookFill />
                    Kalendarz Wydarzeń
                </a>
            </div>
            <div className="events-container">
                <div className="container">
                    <div className="wrapper">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            loop={true}
                            spaceBetween={30}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                el: ".custom-swiper-pagination",
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            navigation={true}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                        >
                            {events.map((event) => (
                                <SwiperSlide key={event.id}>
                                    <div className="card">
                                        <div className="card-image">
                                            <img src={event.image} alt={event.title} />
                                        </div>
                                        <div className="card-content">
                                            <h3 className="card-title">{event.title}</h3>
                                            <p className="card-date">{event.date}</p>
                                            <div className="card-footer">
                                                <button className="card-button">
                                                    {event.ticketUrl ? (
                                                        <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                                                            Kup bilet
                                                        </a>
                                                    ) : (
                                                        'Kup bilet'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                            {/* Kontener na paginację wewnątrz Swiper */}
                            <div className="custom-swiper-pagination"></div>
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EventsSectionStrapi; 