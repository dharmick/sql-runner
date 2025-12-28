import { useQueryContext } from '../../../context/QueryContext';
import { formatNumber, formatExecutionTime } from '../../../utils/formatters';
import { ExportDropdown } from '../../common/ExportDropdown';
import { exportAsCSV, exportAsJSON } from '../../../utils/exportUtils';
import styles from './ResultsMetadata.module.css';

export const ResultsMetadata = () => {
    const { execution } = useQueryContext();

    if (!execution || execution.status !== 'completed') {
        return null;
    }

    const handleExportCSV = () => {
        exportAsCSV(execution.columns, execution.executionId);
    };

    const handleExportJSON = () => {
        exportAsJSON(execution.columns, execution.executionId);
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <div className={styles.item}>
                    <span className={styles.label}>Total Rows:</span>
                    <span className={styles.value}>
                        {execution.totalRows !== null ? formatNumber(execution.totalRows) : 'N/A'}
                    </span>
                </div>
                <div className={styles.item}>
                    <span className={styles.label}>Execution Time:</span>
                    <span className={styles.value}>
                        {execution.executionTimeMs !== null ? formatExecutionTime(execution.executionTimeMs) : 'N/A'}
                    </span>
                </div>
                <div className={styles.item}>
                    <span className={styles.label}>Status:</span>
                    <span className={`${styles.badge} ${styles.completed}`}>
                        Completed
                    </span>
                </div>
            </div>
            <div className={styles.rightSection}>
                <ExportDropdown
                    onExportCSV={handleExportCSV}
                    onExportJSON={handleExportJSON}
                />
            </div>
        </div>
    );
};
