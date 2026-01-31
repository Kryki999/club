import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Useful for modals to prevent background scrolling
 * @param {boolean} isLocked - Whether the body scroll should be locked
 */
export const useBodyScrollLock = (isLocked) => {
    useEffect(() => {
        if (isLocked) {
            // Save current scroll position
            const scrollY = window.scrollY;

            // Lock scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            return () => {
                // Restore scroll
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';

                // Restore scroll position
                window.scrollTo(0, scrollY);
            };
        }
    }, [isLocked]);
};
