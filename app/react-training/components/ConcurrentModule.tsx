import React, { useState, useTransition, useDeferredValue, useOptimistic, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simulate a slow component to demonstrate concurrency
const SlowList = React.memo(function SlowList({ text }: { text: string }) {
  // Artificially slow down rendering to guarantee visible main thread blocking
  const start = performance.now();
  while (performance.now() - start < 30) {
    // 30ms synchronous block per render to simulate a heavy component
  }

  let items = [];
  for (let i = 0; i < 1500; i++) {
    items.push(
      <li key={i} className="py-3 px-4 mb-2 rounded-xl bg-slate-800/40 border border-slate-700/50 shadow-sm flex items-center justify-between text-sm backdrop-blur-sm transition-colors hover:bg-slate-700/50">
        <span className="text-slate-400 font-mono text-xs">Node_ID: {i}</span>
        <span className="font-semibold text-cyan-400 truncate max-w-[150px]">{text || 'Standby'}</span>
      </li>
    );
  }
  return (
    <ul className="mt-2 h-[500px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
      {items}
    </ul>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// useTransition Demo
// ─────────────────────────────────────────────────────────────────────────────
const TABS = ['Home', 'Dashboard', 'Settings', 'Profile'] as const;
type Tab = typeof TABS[number];

const TAB_CONTENT: Record<Tab, string> = {
  Home: 'Welcome to the Home tab. Fast to render.',
  Dashboard: 'Dashboard loaded — imagine charts and complex visualisations here.',
  Settings: 'Adjust your preferences in the Settings panel.',
  Profile: 'Your profile details and activity feed live here.',
};

function UseTransitionDemo() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  function handleTabClick(tab: Tab) {
    setPendingTab(tab);
    startTransition(() => {
      setActiveTab(tab);
      setPendingTab(null);
    });
  }

  return (
    <div className="space-y-12 relative z-10">
      <div className="text-center space-y-6 mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          useTransition API
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-purple-200">
          useTransition
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Mark a state update as <strong className="text-white">non-urgent</strong>. React will keep the UI responsive and batch the expensive work as a low-priority transition.
        </p>
      </div>

      {/* Interview Q&A Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl bg-slate-900/60 border border-violet-500/20 backdrop-blur-2xl shadow-2xl max-w-3xl mx-auto relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <h3 className="text-xl font-bold text-violet-300 mb-3 relative z-10 flex items-center gap-2">
          <span className="text-2xl">🎤</span> Interview Q&amp;A
        </h3>
        <div className="space-y-4 relative z-10">
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">
              Q: What is <code className="text-violet-300 bg-violet-900/30 px-1.5 py-0.5 rounded">useTransition</code>?
            </p>
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-white">A:</strong> It marks a state update as <em>non-urgent</em>, keeping the UI responsive.{' '}
              <code className="text-violet-200 bg-violet-900/30 px-1.5 py-0.5 rounded">startTransition</code> wraps the low-priority state update, and{' '}
              <code className="text-violet-200 bg-violet-900/30 px-1.5 py-0.5 rounded">isPending</code> is{' '}
              <code className="text-white">true</code> while React is still processing it in the background.
            </p>
          </div>
          <div className="h-px bg-slate-700/50" />
          <div>
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Q: What stays responsive?</p>
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-white">A:</strong> High-priority updates — hover states, focus rings, other user interactions — are never blocked. React finishes them first, then processes the transition.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Interactive Tab Demo + Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent rounded-3xl -z-10 blur-xl pointer-events-none" />

        {/* Interactive Demo */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
            <span className="text-2xl drop-shadow-md">🖱️</span> Live Tab Switcher
          </h3>
          <p className="text-sm text-slate-400 mb-6 relative z-10">
            Tab switching is wrapped in{' '}
            <code className="text-violet-300 bg-violet-900/30 px-1 py-0.5 rounded">startTransition</code>. Notice how{' '}
            <code className="text-white font-bold">isPending</code> drives the spinner — the button stays interactive while React renders.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap relative z-10">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                    : 'bg-slate-800/60 text-slate-400 hover:bg-slate-700/70 hover:text-white'
                }`}
              >
                {tab}
                {pendingTab === tab && isPending && (
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className={`flex-1 p-6 rounded-2xl border transition-all duration-300 relative z-10 ${
                isPending
                  ? 'bg-slate-800/30 border-dashed border-violet-500/30 opacity-60'
                  : 'bg-slate-800/60 border-slate-700/50'
              }`}
            >
              {isPending && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 rounded-2xl"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              )}
              <p className="text-violet-200 text-sm font-mono mb-1 opacity-70">{activeTab}.tsx</p>
              <p className="text-slate-200 leading-relaxed relative z-10">{TAB_CONTENT[activeTab]}</p>
            </motion.div>
          </AnimatePresence>

          {/* isPending status */}
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className={`w-2 h-2 rounded-full ${isPending ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-xs font-mono text-slate-400">
              isPending:{' '}
              <span className={isPending ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>{String(isPending)}</span>
            </span>
          </div>
        </div>

        {/* Code Snippet */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl flex flex-col justify-center">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-300">Implementation</h4>
              <span className="text-xs font-mono text-violet-400 bg-violet-900/30 px-2 py-1 rounded">useTransition</span>
            </div>
            <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
              <code>{`const [isPending, startTransition] = useTransition();
const [tab, setTab] = useState('Home');

function handleTabClick(nextTab) {
  // Wrap the LOW-PRIORITY state setter
  startTransition(() => {
    setTab(nextTab);    // ← wraps the SETTER
  });
}

return (
  <>
    <TabBar onClick={handleTabClick} />
    {isPending && <Spinner />}
    <TabContent tab={tab} />
  </>
);`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// useTransition vs useDeferredValue Comparison
// ─────────────────────────────────────────────────────────────────────────────
function TransitionVsDeferredComparison() {
  return (
    <div className="space-y-12 relative z-10">
      <div className="text-center space-y-6 mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          Side-by-Side Comparison
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-200 to-cyan-200">
          useTransition vs useDeferredValue
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Both defer low-priority work — but they hook in at a different point in the data-flow.
        </p>
      </div>

      {/* Core Distinction Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl bg-gradient-to-r from-violet-900/40 via-slate-900/60 to-sky-900/40 border border-slate-700/50 backdrop-blur-2xl shadow-2xl max-w-3xl mx-auto text-center"
      >
        <p className="text-lg font-bold text-white leading-relaxed">
          <code className="text-violet-300 bg-violet-900/30 px-2 py-1 rounded text-base">useTransition</code>
          <span className="text-slate-400 mx-3">wraps the</span>
          <span className="text-violet-200 font-extrabold underline decoration-dotted">STATE SETTER</span>
          <span className="text-slate-600 mx-4">·</span>
          <code className="text-sky-300 bg-sky-900/30 px-2 py-1 rounded text-base">useDeferredValue</code>
          <span className="text-slate-400 mx-3">wraps the</span>
          <span className="text-sky-200 font-extrabold underline decoration-dotted">STATE VALUE</span>
        </p>
      </motion.div>

      {/* Code comparison cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent rounded-3xl -z-10 blur-xl pointer-events-none" />

        {/* useTransition card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-slate-900/60 border border-violet-500/20 backdrop-blur-2xl shadow-2xl flex flex-col relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3 relative z-10">
            <span className="px-3 py-1 rounded-lg bg-violet-600/30 text-violet-300 text-sm font-mono border border-violet-500/30">useTransition</span>
          </h3>
          <p className="text-sm text-slate-400 mb-6 relative z-10">
            You <strong className="text-white">own</strong> the state. Wrap the setter call inside{' '}
            <code className="text-violet-300">startTransition</code>.
          </p>
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 rounded-xl bg-slate-950/80 border border-violet-900/30 shadow-inner flex-1 relative z-10">
            <code>{`// You CONTROL the state setter
const [isPending, startTransition] = useTransition();
const [query, setQuery] = useState('');

function handleChange(e) {
  // Non-urgent: defer the expensive filter
  startTransition(() => {
    setQuery(e.target.value); // ← SETTER
  });
}

// isPending → true while React is filtering`}</code>
          </pre>
          <div className="mt-4 p-3 rounded-xl bg-violet-950/50 border border-violet-800/40 relative z-10">
            <p className="text-xs text-violet-300 font-semibold">📌 Key signal:</p>
            <p className="text-xs text-slate-400 mt-1">
              You call <code className="text-violet-200">startTransition(() =&gt; setState(...))</code> — you decide <em>when</em> it's low-priority.
            </p>
          </div>
        </motion.div>

        {/* useDeferredValue card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-slate-900/60 border border-sky-500/20 backdrop-blur-2xl shadow-2xl flex flex-col relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3 relative z-10">
            <span className="px-3 py-1 rounded-lg bg-sky-600/30 text-sky-300 text-sm font-mono border border-sky-500/30">useDeferredValue</span>
          </h3>
          <p className="text-sm text-slate-400 mb-6 relative z-10">
            You <strong className="text-white">don't</strong> own the state. Receive a value from a parent — defer the value.
          </p>
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 rounded-xl bg-slate-950/80 border border-sky-900/30 shadow-inner flex-1 relative z-10">
            <code>{`// You RECEIVE the value from a parent
function SearchResults({ query }) {
  //                         ↑ prop — you don't own it

  // Defer the VALUE, not the setter
  const deferredQuery = useDeferredValue(query); // ← VALUE

  const isStale = query !== deferredQuery;

  return (
    <div className={isStale ? 'opacity-50' : ''}>
      <ExpensiveList filter={deferredQuery} />
    </div>
  );
}`}</code>
          </pre>
          <div className="mt-4 p-3 rounded-xl bg-sky-950/50 border border-sky-800/40 relative z-10">
            <p className="text-xs text-sky-300 font-semibold">📌 Key signal:</p>
            <p className="text-xs text-slate-400 mt-1">
              You pass the result to children — React keeps showing the old value while the new render is being prepared.
            </p>
          </div>
        </motion.div>
      </div>

      {/* When to use each — Guidance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
          <span className="text-2xl">🧭</span> When to use each
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* useTransition guidance */}
          <div className="p-6 rounded-2xl bg-violet-950/40 border border-violet-500/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-violet-600/30 text-violet-300 text-sm font-mono border border-violet-500/30 font-bold">useTransition</span>
            </div>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              Use when <strong className="text-violet-200">you control the state update</strong> — the state lives in the same component where you call <code className="text-violet-300">setState</code>.
            </p>
            <ul className="space-y-2">
              {[
                { icon: '🗂️', label: 'Tab switching (expensive tab render)' },
                { icon: '🔍', label: 'Search/filter with a list you own' },
                { icon: '📊', label: 'Sorting a large data set on click' },
                { icon: '🧭', label: 'Client-side route transitions' },
              ].map(({ icon, label }) => (
                <li key={label} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-base shrink-0">{icon}</span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* useDeferredValue guidance */}
          <div className="p-6 rounded-2xl bg-sky-950/40 border border-sky-500/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-lg bg-sky-600/30 text-sky-300 text-sm font-mono border border-sky-500/30 font-bold">useDeferredValue</span>
            </div>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              Use when you <strong className="text-sky-200">receive the value from a parent</strong> and can't control when it updates — you have the value, not the setter.
            </p>
            <ul className="space-y-2">
              {[
                { icon: '📦', label: 'Child receives a query prop from parent' },
                { icon: '🎛️', label: 'Third-party state you cannot wrap' },
                { icon: '🌊', label: 'Streaming data passed down as a prop' },
                { icon: '🔗', label: 'URL-param-driven filters (via router)' },
              ].map(({ icon, label }) => (
                <li key={label} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-base shrink-0">{icon}</span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick-pick rule */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 relative z-10">
          <p className="text-sm text-slate-400 font-mono text-center">
            <span className="text-white font-bold">Quick rule:</span>{' '}
            Do you call <code className="text-violet-300">setState</code> directly? →{' '}
            <span className="text-violet-300 font-bold">useTransition</span>.{' '}
            Do you only receive a <code className="text-sky-300">value</code> as a prop? →{' '}
            <span className="text-sky-300 font-bold">useDeferredValue</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// High-Priority Interview Q&A Section
// ─────────────────────────────────────────────────────────────────────────────
function InterviewQASection() {
  const items = [
    {
      color: 'violet' as const,
      icon: '🎯',
      question: 'What is useTransition?',
      answer: (
        <>
          <code className="text-violet-200 bg-violet-900/30 px-1.5 py-0.5 rounded">useTransition</code> lets you mark a state update as{' '}
          <strong className="text-white">non-urgent</strong>. You call{' '}
          <code className="text-violet-200 bg-violet-900/30 px-1.5 py-0.5 rounded">{'startTransition(() => setState(...))'}</code>{' '}
          and React will process that update at lower priority — keeping buttons, inputs, and animations fully responsive.{' '}
          <code className="text-violet-200 bg-violet-900/30 px-1.5 py-0.5 rounded">isPending</code> is{' '}
          <code className="text-white">true</code> while the background render is in progress.
        </>
      ),
    },
    {
      color: 'sky' as const,
      icon: '⚡',
      question: 'What is useDeferredValue?',
      answer: (
        <>
          <code className="text-sky-200 bg-sky-900/30 px-1.5 py-0.5 rounded">useDeferredValue</code> takes a value and returns a{' '}
          <strong className="text-white">deferred copy</strong> of it. React re-renders the component that consumes the deferred value at low priority. If a higher-priority update arrives (e.g. the user types again), the deferred re-render is interrupted and restarted. It's the right tool when you{' '}
          <em>receive</em> a value from a parent and can't wrap the setter.
        </>
      ),
    },
    {
      color: 'emerald' as const,
      icon: '🏆',
      question: 'Why use useDeferredValue instead of debounce?',
      answer: (
        <>
          <strong className="text-white">Three key reasons:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-slate-300">
            <li>
              <strong className="text-emerald-300">Zero artificial delay</strong> — useDeferredValue starts immediately; debounce forces a fixed wait (e.g. 300 ms) even on fast machines.
            </li>
            <li>
              <strong className="text-emerald-300">Interruptible</strong> — React can abandon a deferred render mid-flight if a new keystroke arrives. A debounce timer cannot.
            </li>
            <li>
              <strong className="text-emerald-300">React-native</strong> — integrates with Suspense, Concurrent Mode, and transitions out of the box. Debounce requires manual cleanup and <code className="text-emerald-200">useEffect</code>.
            </li>
          </ol>
        </>
      ),
    },
  ];

  const colorMap = {
    violet: {
      badge: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
      card: 'border-violet-500/20',
      glow: 'from-violet-500/5 to-purple-500/5',
      q: 'text-violet-300',
    },
    sky: {
      badge: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      card: 'border-sky-500/20',
      glow: 'from-sky-500/5 to-cyan-500/5',
      q: 'text-sky-300',
    },
    emerald: {
      badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      card: 'border-emerald-500/20',
      glow: 'from-emerald-500/5 to-teal-500/5',
      q: 'text-emerald-300',
    },
  };

  return (
    <div className="space-y-12 relative z-10">
      <div className="text-center space-y-6 mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Must-Know Questions
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-orange-200">
          High-Priority Interview Q&amp;A
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The three questions that come up in every senior React interview on concurrency.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {items.map(({ color, icon, question, answer }, i) => {
          const c = colorMap[color];
          return (
            <motion.div
              key={question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl bg-slate-900/60 border ${c.card} backdrop-blur-2xl shadow-2xl relative overflow-hidden group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
              <div className="relative z-10">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${c.badge} text-xs font-semibold mb-4`}>
                  <span>{icon}</span> Q{i + 1}
                </div>
                <h3 className={`text-lg font-bold ${c.q} mb-3`}>{question}</h3>
                <div className="text-slate-300 text-sm leading-relaxed">{answer}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function DebounceVsDeferredDemo() {
  return (
    <div className="space-y-12 relative z-10">
      <div className="text-center space-y-6 mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Interview Question
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-teal-200">
          useDeferredValue vs Debounce
        </h2>
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl max-w-3xl mx-auto text-left relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h3 className="text-xl font-bold text-emerald-300 mb-2 relative z-10">Q: Why use useDeferredValue instead of debounce?</h3>
          <p className="text-slate-300 text-lg leading-relaxed relative z-10">
            <strong className="text-white">A:</strong> <code className="text-emerald-200 bg-emerald-900/30 px-1.5 py-0.5 rounded">useDeferredValue</code> keeps typing responsive without delaying user input. It renders in the background and can be interrupted if the user types again. Debouncing artificially delays execution by a fixed amount of time until typing completely stops.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-3xl -z-10 blur-xl pointer-events-none" />
        
        {/* Debounce Visualization */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl h-[400px] flex flex-col relative overflow-hidden group">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
            <span className="text-2xl drop-shadow-md">⏳</span> Debounce
          </h3>
          <p className="text-sm text-slate-400 mb-6">Forces the user to wait for a fixed delay (e.g. 500ms) after typing stops before any work begins.</p>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 text-xs text-slate-500 font-mono text-right">Type</div>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "30%", "30%", "60%", "60%", "100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 text-xs text-slate-500 font-mono text-right">Timer</div>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div 
                  className="h-full bg-amber-500"
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "0%", "20%", "0%", "20%", "0%", "40%"] }}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.2, 0.4, 0.4, 0.6, 0.8, 1] }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 text-xs text-slate-500 font-mono text-right">Render</div>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-rose-500"
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{ opacity: [0, 0, 0, 0, 0, 0, 1, 1], width: ["0%", "0%", "0%", "0%", "0%", "0%", "100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.2, 0.4, 0.6, 0.8, 0.85, 0.9, 1] }}
                />
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="text-xs font-mono text-slate-400">
                <span className="text-blue-400">Types</span> → <span className="text-amber-400">Timer</span> → <span className="text-blue-400">Types (resets)</span> → <span className="text-amber-400">Timer</span> → <span className="text-rose-400">Blocks & Renders</span>
              </div>
            </div>
          </div>
        </div>

        {/* useDeferredValue Visualization */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl h-[400px] flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
            <span className="text-2xl drop-shadow-md">⚡</span> useDeferredValue
          </h3>
          <p className="text-sm text-slate-400 mb-6 relative z-10">Starts rendering immediately in the background. Interrupts and restarts smoothly if the user types again.</p>
          
          <div className="flex-1 flex flex-col justify-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 text-xs text-slate-500 font-mono text-right">Type</div>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "30%", "30%", "60%", "60%", "100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 text-xs text-emerald-500 font-mono text-right font-bold">Bg Render</div>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden relative">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: "0%" }}
                  animate={{ width: ["0%", "0%", "30%", "0%", "40%", "0%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.2, 0.4, 0.4, 0.6, 0.8, 1] }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 text-xs text-slate-500 font-mono text-right">UI Update</div>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-400"
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{ opacity: [0, 0, 0, 0, 0, 0, 1, 1], width: ["0%", "0%", "0%", "0%", "0%", "0%", "100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.2, 0.4, 0.6, 0.8, 0.85, 0.9, 1] }}
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <div className="text-xs font-mono text-slate-400">
                <span className="text-blue-400">Types</span> → <span className="text-emerald-400">Bg Render starts</span> → <span className="text-blue-400">Types (interrupts)</span> → <span className="text-emerald-400">Restarts</span> → <span className="text-cyan-400">Shows UI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptimisticDemo() {
  const [comments, setComments] = useState<{id: string, text: string, isPending?: boolean}[]>([
    { id: '1', text: 'This UI feels so fast!' }
  ]);
  
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, newComment: {id: string, text: string, isPending?: boolean}) => [
      ...state,
      newComment
    ]
  );
  
  const [simulateError, setSimulateError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const action = async (formData: FormData) => {
    const text = formData.get('comment') as string;
    if (!text.trim()) return;
    
    formRef.current?.reset();
    
    const newComment = { id: Date.now().toString(), text, isPending: true };
    addOptimisticComment(newComment);
    
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (simulateError) reject(new Error('Network Error'));
          else resolve(true);
        }, 2000);
      });
      setComments(prev => [...prev, { id: newComment.id, text: newComment.text }]);
    } catch (err) {
      // In a real app, you might show a toast here. 
      // The optimistic state rolls back automatically.
    }
  };

  return (
    <div className="space-y-12 relative z-10">
      <div className="text-center space-y-6 mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          useOptimistic API
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-rose-200">
          Optimistic UI Updates
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Don't make users wait for the network. Update the UI instantly while the request completes in the background. If it fails, React rolls it back automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent rounded-3xl -z-10 blur-xl pointer-events-none" />
        
        {/* Chat / Comments Display */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl h-[400px] flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
            <span className="text-2xl drop-shadow-md">💬</span> Live Comments
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
            <AnimatePresence>
              {optimisticComments.map(comment => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: comment.isPending ? 0.7 : 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  layout
                  className={`p-4 rounded-2xl border ${comment.isPending ? 'bg-slate-800/40 border-dashed border-pink-500/30' : 'bg-slate-800/80 border-slate-700/50'} shadow-sm relative overflow-hidden`}
                >
                  {comment.isPending && (
                     <motion.div 
                       className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                       animate={{ x: ['-100%', '200%'] }}
                       transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                     />
                  )}
                  <p className="text-sm text-slate-200 relative z-10">{comment.text}</p>
                  {comment.isPending && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-pink-400 relative z-10">
                      <div className="w-3 h-3 border-[2px] border-pink-400 border-t-transparent rounded-full animate-spin" />
                      Sending... (2s)
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="absolute bottom-8 left-8 right-8 h-12 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none rounded-b-xl z-10" />
        </div>

        {/* Form and Controls */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl space-y-8 flex flex-col justify-center">
          <form ref={formRef} action={action} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3 ml-1">Add Comment</label>
              <input
                type="text"
                name="comment"
                placeholder="Type a message..."
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all shadow-inner"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold shadow-lg shadow-pink-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Post Comment</span>
              <span className="text-lg">✈️</span>
            </button>
          </form>

          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80">
             <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Simulate Network Error</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Force the background request to fail to see automatic rollback.</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setSimulateError(!simulateError)}
                  className={`relative w-16 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-rose-500/30 shadow-inner shrink-0 ${simulateError ? 'bg-rose-500' : 'bg-slate-700'}`}
                >
                  <motion.div 
                    layout
                    transition={{ type: "spring", stiffness: 600, damping: 35 }}
                    className="absolute top-1 bottom-1 w-6 bg-white rounded-full shadow-lg flex items-center justify-center"
                    style={{ left: simulateError ? 'calc(100% - 1.75rem)' : '0.25rem' }}
                  />
                </button>
              </div>
          </div>

          {/* useOptimistic Code Snippet */}
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-300">Implementation</h4>
              <span className="text-xs font-mono text-pink-400 bg-pink-900/30 px-2 py-1 rounded">useOptimistic</span>
            </div>
            <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
              <code>
{`const [optimistic, addOptimistic] = 
  useOptimistic(msgs, (state, newMsg) => [
    ...state, { ...newMsg, pending: true }
  ]);

const action = async (formData) => {
  // 1. Instantly update UI
  addOptimistic({ text: formData.get('msg') });
  
  // 2. Network request (auto-reverts if throws)
  await sendData(formData);
};`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simulate a heavy dynamic import
const HeavyWidget = lazy(() => new Promise<{ default: React.ComponentType }>((resolve) => {
  setTimeout(() => {
    resolve({
      default: () => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(168,85,247,0.2)]"
        >
          <div className="text-4xl mb-4">📦</div>
          <h4 className="text-xl font-bold text-white mb-2">Heavy Widget Loaded!</h4>
          <p className="text-purple-200/70 text-sm">This component and its dependencies were downloaded only when you clicked the button. This keeps the initial bundle size small.</p>
        </motion.div>
      )
    });
  }, 2000);
}));

function LazySuspenseDemo() {
  const [showWidget, setShowWidget] = useState(false);

  return (
    <div className="space-y-12 relative z-10 pt-24 border-t border-slate-800/50 mt-16">
      <div className="text-center space-y-6 mb-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          Code Splitting
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-fuchsia-200">
          Suspense & React.lazy
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Don't ship your entire application at once. Dynamically import heavy components only when the user needs them, and show a graceful loading state while the chunk downloads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-3xl -z-10 blur-xl pointer-events-none" />
        
        {/* Interactive Demo */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl h-[400px] flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          {!showWidget ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWidget(true)}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold shadow-lg shadow-purple-500/25 flex items-center gap-3 relative z-10"
            >
              <span>Load Heavy Widget</span>
              <span className="text-xl">⬇️</span>
            </motion.button>
          ) : (
            <div className="w-full max-w-md w-full relative z-10">
              <Suspense 
                fallback={
                  <div className="p-8 rounded-2xl bg-slate-800/40 border border-dashed border-purple-500/30 flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mb-4" />
                    <p className="text-purple-300 font-medium">Fetching JavaScript chunk over network...</p>
                    <p className="text-xs text-slate-500 mt-2 font-mono">lazy() is resolving...</p>
                  </div>
                }
              >
                <HeavyWidget />
              </Suspense>
            </div>
          )}
        </div>

        {/* Code Snippet */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl flex flex-col justify-center">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-700/50 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-slate-300">Implementation</h4>
              <div className="flex gap-2">
                <span className="text-xs font-mono text-purple-400 bg-purple-900/30 px-2 py-1 rounded">lazy</span>
                <span className="text-xs font-mono text-purple-400 bg-purple-900/30 px-2 py-1 rounded">Suspense</span>
              </div>
            </div>
            <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
              <code>
{`import { lazy, Suspense } from 'react';

// 1. Define the dynamic import (creates a separate chunk)
const HeavyWidget = lazy(() => import('./HeavyWidget'));

function Dashboard() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(true)}>
        Load Widget
      </button>

      {/* 2. Wrap the lazy component in a Suspense boundary */}
      {show && (
        <Suspense fallback={<Spinner text="Downloading..." />}>
          <HeavyWidget />
        </Suspense>
      )}
    </div>
  );
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConcurrentModule() {
  const [text, setText] = useState('');
  const [useConcurrent, setUseConcurrent] = useState(false);

  // When concurrent mode is off, we pass the raw text immediately (causes lag).
  // When on, we defer the value.
  const deferredText = useDeferredValue(text);
  
  // Decide which text to pass to the slow list based on toggle
  const listText = useConcurrent ? deferredText : text;
  
  // Check if we are currently rendering a deferred version
  const isStale = useConcurrent && text !== deferredText;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans text-slate-100 overflow-hidden relative">
      {/* Glassmorphic Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/30 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10 space-y-12"
      >
        {/* Header Section */}
        <div className="text-center space-y-6 mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            React 18 Concurrent Features
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-cyan-200">
            Non-Blocking UI
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience the difference between standard blocking renders and concurrent state updates using <code className="text-indigo-300 bg-indigo-900/30 px-2 py-0.5 rounded">useDeferredValue</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls & Demonstration */}
          <div className="space-y-8">
            
            {/* The "What the user actually sees" Section */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                  <span className="text-2xl drop-shadow-md">👀</span> What the user actually sees
                </h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed pr-4">
                  Observe the spinning indicator when you type. In <strong className="text-rose-400">Standard Mode</strong>, the heavy list render blocks the main thread, freezing the spinner. In <strong className="text-emerald-400">Concurrent Mode</strong>, React yields to the browser, keeping the spinner smooth!
                </p>
                
                <div className="flex items-center justify-center p-10 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-inner relative overflow-hidden">
                  {/* Decorative background grid */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                  
                  <div className="relative flex items-center justify-center">
                    {/* The continuous animation that will freeze if main thread blocks */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="w-24 h-24 rounded-full border-[6px] border-slate-800 border-t-cyan-400 border-r-indigo-500 shadow-[0_0_40px_rgba(34,211,238,0.25)]"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute w-8 h-8 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-full blur-[3px]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Controls Card */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl space-y-8">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
                <div>
                  <h4 className="font-bold text-white text-lg">Concurrent Mode</h4>
                  <p className="text-sm text-slate-400 mt-1">Enable useDeferredValue</p>
                </div>
                
                {/* Custom Animated Toggle Switch */}
                <button
                  onClick={() => setUseConcurrent(!useConcurrent)}
                  className={`relative w-20 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-inner ${useConcurrent ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  aria-label="Toggle Concurrent Mode"
                >
                  <motion.div 
                    layout
                    transition={{ type: "spring", stiffness: 600, damping: 35 }}
                    className="absolute top-1 bottom-1 w-8 bg-white rounded-full shadow-lg flex items-center justify-center"
                    style={{ left: useConcurrent ? 'calc(100% - 2.25rem)' : '0.25rem' }}
                  >
                    {useConcurrent ? (
                      <span className="text-emerald-500 text-xs font-black">ON</span>
                    ) : (
                      <span className="text-slate-400 text-xs font-black">OFF</span>
                    )}
                  </motion.div>
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3 ml-2">Test Input (Type rapidly!)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing..."
                    className="w-full px-6 py-5 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white text-lg placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-inner"
                  />
                  <AnimatePresence>
                    {isStale && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        className="absolute right-5 top-1/2 -translate-y-1/2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-indigo-400 bg-indigo-900/40 px-2 py-1 rounded-md">Background Render</span>
                          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            {/* useDeferredValue Code Snippet */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-300">Implementation</h4>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded">useDeferredValue</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                <code>
{`const [text, setText] = useState('');
// Defer value to keep main thread free
const deferred = useDeferredValue(text);

// True while background render is in progress
const isStale = text !== deferred;

<div className={isStale ? 'opacity-50' : ''}>
  <SlowHeavyList text={deferred} />
</div>`}
                </code>
              </pre>
            </div>
            
          </div>

          {/* Right Column: The Heavy Component */}
          <div className="relative rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl p-8 flex flex-col h-[750px] lg:h-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
              <div>
                <h3 className="text-xl font-bold text-white">Heavy Component</h3>
                <p className="text-xs text-slate-400 mt-1">Renders 1500 elements with artificial delay</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-slate-950/80 text-slate-300 border border-slate-700/80 shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isStale ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isStale ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
                {isStale ? 'STALE (RENDERING)' : 'IDLE / UP TO DATE'}
              </div>
            </div>

            <div className={`flex-1 transition-all duration-300 relative ${isStale ? 'opacity-50 scale-[0.99] filter blur-[1px]' : 'opacity-100 scale-100'}`}>
              <SlowList text={listText} />
            </div>
            
            {/* Fade out bottom of the list for visual appeal */}
            <div className="absolute bottom-8 left-8 right-8 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none rounded-b-xl" />
          </div>
        </div>

        {/* Educational Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
           <motion.div 
             whileHover={{ y: -5 }}
             className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md"
           >
             <h5 className="font-bold text-indigo-300 mb-3 text-lg flex items-center gap-2">
               <span className="bg-indigo-900/50 p-1.5 rounded-lg">🐢</span> Without Concurrency
             </h5>
             <p className="text-slate-400 leading-relaxed text-sm">
               The browser must finish painting all DOM updates (the heavy component) before it can handle the next keystroke event. This causes severe UI jank, input lag, and freezes any running CSS/JS animations on the page.
             </p>
           </motion.div>
           <motion.div 
             whileHover={{ y: -5 }}
             className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md"
           >
             <h5 className="font-bold text-cyan-300 mb-3 text-lg flex items-center gap-2">
               <span className="bg-cyan-900/50 p-1.5 rounded-lg">🚀</span> With Concurrency
             </h5>
             <p className="text-slate-400 leading-relaxed text-sm">
               React marks the heavy render as low-priority using <code className="text-cyan-200">useDeferredValue</code>. It yields to the browser to process high-priority user input and animations, keeping the UI incredibly responsive.
             </p>
           </motion.div>
        </div>
        {/* --- useTransition --- */}
        <div className="py-24 border-t border-slate-800/50 mt-16">
          <UseTransitionDemo />
        </div>

        {/* --- useTransition vs useDeferredValue --- */}
        <div className="py-24 border-t border-slate-800/50 mt-8">
          <TransitionVsDeferredComparison />
        </div>

        {/* --- Debounce vs Deferred --- */}
        <div className="py-24 border-t border-slate-800/50 mt-8">
          <DebounceVsDeferredDemo />
        </div>

        {/* --- High-Priority Interview Q&A --- */}
        <div className="py-24 border-t border-slate-800/50 mt-8">
          <InterviewQASection />
        </div>

        {/* --- Optimistic Updates Demo --- */}
        <div className="py-24 border-t border-slate-800/50 mt-16">
          <OptimisticDemo />
        </div>
        
        <LazySuspenseDemo />

      </motion.div>
    </div>
  );
}
