import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to persist state to local storage
 * @param key - The local storage key
 * @param initialValue - The initial value if no stored value exists
 * @returns A tuple of [value, setValue] similar to useState
 */
export const useLocalStoragePersistence = <T,>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
    // Initialize state with value from local storage or initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update local storage whenever the value changes
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // Wrapper for setValue that handles function updates
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        setStoredValue(prevValue => {
            const newValue = value instanceof Function ? value(prevValue) : value;
            return newValue;
        });
    }, []);

    return [storedValue, setValue];
};
