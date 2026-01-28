'use client';

import { MergedRow } from '@/app/types/csv';
import { generatePreview } from '@/app/utils/csv-merger';
import { motion } from 'framer-motion';
import { Table } from 'lucide-react';

interface PreviewTableProps {
    data: MergedRow[];
    activeColumns: string[];
    primaryKeys: string[];
}

export function PreviewTable({ data, activeColumns, primaryKeys }: PreviewTableProps) {
    if (!data || data.length === 0) return null;

    const previewData = generatePreview(data);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
        >
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                    <Table className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Preview <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">
                        (First 10 of {data.length.toLocaleString()} rows)
                    </span>
                </h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="max-h-[600px] overflow-auto custom-scrollbar">
                    <table className="w-full text-left text-sm relative">
                        <thead className="sticky top-0 z-10 bg-zinc-50 shadow-sm dark:bg-zinc-950">
                            <tr>
                                {activeColumns.map((col) => {
                                    const isPrimaryKey = primaryKeys.includes(col);
                                    return (
                                        <th
                                            key={col}
                                            className={`whitespace-nowrap px-6 py-4 font-semibold ${isPrimaryKey
                                                ? 'text-blue-700 dark:text-blue-300'
                                                : 'text-zinc-700 dark:text-zinc-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {col}
                                                {isPrimaryKey && (
                                                    <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {previewData.map((row, rowIndex) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: rowIndex * 0.05 }}
                                    key={rowIndex}
                                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                >
                                    {activeColumns.map((col) => (
                                        <td
                                            key={`${rowIndex}-${col}`}
                                            className="whitespace-nowrap px-6 py-3 text-zinc-600 dark:text-zinc-400"
                                        >
                                            {row[col] !== undefined && row[col] !== '' ? (
                                                row[col]
                                            ) : (
                                                <span className="text-zinc-300 dark:text-zinc-700">—</span>
                                            )}
                                        </td>
                                    ))}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
