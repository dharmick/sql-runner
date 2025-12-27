import { useRef, useCallback, useEffect } from 'react';

export type PollingOptions = {
    interval?: number;
    immediate?: boolean;
    enabled?: boolean;
};

export type PollingControls = {
    startPolling: (callback: () => void | Promise<void>) => void;
    stopPolling: () => void;
    isPolling: () => boolean;
};

/*
 * Custom hook for managing polling operations
 * 
 * @param options - Configuration options for polling behavior
 * @returns Controls for starting and stopping polling
 * 
 */

export const usePolling = (options: PollingOptions = {}): PollingControls => {
    const { interval = 500, enabled = true } = options;

    const intervalRef = useRef<number | null>(null);
    const callbackRef = useRef<(() => void | Promise<void>) | null>(null);

    const stopPolling = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        callbackRef.current = null;
    }, []);

    const startPolling = useCallback((callback: () => void | Promise<void>) => {
        if (!enabled) {
            return;
        }

        // Stop any existing polling
        stopPolling();

        callbackRef.current = callback;

        intervalRef.current = setInterval(() => {
            if (callbackRef.current) {
                callbackRef.current();
            }
        }, interval);

        // Execute immediately if requested
        if (options.immediate !== false) {
            callback();
        }
    }, [interval, enabled, stopPolling, options.immediate]);

    const isPolling = useCallback(() => {
        return intervalRef.current !== null;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopPolling();
        };
    }, [stopPolling]);

    return {
        startPolling,
        stopPolling,
        isPolling
    };
};
