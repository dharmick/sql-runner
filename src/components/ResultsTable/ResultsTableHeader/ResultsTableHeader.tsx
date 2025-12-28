import { DEFAULT_COLUMN_WIDTH } from '../../../constants/constants';
import type { ColumnType } from '../../../types';
import { ResizableColumnHeader } from '../ResizableColumnHeader/ResizableColumnHeader';
import styles from './ResultsTableHeader.module.css';

type ResultsTableHeaderProps = {
    columns: Array<{ name: string; type: ColumnType }>;
    columnWidths: Record<string, number>;
    resizingColumn: string | null;
    onWidthChange: (columnName: string, newWidth: number) => void;
    onResizingChange: (columnName: string | null) => void;
};

export const ResultsTableHeader = ({
    columns,
    columnWidths,
    resizingColumn,
    onWidthChange,
    onResizingChange
}: ResultsTableHeaderProps) => {
    return (
        <thead className={styles.thead}>
            <tr className={styles.headerRow}>
                {columns.map((column, index) => (
                    <ResizableColumnHeader
                        key={column.name}
                        columnName={column.name}
                        columnType={column.type}
                        isSticky={index === 0}
                        currentWidth={columnWidths[column.name] || DEFAULT_COLUMN_WIDTH}
                        onWidthChange={onWidthChange}
                        onResizingChange={onResizingChange}
                        isResizing={resizingColumn === column.name}
                    />
                ))}
            </tr>
        </thead>
    );
};
