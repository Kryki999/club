import React, { useState, useEffect, useCallback } from 'react';
import { RiFacebookFill, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
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

  // Embla Carousel setup
  const isSingle = events.length === 1;
  const isDouble = events.length === 2;
  const isFew = events.length <= 2;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: !isFew,
    align: isFew ? 'center' : 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 1 },
      '(min-width: 1024px)': { slidesToScroll: 1 }
    }
  }, [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]);

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
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

  }, [emblaApi, onSelect, events]);

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
          <div className={`wrapper embla-wrapper ${isFew ? 'embla-wrapper--few' : ''}`}>
            <div className="embla" ref={emblaRef}>
              <div className={`embla__container ${isFew ? 'embla__container--center' : ''}`}>
                {events.map((event) => (
                  <div
                    className={`embla__slide ${isSingle ? 'embla__slide--single' : ''} ${isDouble ? 'embla__slide--double' : ''}`}
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
                          <button className="card-button">Kup bilet</button>
                          <Link
                            to={`/reservation?eventId=${event.id}&eventName=${encodeURIComponent(event.title)}`}
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
    </section>
  );
}

export default EventsSection;