import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useKeyPress } from '../hooks/useKeyPress';
import EventInfoCard from './EventInfoCard';
import './BookingModal.css';

// Helper to normalize eventId for comparison
const normalizeEventId = (id) => id ? String(id) : null;

const BookingModal = ({ isOpen, onClose, table, eventId, eventName, eventDate, eventImage, ticketPrice = 50, onOpenCheckout }) => {
    const { addReservation, addTicket, cart } = useCart();

    // Check if user already has tickets for this event in cart
    const existingTickets = cart.ticket &&
        normalizeEventId(cart.eventId) === normalizeEventId(eventId)
        ? cart.ticket
        : null;

    const [ticketQuantity, setTicketQuantity] = useState(existingTickets ? existingTickets.quantity : 0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sync ticketQuantity with cart changes
    React.useEffect(() => {
        if (isOpen) {
            const currentTickets = cart.ticket &&
                normalizeEventId(cart.eventId) === normalizeEventId(eventId)
                ? cart.ticket
                : null;
            setTicketQuantity(currentTickets ? currentTickets.quantity : 0);
        }
    }, [isOpen, cart, eventId]);

    // Lock body scroll when modal is open
    useBodyScrollLock(isOpen);

    // Close modal on ESC key
    useKeyPress('Escape', onClose, isOpen);

    if (!isOpen || !table) return null;

    const ticketTotal = ticketQuantity * ticketPrice;
    const loungeMinSpend = parseFloat(table.minSpend || 0);
    const grandTotal = ticketTotal + loungeMinSpend;

    const handleTicketIncrease = () => {
        setTicketQuantity(prev => prev + 1);
    };

    const handleTicketDecrease = () => {
        if (ticketQuantity > 0) {
            setTicketQuantity(prev => prev - 1);
        }
    };

    const handleBooking = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Add lounge reservation
            const reservationResult = addReservation(eventId, {
                tableId: table.id,
                tableName: table.name,
                minSpend: loungeMinSpend
            }, eventName, eventImage, eventDate);

            if (!reservationResult.success) {
                setError(reservationResult.error);
                setIsLoading(false);
                return;
            }

            // Only add/update tickets if quantity changed from existing or no existing tickets
            if (ticketQuantity > 0 && (!existingTickets || ticketQuantity !== existingTickets.quantity)) {
                const ticketResult = addTicket(eventId, {
                    ticketTypeId: 'standard',
                    name: `Bilet standard - ${eventName}`,
                    quantity: ticketQuantity,
                    unitPrice: ticketPrice,
                    totalAmount: ticketTotal
                }, eventName);

                if (!ticketResult.success) {
                    setError(ticketResult.error);
                    setIsLoading(false);
                    return;
                }
            }

            onClose();

        } catch (err) {
            console.error('❌ Błąd rezerwacji:', err);
            setError(err.message || 'Wystąpił błąd podczas rezerwacji');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckoutDirect = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Add lounge reservation
            const reservationResult = addReservation(eventId, {
                tableId: table.id,
                tableName: table.name,
                minSpend: loungeMinSpend
            }, eventName, eventImage, eventDate);

            if (!reservationResult.success) {
                setError(reservationResult.error);
                setIsLoading(false);
                return;
            }

            // Add tickets if any selected
            if (ticketQuantity > 0 && (!existingTickets || ticketQuantity !== existingTickets.quantity)) {
                const ticketResult = addTicket(eventId, {
                    ticketTypeId: 'standard',
                    name: `Bilet standard - ${eventName}`,
                    quantity: ticketQuantity,
                    unitPrice: ticketPrice,
                    totalAmount: ticketTotal
                }, eventName);

                if (!ticketResult.success) {
                    setError(ticketResult.error);
                    setIsLoading(false);
                    return;
                }
            }

            onClose();
            // Open checkout modal
            if (onOpenCheckout) {
                onOpenCheckout();
            }

        } catch (err) {
            console.error('❌ Błąd:', err);
            setError(err.message || 'Wystąpił błąd');
            setIsLoading(false);
        }
    };

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="booking-modal-close" onClick={onClose}>
                    ×
                </button>

                <h2 className="booking-modal-title">Rezerwacja Stolika</h2>

                {/* Event Info Card */}
                <EventInfoCard
                    eventName={eventName || `Wydarzenie #${eventId}`}
                    eventDate={eventDate ? new Date(eventDate).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }) : ''}
                    eventImage={eventImage}
                />

                <div className="booking-modal-info">
                    <div className="booking-info-row">
                        <span className="booking-info-label">Stolik:</span>
                        <span className="booking-info-value">{table.name}</span>
                    </div>
                    <div className="booking-info-row">
                        <span className="booking-info-label">Minimalna kwota:</span>
                        <span className="booking-info-value">{table.minSpend} PLN</span>
                    </div>
                </div>

                {/* CART SYNC BANNER - Show if user has tickets in cart */}
                {existingTickets && (
                    <div className="cart-sync-banner">
                        <div className="banner-icon">✓</div>
                        <div className="banner-text">
                            Masz już <strong>{existingTickets.quantity} biletów</strong> w koszyku dla tego wydarzenia
                            <div className="banner-price">+{existingTickets.totalAmount} PLN</div>
                        </div>
                    </div>
                )}

                {/* WARNING: Lounge doesn't include tickets */}
                <div className="booking-warning">
                    <div className="warning-icon">⚠️</div>
                    <div className="warning-text">
                        <strong>Uwaga:</strong> Loża nie zawiera biletów wstępu. Dodaj bilety poniżej aby uzyskać dostęp do wydarzenia.
                    </div>
                </div>

                {/* TICKET SELECTION SECTION */}
                <div className="booking-ticket-section">
                    <div className="ticket-section-header">
                        <span className="ticket-icon">🎫</span>
                        <h3>Dodaj bilety wstępu</h3>
                    </div>

                    <div className="ticket-counter">
                        <span className="ticket-counter-label">Liczba biletów:</span>
                        <div className="ticket-counter-controls">
                            <button
                                className="ticket-counter-btn"
                                onClick={handleTicketDecrease}
                                disabled={ticketQuantity === 0}
                            >
                                -
                            </button>
                            <span className="ticket-counter-value">{ticketQuantity}</span>
                            <button
                                className="ticket-counter-btn"
                                onClick={handleTicketIncrease}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {ticketQuantity > 0 && (
                        <div className="ticket-price-info">
                            <span>Bilety:</span>
                            <span>{ticketTotal} PLN</span>
                        </div>
                    )}

                    <div className="booking-total">
                        <div className="booking-total-row">
                            <span>Loża (min. spend):</span>
                            <span>{loungeMinSpend} PLN</span>
                        </div>
                        {ticketQuantity > 0 && (
                            <div className="booking-total-row">
                                <span>Bilety ({ticketQuantity}x):</span>
                                <span>{ticketTotal} PLN</span>
                            </div>
                        )}
                        <div className="booking-total-row grand-total">
                            <span>Razem:</span>
                            <span>{grandTotal} PLN</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="modal-error-banner">
                        <div className="error-icon">⚠️</div>
                        <div className="error-text">{error}</div>
                        <button className="error-close" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                <div className="booking-modal-actions">
                    {/*  Primary CTA - Checkout */}
                    <button
                        className="booking-btn booking-btn-checkout"
                        onClick={handleCheckoutDirect}
                        disabled={isLoading}
                    >
                        💳 Przejdź do płatności
                    </button>

                    {/* Secondary Actions */}
                    <div className="booking-secondary-actions">
                        <button
                            className="booking-btn booking-btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Anuluj
                        </button>
                        <button
                            className="booking-btn booking-btn-confirm"
                            onClick={handleBooking}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Dodawanie...' : 'Dodaj do koszyka'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
