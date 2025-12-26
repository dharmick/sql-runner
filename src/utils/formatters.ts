// Format number with commas
export const formatNumber = (value: number): string => {
    return value.toLocaleString('en-US');
};

// Format epoch timestamp to readable date
export const formatEpoch = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

// Truncate string with ellipsis
export const truncateString = (str: string, maxLength: number = 50): string => {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
};

// Format JSON for display
export const formatJSON = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
};

// Truncate array for display
export const truncateArray = (arr: any[], maxItems: number = 3): string => {
    if (arr.length <= maxItems) {
        return `[${arr.join(', ')}]`;
    }
    const visible = arr.slice(0, maxItems).join(', ');
    const remaining = arr.length - maxItems;
    return `[${visible}, ... +${remaining} more]`;
};

// Format execution time
export const formatExecutionTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
};
