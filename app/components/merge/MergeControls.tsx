'use client';

import { AppState } from '@/app/types/csv';
import { useCSVMerge } from '@/app/hooks/useCSVMerge';
import { getMergeStats } from '@/app/utils/csv-merger';
import { AppAction } from '@/app/types/csv';
import { motion, AnimatePresence } from 'framer-motion';
import { Combine, Loader2, AlertCircle, CheckCircle2, FileStack } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

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
            <Button
                onClick={executeMerge}
                disabled={!canMerge || state.isMerging}
                size="lg"
                className={`
                    group relative w-full overflow-hidden font-medium transition-all
                    ${canMerge
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-200 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:shadow-none'
                        : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500'
                    }
                `}
            >
                <AnimatePresence mode="wait">
                    {state.isMerging ? (
                        <motion.div
                            key="merging"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="merge"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            <Combine className="h-4 w-4" />
                            <span>Merge Files</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Button>

            {/* Error Message */}
            <AnimatePresence>
                {state.mergeError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden rounded-md border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900/50 dark:bg-red-950/20"
                    >
                        <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <p>{state.mergeError}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Stats */}
            <AnimatePresence>
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50"
                    >
                        <div className="mb-3 flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            Merge Complete
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                            <div className="flex justify-between">
                                <span className="text-zinc-500 dark:text-zinc-400">Files:</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{stats.filesCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-500 dark:text-zinc-400">Input Rows:</span>
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{stats.totalInputRows.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between col-span-2 border-t border-zinc-200 pt-2 mt-1 dark:border-zinc-700">
                                <span className="text-zinc-500 dark:text-zinc-400">Result Rows:</span>
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">{stats.totalOutputRows.toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Requirements Hint */}
            <AnimatePresence>
                {!canMerge && state.uploadedFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-md bg-zinc-50 p-3 text-xs text-zinc-500 dark:bg-zinc-900"
                    >
                        <p className="flex items-center gap-1.5">
                            <FileStack className="h-3.5 w-3.5" />
                            {state.uploadedFiles.length < 2
                                ? 'Upload 2+ files to merge'
                                : state.primaryKeys.length === 0
                                    ? 'Select a primary key'
                                    : 'Add at least one column'
                            }
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
