import { ParsedCSV, MergedRow } from '../types/csv';

/**
 * Merge multiple CSV files based on primary key columns
 * Implements LEFT JOIN - preserves all rows from first file only, adds data from others where keys match
 */
export function mergeCSVs(
    files: ParsedCSV[],
    primaryKeys: string[],
    activeColumns: string[]
): MergedRow[] {
    if (files.length === 0) return [];
    if (files.length === 1) return files[0].data;

    // The first file is the "primary" - we keep all its rows
    const primaryFile = files[0];
    const otherFiles = files.slice(1);

    // Group rows by composite key for other files (for lookup)
    const otherFileGroups: Map<string, MergedRow[]>[] = otherFiles.map(() => new Map());

    otherFiles.forEach((file, fileIndex) => {
        file.data.forEach((row) => {
            const compositeKey = primaryKeys
                .map((key) => String(row[key] ?? ''))
                .join('|');

            if (!otherFileGroups[fileIndex].has(compositeKey)) {
                otherFileGroups[fileIndex].set(compositeKey, []);
            }
            otherFileGroups[fileIndex].get(compositeKey)!.push(row);
        });
    });

    // Process each row from primary file
    const result: MergedRow[] = [];

    primaryFile.data.forEach((primaryRow) => {
        // Create composite key from primary row
        const compositeKey = primaryKeys
            .map((key) => String(primaryRow[key] ?? ''))
            .join('|');

        // Get matching rows from other files
        const matchingRowsByFile: MergedRow[][] = otherFileGroups.map((group) =>
            group.get(compositeKey) || []
        );

        // If no matches in other files, just use primary row
        if (matchingRowsByFile.every(rows => rows.length === 0)) {
            const mergedRow: MergedRow = {};
            activeColumns.forEach((col) => {
                if (col in primaryRow) {
                    mergedRow[col] = primaryRow[col];
                }
            });
            result.push(mergedRow);
            return;
        }

        // Create Cartesian product of matching rows from other files
        const combinations = cartesianProduct(matchingRowsByFile);

        // For each combination, merge with primary row
        combinations.forEach((rowCombination) => {
            const mergedRow: MergedRow = {};

            // Start with primary row data
            activeColumns.forEach((col) => {
                if (col in primaryRow) {
                    mergedRow[col] = primaryRow[col];
                }
            });

            // Overlay data from other files (only if not already set)
            rowCombination.forEach((row) => {
                activeColumns.forEach((col) => {
                    if (col in row && row[col] !== undefined && row[col] !== '') {
                        if (!(col in mergedRow) || mergedRow[col] === undefined || mergedRow[col] === '') {
                            mergedRow[col] = row[col];
                        }
                    }
                });
            });

            result.push(mergedRow);
        });
    });

    return result;
}

/**
 * Generate Cartesian product of multiple arrays
 * If an array is empty, treats it as [{}] for the product
 */
function cartesianProduct(arrays: MergedRow[][]): MergedRow[][] {
    // Replace empty arrays with [{}] so we still get combinations
    const normalizedArrays = arrays.map(arr => arr.length > 0 ? arr : [{}]);

    return normalizedArrays.reduce<MergedRow[][]>(
        (acc, curr) => {
            return acc.flatMap(a => curr.map(b => [...a, b]));
        },
        [[]]
    );
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
        uniqueKeys: mergedData.length, // Note: Output may contain duplicate keys
        filesCount: files.length,
    };
}
