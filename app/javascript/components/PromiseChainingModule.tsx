'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function PromiseChainingModule() {
  const [activeTab, setActiveTab] = useState(0);

  const snippets = [
    {
      title: "Candidate 1 (Correct)",
      code: `fetchUserData()
  .then((user) => {
    // Returning the inner promise passes its resolved value forward!
    return fetchUserPosts(user.id);
  })
  .then((posts) => {
    console.log(posts);
  })
  .catch((err) => {
    console.log(err);
  });`,
      correct: true,
      explanation: "Only returning a promise from inside .then() causes the outer chain to wait for it. A .catch() at the very end catches errors from every preceding step."
    },
    {
      title: "Candidate 2",
      code: `fetchUserData()
  .then((user) => {
    fetchUserPosts(user.id); // Forgot to return!
  })
  .then((posts) => {
    console.log(posts); // posts is undefined
  })
  .catch((err) => {
    console.log(err);
  });`,
      correct: false,
      explanation: "Without returning the inner promise, the next .then() executes immediately with undefined, instead of waiting for fetchUserPosts to finish."
    },
    {
      title: "Candidate 3",
      code: `fetchUserData()
  .then((user) => {
    fetchUserPosts(user.id).then((posts) => {
      console.log(posts);
    });
  })
  .catch((err) => {
    console.log(err); // Won't catch errors from fetchUserPosts!
  });`,
      correct: false,
      explanation: "Nesting fetchUserPosts().then(...) inside without returning it detaches any errors thrown in fetchUserPosts from the outer .catch() handler."
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Promise Chaining</h2>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
        How do we correctly retrieve user data, then that user's posts, using a single shared error handler?
      </p>

      <div className="flex gap-4 mt-8">
        {snippets.map((snip, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === idx ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {snip.title}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden"
      >
        {snippets[activeTab].correct ? (
          <div className="absolute top-0 right-0 p-4 text-emerald-500 bg-emerald-500/10 rounded-bl-2xl font-bold text-sm">
            ✅ CORRECT
          </div>
        ) : (
          <div className="absolute top-0 right-0 p-4 text-red-500 bg-red-500/10 rounded-bl-2xl font-bold text-sm">
            ❌ INCORRECT
          </div>
        )}
        
        <div className="bg-[#0d1117] rounded-xl p-5 border border-slate-800/60 shadow-inner mt-6">
          <pre className="text-sm font-mono text-slate-300 overflow-x-auto whitespace-pre">
            <code>{snippets[activeTab].code}</code>
          </pre>
        </div>
        
        <div className="mt-6 p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm leading-relaxed">
          <strong>Explanation:</strong> {snippets[activeTab].explanation}
        </div>
      </motion.div>
    </div>
  );
}
