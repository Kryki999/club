import React from 'react';
import { useCart } from '../context/CartContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useKeyPress } from '../hooks/useKeyPress';
import EventInfoCard from './EventInfoCard';
import './CartModal.css';

const CartModal = ({ isOpen, onClose, onOpenCheckout }) => {
    const { cart, addTicket, removeTicket, removeReservation } = useCart();

    // Lock body scroll when modal is open
    useBodyScrollLock(isOpen);

    // Close modal on ESC key
    useKeyPress('Escape', onClose, isOpen);

    if (!isOpen) return null;

    const handleIncreaseTicket = () => {
        if (cart.ticket) {
            const newQuantity = cart.ticket.quantity + 1;
            addTicket(cart.eventId, {
                ...cart.ticket,
                quantity: newQuantity,
                totalAmount: newQuantity * cart.ticket.unitPrice
            }, cart.eventName);
        }
    };

    const handleDecreaseTicket = () => {
        if (cart.ticket) {
            if (cart.ticket.quantity > 1) {
                const newQuantity = cart.ticket.quantity - 1;
                addTicket(cart.eventId, {
                    ...cart.ticket,
                    quantity: newQuantity,
                    totalAmount: newQuantity * cart.ticket.unitPrice
                }, cart.eventName);
            } else {
                removeTicket();
            }
        }
    };

    const handleCheckout = () => {
        onClose();
        if (onOpenCheckout) {
            onOpenCheckout();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="cart-modal-overlay" onClick={handleOverlayClick}>
            <div className="cart-modal-content" onClick={e => e.stopPropagation()}>
                <div className="cart-modal-header">
                    <h2 className="cart-modal-title">Koszyk</h2>
                    <button
                        className="cart-modal-close"
                        onClick={onClose}
                        aria-label="Zamknij koszyk"
                    >
                        ×
                    </button>
                </div>

                {cart.eventId === null ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <p className="cart-empty-text">Koszyk jest pusty</p>
                        <p className="cart-empty-subtext">Dodaj bilety lub lożę aby kontynuować</p>
                    </div>
                ) : (
                    <>
                        {/* EVENT INFO */}
                        <EventInfoCard
                            eventName={cart.eventName || `Wydarzenie #${cart.eventId}`}
                            eventDate={cart.eventDate ? new Date(cart.eventDate).toLocaleDateString('pl-PL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) : ''}
                            eventImage={cart.eventImage}
                        />

                        <div className="cart-items-section">
                            {/* TICKET SECTION */}
                            {cart.ticket && (
                                <div className="cart-item">
                                    <div className="cart-item-title">{cart.ticket.name}</div>
                                    <div className="cart-item-detail">
                                        Cena jednostkowa: {cart.ticket.unitPrice} PLN
                                    </div>
                                    <div className="cart-item-controls">
                                        <div className="cart-item-counter">
                                            <button
                                                className="cart-counter-btn"
                                                onClick={handleDecreaseTicket}
                                                aria-label="Zmniejsz ilość"
                                            >
                                                -
                                            </button>
                                            <span className="cart-count-value">{cart.ticket.quantity}</span>
                                            <button
                                                className="cart-counter-btn"
                                                onClick={handleIncreaseTicket}
                                                aria-label="Zwiększ ilość"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            className="cart-remove-btn"
                                            onClick={removeTicket}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                    <div className="cart-item-total">
                                        Razem: {cart.ticket.totalAmount} PLN
                                    </div>
                                </div>
                            )}

                            {/* RESERVATION/LOUNGE SECTION */}
                            {cart.reservation && (
                                <div className="cart-item cart-lounge-item">
                                    <div className="cart-item-title">
                                        🌟 Loża: {cart.reservation.tableName}
                                    </div>
                                    <div className="cart-item-detail">
                                        Minimalna kwota zamówienia
                                    </div>
                                    <div className="cart-lounge-price">
                                        <span className="cart-lounge-price-label">Min. spend:</span>
                                        <span className="cart-lounge-price-value">
                                            {cart.reservation.minSpend} PLN
                                        </span>
                                    </div>
                                    <div className="cart-item-controls">
                                        <div></div>
                                        <button
                                            className="cart-remove-btn"
                                            onClick={removeReservation}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="cart-modal-footer">
                            <div className="cart-total">
                                <span>Do zapłaty:</span>
                                <span>{cart.totalAmount} PLN</span>
                            </div>
                            <button
                                className="cart-checkout-btn"
                                onClick={handleCheckout}
                            >
                                💳 Zapłać i rezerwuj
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal;
