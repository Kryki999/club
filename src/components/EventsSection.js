import React, { useState, useEffect } from 'react';
import { RiFacebookFill } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './EventsSection.css';
import tymekImg from '../assets/tymek.jpg';
import mrpolskaImg from '../assets/mrpolska2.jpg';
import defaultimg from '../assets/letnia2.jpg';
function EventsSection() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Mocny Piątek',
      date: '10.05.2025',
      image: tymekImg,
    },
    {
      id: 2,
      title: 'Sobotni Melanż',
      date: '11.05.2025',
      image: mrpolskaImg,
    },
    {
      id: 3,
      title: 'Impreza Otwarcia',
      date: '17.05.2025',
      image: defaultimg,
    },
    {
      id: 4,
      title: 'Impreza Otwarcia',
      date: '17.05.2025',
      image: mrpolskaImg,
    },


  ]);

  // Pobieranie danych z Strapi
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/wydarzenias?populate=*');
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedEvents = data.map((event) => ({
            id: event.id,
            title: event.NazwaWydarzenia || 'Brak tytułu',
            date: event.Data
              ? new Date(event.Data).toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              : 'Brak daty',
            image: event.Zdjecie?.url
              ? `http://localhost:1337${event.Zdjecie.url}`
              : 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=350&h=500',
          }));
          setEvents(formattedEvents);
        } else if (data.data && Array.isArray(data.data)) {
          const formattedEvents = data.data.map((event) => ({
            id: event.id,
            title: event.NazwaWydarzenia || 'Brak tytułu',
            date: event.Data
              ? new Date(event.Data).toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              : 'Brak daty',
            image: event.Zdjecie?.url
              ? `http://localhost:1337${event.Zdjecie.url}`
              : 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=350&h=500',
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Błąd pobierania wydarzeń:', error);
        // Pozostawiam hardcoded dane w przypadku błędu
      }
    };

    fetchEvents();
  }, []);

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
              loop={events.length >= 4} // Loop tylko gdy jest 4+ wydarzeń
              spaceBetween={30}
              autoplay={events.length >= 4 ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              } : false} // Autoplay tylko gdy jest 4+ wydarzeń
              pagination={{
                el: ".custom-swiper-pagination",
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={events.length > 1} // Navigation tylko gdy jest więcej niż 1 wydarzenie
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: Math.min(2, events.length) },
                1024: { slidesPerView: Math.min(3, events.length) },
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
                        <button className="card-button">Kup bilet</button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="custom-swiper-pagination"></div>
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventsSection;