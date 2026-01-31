import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReservationPage from './pages/ReservationPage';
import EventPickerModal from './components/EventPickerModal';
import CheckoutModal from './components/CheckoutModal';
import { CartProvider } from './context/CartContext';

function AppContent() {
  const navigate = useNavigate();
  const [isEventPickerOpen, setIsEventPickerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleOpenReservation = () => {
    setIsEventPickerOpen(true);
  };

  const handleSelectEvent = (event) => {
    setIsEventPickerOpen(false);
    navigate(`/reservation?eventId=${event.id}&eventName=${encodeURIComponent(event.name)}&eventDate=${encodeURIComponent(event.date || '')}&eventImage=${encodeURIComponent(event.image ? `${process.env.REACT_APP_STRAPI_API_URL || 'http://localhost:1337'}${event.image}` : '')}`);
  };

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <div className="App">
      <Navigation onOpenReservation={handleOpenReservation} onOpenCheckout={handleOpenCheckout} />
      <Routes>
        <Route path="/" element={<HomePage onOpenReservation={handleOpenReservation} onOpenCheckout={handleOpenCheckout} />} />
        <Route path="/reservation" element={<ReservationPage onOpenReservation={handleOpenReservation} onOpenCheckout={handleOpenCheckout} />} />
      </Routes>
      <Footer />

      <EventPickerModal
        isOpen={isEventPickerOpen}
        onSelectEvent={handleSelectEvent}
        onClose={() => setIsEventPickerOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
