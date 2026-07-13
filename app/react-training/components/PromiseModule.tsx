'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type RequestState = 'idle' | 'pending' | 'success' | 'error';

interface FetchMock {
  id: string;
  name: string;
  delay: number;
  state: RequestState;
}

export function PromiseModule() {
  const [forceFail, setForceFail] = useState(false);
  const [requests, setRequests] = useState<FetchMock[]>([
    { id: '1', name: 'UserProfile', delay: 1200, state: 'idle' },
    { id: '2', name: 'UserActivity', delay: 800, state: 'idle' },
    { id: '3', name: 'UserPreferences', delay: 2500, state: 'idle' },
  ]);
  const [overallState, setOverallState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [mode, setMode] = useState<'all' | 'allSettled' | 'progressive' | 'race' | 'any'>('all');

  const reset = () => {
    setRequests(reqs => reqs.map(r => ({ ...r, state: 'idle' })));
    setOverallState('idle');
  };

  useEffect(() => {
    reset();
  }, [mode, forceFail]);

  const runSimulation = () => {
    reset();
    setTimeout(() => {
      setOverallState('pending');
      setRequests(reqs => reqs.map(r => ({ ...r, state: 'pending' })));

      if (mode === 'all') {
        runPromiseAll();
      } else if (mode === 'allSettled') {
        runPromiseAllSettled();
      } else if (mode === 'race') {
        runPromiseRace();
      } else if (mode === 'any') {
        runPromiseAny();
      } else {
        runProgressive();
      }
    }, 100);
  };

  const runPromiseAll = () => {
    let failed = false;

    requests.forEach(req => {
      setTimeout(() => {
        if (failed) return; // Short circuit simulation

        if (req.name === 'UserActivity' && forceFail) {
          failed = true;
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'error' as RequestState } : (r.state === 'pending' ? { ...r, state: 'error' as RequestState } : r)));
          setOverallState('error');
        } else {
          setRequests(curr => {
            const next = curr.map(r => r.id === req.id && !failed ? { ...r, state: 'success' as RequestState } : r);
            if (next.every(r => r.state === 'success')) {
              setOverallState('success');
            }
            return next;
          });
        }
      }, req.delay);
    });
  };

  const runPromiseAllSettled = () => {
    let completed = 0;
    requests.forEach(req => {
      setTimeout(() => {
        if (req.name === 'UserActivity' && forceFail) {
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'error' as RequestState } : r));
        } else {
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'success' as RequestState } : r));
        }
        
        completed++;
        if (completed === requests.length) {
          setOverallState('success');
        }
      }, req.delay);
    });
  };

  const runPromiseRace = () => {
    let settled = false;
    requests.forEach(req => {
      setTimeout(() => {
        if (settled) return;
        settled = true;
        if (req.name === 'UserActivity' && forceFail) {
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'error' as RequestState } : r));
          setOverallState('error');
        } else {
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'success' as RequestState } : r));
          setOverallState('success');
        }
      }, req.delay);
    });
  };

  const runPromiseAny = () => {
    let fulfilled = false;
    let rejectedCount = 0;
    requests.forEach(req => {
      setTimeout(() => {
        if (fulfilled) return;
        if (req.name === 'UserActivity' && forceFail) {
          rejectedCount++;
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'error' as RequestState } : r));
          if (rejectedCount === requests.length) {
            setOverallState('error');
          }
        } else {
          fulfilled = true;
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'success' as RequestState } : r));
          setOverallState('success');
        }
      }, req.delay);
    });
  };

  const runProgressive = () => {
    requests.forEach(req => {
      setTimeout(() => {
        if (req.name === 'UserActivity' && forceFail) {
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'error' as RequestState } : r));
        } else {
          setRequests(curr => curr.map(r => r.id === req.id ? { ...r, state: 'success' as RequestState } : r));
        }
      }, req.delay);
    });
    setOverallState('success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Async Architecture</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Visualize the architectural differences between <code className="text-blue-500 font-mono">Promise.all</code>, <code className="text-purple-500 font-mono">allSettled</code>, <code className="text-orange-500 font-mono">race</code>, <code className="text-pink-500 font-mono">any</code>, and Progressive Loading.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col xl:flex-row gap-6 mb-8 items-start xl:items-center">
            <div className="flex flex-wrap bg-slate-800 p-1 rounded-xl gap-1">
              <button onClick={() => setMode('all')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Promise.all</button>
              <button onClick={() => setMode('allSettled')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'allSettled' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Promise.allSettled</button>
              <button onClick={() => setMode('race')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'race' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Promise.race</button>
              <button onClick={() => setMode('any')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'any' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Promise.any</button>
              <button onClick={() => setMode('progressive')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'progressive' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Progressive</button>
            </div>

            <label className="flex items-center space-x-3 cursor-pointer bg-slate-800/80 px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors shrink-0">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={forceFail} onChange={(e) => setForceFail(e.target.checked)} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${forceFail ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${forceFail ? 'translate-x-4' : ''}`}></div>
              </div>
              <span className="font-medium text-slate-300 text-sm">Force Error (Activity API)</span>
            </label>
          </div>

          <div className="space-y-6">
            {requests.map((req) => (
              <RequestLane key={req.id} req={req} forceFail={forceFail} mode={mode} overallState={overallState} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={runSimulation}
              disabled={overallState === 'pending'}
              className="px-8 py-3 bg-white text-slate-900 hover:bg-slate-200 disabled:opacity-50 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95"
            >
              {overallState === 'pending' ? 'Fetching Data...' : 'Run Simulation'}
            </button>
          </div>
        </div>
      </div>

      <RenderedOutput 
        requests={requests} 
        mode={mode} 
        overallState={overallState} 
      />

      <CodeSnippetViewer mode={mode} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ConceptCard 
          title="Promise.all" 
          color="blue"
          desc="Short-circuits immediately if ANY promise rejects. Use when rendering requires ALL data to exist. If Activity fails, the user sees nothing but an error screen." 
          code={`const [profile, activity] = await Promise.all([
  fetchProfile(),
  fetchActivity()
]);`}
        />
        <ConceptCard 
          title="Promise.allSettled" 
          color="purple"
          desc="Waits for all promises to finish, regardless of success. Returns an array of statuses. If Activity fails, you can still show the Profile and Preferences." 
          code={`const results = await Promise.allSettled([
  fetchProfile(),
  fetchActivity()
]);
// results[0].status === 'fulfilled'
// results[1].status === 'rejected'`}
        />
        <ConceptCard 
          title="Promise.race" 
          color="orange"
          desc="Settles as soon as the FIRST promise resolves OR rejects. Other promises are ignored." 
          code={`const first = await Promise.race([
  fetchPrimaryServer(),
  fetchBackupServer(),
  timeout(5000)
]);`}
        />
        <ConceptCard 
          title="Promise.any" 
          color="pink"
          desc="Resolves as soon as the FIRST promise resolves. Ignores rejections unless ALL promises reject (AggregateError)." 
          code={`const fastest = await Promise.any([
  fetchFromCache(),
  fetchFromNetwork()
]);`}
        />
        <ConceptCard 
          title="Progressive Loading" 
          color="emerald"
          desc="Fetches are completely detached. The page renders instantly. Profile and Preferences pop in first, while Activity shows a spinner until it resolves." 
          code={`// Component renders immediately
<Suspense fallback={<Spinner />}>
  <UserProfile promise={profilePromise} />
</Suspense>
<Suspense fallback={<Spinner />}>
  <UserActivity promise={actPromise} />
</Suspense>`}
        />
      </div>
    </div>
  );
}

function RequestLane({ req, mode, forceFail, overallState }: { req: FetchMock, mode: string, forceFail: boolean, overallState: string }) {
  const isPending = req.state === 'pending';
  const isSuccess = req.state === 'success';
  const isError = req.state === 'error';
  
  let width = '0%';
  if (isPending) width = '50%'; 
  if (isSuccess || isError) width = '100%';

  return (
    <div className="relative">
      <div className="flex justify-between text-sm mb-2 font-mono text-slate-400">
        <span>GET /api/{req.name.toLowerCase()}</span>
        <span>{req.delay}ms</span>
      </div>
      <div className="h-12 bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
        <AnimatePresence>
          {req.state !== 'idle' && (
            <motion.div
              initial={{ width: '0%' }}
              animate={{ 
                width: width, 
                backgroundColor: isError ? '#ef4444' : isSuccess ? (mode === 'all' ? '#3b82f6' : mode === 'allSettled' ? '#a855f7' : mode === 'race' ? '#f97316' : mode === 'any' ? '#ec4899' : '#10b981') : '#475569' 
              }}
              transition={{ duration: isPending ? req.delay / 1000 : 0.3, ease: 'linear' }}
              className="absolute top-0 left-0 h-full flex items-center px-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-bold tracking-wider text-sm shadow-black drop-shadow-md"
              >
                {isError ? 'FAILED' : isSuccess ? 'RESOLVED' : 'FETCHING...'}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Short Circuit Overlays */}
        {mode === 'all' && overallState === 'error' && req.state === 'pending' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 bg-red-900/40 backdrop-blur-sm flex items-center justify-end px-4 border-l-4 border-red-500"
           >
             <span className="text-red-300 font-bold text-sm">CANCELED (SHORT-CIRCUIT)</span>
           </motion.div>
        )}
        {(mode === 'race' || mode === 'any') && overallState !== 'idle' && overallState !== 'pending' && req.state === 'pending' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-end px-4 border-l-4 border-slate-500"
           >
             <span className="text-slate-300 font-bold text-sm">IGNORED (SETTLED)</span>
           </motion.div>
        )}
      </div>
    </div>
  );
}

function ConceptCard({ title, desc, color, code }: { title: string, desc: string, color: 'blue' | 'purple' | 'emerald' | 'orange' | 'pink', code?: string }) {
  const colorMap = {
    blue: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
    purple: 'bg-purple-900/20 border-purple-500/30 text-purple-400',
    emerald: 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400',
    orange: 'bg-orange-900/20 border-orange-500/30 text-orange-400',
    pink: 'bg-pink-900/20 border-pink-500/30 text-pink-400'
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color]} backdrop-blur-sm flex flex-col h-full shadow-lg`}>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-sm leading-relaxed opacity-90 mb-5 flex-grow">{desc}</p>
      {code && (
        <div className="mt-auto pt-4 border-t border-slate-700/30">
          <div className="bg-[#0d1117]/80 rounded-xl p-4 border border-slate-800/60 shadow-inner">
            <pre className="text-[11px] sm:text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function RenderedOutput({ requests, mode, overallState }: { requests: FetchMock[], mode: string, overallState: string }) {
  if (overallState === 'idle') return null;

  const profState = requests.find(r => r.name === 'UserProfile')?.state;
  const actState = requests.find(r => r.name === 'UserActivity')?.state;
  const prefState = requests.find(r => r.name === 'UserPreferences')?.state;

  return (
    <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800 relative z-10">
      <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4 mb-6 flex items-center">
        <span className="bg-slate-800 p-2 rounded-lg mr-3">📱</span>
        What the user actually sees:
      </h3>
      
      <div className="min-h-[200px] flex flex-col justify-center">
        {mode === 'all' && (
          overallState === 'pending' ? (
            <div className="text-center text-slate-500 animate-pulse font-medium">Loading entire dashboard...</div>
          ) : overallState === 'error' ? (
            <div className="text-center text-red-400 bg-red-950/30 p-8 rounded-xl font-bold border border-red-900/50">
              ❌ 500 Server Error
              <p className="text-sm font-normal mt-2 text-red-500/70">Because Promise.all short-circuits, ALL data is thrown away when one fails.</p>
            </div>
          ) : (
            <SuccessDashboard />
          )
        )}

        {mode === 'allSettled' && (
          overallState === 'pending' ? (
            <div className="text-center text-slate-500 animate-pulse font-medium">Loading entire dashboard...</div>
          ) : (
            <div className="space-y-4">
              <DataBlock title="User Profile" state={profState!} data={{ name: "Jane Doe", role: "Admin" }} />
              <DataBlock title="Recent Activity" state={actState!} data={["Logged in", "Updated settings"]} />
              <DataBlock title="Preferences" state={prefState!} data={{ theme: "Dark Mode", notifications: "Enabled" }} />
            </div>
          )
        )}

        {mode === 'race' && (
          overallState === 'pending' ? (
            <div className="text-center text-slate-500 animate-pulse font-medium">Racing to get the first response...</div>
          ) : overallState === 'error' ? (
            <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-8 rounded-xl font-bold border border-red-200 dark:border-red-800">
              ❌ First Promise Rejected
              <p className="text-sm font-normal mt-2 text-red-400">Promise.race settles as soon as ANY promise rejects or resolves. Activity failed first.</p>
            </div>
          ) : (
             <div className="space-y-4">
               {profState === 'success' && <DataBlock title="User Profile" state={profState!} data={{ name: "Jane Doe", role: "Admin" }} />}
               {actState === 'success' && <DataBlock title="Recent Activity" state={actState!} data={["Logged in", "Updated settings"]} />}
               {prefState === 'success' && <DataBlock title="Preferences" state={prefState!} data={{ theme: "Dark Mode", notifications: "Enabled" }} />}
               <p className="text-xs text-slate-500 text-center pt-4">We only show the FIRST promise that resolved.</p>
             </div>
          )
        )}

        {mode === 'any' && (
          overallState === 'pending' ? (
            <div className="text-center text-slate-500 animate-pulse font-medium">Waiting for the first success...</div>
          ) : overallState === 'error' ? (
            <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-8 rounded-xl font-bold border border-red-200 dark:border-red-800">
              ❌ AggregateError: All Promises Rejected
              <p className="text-sm font-normal mt-2 text-red-400">Promise.any only fails if EVERY single promise fails.</p>
            </div>
          ) : (
             <div className="space-y-4">
               {profState === 'success' && <DataBlock title="User Profile" state={profState!} data={{ name: "Jane Doe", role: "Admin" }} />}
               {actState === 'success' && <DataBlock title="Recent Activity" state={actState!} data={["Logged in", "Updated settings"]} />}
               {prefState === 'success' && <DataBlock title="Preferences" state={prefState!} data={{ theme: "Dark Mode", notifications: "Enabled" }} />}
               <p className="text-xs text-slate-500 text-center pt-4">We only show the FIRST promise that successfully resolved.</p>
             </div>
          )
        )}

        {mode === 'progressive' && (
          <div className="space-y-4">
            <DataBlock title="User Profile" state={profState!} data={{ name: "Jane Doe", role: "Admin" }} />
            <DataBlock title="Recent Activity" state={actState!} data={["Logged in", "Updated settings"]} />
            <DataBlock title="Preferences" state={prefState!} data={{ theme: "Dark Mode", notifications: "Enabled" }} />
            <p className="text-xs text-slate-500 text-center pt-4">Notice how Activity renders instantly at 0.8s. The user isn't blocked waiting for Preferences!</p>
          </div>
        )}
      </div>
      
      {/* High-Priority Interview Q&A */}
      <div className="mt-12 p-8 rounded-3xl bg-blue-900/10 border border-blue-500/20 backdrop-blur-xl">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
          <span className="text-2xl">🗣️</span> High-Priority Interview Q&A
        </h2>
        <div className="space-y-4">
          <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer text-white">
            <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
              Why use Promise.all?
              <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
              <p><strong>Answer:</strong> It allows you to run multiple independent promises concurrently, drastically reducing total waiting time compared to awaiting them sequentially. It fails fast if any single promise rejects.</p>
            </div>
          </details>
          
          <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer text-white">
            <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
              When would you use Promise.allSettled instead of Promise.all?
              <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
              <p><strong>Answer:</strong> When you need to ensure ALL promises finish executing regardless of whether some fail. For example, if you are fetching data from three different APIs, and you want to show what succeeded and gracefully degrade what failed, without failing the whole request.</p>
            </div>
          </details>

          <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer text-white">
            <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
              What does Promise.race do?
              <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
              <p><strong>Answer:</strong> It returns a promise that fulfills or rejects as soon as the first promise in an iterable fulfills or rejects. Useful for adding timeouts to requests.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function SuccessDashboard() {
  return (
    <div className="space-y-4">
      <DataBlock title="User Profile" state="success" data={{ name: "Jane Doe", role: "Admin" }} />
      <DataBlock title="Recent Activity" state="success" data={["Logged in", "Updated settings"]} />
      <DataBlock title="Preferences" state="success" data={{ theme: "Dark Mode", notifications: "Enabled" }} />
    </div>
  );
}

function DataBlock({ title, state, data }: { title: string, state: string, data: any }) {
  if (state === 'pending') {
    return (
      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 animate-pulse flex items-center justify-center h-24">
        <div className="text-slate-500 font-medium text-sm flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading {title}...
        </div>
      </div>
    );
  }
  
  if (state === 'error') {
    return (
      <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/50 h-24 flex items-center justify-center">
        <span className="text-red-500 font-medium text-sm">Failed to load {title}</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 min-h-24 transition-all duration-500 animate-in fade-in zoom-in-95 shadow-inner">
      <h4 className="text-sm font-bold text-white mb-2">{title}</h4>
      <pre className="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/50">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

function CodeSnippetViewer({ mode }: { mode: string }) {
  const snippets: Record<string, { title: string; code: string; color: string }> = {
    all: {
      title: 'Promise.all - All or Nothing',
      color: 'blue',
      code: `async function fetchDashboardData() {
  try {
    // 🚨 If ANY of these fail, the entire block throws an error immediately.
    const [user, activity, preferences] = await Promise.all([
      fetch('/api/user').then(res => res.json()),
      fetch('/api/activity').then(res => res.json()),
      fetch('/api/preferences').then(res => res.json())
    ]);
    
    return { user, activity, preferences };
  } catch (error) {
    // Falls here instantly if even one fetch fails
    console.error("Dashboard failed to load", error);
    showErrorState();
  }
}`
    },
    allSettled: {
      title: 'Promise.allSettled - Resilient Fetching',
      color: 'purple',
      code: `async function fetchDashboardData() {
  // 🛡️ Waits for ALL to finish, whether they succeed or fail.
  const results = await Promise.allSettled([
    fetch('/api/user').then(res => res.json()),
    fetch('/api/activity').then(res => res.json()),
    fetch('/api/preferences').then(res => res.json())
  ]);
  
  // Results array contains objects with 'status' ('fulfilled' or 'rejected')
  const user = results[0].status === 'fulfilled' ? results[0].value : null;
  const activity = results[1].status === 'fulfilled' ? results[1].value : [];
  const preferences = results[2].status === 'fulfilled' ? results[2].value : null;
  
  return { user, activity, preferences };
}`
    },
    race: {
      title: 'Promise.race - First to Settle (Success or Fail)',
      color: 'orange',
      code: `async function fetchWithTimeout() {
  try {
    // 🏎️ The first promise to finish (resolve OR reject) wins!
    const result = await Promise.race([
      fetch('/api/data').then(res => res.json()),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 5000)
      )
    ]);
    
    return result;
  } catch (error) {
    // Caught if the fetch fails FIRST, or if the timeout triggers FIRST
    console.error(error.message);
  }
}`
    },
    any: {
      title: 'Promise.any - First to Succeed',
      color: 'pink',
      code: `async function fetchFromAnywhere() {
  try {
    // 🎯 Resolves as soon as ANY promise succeeds. 
    // Rejections are ignored unless ALL promises reject.
    const fastestData = await Promise.any([
      fetch('https://primary-server.com/api/data').then(res => res.json()),
      fetch('https://backup-server-1.com/api/data').then(res => res.json()),
      fetch('https://backup-server-2.com/api/data').then(res => res.json())
    ]);
    
    return fastestData;
  } catch (aggregateError) {
    // Only thrown if EVERY single server failed
    console.error("All servers are down!", aggregateError.errors);
  }
}`
    },
    progressive: {
      title: 'Progressive / Concurrent React',
      color: 'emerald',
      code: `// ⚡ Don't await in the parent! Pass the promises down.
export default function Dashboard() {
  // Initiate fetches immediately, but don't block render
  const profilePromise = fetchProfile();
  const activityPromise = fetchActivity();
  const prefsPromise = fetchPreferences();

  return (
    <div>
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile promise={profilePromise} />
      </Suspense>
      
      <Suspense fallback={<ActivitySkeleton />}>
        <UserActivity promise={activityPromise} />
      </Suspense>
      
      <Suspense fallback={<PrefsSkeleton />}>
        <UserPreferences promise={prefsPromise} />
      </Suspense>
    </div>
  );
}`
    }
  };

  const snippet = snippets[mode];
  if (!snippet) return null;

  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    pink: 'bg-pink-500/10 border-pink-500/30 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]'
  };

  const dotColorMap = {
    blue: 'bg-blue-400/80',
    purple: 'bg-purple-400/80',
    emerald: 'bg-emerald-400/80',
    orange: 'bg-orange-400/80',
    pink: 'bg-pink-400/80'
  };

  return (
    <div className={`mt-8 mb-4 rounded-3xl border ${colorMap[snippet.color as keyof typeof colorMap]} p-6 backdrop-blur-md overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700/80"></div>
          </div>
          <h4 className="text-sm font-bold tracking-wide flex items-center text-white">
            <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${dotColorMap[snippet.color as keyof typeof dotColorMap]}`}></span>
            {snippet.title}
          </h4>
        </div>
        <div className="text-xs font-mono px-2 py-1 bg-slate-900/50 rounded text-slate-500 border border-slate-700/50">
          implementation.ts
        </div>
      </div>
      
      <div className="bg-[#0d1117] rounded-xl p-5 shadow-inner border border-slate-700/50 overflow-x-auto relative z-10">
        <pre className="text-sm font-mono text-slate-300 leading-relaxed">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
}
