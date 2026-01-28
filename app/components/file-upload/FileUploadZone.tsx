'use client';

import { useFileUpload } from '@/app/hooks/useFileUpload';
import { AppAction } from '@/app/types/csv';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface FileUploadZoneProps {
    dispatch: React.Dispatch<AppAction>;
}

export function FileUploadZone({ dispatch }: FileUploadZoneProps) {
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, isLoading } =
        useFileUpload({ dispatch });

    const getBorderColor = () => {
        if (isDragAccept) return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
        if (isDragReject) return 'border-red-500 bg-red-50 dark:bg-red-950/20';
        if (isDragActive) return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
        return 'border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div
                {...getRootProps()}
                className={`
                    relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-8 
                    transition-all duration-300 ${getBorderColor()}
                    ${isLoading ? 'pointer-events-none opacity-60' : ''}
                `}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Processing files...
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-3 text-center"
                        >
                            <motion.div
                                animate={
                                    isDragActive
                                        ? { scale: 1.1, rotate: 5 }
                                        : { scale: 1, rotate: 0 }
                                }
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
                            >
                                {isDragActive ? (
                                    <FileText className="h-8 w-8 text-white" />
                                ) : (
                                    <Upload className="h-8 w-8 text-white" />
                                )}
                            </motion.div>

                            <div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    {isDragActive ? (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            Drop files here
                                        </motion.span>
                                    ) : (
                                        <>
                                            <span className="text-blue-600 dark:text-blue-400">
                                                Click to upload
                                            </span>{' '}
                                            or drag and drop
                                        </>
                                    )}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    CSV files only
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Animated border gradient on drag */}
                {isDragActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute inset-0 rounded-xl"
                        style={{
                            background:
                                'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                        }}
                    />
                )}
            </div>
        </motion.div>
    );
}
