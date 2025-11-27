// src/hooks/useProctoring.js

import { useEffect, useCallback } from 'react';

/**
 * A helper function to request the browser to enter fullscreen mode.
 * Must be called from a user-initiated event (e.g., a button click).
 */
export const requestFullScreen = () => {
    const element = document.documentElement; // Get the root element of the page
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
};

/**
 * A custom hook to enforce anti-cheat measures during an exam.
 * @param {() => void} onViolation - Callback function to execute when a violation is detected.
 */
export const useProctoring = (onViolation) => {
    // useCallback ensures the functions are not recreated on every render.
    const handleVisibilityChange = useCallback(() => {
        if (document.visibilityState === 'hidden') {
            console.warn('Proctoring Violation: Tab switched.');
            onViolation();
        }
    }, [onViolation]);

    const handleContextMenu = useCallback((e) => {
        e.preventDefault();
        console.warn('Proctoring Violation: Right-click blocked.');
        onViolation();
    }, [onViolation]);
    
    const handleCopyPaste = useCallback((e) => {
        e.preventDefault();
        console.warn('Proctoring Violation: Copy/Paste blocked.');
        onViolation();
    }, [onViolation]);

    // NEW: Handler for fullscreen change
    const handleFullscreenChange = useCallback(() => {
        // If document.fullscreenElement is null, it means the user has exited fullscreen
        if (!document.fullscreenElement) {
            console.warn('Proctoring Violation: Exited fullscreen mode.');
            onViolation();
        }
    }, [onViolation]);

    useEffect(() => {
        // Add all event listeners when the hook is mounted.
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopyPaste);
        document.addEventListener('paste', handleCopyPaste);
        document.addEventListener('fullscreenchange', handleFullscreenChange); // NEW

        // Cleanup function to remove all listeners when the component unmounts.
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopyPaste);
            document.removeEventListener('paste', handleCopyPaste);
            document.removeEventListener('fullscreenchange', handleFullscreenChange); // NEW
        };
    }, [handleVisibilityChange, handleContextMenu, handleCopyPaste, handleFullscreenChange]);

    // This hook doesn't return any value; it just sets up listeners.
};