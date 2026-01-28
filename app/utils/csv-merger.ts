import { ParsedCSV, MergedRow } from '../types/csv';

/**
 * Merge multiple CSV files based on primary key columns
 * Implements a full outer join strategy
 */
export function mergeCSVs(
    files: ParsedCSV[],
    primaryKeys: string[],
    activeColumns: string[]
): MergedRow[] {
    // Map: composite key -> merged row
    const mergeMap = new Map<string, MergedRow>();

    files.forEach((file) => {
        file.data.forEach((row) => {
            // Create composite key: "value1|value2|value3"
            const compositeKey = primaryKeys
                .map((key) => String(row[key] ?? ''))
                .join('|');

            // Get existing row or create new one
            const existingRow = mergeMap.get(compositeKey) ?? {};

            // Merge row data (only active columns)
            const mergedRow: MergedRow = { ...existingRow };
            activeColumns.forEach((col) => {
                if (col in row) {
                    // Preserve existing value if already set, otherwise use current value
                    if (!(col in mergedRow) || mergedRow[col] === undefined || mergedRow[col] === '') {
                        mergedRow[col] = row[col];
                    }
                }
            });

            mergeMap.set(compositeKey, mergedRow);
        });
    });

    return Array.from(mergeMap.values());
}

/**
 * Generate preview data (first N rows)
 */
export function generatePreview(data: MergedRow[], maxRows: number = 10): MergedRow[] {
    return data.slice(0, maxRows);
}

/**
 * Get merge statistics
 */
export function getMergeStats(
    files: ParsedCSV[],
    mergedData: MergedRow[]
): {
    totalInputRows: number;
    totalOutputRows: number;
    uniqueKeys: number;
    filesCount: number;
} {
    const totalInputRows = files.reduce((sum, file) => sum + file.rowCount, 0);

    return {
        totalInputRows,
        totalOutputRows: mergedData.length,
        uniqueKeys: mergedData.length,
        filesCount: files.length,
    };
}
