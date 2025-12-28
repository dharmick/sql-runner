import { useQueryContext } from '../../../context/QueryContext';
import styles from './LoadingScreen.module.css';

export const LoadingScreen = () => {
    const { cancelQuery, toggleNotify, notifyEnabled } = useQueryContext();
    console.log("loadingggggg")

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.spinner}></div>
                <p className={styles.text}>Running query...</p>
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={cancelQuery}>
                        Cancel
                    </button>
                    <button
                        className={`${styles.notifyButton} ${notifyEnabled ? styles.active : ''}`}
                        onClick={toggleNotify}
                    >
                        {notifyEnabled ? '🔔 Notify Enabled' : '🔕 Notify Me'}
                    </button>
                </div>
            </div>
        </div>
    );
};
