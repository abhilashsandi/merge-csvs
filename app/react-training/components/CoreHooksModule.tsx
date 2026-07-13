'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CodeSnippet = ({ code, title }: { code: string; title: string }) => (
  <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10 backdrop-blur-md my-4">
    <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
      <span className="text-xs font-mono text-white/60">{title}</span>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
      </div>
    </div>
    <pre className="p-4 overflow-x-auto text-sm font-mono text-emerald-300">
      <code>{code}</code>
    </pre>
  </div>
);

const UseEffectVisualizer = () => {
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-4), msg]);

  useEffect(() => {
    if (!isActive) return;
    
    addLog('🟢 Effect setup: Interval started');
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    
    return () => {
      addLog('🔴 Effect cleanup: Interval cleared');
      clearInterval(interval);
    };
  }, [isActive]);

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        useEffect Memory Leak Prevention
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-white/70 mb-4 text-sm leading-relaxed">
            Watch how the cleanup function prevents memory leaks by clearing the interval when you stop it or when the component unmounts.
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50' 
                  : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50'
              }`}
            >
              {isActive ? 'Stop Effect' : 'Start Effect'}
            </button>
            <div className="text-2xl font-mono text-white">
              {count}s
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs flex flex-col justify-end min-h-[120px]">
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div
                key={i + log}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${log.includes('setup') ? 'text-emerald-400' : 'text-red-400'} py-1`}
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && <span className="text-white/30 italic">Waiting for effect...</span>}
        </div>
      </div>
    </div>
  );
};

export function CoreHooksModule() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-neutral-950 p-8 font-sans selection:bg-blue-500/30 text-white">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-12"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            React Foundations
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Core Hooks Deep Dive
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Mastering state, lifecycle, and references to build robust, memory-safe React applications.
          </p>
        </motion.div>

        {/* UseState & UseRef Intro */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.07] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4 border border-pink-500/30">
              <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">useState</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              The foundation of reactivity. It holds data that changes over time and triggers a re-render whenever it's updated. Perfect for UI state like toggles, inputs, and counts.
            </p>
            <div className="text-xs font-mono text-pink-300 bg-black/30 p-2 rounded-lg inline-block border border-white/5">
              const [count, setCount] = useState(0);
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.07] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4 border border-orange-500/30">
              <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">useRef</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              A mutable container that persists across renders but DOES NOT trigger re-renders when changed. Ideal for accessing DOM elements or storing mutable values like timer IDs.
            </p>
            <div className="text-xs font-mono text-orange-300 bg-black/30 p-2 rounded-lg inline-block border border-white/5">
              const timerRef = useRef(null);
            </div>
          </div>
        </motion.div>

        {/* useEffect Deep Dive */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 backdrop-blur-2xl">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="text-blue-400">useEffect</span> Masterclass
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white/90">The Dependency Array</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    The dependency array tells React exactly when to run your effect. 
                    If you omit it, the effect runs after every render. If it's empty <code className="text-blue-300 bg-white/10 px-1 rounded">[]</code>, it runs only on mount.
                    If it contains variables, it runs whenever those variables change.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white/90">The Cleanup Function</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Effects often create resources like subscriptions, event listeners, or timers. 
                    The cleanup function runs before the component unmounts, AND before the effect runs again, preventing memory leaks and erratic behavior.
                  </p>
                </div>
              </div>
              
              <CodeSnippet 
                title="useEffect Syntax & Cleanup" 
                code={`useEffect(() => {
  // 1. Setup phase: Connect, fetch, or start timers
  const socket = connectToChat(roomId);
  
  // 2. Cleanup phase: Disconnect, abort, or clear
  return () => {
    socket.disconnect();
  };
}, [roomId]); // 3. Dependencies`} 
              />
            </div>
            
            <div className="mt-8">
              <UseEffectVisualizer />
            </div>
          </div>
        </motion.div>

        {/* Custom Hooks */}
        <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 relative z-10">
            <span className="text-purple-400">Custom Hooks</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8 relative z-10">
            <div>
              <p className="text-white/70 leading-relaxed mb-6">
                Custom hooks allow you to extract component logic into reusable functions. 
                They are built using the core React hooks but abstract away the complexity, making your components cleaner and more focused on the UI.
              </p>
              
              <ul className="space-y-4">
                {[
                  { title: 'Reusability', desc: 'Write the logic once, use it in multiple components.' },
                  { title: 'Clean Architecture', desc: 'Separates complex state logic from UI rendering.' },
                  { title: 'Composition', desc: 'Custom hooks can call other custom hooks.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    </div>
                    <div>
                      <span className="font-medium text-white/90 block">{item.title}</span>
                      <span className="text-sm text-white/60">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <CodeSnippet 
              title="useWindowSize.ts" 
              code={`function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => 
      setSize({ width: window.innerWidth, height: window.innerHeight });
    
    window.addEventListener('resize', updateSize);
    updateSize(); // Initial call
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}`} 
            />
          </div>
        </motion.div>

        {/* High-Priority Interview Q&A */}
        <motion.div variants={itemVariants} className="p-8 rounded-3xl bg-blue-900/10 border border-blue-500/20 backdrop-blur-xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-2xl">🗣️</span> High-Priority Interview Q&A
          </h2>
          <div className="space-y-4">
            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                Why does useEffect need a dependency array?
                <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p className="mb-2"><strong>Answer:</strong> It tells React when to re-run the effect. Without it, the effect runs after <em>every</em> render, which can cause performance issues or infinite loops if the effect updates state.</p>
                <div className="text-xs bg-black/60 p-3 rounded-lg font-mono text-emerald-300">
                  {`// Infinite loop if count is updated inside!
useEffect(() => {
  setCount(count + 1);
});`}
                </div>
              </div>
            </details>
            
            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                What is the difference between useState and useRef?
                <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p><strong>Answer:</strong> <code>useState</code> triggers a component re-render when the value changes. <code>useRef</code> holds a mutable value that does <em>not</em> trigger a re-render when mutated. Use state for UI data, and refs for DOM elements or background values like timer IDs.</p>
              </div>
            </details>

            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                Why should we extract logic into Custom Hooks?
                <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p><strong>Answer:</strong> It abstracts complex logic away from the UI component, making the component easier to read. It also makes the stateful logic highly reusable across multiple components (e.g., <code>useWindowSize</code>, <code>useAuth</code>).</p>
              </div>
            </details>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
