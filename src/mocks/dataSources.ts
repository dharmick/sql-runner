import type { DataSource, Row } from '../types/index';
import { sleep } from '../utils/common';
import { generateUsers, generateProducts, generateTransactions } from './generators';

export const usersDataSource: DataSource = {
    totalRows: 1000,
    executionTimeMs: 2000,
    columns: [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'metadata', type: 'json' },
        { name: 'created_at', type: 'epoch' }
    ],
    async fetchRows(offset: number, limit: number): Promise<Row[]> {
        await sleep(200); // Simulate network delay
        if (offset >= this.totalRows) return [];
        const actualLimit = Math.min(limit, this.totalRows - offset);
        return generateUsers(offset, actualLimit);
    }
};

export const analyticsDataSource: DataSource = {
    totalRows: 0,
    executionTimeMs: 15000, // Will timeout
    columns: [],
    async fetchRows(): Promise<Row[]> {
        throw new Error('This query will timeout');
    }
};

export const productsDataSource: DataSource = {
    totalRows: 25000,
    executionTimeMs: 3500,
    columns: [
        { name: 'id', type: 'number' },
        { name: 'sku', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'stock', type: 'number' },
        { name: 'weight_kg', type: 'number' },
        { name: 'dimensions', type: 'string' },
        { name: 'manufacturer', type: 'string' },
        { name: 'warranty_months', type: 'number' },
        { name: 'tags', type: 'array' },
        { name: 'specifications', type: 'json' },
        { name: 'rating', type: 'number' },
        { name: 'reviews_count', type: 'number' },
        { name: 'created_at', type: 'epoch' }
    ],
    async fetchRows(offset: number, limit: number): Promise<Row[]> {
        await sleep(250);
        if (offset >= this.totalRows) return [];
        const actualLimit = Math.min(limit, this.totalRows - offset);
        return generateProducts(offset, actualLimit);
    }
};

export const transactionsDataSource: DataSource = {
    totalRows: 100000,
    executionTimeMs: 4000,
    columns: [
        { name: 'id', type: 'number' },
        { name: 'user_id', type: 'number' },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'payment_method', type: 'string' },
        { name: 'created_at', type: 'epoch' }
    ],
    async fetchRows(offset: number, limit: number): Promise<Row[]> {
        await sleep(180);
        if (offset >= this.totalRows) return [];
        const actualLimit = Math.min(limit, this.totalRows - offset);
        return generateTransactions(offset, actualLimit);
    }
};
