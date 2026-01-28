'use client';

import { useCallback } from 'react';
import { mergeCSVs } from '../utils/csv-merger';
import { validatePrimaryKeys } from '../utils/csv-parser';
import { AppState, AppAction } from '../types/csv';

interface UseCSVMergeProps {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

export function useCSVMerge({ state, dispatch }: UseCSVMergeProps) {
    const executeMerge = useCallback(() => {
        dispatch({ type: 'SET_MERGING', payload: true });

        try {
            // Validate primary keys
            const validation = validatePrimaryKeys(state.uploadedFiles, state.primaryKeys);
            if (!validation.valid) {
                dispatch({ type: 'SET_MERGE_ERROR', payload: validation.message || 'Invalid primary keys' });
                return;
            }

            // Validate active columns
            if (state.activeColumns.length === 0) {
                dispatch({ type: 'SET_MERGE_ERROR', payload: 'No columns selected for merge' });
                return;
            }

            // Execute merge
            const mergedData = mergeCSVs(
                state.uploadedFiles,
                state.primaryKeys,
                state.activeColumns
            );

            dispatch({ type: 'SET_MERGED_DATA', payload: mergedData });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Merge failed';
            dispatch({ type: 'SET_MERGE_ERROR', payload: errorMessage });
        }
    }, [state.uploadedFiles, state.primaryKeys, state.activeColumns, dispatch]);

    const canMerge =
        state.uploadedFiles.length >= 2 &&
        state.primaryKeys.length > 0 &&
        state.activeColumns.length > 0;

    return {
        executeMerge,
        canMerge,
    };
}
