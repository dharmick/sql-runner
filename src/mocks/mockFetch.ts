import { API_ENDPOINTS } from '../constants/constants';
import {
    createQueryExecution,
    getQueryExecution,
    fetchRows,
    cancelQueryExecution,
} from './mockApi';

// Store the original fetch
const originalFetch = window.fetch;

// Mock fetch implementation
window.fetch = async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    const urlString = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url;

    // Mock: Create Query Execution
    if (urlString.includes(API_ENDPOINTS.CREATE_EXECUTION)) {
        try {
            const body = options?.body ? JSON.parse(options.body as string) : {};
            const result = await createQueryExecution(body.sql);

            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            return new Response(
                JSON.stringify({ error: (error as Error).message }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    }

    // Mock: Get Query Execution Status
    if (urlString.includes(API_ENDPOINTS.GET_EXECUTION)) {
        try {
            const url = new URL(urlString, window.location.origin);
            const executionId = url.searchParams.get('executionId');

            if (!executionId) {
                return new Response(
                    JSON.stringify({ error: 'executionId is required' }),
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            const result = await getQueryExecution(executionId);

            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            return new Response(
                JSON.stringify({ error: (error as Error).message }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    }

    // Mock: Fetch Rows
    if (urlString.includes(API_ENDPOINTS.FETCH_ROWS)) {
        try {
            const url = new URL(urlString, window.location.origin);
            const executionId = url.searchParams.get('executionId');
            const cursor = url.searchParams.get('cursor');
            const limit = parseInt(url.searchParams.get('limit') || '50', 10);

            if (!executionId) {
                return new Response(
                    JSON.stringify({ error: 'executionId is required' }),
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            const result = await fetchRows(executionId, cursor, limit);

            return new Response(JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            return new Response(
                JSON.stringify({ error: (error as Error).message }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    }

    // Mock: Cancel Query Execution
    if (urlString.includes(API_ENDPOINTS.CANCEL_EXECUTION)) {
        try {
            const body = options?.body ? JSON.parse(options.body as string) : {};
            await cancelQueryExecution(body.executionId);

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            return new Response(
                JSON.stringify({ error: (error as Error).message }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    }

    // For all other requests, use the original fetch
    return originalFetch(url, options);
};

// Export for cleanup if needed
export const restoreFetch = () => {
    window.fetch = originalFetch;
};
