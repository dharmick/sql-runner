import { useCallback, useRef } from 'react';

export interface ResizeOptions {
    minWidth?: number;
    maxWidth?: number;
    onResize?: (newWidth: number) => void;
    onResizeStart?: () => void;
    onResizeEnd?: () => void;
}

export interface ResizeHandler {
    handleMouseDown: (e: React.MouseEvent) => void;
    isResizing: boolean;
}

/**
 * A reusable hook for implementing resize functionality with requestAnimationFrame optimization.
 * Using it for resizable columns in the results table.
 */
export const useResizable = (
    initialWidth: number,
    options: ResizeOptions = {}
): ResizeHandler => {
    const {
        minWidth = 100,
        maxWidth = 600,
        onResize,
        onResizeStart,
        onResizeEnd,
    } = options;

    const isResizingRef = useRef(false);
    const startXRef = useRef(0);
    const startWidthRef = useRef(initialWidth);
    const rafIdRef = useRef<number | null>(null);
    const currentWidthRef = useRef(initialWidth);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            isResizingRef.current = true;
            startXRef.current = e.clientX;
            startWidthRef.current = currentWidthRef.current;

            onResizeStart?.();

            const handleMouseMove = (moveEvent: MouseEvent) => {
                if (!isResizingRef.current) return;

                // Cancel any pending animation frame
                if (rafIdRef.current !== null) {
                    cancelAnimationFrame(rafIdRef.current);
                }

                // Use requestAnimationFrame for smooth, optimized updates
                rafIdRef.current = requestAnimationFrame(() => {
                    const deltaX = moveEvent.clientX - startXRef.current;
                    const newWidth = Math.max(
                        minWidth,
                        Math.min(maxWidth, startWidthRef.current + deltaX)
                    );

                    currentWidthRef.current = newWidth;
                    onResize?.(newWidth);
                });
            };

            const handleMouseUp = () => {
                if (!isResizingRef.current) return;

                isResizingRef.current = false;

                // Cancel any pending animation frame
                if (rafIdRef.current !== null) {
                    cancelAnimationFrame(rafIdRef.current);
                    rafIdRef.current = null;
                }

                onResizeEnd?.();

                // Clean up event listeners
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        },
        [minWidth, maxWidth, onResize, onResizeStart, onResizeEnd]
    );

    return {
        handleMouseDown,
        isResizing: isResizingRef.current,
    };
};
