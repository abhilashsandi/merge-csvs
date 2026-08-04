'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function CustomPromiseModule() {
  const [log, setLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const runSimulation = () => {
    setIsRunning(true);
    setLog([]);
    addLog('> Starting Custom Promise Execution...');

    setTimeout(() => {
      addLog('> Resolving initial promise with "hello"');
      let val = 'hello';

      setTimeout(() => {
        try {
          addLog('> First .then() executed: return value.toUpperCase()');
          val = val.toUpperCase(); // "HELLO"
          
          setTimeout(() => {
            try {
              addLog('> Second .then() executed: return value.toFixed()');
              // This will throw because "HELLO" has no toFixed method (it's a string, not a number)
              // @ts-ignore
              val = val.toFixed(); 
            } catch (error: any) {
              addLog('> Exception thrown in second .then()!');
              addLog(`Error: ${error.message}`);
            }
            setIsRunning(false);
          }, 800);
        } catch (error: any) {
          addLog(`Error: ${error.message}`);
          setIsRunning(false);
        }
      }, 800);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Custom Promise (Error Handling)</h2>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
        Understanding how errors propagate in a custom Promise chain. What happens if an error is thrown inside a <code className="text-amber-500 font-mono">.then()</code> callback?
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">The Question</h3>
          <div className="bg-[#0d1117] rounded-xl p-4 border border-slate-800/60 shadow-inner">
            <pre className="text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre">
              <code>{`customPromise
  .then((value) => { 
    return value.toUpperCase(); 
  })
  .then((value) => { 
    // Wait, value is a string!
    return value.toFixed(); 
  })
  .catch((error) => { 
    console.log("Error:", error); 
  });`}</code>
            </pre>
          </div>
          <button 
            onClick={runSimulation}
            disabled={isRunning}
            className="mt-6 w-full py-3 bg-amber-500 text-slate-900 font-bold rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:bg-amber-400 disabled:opacity-50 transition-all"
          >
            {isRunning ? 'Executing...' : 'Run Simulation'}
          </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M4 17h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Console Output
          </h3>
          <div className="flex-1 bg-black rounded-xl p-4 font-mono text-sm border border-slate-800 overflow-y-auto">
            {log.length === 0 ? (
              <span className="text-slate-600 italic">Awaiting execution...</span>
            ) : (
              <div className="space-y-2">
                {log.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={entry.startsWith('Error:') ? 'text-red-400 font-bold' : 'text-emerald-400'}
                  >
                    {entry}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border bg-amber-900/20 border-amber-500/30 text-amber-100 shadow-lg mt-8">
        <h3 className="text-lg font-bold mb-2">Interview Insight</h3>
        <p className="text-sm leading-relaxed opacity-90">
          When a <code className="bg-black/30 px-1 py-0.5 rounded">.then()</code> callback throws an exception, the custom Promise's internal <code className="bg-black/30 px-1 py-0.5 rounded">onResolve</code> handler (usually wrapping callbacks in a try/catch) catches it and immediately passes it to <code className="bg-black/30 px-1 py-0.5 rounded">this.onReject(error)</code>. This propagates the error down the chain to the first registered <code className="bg-black/30 px-1 py-0.5 rounded">.catch()</code> handler.
        </p>
      </div>
    </div>
  );
}
