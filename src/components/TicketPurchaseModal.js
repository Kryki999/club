import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useKeyPress } from '../hooks/useKeyPress';
import EventInfoCard from './EventInfoCard';
import './TicketPurchaseModal.css';

const TicketPurchaseModal = ({ isOpen, onClose, eventName, eventId, eventDate, eventImage, ticketPrice = 50, onOpenCheckout }) => {
    const { addTicket, cart } = useCart();
    const navigate = useNavigate();

    // Check if user already has tickets for this event in cart
    const normalizeEventId = (id) => id ? String(id) : null;
    const existingTickets = cart.ticket &&
        normalizeEventId(cart.eventId) === normalizeEventId(eventId)
        ? cart.ticket
        : null;

    const [quantity, setQuantity] = useState(existingTickets ? existingTickets.quantity : 1);
    const [error, setError] = useState('');

    // Sync quantity with cart when modal opens or cart changes
    React.useEffect(() => {
        if (isOpen) {
            const currentTickets = cart.ticket &&
                normalizeEventId(cart.eventId) === normalizeEventId(eventId)
                ? cart.ticket
                : null;
            setQuantity(currentTickets ? currentTickets.quantity : 1);
        }
    }, [isOpen, cart, eventId]);

    // Lock body scroll when modal is open
    useBodyScrollLock(isOpen);

    // Close modal on ESC key
    useKeyPress('Escape', onClose, isOpen);

    if (!isOpen) return null;

    const totalPrice = quantity * ticketPrice;

    const handleMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handlePlus = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        const result = addTicket(eventId, {
            ticketTypeId: 'standard',
            name: `Bilet standard - ${eventName}`,
            quantity,
            unitPrice: ticketPrice,
            totalAmount: totalPrice
        }, eventName, eventImage, eventDate);

        if (result.success) {
            onClose();
            setError('');
        } else {
            setError(result.error);
        }
    };

    const handleCheckout = () => {
        const result = addTicket(eventId, {
            ticketTypeId: 'standard',
            name: `Bilet standard - ${eventName}`,
            quantity,
            unitPrice: ticketPrice,
            totalAmount: totalPrice
        }, eventName, eventImage, eventDate);

        if (result.success) {
            onClose();
            if (onOpenCheckout) {
                onOpenCheckout();
            }
        } else {
            setError(result.error);
        }
    };

    const handleLoungeRedirect = () => {
        // First add tickets to cart
        const result = addTicket(eventId, {
            ticketTypeId: 'standard',
            name: `Bilet standard - ${eventName}`,
            quantity,
            unitPrice: ticketPrice,
            totalAmount: totalPrice
        }, eventName, eventImage, eventDate);

        if (result.success) {
            onClose();
            // Redirect to reservation page with map
            navigate(`/reservation?eventId=${eventId}&eventName=${encodeURIComponent(eventName)}&eventDate=${encodeURIComponent(eventDate || '')}&eventImage=${encodeURIComponent(eventImage || '')}`);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="ticket-modal-overlay" onClick={onClose}>
            <div className="ticket-modal-content" onClick={e => e.stopPropagation()}>
                <button className="ticket-modal-close" onClick={onClose}>&times;</button>

                <div className="ticket-modal-header">
                    <h2>Kup bilety</h2>
                </div>

                <div className="ticket-modal-body">
                    {/* Event Info Card */}
                    <EventInfoCard
                        eventName={eventName}
                        eventDate={eventDate ? new Date(eventDate).toLocaleDateString('pl-PL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }) : ''}
                        eventImage={eventImage}
                    />

                    <div className="ticket-counter-section">
                        <span className="ticket-label">BILETY</span>
                        <div className="counter-controls">
                            <button className="counter-btn" onClick={handleMinus} disabled={quantity === 1}>-</button>
                            <span className="quantity-display">{quantity}</span>
                            <button className="counter-btn" onClick={handlePlus}>+</button>
                        </div>
                        <div className="ticket-price">
                            <span className="price-value">{totalPrice} PLN</span>
                        </div>
                    </div>

                    {error && (
                        <div className="modal-error-banner">
                            <div className="error-icon">⚠️</div>
                            <div className="error-text">{error}</div>
                            <button className="error-close" onClick={() => setError('')}>×</button>
                        </div>
                    )}
                </div>

                <div className="ticket-modal-actions">
                    {/* Primary CTA */}
                    <button className="btn-pay" onClick={handleCheckout}>
                        💳 Przejdź do płatności
                    </button>

                    {/* Secondary Actions */}
                    <div className="ticket-secondary-actions">
                        <button className="btn-cart" onClick={handleAddToCart}>
                            Dodaj do koszyka
                        </button>
                        <button className="btn-lounge-redirect" onClick={handleLoungeRedirect}>
                            💎 + Loża VIP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketPurchaseModal;
