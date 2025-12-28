// Table column width constants
export const DEFAULT_COLUMN_WIDTH = 200;
export const MIN_COLUMN_WIDTH = 150;
export const MAX_COLUMN_WIDTH = 500;

// API endpoint constants
export const API_ENDPOINTS = {
    CREATE_EXECUTION: '/api/query/execute',
    GET_EXECUTION: '/api/query/execution',
    FETCH_ROWS: '/api/query/rows',
    CANCEL_EXECUTION: '/api/query/cancel',
} as const;

export const QUERY_EXECUTION_POLLING_INTERVAL = 1000;