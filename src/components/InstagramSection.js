import React, { useState, useEffect, useCallback } from 'react';
import { RiInstagramFill, RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import './InstagramSection.css';

function InstagramSection() {
    // Zdjęcia z Instagrama @letniastrefaostroda
    const [instagramPosts, setInstagramPosts] = useState([
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=500",
            link: "https://www.instagram.com/letniastrefaostroda/"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=500",
            link: "https://www.instagram.com/letniastrefaostroda/"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=500",
            link: "https://www.instagram.com/letniastrefaostroda/"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=500",
            link: "https://www.instagram.com/letniastrefaostroda/"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=500",
            link: "https://www.instagram.com/letniastrefaostroda/"
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=500",
            link: "https://www.instagram.com/letniastrefaostroda/"
        },
        {
            id: 7,
            image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=500",
            link: "https://www.instagram.com/letniastrefaostroda/"
        },
        {
            id: 8,
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&h=500",
            link: "https://www.instagram.com/letniastrefaostroda/"
        }
    ]);

    // Embla Carousel setup
    const isSingle = instagramPosts.length === 1;
    const isDouble = instagramPosts.length === 2;
    const isFew = instagramPosts.length <= 2;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: !isFew,
        align: isFew ? 'center' : 'start',
        slidesToScroll: 1,
        breakpoints: {
            '(min-width: 640px)': { slidesToScroll: 1 },
            '(min-width: 768px)': { slidesToScroll: 1 },
            '(min-width: 1024px)': { slidesToScroll: 1 }
        }
    }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

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

        // Re-init when posts change
        emblaApi.reInit();

        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('reInit', () => setScrollSnaps(emblaApi.scrollSnapList()));
    }, [emblaApi, onSelect, instagramPosts]);

    // Pobieranie danych z Strapi - galerias
    useEffect(() => {
        const fetchInstagramPosts = async () => {
            try {
                const response = await fetch('http://localhost:1337/api/galerias?populate=*');
                const data = await response.json();

                if (Array.isArray(data)) {
                    const formattedPosts = data.map((post) => ({
                        id: post.id,
                        image: post.Zdjecie?.url
                            ? `http://localhost:1337${post.Zdjecie.url}`
                            : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=500",
                        link: "https://www.instagram.com/letniastrefaostroda/"
                    }));
                    setInstagramPosts(formattedPosts);
                } else if (data.data && Array.isArray(data.data)) {
                    const formattedPosts = data.data.map((post) => ({
                        id: post.id,
                        image: post.Zdjecie?.url
                            ? `http://localhost:1337${post.Zdjecie.url}`
                            : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&h=500",
                        link: "https://www.instagram.com/letniastrefaostroda/"
                    }));
                    setInstagramPosts(formattedPosts);
                }
            } catch (error) {
                console.error('Błąd pobierania zdjęć z galerii:', error);
                // Pozostawiam hardcoded dane w przypadku błędu
            }
        };

        fetchInstagramPosts();
    }, []);

    return (
        <section className="instagram-section">
            <div className="instagram-header">
                <h2 className="instagram-title">INSTAGRAM</h2>
                <a
                    href="https://www.instagram.com/letniastrefaostroda/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instagram-button"
                >
                    <RiInstagramFill />
                    Przejdź na Instagram
                </a>
            </div>
            <div className="instagram-container">
                <div className={`wrapper instagram-wrapper ${isFew ? 'instagram-wrapper--few' : ''}`}>
                    <div className="embla" ref={emblaRef}>
                        <div className={`embla__container ${isFew ? 'embla__container--center' : ''}`}>
                            {instagramPosts.map((post) => (
                                <div
                                    className={`embla__slide ${isSingle ? 'embla__slide--single' : ''} ${isDouble ? 'embla__slide--double' : ''}`}
                                    key={post.id}
                                >
                                    <a
                                        href={post.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="instagram-card"
                                    >
                                        <div className="instagram-image">
                                            <img src={post.image} alt="Instagram post" />
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    {instagramPosts.length > 2 && (
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
                    {instagramPosts.length > 1 && (
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
        </section>
    );
}

export default InstagramSection; 