import styles from './StatusMessage.module.css';

type StatusMessageProps = {
    type: 'error' | 'empty';
    title: string;
    message: string;
};

export const StatusMessage = ({ type, title, message }: StatusMessageProps) => {
    const isError = type === 'error';

    return (
        <div className={styles.container}>
            <div className={`${styles.icon} ${isError ? styles.errorIcon : ''}`}>
                {isError ? '⚠️' : '📊'}
            </div>
            <h3 className={`${styles.title} ${isError ? styles.errorTitle : ''}`}>
                {title}
            </h3>
            <p className={styles.message}>{message}</p>
        </div>
    );
};
