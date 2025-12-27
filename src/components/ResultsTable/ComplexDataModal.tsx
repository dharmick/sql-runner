import React, { useEffect } from 'react';
import type { ColumnType } from '../../types/index';
import styles from './ComplexDataModal.module.css';

type ComplexDataModalProps = {
    content: string;
    onClose: () => void;
    type: ColumnType;
}

export const ComplexDataModal = ({
    content,
    onClose,
    type
}: ComplexDataModalProps) => {

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <span className={styles.title}>
                        {type === 'json' ? 'JSON Data' : type === 'array' ? 'Array Data' : 'Formatted Date'}
                    </span>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <div className={styles.content}>
                    <pre className={styles.pre}>{content}</pre>
                </div>
            </div>
        </div>
    );
};
