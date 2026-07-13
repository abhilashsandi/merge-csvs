'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FormModule() {
  const [controlledText, setControlledText] = useState('');
  const [controlledCount, setControlledCount] = useState(0);
  
  const uncontrolledRef = useRef<HTMLInputElement>(null);
  const [uncontrolledCount, setUncontrolledCount] = useState(0);
  const [uncontrolledSubmitValue, setUncontrolledSubmitValue] = useState('');

  // Count re-renders for controlled
  useEffect(() => {
    setControlledCount(c => c + 1);
  }, [controlledText]);

  const handleUncontrolledSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uncontrolledRef.current) {
      setUncontrolledSubmitValue(uncontrolledRef.current.value);
      setUncontrolledCount(c => c + 1); // Only re-renders on submit
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans text-slate-100 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-900/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/30 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10 space-y-12"
      >
        <div className="text-center space-y-6 mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            React Architecture
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-violet-200">
            Controlled vs Uncontrolled
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Visualize the exact re-render boundaries and data flow differences between state-driven and ref-driven components.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controlled Form */}
          <div className="space-y-6">
            <motion.div 
              key={controlledCount}
              initial={{ scale: 0.98, backgroundColor: 'rgba(236, 72, 153, 0.2)' }}
              animate={{ scale: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-3xl border border-slate-700/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="bg-pink-500/20 text-pink-400 p-1.5 rounded-lg text-sm">🎯</span> 
                    Controlled Component
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Data flows via React State</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Re-renders</span>
                  <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-pink-400 font-mono font-bold text-lg">
                    {controlledCount}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={controlledText}
                  onChange={(e) => setControlledText(e.target.value)}
                  placeholder="Type here..."
                  className="w-full px-5 py-4 rounded-xl bg-slate-950/80 border border-pink-500/30 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all shadow-inner"
                />
                
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-wider">React State Value:</div>
                  <div className="text-pink-300 font-mono text-sm break-all min-h-[1.5rem]">
                    "{controlledText}"
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl backdrop-blur-sm space-y-4">
              <div>
                <h4 className="text-sm font-bold text-pink-300 mb-2">How it works</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  React acts as the "single source of truth". Every keystroke triggers a <code className="text-pink-300">setState</code>, causing the entire component to re-render and pushing the new value back into the input. Great for instant validation, filtering, or masking.
                </p>
              </div>
              <div className="bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/80 shadow-inner mt-4">
                <div className="flex items-center px-4 py-2 border-b border-slate-800/80 bg-slate-900/50">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/70"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/70"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/70"></div>
                  </div>
                  <span className="ml-4 text-xs font-mono text-slate-500">Controlled.tsx</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
                  <code className="block">
<span className="text-pink-400">const</span> [text, setText] = <span className="text-blue-300">useState</span>(<span className="text-green-300">''</span>);
{'\n\n'}
<span className="text-slate-500">// ...</span>
{'\n\n'}
&lt;<span className="text-pink-400">input</span>{'\n'}
{'  '}<span className="text-slate-300">value</span>=<span className="text-blue-300">{`{text}`}</span>{'\n'}
{'  '}<span className="text-slate-300">onChange</span>=<span className="text-blue-300">{`{(e) => setText(e.target.value)}`}</span>{'\n'}
/&gt;
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Uncontrolled Form */}
          <div className="space-y-6">
            <motion.div 
              key={uncontrolledCount}
              initial={{ scale: 0.98, backgroundColor: 'rgba(139, 92, 246, 0.2)' }}
              animate={{ scale: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-3xl border border-slate-700/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="bg-violet-500/20 text-violet-400 p-1.5 rounded-lg text-sm">🏗️</span> 
                    Uncontrolled Component
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Data flows via DOM Refs</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Re-renders</span>
                  <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-violet-400 font-mono font-bold text-lg">
                    {uncontrolledCount}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUncontrolledSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    ref={uncontrolledRef}
                    defaultValue=""
                    placeholder="Type here..."
                    className="flex-1 px-5 py-4 rounded-xl bg-slate-950/80 border border-violet-500/30 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all shadow-inner"
                  />
                  <button type="submit" className="px-6 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-colors shadow-lg">
                    Submit
                  </button>
                </div>
                
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-wider">Submitted Ref Value:</div>
                  <div className="text-violet-300 font-mono text-sm break-all min-h-[1.5rem]">
                    "{uncontrolledSubmitValue}"
                  </div>
                </div>
              </form>
            </motion.div>

            <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl backdrop-blur-sm space-y-4">
              <div>
                <h4 className="text-sm font-bold text-violet-300 mb-2">How it works</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The DOM acts as the "source of truth". Keystrokes do NOT trigger React re-renders. We only extract the value from the <code className="text-violet-300">ref</code> when we actually need it (like on form submit). Great for maximum performance on huge forms.
                </p>
              </div>
              <div className="bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800/80 shadow-inner mt-4">
                <div className="flex items-center px-4 py-2 border-b border-slate-800/80 bg-slate-900/50">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/70"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/70"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700/70"></div>
                  </div>
                  <span className="ml-4 text-xs font-mono text-slate-500">Uncontrolled.tsx</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
                  <code className="block">
<span className="text-violet-400">const</span> inputRef = <span className="text-blue-300">useRef</span>&lt;<span className="text-amber-200">HTMLInputElement</span>&gt;(<span className="text-pink-400">null</span>);
{'\n\n'}
<span className="text-slate-500">// Read value on submit</span>
<span className="text-violet-400">const</span> <span className="text-blue-300">onSubmit</span> = <span className="text-yellow-200">()</span> <span className="text-violet-400">=&gt;</span> {'{'}{'\n'}
{'  '}<span className="text-blue-300">console</span>.<span className="text-yellow-200">log</span>(inputRef.current?.value);{'\n'}
{'}'};
{'\n\n'}
&lt;<span className="text-violet-400">input</span> <span className="text-slate-300">ref</span>=<span className="text-blue-300">{`{inputRef}`}</span> /&gt;
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        {/* High-Priority Interview Q&A */}
        <div className="mt-12 p-8 rounded-3xl bg-blue-900/10 border border-blue-500/20 backdrop-blur-xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
            <span className="text-2xl">🗣️</span> High-Priority Interview Q&A
          </h2>
          <div className="space-y-4">
            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer text-white">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                When would you use Uncontrolled components over Controlled?
                <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p><strong>Answer:</strong> When you are building a large form with many inputs and do not need real-time validation or instant UI updates on every keystroke. Using uncontrolled inputs (with <code>useRef</code>) prevents the entire component from re-rendering on every key press, improving performance.</p>
              </div>
            </details>
            
            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-blue-500/30 transition-colors cursor-pointer text-white">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                Can you mix Controlled and Uncontrolled inputs in the same form?
                <span className="text-blue-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p><strong>Answer:</strong> Yes, you can. However, React warns you if you switch a specific input from uncontrolled to controlled (e.g., passing <code>undefined</code> to <code>value</code> initially and then updating it to a string later). You should decide on a per-input basis and stick to it.</p>
              </div>
            </details>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
