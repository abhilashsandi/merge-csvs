'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function ReactComponentNamingModule() {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white mb-2">React Component Naming</h2>
        <p className="text-slate-400">Understanding JSX compilation and component references</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <svg className="w-24 h-24 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2zm0 4.5l7 14h-14l7-14z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-4 relative z-10">The Question</h3>
          <p className="text-slate-300 leading-relaxed relative z-10 mb-4">
            Given a functional component defined as <code className="bg-black/50 px-2 py-1 rounded text-violet-300">const app = () =&gt; {'{...}'}</code> and rendered via <code className="bg-black/50 px-2 py-1 rounded text-violet-300">export default app</code>, which statement is true about the code?
          </p>
          <ul className="space-y-2 text-slate-400 relative z-10">
            <li className="flex items-start gap-2"><span className="text-violet-500 mt-1">•</span> The setNumber function is called incorrectly.</li>
            <li className="flex items-start gap-2"><span className="text-violet-500 mt-1">•</span> A React functional component should have a capitalized name.</li>
            <li className="flex items-start gap-2"><span className="text-violet-500 mt-1">•</span> The code is correct.</li>
            <li className="flex items-start gap-2"><span className="text-violet-500 mt-1">•</span> setNumber is not declared correctly.</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col"
        >
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="w-full mb-4 py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1"
          >
            {showAnswer ? 'Hide Analysis' : 'Reveal Analysis'}
          </button>
          
          <motion.div
            initial={false}
            animate={{ 
              height: showAnswer ? 'auto' : 0, 
              opacity: showAnswer ? 1 : 0 
            }}
            className="overflow-hidden"
          >
            <div className="bg-[#0f1524] border border-indigo-500/30 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-emerald-400 mb-4">The Solution</h3>
              <div className="space-y-4 text-slate-300">
                <p>
                  <strong>Answer:</strong> A React functional component should have a capitalized name.
                </p>
                <div className="h-px w-full bg-white/10 my-4"></div>
                <h4 className="text-lg font-semibold text-white mb-2">Why?</h4>
                <p>
                  JSX compiles lowercase tag names (like <code className="text-emerald-300 bg-black/30 px-1 rounded">{'<app />'}</code>) into <code className="text-emerald-300 bg-black/30 px-1 rounded">React.createElement('app', ...)</code>, treating them as native HTML elements rather than component references.
                </p>
                <p>
                  React only treats capitalized identifiers as component lookups. Since there's no native <code className="text-emerald-300 bg-black/30 px-1 rounded">{'<app>'}</code> element, this breaks rendering.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
