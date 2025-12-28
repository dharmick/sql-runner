import { createContext, useContext } from 'react';
import type { QueryExecution, Row } from '../types/index';

export type QueryContextType = {
    editorValue: string;
    setEditorValue: (sql: string) => void;
    execution: QueryExecution | null;
    rowsMap: Map<number, Row>;
    isLoading: boolean;
    error: string | null;
    notifyEnabled: boolean;
    runQuery: (queryToRun: string) => Promise<void>;
    cancelQuery: () => Promise<void>;
    toggleNotify: () => Promise<void>;
    loadMoreRows: (startIndex: number, endIndex: number) => Promise<void>;
}

export const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const useQueryContext = () => {
    const context = useContext(QueryContext);
    if (!context) {
        throw new Error('useQuery must be used within QueryProvider');
    }
    return context;
};


