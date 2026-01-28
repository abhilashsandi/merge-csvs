'use client';

import { AppAction } from '@/app/types/csv';

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
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No columns available for primary key selection
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
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
                        <button
                            key={column}
                            onClick={() => toggleKey(column)}
                            title={column}
                            className={`
                rounded-lg border px-4 py-3 text-sm font-medium transition-all
                ${isSelected
                                    ? 'border-blue-500 bg-blue-500 text-white shadow-md hover:bg-blue-600'
                                    : 'border-zinc-300 bg-white text-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-600 dark:hover:bg-blue-950/30'
                                }
              `}
                            aria-pressed={isSelected}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isSelected && (
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                <span className="truncate">{column}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedKeys.length > 0 && (
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950/20">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        Selected: <strong>{selectedKeys.join(', ')}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}
