'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function ReducerTraceModule() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [step, setStep] = useState(0);

  const steps = [
    { action: 'Initial State', value: 0, calc: "" },
    { action: "'increment'", value: 1, calc: "0 + 1 = 1" },
    { action: "'double'", value: 2, calc: "1 × 2 = 2" },
    { action: "'reset'", value: 2, calc: "unhandled, default returns state (2)" },
    { action: "'increment'", value: 3, calc: "2 + 1 = 3" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white mb-2">Reducer Trace</h2>
        <p className="text-slate-400">Tracing state changes through sequential actions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">The Question</h3>
          <p className="text-slate-300 mb-4 leading-relaxed">
            Given a reducer with cases for <code className="text-violet-300 bg-black/50 px-1 rounded">'increment'</code> (state+1), <code className="text-violet-300 bg-black/50 px-1 rounded">'double'</code> (state*2), and a <code className="text-violet-300 bg-black/50 px-1 rounded">default</code> (returns state unchanged). Notably, there is <strong>no <code className="text-red-400 bg-black/50 px-1 rounded">'reset'</code> case</strong>.
          </p>
          <div className="bg-black/50 rounded-xl p-4 mb-4 border border-white/5 font-mono text-sm text-slate-300">
            <p>Dispatches in order:</p>
            <p className="text-emerald-400 mt-2">['increment', 'double', 'reset', 'increment']</p>
            <p className="mt-2">starting from useReducer(reducer, 0)</p>
          </div>
          <p className="text-white font-semibold">What is the counter value after all four dispatches?</p>
          <div className="flex gap-4 mt-4">
            {['0', '1', '3', 'undefined'].map((opt) => (
              <div key={opt} className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-slate-300 font-mono">
                {opt}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col"
        >
          <button 
            onClick={() => setShowAnswer(!showAnswer)}
            className="w-full mb-6 py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1"
          >
            {showAnswer ? 'Hide Interactive Trace' : 'Reveal Interactive Trace'}
          </button>
          
          <motion.div
            initial={false}
            animate={{ 
              height: showAnswer ? 'auto' : 0, 
              opacity: showAnswer ? 1 : 0 
            }}
            className="overflow-hidden"
          >
            <div className="bg-[#0f1524] border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-emerald-400">Step-by-step Execution</h3>
                <div className="text-2xl font-black text-white bg-indigo-500/20 px-4 py-2 rounded-xl border border-indigo-500/30">
                  Value: {steps[step].value}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {steps.map((s, i) => (
                  <div 
                    key={i}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      i === step 
                        ? 'bg-violet-500/20 border-violet-500/50 scale-[1.02]' 
                        : i < step 
                          ? 'bg-white/5 border-white/10 opacity-70' 
                          : 'bg-transparent border-transparent opacity-30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm text-slate-300">
                        {i === 0 ? 'Init' : `Dispatch: ${s.action}`}
                      </span>
                      {s.calc && (
                        <span className={`text-sm ${i === step ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                          {s.calc}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:hover:bg-white/5 text-white font-semibold rounded-xl border border-white/10 transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                  disabled={step === steps.length - 1}
                  className="flex-1 py-3 px-4 bg-indigo-500/20 hover:bg-indigo-500/30 disabled:opacity-50 disabled:hover:bg-indigo-500/20 text-indigo-300 font-semibold rounded-xl border border-indigo-500/30 transition-colors"
                >
                  Next Step
                </button>
              </div>
              
              {step === steps.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-center"
                >
                  <p className="text-emerald-400 font-bold">Final Answer: 3</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
