import { useState, useMemo } from 'react';
import { Dropdown, type DropdownOption } from '../common/Dropdown/Dropdown';
import { mockSchema, type SchemaDatabase, type SchemaTable } from '../../mocks/schema';
import styles from './SchemaExplorer.module.css';

export function SchemaExplorer() {
    const [selectedDatabase, setSelectedDatabase] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    const databaseOptions: DropdownOption[] = useMemo(
        () => mockSchema.databases.map(db => ({ label: db.name, value: db.name })),
        []
    );

    const currentDatabase: SchemaDatabase | undefined = useMemo(
        () => mockSchema.databases.find(db => db.name === selectedDatabase),
        [selectedDatabase]
    );
    const tableOptions: DropdownOption[] = useMemo(
        () => currentDatabase?.tables.map(table => ({ label: table.name, value: table.name })) || [],
        [currentDatabase]
    );

    const currentTable: SchemaTable | undefined = useMemo(
        () => currentDatabase?.tables.find(table => table.name === selectedTable),
        [currentDatabase, selectedTable]
    );

    const handleDatabaseChange = (dbName: string) => {
        setSelectedDatabase(dbName);
        setSelectedTable(null);
    };

    const handleTableChange = (tableName: string) => {
        setSelectedTable(tableName);
    };

    return (
        <div className={styles.schemaExplorer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Schema Explorer</h2>
            </div>

            <div className={styles.content}>
                <div className={styles.dropdownSection}>
                    <Dropdown
                        label="Database"
                        placeholder="Select database..."
                        options={databaseOptions}
                        value={selectedDatabase}
                        onChange={handleDatabaseChange}
                    />
                </div>

                <div className={styles.dropdownSection}>
                    <Dropdown
                        label="Table"
                        placeholder="Select table..."
                        options={tableOptions}
                        value={selectedTable}
                        onChange={handleTableChange}
                        disabled={!selectedDatabase}
                    />
                </div>

                {currentTable && (
                    <div className={styles.columnsSection}>
                        <h3 className={styles.columnsTitle}>Columns</h3>
                        <div className={styles.columnsList}>
                            {currentTable.columns.map((column, index) => (
                                <div key={index} className={styles.columnItem}>
                                    <span className={styles.columnName}>{column.name}</span>
                                    <span className={styles.columnType}>{column.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!currentTable && selectedDatabase && selectedTable && (
                    <div className={styles.emptyState}>
                        <p>No columns found for this table</p>
                    </div>
                )}

                {!selectedDatabase && (
                    <div className={styles.emptyState}>
                        <p>Select a database to explore its schema</p>
                    </div>
                )}
            </div>
        </div>
    );
}
