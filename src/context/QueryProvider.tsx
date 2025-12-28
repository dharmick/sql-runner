import { type QueryContextType, QueryContext } from './QueryContext';
import { useLocalStoragePersistence, useQueryExecutor, useNotification } from '../hooks';

type QueryProviderProps = {
    children: React.ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
    const [editorValue, setEditorValue] = useLocalStoragePersistence('query-editor-value', '');
    const { notifyEnabled, toggleNotify, resetNotify } = useNotification();

    const {
        execution,
        isLoading,
        error,
        rowsMap,
        runQuery,
        cancelQuery,
        loadMoreRows
    } = useQueryExecutor({ notifyEnabled, resetNotify });

    const value: QueryContextType = {
        editorValue,
        setEditorValue,
        execution,
        rowsMap,
        isLoading,
        error,
        notifyEnabled,
        runQuery,
        cancelQuery,
        toggleNotify,
        loadMoreRows,
    };

    return <QueryContext.Provider value={value}>{children}</QueryContext.Provider>;
};
