'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const codingQuestions = [
  {
    id: 'q4',
    title: 'Q4: Sorting the Array (Odd/Even Positions)',
    description: 'An array (1-based indexing) must be arranged so every odd position holds an odd element and every even position holds an even element.',
    cases: `Given 4 cases describing relationships between array length (n) and counts of odd/even elements, in which case(s) is this possible?
- Case 1: n even, count(even) = count(odd)
- Case 2: n even, count(even) − count(odd) = 1
- Case 3: n odd, count(even) = count(odd)
- Case 4: n odd, count(even) − count(odd) = 1`,
    approach: `If n is even, there are exactly n/2 odd positions and n/2 even positions — so the array is arrangeable iff count(odd elements) = count(even elements). This is exactly Case 1's condition. Case 2 breaks this required equality, so it fails.
If n is odd, odd positions outnumber even positions by exactly 1 (since position 1 and the last position are both odd). This means we need count(odd elements) − count(even elements) = 1.`,
    answer: 'Only Case 1.',
  },
  {
    id: 'q7',
    title: 'Q7: Server Downtime Counter',
    description: 'Given a list of server uptime intervals [start, end] (1-indexed, inclusive, possibly overlapping) within a monitoring window [1, t], compute total downtime in seconds.',
    code: `type SweepEvent = { time: number; delta: 1 | -1 };

function getTotalDowntime(interval: number[][], t: number): number {
    if (interval.length === 0) return t;
    const events = buildSweepEvents(interval);
    const uptime = computeUptime(events);
    return t - uptime;
}

function buildSweepEvents(interval: number[][]): SweepEvent[] {
    const events: SweepEvent[] = [];
    for (const [start, end] of interval) {
        events.push({ time: start, delta: 1 });
        events.push({ time: end + 1, delta: -1 });
    }
    events.sort((a, b) => a.time - b.time || a.delta - b.delta);
    return events;
}

function computeUptime(events: SweepEvent[]): number {
    let uptime = 0;
    let active = 0;
    let prevTime = 1;
    for (const { time, delta } of events) {
        if (active > 0) uptime += time - prevTime;
        active += delta;
        prevTime = time;
    }
    return uptime;
}`,
    approach: 'Intervals are inclusive. A sweep-line technique handles overlaps gracefully: each interval emits a +1 event at start and a -1 event at end+1. Scanning events left-to-right and accumulating time where active > 0 gives total uptime.',
    answer: 'See code implementation.'
  },
  {
    id: 'q8',
    title: 'Q8: VanillaJS Expense Tracker',
    description: 'Complete script.js for an expense tracker. Validate name, amount, and category, insert rows into a table, and update percentage breakdown bars.',
    code: `'use strict';
function onDomReady() {
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseCategorySelect = document.getElementById('expenseCategory');
    const addButton = document.getElementById('add-button');
    const expensesTableBody = document.getElementById('expensesTableBody');
    const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Other'];
    let expenses = [];

    function validateExpense(name, amount, category) {
        if (!name || name.trim() === '') {
            alert('Expense Name required');
            return false;
        }
        if (amount === '' || isNaN(amount) || Number(amount) <= 0) {
            alert('Expense Amount required and should be greater than 0');
            return false;
        }
        if (!category) {
            alert('Please Choose Expense Type');
            return false;
        }
        return true;
    }

    addButton.addEventListener('click', () => {
        const name = expenseNameInput.value;
        const amount = expenseAmountInput.value;
        const category = expenseCategorySelect.value;
        if (!validateExpense(name, amount, category)) return;
        expenses.push({ name, amount: Number(amount), category });
        // ... append row and update breakdown ...
    });
}
document.addEventListener('DOMContentLoaded', onDomReady);`,
    approach: 'Wrap logic in DOMContentLoaded to ensure elements exist. Be precise with exact validation string matching since tests check case-sensitivity.',
    answer: 'See partial implementation highlighting key event listeners and exact string matching.'
  },
  {
    id: 'q11',
    title: 'Q11: REST API Average Heartbeat',
    description: 'Query https://jsonmock.hackerrank.com/api/marathon with pagination, filter by sex and marathon name, compute average heart rate rounded down.',
    code: `async function fetchAllRunnersBySex(sex: string): Promise<Runner[]> {
    const allRunners: Runner[] = [];
    let currentPage = 1;
    let totalPages = 1;
    do {
        const pageResult = await fetchMarathonPage(sex, currentPage);
        totalPages = pageResult.total_pages;
        allRunners.push(...pageResult.data);
        currentPage++;
    } while (currentPage <= totalPages);
    return allRunners;
}

async function averageHeartBeat(marathon: string, sex: string): Promise<number> {
    try {
        const runnersBySex = await fetchAllRunnersBySex(sex);
        const matching = runnersBySex.filter(r => r.marathon_name === marathon);
        if (matching.length === 0) return 0;
        
        const sum = matching.reduce((s, r) => s + r.avgheartbeat, 0);
        return Math.floor(sum / matching.length);
    } catch (error) {
        return 0;
    }
}`,
    approach: 'The API only filters by sex via query string; marathon filtering must be done client-side. Global fetch was missing in the HackerRank Node environment, requiring axios. Used a do-while loop to paginate.',
    answer: 'See async/await implementation.'
  }
];

export function HackerrankCodingModule() {
  const [activeId, setActiveId] = useState(codingQuestions[0].id);
  const activeQuestion = codingQuestions.find(q => q.id === activeId);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Hackerrank Coding Problems</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Real-world coding test problems covering arrays, sweep-line algorithms, DOM manipulation, and paginated API fetching.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-2">
          {codingQuestions.map(q => (
            <button
              key={q.id}
              onClick={() => setActiveId(q.id)}
              className={\`w-full text-left px-4 py-4 rounded-xl border transition-all duration-300 \${
                activeId === q.id 
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-700 dark:text-rose-300 shadow-md shadow-rose-500/10' 
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-white/20 hover:bg-rose-50 dark:hover:bg-white/10'
              }\`}
            >
              <h3 className="font-semibold text-sm sm:text-base">{q.title}</h3>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="w-full lg:w-2/3">
          <AnimatePresence mode="wait">
            {activeQuestion && (
              <motion.div
                key={activeQuestion.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8"
              >
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{activeQuestion.title}</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Problem Statement</h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{activeQuestion.description}</p>
                    {activeQuestion.cases && (
                      <pre className="mt-3 bg-slate-100 dark:bg-black/30 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono border border-slate-200 dark:border-white/5">
                        {activeQuestion.cases}
                      </pre>
                    )}
                  </div>

                  {activeQuestion.code && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Code Implementation</h4>
                      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 bg-[#0d1117] shadow-xl">
                        <div className="flex px-4 py-2 bg-[#161b22] border-b border-white/10 gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <pre className="p-4 overflow-x-auto text-sm text-blue-300 font-mono">
                          <code>{activeQuestion.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Approach & Solution</h4>
                    <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-xl">
                      <p className="text-rose-900 dark:text-rose-200 mb-3 leading-relaxed">{activeQuestion.approach}</p>
                      <div className="font-bold text-rose-700 dark:text-rose-400">
                        Answer: <span className="font-medium">{activeQuestion.answer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
