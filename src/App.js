import React from 'react';
import './App.css';
import Navigation from './components/Navigation';
import Banner from './components/Banner';
import MarqueeBanner from './components/MarqueeBanner';
import ServicesSection from './components/ServicesSection';
import EventsSection from './components/EventsSection';
import InstagramSection from './components/InstagramSection';
import VipBanner from './components/VipBanner';
import AboutSection from './components/AboutSection';
import SponsorsSection from './components/SponsorsSection';
import ReviewsSection from './components/ReviewsSection';
import MenuSection from './components/MenuSection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
function App() {
  return (
    <div className="App">
      <Navigation />
      <Banner />
      <EventsSection />
      <ServicesSection />
      <InstagramSection />
      <MarqueeBanner />
      <VipBanner />
      <AboutSection />
      <ReviewsSection />
      <LocationSection />
      <Footer />
    </div>
  );
}

export default App;
