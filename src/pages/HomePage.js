import React from 'react';
import Banner from '../components/Banner';
import MarqueeBanner from '../components/MarqueeBanner';
import ServicesSection from '../components/ServicesSection';
import EventsSection from '../components/EventsSection';
import InstagramSection from '../components/InstagramSection';
import VipBanner from '../components/VipBanner';
import AboutSection from '../components/AboutSection';
import ReviewsSection from '../components/ReviewsSection';
import LocationSection from '../components/LocationSection';

function HomePage({ onOpenReservation }) {
    return (
        <div className="HomePage">
            <Banner />
            <EventsSection />
            <ServicesSection />
            <InstagramSection />
            <MarqueeBanner />
            <VipBanner onOpenReservation={onOpenReservation} />
            <AboutSection />
            <ReviewsSection />
            <LocationSection />
        </div>
    );
}

export default HomePage;
