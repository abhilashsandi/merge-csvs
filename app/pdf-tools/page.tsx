'use client';

import { PdfReplacer } from '@/app/components/pdf/PdfReplacer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PdfToolsPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to CSV Merger
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        PDF Page Replacer
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Replace a specific page in a PDF with a single page from another PDF.
                    </p>
                </div>

                <PdfReplacer />
            </div>
        </div>
    );
}
