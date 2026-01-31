import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Helper function to normalize eventId to string for consistent comparison
const normalizeEventId = (eventId) => {
    return eventId ? String(eventId) : null;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
        eventId: null,
        eventName: null,
        eventImage: null,
        eventDate: null,
        ticket: null,
        reservation: null,
        totalAmount: 0
    });

    const calculateTotal = (ticket, reservation) => {
        const ticketAmount = ticket ? ticket.totalAmount : 0;
        const reservationAmount = reservation ? reservation.minSpend : 0;
        return ticketAmount + reservationAmount;
    };

    const addTicket = useCallback((eventId, ticket, eventName = null, eventImage = null, eventDate = null) => {
        const normalizedEventId = normalizeEventId(eventId);
        let success = true;
        let errorMessage = '';

        setCart(prev => {
            const prevNormalized = normalizeEventId(prev.eventId);

            // Only block if trying to add ticket from DIFFERENT event
            if (prevNormalized && prevNormalized !== normalizedEventId) {
                success = false;
                const currentEventName = prev.eventName || `Wydarzenia #${prev.eventId}`;
                errorMessage = `Masz już produkty z "${currentEventName}" w koszyku. Usuń je lub przejdź do płatności aby dodać bilety na inne wydarzenie.`;
                return prev;
            }

            // Same event or no event - allow adding tickets
            const newTotal = calculateTotal(ticket, prev.reservation);
            return {
                ...prev,
                eventId: normalizedEventId,
                eventName: prev.eventName || eventName,
                eventImage: prev.eventImage || eventImage,
                eventDate: prev.eventDate || eventDate,
                ticket: { ...ticket },
                totalAmount: newTotal
            };
        });

        return { success, error: errorMessage };
    }, []);

    const addReservation = useCallback((eventId, reservation, eventName = null, eventImage = null, eventDate = null) => {
        const normalizedEventId = normalizeEventId(eventId);
        let success = true;
        let errorMessage = '';

        setCart(prev => {
            const prevNormalized = normalizeEventId(prev.eventId);

            // Only block if trying to add reservation from DIFFERENT event
            if (prevNormalized && prevNormalized !== normalizedEventId) {
                success = false;
                const currentEventName = prev.eventName || `Wydarzenia #${prev.eventId}`;
                errorMessage = `Masz już produkty z "${currentEventName}" w koszyku. Usuń je lub przejdź do płatności aby zarezerwować lożę na inne wydarzenie.`;
                return prev;
            }

            // Same event or no event - allow adding reservation
            const newTotal = calculateTotal(prev.ticket, reservation);
            return {
                ...prev,
                eventId: normalizedEventId,
                eventName: prev.eventName || eventName,
                eventImage: prev.eventImage || eventImage,
                eventDate: prev.eventDate || eventDate,
                reservation: { ...reservation },
                totalAmount: newTotal
            };
        });

        return { success, error: errorMessage };
    }, []);

    const removeTicket = useCallback(() => {
        setCart(prev => {
            const newTotal = calculateTotal(null, prev.reservation);
            const hasItems = !!prev.reservation;
            return {
                ...prev,
                eventId: hasItems ? prev.eventId : null,
                eventName: hasItems ? prev.eventName : null,
                eventImage: hasItems ? prev.eventImage : null,
                eventDate: hasItems ? prev.eventDate : null,
                ticket: null,
                totalAmount: newTotal
            };
        });
    }, []);

    const removeReservation = useCallback(() => {
        setCart(prev => {
            const newTotal = calculateTotal(prev.ticket, null);
            const hasItems = !!prev.ticket;
            return {
                ...prev,
                eventId: hasItems ? prev.eventId : null,
                eventName: hasItems ? prev.eventName : null,
                eventImage: hasItems ? prev.eventImage : null,
                eventDate: hasItems ? prev.eventDate : null,
                reservation: null,
                totalAmount: newTotal
            };
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart({
            eventId: null,
            eventName: null,
            eventImage: null,
            eventDate: null,
            ticket: null,
            reservation: null,
            totalAmount: 0
        });
    }, []);

    const value = useMemo(() => ({
        cart,
        addTicket,
        addReservation,
        removeTicket,
        removeReservation,
        clearCart
    }), [cart, addTicket, addReservation, removeTicket, removeReservation, clearCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
