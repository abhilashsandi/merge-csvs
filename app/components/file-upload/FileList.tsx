'use client';

import { ParsedCSV, AppAction } from '@/app/types/csv';

interface FileListProps {
    files: ParsedCSV[];
    dispatch: React.Dispatch<AppAction>;
}

export function FileList({ files, dispatch }: FileListProps) {
    if (files.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Uploaded Files ({files.length})
            </h3>

            <div className="space-y-2">
                {files.map((file, index) => (
                    <div
                        key={file.id}
                        className="group flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                    >
                        <div className="flex items-center gap-3">
                            {/* File icon */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow">
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>

                            {/* File info */}
                            <div>
                                <p className="font-medium text-zinc-900 dark:text-zinc-100" title={file.filename}>
                                    {file.filename}
                                    {index === 0 && (
                                        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                            Primary
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {file.rowCount} rows • {file.headers.length} columns
                                </p>
                            </div>
                        </div>

                        {/* Remove button */}
                        <button
                            onClick={() => dispatch({ type: 'REMOVE_FILE', payload: file.id })}
                            className="rounded-lg p-2 text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                            aria-label={`Remove ${file.filename}`}
                        >
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
