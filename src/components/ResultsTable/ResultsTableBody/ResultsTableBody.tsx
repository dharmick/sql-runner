import type { VirtualItem } from '@tanstack/react-virtual';
import { TableCell } from '../TableCell/TableCell';
import { LoadingRow } from '../LoadingRow/LoadingRow';
import type { Row, ColumnType } from '../../../types';
import { DEFAULT_COLUMN_WIDTH } from '../../../constants/constants';
import styles from './ResultsTableBody.module.css';

type ResultsTableBodyProps = {
    virtualItems: VirtualItem[];
    rowsMap: Map<number, Row>;
    columns: Array<{ name: string; type: ColumnType }>;
    columnWidths: Record<string, number>;
    totalHeight: number;
    onShowModal: (content: string, type: ColumnType) => void;
};

export const ResultsTableBody = ({
    virtualItems,
    rowsMap,
    columns,
    columnWidths,
    totalHeight,
    onShowModal
}: ResultsTableBodyProps) => {
    return (
        <tbody
            className={styles.tbody}
            style={{
                height: `${totalHeight}px`,
            }}
        >
            {virtualItems.map((virtualRow) => {
                const row = rowsMap.get(virtualRow.index);

                // Show loading placeholder if row not loaded yet
                if (!row) {
                    return (
                        <LoadingRow
                            key={virtualRow.index}
                            columnsLength={columns.length}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        />
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
                                <TableCell value={row[column.name]} type={column.type} onShowModal={onShowModal} />
                            </td>
                        ))}
                    </tr>
                );
            })}
        </tbody>
    );
};
