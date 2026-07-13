'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// CodeSnippetViewer for beautifully highlighted code blocks
const CodeSnippetViewer = ({ code, language }: { code: string; language: string }) => (
  <div className="relative group rounded-xl overflow-hidden bg-[#1e1e1e] border border-slate-700/50 shadow-2xl my-4 font-mono text-sm">
    <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-slate-700/50">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>
      <span className="ml-4 text-xs text-slate-400 font-medium">{language}</span>
    </div>
    <div className="p-4 overflow-x-auto text-slate-300">
      <pre><code>{code}</code></pre>
    </div>
  </div>
);

// GlassCard wrapper for consistent glassmorphism style
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

// Badge for section labels
const SectionBadge = ({ color, label }: { color: string; label: string }) => (
  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${color} mb-2`}>
    {label}
  </span>
);

export function JsFundamentalsModule() {
  // 1. Closures State
  const [closureCount, setClosureCount] = useState(0);

  // 2. Async/Await State
  const [asyncState, setAsyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [asyncData, setAsyncData] = useState<string>('');

  // 3. Array Methods State
  const initialFruits = [
    { name: 'Apple', price: 2, type: 'fruit' },
    { name: 'Broccoli', price: 1, type: 'vegetable' },
    { name: 'Banana', price: 1, type: 'fruit' },
    { name: 'Carrot', price: 1.5, type: 'vegetable' },
  ];

  const [fruits] = useState(initialFruits);
  const [activeArrayMethod, setActiveArrayMethod] = useState<'all' | 'map' | 'filter' | 'reduce'>('all');

  // 5. Event Loop State
  const [eventLoopStep, setEventLoopStep] = useState<number>(-1);
  const eventLoopSteps = [
    { zone: 'call-stack', label: 'fetchUser() is called', desc: 'Pushed onto the Call Stack and starts executing.' },
    { zone: 'web-apis', label: 'fetch() offloaded to Web APIs', desc: 'The browser\'s Web API handles the network request. JS thread is free.' },
    { zone: 'task-queue', label: 'Callback enters Task Queue', desc: 'Once the response arrives, the callback waits in the Task Queue.' },
    { zone: 'call-stack', label: 'Event Loop pushes callback', desc: 'The Event Loop sees the Call Stack is empty and pushes the callback.' },
    { zone: 'done', label: 'Output logged', desc: 'console.log(user) runs synchronously on the Call Stack.' },
  ];

  const handleAsyncAction = async (shouldFail: boolean) => {
    setAsyncState('loading');
    setAsyncData('');
    try {
      // Simulate network request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldFail) reject(new Error('Network response was not ok. Server returned 500.'));
          else resolve('Data loaded successfully from the server!');
        }, 1500);
      });
      setAsyncState('success');
      setAsyncData('Data loaded successfully from the server!');
    } catch (error: any) {
      setAsyncState('error');
      setAsyncData(error.message || 'An error occurred');
    } finally {
      console.log('Async operation completed (success or fail)');
    }
  };

  const zoneColor: Record<string, string> = {
    'call-stack': 'border-indigo-500/60 bg-indigo-500/10 text-indigo-300',
    'web-apis': 'border-blue-500/60 bg-blue-500/10 text-blue-300',
    'task-queue': 'border-amber-500/60 bg-amber-500/10 text-amber-300',
    done: 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 md:p-12 lg:p-24 selection:bg-indigo-500/30 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
            Module 1
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 pb-2">
            JavaScript Fundamentals
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Master the core concepts of JavaScript: Closures, Asynchronous programming, Array manipulation, and the Event Loop.
          </p>
        </motion.div>

        {/* 1. Closures */}
        <section className="space-y-6 pt-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <span className="text-indigo-400">01.</span> Closures
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-3xl">
              A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function's scope from an inner function.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <GlassCard className="flex flex-col">
              <h3 className="text-xl font-medium mb-4 text-slate-200">The Concept</h3>
              <p className="text-slate-400 mb-4 flex-grow">
                Closures are created every time a function is created, at function creation time. They are commonly used for data privacy, event handlers, and functional programming patterns like currying.
              </p>
              <CodeSnippetViewer
                language="javascript"
                code={`function createCounter() {
  let count = 0; // Lexical scope variable

  return function() { // The inner function
    count++; // Accesses 'count' from outer scope
    return count;
  }
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2`}
              />
            </GlassCard>

            <GlassCard className="flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              </div>
              <h3 className="text-xl font-medium mb-4 text-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                Interactive Visualizer
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Below is a React component state that relies on closure principles (state retention across renders). Click to increment the closed-over value.
              </p>

              <div className="flex-grow flex items-center justify-center p-8 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="text-center space-y-6">
                  <div className="text-6xl font-light tabular-nums tracking-tight text-indigo-300">
                    {closureCount}
                  </div>
                  <button
                    onClick={() => setClosureCount(c => c + 1)}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all rounded-lg font-medium shadow-lg shadow-indigo-500/20 text-white"
                  >
                    Invoke Inner Function
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Closure Common Pitfall */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg">⚠️</span>
              <h3 className="text-xl font-medium text-amber-300">Common Pitfall: The Classic Loop Problem</h3>
              <SectionBadge color="border-amber-500/40 bg-amber-500/10 text-amber-300" label="Interview Favourite" />
            </div>
            <p className="text-slate-400 text-sm mb-2">
              When using <code className="text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">var</code> in a loop, all callbacks share the <em>same</em> closed-over variable — and by the time any callback runs, the loop has already finished. The fix is to use <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">let</code> (block-scoped) or an IIFE.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">❌ Broken (var)</p>
                <CodeSnippetViewer
                  language="javascript"
                  code={`for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // prints 3, 3, 3
    // 'i' is shared — loop is done
    // before any callback fires
  }, 1000);
}`}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">✅ Fixed (let)</p>
                <CodeSnippetViewer
                  language="javascript"
                  code={`for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // prints 0, 1, 2
    // 'let' creates a NEW binding
    // for each loop iteration
  }, 1000);
}`}
                />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* 2. Async/Await */}
        <section className="space-y-6 pt-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <span className="text-blue-400">02.</span> Async / Await
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-3xl">
              Modern JavaScript handles asynchronous operations using Promises. The <code className="text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded text-sm font-mono">async/await</code> syntax provides a cleaner, more readable way to work with them, avoiding "callback hell" or long promise chains.
            </p>
          </div>

          {/* try/catch/finally standalone card */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-medium text-slate-200">try / catch / finally — All Three Together</h3>
              <SectionBadge color="border-blue-500/40 bg-blue-500/10 text-blue-300" label="Core Pattern" />
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Each block has a <strong className="text-slate-200">distinct responsibility</strong>. Understanding all three is essential for robust async code.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {[
                { keyword: 'try', color: 'text-blue-300 border-blue-500/30 bg-blue-500/5', desc: 'Wraps the code that might throw. Execution jumps to catch on any error.' },
                { keyword: 'catch', color: 'text-red-300 border-red-500/30 bg-red-500/5', desc: 'Receives the Error object. Only runs when the try block throws (or rejects).' },
                { keyword: 'finally', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/5', desc: 'Always runs — regardless of success or failure. Use for cleanup, hiding spinners.' },
              ].map(({ keyword, color, desc }) => (
                <div key={keyword} className={`border rounded-xl p-4 ${color}`}>
                  <code className="font-mono font-bold text-lg block mb-2">{keyword}</code>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <CodeSnippetViewer
              language="javascript"
              code={`async function loadUserProfile(userId) {
  setLoading(true);      // show spinner before we start

  try {
    // 'await' pauses here until the Promise resolves
    const response = await fetch(\`/api/users/\${userId}\`);

    // Fetch doesn't throw on 4xx/5xx — check manually
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }

    const user = await response.json(); // second await — parse body
    setUser(user);                      // ✅ update state on success

  } catch (error) {
    // Runs for network failures AND for our manual throw above
    console.error('Failed to load user:', error.message);
    setError(error.message);            // ❌ surface error to UI

  } finally {
    // Always executes — success or failure
    setLoading(false);   // hide spinner no matter what
  }
}`}
            />
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard>
              <h3 className="text-xl font-medium mb-4 text-slate-200">Syntax &amp; Error Handling</h3>
              <p className="text-slate-400 mb-4 text-sm">
                Wrap your await calls in <code className="text-slate-300 font-mono bg-slate-800 px-1 py-0.5 rounded">try/catch/finally</code> blocks to handle successes, failures, and cleanup gracefully.
              </p>
              <CodeSnippetViewer
                language="javascript"
                code={`async function fetchData() {
  try {
    // 1. Await the promise
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed');

    // 2. Parse JSON
    const data = await response.json();
    console.log('Success:', data);

  } catch (error) {
    // 3. Handle errors gracefully
    console.error('Error:', error.message);

  } finally {
    // 4. Always runs (cleanup, stop loading)
    setLoading(false);
  }
}`}
              />
            </GlassCard>

            <GlassCard className="flex flex-col">
              <h3 className="text-xl font-medium mb-4 text-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                Async Simulator
              </h3>

              <div className="flex-grow flex flex-col space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAsyncAction(false)}
                    disabled={asyncState === 'loading'}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white"
                  >
                    Simulate Success
                  </button>
                  <button
                    onClick={() => handleAsyncAction(true)}
                    disabled={asyncState === 'loading'}
                    className="flex-1 px-4 py-2 bg-red-900/40 text-red-300 hover:bg-red-900/60 border border-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                  >
                    Simulate Error
                  </button>
                </div>

                <div className="flex-grow flex items-center justify-center p-4 bg-slate-950/50 rounded-lg min-h-[120px] border border-slate-800">
                  <AnimatePresence mode="wait">
                    {asyncState === 'idle' && (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-500">
                        Waiting for user action...
                      </motion.div>
                    )}
                    {asyncState === 'loading' && (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-400 text-sm">awaiting promise...</span>
                      </motion.div>
                    )}
                    {asyncState === 'success' && (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-green-400 flex flex-col items-center gap-2 text-center">
                        <div className="bg-green-900/30 p-2 rounded-full border border-green-500/30">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {asyncData}
                      </motion.div>
                    )}
                    {asyncState === 'error' && (
                      <motion.div key="error" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-400 flex flex-col items-center gap-2 text-center">
                        <div className="bg-red-900/30 p-2 rounded-full border border-red-500/30">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        {asyncData}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-xs text-slate-500 font-mono bg-slate-950 p-3 rounded border border-slate-800 flex justify-between items-center">
                  <span>Current State:</span>
                  <span className={
                    asyncState === 'success' ? 'text-green-400' :
                    asyncState === 'error' ? 'text-red-400' :
                    asyncState === 'loading' ? 'text-blue-400' : 'text-slate-400'
                  }>{asyncState.toUpperCase()}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 3. Array Methods */}
        <section className="space-y-6 pt-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <span className="text-emerald-400">03.</span> Array Methods
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-3xl">
              Functional array methods are the bread and butter of React development. They allow you to transform, filter, and aggregate data immutably without mutating the original array.
            </p>
          </div>

          <GlassCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-2 p-1 bg-slate-900/50 rounded-lg w-max border border-slate-700/50">
                  {(['all', 'map', 'filter', 'reduce'] as const).map(method => (
                    <button
                      key={method}
                      onClick={() => setActiveArrayMethod(method)}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeArrayMethod === method ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="min-h-[200px]">
                  {activeArrayMethod === 'all' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <p className="text-slate-300 text-sm">Select a method above to see how it transforms the original array.</p>
                      <CodeSnippetViewer
                        language="javascript"
                        code={`const items = [
  { name: 'Apple', price: 2, type: 'fruit' },
  { name: 'Broccoli', price: 1, type: 'vegetable' },
  { name: 'Banana', price: 1, type: 'fruit' },
  { name: 'Carrot', price: 1.5, type: 'vegetable' }
];`}
                      />
                    </motion.div>
                  )}

                  {activeArrayMethod === 'map' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <p className="text-slate-300 text-sm"><strong className="text-emerald-400">map()</strong> creates a new array populated with the results of calling a provided function on every element.</p>
                      <CodeSnippetViewer
                        language="javascript"
                        code={`// Get an array of just the names
const names = items.map(item => item.name);
// ['Apple', 'Broccoli', 'Banana', 'Carrot']`}
                      />
                    </motion.div>
                  )}

                  {activeArrayMethod === 'filter' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <p className="text-slate-300 text-sm"><strong className="text-emerald-400">filter()</strong> creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test.</p>
                      <CodeSnippetViewer
                        language="javascript"
                        code={`// Get only fruits
const fruits = items.filter(
  item => item.type === 'fruit'
);
// [{ name: 'Apple'... }, { name: 'Banana'... }]`}
                      />
                    </motion.div>
                  )}

                  {activeArrayMethod === 'reduce' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <p className="text-slate-300 text-sm"><strong className="text-emerald-400">reduce()</strong> executes a user-supplied "reducer" callback function on each element, passing in the return value from the calculation on the preceding element.</p>
                      <CodeSnippetViewer
                        language="javascript"
                        code={`// Calculate total price
const total = items.reduce(
  (sum, item) => sum + item.price,
  0 // Initial value
);
// 5.5`}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30 overflow-hidden flex flex-col">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Live Output Visualization</h4>

                <div className="flex-grow flex items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    {activeArrayMethod === 'all' && (
                      <motion.div key="all" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 gap-3 w-full">
                        {fruits.map((f, i) => (
                          <div key={i} className="bg-slate-800 p-3 rounded-lg text-sm border border-slate-700 flex justify-between items-center shadow-lg">
                            <span>{f.name}</span>
                            <span className="text-emerald-400 font-mono">${f.price}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeArrayMethod === 'map' && (
                      <motion.div key="map" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-wrap gap-2 w-full justify-center">
                        {fruits.map(f => f.name).map((name, i) => (
                          <div key={i} className="bg-indigo-900/40 text-indigo-200 p-2 px-4 rounded-full text-sm border border-indigo-500/30 shadow-lg whitespace-nowrap">
                            "{name}"
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeArrayMethod === 'filter' && (
                      <motion.div key="filter" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {fruits.filter(f => f.type === 'fruit').map((f, i) => (
                            <div key={i} className="bg-emerald-900/20 p-3 rounded-lg text-sm border border-emerald-500/30 flex justify-between items-center shadow-lg">
                              <span>{f.name} <span className="text-xs text-slate-500 ml-1 opacity-70">({f.type})</span></span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-slate-500 text-center border-t border-slate-800 pt-3">
                          Filtered by condition: <code className="text-emerald-400 bg-emerald-400/10 px-1 rounded">type === 'fruit'</code>
                        </div>
                      </motion.div>
                    )}

                    {activeArrayMethod === 'reduce' && (
                      <motion.div key="reduce" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center w-full">
                        <div className="text-sm text-slate-400 mb-2 uppercase tracking-widest">Total Price Sum</div>
                        <div className="text-7xl font-light text-emerald-400 tabular-nums">
                          ${fruits.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500 mt-6 flex items-center gap-1 font-mono bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                          {fruits.map(f => `$${f.price}`).join(' + ')}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Chained map → filter → reduce */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-medium text-slate-200">Chaining map → filter → reduce</h3>
              <SectionBadge color="border-emerald-500/40 bg-emerald-500/10 text-emerald-300" label="Power Pattern" />
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Because each method returns a new array (or value), you can chain them into a single, readable pipeline. Each step feeds into the next — no intermediate variables needed.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {[
                { step: '1. map()', color: 'text-indigo-300 border-indigo-500/30 bg-indigo-500/5', desc: 'Transform every element. Returns a new array of the same length.' },
                { step: '2. filter()', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/5', desc: 'Keep only elements that pass a test. Returns a shorter (or equal) array.' },
                { step: '3. reduce()', color: 'text-amber-300 border-amber-500/30 bg-amber-500/5', desc: 'Fold the array down to a single value — a sum, object, string, etc.' },
              ].map(({ step, color, desc }) => (
                <div key={step} className={`border rounded-xl p-4 ${color}`}>
                  <code className="font-mono font-bold text-base block mb-2">{step}</code>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <CodeSnippetViewer
              language="javascript"
              code={`const orders = [
  { product: 'Laptop',  price: 999,  category: 'electronics', qty: 2 },
  { product: 'T-Shirt', price: 25,   category: 'clothing',    qty: 5 },
  { product: 'Phone',   price: 699,  category: 'electronics', qty: 1 },
  { product: 'Jeans',   price: 60,   category: 'clothing',    qty: 3 },
];

const totalElectronicsRevenue = orders
  // Step 1 — map: compute line-item totals (price × qty)
  .map(order => ({
    ...order,
    total: order.price * order.qty,
  }))

  // Step 2 — filter: keep only electronics
  .filter(order => order.category === 'electronics')

  // Step 3 — reduce: sum up all totals into one number
  .reduce((sum, order) => sum + order.total, 0);

console.log(totalElectronicsRevenue);
// (999 × 2) + (699 × 1) = 1998 + 699 = 2697`}
            />
            {/* Live result */}
            <div className="mt-4 flex items-center gap-4 bg-slate-900/60 rounded-xl px-6 py-4 border border-slate-700/40">
              <span className="text-slate-400 text-sm">Live result:</span>
              <span className="font-mono text-2xl font-bold text-emerald-400">
                ${[
                  { product: 'Laptop', price: 999, category: 'electronics', qty: 2 },
                  { product: 'T-Shirt', price: 25, category: 'clothing', qty: 5 },
                  { product: 'Phone', price: 699, category: 'electronics', qty: 1 },
                  { product: 'Jeans', price: 60, category: 'clothing', qty: 3 },
                ]
                  .map(o => ({ ...o, total: o.price * o.qty }))
                  .filter(o => o.category === 'electronics')
                  .reduce((sum, o) => sum + o.total, 0)
                  .toLocaleString()}
              </span>
              <span className="text-slate-500 text-xs">(Laptop×2 + Phone×1)</span>
            </div>
          </GlassCard>
        </section>

        {/* 4. Event Loop */}
        <section className="space-y-6 pt-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <span className="text-violet-400">04.</span> The Event Loop Mental Model
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-3xl">
              JavaScript is <strong className="text-slate-300">single-threaded</strong> but non-blocking. The Event Loop is the mechanism that lets async code run without freezing the UI by coordinating three zones.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard>
              <h3 className="text-xl font-medium mb-5 text-slate-200">The Three Zones</h3>
              <div className="space-y-4">
                {[
                  {
                    label: 'Call Stack',
                    color: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
                    icon: '📦',
                    desc: 'Where synchronous JS executes. Functions are pushed (called) and popped (returned) in LIFO order. Only one thing runs at a time.',
                  },
                  {
                    label: 'Web APIs',
                    color: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
                    icon: '🌐',
                    desc: 'Browser-provided threads (fetch, setTimeout, DOM events). Async work is offloaded here so the Call Stack stays free.',
                  },
                  {
                    label: 'Task Queue (Callback Queue)',
                    color: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
                    icon: '📬',
                    desc: 'Completed async callbacks wait here in FIFO order. The Event Loop moves them to the Call Stack only when it\'s empty.',
                  },
                ].map(({ label, color, icon, desc }) => (
                  <div key={label} className={`border rounded-xl p-4 ${color}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{icon}</span>
                      <span className="font-semibold font-mono">{label}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col">
              <h3 className="text-xl font-medium mb-2 text-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                Step-Through Visualizer
              </h3>
              <p className="text-slate-500 text-xs mb-5">
                Click through to see how <code className="text-violet-300 font-mono">await fetch()</code> travels through the runtime.
              </p>

              <CodeSnippetViewer
                language="javascript"
                code={`async function fetchUser() {
  const res = await fetch('/api/user'); // ← Web API
  const user = await res.json();
  console.log(user);
}
fetchUser();`}
              />

              <div className="flex-grow mt-4 space-y-3">
                <AnimatePresence mode="wait">
                  {eventLoopStep >= 0 && (
                    <motion.div
                      key={eventLoopStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`border rounded-xl p-4 ${zoneColor[eventLoopSteps[eventLoopStep]?.zone] ?? ''}`}
                    >
                      <div className="font-mono font-semibold text-sm mb-1">
                        Step {eventLoopStep + 1} / {eventLoopSteps.length} — {eventLoopSteps[eventLoopStep]?.label}
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">
                        {eventLoopSteps[eventLoopStep]?.desc}
                      </p>
                    </motion.div>
                  )}
                  {eventLoopStep < 0 && (
                    <motion.p key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 text-sm text-center py-4">
                      Press "Next Step" to start the walkthrough ↓
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Zone pipeline */}
                <div className="flex items-center gap-2 text-xs font-mono mt-3">
                  {(['Call Stack', 'Web APIs', 'Task Queue'] as const).map((zone, idx) => {
                    const zoneKeys = ['call-stack', 'web-apis', 'task-queue'];
                    const active = eventLoopStep >= 0 && eventLoopSteps[eventLoopStep]?.zone === zoneKeys[idx];
                    return (
                      <React.Fragment key={zone}>
                        <div className={`flex-1 text-center py-2 rounded-lg border transition-all duration-300 ${active ? zoneColor[zoneKeys[idx]] + ' scale-105 shadow-lg' : 'border-slate-700/40 text-slate-600'}`}>
                          {zone}
                        </div>
                        {idx < 2 && <span className="text-slate-600">→</span>}
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setEventLoopStep(s => Math.min(s + 1, eventLoopSteps.length - 1))}
                    disabled={eventLoopStep >= eventLoopSteps.length - 1}
                    className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors text-white"
                  >
                    Next Step →
                  </button>
                  <button
                    onClick={() => setEventLoopStep(-1)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors text-slate-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <h3 className="text-lg font-medium text-slate-200 mb-4">Synchronous vs. Asynchronous execution order</h3>
            <CodeSnippetViewer
              language="javascript"
              code={`console.log('1 — synchronous (Call Stack)');

setTimeout(() => {
  console.log('3 — async (Task Queue, fires after stack is clear)');
}, 0); // 0ms delay — but STILL goes through Task Queue!

Promise.resolve().then(() => {
  console.log('2.5 — microtask (Microtask Queue, runs before Task Queue)');
});

console.log('2 — synchronous (Call Stack)');

// Output order: 1 → 2 → 2.5 → 3
// Key insight: setTimeout(fn, 0) is NOT immediate!`}
            />
          </GlassCard>
        </section>

        {/* 5. High-Priority Interview Q&A */}
        <section className="space-y-6 pt-12 pb-16">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold flex items-center gap-3">
              <span className="text-rose-400">05.</span> High-Priority Interview Q&amp;A
            </h2>
            <p className="text-slate-400 leading-relaxed max-w-3xl">
              These questions come up in nearly every JavaScript/React interview. Know these cold.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Why use Promise.all?',
                a: 'To run multiple async operations concurrently and wait for all to complete.',
                detail: 'Promise.all([ fetch(A), fetch(B), fetch(C) ]) fires all three requests at the same time and resolves once every promise resolves. If any one rejects, the whole thing rejects immediately (fail-fast). Use it when results are independent and you want maximum speed.',
                code: `// ✅ Concurrent — both fetches fire in parallel
const [user, posts] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
]);
// Total time ≈ max(user, posts) instead of sum`,
                badge: { label: 'Performance', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
              },
              {
                q: 'When would you use Promise.allSettled?',
                a: 'When you want results for ALL promises, even if some fail.',
                detail: 'Unlike Promise.all, allSettled never rejects. Each result has a status of "fulfilled" or "rejected" and a value/reason. Use it when partial success is acceptable — e.g., loading a dashboard where some widgets can fail gracefully.',
                code: `const results = await Promise.allSettled([
  fetch('/api/user'),
  fetch('/api/orders'),      // might 404
  fetch('/api/notifications'),
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('✅ Got:', result.value);
  } else {
    console.warn('❌ Failed:', result.reason);
  }
});`,
                badge: { label: 'Resilience', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
              },
              {
                q: 'What is the difference between == and ===?',
                a: '=== is strict equality (no type coercion). == performs type coercion before comparing.',
                detail: 'Always prefer === in production code. == can produce surprising results like 0 == false → true or "" == 0 → true.',
                code: `// Loose equality (==) — coerces types
console.log(0 == false);  // true  ⚠️
console.log("" == 0);     // true  ⚠️
console.log(null == undefined); // true ⚠️

// Strict equality (===) — no coercion
console.log(0 === false); // false ✅
console.log("" === 0);    // false ✅`,
                badge: { label: 'Gotcha', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
              },
              {
                q: 'What is the difference between var, let, and const?',
                a: 'var is function-scoped and hoisted; let/const are block-scoped. const cannot be reassigned.',
                detail: 'Prefer const by default, let when you need reassignment, and avoid var entirely in modern code. var\'s function scope and hoisting are common sources of bugs (see the closure loop pitfall above).',
                code: `var x = 1;   // function-scoped, hoisted, re-declarable
let y = 2;   // block-scoped, not re-declarable
const z = 3; // block-scoped, cannot reassign

// var leaks out of blocks
if (true) { var leak = 'oops'; }
console.log(leak); // 'oops' — var ignores block scope!

// let/const stay contained
if (true) { let safe = 'ok'; }
console.log(safe); // ReferenceError ✅`,
                badge: { label: 'Scoping', color: 'border-violet-500/40 bg-violet-500/10 text-violet-300' },
              },
            ].map(({ q, a, detail, code, badge }, idx) => (
              <QACard key={idx} question={q} answer={a} detail={detail} code={code} badge={badge} index={idx} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── Q&A Card sub-component ─────────────────────────────────────────────────

function QACard({
  question,
  answer,
  detail,
  code,
  badge,
  index,
}: {
  question: string;
  answer: string;
  detail: string;
  code: string;
  badge: { label: string; color: string };
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-4 p-6 text-left hover:bg-slate-700/20 transition-colors"
      >
        <span className="mt-0.5 text-rose-400 font-bold font-mono text-base shrink-0">Q{index + 1}</span>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-200 font-medium">{question}</span>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-emerald-300 text-sm mt-1 font-medium">→ {answer}</p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 shrink-0 mt-1"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-700/40 pt-4 space-y-3">
              <p className="text-slate-400 text-sm leading-relaxed">{detail}</p>
              <div className="relative rounded-xl overflow-hidden bg-[#1e1e1e] border border-slate-700/50 shadow-2xl font-mono text-sm">
                <div className="flex items-center px-4 py-2 bg-[#2d2d2d] border-b border-slate-700/50">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="ml-4 text-xs text-slate-400 font-medium">javascript</span>
                </div>
                <div className="p-4 overflow-x-auto text-slate-300">
                  <pre><code>{code}</code></pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
