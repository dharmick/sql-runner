import { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryContext } from '../../context/QueryContext';
import { useDebounce } from '../../hooks';
import { LoadingScreen } from './LoadingScreen/LoadingScreen';
import { ResultsMetadata } from './ResultsMetadata/ResultsMetadata';
import { ComplexDataModal } from './ComplexDataModal/ComplexDataModal';
import { ResultsTableHeader } from './ResultsTableHeader/ResultsTableHeader';
import { ResultsTableBody } from './ResultsTableBody/ResultsTableBody';
import { StatusMessage } from './StatusMessage/StatusMessage';
import type { ColumnType } from '../../types/index';
import styles from './ResultsTable.module.css';

export const ResultsTable = () => {
    const { execution, rowsMap, isLoading, error, loadMoreRows } = useQueryContext();
    const parentRef = useRef<HTMLDivElement>(null);
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

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <StatusMessage type="error" title="Query Failed" message={error} />;
    }

    if (!execution || (execution.totalRows === 0)) {
        return <StatusMessage type="empty" title="No Results" message="Run a query to see results here" />;
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
                    <ResultsTableHeader
                        columns={columns}
                        columnWidths={columnWidths}
                        resizingColumn={resizingColumn}
                        onWidthChange={handleColumnWidthChange}
                        onResizingChange={handleResizingChange}
                    />
                    <ResultsTableBody
                        virtualItems={virtualItems}
                        rowsMap={rowsMap}
                        columns={columns}
                        columnWidths={columnWidths}
                        totalHeight={rowVirtualizer.getTotalSize()}
                        onShowModal={handleShowModal}
                    />
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
