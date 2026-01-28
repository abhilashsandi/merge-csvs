'use client';

import { useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone'; // Assuming react-dropzone is available as per package.json
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, FileType, ArrowRight, Loader2, CheckCircle, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { replacePage } from '@/app/utils/pdf-utils';

function PdfDropzone({
    onFileSelect,
    label,
    selectedFile,
    accept = { 'application/pdf': ['.pdf'] }
}: {
    onFileSelect: (file: File) => void;
    label: string;
    selectedFile: File | null;
    accept?: Record<string, string[]>;
}) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles?.[0]) onFileSelect(acceptedFiles[0]);
        },
        accept,
        maxFiles: 1,
        multiple: false,
    });

    return (
        <div
            {...getRootProps()}
            className={`
                relative flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all
                ${isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : selectedFile
                        ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-500/50 dark:bg-emerald-950/20'
                        : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900'
                }
            `}
        >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
                {selectedFile ? (
                    <motion.div
                        key="selected"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                            <FileText className="h-6 w-6" />
                        </div>
                        <p className="max-w-[180px] truncate text-sm font-medium text-emerald-700 dark:text-emerald-300">
                            {selectedFile.name}
                        </p>
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                            Click to replace
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className={`
                            flex h-12 w-12 items-center justify-center rounded-full transition-colors
                            ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}
                        `}>
                            <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                {label}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                PDF only
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function PdfReplacer() {
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [replacementFile, setReplacementFile] = useState<File | null>(null);
    const [pageNumber, setPageNumber] = useState<string>('1');
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultPdf, setResultPdf] = useState<Uint8Array | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleProcess = async () => {
        if (!sourceFile || !replacementFile) return;

        setIsProcessing(true);
        setError(null);
        setResultPdf(null);

        try {
            const sourceBytes = await sourceFile.arrayBuffer();
            const replacementBytes = await replacementFile.arrayBuffer();
            const pageNum = parseInt(pageNumber, 10);

            if (isNaN(pageNum) || pageNum < 1) {
                throw new Error('Please enter a valid page number.');
            }

            const modifiedPdfBytes = await replacePage(sourceBytes, replacementBytes, pageNum);
            setResultPdf(modifiedPdfBytes);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to process PDF.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownload = () => {
        if (!resultPdf) return;
        const blob = new Blob([resultPdf as any], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `modified-${sourceFile?.name || 'document'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        1. Source PDF (Multi-page)
                    </label>
                    <PdfDropzone
                        label="Drop Source PDF"
                        onFileSelect={setSourceFile}
                        selectedFile={sourceFile}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        2. Replacement Content (1 Page)
                    </label>
                    <PdfDropzone
                        label="Drop Replacement PDF"
                        onFileSelect={setReplacementFile}
                        selectedFile={replacementFile}
                    />
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                        <label htmlFor="pageNumber" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Page to Replace
                        </label>
                        <div className="relative">
                            <input
                                id="pageNumber"
                                type="number"
                                min="1"
                                value={pageNumber}
                                onChange={(e) => setPageNumber(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 placeholder-zinc-400"
                                placeholder="e.g. 3"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <span className="text-xs text-zinc-400">Page #</span>
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Enter the page number in the source file you want to replace.
                        </p>
                    </div>

                    <div className="flex-1 sm:text-right">
                        <Button
                            onClick={handleProcess}
                            disabled={!sourceFile || !replacementFile || isProcessing || !pageNumber}
                            size="lg"
                            className="w-full sm:w-auto font-semibold"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Process & Replace
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400"
                    >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {resultPdf && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                                <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                                    Success!
                                </h3>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    Your PDF is ready for download.
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handleDownload}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
