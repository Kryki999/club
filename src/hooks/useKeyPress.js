import { useEffect } from 'react';

/**
 * Custom hook to handle keyboard events
 * @param {string} key - The key to listen for (e.g., 'Escape', 'Enter')
 * @param {function} callback - Function to call when key is pressed
 * @param {boolean} enabled - Whether the listener is active (default: true)
 */
export const useKeyPress = (key, callback, enabled = true) => {
    useEffect(() => {
        if (!enabled) return;

        const handler = (event) => {
            if (event.key === key) {
                callback(event);
            }
        };

        window.addEventListener('keydown', handler);

        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, [key, callback, enabled]);
};
