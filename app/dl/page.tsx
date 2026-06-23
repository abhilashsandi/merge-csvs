import DpsScheduler from '@/components/DpsScheduler';

export default function DlPage() {
    return (
        <main className="min-h-screen p-4 md:p-8 bg-slate-950 text-slate-50 flex flex-col items-center">
            <div className="w-full max-w-6xl mt-8">
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                        Texas DPS Scheduler
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Automate your driver license appointment booking.
                    </p>
                </div>
                <DpsScheduler />
            </div>
        </main>
    );
}
