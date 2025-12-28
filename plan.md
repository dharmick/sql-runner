# SQL Runner

Create a web based sql query runner application to be used by data analysts.

## Requirements

### Core Requirements
1. SQL input area
2. Run Query button
3. Results table with horizontal scrolling support
4. Loading, empty, error states

### Add-on Requirements
1. Virtualization (for vertical scrolling)
2. Cancel a running query
3. Notify me button (Browser notifications on query completion)
4. Keyboard shortcuts (Cmd+Enter to run query)
5. Result metadata (execution status, total rows, time taken)
6. Complex data type display (JSON, arrays, epochs)
7. Column resizing (drag column borders)

## Project Scope
- **Single tab only** (no multi-tab support for now)
- **No data persistence** (no IndexedDB for now)
- **No CSV download** (for now)
- **No query validation** (dummy application)
- **No INSERT/UPDATE/DELETE** operations (read-only queries)
- **Unit tests** will be added later

## Notes
1. Take design/feature inspirations from tools like metabase/superset.
2. This is a dummy application meaning there is no backend, no query engine, no query/syntax validation required.
3. Any dummy query with any dummy result should work.
4. Although there is no backend, the frontend should be designed in a production way meaning the architecture and implementation should feel real.

## APIs

### 1. Create a query execution
```json
POST /api/query-execution 
{
  "sql": "select * from users"
}

Response:
{
  "executionId": "exec_123"
}
```

### 2. Get query execution metadata
```json
GET /api/query-execution/{executionId}
{
  "executionId": "exec_123",
  "sql": "SELECT * FROM users WHERE created_at > '2024-01-01'",
  "status": "queued" | "running" | "completed" | "failed" | "cancelled",
  "totalRows": 1000000,
  "startedAt": "2024-12-26T07:51:10Z",
  "finishedAt": "2024-12-26T07:51:12Z",
  "executionTimeMs": 2000,
  "columns": [
    { "name": "id", "type": "number" },
    { "name": "name", "type": "string" },
    { "name": "metadata", "type": "json" },
    { "name": "tags", "type": "array" },
    { "name": "created_at", "type": "epoch" }
  ],
  "error": null | { "message": "Query timed out after 15 seconds" }
}
```

### 3. Fetch rows
```json
GET /api/query-execution/{executionId}/rows?cursor=abc123&limit=50
{
  "rows": [
    { 
      "id": 101, 
      "name": "User 101",
      "metadata": { "role": "admin", "active": true },
      "tags": ["premium", "verified"],
      "created_at": 1703577600
    }
  ],
  "nextCursor": "abc124",
  "hasMore": true
}
```

### 4. Cancel a running query
```json
PATCH /api/query-execution/{executionId}/cancel

Response: 204 No Content
```

## Frontend Flow
1. User writes SQL and presses Cmd+Enter (or clicks Run)
2. POST /api/query-execution → get executionId
3. Poll GET /api/query-execution/{executionId} every 500ms
4. When status === "completed":
   - Show browser notification
   - GET /api/query-execution/{executionId}/rows?limit=50
5. Render initial rows with virtualization
6. On scroll, fetch next batch using cursor
7. User can cancel query anytime (PATCH /cancel)

## Tech Stack
1. **Vite + TypeScript** - Build tool
2. **React 18** - UI framework
3. **TanStack Virtual** - Row virtualization
4. **React CodeMirror** - SQL editor
5. **React Split Pane** - Resizable panels
6. **CSS Modules** - Styling
7. **React Context** - State management (no Redux/Zustand)

## Performance Requirements
1. Fast initial load time
2. Smooth scrolling (60fps) with virtualization
3. Efficient re-renders (React.memo, useMemo)
4. NO Snappy UI interactions

## Sample Queries

### Query 1: Users (5 columns, 1K rows)
```javascript
{
  id: "q1",
  title: "Get all users",
  sql: "SELECT * FROM users",
  dataSource: usersDataSource // Happy path
}
```

