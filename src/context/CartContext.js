import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('hood_cart');
        return savedCart ? JSON.parse(savedCart) : {
            eventId: null,
            eventName: '',
            tickets: { quantity: 0, unitPrice: 0, total: 0 },
            reservation: null, // { tableId, name, minSpend }
            totalAmount: 0
        };
    });

    useEffect(() => {
        localStorage.setItem('hood_cart', JSON.stringify(cart));
    }, [cart]);

    const addTickets = (eventId, eventName, quantity, unitPrice) => {
        setCart(prev => {
            // New cart if eventId changes
            const baseCart = prev.eventId === eventId ? prev : {
                eventId,
                eventName,
                tickets: { quantity: 0, unitPrice: 0, total: 0 },
                reservation: null,
                totalAmount: 0
            };

            const newQuantity = baseCart.tickets.quantity + quantity;
            const newTotal = newQuantity * unitPrice;
            const reservationTotal = baseCart.reservation ? parseFloat(baseCart.reservation.minSpend) : 0;

            return {
                ...baseCart,
                tickets: { quantity: newQuantity, unitPrice, total: newTotal },
                totalAmount: newTotal + reservationTotal
            };
        });
    };

    const addReservation = (eventId, eventName, table) => {
        setCart(prev => {
            const baseCart = prev.eventId === eventId ? prev : {
                eventId,
                eventName,
                tickets: { quantity: 0, unitPrice: 0, total: 0 },
                reservation: null,
                totalAmount: 0
            };

            const reservationTotal = parseFloat(table.minSpend);
            const ticketsTotal = baseCart.tickets.total;

            return {
                ...baseCart,
                reservation: {
                    tableId: table.id,
                    name: table.name,
                    minSpend: table.minSpend
                },
                totalAmount: ticketsTotal + reservationTotal
            };
        });
    };

    const setTickets = (eventId, eventName, quantity, unitPrice) => {
        setCart(prev => {
            const baseCart = prev.eventId === eventId ? prev : {
                eventId,
                eventName,
                tickets: { quantity: 0, unitPrice: 0, total: 0 },
                reservation: null,
                totalAmount: 0
            };

            const newTotal = quantity * unitPrice;
            const reservationTotal = baseCart.reservation ? parseFloat(baseCart.reservation.minSpend) : 0;

            return {
                ...baseCart,
                tickets: { quantity, unitPrice, total: newTotal },
                totalAmount: newTotal + reservationTotal
            };
        });
    };

    const removeTickets = () => {
        setCart(prev => {
            const reservationTotal = prev.reservation ? parseFloat(prev.reservation.minSpend) : 0;
            return {
                ...prev,
                tickets: { quantity: 0, unitPrice: 0, total: 0 },
                totalAmount: reservationTotal
            };
        });
    };

    const removeReservation = () => {
        setCart(prev => {
            return {
                ...prev,
                reservation: null,
                totalAmount: prev.tickets.total
            };
        });
    };

    const clearCart = () => {
        setCart({
            eventId: null,
            eventName: '',
            tickets: { quantity: 0, unitPrice: 0, total: 0 },
            reservation: null,
            totalAmount: 0
        });
    };

    return (
        <CartContext.Provider value={{
            cart,
            addTickets,
            setTickets,
            addReservation,
            removeTickets,
            removeReservation,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
