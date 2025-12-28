/**
 * Mock Query Execution Simulation
 * 
 * This file simulates a real backend API for query execution.
 * 
 * Features:
 * - Simulates async query execution lifecycle (queued → running → completed/failed)
 * - Supports query cancellation
 * - Simulates execution delays and timeouts
 * - Provides cursor-based pagination for result rows
 * - Maps SQL queries to appropriate data sources
 */

import type { QueryExecution, FetchRowsResponse, DataSource } from '../types/index';
import { sampleQueries } from './sampleQueries';
import { sleep } from '../utils/common';

let currentExecution: {
    executionId: string;
    sql: string;
    dataSource: DataSource;
    status: QueryExecution['status'];
    startedAt: string;
    finishedAt: string | null;
    error: { message: string } | null;
    cancelled: boolean;
} | null = null;

let executionCounter = 0;

const getDataSourceForSQL = (sql: string): DataSource => {
    const lowerSQL = sql.toLowerCase().trim();

    if (lowerSQL.includes('from users')) {
        return sampleQueries[0].dataSource;
    } else if (lowerSQL.includes('from analytics')) {
        return sampleQueries[1].dataSource;
    } else if (lowerSQL.includes('from products')) {
        return sampleQueries[2].dataSource;
    } else if (lowerSQL.includes('from transactions')) {
        return sampleQueries[3].dataSource;
    }

    return sampleQueries[0].dataSource;
};

// Simulate query execution lifecycle
const simulateAsyncExecution = async (executionId: string) => {
    if (!currentExecution || currentExecution.executionId !== executionId) return;

    const dataSource = currentExecution.dataSource;

    // Simulate queued state
    await sleep(300);
    if (currentExecution?.cancelled) {
        currentExecution.status = 'cancelled';
        currentExecution.finishedAt = new Date().toISOString();
        return;
    }

    // Move to running
    if (currentExecution) {
        currentExecution.status = 'running';
    }

    // Simulate execution time
    const executionTime = dataSource.executionTimeMs;
    const checkInterval = 100;
    let elapsed = 0;

    while (elapsed < executionTime) {
        await sleep(checkInterval);
        elapsed += checkInterval;

        if (currentExecution?.cancelled) {
            currentExecution.status = 'cancelled';
            currentExecution.finishedAt = new Date().toISOString();
            return;
        }
    }

    // Check if it should timeout
    if (executionTime >= 15000) {
        if (currentExecution) {
            currentExecution.status = 'failed';
            currentExecution.error = { message: 'Query timed out after 15 seconds' };
            currentExecution.finishedAt = new Date().toISOString();
        }
        return;
    }

    // Complete successfully
    if (currentExecution && !currentExecution.cancelled) {
        currentExecution.status = 'completed';
        currentExecution.finishedAt = new Date().toISOString();
    }
};

// API Methods
export const createQueryExecution = async (sql: string): Promise<{ executionId: string }> => {
    await sleep(100); // Simulate network delay

    const executionId = `exec_${++executionCounter}`;
    const dataSource = getDataSourceForSQL(sql);

    currentExecution = {
        executionId,
        sql,
        dataSource,
        status: 'queued',
        startedAt: new Date().toISOString(),
        finishedAt: null,
        error: null,
        cancelled: false
    };

    // Start async execution
    simulateAsyncExecution(executionId);

    return { executionId };
};

export const getQueryExecution = async (executionId: string): Promise<QueryExecution> => {
    await sleep(50); // Simulate network delay

    if (!currentExecution || currentExecution.executionId !== executionId) {
        throw new Error('Execution not found');
    }

    const exec = currentExecution;

    return {
        executionId: exec.executionId,
        sql: exec.sql,
        status: exec.status,
        totalRows: exec.status === 'completed' ? exec.dataSource.totalRows : null,
        startedAt: exec.startedAt,
        finishedAt: exec.finishedAt,
        executionTimeMs: exec.finishedAt
            ? new Date(exec.finishedAt).getTime() - new Date(exec.startedAt).getTime()
            : null,
        columns: exec.status === 'completed' ? exec.dataSource.columns : [],
        error: exec.error
    };
};

export const fetchRows = async (
    executionId: string,
    offset: number = 0,
    limit: number = 50
): Promise<FetchRowsResponse> => {
    await sleep(100); // Simulate network delay

    if (!currentExecution || currentExecution.executionId !== executionId) {
        throw new Error('Execution not found');
    }

    if (currentExecution.status !== 'completed') {
        throw new Error('Query not completed yet');
    }

    const rows = await currentExecution.dataSource.fetchRows(offset, limit);

    return {
        rows,
        offset,
        limit,
        totalRows: currentExecution.dataSource.totalRows
    };
};

export const cancelQueryExecution = async (executionId: string): Promise<void> => {
    await sleep(50); // Simulate network delay

    if (!currentExecution || currentExecution.executionId !== executionId) {
        throw new Error('Execution not found');
    }

    if (currentExecution.status === 'queued' || currentExecution.status === 'running') {
        currentExecution.cancelled = true;
    }
};
