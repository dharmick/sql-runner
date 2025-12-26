import type { Row } from '../types/index';

// Helper to generate mock data
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
