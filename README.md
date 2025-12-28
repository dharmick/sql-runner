# Atlan SQL Runner

A high-performance, web-based SQL query runner component designed for speed and usability. This application allows users to execute SQL queries and visualize results efficiently, even with large datasets.

## 🚀 Features

### Core Features
*Essential functionality that makes the SQL runner immediately usable for data analysts.*

-   **Query Editor**: Built with [CodeMirror](https://uiwjs.github.io/react-codemirror/), featuring SQL syntax highlighting, line numbers, and auto-completion capabilities.

-   **Virtualized Results Table**: Powered by [@tanstack/react-virtual](https://tanstack.com/virtual/v3), capable of rendering 100,000+ rows without performance degradation by only rendering what is in the viewport.
    - *Why it matters*: Analysts often work with large datasets. Traditional tables crash or freeze the browser with thousands of rows. Virtualization ensures smooth scrolling and instant results, even for complex queries returning massive datasets.

-   **Loading, Error & Empty States**: Clear visual feedback during query execution and informative error messages when queries fail.

### Advanced Features
*Enhanced capabilities that improve productivity and user experience throughout the workday.*

-   **Query selection & Keyboard Shortcuts**: Execute queries instantly with `Cmd/Ctrl + Enter`, or select specific SQL statements to run only the selected portion.

-   **Query Cancellation**: Stop long-running queries mid-execution with a dedicated cancel button.
    - *Why it matters*: Analysts sometimes accidentally run expensive queries or realize mid-execution that they need to modify the query. Being able to cancel saves time and system resources.

-   **Sticky Headers & First Column**: Table headers and the first column remain visible while scrolling, providing constant context.
    
-   **Results Metadata**: Display query execution time, row count, and other relevant statistics.
    - *Why it matters*: Performance metrics help analysts optimize queries. Knowing a query took 5 seconds vs 500ms informs decisions about indexing, query structure, and whether the query is production-ready.

-   **Smart Data Formatting**: Automatic formatting of epoch timestamps and complex JSON/array data with expandable modal viewers.
    - *Why it matters*: Raw epoch timestamps (e.g., `1703779200000`) are unreadable. Automatic conversion to human-readable dates saves mental overhead. Similarly, viewing complex nested data in a formatted modal is far easier than parsing raw JSON strings.
    
-   **Split Pane Layout**: Fully resizable workspace using [react-split-pane](https://github.com/tomkp/react-split-pane), allowing users to adjust the ratio between the schema explorer, editor, and results view.

-   **Persistent Query State**: Queries are automatically saved to local storage and restored on page reload.
    - *Why it matters*: Analysts often work on multiple queries throughout the day. Accidental tab closures or browser crashes shouldn't mean lost work. Auto-persistence ensures continuity and reduces frustration.

-   **Resizable Table Columns**: Drag column borders to adjust widths based on content.
    
-   **Schema Explorer**: An intuitive sidebar to explore databases, tables, and column metadata, serving as a quick reference while writing queries.
    - *Why it matters*: Analysts constantly need to reference table structures and column names. Having this information readily available eliminates context-switching to external documentation speeding up query development.

-   **Data Export**: Built-in functionality to export query results to CSV/JSON for external analysis.

-   **Notification System**: Optional "Notify Me" button for long-running queries that sends a browser notification when the query completes.
    - *Why it matters*: For queries that take minutes to run, analysts can switch to other tasks and get notified when results are ready, rather than watching a loading spinner.

## 🛠️ Technology Stack

-   **Framework**: [React 18](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **State Management**: React Context API & Custom Hooks
-   **Styling**: CSS Modules for scoped, maintainable styles

### Key Libraries

-   `@uiw/react-codemirror` - For the robust SQL editor interface.
-   `@tanstack/react-virtual` - For efficient rendering of large result sets (virtualization).
-   `react-split-pane` - For the resizable layout panes.
-   `msw` - For implementation of the mock API layer.

## ⚡ Performance & Optimizations

-   **Row Virtualization**: The results table uses virtualization to render only the visible rows. This allows the application to handle datasets of 100,000+ rows with constant memory usage and smooth scrolling.
-   **Debounced State Updates**: Data fetches on scroll are debounced to reduce the number of API calls.
-   **Memoization**: `useMemo` and `useCallback` are strategically used to prevent unnecessary re-renders of components.
-   **Efficient Asset Loading**: Vite's code-splitting ensures that only necessary code is loaded for the initial paint.

## ⏱️ Page Load Time

Typical load time: **< 300ms** (Locally served)
*Measured via Chrome DevTools Network tab (Load event).*

To measure it yourself:
1. Open Chrome DevTools (F12).
2. Go to the **Network** tab.
3. Refresh the page.
4. Check the red "Load" metric at the bottom of the pane.

## 🎥 Walkthrough

[Link to Walkthrough Video]
*(Please add your video link here)*