### Query 2: Analytics (Timeout after 15s)
```javascript
{
  id: "q2",
  title: "Analytics report (slow)",
  sql: "SELECT * FROM analytics WHERE date > '2024-01-01'",
  dataSource: analyticsDataSource // This will timeout
}
```

### Query 3: Wide Table (15 columns, 25K rows)
```javascript
{
  id: "q3",
  title: "Product catalog (wide table)",
  sql: "SELECT * FROM products",
  dataSource: productsDataSource // Tests horizontal scrolling
}
```

### Query 4: Large Dataset (6 columns, 100K rows)
```javascript
{
  id: "q4",
  title: "Transaction history (large dataset)",
  sql: "SELECT * FROM transactions",
  dataSource: transactionsDataSource // Tests virtualization performance
}
```

## Data Type Handling

### JSON Columns
- **Display**: Show stringified JSON with truncation (e.g., `{"role": "admin", ...}`)
- **Interaction**: Click to show a large, scrollable custom tooltip with syntax-highlighted JSON
- **Tooltip Features**: 
  - Scrollable content area
  - User can select and copy text
  - Auto-positioned to avoid viewport edges
  - Click outside or press Esc to close
- **Implementation**: Use `<pre>` with JSON.stringify(value, null, 2)

### Array Columns
- **Display**: Show with square brackets (e.g., `[premium, verified]`)
- **Interaction**: Click to show scrollable custom tooltip with full array
- **Truncation**: Show first 3 items + "... +N more" within brackets
- **Tooltip Features**: Same as JSON columns (scrollable, selectable, copyable)

### Epoch Timestamps
- **Display**: Show raw epoch number (e.g., `1703577600`)
- **Hover**: Tooltip shows formatted date/time (e.g., `Dec 26, 2023 1:30 PM IST`)
- **Implementation**: Use `title` attribute or custom tooltip component

### Other Types
- **number**: Right-aligned, formatted with commas (e.g., `1,234,567`)
- **string**: Left-aligned, truncated with ellipsis if > 50 chars
- **boolean**: Show as `true`/`false` with color coding
- **null**: Show as `NULL` in gray/italic

## Browser Notifications
- **Trigger**: If the user clicks on the notify me button when the query is running, then show a browser notification when the query status changes to "completed" or "failed".
- **Permission**: Request on first query run
- **Content**: 
  - Success: "Query completed - 1,234 rows in 2.3s"
  - Failure: "Query failed - Timeout after 15s"
- **Action**: Click notification to focus app window

## Horizontal Scrolling
- **Table Container**: Fixed width with `overflow-x: auto`
- **Column Widths**: 
  - Min width: 120px
  - Max width: 300px
  - Auto-size based on content
  - **Resizable**: Drag column borders to resize
- **Sticky First Column**: Pin ID/primary column while scrolling
- **Scroll Indicator**: Show shadow/gradient when content overflows

## Mock Data Interfaces

```typescript
interface DataSource {
  totalRows: number;
  columns: ColumnMetadata[];
  executionTimeMs: number; // Simulates query execution time
  fetchRows(offset: number, limit: number): Promise<Row[]>;
}

interface ColumnMetadata {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'json' | 'array' | 'epoch' | 'null';
}

interface Row {
  [key: string]: any;
}
```

## Sample Data Source

```javascript
const mockUsersDataSource: DataSource = {
  totalRows: 100_000,
  executionTimeMs: 2000,
  columns: [
    { name: "id", type: "number" },
    { name: "name", type: "string" },
    { name: "email", type: "string" },
    { name: "metadata", type: "json" },
    { name: "created_at", type: "epoch" }
  ],
  
  async fetchRows(offset, limit) {
    await sleep(200); // simulate network
    return Array.from({ length: limit }, (_, i) => {
      const index = offset + i;
      return {
        id: index,
        name: `User ${index}`,
        email: `user${index}@demo.com`,
        metadata: { role: index % 2 === 0 ? "admin" : "user", active: true },
        created_at: 1703577600 + (index * 86400) // Daily increments
      };
    });
  }
};
```
```