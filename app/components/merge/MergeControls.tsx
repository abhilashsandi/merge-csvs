'use client';

import { AppState } from '@/app/types/csv';
import { useCSVMerge } from '@/app/hooks/useCSVMerge';
import { getMergeStats } from '@/app/utils/csv-merger';
import { AppAction } from '@/app/types/csv';

interface MergeControlsProps {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

export function MergeControls({ state, dispatch }: MergeControlsProps) {
    const { executeMerge, canMerge } = useCSVMerge({ state, dispatch });

    const stats = state.mergedData
        ? getMergeStats(state.uploadedFiles, state.mergedData)
        : null;

    return (
        <div className="space-y-4">
            {/* Merge Button */}
            <button
                onClick={executeMerge}
                disabled={!canMerge || state.isMerging}
                className={`
          group relative w-full overflow-hidden rounded-xl px-6 py-4 font-semibold
          text-white shadow-lg transition-all duration-300
          ${canMerge && !state.isMerging
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02]'
                        : 'cursor-not-allowed bg-zinc-300 dark:bg-zinc-800'
                    }
        `}
            >
                <div className="flex items-center justify-center gap-2">
                    {state.isMerging ? (
                        <>
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Merging files...</span>
                        </>
                    ) : (
                        <>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                                />
                            </svg>
                            <span>Merge Files</span>
                        </>
                    )}
                </div>

                {/* Shimmer effect on hover */}
                {canMerge && !state.isMerging && (
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                )}
            </button>

            {/* Error Message */}
            {state.mergeError && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                    <div className="flex items-start gap-3">
                        <svg
                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <h4 className="font-medium text-red-900 dark:text-red-200">Merge Error</h4>
                            <p className="mt-1 text-sm text-red-700 dark:text-red-300">{state.mergeError}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Stats */}
            {stats && (
                <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
                    <div className="flex items-start gap-3">
                        <svg
                            className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div className="flex-1">
                            <h4 className="font-medium text-emerald-900 dark:text-emerald-200">
                                Merge Successful
                            </h4>
                            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-emerald-700 dark:text-emerald-300">Input Rows:</span>
                                    <span className="ml-2 font-semibold text-emerald-900 dark:text-emerald-100">
                                        {stats.totalInputRows}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-emerald-700 dark:text-emerald-300">Output Rows:</span>
                                    <span className="ml-2 font-semibold text-emerald-900 dark:text-emerald-100">
                                        {stats.totalOutputRows}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-emerald-700 dark:text-emerald-300">Files Merged:</span>
                                    <span className="ml-2 font-semibold text-emerald-900 dark:text-emerald-100">
                                        {stats.filesCount}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-emerald-700 dark:text-emerald-300">Unique Keys:</span>
                                    <span className="ml-2 font-semibold text-emerald-900 dark:text-emerald-100">
                                        {stats.uniqueKeys}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Requirements Hint */}
            {!canMerge && state.uploadedFiles.length > 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        {state.uploadedFiles.length < 2 && '• Upload at least 2 CSV files'}
                        {state.uploadedFiles.length >= 2 && state.primaryKeys.length === 0 && (
                            <>• Select at least one primary key column</>
                        )}
                        {state.uploadedFiles.length >= 2 &&
                            state.primaryKeys.length > 0 &&
                            state.activeColumns.length === 0 && <>• Include at least one column in the merge</>}
                    </p>
                </div>
            )}
        </div>
    );
}
