'use client';

import { AppAction } from '@/app/types/csv';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

interface RemovedColumnsListProps {
    columns: string[];
    dispatch: React.Dispatch<AppAction>;
}

export function RemovedColumnsList({ columns, dispatch }: RemovedColumnsListProps) {
    if (columns.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
        >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Removed Columns ({columns.length})
            </h3>

            <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                    {columns.map((column) => (
                        <motion.button
                            layout
                            key={column}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => dispatch({ type: 'ADD_COLUMN', payload: column })}
                            className="group flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 pl-2 pr-3 py-1.5 text-xs font-medium text-zinc-600 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                        >
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 transition-colors group-hover:bg-emerald-200 group-hover:text-emerald-700 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-emerald-900 dark:group-hover:text-emerald-300">
                                <Plus className="h-3 w-3" />
                            </span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="truncate max-w-[150px]">{column}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>Add back {column}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
