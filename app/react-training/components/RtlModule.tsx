import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css';
import { motion, AnimatePresence } from 'framer-motion';

const initialBadTestCode = `test('user can submit form', () => {
  render(<LoginForm onSubmit={jest.fn()} />);
  const emailInput = screen.getByLabelText('Email');
  const submitButton = screen.getByRole('button', { name: /submit/i });
  
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.click(submitButton);
  
  expect(emailInput.value).toBe('test@example.com');
});`;

// ─── Shared animation variants ───────────────────────────────────────────────
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export function RtlModule() {
  const [revealed, setRevealed] = useState(false);
  const [code, setCode] = useState(initialBadTestCode);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">React Testing Library (RTL)</h2>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Writing robust RTL tests means writing tests that resemble how users interact with your code. 
          Technical assessments often emphasize finding and fixing testing anti-patterns.
        </p>
      </div>

      {/* ── Interactive Editor ── */}
      <div className="bg-[#2d2d2d] rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
        <div className="bg-[#1e1e1e] px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-slate-400 font-mono">LoginForm.test.tsx - Interactive Editor</span>
        </div>
        <div className="p-4 text-sm font-mono overflow-x-auto min-h-[300px]">
          <Editor
            value={code}
            onValueChange={code => setCode(code)}
            highlight={code => Prism.highlight(code, Prism.languages.tsx, 'tsx')}
            padding={15}
            style={{
              fontFamily: '"Fira Code", "Consolas", monospace',
              fontSize: 15,
              backgroundColor: '#2d2d2d',
              color: '#ccc',
              outline: 'none'
            }}
          />
        </div>
        <div className="bg-[#1e1e1e] p-4 border-t border-slate-700 flex justify-end">
          <button 
            onClick={() => setCode(initialBadTestCode)}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-1.5 rounded-md hover:bg-slate-700/50"
          >
            Reset Code
          </button>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <button 
          onClick={() => setRevealed(!revealed)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 text-lg"
        >
          {revealed ? 'Hide Explanations' : 'Spot the 5 Bugs (Click to Reveal)'}
        </button>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="grid gap-4 overflow-hidden"
          >
            <BugCard 
              title="1. Targeting label instead of input"
              desc={"`getByLabelText('Email')` returns the `<label>` element, not the `<input>`. `fireEvent.change` on a label does nothing. Use `getByRole('textbox', { name: /email/i })`."}
            />
            <BugCard 
              title="2. fireEvent instead of userEvent"
              desc={"`fireEvent` bypasses the browser's event system. Use `await userEvent.type(...)` and `await userEvent.click(...)` for realistic interactions."}
            />
            <BugCard 
              title="3. No await on async actions"
              desc={"If `onSubmit` is async or triggers state updates, the test doesn't wait for completion. Use `await` and wrap assertions in `waitFor` if needed."}
            />
            <BugCard 
              title="4. Asserting input.value instead of onSubmit"
              desc={"Verifying the input still has the value is trivial. You should assert `expect(onSubmit).toHaveBeenCalledWith(...)` to verify the callback."}
            />
            <BugCard 
              title="5. No validation of side effects"
              desc={"Doesn't verify the form actually submitted (e.g., success message, loading state cleared). Always assert post-submission UI changes."}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Query Priority Guide ── */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mt-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Query Priority Guide</h3>
            <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-4xl">
              RTL encourages queries that reflect how users and assistive technologies perceive your UI.
              Follow this priority order to write tests that are both robust and accessible.
            </p>
          </div>
          <QueryPriorityGuide />
        </div>
      </motion.div>

      {/* ── Async Hook Testing Strategy ── */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mt-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Async Hook Testing Strategy</h3>
              <p className="text-slate-400 mt-2">What does each test actually validate in the component lifecycle?</p>
            </div>
            <a href="https://testing-library.com/docs/react-testing-library/intro" target="_blank" rel="noreferrer" className="text-sm font-bold bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900/80 px-4 py-2 rounded-xl transition-colors border border-indigo-700/50 flex items-center">
              RTL Best Practices &rarr;
            </a>
          </div>

          <AsyncTestVisualizer />

        </div>
      </div>

      {/* ── act() vs waitFor() ── */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mt-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">act() vs waitFor()</h3>
            <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-4xl">
              The infamous <code className="bg-slate-800 px-2 py-1 rounded text-purple-400 font-mono text-sm mx-1">act(...)</code> warning happens when React state updates outside of a test's expected flow. 
              Modern RTL provides <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono text-sm mx-1">userEvent</code> and <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono text-sm mx-1">waitFor</code> which wrap interactions implicitly, so you rarely need manual <code className="bg-slate-800 px-2 py-1 rounded text-purple-400 font-mono text-sm mx-1">act()</code> calls.
            </p>
          </div>

          <CodeComparison />

          <ActVsWaitForVisualizer />

        </div>
      </div>

      {/* ── Core RTL API & Mocking ── */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mt-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Core RTL API &amp; Mocking</h3>
            <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-4xl">
              Master the essential tools: <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono text-sm mx-1">render</code>, <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono text-sm mx-1">screen</code>, <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono text-sm mx-1">userEvent</code>, and asynchronous queries like <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono text-sm mx-1">findByRole</code>. 
              Learn how to properly isolate your components by mocking external dependencies like <code className="bg-slate-800 px-2 py-1 rounded text-blue-400 font-mono text-sm mx-1">fetch</code>.
            </p>
          </div>

          <CoreApiVisualizer />
        </div>
      </div>

      {/* ── The Three Golden Paths ── */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mt-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">The Three Golden Paths</h3>
            <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-4xl">
              Every data-fetching component has three critical states. Writing robust tests means covering the <strong>Happy Path</strong>, the <strong>Loading State</strong>, and the <strong>Error Path</strong>.
            </p>
          </div>

          <TestPathsVisualizer />
        </div>
      </div>

      {/* ── Common Mistakes to Avoid ── */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mt-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Common Mistakes to Avoid</h3>
            <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-4xl">
              These are the most frequent pitfalls engineers hit in code reviews and technical assessments. Memorise them.
            </p>
          </div>
          <CommonMistakes />
        </div>
      </motion.div>

      {/* ── Key Interview Q&A ── */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className="bg-slate-900 rounded-3xl p-8 border border-slate-800 mt-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">Key Interview Q&amp;A</h3>
            <p className="text-slate-400 mt-3 text-lg leading-relaxed max-w-4xl">
              These questions appear regularly in senior front-end interviews. Know the precise answers cold.
            </p>
          </div>
          <InterviewQA />
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Query Priority Guide
// ─────────────────────────────────────────────────────────────────────────────

const queryRows = [
  {
    rank: 1,
    query: 'getByRole',
    color: 'emerald',
    when: 'Almost always — prefer this first',
    example: "getByRole('button', { name: /submit/i })",
    why: 'Mirrors how screen readers traverse the DOM. Finds elements by ARIA role.',
  },
  {
    rank: 2,
    query: 'getByLabelText',
    color: 'blue',
    when: 'Form inputs tied to a <label>',
    example: "getByLabelText(/email address/i)",
    why: 'Enforces label–input association. Fails if the label is missing (good!)',
  },
  {
    rank: 3,
    query: 'getByText',
    color: 'violet',
    when: 'Non-interactive visible text (paragraphs, headings, list items)',
    example: "getByText(/welcome back/i)",
    why: 'Finds by rendered text content — fragile if copy changes but clear intent.',
  },
  {
    rank: 4,
    query: 'getByTestId',
    color: 'amber',
    when: 'Last resort — nothing else uniquely identifies the element',
    example: 'getByTestId("user-avatar")',
    why: 'Not user-visible. Adds coupling to implementation. Use sparingly.',
  },
];

const colorMap: Record<string, { badge: string; border: string; dot: string; rank: string }> = {
  emerald: {
    badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    dot:    'bg-emerald-400',
    rank:   'text-emerald-300',
  },
  blue: {
    badge: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    border: 'border-blue-500/30 hover:border-blue-500/60',
    dot:    'bg-blue-400',
    rank:   'text-blue-300',
  },
  violet: {
    badge: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    border: 'border-violet-500/30 hover:border-violet-500/60',
    dot:    'bg-violet-400',
    rank:   'text-violet-300',
  },
  amber: {
    badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    border: 'border-amber-500/30 hover:border-amber-500/60',
    dot:    'bg-amber-400',
    rank:   'text-amber-300',
  },
};

function QueryPriorityGuide() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {/* Priority ladder */}
      {queryRows.map((row, idx) => {
        const c = colorMap[row.color];
        const isActive = active === idx;
        return (
          <motion.div
            key={row.query}
            layout
            onClick={() => setActive(isActive ? null : idx)}
            className={`cursor-pointer rounded-2xl border bg-white/[0.02] backdrop-blur-sm p-5 transition-all duration-300 ${c.border} ${isActive ? 'shadow-lg scale-[1.01]' : 'hover:bg-white/[0.04]'}`}
          >
            <div className="flex items-center gap-4">
              {/* Rank badge */}
              <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg ${c.badge}`}>
                {row.rank}
              </div>

              {/* Query name */}
              <code className="flex-shrink-0 font-mono font-bold text-white text-base">{row.query}</code>

              {/* When blurb */}
              <span className="text-slate-400 text-sm hidden sm:block">{row.when}</span>

              {/* Chevron */}
              <motion.span
                animate={{ rotate: isActive ? 180 : 0 }}
                className="ml-auto text-slate-500"
              >
                ▾
              </motion.span>
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Example usage</p>
                      <code className="block bg-[#1e1e1e] rounded-xl px-4 py-3 text-sm font-mono text-slate-200 border border-slate-700">
                        {row.example}
                      </code>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Why this priority?</p>
                      <p className="text-slate-300 text-sm leading-relaxed">{row.why}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Summary table */}
      <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-700 shadow-inner">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60 text-left">
              <th className="px-5 py-3 text-slate-400 font-semibold tracking-wide">Priority</th>
              <th className="px-5 py-3 text-slate-400 font-semibold tracking-wide">Query</th>
              <th className="px-5 py-3 text-slate-400 font-semibold tracking-wide hidden md:table-cell">Use when…</th>
              <th className="px-5 py-3 text-slate-400 font-semibold tracking-wide hidden lg:table-cell">Async variant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {queryRows.map(row => {
              const c = colorMap[row.color];
              return (
                <tr key={row.query} className="hover:bg-slate-800/30 transition-colors">
                  <td className={`px-5 py-3 font-bold ${c.rank}`}>{row.rank}</td>
                  <td className="px-5 py-3">
                    <code className="font-mono text-white">{row.query}</code>
                  </td>
                  <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{row.when}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <code className="font-mono text-slate-400">{row.query.replace('getBy', 'findBy')}</code>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Common Mistakes
// ─────────────────────────────────────────────────────────────────────────────

const mistakes = [
  {
    id: 'async-query',
    icon: '⏳',
    title: "Don't use getBy* for async elements",
    color: 'rose',
    bad: `// ❌ getBy* throws IMMEDIATELY if element isn't in the DOM yet
const alert = screen.getByRole('alert'); // throws before fetch resolves`,
    good: `// ✅ findBy* returns a Promise and retries until timeout (default 1000ms)
const alert = await screen.findByRole('alert');

// ✅ Or use waitFor for more complex assertions
await waitFor(() => {
  expect(screen.getByRole('alert')).toBeInTheDocument();
});`,
    detail: 'getBy* is synchronous. If the element appears asynchronously (after a fetch, state update, or animation), the query throws before React ever renders it. Use findBy* or waitFor for anything async.',
  },
  {
    id: 'clear-mocks',
    icon: '🧹',
    title: "Don't forget to clear mocks between tests",
    color: 'amber',
    bad: `// ❌ Mock state from test A bleeds into test B
global.fetch = jest.fn();

it('test A', () => { /* sets up mock calls */ });
it('test B', () => {
  // fetch.mock.calls still has calls from test A!
  expect(fetch).toHaveBeenCalledTimes(1); // might be 2!
});`,
    good: `// ✅ Reset after every test — put this in your describe block or setup file
afterEach(() => {
  jest.clearAllMocks(); // clears call counts and instances
  // OR jest.resetAllMocks(); // also resets mock implementations
});`,
    detail: 'jest.clearAllMocks() resets call counts, instances, and results. jest.resetAllMocks() also removes mock implementations. jest.restoreAllMocks() restores spied-on originals. Use clearAllMocks in afterEach unless you need stronger resets.',
  },
  {
    id: 'impl-details',
    icon: '🔍',
    title: "Don't test implementation details",
    color: 'violet',
    bad: `// ❌ Testing internal state — breaks on refactor
const { result } = renderHook(() => useCounter());
expect(result.current.count).toBe(0); // internal state
expect(result.current._privateRef.current).toBeDefined(); // private ref

// ❌ Testing component method directly
const instance = renderer.getInstance();
instance.handleClick(); // component methods aren't public API`,
    good: `// ✅ Test observable UI behavior — what the user sees
render(<Counter />);
expect(screen.getByText('Count: 0')).toBeInTheDocument();

await userEvent.click(screen.getByRole('button', { name: /increment/i }));
expect(screen.getByText('Count: 1')).toBeInTheDocument();`,
    detail: 'Tests that reach into internal state or methods break whenever you refactor, even if behavior stays the same. RTL is designed to prevent this: if you can\'t query it via screen, it\'s an implementation detail.',
  },
];

const mistakeColors: Record<string, { border: string; header: string; dot: string; tag: string }> = {
  rose:   { border: 'border-rose-500/30',   header: 'bg-rose-500/10 border-rose-500/20',   dot: 'bg-rose-400',   tag: 'bg-rose-500/20 text-rose-300' },
  amber:  { border: 'border-amber-500/30',  header: 'bg-amber-500/10 border-amber-500/20',  dot: 'bg-amber-400',  tag: 'bg-amber-500/20 text-amber-300' },
  violet: { border: 'border-violet-500/30', header: 'bg-violet-500/10 border-violet-500/20', dot: 'bg-violet-400', tag: 'bg-violet-500/20 text-violet-300' },
};

function CommonMistakes() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      {mistakes.map((m) => {
        const c = mistakeColors[m.color];
        const isOpen = open === m.id;
        return (
          <div
            key={m.id}
            className={`rounded-2xl border bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 ${c.border}`}
          >
            {/* Header */}
            <button
              onClick={() => setOpen(isOpen ? null : m.id)}
              className={`w-full text-left px-6 py-4 flex items-center gap-4 border-b transition-colors ${isOpen ? c.header : 'border-transparent hover:bg-white/[0.03]'}`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="font-bold text-white flex-1 text-lg">{m.title}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-500 text-sm">
                ▾
              </motion.span>
            </button>

            {/* Expandable content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-6 space-y-5">
                    {/* Detail prose */}
                    <p className="text-slate-300 text-sm leading-relaxed">{m.detail}</p>

                    {/* Bad / Good split */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-red-400 mb-2 font-semibold">❌ Anti-pattern</p>
                        <pre className="bg-[#1e1e1e] rounded-xl p-4 text-sm font-mono text-slate-300 border border-red-900/40 overflow-x-auto">
                          <code dangerouslySetInnerHTML={{ __html: Prism.highlight(m.bad, Prism.languages.tsx, 'tsx') }} />
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-emerald-400 mb-2 font-semibold">✅ Best practice</p>
                        <pre className="bg-[#1e1e1e] rounded-xl p-4 text-sm font-mono text-slate-300 border border-emerald-900/40 overflow-x-auto">
                          <code dangerouslySetInnerHTML={{ __html: Prism.highlight(m.good, Prism.languages.tsx, 'tsx') }} />
                        </pre>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interview Q&A
// ─────────────────────────────────────────────────────────────────────────────

const qaItems = [
  {
    q: 'How do you test async components?',
    a: 'Use findByRole or waitFor',
    detail: `findBy* queries are a combination of getBy* + waitFor — they return a Promise and retry the query until it succeeds or times out (default: 1 000 ms). Use them whenever the element appears after an async operation (fetch, timer, animation). For more complex assertions, wrap them in waitFor(() => { ... }).`,
    example: `// ✅ findByRole waits for the element automatically
it('shows user profile after fetch', async () => {
  mockFetchSuccess({ name: 'Jane Doe' });
  render(<UserProfile userId="1" />);

  // No need for explicit waitFor — findBy* handles it
  const heading = await screen.findByRole('heading', { name: /jane doe/i });
  expect(heading).toBeInTheDocument();
});

// ✅ waitFor for multi-assertion async checks
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});`,
    tags: ['findByRole', 'findByText', 'waitFor', 'async/await'],
    color: 'cyan',
  },
  {
    q: 'What is the difference between getBy and findBy?',
    a: 'getBy throws synchronously. findBy returns a Promise and waits.',
    detail: `getBy* is synchronous — it queries the DOM at that exact instant and throws immediately if no match is found. findBy* wraps getBy* inside waitFor, returning a Promise that resolves once the element appears (or rejects after a timeout). There is also queryBy*, which is synchronous but returns null instead of throwing — ideal for asserting an element is NOT present.`,
    example: `// getBy* — synchronous, throws if missing
const btn = screen.getByRole('button'); // throws NOW if absent

// queryBy* — synchronous, returns null if missing
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

// findBy* — async, waits up to 1000ms
const msg = await screen.findByRole('alert'); // resolves when present`,
    tags: ['getBy*', 'findBy*', 'queryBy*'],
    color: 'sky',
  },
  {
    q: 'When should you use queryBy* instead of getBy*?',
    a: 'Use queryBy* to assert an element is NOT in the DOM.',
    detail: `queryBy* returns null instead of throwing when no element is found. This makes it the right choice when you need to assert absence. getBy* would throw before you even reach expect(), making the error misleading.`,
    example: `// ❌ getBy* makes absence assertions confusing
// This throws "Unable to find an element" before expect() even runs:
expect(screen.getByText(/error/i)).not.toBeInTheDocument();

// ✅ queryBy* returns null — absence assertion reads naturally
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();

// ✅ Also works for loading spinners that disappear:
await waitFor(() => {
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});`,
    tags: ['queryBy*', 'getBy*', 'absence assertion'],
    color: 'teal',
  },
  {
    q: 'What does userEvent give you that fireEvent does not?',
    a: 'userEvent simulates real browser events; fireEvent dispatches synthetic DOM events.',
    detail: `fireEvent dispatches a single synthetic DOM event directly. userEvent simulates the full sequence of events a real user would trigger — for example, clicking a button fires pointerdown, mousedown, pointerup, mouseup, click in order, and typing fires keydown, keypress, input, keyup per character. This catches bugs that fireEvent misses, such as components that rely on focus management or keyboard event sequences.`,
    example: `// fireEvent — dispatches ONE synthetic event
fireEvent.change(input, { target: { value: 'hello' } });

// userEvent — fires the realistic event sequence
const user = userEvent.setup();
await user.type(input, 'hello');
// ↑ dispatches: focus → keydown → keypress → input → keyup (×5)`,
    tags: ['userEvent', 'fireEvent', 'events'],
    color: 'indigo',
  },
];

const qaColors: Record<string, { border: string; glow: string; tag: string; q: string; a: string }> = {
  cyan:   { border: 'border-cyan-500/30',   glow: 'shadow-[0_0_20px_rgba(6,182,212,0.12)]',   tag: 'bg-cyan-500/15 text-cyan-300',   q: 'text-cyan-400',   a: 'text-cyan-100' },
  sky:    { border: 'border-sky-500/30',    glow: 'shadow-[0_0_20px_rgba(14,165,233,0.12)]',   tag: 'bg-sky-500/15 text-sky-300',    q: 'text-sky-400',    a: 'text-sky-100' },
  teal:   { border: 'border-teal-500/30',   glow: 'shadow-[0_0_20px_rgba(20,184,166,0.12)]',   tag: 'bg-teal-500/15 text-teal-300',  q: 'text-teal-400',   a: 'text-teal-100' },
  indigo: { border: 'border-indigo-500/30', glow: 'shadow-[0_0_20px_rgba(99,102,241,0.12)]',   tag: 'bg-indigo-500/15 text-indigo-300', q: 'text-indigo-400', a: 'text-indigo-100' },
};

function InterviewQA() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {qaItems.map((item, idx) => {
        const c = qaColors[item.color];
        const isOpen = openIdx === idx;
        return (
          <motion.div
            key={item.q}
            layout
            className={`rounded-2xl border bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 ${c.border} ${isOpen ? c.glow : ''}`}
          >
            {/* Question row */}
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full text-left px-6 py-5 flex items-start gap-4"
            >
              {/* Q bubble */}
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${c.tag}`}>
                Q
              </span>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-base ${c.q}`}>{item.q}</p>
                {/* One-liner answer always visible */}
                <p className="mt-1 text-slate-300 font-mono text-sm">
                  → <span className={`font-bold ${c.a}`}>{item.a}</span>
                </p>
              </div>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-slate-500 flex-shrink-0 mt-1">
                ▾
              </motion.span>
            </button>

            {/* Expanded detail + code */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4 border-t border-slate-800 pt-5">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-medium ${c.tag}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Prose */}
                    <p className="text-slate-300 text-sm leading-relaxed">{item.detail}</p>
                    {/* Code */}
                    <pre className="bg-[#1e1e1e] rounded-xl p-4 text-sm font-mono text-slate-300 border border-slate-700 overflow-x-auto">
                      <code dangerouslySetInnerHTML={{ __html: Prism.highlight(item.example, Prism.languages.tsx, 'tsx') }} />
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Existing sub-components (unchanged in logic, kept in full)
// ─────────────────────────────────────────────────────────────────────────────

function AsyncTestVisualizer() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(s => (s + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { name: "Initial Mount", state: "idle", desc: "Component mounts. Validates dependency array correctness if re-rendered." },
    { name: "Fetching Data", state: "loading", desc: "Verifies loading indicator exists using screen.getByTestId()." },
    { name: "Data Resolved", state: "success", desc: "Happy path (Highest Signal). Validates entire flow with await screen.findBy()." },
    { name: "Data Rejected", state: "error", desc: "Mocked rejection. Verifies error surfaces and loading clears." }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* UI Mockup */}
      <div className="flex-1 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-inner flex flex-col justify-center items-center min-h-[250px]">
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-sm">
          <h4 className="text-slate-300 font-bold mb-4 border-b border-slate-800 pb-2">useUserData() Hook</h4>
          
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div key="0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-500 text-center py-4">
                Click to load profile
              </motion.div>
            )}
            {activeStep === 1 && (
              <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center items-center py-4 space-x-3 text-indigo-400">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-mono text-sm">Fetching...</span>
              </motion.div>
            )}
            {activeStep === 2 && (
              <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-2">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full"></div>
                  <div>
                    <div className="text-white font-bold">Jane Doe</div>
                    <div className="text-slate-400 text-xs font-mono">jane@example.com</div>
                  </div>
                </div>
              </motion.div>
            )}
            {activeStep === 3 && (
              <motion.div key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-900/20 text-red-400 p-3 rounded-lg border border-red-900/50 text-sm text-center">
                500: Server unreachable
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="flex-1 space-y-4">
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border transition-all duration-300 ${isActive ? 'bg-indigo-600/20 border-indigo-500/50 scale-105 shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-slate-800/50 border-slate-700 scale-100 opacity-60'}`}
            >
              <div className="flex items-center space-x-3 mb-1">
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`}></div>
                <h4 className={`font-bold ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>{step.name}</h4>
              </div>
              <p className={`text-sm pl-6 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BugCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-red-950/30 border-l-4 border-red-500 p-5 rounded-r-xl">
      <h4 className="font-bold text-red-400 text-lg">{title}</h4>
      <p className="text-sm text-red-200/80 mt-1.5 leading-relaxed font-mono bg-red-950/50 p-2 rounded">{desc}</p>
    </div>
  );
}

function ActVsWaitForVisualizer() {
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhase(p => (p + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const timelineSteps = [
    {
      title: "User Interaction",
      code: "await userEvent.click(button);",
      description: "User triggers an action that will cause a state change.",
      hasAct: true,
      actDesc: "userEvent implicitly wraps this event in act()."
    },
    {
      title: "Async Operation & State Update",
      code: "fetchData().then(data => setData(data));",
      description: "Component performs an async network request and updates state.",
      hasAct: false,
      actDesc: ""
    },
    {
      title: "Wait for Changes",
      code: "await waitFor(() => expect(screen.getByText('Loaded')).toBeInTheDocument());",
      description: "RTL repeatedly polls the DOM until the assertion passes or times out.",
      hasAct: true,
      actDesc: "waitFor safely wraps its polling iterations in async act()."
    },
    {
      title: "Test Passes",
      code: "// ✅ No act() warnings!",
      description: "The DOM matches the expected state, and all state updates were captured.",
      hasAct: false,
      actDesc: ""
    }
  ];

  return (
    <div className="relative mt-8 max-w-4xl">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700"></div>
      <div className="space-y-8 relative">
        {timelineSteps.map((step, idx) => {
          const isActive = activePhase === idx;
          const isPast = idx < activePhase;
          
          return (
            <div key={idx} className={`flex items-start transition-opacity duration-500 ${isActive || isPast ? 'opacity-100' : 'opacity-40'}`}>
              <div className="relative z-10 flex-shrink-0 w-16 flex justify-center mt-1">
                <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all duration-300
                  ${isActive ? 'bg-purple-500 border-purple-900 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-125' : 
                    isPast ? 'bg-purple-400 border-purple-800' : 'bg-slate-800 border-slate-600'}
                `}>
                  {isPast && (
                    <svg className="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div className={`ml-4 flex-1 bg-slate-800/40 backdrop-blur-sm border rounded-xl p-5 transition-all duration-300
                ${isActive ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] transform translate-x-2' : 'border-slate-700/50'}
              `}>
                <h4 className={`text-lg font-bold ${isActive ? 'text-purple-300' : 'text-slate-300'}`}>{step.title}</h4>
                <div className="mt-3 bg-[#1e1e1e] rounded-lg p-3 font-mono text-sm text-slate-300 border border-slate-800 overflow-x-auto">
                  {step.code}
                </div>
                <p className="mt-3 text-slate-400 text-sm">{step.description}</p>
                
                <AnimatePresence>
                  {step.hasAct && isActive && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 flex items-center space-x-3">
                        <div className="bg-purple-500/20 p-1.5 rounded-md flex-shrink-0">
                          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className="text-purple-300 text-sm font-medium">{step.actDesc}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CodeComparison() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8 mb-12">
      {/* Anti-pattern */}
      <div className="bg-white/[0.02] backdrop-blur-xl border border-red-500/20 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="bg-red-500/10 px-4 py-3 border-b border-red-500/20 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
            <span className="text-sm font-semibold text-red-400 tracking-wide">Anti-Pattern: Manual act()</span>
          </div>
          <span className="text-xs text-red-400/60 font-mono">LegacyTest.tsx</span>
        </div>
        <div className="p-5 overflow-x-auto relative z-10">
          <pre className="text-sm font-mono text-slate-300">
            <code dangerouslySetInnerHTML={{ __html: Prism.highlight(`// ❌ Forcing manual act() wrapper
it('submits form', async () => {
  render(<MyForm />);
  
  // WRONG: Wrapping fireEvent in act()
  act(() => {
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' }
    });
  });

  act(() => {
    fireEvent.click(screen.getByRole('button'));
  });

  // WRONG: Awaiting arbitrary timeout instead of DOM change
  await act(async () => {
    await new Promise(r => setTimeout(r, 1000));
  });

  expect(screen.getByText('Success')).toBeInTheDocument();
});`, Prism.languages.tsx, 'tsx') }} />
          </pre>
        </div>
      </div>

      {/* Best Practice */}
      <div className="bg-white/[0.02] backdrop-blur-xl border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="bg-emerald-500/10 px-4 py-3 border-b border-emerald-500/20 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-sm font-semibold text-emerald-400 tracking-wide">Best Practice: userEvent &amp; waitFor</span>
          </div>
          <span className="text-xs text-emerald-400/60 font-mono">ModernTest.tsx</span>
        </div>
        <div className="p-5 overflow-x-auto relative z-10">
          <pre className="text-sm font-mono text-slate-300">
            <code dangerouslySetInnerHTML={{ __html: Prism.highlight(`// ✅ Letting RTL handle act() implicitly
it('submits form', async () => {
  const user = userEvent.setup();
  render(<MyForm />);
  
  // userEvent automatically wraps interactions in act()
  await user.type(screen.getByRole('textbox'), 'test');
  await user.click(screen.getByRole('button'));

  // waitFor handles polling and act() safely
  await waitFor(() => {
    expect(screen.getByText('Success')).toBeInTheDocument();
  });
});`, Prism.languages.tsx, 'tsx') }} />
          </pre>
        </div>
      </div>
    </div>
  );
}

// Full mock-fetch example code — single complete block covering setup + happy + error
const mockFetchFullExample = `import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

// ─── 1. Setup: replace global fetch with a jest mock ───────────────────────
// Declare at module scope so every test in this file shares the same mock ref.
global.fetch = jest.fn();

// Typed helper — resolves with a "ok" JSON response
const mockFetchSuccess = (data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

// Typed helper — resolves with a failed HTTP response (default 500)
const mockFetchError = (status = 500) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ message: 'Internal Server Error' }),
  });
};

// ─── 2. Cleanup: clear call history & implementations after every test ─────
afterEach(() => {
  jest.clearAllMocks();
});

// ─── 3. Happy path ─────────────────────────────────────────────────────────
it('renders the user profile when fetch succeeds', async () => {
  // Arrange
  mockFetchSuccess({ name: 'Jane Doe', email: 'jane@example.com' });

  // Act
  render(<UserProfile userId="42" />);

  // Assert — findBy* waits for async data to appear in the DOM
  expect(await screen.findByRole('heading', { name: /jane doe/i }))
    .toBeInTheDocument();
  expect(screen.getByText('jane@example.com')).toBeInTheDocument();

  // Verify the component fetched the right endpoint
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith('/api/users/42');
});

// ─── 4. Error path ─────────────────────────────────────────────────────────
it('displays an error alert when fetch fails', async () => {
  // Arrange
  mockFetchError(503);

  // Act
  render(<UserProfile userId="42" />);

  // Assert — wait for the error UI to appear
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(/failed to load/i);

  // The loading spinner must be gone
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});`;

function CoreApiVisualizer() {
  return (
    <div className="space-y-6 mt-8">
      {/* Core API + Helpers side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Core API */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="bg-blue-500/10 px-4 py-3 border-b border-blue-500/20 flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              <span className="text-sm font-semibold text-blue-400 tracking-wide">Core RTL API</span>
            </div>
          </div>
          <div className="p-5 overflow-x-auto relative z-10 min-h-[350px]">
            <pre className="text-sm font-mono text-slate-300">
              <code dangerouslySetInnerHTML={{ __html: Prism.highlight(`import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 1. render: Mounts component in a virtual DOM
render(<UserProfile id="123" />);

// 2. screen: Query the virtual DOM globally
const heading = screen.getByRole('heading', { name: /profile/i });

// 3. userEvent: Simulate realistic user interactions
const user = userEvent.setup();
await user.click(screen.getByRole('button', { name: /save/i }));

// 4. waitFor: Wait for async UI updates
await waitFor(() => {
  expect(screen.getByText('Saved!')).toBeInTheDocument();
});

// 5. findByRole: getByRole + waitFor (auto-waits up to 1000ms)
const asyncMsg = await screen.findByRole('alert');`, Prism.languages.tsx, 'tsx') }} />
            </pre>
          </div>
        </div>

        {/* Mock helpers (compact) */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div className="bg-amber-500/10 px-4 py-3 border-b border-amber-500/20 flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
              <span className="text-sm font-semibold text-amber-400 tracking-wide">Mock Fetch — Helpers</span>
            </div>
          </div>
          <div className="p-5 overflow-x-auto relative z-10 min-h-[350px]">
            <pre className="text-sm font-mono text-slate-300">
              <code dangerouslySetInnerHTML={{ __html: Prism.highlight(`// Replace global fetch with a Jest mock function
global.fetch = jest.fn();

// Helper to mock successful JSON response
const mockFetchSuccess = (data: any) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
};

// Helper to mock failed response
const mockFetchError = (status = 500) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
  });
};

// Reset mocks between tests to prevent state leakage
afterEach(() => {
  jest.resetAllMocks();
});`, Prism.languages.typescript, 'typescript') }} />
            </pre>
          </div>
        </div>
      </div>

      {/* Full working example — setup + happy path + error path */}
      <div className="bg-white/[0.02] backdrop-blur-xl border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="bg-emerald-500/10 px-4 py-3 border-b border-emerald-500/20 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="text-sm font-semibold text-emerald-400 tracking-wide">
              Complete Working Example — Setup · Happy Path · Error Path
            </span>
          </div>
          <span className="text-xs text-emerald-400/60 font-mono">UserProfile.test.tsx</span>
        </div>
        <div className="p-5 overflow-x-auto relative z-10">
          <pre className="text-sm font-mono text-slate-300">
            <code dangerouslySetInnerHTML={{ __html: Prism.highlight(mockFetchFullExample, Prism.languages.tsx, 'tsx') }} />
          </pre>
        </div>
      </div>
    </div>
  );
}

function TestPathsVisualizer() {
  const [activeTab, setActiveTab] = useState<'happy' | 'loading' | 'error'>('happy');

  const tabs = [
    { id: 'happy', label: 'Happy Path', colorClass: 'emerald' },
    { id: 'loading', label: 'Loading State', colorClass: 'blue' },
    { id: 'error', label: 'Error Path', colorClass: 'red' }
  ] as const;

  const content = {
    happy: `it('loads and displays user profile', async () => {
  // 1. Arrange: Mock the successful API response
  mockFetchSuccess({ name: 'Jane Doe', email: 'jane@example.com' });

  // 2. Act: Render the component
  render(<UserProfile userId="123" />);

  // 3. Assert: Wait for the async data to appear in the DOM
  // Using findBy* automatically waits for the element (up to 1000ms)
  const nameHeading = await screen.findByRole('heading', { 
    name: /jane doe/i 
  });
  
  expect(nameHeading).toBeInTheDocument();
  expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  
  // Verify fetch was called with correct arguments
  expect(global.fetch).toHaveBeenCalledWith('/api/users/123');
});`,
    loading: `it('displays a loading spinner while fetching', () => {
  // 1. Arrange: Mock a pending promise so it stays loading
  // This simulates a request in-flight that hasn't resolved
  (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));

  // 2. Act: Render
  render(<UserProfile userId="123" />);

  // 3. Assert: Check for loading UI immediately
  // Use getBy* or queryBy* for synchronous checks
  const spinner = screen.getByRole('status', { name: /loading/i });
  expect(spinner).toBeInTheDocument();
  
  // Data should not be present yet
  expect(screen.queryByText(/jane doe/i)).not.toBeInTheDocument();
});`,
    error: `it('displays an error message when fetch fails', async () => {
  // 1. Arrange: Mock a failed API response
  mockFetchError(500);

  // 2. Act: Render
  render(<UserProfile userId="123" />);

  // 3. Assert: Wait for error message to appear
  const errorAlert = await screen.findByRole('alert');
  
  expect(errorAlert).toHaveTextContent(/failed to load user/i);
  
  // Ensure the loading spinner is gone
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});`
  };

  const getTabClass = (id: string, active: boolean) => {
    if (!active) return 'bg-slate-800/50 text-slate-500 hover:bg-slate-800 hover:text-slate-300 border border-transparent';
    if (id === 'happy') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    if (id === 'loading') return 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
    if (id === 'error') return 'bg-red-500/20 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    return '';
  };

  const getContainerClass = (id: string) => {
    if (id === 'happy') return 'border-emerald-500/20';
    if (id === 'loading') return 'border-blue-500/20';
    if (id === 'error') return 'border-red-500/20';
    return '';
  };

  const getHeaderClass = (id: string) => {
    if (id === 'happy') return 'bg-emerald-500/10 border-emerald-500/20';
    if (id === 'loading') return 'bg-blue-500/10 border-blue-500/20';
    if (id === 'error') return 'bg-red-500/10 border-red-500/20';
    return '';
  };

  const getDotClass = (id: string) => {
    if (id === 'happy') return 'bg-emerald-500/80';
    if (id === 'loading') return 'bg-blue-500/80';
    if (id === 'error') return 'bg-red-500/80';
    return '';
  };

  const getTextClass = (id: string) => {
    if (id === 'happy') return 'text-emerald-400';
    if (id === 'loading') return 'text-blue-400';
    if (id === 'error') return 'text-red-400';
    return '';
  };

  return (
    <div className="mt-8">
      <div className="flex space-x-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'happy' | 'loading' | 'error')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${getTabClass(tab.id, activeTab === tab.id)}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={`bg-white/[0.02] backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl relative transition-colors duration-500 ${getContainerClass(activeTab)}`}>
        <div className={`px-4 py-3 border-b flex items-center space-x-2 ${getHeaderClass(activeTab)}`}>
           <div className={`w-3 h-3 rounded-full ${getDotClass(activeTab)}`}></div>
           <span className={`text-sm font-semibold tracking-wide ${getTextClass(activeTab)}`}>UserProfile.test.tsx</span>
        </div>
        <div className="p-6 overflow-x-auto min-h-[350px]">
          <pre className="text-sm font-mono text-slate-300">
            <code dangerouslySetInnerHTML={{ __html: Prism.highlight(content[activeTab], Prism.languages.tsx, 'tsx') }} />
          </pre>
        </div>
      </div>
    </div>
  );
}
