import { useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { DownloadIcon } from './icons/DownloadIcon';
import { ChevronIcon } from './icons/ChevronIcon';
import { CsvIcon } from './icons/CsvIcon';
import { JsonIcon } from './icons/JsonIcon';
import styles from './ExportDropdown.module.css';

export interface ExportDropdownProps {
    onExportCSV: () => void;
    onExportJSON: () => void;
}

export const ExportDropdown = ({ onExportCSV, onExportJSON }: ExportDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

    const handleExport = (format: 'csv' | 'json') => {
        if (format === 'csv') {
            onExportCSV();
        } else {
            onExportJSON();
        }
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                className={styles.button}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span className={styles.icon}>
                    <DownloadIcon />
                </span>
                Export
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                    <ChevronIcon />
                </span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <button
                        className={styles.option}
                        onClick={() => handleExport('csv')}
                    >
                        <span className={styles.optionIcon}>
                            <CsvIcon />
                        </span>
                        Export as CSV
                    </button>
                    <button
                        className={styles.option}
                        onClick={() => handleExport('json')}
                    >
                        <span className={styles.optionIcon}>
                            <JsonIcon />
                        </span>
                        Export as JSON
                    </button>
                </div>
            )}
        </div>
    );
};
