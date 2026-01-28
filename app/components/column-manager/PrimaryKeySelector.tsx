'use client';

import { AppAction } from '@/app/types/csv';
import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

interface PrimaryKeySelectorProps {
    availableColumns: string[];
    selectedKeys: string[];
    dispatch: React.Dispatch<AppAction>;
}

export function PrimaryKeySelector({
    availableColumns,
    selectedKeys,
    dispatch,
}: PrimaryKeySelectorProps) {
    const toggleKey = (column: string) => {
        const newKeys = selectedKeys.includes(column)
            ? selectedKeys.filter((k) => k !== column)
            : [...selectedKeys, column];

        dispatch({ type: 'SET_PRIMARY_KEYS', payload: newKeys });
    };

    if (availableColumns.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/50"
            >
                <AlertCircle className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No columns available for primary key selection
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
        >
            <div>
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Select Primary Key(s) *
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Choose columns that uniquely identify rows for merging
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableColumns.map((column) => {
                    const isSelected = selectedKeys.includes(column);
                    return (
                        <motion.button
                            key={column}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleKey(column)}
                            className={`
                                relative flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all
                                ${isSelected
                                    ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-600 dark:hover:bg-blue-950/30'
                                }
                            `}
                            aria-pressed={isSelected}
                        >
                            {isSelected && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute left-3"
                                >
                                    <Check className="h-4 w-4" />
                                </motion.span>
                            )}

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className={`truncate px-4 ${isSelected ? '' : ''}`}>
                                            {column}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>{column}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </motion.button>
                    );
                })}
            </div>

            {selectedKeys.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                >
                    Selected: <strong className="font-semibold">{selectedKeys.join(', ')}</strong>
                </motion.div>
            )}
        </motion.div>
    );
}
