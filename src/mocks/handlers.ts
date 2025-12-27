import { http, HttpResponse, delay } from 'msw';
import { API_ENDPOINTS } from '../constants/constants';
import {
    createQueryExecution,
    getQueryExecution,
    fetchRows,
    cancelQueryExecution,
} from './mockApi';

export const handlers = [
    // Mock: Create Query Execution
    http.post(API_ENDPOINTS.CREATE_EXECUTION, async ({ request }) => {
        try {
            const body = await request.json() as { sql: string };
            const result = await createQueryExecution(body.sql);

            // Add a small delay to simulate network latency
            await delay(100);

            return HttpResponse.json(result, { status: 200 });
        } catch (error) {
            return HttpResponse.json(
                { error: (error as Error).message },
                { status: 500 }
            );
        }
    }),

    // Mock: Get Query Execution Status
    http.get(API_ENDPOINTS.GET_EXECUTION, async ({ request }) => {
        try {
            const url = new URL(request.url);
            const executionId = url.searchParams.get('executionId');

            if (!executionId) {
                return HttpResponse.json(
                    { error: 'executionId is required' },
                    { status: 400 }
                );
            }

            const result = await getQueryExecution(executionId);

            // Add a small delay to simulate network latency
            await delay(50);

            return HttpResponse.json(result, { status: 200 });
        } catch (error) {
            return HttpResponse.json(
                { error: (error as Error).message },
                { status: 404 }
            );
        }
    }),

    // Mock: Fetch Rows
    http.get(API_ENDPOINTS.FETCH_ROWS, async ({ request }) => {
        try {
            const url = new URL(request.url);
            const executionId = url.searchParams.get('executionId');
            const cursor = url.searchParams.get('cursor');
            const limit = parseInt(url.searchParams.get('limit') || '50', 10);

            if (!executionId) {
                return HttpResponse.json(
                    { error: 'executionId is required' },
                    { status: 400 }
                );
            }

            const result = await fetchRows(executionId, cursor, limit);

            // Add a small delay to simulate network latency
            await delay(100);

            return HttpResponse.json(result, { status: 200 });
        } catch (error) {
            return HttpResponse.json(
                { error: (error as Error).message },
                { status: 400 }
            );
        }
    }),

    // Mock: Cancel Query Execution
    http.post(API_ENDPOINTS.CANCEL_EXECUTION, async ({ request }) => {
        try {
            const body = await request.json() as { executionId: string };
            await cancelQueryExecution(body.executionId);

            // Add a small delay to simulate network latency
            await delay(50);

            return HttpResponse.json({ success: true }, { status: 200 });
        } catch (error) {
            return HttpResponse.json(
                { error: (error as Error).message },
                { status: 404 }
            );
        }
    }),
];
