import React, { useState, useEffect } from 'react';
import { RiInstagramFill } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                        el: '.custom-instagram-pagination',
                    }}
                    loop={true}
                    className="instagram-swiper"
                >
                    {instagramPosts.map((post) => (
                        <SwiperSlide key={post.id}>
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
                        </SwiperSlide>
                    ))}
                    <div className="custom-instagram-pagination"></div>
                </Swiper>
            </div>
        </section>
    );
}

export default InstagramSection; 