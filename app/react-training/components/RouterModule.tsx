'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RouterModule() {
  const [isDirty, setIsDirty] = useState(false);
  const [blockerState, setBlockerState] = useState<'idle' | 'blocked'>('idle');
  const [mockRoute, setMockRoute] = useState('/wizard/step-1');
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  // Fetcher demo states
  const [formActionRoute, setFormActionRoute] = useState('/post/123');
  const [formState, setFormState] = useState<'idle' | 'submitting'>('idle');
  const [fetcherState, setFetcherState] = useState<'idle' | 'submitting'>('idle');
  const [likedForm, setLikedForm] = useState(false);
  const [likedFetcher, setLikedFetcher] = useState(false);

  // Mocking the router navigation
  const attemptNavigation = (target: string) => {
    if (isDirty) {
      setBlockerState('blocked');
      setPendingRoute(target);
    } else {
      setMockRoute(target);
    }
  };

  const handleProceed = () => {
    if (pendingRoute) {
      setMockRoute(pendingRoute);
    }
    setBlockerState('idle');
    setPendingRoute(null);
    setIsDirty(false); // form submitted
  };

  const handleReset = () => {
    setBlockerState('idle');
    setPendingRoute(null);
  };

  const handleFormSubmit = () => {
    setFormState('submitting');
    setFormActionRoute('/post/123?action=like');
    setTimeout(() => {
      setFormState('idle');
      setLikedForm((prev) => !prev);
      setFormActionRoute('/post/123'); // Redirect back
    }, 1500);
  };

  const handleFetcherSubmit = () => {
    setFetcherState('submitting');
    setTimeout(() => {
      setFetcherState('idle');
      setLikedFetcher((prev) => !prev);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans text-slate-100 overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] rounded-full bg-teal-900/20 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10 space-y-12"
      >
        <div className="text-center space-y-6 mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            React Router v6 Architecture
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-teal-200">
            Navigation Guards
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Visualize how <code className="text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded">useBlocker</code> intercepts routing events and maintains a strict state machine to prevent data loss.
          </p>
        </div>

        {/* ── Interview Q&A Callout: Why use useBlocker? ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-amber-500/25 bg-amber-500/5 backdrop-blur-sm p-6 flex gap-4 items-start shadow-lg"
        >
          <span className="text-2xl mt-0.5 shrink-0">🎙️</span>
          <div>
            <p className="text-amber-300 font-bold text-sm mb-1 tracking-wide uppercase">Interview Question</p>
            <p className="text-white font-semibold text-base mb-2">Why use <code className="text-amber-300 bg-amber-900/30 px-1.5 py-0.5 rounded">useBlocker</code>?</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              <span className="text-amber-400 font-bold">→</span> To <strong className="text-white">prevent users from navigating away from a page when they have unsaved changes</strong>, giving them a chance to save first. Without it, the browser silently discards all in-progress form data the moment the user clicks a link or uses the back button.
            </p>
            <div className="mt-3 pt-3 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                <div className="text-amber-400 font-bold mb-1">State: idle</div>
                <div className="text-slate-400">Navigation proceeds normally — no block active.</div>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                <div className="text-amber-400 font-bold mb-1">State: blocked</div>
                <div className="text-slate-400">Router intercepts the transition. Show your dialog now.</div>
              </div>
              <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                <div className="text-amber-400 font-bold mb-1">proceed() / reset()</div>
                <div className="text-slate-400">User confirms → <code>proceed()</code>. Cancels → <code>reset()</code>.</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Flowchart & State Machine */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl drop-shadow-md">⚙️</span> Blocker State Machine
              </h3>
              
              <div className="relative h-64 flex flex-col items-center justify-center">
                {/* IDLE State */}
                <motion.div 
                  animate={{ 
                    scale: blockerState === 'idle' ? 1.1 : 0.9,
                    opacity: blockerState === 'idle' ? 1 : 0.5,
                    borderColor: blockerState === 'idle' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(51, 65, 85, 0.8)'
                  }}
                  className="bg-slate-800 border-2 rounded-2xl p-4 w-48 text-center z-10 shadow-lg"
                >
                  <div className="text-blue-400 font-bold mb-1">IDLE</div>
                  <div className="text-xs text-slate-400">Waiting for navigation</div>
                </motion.div>

                {/* Arrow down */}
                <div className="h-12 w-0.5 bg-slate-700 relative">
                  <AnimatePresence>
                    {blockerState === 'blocked' && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        exit={{ opacity: 0 }}
                        className="absolute top-0 left-0 w-full bg-amber-500"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* BLOCKED State */}
                <motion.div 
                  animate={{ 
                    scale: blockerState === 'blocked' ? 1.1 : 0.9,
                    opacity: blockerState === 'blocked' ? 1 : 0.5,
                    borderColor: blockerState === 'blocked' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(51, 65, 85, 0.8)'
                  }}
                  className="bg-slate-800 border-2 rounded-2xl p-4 w-48 text-center z-10 shadow-lg"
                >
                  <div className="text-amber-400 font-bold mb-1">BLOCKED</div>
                  <div className="text-xs text-slate-400">Intercepted navigation to {pendingRoute || '...'}</div>
                </motion.div>

                {/* Proceed/Reset Arrows */}
                <div className="absolute top-1/2 -right-8 flex flex-col justify-between h-32 transform -translate-y-1/2">
                  <div className="text-xs font-mono text-emerald-400 flex items-center">
                    <span className="mr-2">proceed()</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                  <div className="text-xs font-mono text-slate-400 flex items-center">
                    <span className="mr-2">reset()</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl backdrop-blur-sm">
              <h4 className="text-sm font-bold text-blue-300 mb-2">Architectural Deep Dive</h4>
              <ul className="text-sm text-slate-400 space-y-3 list-disc pl-5">
                <li><strong>Guard Placement:</strong> Place the <code className="text-blue-300">useBlocker</code> at the parent layout level, not inside individual steps. This preserves state during internal step transitions.</li>
                <li><strong>State Lifecycle:</strong> The router blocks the transition, moving to the <code className="text-amber-400">blocked</code> state, giving you complete control over whether to <code className="text-emerald-400">proceed()</code> or <code className="text-slate-400">reset()</code>.</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <a href="https://reactrouter.com/6.30.3/hooks/use-blocker" target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-500 hover:text-blue-400 hover:underline">View Official Docs: React Router useBlocker &rarr;</a>
              </div>
            </div>

            {/* useBlocker Code Snippet (original) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-slate-400">useBlocker.tsx</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                  <code>
<span className="text-purple-400">const</span> blocker = <span className="text-blue-400">useBlocker</span>(<br/>
&nbsp;&nbsp;({`{`} currentLocation, nextLocation {`}`}) <span className="text-purple-400">=&gt;</span> {`{`}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Block if form is dirty and navigating away</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> isDirty &amp;&amp; currentLocation.pathname !== nextLocation.pathname;<br/>
&nbsp;&nbsp;{`}`}<br/>
);<br/>
<br/>
<span className="text-slate-500">{`// Wait for user confirmation`}</span><br/>
<span className="text-purple-400">if</span> (blocker.state === <span className="text-emerald-300">'blocked'</span>) {`{`}<br/>
&nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">Modal</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">Button</span> <span className="text-teal-300">onClick</span>=<span className="text-blue-300">{`{`}</span>() =&gt; blocker.<span className="text-blue-400">proceed</span>()<span className="text-blue-300">{`}`}</span>&gt;Discard&lt;/<span className="text-blue-400">Button</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">Button</span> <span className="text-teal-300">onClick</span>=<span className="text-blue-300">{`{`}</span>() =&gt; blocker.<span className="text-blue-400">reset</span>()<span className="text-blue-300">{`}`}</span>&gt;Cancel&lt;/<span className="text-blue-400">Button</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-blue-400">Modal</span>&gt;<br/>
&nbsp;&nbsp;);<br/>
{`}`}
                  </code>
                </pre>
              </div>
            </motion.div>

            {/* ── NEW: Complete useBlocker Dialog Code Example ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm overflow-hidden shadow-2xl"
            >
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-blue-400">UnsavedChangesGuard.tsx — Complete Example</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                  <code>
<span className="text-purple-400">import</span> {`{`} useBlocker {`}`} <span className="text-purple-400">from</span> <span className="text-emerald-300">'react-router-dom'</span>;<br/>
<span className="text-purple-400">import</span> {`{`} useState {`}`} <span className="text-purple-400">from</span> <span className="text-emerald-300">'react'</span>;<br/>
<br/>
<span className="text-purple-400">export function</span> <span className="text-blue-400">EditProfilePage</span>() {`{`}<br/>
&nbsp;&nbsp;<span className="text-purple-400">const</span> [isDirty, setIsDirty] = <span className="text-blue-400">useState</span>(<span className="text-purple-400">false</span>);<br/>
<br/>
&nbsp;&nbsp;<span className="text-slate-500">// The hook fires BEFORE React Router commits the transition.</span><br/>
&nbsp;&nbsp;<span className="text-slate-500">// Return true = intercept it; false = let it pass.</span><br/>
&nbsp;&nbsp;<span className="text-purple-400">const</span> blocker = <span className="text-blue-400">useBlocker</span>(<br/>
&nbsp;&nbsp;&nbsp;&nbsp;({`{`} currentLocation, nextLocation {`}`}) =&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isDirty &amp;&amp; currentLocation.pathname !== nextLocation.pathname<br/>
&nbsp;&nbsp;);<br/>
<br/>
&nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">{`{/* Your form */}`}</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">input</span> <span className="text-teal-300">onChange</span>={"{() => "} <span className="text-blue-400">setIsDirty</span>(<span className="text-purple-400">true</span>){")} />"}<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">{`{/* Confirmation dialog – shown when state === 'blocked' */}`}</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{`}blocker.state === <span className="text-emerald-300">'blocked'</span> &amp;&amp; (<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">dialog</span> <span className="text-teal-300">open</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">h2</span>&gt;Unsaved Changes&lt;/<span className="text-blue-400">h2</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">p</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Are you sure you want to leave?<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You have <span className="text-amber-300">unsaved changes</span>.<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-blue-400">p</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">button</span> <span className="text-teal-300">onClick</span>={"{() => "} blocker.<span className="text-blue-400">proceed</span>(){">"}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Leave anyway<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-blue-400">button</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">button</span> <span className="text-teal-300">onClick</span>={"{() => "} blocker.<span className="text-blue-400">reset</span>(){">"}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stay &amp; save<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-blue-400">button</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-blue-400">dialog</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;){`}`}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/&gt;<br/>
&nbsp;&nbsp;);<br/>
{`}`}
                  </code>
                </pre>
              </div>
              <div className="px-4 pb-4">
                <div className="mt-2 bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 text-xs text-slate-400 leading-relaxed">
                  <span className="text-blue-300 font-bold">Key insight:</span> The blocker callback runs synchronously on every navigation attempt. Returning <code className="text-amber-300">true</code> halts the transition and sets <code className="text-emerald-300">blocker.state = 'blocked'</code>. Calling <code className="text-emerald-300">blocker.proceed()</code> resumes it; <code className="text-emerald-300">blocker.reset()</code> cancels it entirely, leaving the user on the current page.
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive UI */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                <span className="text-2xl drop-shadow-md">📱</span> What the user actually sees
              </h3>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-inner overflow-hidden relative z-10">
                {/* Browser URL Bar Mockup */}
                <div className="bg-slate-900 px-4 py-3 flex items-center gap-3 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex-1 bg-slate-950 rounded-md px-3 py-1.5 text-xs font-mono text-slate-400 border border-slate-800 flex items-center">
                    <svg className="w-3 h-3 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.092 2.027-.273 3.016m-2.14 4.093c.21.32.44.62.689.897M9 17l.054.09M9 17h.01M9 17h.01M9 17h.01M9 17h.01M9 17h.01M9 17h.01"></path></svg>
                    app.com{mockRoute}
                  </div>
                </div>

                <div className="p-6 relative">
                  
                  {/* The Wizard Content */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                      <span className={mockRoute === '/wizard/step-1' ? 'text-blue-400' : ''}>Step 1</span>
                      <span className="w-8 h-px bg-slate-700"></span>
                      <span className={mockRoute === '/wizard/step-2' ? 'text-blue-400' : ''}>Step 2</span>
                    </div>

                    {mockRoute === '/wizard/step-1' && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-5 h-5 rounded border ${isDirty ? 'bg-blue-500 border-blue-500' : 'border-slate-600 bg-slate-900'} flex items-center justify-center`} onClick={() => setIsDirty(!isDirty)}>
                            {isDirty && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                          </div>
                          <span className="text-slate-300">Form is dirty (Unsaved changes)</span>
                        </label>
                        <p className="text-xs text-slate-500 italic">Toggle the checkbox to dirty the form, then try to navigate away.</p>
                      </motion.div>
                    )}

                    {mockRoute === '/wizard/step-2' && (
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div className="text-slate-300">You successfully reached Step 2!</div>
                      </motion.div>
                    )}

                    <div className="pt-6 border-t border-slate-800 flex justify-between">
                      <button onClick={() => attemptNavigation('/dashboard')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; Exit Wizard
                      </button>
                      {mockRoute === '/wizard/step-1' && (
                        <button onClick={() => attemptNavigation('/wizard/step-2')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                          Next Step
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Blocker Modal Overlay */}
                  <AnimatePresence>
                    {blockerState === 'blocked' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 z-20"
                      >
                        <motion.div 
                          initial={{ scale: 0.9, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 10 }}
                          className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full"
                        >
                          <h4 className="text-lg font-bold text-white mb-2">Unsaved Changes</h4>
                          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Are you sure you want to leave? You have <span className="text-amber-300 font-semibold">unsaved changes</span> that will be lost.
                          </p>
                          <div className="flex gap-3 justify-end">
                            <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                              Cancel
                            </button>
                            <button onClick={handleProceed} className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow-lg shadow-red-900/20">
                              Discard Changes
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            </div>
          </div>

        </div>

        {/* === SECTION: USEFETCHER === */}
        <div className="pt-20 mt-20 border-t border-slate-800/50">
          <div className="text-center space-y-6 mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Data Mutations
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-200 to-emerald-200">
              The Power of useFetcher
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Compare traditional Form submissions that trigger navigation against <code className="text-teal-300 bg-teal-900/30 px-2 py-0.5 rounded">useFetcher</code>, which mutates data silently while staying on the exact same page.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Traditional Form Action */}
            <div className="flex flex-col gap-8">
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                <span className="text-2xl drop-shadow-md">⛵</span> Form Action (Navigates)
              </h3>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-inner overflow-hidden relative z-10 h-72 flex flex-col">
                {/* Browser URL Bar Mockup */}
                <div className="bg-slate-900 px-4 py-3 flex items-center gap-3 border-b border-slate-800 transition-colors duration-300 relative">
                  <div className="flex gap-1.5 relative z-10">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex-1 bg-slate-950 rounded-md px-3 py-1.5 text-xs font-mono text-slate-400 border border-slate-800 flex items-center overflow-hidden relative z-10">
                    {formState === 'submitting' && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, ease: 'linear' }}
                        className="absolute top-0 left-0 h-0.5 bg-blue-500"
                      />
                    )}
                    <span className="truncate">app.com{formActionRoute}</span>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                  <AnimatePresence mode="wait">
                    {formState === 'submitting' ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                        <div className="text-blue-400 text-sm font-medium">Navigating &amp; Submitting...</div>
                        <div className="text-slate-500 text-xs mt-2">Full page lifecycle triggered</div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-xl text-center"
                      >
                        <div className="text-slate-300 mb-6 font-medium">Greatest post ever written</div>
                        <button 
                          onClick={handleFormSubmit}
                          className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold transition-all ${likedForm ? 'bg-pink-500/10 text-pink-500 border border-pink-500/30 hover:bg-pink-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'}`}
                        >
                          <svg className={`w-5 h-5 ${likedForm ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                          {likedForm ? 'Liked!' : 'Like Post'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Form Action Code Snippet */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl h-fit"
            >
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-slate-400">FormAction.tsx</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                  <code>
<span className="text-slate-500">{`// Triggers full page navigation lifecycle`}</span><br/>
<span className="text-purple-400">import</span> {`{`} Form {`}`} <span className="text-purple-400">from</span> <span className="text-emerald-300">'react-router-dom'</span>;<br/>
<br/>
&lt;<span className="text-blue-400">Form</span> <span className="text-teal-300">method</span>=<span className="text-emerald-300">"post"</span> <span className="text-teal-300">action</span>=<span className="text-emerald-300">"/post/123?action=like"</span>&gt;<br/>
&nbsp;&nbsp;&lt;<span className="text-blue-400">button</span> <span className="text-teal-300">type</span>=<span className="text-emerald-300">"submit"</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Like Post<br/>
&nbsp;&nbsp;&lt;/<span className="text-blue-400">button</span>&gt;<br/>
&lt;/<span className="text-blue-400">Form</span>&gt;
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Right: useFetcher */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                <span className="text-2xl drop-shadow-md">🚀</span> useFetcher (Stays on Page)
              </h3>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-inner overflow-hidden relative z-10 h-72 flex flex-col">
                {/* Browser URL Bar Mockup */}
                <div className="bg-slate-900 px-4 py-3 flex items-center gap-3 border-b border-slate-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex-1 bg-slate-950 rounded-md px-3 py-1.5 text-xs font-mono text-slate-400 border border-slate-800 flex items-center">
                    app.com/post/123
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                  <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-xl text-center relative overflow-hidden">
                    <div className="text-slate-300 mb-6 font-medium">Greatest post ever written</div>
                    
                    <button 
                      onClick={handleFetcherSubmit}
                      disabled={fetcherState === 'submitting'}
                      className={`relative flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold transition-all overflow-hidden ${likedFetcher ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'} ${fetcherState === 'submitting' ? 'opacity-80 cursor-not-allowed' : ''}`}
                    >
                      {fetcherState === 'submitting' && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.5, ease: 'linear' }}
                          className="absolute inset-0 bg-emerald-500/20"
                        />
                      )}
                      {fetcherState === 'submitting' ? (
                        <>
                          <svg className="w-5 h-5 animate-spin relative z-10" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          <span className="relative z-10">Background Mutation...</span>
                        </>
                      ) : (
                        <>
                          <svg className={`w-5 h-5 relative z-10 ${likedFetcher ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                          <span className="relative z-10">{likedFetcher ? 'Liked!' : 'Like Post'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="absolute bottom-4 text-xs font-mono text-emerald-400/80 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    fetcher.state === '{fetcherState}'
                  </div>
                </div>
              </div>
            </div>

            {/* useFetcher Code Snippet */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl h-fit"
            >
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-slate-400">useFetcher.tsx</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                  <code>
<span className="text-purple-400">const</span> fetcher = <span className="text-blue-400">useFetcher</span>();<br/>
<span className="text-purple-400">const</span> isSubmitting = fetcher.state !== <span className="text-emerald-300">'idle'</span>;<br/>
<br/>
<span className="text-slate-500">{`// Mutate data without navigating`}</span><br/>
&lt;<span className="text-blue-400">fetcher.Form</span> <span className="text-teal-300">method</span>=<span className="text-emerald-300">"post"</span> <span className="text-teal-300">action</span>=<span className="text-emerald-300">"/api/like"</span>&gt;<br/>
&nbsp;&nbsp;&lt;<span className="text-blue-400">button</span> <span className="text-teal-300">disabled</span>=<span className="text-blue-300">{`{`}</span>isSubmitting<span className="text-blue-300">{`}`}</span>&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;{`{`}isSubmitting ? <span className="text-emerald-300">'Saving...'</span> : <span className="text-emerald-300">'Like'</span>{`}`}<br/>
&nbsp;&nbsp;&lt;/<span className="text-blue-400">button</span>&gt;<br/>
&lt;/<span className="text-blue-400">fetcher.Form</span>&gt;
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
          </div>
        </div>

        {/* === SECTION: CORE HOOKS === */}
        <div className="pt-20 mt-20 border-t border-slate-800/50">
          <div className="text-center space-y-6 mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Core Hooks
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200">
              Essential Routing Hooks
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Explore the fundamental hooks that power React Router: <code className="text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded">useNavigate</code>, <code className="text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded">useParams</code>, and <code className="text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded">useLocation</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* useNavigate */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="text-3xl mb-4">🧭</div>
                <h3 className="text-xl font-bold text-white mb-3">useNavigate</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Allows programmatic navigation. Use it to redirect users after an action, like submitting a form or clicking a custom button.
                </p>
              </div>
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-t border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-slate-400">NavigateExample.tsx</span>
              </div>
              <div className="p-4 bg-slate-950 overflow-x-auto">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">
                  <code>
<span className="text-purple-400">const</span> navigate = <span className="text-blue-400">useNavigate</span>();<br/>
<br/>
<span className="text-slate-500">{`// Navigate programmatically`}</span><br/>
<span className="text-purple-400">const</span> handleClick = () <span className="text-purple-400">=&gt;</span> {`{`}<br/>
&nbsp;&nbsp;<span className="text-blue-400">navigate</span>(<span className="text-emerald-300">'/dashboard'</span>, {`{`} <span className="text-teal-300">replace</span>: <span className="text-purple-400">true</span> {`}`});<br/>
{`}`};
                  </code>
                </pre>
              </div>
            </motion.div>

            {/* useParams */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="text-3xl mb-4">🧩</div>
                <h3 className="text-xl font-bold text-white mb-3">useParams</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Returns an object of dynamic parameters from the current URL that were matched by the route path.
                </p>
              </div>
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-t border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-slate-400">ParamsExample.tsx</span>
              </div>
              <div className="p-4 bg-slate-950 overflow-x-auto">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">
                  <code>
<span className="text-slate-500">{`// Route path: /users/:userId`}</span><br/>
<span className="text-purple-400">const</span> {`{`} userId {`}`} = <span className="text-blue-400">useParams</span>();<br/>
<br/>
<span className="text-purple-400">return</span> (<br/>
&nbsp;&nbsp;&lt;<span className="text-blue-400">div</span>&gt;User ID: {`{`}userId{`}`}&lt;/<span className="text-blue-400">div</span>&gt;<br/>
);
                  </code>
                </pre>
              </div>
            </motion.div>

            {/* useLocation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-xl font-bold text-white mb-3">useLocation</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Returns the current Location object. Useful for tracking page views, triggering animations on route change, or reading query strings.
                </p>
              </div>
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-t border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-slate-400">LocationExample.tsx</span>
              </div>
              <div className="p-4 bg-slate-950 overflow-x-auto">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">
                  <code>
<span className="text-purple-400">const</span> location = <span className="text-blue-400">useLocation</span>();<br/>
<br/>
<span className="text-blue-400">useEffect</span>(() <span className="text-purple-400">=&gt;</span> {`{`}<br/>
&nbsp;&nbsp;<span className="text-slate-500">{`// Send pageview analytics`}</span><br/>
&nbsp;&nbsp;<span className="text-blue-400">trackPageView</span>(location.pathname);<br/>
{`}`}, [location]);
                  </code>
                </pre>
              </div>
            </motion.div>

          </div>
        </div>

        {/* === NEW SECTION: PREVENTING PAGE EXIT ON BROWSER CLOSE === */}
        <div className="pt-20 mt-20 border-t border-slate-800/50">
          <div className="text-center space-y-6 mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Browser-Level Guard
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-rose-200 to-orange-200">
              Preventing Page Exit on Browser Close
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              <code className="text-rose-300 bg-rose-900/30 px-2 py-0.5 rounded">useBlocker</code> only intercepts <em>React Router</em> navigation. To also guard against the user closing the tab or hitting the OS back button, you need the native <code className="text-orange-300 bg-orange-900/30 px-2 py-0.5 rounded">beforeunload</code> event.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Explanation card */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-2xl shadow-2xl"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="text-2xl">🛡️</span> Why two separate guards?
                </h3>
                <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                  <div className="flex gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                      <span className="text-blue-400 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <strong className="text-white">useBlocker</strong> — intercepts client-side React Router navigation (Link clicks, useNavigate calls, browser back/forward within the SPA). This runs entirely in JavaScript.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                      <span className="text-rose-400 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <strong className="text-white">beforeunload</strong> — intercepted by the <em>browser</em>. Fires when the user closes the tab, refreshes, or navigates to an entirely different origin. The browser shows its own native confirmation dialog.
                    </div>
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                    <p className="text-rose-300 text-xs font-bold uppercase tracking-wide mb-2">⚠️ Caveat</p>
                    <p className="text-slate-400 text-xs">Modern browsers <strong className="text-white">ignore</strong> any custom message you set on the <code>returnValue</code>. They always show their own generic dialog (e.g. "Changes you made may not be saved."). You cannot customize the wording.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm"
              >
                <h4 className="text-sm font-bold text-rose-300 mb-3 flex items-center gap-2">
                  <span>💡</span> Production pattern — combine both guards
                </h4>
                <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
                  <li>Attach <code className="text-orange-300">beforeunload</code> in a <code className="text-purple-300">useEffect</code> that cleans up on unmount.</li>
                  <li>Only attach the listener when the form is actually dirty — avoid unnecessary prompts for clean forms.</li>
                  <li>Pair with <code className="text-blue-300">useBlocker</code> to handle intra-app navigation.</li>
                  <li>Remove the listener (call <code className="text-emerald-300">removeEventListener</code>) when the form is saved successfully.</li>
                </ul>
              </motion.div>
            </div>

            {/* Code snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-slate-900/80 border border-rose-500/20 rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl"
            >
              <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-mono text-rose-400">useBeforeUnload.tsx — Hook Pattern</span>
              </div>
              <div className="p-4 overflow-x-auto">
                <pre className="text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
                  <code>
<span className="text-purple-400">import</span> {`{`} useEffect {`}`} <span className="text-purple-400">from</span> <span className="text-emerald-300">'react'</span>;<br/>
<span className="text-purple-400">import</span> {`{`} useBlocker {`}`} <span className="text-purple-400">from</span> <span className="text-emerald-300">'react-router-dom'</span>;<br/>
<br/>
<span className="text-slate-500">{`/**`}</span><br/>
<span className="text-slate-500">{` * Custom hook that guards BOTH:`}</span><br/>
<span className="text-slate-500">{` *  1. SPA navigation (useBlocker)`}</span><br/>
<span className="text-slate-500">{` *  2. Tab close / refresh (beforeunload)`}</span><br/>
<span className="text-slate-500">{` */`}</span><br/>
<span className="text-purple-400">export function</span> <span className="text-blue-400">useUnsavedChangesGuard</span>(isDirty: <span className="text-teal-300">boolean</span>) {`{`}<br/>
<br/>
&nbsp;&nbsp;<span className="text-slate-500">{`// ① Block React Router navigations`}</span><br/>
&nbsp;&nbsp;<span className="text-purple-400">const</span> blocker = <span className="text-blue-400">useBlocker</span>(<br/>
&nbsp;&nbsp;&nbsp;&nbsp;({`{`} currentLocation, nextLocation {`}`}) =&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isDirty &amp;&amp;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currentLocation.pathname !== nextLocation.pathname<br/>
&nbsp;&nbsp;);<br/>
<br/>
&nbsp;&nbsp;<span className="text-slate-500">{`// ② Block tab close / browser refresh`}</span><br/>
&nbsp;&nbsp;<span className="text-blue-400">useEffect</span>(() =&gt; {`{`}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> (!isDirty) <span className="text-purple-400">return</span>;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">const</span> handler = (e: <span className="text-teal-300">BeforeUnloadEvent</span>) =&gt; {`{`}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">{`// Required for Chrome — returnValue must be set`}</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.<span className="text-blue-400">preventDefault</span>();<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e.returnValue = <span className="text-emerald-300">''</span>; <span className="text-slate-500">// triggers native dialog</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;{`}`};<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;window.<span className="text-blue-400">addEventListener</span>(<span className="text-emerald-300">'beforeunload'</span>, handler);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">{`// Cleanup: remove when component unmounts or isDirty → false`}</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> () =&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;window.<span className="text-blue-400">removeEventListener</span>(<span className="text-emerald-300">'beforeunload'</span>, handler);<br/>
&nbsp;&nbsp;{`}`}, [isDirty]);<br/>
<br/>
&nbsp;&nbsp;<span className="text-purple-400">return</span> blocker; <span className="text-slate-500">// expose for dialog rendering</span><br/>
{`}`}<br/>
<br/>
<span className="text-slate-500">{`// Usage in your component:`}</span><br/>
<span className="text-purple-400">function</span> <span className="text-blue-400">EditPage</span>() {`{`}<br/>
&nbsp;&nbsp;<span className="text-purple-400">const</span> [isDirty, setIsDirty] = <span className="text-blue-400">useState</span>(<span className="text-purple-400">false</span>);<br/>
&nbsp;&nbsp;<span className="text-purple-400">const</span> blocker = <span className="text-blue-400">useUnsavedChangesGuard</span>(isDirty);<br/>
<br/>
&nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">YourForm</span> <span className="text-teal-300">onChange</span>={"{() => "} <span className="text-blue-400">setIsDirty</span>(<span className="text-purple-400">true</span>){")} />"}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`{`}blocker.state === <span className="text-emerald-300">'blocked'</span> &amp;&amp; (<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-400">ConfirmLeaveDialog</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-teal-300">onConfirm</span>={"{() => "} blocker.<span className="text-blue-400">proceed</span>(){")"}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-teal-300">onCancel</span>={"{() => "} blocker.<span className="text-blue-400">reset</span>(){")"}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&gt;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;){`}`}<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;/&gt;<br/>
&nbsp;&nbsp;);<br/>
{`}`}
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>

        {/* === NEW SECTION: HIGH-PRIORITY INTERVIEW Q&A === */}
        <div className="pt-20 mt-20 border-t border-slate-800/50">
          <div className="text-center space-y-6 mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              Senior-Level Interview Prep
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-fuchsia-200">
              High-Priority Interview Q&amp;A
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The exact questions that come up in React Router interviews — with precise, senior-level answers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">

            {/* Q1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-violet-500/20 backdrop-blur-xl shadow-xl hover:border-violet-500/40 transition-colors duration-300"
            >
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 font-extrabold text-sm">Q1</div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-base mb-3">
                    Why use <code className="text-violet-300 bg-violet-900/30 px-1.5 py-0.5 rounded text-sm">useBlocker</code>?
                  </p>
                  <div className="flex gap-2 items-start">
                    <span className="text-violet-400 font-bold mt-0.5">→</span>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      To <strong className="text-white">prevent accidental navigation with unsaved changes</strong>. When a user has modified a form and tries to navigate away — via a Link, the browser back button, or <code className="text-violet-300">useNavigate</code> — <code className="text-violet-300">useBlocker</code> intercepts the transition, holds it in a <code className="text-amber-300">blocked</code> state, and lets you render a confirmation dialog. The user then explicitly calls <code className="text-emerald-300">blocker.proceed()</code> to continue or <code className="text-emerald-300">blocker.reset()</code> to stay. This prevents silent data loss without requiring a global state manager or custom history hacking.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Q2 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 }}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-violet-500/20 backdrop-blur-xl shadow-xl hover:border-violet-500/40 transition-colors duration-300"
            >
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 font-extrabold text-sm">Q2</div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-base mb-3">
                    How does <code className="text-violet-300 bg-violet-900/30 px-1.5 py-0.5 rounded text-sm">useNavigate</code> differ from a <code className="text-violet-300 bg-violet-900/30 px-1.5 py-0.5 rounded text-sm">&lt;Link&gt;</code>?
                  </p>
                  <div className="flex gap-2 items-start">
                    <span className="text-violet-400 font-bold mt-0.5">→</span>
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm leading-relaxed mb-3">
                        <strong className="text-white">useNavigate is programmatic; Link is declarative.</strong>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                          <div className="text-blue-300 font-bold mb-2 flex items-center gap-1.5">
                            <span>🔗</span> &lt;Link&gt; — Declarative
                          </div>
                          <ul className="text-slate-400 space-y-1 list-disc pl-4">
                            <li>Renders an <code>&lt;a&gt;</code> tag in the DOM</li>
                            <li>Navigation happens on user click</li>
                            <li>Automatically accessible (keyboard, screen readers)</li>
                            <li>Preferred for all standard navigation links</li>
                          </ul>
                        </div>
                        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                          <div className="text-purple-300 font-bold mb-2 flex items-center gap-1.5">
                            <span>⚡</span> useNavigate — Programmatic
                          </div>
                          <ul className="text-slate-400 space-y-1 list-disc pl-4">
                            <li>Called imperatively in event handlers</li>
                            <li>Navigation happens after logic (e.g. form submit success)</li>
                            <li>Supports <code>replace</code>, <code>state</code>, <code>relative</code> options</li>
                            <li>Use when navigation depends on async results</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Q3 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-violet-500/20 backdrop-blur-xl shadow-xl hover:border-violet-500/40 transition-colors duration-300"
            >
              <div className="flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 font-extrabold text-sm">Q3</div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-base mb-3">
                    What does <code className="text-violet-300 bg-violet-900/30 px-1.5 py-0.5 rounded text-sm">useLocation</code> return?
                  </p>
                  <div className="flex gap-2 items-start">
                    <span className="text-violet-400 font-bold mt-0.5">→</span>
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        It returns the current <strong className="text-white">Location object</strong> — a snapshot of the browser's current URL and navigation state:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                        {[
                          { key: 'pathname', color: 'text-teal-300', desc: 'The path portion of the URL', example: '"/users/42"' },
                          { key: 'search', color: 'text-blue-300', desc: 'The raw query string', example: '"?tab=profile"' },
                          { key: 'hash', color: 'text-purple-300', desc: 'The URL fragment', example: '"#bio"' },
                          { key: 'state', color: 'text-amber-300', desc: 'Navigation state payload', example: '{ from: "/login" }' },
                          { key: 'key', color: 'text-rose-300', desc: 'Unique key per navigation entry', example: '"abc123"' },
                        ].map(({ key, color, desc, example }) => (
                          <div key={key} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                            <code className={`${color} font-bold`}>.{key}</code>
                            <p className="text-slate-400 mt-1">{desc}</p>
                            <p className="text-slate-500 mt-1 italic">{example}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 overflow-x-auto">
                        <pre className="text-xs font-mono text-slate-300 leading-relaxed">
                          <code>
<span className="text-purple-400">const</span> location = <span className="text-blue-400">useLocation</span>();<br/>
<span className="text-slate-500">// {`{`}</span><br/>
<span className="text-slate-500">//   pathname: "/users/42",</span><br/>
<span className="text-slate-500">//   search:   "?tab=profile",</span><br/>
<span className="text-slate-500">//   hash:     "#bio",</span><br/>
<span className="text-slate-500">//   state:    {`{`} from: "/login" {`}`},</span><br/>
<span className="text-slate-500">//   key:      "abc123"</span><br/>
<span className="text-slate-500">// {`}`}</span>
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </motion.div>
    </div>
  );
}
