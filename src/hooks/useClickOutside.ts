import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Hook that handles clicks outside of the passed ref
 */
export const useClickOutside = (
    ref: RefObject<HTMLElement | null>,
    handler: () => void,
    enabled: boolean = true
) => {
    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, handler, enabled]);
};
