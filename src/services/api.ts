import { API_ENDPOINTS } from '../constants/constants';
import type { QueryExecution, FetchRowsResponse } from '../types/index';

/**
 * This service makes actual fetch calls.
 * These calls are intercepted by mockFetch.ts to provide mock responses visible in the Network tab.
 */

export const createQueryExecution = async (sql: string): Promise<{ executionId: string }> => {
    const response = await fetch(API_ENDPOINTS.CREATE_EXECUTION, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create query execution');
    }

    return response.json();
};

export const getQueryExecution = async (executionId: string): Promise<QueryExecution> => {
    const url = new URL(API_ENDPOINTS.GET_EXECUTION, window.location.origin);
    url.searchParams.set('executionId', executionId);

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get query execution');
    }

    return response.json();
};

export const fetchRows = async (
    executionId: string,
    cursor: string | null = null,
    limit: number = 50
): Promise<FetchRowsResponse> => {
    const url = new URL(API_ENDPOINTS.FETCH_ROWS, window.location.origin);
    url.searchParams.set('executionId', executionId);
    if (cursor) {
        url.searchParams.set('cursor', cursor);
    }
    url.searchParams.set('limit', limit.toString());

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch rows');
    }

    return response.json();
};

export const cancelQueryExecution = async (executionId: string): Promise<void> => {
    const response = await fetch(API_ENDPOINTS.CANCEL_EXECUTION, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ executionId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel query execution');
    }
};
