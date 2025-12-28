import type { Row } from '../types/index';
import type { ColumnMetadata } from '../types';

// Helpers to generate mock data
export const generateUsers = (offset: number, limit: number): Row[] => {
    return Array.from({ length: limit }, (_, i) => {
        const index = offset + i;
        return {
            id: index + 1,
            name: `User ${index + 1}`,
            email: `user${index + 1}@demo.com`,
            metadata: {
                role: index % 2 === 0 ? 'admin' : 'user',
                active: index % 3 !== 0,
                department: ['Engineering', 'Sales', 'Marketing', 'Support'][index % 4]
            },
            created_at: 1703577600 + (index * 86400) // Daily increments from Dec 26, 2023
        };
    });
};

export const generateProducts = (offset: number, limit: number): Row[] => {
    return Array.from({ length: limit }, (_, i) => {
        const index = offset + i;
        return {
            id: index + 1,
            sku: `SKU-${String(index + 1).padStart(6, '0')}`,
            name: `Product ${index + 1}`,
            category: ['Electronics', 'Clothing', 'Home', 'Sports'][index % 4],
            price: Math.round((Math.random() * 1000 + 10) * 100) / 100,
            stock: Math.floor(Math.random() * 1000),
            weight_kg: Math.round((Math.random() * 50 + 0.1) * 100) / 100,
            dimensions: `${Math.floor(Math.random() * 50 + 10)}x${Math.floor(Math.random() * 50 + 10)}x${Math.floor(Math.random() * 50 + 10)}`,
            manufacturer: `Manufacturer ${(index % 10) + 1}`,
            warranty_months: [12, 24, 36, 48][index % 4],
            tags: [
                ['new', 'featured'],
                ['sale', 'clearance'],
                ['bestseller'],
                ['premium', 'limited']
            ][index % 4],
            specifications: {
                color: ['Red', 'Blue', 'Green', 'Black'][index % 4],
                material: ['Plastic', 'Metal', 'Wood', 'Fabric'][index % 4],
                origin: ['USA', 'China', 'Germany', 'Japan'][index % 4]
            },
            rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
            reviews_count: Math.floor(Math.random() * 500),
            created_at: 1703577600 + (index * 3600) // Hourly increments
        };
    });
};

export const generateTransactions = (offset: number, limit: number): Row[] => {
    return Array.from({ length: limit }, (_, i) => {
        const index = offset + i;
        return {
            id: index + 1,
            user_id: Math.floor(Math.random() * 10000) + 1,
            amount: Math.round((Math.random() * 5000 + 10) * 100) / 100,
            currency: ['USD', 'EUR', 'GBP', 'JPY'][index % 4],
            status: ['completed', 'pending', 'failed'][index % 3],
            payment_method: ['credit_card', 'paypal', 'bank_transfer'][index % 3],
            created_at: 1703577600 + (index * 60) // Minute increments
        };
    });
};

/**
 * Generates mock CSV data for export
 */
export const generateMockCSVData = (columns: ColumnMetadata[]): string => {
    // Header row
    const headers = columns.map(col => col.name).join(',');

    // Mock data rows (5 sample rows)
    const mockRows = Array.from({ length: 5 }, (_, i) => {
        return columns.map(col => {
            switch (col.type) {
                case 'number':
                    return Math.floor(Math.random() * 1000);
                case 'string':
                    return `"Sample ${i + 1}"`;
                case 'boolean':
                    return Math.random() > 0.5;
                case 'epoch':
                    return Date.now() - Math.floor(Math.random() * 1000000);
                case 'null':
                    return 'null';
                default:
                    return `"value_${i + 1}"`;
            }
        }).join(',');
    }).join('\n');

    return `${headers}\n${mockRows}`;
};

/**
 * Generates mock JSON data for export
 */
export const generateMockJSONData = (columns: ColumnMetadata[]): Row[] => {
    // Mock data rows (5 sample rows)
    return Array.from({ length: 5 }, (_, i) => {
        const row: Row = {};
        columns.forEach(col => {
            switch (col.type) {
                case 'number':
                    row[col.name] = Math.floor(Math.random() * 1000);
                    break;
                case 'string':
                    row[col.name] = `Sample ${i + 1}`;
                    break;
                case 'boolean':
                    row[col.name] = Math.random() > 0.5;
                    break;
                case 'epoch':
                    row[col.name] = Date.now() - Math.floor(Math.random() * 1000000);
                    break;
                case 'json':
                    row[col.name] = { key: `value_${i + 1}` };
                    break;
                case 'array':
                    row[col.name] = [`item_${i + 1}_1`, `item_${i + 1}_2`];
                    break;
                case 'null':
                    row[col.name] = null;
                    break;
                default:
                    row[col.name] = `value_${i + 1}`;
            }
        });
        return row;
    });
};
