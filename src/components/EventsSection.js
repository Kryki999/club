import React, { useState, useEffect, useCallback } from 'react';
import { RiFacebookFill, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import './EventsSection.css';

import TicketPurchaseModal from './TicketPurchaseModal';

function EventsSection({ onOpenCheckout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window width for responsive carousel config
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Embla Carousel setup
  const isMobile = windowWidth < 768;
  const isSingle = events.length === 1;
  const isDouble = events.length === 2;
  const isFew = events.length <= 2;

  // On mobile with 2 events, use 'start' to show one full card
  // On mobile with 1 event, use 'center' to center the single card
  // On desktop, use 'center' for few events, 'start' for many
  let carouselAlign = 'start';
  if (isMobile) {
    carouselAlign = isSingle ? 'center' : 'start';
  } else {
    carouselAlign = isFew ? 'center' : 'start';
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: !isFew,
    align: carouselAlign,
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: false
  }, [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Re-init when events change/resize
    emblaApi.reInit();

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    emblaApi.on('reInit', () => setScrollSnaps(emblaApi.scrollSnapList()));

  }, [emblaApi, onSelect, events, isMobile, isFew, carouselAlign]);

  // TESTOWE DANE - bez podłączania Strapi
  useEffect(() => {
    // Mock data dla demo - 2 wydarzenia
    const mockEvents = [
      {
        id: 1,
        title: '🎶 OSTRÓDA FOLK FESTIVAL – Górale na Mazurach! 🎶',
        rawDate: '2026-05-17T20:00:00Z',
        date: new Date('2026-05-17T20:00:00Z').toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        image: '/folk.png',
      },
      {
        id: 2,
        title: 'Summer Vibes',
        rawDate: '2026-06-22T21:00:00Z',
        date: new Date('2026-06-22T21:00:00Z').toLocaleDateString('pl-PL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        image: '/letnia5.jpg',
      },
    ];

    setLoading(true);
    // Symulacja opóźnienia
    setTimeout(() => {
      console.log('📅 EventsSection - Mock events loaded:', mockEvents);
      setEvents(mockEvents);
      setLoading(false);
    }, 500);
  }, []);

  // Oryginalny kod fetch ze Strapi (zakomentowany)
  /*
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:1337/api/wydarzenias?populate=*');
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedEvents = data.map((event) => ({
            id: event.id,
            title: event.NazwaWydarzenia || 'Brak tytułu',
            rawDate: event.Data || null,
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
            rawDate: event.Data || null,
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
        } else {
          // No events found
          setEvents([]);
        }
      } catch (error) {
        console.error('Błąd pobierania wydarzeń:', error);
        setError('Nie udało się pobrać wydarzeń');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);
  */

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Loading state
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

  // Empty state
  if (events.length === 0) {
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
          <div className="empty-state">
            <div className="empty-state-icon">🎶</div>
            <h3 className="empty-state-title">
              Brak zaplanowanych wydarzeń
            </h3>
            <p className="empty-state-text">
              Aktualnie nie ma zaplanowanych wydarzeń. Zajrzyj tu wkrótce!
            </p>
          </div>
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
          <div className={`wrapper embla-wrapper ${isFew && !isMobile ? 'embla-wrapper--few' : ''}`}>
            <div className="embla" ref={emblaRef}>
              <div className={`embla__container ${isFew && !isMobile ? 'embla__container--center' : ''}`}>
                {events.map((event) => (
                  <div
                    className={`embla__slide ${isSingle && !isMobile ? 'embla__slide--single' : ''} ${isDouble && !isMobile ? 'embla__slide--double' : ''}`}
                    key={event.id}
                  >
                    <div className="card">
                      <div className="card-image">
                        <img src={event.image} alt={event.title} />
                      </div>
                      <div className="card-content">
                        <h3 className="card-title">{event.title}</h3>
                        <p className="card-date">{event.date}</p>
                        <div className="card-footer">
                          <button
                            className="card-button"
                            onClick={() => handleOpenModal(event)}
                          >
                            Kup bilet
                          </button>
                          <Link
                            to={`/reservation?eventId=${event.id}&eventName=${encodeURIComponent(event.title)}&eventDate=${encodeURIComponent(event.rawDate || '')}&eventImage=${encodeURIComponent(event.image || '')}`}
                            className="card-button secondary"
                          >
                            Rezerwacja loży
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            {events.length > 2 && (
              <>
                <button className="embla__button embla__button--prev" onClick={scrollPrev}>
                  <RiArrowLeftSLine />
                </button>
                <button className="embla__button embla__button--next" onClick={scrollNext}>
                  <RiArrowRightSLine />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {events.length > 1 && (
              <div className="embla__dots">
                {scrollSnaps.map((_, index) => (
                  <button
                    key={index}
                    className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
                    onClick={() => scrollTo(index)}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      <TicketPurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventName={selectedEvent?.title}
        eventId={selectedEvent?.id}
        eventDate={selectedEvent?.rawDate}
        eventImage={selectedEvent?.image}
        ticketPrice={50}
        onOpenCheckout={onOpenCheckout}
      />
    </section>
  );
}

export default EventsSection;