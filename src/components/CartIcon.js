import React from 'react';
import { useCart } from '../context/CartContext';
import './CartIcon.css';

const CartIcon = ({ onClick }) => {
    const { cart } = useCart();

    // Count items: +1 for ticket, +1 for reservation
    const ticketCount = cart.ticket ? 1 : 0;
    const reservationCount = cart.reservation ? 1 : 0;
    const totalCount = ticketCount + reservationCount;
    const isEmpty = totalCount === 0;

    const handleClick = () => {
        console.log("open cart");
        if (onClick) onClick();
    };

    return (
        <div className="cart-icon-container" onClick={handleClick}>
            {/* Modern Shopping Bag SVG Icon */}
            <svg
                className={`cart-icon-svg ${!isEmpty ? 'cart-icon-filled' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Shopping bag outline */}
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                {/* Handle */}
                <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            {/* Badge with count */}
            {totalCount > 0 && (
                <span className="cart-icon-badge">
                    {totalCount}
                </span>
            )}
        </div>
    );
};

export default CartIcon;
