'use client';

import { AppAction } from '@/app/types/csv';

interface RemovedColumnsListProps {
    columns: string[];
    dispatch: React.Dispatch<AppAction>;
}

export function RemovedColumnsList({ columns, dispatch }: RemovedColumnsListProps) {
    if (columns.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Removed Columns ({columns.length})
            </h3>

            <div className="flex flex-wrap gap-2">
                {columns.map((column) => (
                    <button
                        key={column}
                        onClick={() => dispatch({ type: 'ADD_COLUMN', payload: column })}
                        title={column}
                        className="group flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                        aria-label={`Add back ${column}`}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {column}
                    </button>
                ))}
            </div>
        </div>
    );
}
