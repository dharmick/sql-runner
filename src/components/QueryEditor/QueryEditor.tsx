import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { useQueryContext } from '../../context/QueryContext';
import { sampleQueries } from '../../mocks';
import styles from './QueryEditor.module.css';

export const QueryEditor = () => {
    const { sql: sqlValue, setSql, runQuery, isLoading } = useQueryContext();

    // Load sample queries on mount
    useEffect(() => {
        const allQueries = sampleQueries.map(q => `-- ${q.title}\n${q.sql}`).join('\n\n');
        setSql(allQueries);
    }, []);

    const handleRunQuery = () => {
        const selection = window.getSelection()?.toString();

        if (selection && selection.trim()) {
            // Run selected query
            runQuery(selection.trim());
        } else {
            // Run first query (split by semicolon)
            const queries = sqlValue.split(';')
                .map(q => q.trim())
                .filter(q => q.length > 0);

            if (queries.length > 0) {
                runQuery(queries[0]);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            event.preventDefault();
            handleRunQuery();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.editor}>
                <CodeMirror
                    value={sqlValue}
                    height="100%"
                    onKeyDown={handleKeyDown}
                    extensions={[sql()]}
                    onChange={(value) => setSql(value)}
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightSpecialChars: true,
                        foldGutter: true,
                        drawSelection: true,
                        dropCursor: true,
                        allowMultipleSelections: true,
                        indentOnInput: true,
                        bracketMatching: true,
                        closeBrackets: true,
                        autocompletion: true,
                        rectangularSelection: true,
                        crosshairCursor: true,
                        highlightActiveLine: true,
                        highlightSelectionMatches: true,
                        closeBracketsKeymap: true,
                        searchKeymap: true,
                        foldKeymap: true,
                        completionKeymap: true,
                        lintKeymap: true,
                    }}
                />
            </div>
            <div className={styles.toolbar}>
                <button
                    className={styles.runButton}
                    onClick={handleRunQuery}
                    disabled={isLoading}
                >
                    {isLoading ? 'Running...' : 'Run Query'}
                </button>
            </div>
        </div>
    );
};
