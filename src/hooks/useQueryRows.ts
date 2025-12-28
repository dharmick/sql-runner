import { useState, useCallback } from 'react';
import * as api from '../services/api';
import type { QueryExecution, Row } from '../types';

export const useQueryRows = (execution: QueryExecution | null) => {
    const [rowsMap, setRowsMap] = useState<Map<number, Row>>(new Map());
    const [loadingRanges, setLoadingRanges] = useState<Set<string>>(new Set());

    const resetLoadingRanges = useCallback(() => {
        setLoadingRanges(new Set());
    }, []);

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

    return {
        rowsMap,
        setRowsMap,
        loadMoreRows,
        resetLoadingRanges
    };
};
