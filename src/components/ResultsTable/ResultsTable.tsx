import { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryContext } from '../../context/QueryContext';
import { useDebounce } from '../../hooks';
import { LoadingScreen } from './LoadingScreen';
import { TableCell } from './TableCell';
import { ResultsMetadata } from './ResultsMetadata';
import { ComplexDataModal } from './ComplexDataModal';
import { ResizableColumnHeader } from './ResizableColumnHeader';
import type { ColumnType } from '../../types/index';
import styles from './ResultsTable.module.css';
import { DEFAULT_COLUMN_WIDTH } from '../../constants/constants';

export const ResultsTable = () => {
    const { execution, rowsMap, isLoading, error, loadMoreRows } = useQueryContext();
    const parentRef = useRef<HTMLDivElement>(null);
    const [showScrollShadow, setShowScrollShadow] = useState(false);
    const [modalState, setModalState] = useState<{ content: string; type: ColumnType } | null>(null);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [resizingColumn, setResizingColumn] = useState<string | null>(null);

    const rowVirtualizer = useVirtualizer({
        count: execution?.totalRows || 0,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40,
        overscan: 10,
    });

    // Handle scroll to load more rows (debounced)
    const debouncedLoadMoreRows = useDebounce(
        (startIndex: number, endIndex: number) => {
            loadMoreRows(startIndex, endIndex);
        },
        550
    );

    useEffect(() => {
        const virtualItems = rowVirtualizer.getVirtualItems();
        if (virtualItems.length === 0) return;

        const startIndex = virtualItems[0].index;
        const endIndex = virtualItems[virtualItems.length - 1].index;

        debouncedLoadMoreRows(startIndex, endIndex);
    }, [
        rowVirtualizer.range?.startIndex,
        rowVirtualizer.range?.endIndex,
        debouncedLoadMoreRows
    ]);

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

    if (!execution || (execution.totalRows === 0)) {
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

    const handleColumnWidthChange = (columnName: string, newWidth: number) => {
        setColumnWidths(prev => ({ ...prev, [columnName]: newWidth }));
    };

    const handleResizingChange = (columnName: string | null) => {
        setResizingColumn(columnName);
    };

    return (
        <div className={styles.container}>
            <div ref={parentRef} className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={`${styles.thead} ${showScrollShadow ? styles.scrollShadow : ''}`}>
                        <tr className={styles.headerRow}>
                            {columns.map((column, index) => (
                                <ResizableColumnHeader
                                    key={column.name}
                                    columnName={column.name}
                                    columnType={column.type}
                                    isSticky={index === 0}
                                    currentWidth={columnWidths[column.name] || DEFAULT_COLUMN_WIDTH}
                                    onWidthChange={handleColumnWidthChange}
                                    onResizingChange={handleResizingChange}
                                    isResizing={resizingColumn === column.name}
                                />
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
                            const row = rowsMap.get(virtualRow.index);

                            // Show loading placeholder if row not loaded yet
                            if (!row) {
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
                                        <td colSpan={columns.length} className={styles.loadingCell}>
                                            Loading...
                                        </td>
                                    </tr>
                                );
                            }

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
                                            style={{ width: columnWidths[column.name] || DEFAULT_COLUMN_WIDTH }}
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
