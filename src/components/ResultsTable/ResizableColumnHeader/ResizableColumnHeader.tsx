import { MAX_COLUMN_WIDTH, MIN_COLUMN_WIDTH } from '../../../constants/constants';
import { useResizable } from '../../../hooks';
import type { ColumnType } from '../../../types';
import styles from './ResizableColumnHeader.module.css';

interface ResizableColumnHeaderProps {
    columnName: string;
    columnType: ColumnType;
    isSticky: boolean;
    currentWidth: number;
    onWidthChange: (columnName: string, newWidth: number) => void;
    onResizingChange: (columnName: string | null) => void;
    isResizing: boolean;
}

export const ResizableColumnHeader = ({
    columnName,
    columnType,
    isSticky,
    currentWidth,
    onWidthChange,
    onResizingChange,
    isResizing,
}: ResizableColumnHeaderProps) => {
    const { handleMouseDown } = useResizable(currentWidth, {
        minWidth: MIN_COLUMN_WIDTH,
        maxWidth: MAX_COLUMN_WIDTH,
        onResize: (newWidth) => {
            onWidthChange(columnName, newWidth);
        },
        onResizeStart: () => {
            onResizingChange(columnName);
        },
        onResizeEnd: () => {
            onResizingChange(null);
        },
    });

    return (
        <th
            className={`${styles.headerCell} ${isSticky ? styles.stickyColumn : ''}`}
            style={{ width: currentWidth }}
        >
            <div className={styles.headerContent}>
                <span className={styles.columnName}>{columnName}</span>
                <span className={styles.columnType}>{columnType}</span>
            </div>
            <div
                className={`${styles.resizeHandle} ${isResizing ? styles.resizing : ''}`}
                onMouseDown={handleMouseDown}
            />
        </th>
    );
};
