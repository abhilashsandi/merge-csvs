import DpsScheduler from '@/components/DpsScheduler';

export default function DlPage() {
    return (
        <main className="min-h-screen p-4 md:p-8 bg-[#0a0a0a] text-zinc-50 flex flex-col items-center selection:bg-emerald-500/30">
            <div className="w-full max-w-6xl mt-4 md:mt-12">
                <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-2 text-zinc-100">
                            DPS Scheduler
                        </h1>
                        <p className="text-zinc-500 text-lg font-light tracking-wide">
                            Automated driver license appointment booking.
                        </p>
                    </div>
                </div>
                <DpsScheduler />
            </div>
        </main>
    );
}
