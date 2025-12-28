import React from 'react';
import type { ColumnType } from '../../types/index';
import { formatNumber, formatEpoch, truncateString, formatJSON, truncateArray } from '../../utils/formatters';
import styles from './TableCell.module.css';

interface TableCellProps {
    value: any;
    type: ColumnType;
    onShowModal?: (content: string, type: ColumnType) => void;
}

export const TableCell: React.FC<TableCellProps> = ({ value, type, onShowModal }) => {
    const handleClick = () => {
        if (type === 'json' || type === 'array' || type === 'epoch') {
            const content = getModalContent();
            onShowModal?.(content, type);
        }
    };

    const renderValue = () => {
        if (value === null || value === undefined) {
            return <span className={styles.null}>NULL</span>;
        }

        switch (type) {
            case 'number':
                return <span className={styles.number}>{formatNumber(value)}</span>;

            case 'boolean':
                return (
                    <span className={value ? styles.booleanTrue : styles.booleanFalse}>
                        {String(value)}
                    </span>
                );

            case 'json':
                return (
                    <span className={styles.clickable} onClick={handleClick}>
                        {truncateString(JSON.stringify(value), 60)}
                    </span>
                );

            case 'array':
                return (
                    <span className={styles.clickable} onClick={handleClick}>
                        {truncateArray(value, 3)}
                    </span>
                );

            case 'epoch':
                return (
                    <span className={styles.clickable} onClick={handleClick}>
                        {formatNumber(value)}
                    </span>
                );

            case 'string':
            default:
                return <span>{truncateString(String(value), 60)}</span>;
        }
    };

    const getModalContent = () => {
        if (type === 'json') {
            return formatJSON(value);
        } else if (type === 'array') {
            return value.join('\n');
        } else if (type === 'epoch') {
            return formatEpoch(value);
        }
        return '';
    };

    return (
        <div className={styles.cell}>
            {renderValue()}
        </div>
    );
};
