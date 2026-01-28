import { useReducer } from 'react';
import { AppState, AppAction, ParsedCSV, MergedRow } from '../types/csv';
import { detectUniqueColumns } from '../utils/csv-parser';

const initialState: AppState = {
    uploadedFiles: [],
    isUploading: false,
    uploadError: null,
    allColumns: [],
    activeColumns: [],
    removedColumns: [],
    primaryKeys: [],
    mergedData: null,
    isMerging: false,
    mergeError: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_UPLOADING':
            return { ...state, isUploading: action.payload };

        case 'ADD_FILES': {
            const newFiles = [...state.uploadedFiles, ...action.payload];
            const allColumns = detectUniqueColumns(newFiles);
            const activeColumns = state.activeColumns.length === 0
                ? allColumns
                : [...new Set([...state.activeColumns, ...allColumns])];

            return {
                ...state,
                uploadedFiles: newFiles,
                allColumns,
                activeColumns,
                uploadError: null,
            };
        }

        case 'REMOVE_FILE': {
            const newFiles = state.uploadedFiles.filter((f) => f.id !== action.payload);
            const allColumns = detectUniqueColumns(newFiles);
            const activeColumns = state.activeColumns.filter((col) => allColumns.includes(col));
            const removedColumns = state.removedColumns.filter((col) => allColumns.includes(col));

            return {
                ...state,
                uploadedFiles: newFiles,
                allColumns,
                activeColumns,
                removedColumns,
                mergedData: null,
            };
        }

        case 'REORDER_FILES': {
            return {
                ...state,
                uploadedFiles: action.payload,
                mergedData: null, // Clear merge results when files are reordered
            };
        }

        case 'SET_UPLOAD_ERROR':
            return { ...state, uploadError: action.payload, isUploading: false };

        case 'SET_COLUMNS':
            return { ...state, activeColumns: action.payload };

        case 'REORDER_COLUMNS':
            return { ...state, activeColumns: action.payload };

        case 'REMOVE_COLUMN': {
            const activeColumns = state.activeColumns.filter((col) => col !== action.payload);
            const removedColumns = [...state.removedColumns, action.payload];
            const primaryKeys = state.primaryKeys.filter((key) => key !== action.payload);

            return { ...state, activeColumns, removedColumns, primaryKeys };
        }

        case 'ADD_COLUMN': {
            const removedColumns = state.removedColumns.filter((col) => col !== action.payload);
            const activeColumns = [...state.activeColumns, action.payload];

            return { ...state, activeColumns, removedColumns };
        }

        case 'SET_PRIMARY_KEYS':
            return { ...state, primaryKeys: action.payload };

        case 'SET_MERGING':
            return { ...state, isMerging: action.payload };

        case 'SET_MERGED_DATA':
            return { ...state, mergedData: action.payload, isMerging: false, mergeError: null };

        case 'SET_MERGE_ERROR':
            return { ...state, mergeError: action.payload, isMerging: false };

        case 'RESET':
            return initialState;

        default:
            return state;
    }
}

export function useAppState() {
    const [state, dispatch] = useReducer(appReducer, initialState);
    return { state, dispatch };
}
