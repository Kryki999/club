import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { RiStarFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './ReviewsSection.css';

function ReviewsSection() {
    const reviews = [
        {
            id: 1,
            author: "Jan Kowalski",
            rating: 5,
            text: "Świetne miejsce! Atmosfera jest niesamowita, a obsługa bardzo profesjonalna. Na pewno wrócę!"
        },
        {
            id: 2,
            author: "Anna Nowak",
            rating: 5,
            text: "Najlepszy klub w okolicy! Muzyka, drinki i ludzie - wszystko na najwyższym poziomie."
        },
        {
            id: 3,
            author: "Piotr Wiśniewski",
            rating: 5,
            text: "Bardzo dobra lokalizacja i świetna muzyka. Atmosfera jest po prostu niesamowita!"
        },
        {
            id: 4,
            author: "Magdalena Kaczmarek",
            rating: 5,
            text: "Najlepsze miejsce na imprezy w Ostródzie! Obsługa na najwyższym poziomie."
        },
        {
            id: 5,
            author: "Tomasz Zieliński",
            rating: 5,
            text: "Świetne drinki i muzyka. Atmosfera jest po prostu magiczna!"
        }
    ];

    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, index) => (
            <RiStarFill
                key={index}
                className={`star ${index < rating ? 'filled' : ''}`}
            />
        ));
    };

    return (
        <section className="reviews-section">
            <h2 className="reviews-title">Opinie</h2>
            <div className="reviews-container">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    loop={true}
                    spaceBetween={30}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{
                        el: '.custom-reviews-pagination',
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    navigation={true}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="reviews-swiper"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review.id}>
                            <div className="review-card">
                                <div className="review-name">{review.author}</div>
                                <div className="review-stars">
                                    {renderStars(review.rating)}
                                </div>
                                <p className="review-text">{review.text}</p>
                                <div className="review-opinion">
                                    <span className="opinion-text">OPINIA</span>
                                    <FcGoogle className="google-icon" />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    <div className="custom-reviews-pagination"></div>
                </Swiper>
            </div>
        </section>
    );
}

export default ReviewsSection; 