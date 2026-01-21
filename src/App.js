import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReservationPage from './pages/ReservationPage';
import EventPickerModal from './components/EventPickerModal';

function AppContent() {
  const navigate = useNavigate();
  const [isEventPickerOpen, setIsEventPickerOpen] = useState(false);

  const handleOpenReservation = () => {
    setIsEventPickerOpen(true);
  };

  const handleSelectEvent = (event) => {
    setIsEventPickerOpen(false);
    navigate(`/reservation?eventId=${event.id}&eventName=${encodeURIComponent(event.name)}`);
  };

  return (
    <div className="App">
      <Navigation onOpenReservation={handleOpenReservation} />
      <Routes>
        <Route path="/" element={<HomePage onOpenReservation={handleOpenReservation} />} />
        <Route path="/reservation" element={<ReservationPage onOpenReservation={handleOpenReservation} />} />
      </Routes>
      <Footer />

      <EventPickerModal
        isOpen={isEventPickerOpen}
        onSelectEvent={handleSelectEvent}
        onClose={() => setIsEventPickerOpen(false)}
      />
    </div>
  );
}

import { CartProvider } from './context/CartContext';

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
