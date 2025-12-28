import type { ColumnMetadata } from '../types';
import { generateMockCSVData, generateMockJSONData } from '../mocks/generators';

/**
 * Downloads a file with the given content
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Exports query results as CSV (mocked implementation)
 */
export const exportAsCSV = (columns: ColumnMetadata[], executionId: string) => {
    const csvContent = generateMockCSVData(columns);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `query_results_${executionId}_${timestamp}.csv`;
    downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
};

/**
 * Exports query results as JSON (mocked implementation)
 */
export const exportAsJSON = (columns: ColumnMetadata[], executionId: string) => {
    const jsonData = generateMockJSONData(columns);
    const jsonContent = JSON.stringify(jsonData, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `query_results_${executionId}_${timestamp}.json`;
    downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
};
