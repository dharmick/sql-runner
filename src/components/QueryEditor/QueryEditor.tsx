import { useEffect, useRef, useMemo } from 'react';
import CodeMirror, { Prec } from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { EditorView, keymap } from '@codemirror/view';
import { useQueryContext } from '../../context/QueryContext';
import { sampleQueries } from '../../mocks';
import styles from './QueryEditor.module.css';

export const QueryEditor = () => {
    const { editorValue, setEditorValue, runQuery, isLoading } = useQueryContext();
    const editorViewRef = useRef<EditorView | null>(null);

    // Load sample queries on mount
    useEffect(() => {
        const allQueries = sampleQueries.map(q => `-- ${q.title}\n${q.sql}`).join('\n\n');
        setEditorValue(allQueries);
    }, []);

    const handleRunQuery = () => {
        let selectedText = '';

        // Get selection from CodeMirror editor
        if (editorViewRef.current) {
            const state = editorViewRef.current.state;
            const selection = state.selection.main;
            selectedText = state.sliceDoc(selection.from, selection.to);
        }

        if (selectedText && selectedText.trim()) {
            // Run selected query
            runQuery(selectedText.trim());
        } else {
            // Run first query (split by semicolon)
            const queries = editorValue.split(';')
                .map(q => q.trim())
                .filter(q => q.length > 0);

            if (queries.length > 0) {
                runQuery(queries[0]);
            }
        }
    };

    const runQueryKeymap = useMemo(() => Prec.highest(keymap.of([
        {
            key: 'Mod-Enter',
            preventDefault: true,
            run: () => {
                handleRunQuery();
                return true;
            }
        }
    ])), [handleRunQuery]);

    return (
        <div className={styles.container}>
            <div className={styles.editor}>
                <CodeMirror
                    value={editorValue}
                    style={{ height: '100%' }}
                    extensions={[runQueryKeymap, sql()]}
                    onChange={(value) => setEditorValue(value)}
                    onCreateEditor={(view) => {
                        editorViewRef.current = view;
                    }}
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: true,
                        highlightSpecialChars: true,
                        drawSelection: false,
                        autocompletion: false,
                        highlightActiveLine: true,
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
