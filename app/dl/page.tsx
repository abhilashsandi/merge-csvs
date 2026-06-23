import type { Metadata } from 'next';
import DpsScheduler from '@/components/DpsScheduler';

// Explicitly opt out of indexing
export const metadata: Metadata = {
    title: 'DPS Scheduler',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function DlPage() {
    return (
        <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-zinc-50 flex flex-col items-center transition-colors">
            <div className="w-full max-w-6xl mt-4 md:mt-12">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-1 text-gray-900 dark:text-zinc-100">
                            DPS Scheduler
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-500 text-base font-light">
                            Automated Texas driver license appointment booking.
                        </p>
                    </div>
                </div>
                <DpsScheduler />
            </div>
        </main>
    );
}
