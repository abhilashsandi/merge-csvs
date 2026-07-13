'use client';

import React, { useState, useActionState, Suspense, use } from 'react';
import { useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// 1. useActionState & useFormStatus Demo
// ─────────────────────────────────────────────────────────────────────────────

type ActionState = { error: string | null; success: string | null };

async function signUpAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = formData.get('username') as string;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!username || username.trim() === '') {
    return { error: 'Username is required', success: null };
  }
  if (username.toLowerCase() === 'admin') {
    return { error: 'Username "admin" is reserved', success: null };
  }
  
  return { error: null, success: `User ${username} registered successfully!` };
}

function SubmitButton() {
  // useFormStatus must be used inside a component rendered within a <form>
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-3 rounded-xl font-bold transition-all ${
        pending
          ? 'bg-emerald-500/30 text-emerald-300 cursor-not-allowed border border-emerald-500/20'
          : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
      }`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-emerald-300" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Registering...
        </span>
      ) : (
        'Register'
      )}
    </button>
  );
}

function ActionStateDemo() {
  const [state, formAction, isPending] = useActionState(signUpAction, { error: null, success: null });

  return (
    <div className="grid md:grid-cols-2 gap-8 relative z-10">
      <div className="space-y-4">
        <p className="text-white/70 leading-relaxed">
          React 19 introduces <code className="text-emerald-300 bg-white/5 px-1.5 py-0.5 rounded">useActionState</code> (formerly useFormState) and <code className="text-emerald-300 bg-white/5 px-1.5 py-0.5 rounded">useFormStatus</code> to seamlessly handle async form submissions without manual loading states or preventDefault.
        </p>
        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Try 'admin' for an error..."
                disabled={isPending}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
              />
            </div>
            <SubmitButton />
            
            <AnimatePresence mode="wait">
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                >
                  ❌ {state.error}
                </motion.div>
              )}
              {state.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
                >
                  ✅ {state.success}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
      
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner flex flex-col">
        <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-slate-500 font-mono">ActionState.tsx</span>
        </div>
        <pre className="p-5 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed flex-1">
          <code>
<span className="text-purple-400">const</span> [state, formAction, isPending] = <span className="text-blue-400">useActionState</span>(signUpAction, initialState);{'\n\n'}
<span className="text-slate-500">{'// In a child component:'}</span>{'\n'}
<span className="text-purple-400">function</span> <span className="text-blue-400">SubmitButton</span>() {'{'}{'\n'}
{'  '}<span className="text-purple-400">const</span> {'{ pending }'} = <span className="text-blue-400">useFormStatus</span>();{'\n'}
{'  '}<span className="text-purple-400">return</span> &lt;<span className="text-blue-400">button</span> <span className="text-teal-300">disabled</span>={'{pending}'}&gt;Submit&lt;/<span className="text-blue-400">button</span>&gt;;{'\n'}
{'}'}
          </code>
        </pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. use Hook Demo
// ─────────────────────────────────────────────────────────────────────────────

const mockFetchMessage = () => new Promise<string>(resolve => 
  setTimeout(() => resolve("Hello from the Server! (Resolved via `use` hook)"), 2000)
);

function MessageComponent({ messagePromise }: { messagePromise: Promise<string> }) {
  // `use` unwraps the promise directly in render. If it's pending, it suspends.
  const message = use(messagePromise);
  
  return (
    <div className="p-6 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-center font-semibold text-lg shadow-[0_0_15px_rgba(139,92,246,0.15)]">
      {message}
    </div>
  );
}

function UseHookDemo() {
  const [promise, setPromise] = useState<Promise<string> | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-8 relative z-10">
      <div className="space-y-4">
        <p className="text-white/70 leading-relaxed">
          The <code className="text-violet-300 bg-white/5 px-1.5 py-0.5 rounded">use</code> hook allows you to read the value of a Promise (or Context) directly in the render function. 
          Unlike <code className="text-white/40">await</code>, it works in Client Components and integrates natively with <code className="text-violet-300 bg-white/5 px-1.5 py-0.5 rounded">&lt;Suspense&gt;</code>.
        </p>
        
        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl">
          <button
            onClick={() => setPromise(mockFetchMessage())}
            className="w-full py-3 mb-6 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white transition-colors"
          >
            Fetch Message
          </button>
          
          <div className="min-h-[80px]">
            {promise ? (
              <Suspense fallback={
                <div className="flex justify-center items-center h-full text-violet-400/50 animate-pulse">
                  Suspending render until promise resolves...
                </div>
              }>
                <MessageComponent messagePromise={promise} />
              </Suspense>
            ) : (
              <div className="flex justify-center items-center h-full text-slate-500">
                Waiting to fetch...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner flex flex-col">
        <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-slate-500 font-mono">UseHook.tsx</span>
        </div>
        <pre className="p-5 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed flex-1">
          <code>
<span className="text-purple-400">function</span> <span className="text-blue-400">Message</span>({'{ promise }'}) {'{'}{'\n'}
{'  '}<span className="text-slate-500">{'// Halts render & triggers Suspense if pending'}</span>{'\n'}
{'  '}<span className="text-purple-400">const</span> data = <span className="text-blue-400">use</span>(promise);{'\n'}
{'  '}<span className="text-purple-400">return</span> &lt;<span className="text-blue-400">div</span>&gt;{'{data}'}&lt;/<span className="text-blue-400">div</span>&gt;;{'\n'}
{'}'}{'\n\n'}
<span className="text-slate-500">{'// In parent:'}</span>{'\n'}
&lt;<span className="text-blue-400">Suspense</span> <span className="text-teal-300">fallback</span>={'{<Loading />}'}&gt;{'\n'}
{'  '}&lt;<span className="text-blue-400">Message</span> <span className="text-teal-300">promise</span>={'{fetchData()}'} /&gt;{'\n'}
&lt;/<span className="text-blue-400">Suspense</span>&gt;
          </code>
        </pre>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component Export
// ─────────────────────────────────────────────────────────────────────────────

export function React19Module() {
  return (
    <div className="w-full max-w-6xl mx-auto font-sans text-gray-100 bg-transparent min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-violet-500 mb-4 tracking-tight">
          React 19 Features
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore the next generation of React capabilities: Actions, Form Status, and the powerful new <code className="text-violet-300 bg-white/5 px-1 rounded">use</code> hook.
        </p>
      </div>

      <div className="space-y-12">
        
        {/* Section 1 */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none rounded-t-3xl" />
          <h3 className="text-2xl font-bold text-white mb-8 relative z-10 tracking-tight">Actions & Form Status</h3>
          <ActionStateDemo />
        </div>

        {/* Section 2 */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none rounded-t-3xl" />
          <h3 className="text-2xl font-bold text-white mb-8 relative z-10 tracking-tight">The <code className="text-violet-400 font-mono">use</code> Hook</h3>
          <UseHookDemo />
        </div>

        {/* High-Priority Interview Q&A */}
        <div className="p-8 rounded-3xl bg-emerald-900/10 border border-emerald-500/20 backdrop-blur-xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white">
            <span className="text-2xl">🗣️</span> High-Priority Interview Q&A
          </h2>
          <div className="space-y-4">
            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-emerald-500/30 transition-colors cursor-pointer text-white">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                What is the advantage of useActionState over traditional async handlers?
                <span className="text-emerald-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p><strong>Answer:</strong> <code>useActionState</code> manages the pending state, error state, and optimistic updates automatically for Server Actions or async functions. You no longer need to manually set <code>isLoading</code> flags or call <code>event.preventDefault()</code> for forms, making code more resilient and cleaner.</p>
              </div>
            </details>
            
            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-emerald-500/30 transition-colors cursor-pointer text-white">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                How does the "use" hook differ from "await"?
                <span className="text-emerald-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p><strong>Answer:</strong> While both unwrap promises, <code>use</code> is specifically designed for React components. When a promise is passed to <code>use</code>, it tells React to <strong>Suspend</strong> the render tree until the promise resolves, integrating seamlessly with <code>&lt;Suspense&gt;</code> boundaries. <code>await</code> requires the component to be an <code>async</code> function (which is only allowed for Server Components, not Client Components).</p>
              </div>
            </details>

            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-emerald-500/30 transition-colors cursor-pointer text-white">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                Can you call "use" conditionally?
                <span className="text-emerald-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p><strong>Answer:</strong> Yes! Unlike other React Hooks (like <code>useState</code> or <code>useEffect</code>), <code>use</code> can be called inside loops and conditional statements (e.g., <code>if</code> blocks), providing immense flexibility in how we consume promises or Context.</p>
              </div>
            </details>

            <details className="group rounded-2xl bg-black/40 border border-white/5 p-4 hover:border-emerald-500/30 transition-colors cursor-pointer text-white">
              <summary className="font-semibold text-white/90 list-none flex justify-between items-center">
                What is the purpose of useOptimistic?
                <span className="text-emerald-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 text-white/70 text-sm leading-relaxed border-t border-white/10 pt-4">
                <p><strong>Answer:</strong> <code>useOptimistic</code> lets you optimistically update the UI before an asynchronous action (like a server mutation) finishes. It takes the current state and returns an optimistic state that you can update immediately. If the action fails or completes, it automatically rolls back or reconciles with the true state provided by the server or parent component, making your app feel instantly responsive.</p>
              </div>
            </details>
          </div>
        </div>

      </div>
    </div>
  );
}
