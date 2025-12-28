import { useState, useCallback } from 'react';
import * as api from '../services/api';
import type { QueryExecution, Row } from '../types';
import { showQueryCompleteNotification, showQueryFailedNotification, requestNotificationPermission } from '../utils/notifications';
import { type QueryContextType, QueryContext } from './QueryContext';
import { usePolling, useLocalStoragePersistence } from '../hooks';
import { QUERY_EXECUTION_POLLING_INTERVAL } from '../constants/constants';

type QueryProviderProps = {
    children: React.ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
    const [editorValue, setEditorValue] = useLocalStoragePersistence('query-editor-value', '');
    const [execution, setExecution] = useState<QueryExecution | null>(null);
    const [rowsMap, setRowsMap] = useState<Map<number, Row>>(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notifyEnabled, setNotifyEnabled] = useState(false);
    const [loadingRanges, setLoadingRanges] = useState<Set<string>>(new Set());

    const { startPolling, stopPolling } = usePolling({
        interval: QUERY_EXECUTION_POLLING_INTERVAL
    });

    const pollExecution = useCallback(async (executionId: string) => {
        try {
            const exec = await api.getQueryExecution(executionId);
            setExecution(exec);

            if (exec.status === 'completed') {
                stopPolling();

                // Fetch initial rows
                const response = await api.fetchRows(executionId, 0, 50);
                const newMap = new Map<number, Row>();
                response.rows.forEach((row, idx) => {
                    newMap.set(idx, row);
                });
                setRowsMap(newMap);

                // Show notification if enabled
                if (notifyEnabled && exec.totalRows !== null && exec.executionTimeMs !== null) {
                    showQueryCompleteNotification(exec.totalRows, exec.executionTimeMs);
                }

                setIsLoading(false);
            } else if (exec.status === 'failed') {
                stopPolling();
                setIsLoading(false);
                setError(exec.error?.message || 'Query failed');

                // Show notification if enabled
                if (notifyEnabled) {
                    showQueryFailedNotification(exec.error?.message || 'Query failed');
                }
            } else if (exec.status === 'cancelled') {
                stopPolling();
                setIsLoading(false);
            }
        } catch (err) {
            stopPolling();
            setIsLoading(false);
            setError(err instanceof Error ? err.message : 'Failed to poll execution');
        }
    }, [notifyEnabled, stopPolling]);

    const runQuery = useCallback(async (queryToRun: string) => {
        if (!queryToRun.trim()) {
            setError('Please enter a SQL query');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setExecution(null);
            setRowsMap(new Map());
            setLoadingRanges(new Set());

            const { executionId } = await api.createQueryExecution(queryToRun);

            startPolling(() => pollExecution(executionId));
        } catch (err) {
            setIsLoading(false);
            setError(err instanceof Error ? err.message : 'Failed to create query execution');
        }
    }, [pollExecution, startPolling]);

    const cancelQuery = useCallback(async () => {
        if (!execution) return;

        try {
            await api.cancelQueryExecution(execution.executionId);
            stopPolling();
            setIsLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel query');
        }
    }, [execution, stopPolling]);

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

    const loadMoreRows = useCallback(async (startIndex: number, endIndex: number) => {
        if (!execution) return;

        // Calculate which pages we need to fetch
        const pageSize = 50;
        const startPage = Math.floor(startIndex / pageSize);
        const endPage = Math.floor(endIndex / pageSize);

        // Fetch missing pages
        for (let page = startPage; page <= endPage; page++) {
            const offset = page * pageSize;
            const rangeKey = `${offset}`;

            // Skip if already loading
            if (loadingRanges.has(rangeKey)) continue;

            // Check if this page is already loaded
            const alreadyLoaded = Array.from({ length: Math.min(pageSize, (execution.totalRows || 0) - offset) }, (_, i) =>
                rowsMap.has(offset + i)
            ).every(Boolean);

            if (alreadyLoaded) continue;

            // Mark as loading
            setLoadingRanges(prev => new Set(prev).add(rangeKey));

            try {
                const response = await api.fetchRows(execution.executionId, offset, pageSize);

                // Store rows in map
                setRowsMap(prev => {
                    const newMap = new Map(prev);
                    response.rows.forEach((row, idx) => {
                        newMap.set(offset + idx, row);
                    });
                    return newMap;
                });
            } catch (err) {
                console.error('Failed to load rows:', err);
            } finally {
                setLoadingRanges(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(rangeKey);
                    return newSet;
                });
            }
        }
    }, [execution, rowsMap, loadingRanges]);

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
