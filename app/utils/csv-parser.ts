import Papa from 'papaparse';
import { ParsedCSV } from '../types/csv';

/**
 * Parse CSV file using PapaParse
 */
export function parseCSVFile(file: File): Promise<ParsedCSV> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: 'greedy', // Skip lines with only whitespace
            dynamicTyping: true,
            delimitersToGuess: [',', '\t', '|', ';'], // Try multiple delimiters
            complete: (results) => {
                // Filter out critical errors only (delimiter/quote issues)
                const criticalErrors = results.errors.filter(
                    (err) => err.type === 'Delimiter' || err.type === 'Quotes'
                );

                if (criticalErrors.length > 0) {
                    const errorDetails = criticalErrors
                        .map((err) => `Line ${err.row}: ${err.message}`)
                        .join('; ');
                    reject(new Error(`Cannot parse "${file.name}": ${errorDetails}`));
                    return;
                }

                // Warn about field count mismatches but don't fail parsing
                const fieldCountErrors = results.errors.filter((err) => err.type === 'FieldMismatch');
                if (fieldCountErrors.length > 0) {
                    console.warn(
                        `Warning: "${file.name}" has ${fieldCountErrors.length} rows with inconsistent field counts. Missing fields will be treated as empty values.`
                    );
                }

                const headers = results.meta.fields || [];
                const data = results.data as Record<string, any>[];

                if (headers.length === 0) {
                    reject(new Error(`No columns detected in "${file.name}". Ensure the file has a header row.`));
                    return;
                }

                if (data.length === 0) {
                    reject(new Error(`No data rows found in "${file.name}".`));
                    return;
                }

                resolve({
                    id: generateFileId(),
                    filename: file.name,
                    headers,
                    data,
                    rowCount: data.length,
                });
            },
            error: (error) => {
                reject(new Error(`Failed to parse "${file.name}": ${error.message}`));
            },
        });
    });
}

/**
 * Detect unique columns across all uploaded files
 */
export function detectUniqueColumns(files: ParsedCSV[]): string[] {
    const columnSet = new Set<string>();
    files.forEach((file) => {
        file.headers.forEach((header) => columnSet.add(header));
    });
    return Array.from(columnSet);
}

/**
 * Validate that primary key columns exist in all files
 */
export function validatePrimaryKeys(
    files: ParsedCSV[],
    primaryKeys: string[]
): { valid: boolean; message?: string } {
    if (primaryKeys.length === 0) {
        return { valid: false, message: 'At least one primary key must be selected' };
    }

    for (const key of primaryKeys) {
        const missingFiles = files.filter((file) => !file.headers.includes(key));
        if (missingFiles.length > 0) {
            return {
                valid: false,
                message: `Primary key "${key}" not found in: ${missingFiles.map((f) => f.filename).join(', ')}`,
            };
        }
    }

    return { valid: true };
}

/**
 * Generate unique file ID
 */
function generateFileId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
