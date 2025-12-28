import { useState, useCallback, useEffect, useRef } from 'react';
import * as api from '../services/api';
import { usePolling } from './usePolling';
import { useQueryRows } from './useQueryRows';
import { showQueryCompleteNotification, showQueryFailedNotification } from '../utils/notifications';
import { QUERY_EXECUTION_POLLING_INTERVAL } from '../constants/constants';
import type { QueryExecution, Row } from '../types';

export const useQueryExecutor = (notifyEnabled: boolean) => {
    const [execution, setExecution] = useState<QueryExecution | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const notifyEnabledRef = useRef(notifyEnabled);

    const { rowsMap, setRowsMap, loadMoreRows, resetLoadingRanges } = useQueryRows(execution);

    const { startPolling, stopPolling } = usePolling({
        interval: QUERY_EXECUTION_POLLING_INTERVAL
    });

    useEffect(() => {
        notifyEnabledRef.current = notifyEnabled;
    }, [notifyEnabled])

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

                if (notifyEnabledRef.current && exec.totalRows !== null && exec.executionTimeMs !== null) {
                    showQueryCompleteNotification(exec.totalRows, exec.executionTimeMs);
                }

                setIsLoading(false);
            } else if (exec.status === 'failed') {
                stopPolling();
                setIsLoading(false);
                setError(exec.error?.message || 'Query failed');

                if (notifyEnabledRef.current) {
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
    }, [stopPolling, setRowsMap]);

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
            resetLoadingRanges();
            const { executionId } = await api.createQueryExecution(queryToRun);

            startPolling(() => pollExecution(executionId));
        } catch (err) {
            setIsLoading(false);
            setError(err instanceof Error ? err.message : 'Failed to create query execution');
        }
    }, [pollExecution, startPolling, resetLoadingRanges, setRowsMap]);

    const cancelQuery = useCallback(async () => {
        if (!execution) return;

        try {
            await api.cancelQueryExecution(execution.executionId);
            stopPolling();
            setIsLoading(false);
            setExecution(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel query');
        }
    }, [execution, stopPolling]);

    return {
        execution,
        isLoading,
        error,
        rowsMap,
        runQuery,
        cancelQuery,
        loadMoreRows
    };
};
