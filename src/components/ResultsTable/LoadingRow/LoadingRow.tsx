import styles from './LoadingRow.module.css';

type LoadingRowProps = {
    columnsLength: number;
    style: React.CSSProperties;
};

export const LoadingRow = ({ columnsLength, style }: LoadingRowProps) => {
    return (
        <tr
            className={styles.row}
            style={style}
        >
            <td colSpan={columnsLength} className={styles.loadingCell}>
                Loading...
            </td>
        </tr>
    );
};
