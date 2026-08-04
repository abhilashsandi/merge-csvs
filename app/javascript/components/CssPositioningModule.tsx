'use client';

import React from 'react';

export function CssPositioningModule() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">CSS Positioning</h2>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
        Understanding the fundamentals of CSS positioning properties and how they interact.
      </p>

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl mt-8">
        <h3 className="text-2xl font-bold text-white mb-6">Which statements are true?</h3>
        
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-900/10 border border-red-500/20 text-slate-300">
            <div className="flex items-center gap-3">
              <span className="text-red-500 font-bold">❌ False</span>
              <span className="font-medium text-white">`position: relative` is the default position for all elements.</span>
            </div>
            <p className="mt-2 text-sm text-slate-400 pl-16">The actual default is <code className="text-amber-400">static</code>, not <code className="text-amber-400">relative</code>.</p>
          </div>
          
          <div className="p-4 rounded-xl bg-red-900/10 border border-red-500/20 text-slate-300">
            <div className="flex items-center gap-3">
              <span className="text-red-500 font-bold">❌ False</span>
              <span className="font-medium text-white">`position: sticky` removes the element from flow and it does not move when scrolled.</span>
            </div>
            <p className="mt-2 text-sm text-slate-400 pl-16"><code className="text-amber-400">sticky</code> does not remove elements from the flow. It acts as relative until it hits a scroll threshold, then "sticks" like fixed.</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30 text-slate-300">
            <div className="flex items-center gap-3">
              <span className="text-emerald-500 font-bold">✅ True</span>
              <span className="font-medium text-white">The relative position is adjusted relative to itself, without changing the layout.</span>
            </div>
            <p className="mt-2 text-sm text-slate-400 pl-16">It offsets the element visually while preserving its original space in the document flow.</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30 text-slate-300">
            <div className="flex items-center gap-3">
              <span className="text-emerald-500 font-bold">✅ True</span>
              <span className="font-medium text-white">The top, right, bottom, left, and z-index properties do not apply to static positioning.</span>
            </div>
            <p className="mt-2 text-sm text-slate-400 pl-16">Offset and z-index properties only affect positioned elements (relative, absolute, fixed, sticky).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
