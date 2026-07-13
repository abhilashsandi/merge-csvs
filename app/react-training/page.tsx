'use client';

import React, { useState } from 'react';
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
];

export default function ReactTrainingPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.Component || tabs[0].Component;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            React Interactive
          </h1>
          <p className="text-sm text-slate-500 mt-2">Candidate Training Portal</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-4">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-12">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
