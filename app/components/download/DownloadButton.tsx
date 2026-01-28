'use client';

import { MergedRow } from '@/app/types/csv';
import { exportToCSV } from '@/app/utils/csv-exporter';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';

interface DownloadButtonProps {
    data: MergedRow[] | null;
    activeColumns: string[];
}

export function DownloadButton({ data, activeColumns }: DownloadButtonProps) {
    const [isDownloaded, setIsDownloaded] = useState(false);

    if (!data || data.length === 0) return null;

    const handleDownload = () => {
        exportToCSV(data, activeColumns);
        setIsDownloaded(true);
        setTimeout(() => setIsDownloaded(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Button
                onClick={handleDownload}
                size="lg"
                className={`
                    w-full font-semibold shadow-lg transition-all duration-300
                    ${isDownloaded
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100'
                    }
                `}
            >
                <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {isDownloaded ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <Check className="h-5 w-5" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="download"
                                initial={{ translateY: -20, opacity: 0 }}
                                animate={{ translateY: 0, opacity: 1 }}
                                exit={{ translateY: 20, opacity: 0 }}
                            >
                                <Download className="h-5 w-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span>{isDownloaded ? 'Downloaded!' : 'Download Merged CSV'}</span>
                </div>
            </Button>
        </motion.div>
    );
}
