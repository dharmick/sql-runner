import { useState, useCallback } from 'react';
import { requestNotificationPermission } from '../utils/notifications';

export const useNotification = () => {
    const [notifyEnabled, setNotifyEnabled] = useState(false);

    const toggleNotify = useCallback(async () => {
        if (!notifyEnabled) {
            const granted = await requestNotificationPermission();
            if (granted) {
                setNotifyEnabled(true);
            }
        } else {
            setNotifyEnabled(false);
        }
    }, [notifyEnabled]);

    const resetNotify = useCallback(() => {
        setNotifyEnabled(false);
    }, []);

    return { notifyEnabled, toggleNotify, resetNotify };
};
