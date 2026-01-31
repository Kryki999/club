import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useKeyPress } from '../hooks/useKeyPress';
import EventInfoCard from './EventInfoCard';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose }) => {
    const { cart } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        acceptTerms: false
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useBodyScrollLock(isOpen);
    useKeyPress('Escape', onClose, isOpen);

    if (!isOpen) return null;

    const isFormValid =
        formData.fullName.trim() !== '' &&
        formData.email.includes('@') &&
        formData.phone.trim() !== '' &&
        formData.acceptTerms;

    const handleSubmit = async () => {
        if (!isFormValid) {
            setError('Wypełnij wszystkie pola i zaakceptuj regulamin');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Backend integration
            console.log('Processing payment:', { formData, cart });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Frontend gotowy! Backend płatności będzie wkrótce.');
            onClose();
        } catch (err) {
            setError('Wystąpił błąd. Spróbuj ponownie.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="checkout-modal-overlay" onClick={onClose}>
            <div className="checkout-modal-content" onClick={e => e.stopPropagation()}>
                <button className="checkout-modal-close" onClick={onClose}>×</button>

                <h2 className="checkout-modal-title">Finalizacja zamówienia</h2>

                {/* EVENT INFO CARD */}
                <EventInfoCard
                    eventName={cart.eventName || `Wydarzenie #${cart.eventId}`}
                    eventDate={cart.eventDate ? new Date(cart.eventDate).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }) : ''}
                    eventImage={cart.eventImage}
                />

                {/* ORDER SUMMARY */}
                <div className="checkout-summary">

                    {cart.ticket && (
                        <div className="summary-item">
                            <span>🎫 {cart.ticket.quantity}x Bilety</span>
                            <span>{cart.ticket.totalAmount} PLN</span>
                        </div>
                    )}

                    {cart.reservation && (
                        <div className="summary-item">
                            <span>🌟 Loża: {cart.reservation.tableName}</span>
                            <span>{cart.reservation.minSpend} PLN</span>
                        </div>
                    )}

                    <div className="summary-total">
                        <span>RAZEM</span>
                        <span>{cart.totalAmount} PLN</span>
                    </div>
                </div>

                {/* FORM */}
                <div className="checkout-form">
                    <div className="form-group">
                        <label>Imię i nazwisko *</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="Jan Kowalski"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="jan@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Numer telefonu *</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+48 123 456 789"
                        />
                    </div>

                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={formData.acceptTerms}
                            onChange={e => setFormData({ ...formData, acceptTerms: e.target.checked })}
                        />
                        <label htmlFor="terms">
                            Akceptuję <a href="/regulamin" target="_blank" rel="noreferrer">regulamin</a> i{' '}
                            <a href="/polityka-prywatnosci" target="_blank" rel="noreferrer">politykę prywatności</a>
                        </label>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="modal-error-banner">
                        <div className="error-icon">⚠️</div>
                        <div className="error-text">{error}</div>
                        <button className="error-close" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* ACTIONS */}
                <div className="checkout-modal-actions">
                    <button
                        className={`checkout-btn-pay ${!isFormValid ? 'btn-disabled' : ''}`}
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? 'Przetwarzanie...' : '💳 Zapłać'}
                    </button>
                    <button className="checkout-btn-cancel" onClick={onClose}>
                        Anuluj
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
