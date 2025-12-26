export type ColumnType = 'number' | 'string' | 'boolean' | 'json' | 'array' | 'epoch' | 'null';

export interface ColumnMetadata {
    name: string;
    type: ColumnType;
}

export interface Row {
    [key: string]: any;
}

export interface DataSource {
    totalRows: number;
    columns: ColumnMetadata[];
    executionTimeMs: number;
    fetchRows(offset: number, limit: number): Promise<Row[]>;
}

export type QueryStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface QueryExecution {
    executionId: string;
    sql: string;
    status: QueryStatus;
    totalRows: number | null;
    startedAt: string | null;
    finishedAt: string | null;
    executionTimeMs: number | null;
    columns: ColumnMetadata[];
    error: { message: string } | null;
}

export interface FetchRowsResponse {
    rows: Row[];
    nextCursor: string | null;
    hasMore: boolean;
}

export interface SampleQuery {
    id: string;
    title: string;
    sql: string;
    dataSource: DataSource;
}
