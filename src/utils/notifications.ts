// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.warn('Browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

// Show query completion notification
export const showQueryCompleteNotification = (rows: number, timeMs: number): void => {
    if (Notification.permission !== 'granted') return;

    const time = timeMs < 1000 ? `${timeMs}ms` : `${(timeMs / 1000).toFixed(1)}s`;
    const notification = new Notification('Query completed', {
        body: `${rows.toLocaleString()} rows in ${time}`,
        icon: '/vite.svg',
        tag: 'query-complete'
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };
};

// Show query failed notification
export const showQueryFailedNotification = (error: string): void => {
    if (Notification.permission !== 'granted') return;

    const notification = new Notification('Query failed', {
        body: error,
        icon: '/vite.svg',
        tag: 'query-failed'
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };
};
