'use client';

import { useFileUpload } from '@/app/hooks/useFileUpload';
import { AppAction } from '@/app/types/csv';

interface FileUploadZoneProps {
    dispatch: React.Dispatch<AppAction>;
    isUploading: boolean;
}

export function FileUploadZone({ dispatch, isUploading }: FileUploadZoneProps) {
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } =
        useFileUpload({ dispatch });

    const getBorderColor = () => {
        if (isDragReject) return 'border-red-500 bg-red-50 dark:bg-red-950/20';
        if (isDragAccept) return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
        if (isDragActive) return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
        return 'border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600';
    };

    return (
        <div
            {...getRootProps()}
            className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center 
        transition-all duration-300 cursor-pointer
        ${getBorderColor()}
        ${isUploading ? 'pointer-events-none opacity-50' : ''}
      `}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4">
                {/* Upload Icon */}
                <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-lg">
                    <svg
                        className="h-8 w-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>

                {/* Text Content */}
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {isDragActive ? 'Drop files here' : 'Upload CSV files'}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Drag and drop CSV files, or click to browse
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                        Multiple files supported • CSV format only
                    </p>
                </div>

                {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Parsing files...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
