'use client';

import React from 'react';

export function CssSelectorsModule() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">CSS Selectors</h2>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
        Understanding combinator semantics to accurately target elements based on their DOM relationships.
      </p>

      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl mt-8">
        <h3 className="text-2xl font-bold text-white mb-6">Question: Which selector makes `&lt;ul&gt;` tags preceded by a `&lt;div&gt;` red?</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <code className="text-blue-400 font-bold">div ul</code>
              <p className="mt-2 text-sm text-slate-400">Descendant combinator. Selects `&lt;ul&gt;` elements that are anywhere inside a `&lt;div&gt;`.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <code className="text-blue-400 font-bold">div.ul</code>
              <p className="mt-2 text-sm text-slate-400">Class selector. Selects a `&lt;div&gt;` element with the class "ul". (Invalid interpretation)</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <code className="text-blue-400 font-bold">div &gt; ul</code>
              <p className="mt-2 text-sm text-slate-400">Child combinator. Selects direct children (parent/child, not siblings).</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <code className="text-blue-400 font-bold">div + ul</code>
              <p className="mt-2 text-sm text-slate-400">Adjacent sibling combinator. Only matches if the `&lt;ul&gt;` <strong>immediately</strong> follows the `&lt;div&gt;` with nothing between them.</p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-amber-900/20 border-2 border-amber-500/50 relative overflow-hidden mt-6">
            <div className="absolute top-0 right-0 bg-amber-500 text-amber-950 font-bold text-xs px-3 py-1 rounded-bl-lg">
              CORRECT ANSWER
            </div>
            <code className="text-2xl text-amber-400 font-bold">div ~ ul {'{'} color: red {'}'}</code>
            <p className="mt-4 text-slate-300">
              <strong>General sibling combinator.</strong> Matches any `&lt;ul&gt;` that follows a `&lt;div&gt;` sibling anywhere after it. This is the best match for "preceded by" without an "immediately" qualifier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
