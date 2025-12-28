import { useState, useCallback } from 'react';

import { requestNotificationPermission } from '../utils/notifications';
import { type QueryContextType, QueryContext } from './QueryContext';
import { useLocalStoragePersistence, useQueryExecutor } from '../hooks';

type QueryProviderProps = {
    children: React.ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
    const [editorValue, setEditorValue] = useLocalStoragePersistence('query-editor-value', '');
    const [notifyEnabled, setNotifyEnabled] = useState(false);

    const {
        execution,
        isLoading,
        error,
        rowsMap,
        runQuery,
        cancelQuery,
        loadMoreRows
    } = useQueryExecutor(notifyEnabled);

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

    const value: QueryContextType = {
        editorValue,
        setEditorValue,
        execution,
        rowsMap,
        isLoading,
        error,
        notifyEnabled,
        runQuery,
        cancelQuery,
        toggleNotify,
        loadMoreRows,
    };

    return <QueryContext.Provider value={value}>{children}</QueryContext.Provider>;
};
