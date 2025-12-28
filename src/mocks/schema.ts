// Static schema definition

export interface SchemaColumn {
    name: string;
    type: 'number' | 'string' | 'json' | 'array' | 'epoch';
}

export interface SchemaTable {
    name: string;
    columns: SchemaColumn[];
}

export interface SchemaDatabase {
    name: string;
    tables: SchemaTable[];
}

export interface Schema {
    databases: SchemaDatabase[];
}

export const mockSchema: Schema = {
    databases: [
        {
            name: 'production_db',
            tables: [
                {
                    name: 'users',
                    columns: [
                        { name: 'id', type: 'number' },
                        { name: 'name', type: 'string' },
                        { name: 'email', type: 'string' },
                        { name: 'metadata', type: 'json' },
                        { name: 'created_at', type: 'epoch' }
                    ]
                },
                {
                    name: 'products',
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
                    ]
                },
                {
                    name: 'transactions',
                    columns: [
                        { name: 'id', type: 'number' },
                        { name: 'user_id', type: 'number' },
                        { name: 'amount', type: 'number' },
                        { name: 'currency', type: 'string' },
                        { name: 'status', type: 'string' },
                        { name: 'payment_method', type: 'string' },
                        { name: 'created_at', type: 'epoch' }
                    ]
                }
            ]
        },
        {
            name: 'analytics_db',
            tables: [
                {
                    name: 'analytics',
                    columns: [
                        { name: 'id', type: 'number' },
                        { name: 'event_name', type: 'string' },
                        { name: 'user_id', type: 'number' },
                        { name: 'timestamp', type: 'epoch' },
                        { name: 'properties', type: 'json' }
                    ]
                }
            ]
        }
    ]
};
