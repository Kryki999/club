import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './TicketPurchaseModal.css';

const TicketPurchaseModal = ({ isOpen, onClose, eventId, eventName, ticketPrice = 50 }) => {
    const [quantity, setQuantity] = useState(1);
    const { setTickets, cart } = useCart();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const total = quantity * ticketPrice;

    const handleAddToCart = () => {
        setTickets(eventId, eventName, quantity, ticketPrice);
        // We don't close, we might show a "Go to Cart" or something
    };

    const handleGoToLounge = () => {
        setTickets(eventId, eventName, quantity, ticketPrice);
        onClose();
        navigate(`/reservation?eventId=${eventId}&eventName=${encodeURIComponent(eventName)}`);
    };

    const handleCheckout = () => {
        setTickets(eventId, eventName, quantity, ticketPrice);
        // Direct checkout logic here (Phase 1 placeholder)
        alert(`Inicjowanie płatności za ${quantity} biletów. Razem: ${total} PLN`);
        onClose();
    };

    return (
        <div className="ticket-modal-overlay" onClick={onClose}>
            <div className="ticket-modal-content" onClick={e => e.stopPropagation()}>
                <button className="ticket-modal-close" onClick={onClose}>&times;</button>

                <div className="ticket-modal-header">
                    <h2>Kup Bilety</h2>
                    <p className="event-name">{eventName}</p>
                </div>

                <div className="ticket-modal-body">
                    <div className="price-info">
                        <span className="label">Cena biletu:</span>
                        <span className="value">{ticketPrice} PLN</span>
                    </div>

                    <div className="quantity-control">
                        <span className="label">Ilość:</span>
                        <div className="counter">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    <div className="total-info">
                        <span className="label">Razem:</span>
                        <span className="value-total">{total} PLN</span>
                    </div>
                </div>

                <div className="ticket-modal-actions">
                    <button className="btn-secondary" onClick={handleGoToLounge}>
                        Chcę zarezerwować lożę
                    </button>
                    <button className="btn-primary" onClick={handleCheckout}>
                        Przejdź do płatności
                    </button>
                </div>

                <div className="cart-feedback">
                    <button className="btn-link" onClick={handleAddToCart}>
                        Dodaj bilet do koszyka i kontynuuj przeglądanie
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketPurchaseModal;
