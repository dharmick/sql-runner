import { SplitPane, Pane } from 'react-split-pane';
import { QueryProvider } from './context/QueryProvider';
import { QueryEditor } from './components/QueryEditor/QueryEditor';
import { ResultsTable } from './components/ResultsTable/ResultsTable';
import { SchemaExplorer } from './components/SchemaExplorer/SchemaExplorer';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <div className="app">
        <div className="app-content">
          <SplitPane direction="horizontal">
            <Pane minSize="250px" defaultSize="20%">
              <div className="sidebar-pane">
                <SchemaExplorer />
              </div>
            </Pane>
            <Pane minSize="400px">
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
            </Pane>
          </SplitPane>
        </div>
      </div>
    </QueryProvider>
  );
}

export default App;
