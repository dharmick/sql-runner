import { usersDataSource, analyticsDataSource, productsDataSource, transactionsDataSource } from './dataSources';

export const sampleQueries = [
    {
        id: 'q1',
        title: 'Get all users',
        sql: 'SELECT * FROM users;',
        dataSource: usersDataSource
    },
    {
        id: 'q2',
        title: 'Analytics report (slow)',
        sql: "SELECT * FROM analytics WHERE date > '2024-01-01';",
        dataSource: analyticsDataSource
    },
    {
        id: 'q3',
        title: 'Product catalog (wide table)',
        sql: 'SELECT * FROM products;',
        dataSource: productsDataSource
    },
    {
        id: 'q4',
        title: 'Transaction history (large dataset)',
        sql: 'SELECT * FROM transactions;',
        dataSource: transactionsDataSource
    }
];
