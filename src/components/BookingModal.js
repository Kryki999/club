import React, { useState } from 'react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, table, eventId, eventName }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !table) return null;

    const isFormValid = customerName.trim() !== "" && customerEmail.trim() !== "" && customerEmail.includes('@');

    const handleBooking = async () => {
        if (!isFormValid) {
            setError('Wszystkie pola są wymagane i email musi być poprawny.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = process.env.REACT_APP_STRAPI_API_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

            // Krok 1: Utwórz rezerwację ze statusem draft
            console.log('📝 Tworzenie wstępnej rezerwacji...', {
                table: table.id,
                wydarzenia: eventId,
                customerName,
                customerEmail
            });

            const reservationResponse = await fetch(`${apiUrl}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        table: table.id,
                        wydarzenia: eventId,
                        reservationStatus: 'draft',
                        customerName: customerName,
                        customerEmail: customerEmail
                    }
                })
            });

            console.log('📤 Request sent to:', `${apiUrl}/api/reservations`);

            if (!reservationResponse.ok) {
                const errorText = await reservationResponse.text();
                console.error('❌ Response status:', reservationResponse.status);
                console.error('❌ Response body:', errorText);

                let errorMessage = 'Nie udało się utworzyć rezerwacji';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error?.message || errorJson.message || errorMessage;
                } catch (e) {
                    // Text response, not JSON
                }

                throw new Error(errorMessage);
            }

            const reservationData = await reservationResponse.json();
            const reservationId = reservationData.data?.id || reservationData.id;

            console.log('✅ Wstępna rezerwacja utworzona:', reservationId);

            // Krok 2: Utwórz sesję Stripe checkout
            console.log('💳 Tworzenie sesji płatności Stripe...');

            const checkoutResponse = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reservationId: reservationId,
                    amount: table.minSpend,
                    currency: 'pln'
                })
            });

            if (!checkoutResponse.ok) {
                const errorData = await checkoutResponse.json();
                throw new Error(errorData.error || 'Nie udało się utworzyć sesji płatności');
            }

            const { url } = await checkoutResponse.json();

            console.log('✅ Sesja płatności utworzona, przekierowanie...');

            // Pokaż info przed przekierowaniem
            setError(null);
            alert('Przekierowujemy do płatności Stripe...');

            // Przekieruj do Stripe checkout
            window.location.href = url;

        } catch (err) {
            console.error('❌ Błąd rezerwacji:', err);
            setError(err.message || 'Wystąpił błąd podczas rezerwacji');
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

                <div className="booking-modal-info">
                    <div className="booking-info-row">
                        <span className="booking-info-label">Stolik:</span>
                        <span className="booking-info-value">{table.name}</span>
                    </div>
                    <div className="booking-info-row">
                        <span className="booking-info-label">Wydarzenie:</span>
                        <span className="booking-info-value">{eventName || `Event #${eventId}`}</span>
                    </div>
                    <div className="booking-info-row">
                        <span className="booking-info-label">Minimalna kwota:</span>
                        <span className="booking-info-value">{table.minSpend} PLN</span>
                    </div>
                </div>

                <div className="booking-modal-form">
                    <div className="booking-form-group">
                        <label htmlFor="customerName">Imię i nazwisko *</label>
                        <input
                            type="text"
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Jan Kowalski"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="booking-form-group">
                        <label htmlFor="customerEmail">Email *</label>
                        <input
                            type="email"
                            id="customerEmail"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="jan@example.com"
                            disabled={isLoading}
                            required
                        />
                    </div>
                    {!isFormValid && customerName && customerEmail && (
                        <p style={{ color: 'red', fontSize: '12px', marginTop: '-10px', marginBottom: '10px' }}>
                            Wszystkie pola są wymagane i podaj poprawny email.
                        </p>
                    )}
                </div>

                {error && (
                    <div className="booking-modal-error">
                        {error}
                    </div>
                )}

                <div className="booking-modal-actions">
                    <button
                        className="booking-btn booking-btn-cancel"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Anuluj
                    </button>
                    <button
                        className={`booking-btn booking-btn-confirm ${!isFormValid ? 'btn-disabled' : ''}`}
                        onClick={handleBooking}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? 'Przekierowuję...' : 'Przejdź do płatności'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
