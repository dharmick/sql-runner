import { SplitPane, Pane } from 'react-split-pane';
import { QueryProvider } from './context/QueryContext';
import { QueryEditor } from './components/QueryEditor/QueryEditor';
import { ResultsTable } from './components/ResultsTable/ResultsTable';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <div className="app">
        <div className="app-content">
          <SplitPane direction="vertical">
            <Pane minSize="200px" defaultSize="40%">
              <div className="editor-pane">
                <QueryEditor />
              </div>
            </Pane>
            <Pane minSize="200px">
              <div className="results-pane">
                <ResultsTable />
              </div>
            </Pane>
          </SplitPane>
        </div>
      </div>
    </QueryProvider>
  );
}

export default App;
