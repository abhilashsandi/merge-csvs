import Papa from 'papaparse';
import { MergedRow } from '../types/csv';

/**
 * Export merged data as CSV file
 */
export function exportToCSV(
    data: MergedRow[],
    columns: string[],
    filename: string = 'merged_output.csv'
): void {
    // Generate CSV string with specified column order
    const csv = Papa.unparse(data, {
        columns: columns,
        header: true,
    });

    // Create blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 */
export function generateFilename(baseName: string = 'merged'): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `${baseName}_${timestamp}.csv`;
}
