'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Module Imports
import { JsFundamentalsModule } from './components/JsFundamentalsModule';
import { CoreHooksModule } from './components/CoreHooksModule';
import { PromiseModule } from './components/PromiseModule';
import { ConcurrentModule } from './components/ConcurrentModule';
import { RouterModule } from './components/RouterModule';
import { FormModule } from './components/FormModule';
import { RtlModule } from './components/RtlModule';
import { MemoModule } from './components/MemoModule';
import { AlgorithmsModule } from './components/AlgorithmsModule';
import { React19Module } from './components/React19Module';
import { MockInterviewModule } from './components/MockInterviewModule';

const tabs = [
  { id: 'js', label: 'JavaScript Fundamentals', Component: JsFundamentalsModule },
  { id: 'hooks', label: 'Core Hooks (useEffect, Custom)', Component: CoreHooksModule },
  { id: 'promises', label: 'Promises & Async', Component: PromiseModule },
  { id: 'concurrent', label: 'React 18 (useDeferredValue, Suspense)', Component: ConcurrentModule },
  { id: 'memo', label: 'Performance (React.memo, useCallback)', Component: MemoModule },
  { id: 'router', label: 'React Router (Navigate, Params)', Component: RouterModule },
  { id: 'rtl', label: 'React Testing Library (RTL)', Component: RtlModule },
  { id: 'forms', label: 'Controlled vs Uncontrolled', Component: FormModule },
  { id: 'algorithms', label: 'Coding Practice (Algorithms)', Component: AlgorithmsModule },
  { id: 'react19', label: 'React 19 (Actions, use)', Component: React19Module },
  { id: 'interview', label: 'Mock Interviewer (AI)', Component: MockInterviewModule },
];

export default function ReactTrainingPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.Component || tabs[0].Component;

  // Modern Sidebar Navigation Component
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a0f1a]/80 backdrop-blur-xl border-r border-white/5 relative z-20">
      <div className="p-6 md:p-8 shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20 border border-white/10">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          React<span className="text-violet-400">Interactive</span>
        </h1>
        <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase mt-2">Candidate Training</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-1" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
              className={`w-full relative flex items-center px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                isActive 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-violet-500/15 border border-violet-500/30 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isActive ? 'bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]' : 'bg-slate-700'}`} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
      
    </div>
  );

  return (
    <div className="dark min-h-screen bg-[#06080d] text-slate-200 flex flex-col md:flex-row font-sans selection:bg-violet-500/30 relative overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-xl sticky top-0 z-50">
        <h1 className="text-xl font-black text-white tracking-tight">
          React<span className="text-violet-400">Interactive</span>
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[300px] z-[70] md:hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-50">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-2.5 text-slate-400 hover:text-white bg-black/50 border border-white/10 rounded-xl backdrop-blur-md"
                >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
              </div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[320px] shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative scroll-smooth">
        {/* Deep background ambient glows */}
        <div className="fixed top-[-10%] left-[20%] w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="fixed top-[40%] right-[30%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        <div className="relative z-10 w-full mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-16 pb-32 min-h-full">
          {mounted && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex flex-col"
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
