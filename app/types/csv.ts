/**
 * Type definitions for CSV merge application
 */

export interface ParsedCSV {
  id: string;
  filename: string;
  headers: string[];
  data: Record<string, any>[];
  rowCount: number;
}

export interface MergedRow {
  [column: string]: any;
}

export interface AppState {
  // File Management
  uploadedFiles: ParsedCSV[];
  isUploading: boolean;
  uploadError: string | null;
  
  // Column Management
  allColumns: string[];          // Unique columns across all files
  activeColumns: string[];       // Columns to include in merge
  removedColumns: string[];      // Columns excluded from merge
  primaryKeys: string[];         // Selected primary key columns
  
  // Merge Results
  mergedData: MergedRow[] | null;
  isMerging: boolean;
  mergeError: string | null;
}

export type AppAction =
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'ADD_FILES'; payload: ParsedCSV[] }
  | { type: 'REMOVE_FILE'; payload: string }
  | { type: 'SET_UPLOAD_ERROR'; payload: string | null }
  | { type: 'SET_COLUMNS'; payload: string[] }
  | { type: 'REORDER_COLUMNS'; payload: string[] }
  | { type: 'REMOVE_COLUMN'; payload: string }
  | { type: 'ADD_COLUMN'; payload: string }
  | { type: 'SET_PRIMARY_KEYS'; payload: string[] }
  | { type: 'SET_MERGING'; payload: boolean }
  | { type: 'SET_MERGED_DATA'; payload: MergedRow[] }
  | { type: 'SET_MERGE_ERROR'; payload: string | null }
  | { type: 'RESET' };
