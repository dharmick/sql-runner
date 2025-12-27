import { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryContext } from '../../context/QueryContext';
import { LoadingScreen } from './LoadingScreen';
import { TableCell } from './TableCell';
import { ResultsMetadata } from './ResultsMetadata';
import { ComplexDataModal } from './ComplexDataModal';
import type { ColumnType } from '../../types/index';
import styles from './ResultsTable.module.css';
import { DEFAULT_COLUMN_WIDTH } from '../../constants/constants';

export const ResultsTable = () => {
    const { execution, rows, isLoading, error, loadMoreRows, hasMore } = useQueryContext();
    const parentRef = useRef<HTMLDivElement>(null);
    const [showScrollShadow, setShowScrollShadow] = useState(false);
    const [modalState, setModalState] = useState<{ content: string; type: ColumnType } | null>(null);

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40,
        overscan: 10,
    });

    // Handle scroll to load more rows
    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

        if (!lastItem) return;

        if (
            lastItem.index >= rows.length - 1 &&
            hasMore &&
            !isLoading
        ) {
            loadMoreRows();
        }
    }, [hasMore, loadMoreRows, rows.length, rowVirtualizer, isLoading]);

    // Handle horizontal scroll shadow
    useEffect(() => {
        const handleScroll = () => {
            if (parentRef.current) {
                setShowScrollShadow(parentRef.current.scrollLeft > 0);
            }
        };

        const parent = parentRef.current;
        if (parent) {
            parent.addEventListener('scroll', handleScroll);
            return () => parent.removeEventListener('scroll', handleScroll);
        }
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>⚠️</div>
                <h3 className={styles.errorTitle}>Query Failed</h3>
                <p className={styles.errorMessage}>{error}</p>
            </div>
        );
    }

    if (!execution || rows.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>📊</div>
                <h3 className={styles.emptyTitle}>No Results</h3>
                <p className={styles.emptyMessage}>Run a query to see results here</p>
            </div>
        );
    }

    const columns = execution.columns;
    const virtualItems = rowVirtualizer.getVirtualItems();

    const handleShowModal = (content: string, type: ColumnType) => {
        setModalState({ content, type });
    };

    const handleCloseModal = () => {
        setModalState(null);
    };

    return (
        <div className={styles.container}>
            <div ref={parentRef} className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={`${styles.thead} ${showScrollShadow ? styles.scrollShadow : ''}`}>
                        <tr className={styles.headerRow}>
                            {columns.map((column, index) => (
                                <th
                                    key={column.name}
                                    className={`${styles.headerCell} ${index === 0 ? styles.stickyColumn : ''}`}
                                    style={{ width: DEFAULT_COLUMN_WIDTH }}
                                >
                                    <div className={styles.headerContent}>
                                        <span className={styles.columnName}>{column.name}</span>
                                        <span className={styles.columnType}>{column.type}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody
                        className={styles.tbody}
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                        }}
                    >
                        {virtualItems.map((virtualRow) => {
                            const row = rows[virtualRow.index];
                            return (
                                <tr
                                    key={virtualRow.index}
                                    className={styles.row}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={column.name}
                                            className={`${styles.cell} ${colIndex === 0 ? styles.stickyColumn : ''} ${column.type === 'number' ? styles.numberCell : ''
                                                }`}
                                            style={{ width: DEFAULT_COLUMN_WIDTH }}
                                        >
                                            <TableCell value={row[column.name]} type={column.type} onShowModal={handleShowModal} />
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <ResultsMetadata />
            {modalState && (
                <ComplexDataModal
                    content={modalState.content}
                    type={modalState.type}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};
