import React, { useState, useEffect } from 'react';
import { RiInstagramFill } from 'react-icons/ri';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './InstagramSection.css';

function InstagramSectionStrapi() {
    const [instagramPosts, setInstagramPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStrapiInstagramPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_STRAPI_API_URL}/instagram-posts?populate=*`);
                const data = await response.json();
                const formattedPosts = data.data.map((post) => ({
                    id: post.id,
                    image: post.attributes.image.data.attributes.url,
                    link: post.attributes.link,
                    caption: post.attributes.caption,
                    postDate: post.attributes.postDate,
                }));
                setInstagramPosts(formattedPosts);
            } catch (error) {
                console.error('Błąd pobierania postów z Strapi:', error);
                setError(error.message);
                // Fallback: Hardcoded dane
                const posts = [
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
                ];
                setInstagramPosts(posts);
            } finally {
                setLoading(false);
            }
        };

        fetchStrapiInstagramPosts();
    }, []);

    if (loading) {
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
                    <div className="loading">Ładowanie postów...</div>
                </div>
            </section>
        );
    }

    if (error) {
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
                    <div className="error">Błąd ładowania postów: {error}</div>
                </div>
            </section>
        );
    }

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

export default InstagramSectionStrapi; 