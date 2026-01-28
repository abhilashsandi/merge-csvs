'use client';

import { MergedRow } from '@/app/types/csv';
import { generatePreview } from '@/app/utils/csv-merger';

interface PreviewTableProps {
    data: MergedRow[];
    columns: string[];
    primaryKeys: string[];
}

export function PreviewTable({ data, columns, primaryKeys }: PreviewTableProps) {
    const previewData = generatePreview(data, 10);

    if (data.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Preview (first {previewData.length} of {data.length} rows)
                </h3>
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <table className="w-full">
                    <thead className="bg-zinc-50 dark:bg-zinc-950">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className={`
                    px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider
                    ${primaryKeys.includes(column)
                                            ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                                            : 'text-zinc-700 dark:text-zinc-300'
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-1">
                                        {column}
                                        {primaryKeys.includes(column) && (
                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {previewData.map((row, idx) => (
                            <tr
                                key={idx}
                                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column}
                                        className="whitespace-nowrap px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100"
                                    >
                                        {row[column] !== undefined && row[column] !== '' ? (
                                            String(row[column])
                                        ) : (
                                            <span className="text-zinc-400 dark:text-zinc-600">—</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length > previewData.length && (
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                    {data.length - previewData.length} more rows not shown in preview
                </p>
            )}
        </div>
    );
}
