'use client';

import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as any },
  }),
};

export default function CodeBlock({ code, language = 'text' }: { code: string; language?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative group my-6"
    >
      <div className="bg-[#0d1117] border border-slate-300/50 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-slate-300/50 dark:border-slate-700/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono ml-2 uppercase tracking-wider">{language}</span>
        </div>
        <pre className="p-5 text-sm text-slate-700 dark:text-slate-300 overflow-x-auto font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </motion.div>
  );
}
