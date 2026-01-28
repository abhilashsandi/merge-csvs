'use client';

import { MergedRow } from '@/app/types/csv';
import { exportToCSV, generateFilename } from '@/app/utils/csv-exporter';

interface DownloadButtonProps {
    data: MergedRow[];
    columns: string[];
}

export function DownloadButton({ data, columns }: DownloadButtonProps) {
    const handleDownload = () => {
        const filename = generateFilename('merged');
        exportToCSV(data, columns, filename);
    };

    if (!data || data.length === 0) return null;

    return (
        <button
            onClick={handleDownload}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:scale-[1.02]"
        >
            <svg
                className="h-5 w-5 transition-transform group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
            </svg>
            Download Merged CSV
        </button>
    );
}
