export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Question = {
  q: string;
  a: string;
  code?: string;
  hint?: string;
  list?: string[];
  console?: string[];
  diagram?: { title: string; svg: string };
  difficulty?: 'easy' | 'medium' | 'hard';
};

export type Section = {
  title: string;
  color: string;
  intro?: string;
  questions: Question[];
  quiz?: QuizQuestion[];
  diagram?: { title: string; svg: string };
};

export const sectionQuizzes: Record<string, QuizQuestion[]> = {};
export const consoleExamples: never[] = [];
export const sectionDiagrams: Record<string, { title: string; svg: string }> = {};

export const sections: Section[] = [
  // ─── 1. THE OPTIMIZATION MINDSET ───
  {
    title: '1. The Optimization Mindset',
    color: 'blue',
    intro:
      'Before any layer-by-layer technique: the discipline that makes all of them worth something. Optimizing without measuring is the single most common way this question goes badly in an interview.',
    questions: [
      {
        q: 'What\'s the process, before touching any specific layer?',
        a: 'Measure, profile, fix the single biggest bottleneck, validate the fix against the same metric you started from, then repeat — never optimize by intuition, and never fix more than one thing before re-measuring, because fixing one bottleneck routinely just exposes the next one underneath it. This loop matters more than any individual technique below: an interviewer who sees a candidate reach for "add a cache" or "add an index" before "how would you know that\'s actually the problem" is seeing the weaker answer, regardless of how correct the specific fix turns out to be.',
        list: [
          '<strong>Amdahl\'s Law, informally:</strong> the maximum speedup from optimizing one part of a system is capped by how much time that part actually accounts for — shaving 90% off a step that\'s 5% of total latency moves the needle far less than a 20% improvement to the step that\'s 60% of it.',
          '<strong>RUM vs. synthetic:</strong> real-user monitoring (field data, actual devices and networks) is what production performance actually is; synthetic/lab tools (Lighthouse, local profiling) are reproducible and great for iterating on a fix, but a fast dev laptop on fiber hides exactly the problems a mid-range phone on 4G will surface. Use synthetic to develop a fix, RUM to confirm it mattered.',
        ],
      },
      {
        q: 'With five things all looking slow, how do you decide what to fix first?',
        a: 'Rank by impact × how many users it affects, divided by effort to fix — and impact should be measured against a user-facing metric (a Core Web Vital, an API p95, a checkout completion rate), not an internal one like CPU usage, which can be perfectly fine while users experience real pain. A cheap fix with a huge blast radius (a missing database index hit by every request) always outranks an expensive fix with a narrow one (hand-optimizing a rarely-visited settings page), regardless of which one feels more technically interesting to work on.',
      },
    ],
  },

  // ─── 2. CLIENT & BROWSER ───
  {
    title: '2. Client & Browser',
    color: 'indigo',
    questions: [
      {
        q: 'What are Core Web Vitals, and what actually moves each one?',
        a: 'Three metrics covering loading, responsiveness, and visual stability — and each has a distinct, mostly non-overlapping set of fixes, which is why treating "improve performance" as one undifferentiated task is a weaker answer than diagnosing which specific vital is the problem first.',
        list: [
          '<table class="w-full text-xs border-collapse my-3"><tr><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700">Metric</th><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700">Target</th><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700">Primary levers</th></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">LCP</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">≤ 2.5s</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Fast TTFB, priority-hint the hero image, eliminate render-blocking CSS/JS</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">INP</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">≤ 200ms</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Break up long main-thread tasks, debounce heavy handlers, reduce re-renders</td></tr><tr><td class="p-2 font-semibold">CLS</td><td class="p-2">≤ 0.1</td><td class="p-2">Reserve space (<code>aspect-ratio</code>, explicit dimensions) for images/ads/fonts before they load</td></tr></table>',
        ],
      },
      {
        q: 'How do you optimize a React app\'s rendering performance specifically?',
        a: 'Work top-down from the biggest lever, not straight to memoization: audit the bundle first (route-level code splitting and tree-shakeable imports usually dwarf any component-level fix), cut client-side JS with Server Components for anything that doesn\'t need interactivity, then profile with React DevTools to find components that actually re-render too often before reaching for <code>memo</code>/<code>useMemo</code>/<code>useCallback</code> — applied reflexively everywhere, these add comparison overhead without benefit and are a well-known AI-generated-code smell. Virtualize any list long enough to matter, and let React 18/19\'s concurrent rendering (time-slicing, <code>useTransition</code> for marking updates as non-urgent) keep the UI responsive during unavoidably heavy updates.',
        hint: 'The full checklist with code for each step lives in the interview-prep React track\'s "handed an existing codebase" performance-audit question — this page cross-links rather than repeating it.',
      },
      {
        q: 'How do you keep the main thread free for user input?',
        a: 'Two different problems, two different fixes. For animation, use compositor-only properties (<code>transform</code>, <code>opacity</code>) instead of layout-triggering ones (<code>width</code>, <code>top</code>) — the browser hands the animation to a separate compositor thread entirely, so it stays smooth even while the main thread is busy. For genuinely heavy computation (parsing a large dataset, image processing), move it off the main thread with a Web Worker, and use <code>requestIdleCallback</code> or the Scheduler API\'s <code>postTask</code> for lower-priority work that should yield to anything more urgent, like a keystroke.',
        code: `/* expensive — layout + paint on every frame, competes with the main thread */
.card:hover { width: 320px; }

/* cheap — compositor-only, main thread stays free */
.card:hover { transform: scale(1.05); }`,
      },
      {
        q: 'What about the assets themselves — images, fonts, bundles?',
        a: 'Serve images at the resolution they\'re displayed at (<code>next/image</code> or <code>srcset</code>/<code>sizes</code>, never a desktop-sized file to a phone), in a modern format (WebP/AVIF) with lazy loading below the fold. For fonts, <code>font-display: swap</code> or <code>optional</code> plus preloading the critical face avoids a layout shift when the real font swaps in. For bundles, tree-shakeable imports (<code>import { debounce } from \'lodash-es\'</code>, never the whole package) and a bundle analyzer to catch the surprisingly common case of a full charting or date library pulled in for one small piece of UI.',
      },
    ],
  },

  // ─── 3. NETWORK & EDGE ───
  {
    title: '3. Network & Edge',
    color: 'cyan',
    questions: [
      {
        q: 'What\'s the caching policy at the CDN, and does the transport protocol matter?',
        a: 'Versioned static assets get long <code>max-age</code> + <code>immutable</code> — they never need revalidation because a content change means a new URL. Public, cacheable HTML/API responses get a short TTL plus <code>stale-while-revalidate</code>, serving the stale copy instantly while a background request refreshes it, so no user ever waits on a cache miss. HTTP/2 (multiplexed requests over one connection, eliminating the old six-connections-per-origin bottleneck) is table stakes at this point; HTTP/3 (over QUIC) further removes head-of-line blocking at the transport layer and matters most on lossy mobile networks. Brotli compression beats gzip by roughly 15–20% at equivalent settings, essentially free to enable.',
      },
      {
        q: 'When does edge rendering actually help?',
        a: 'For SSR pages that are mostly the same across users — a product page, a marketing page — running the server-render at an edge location close to the user (Vercel Edge Functions, Cloudflare Workers) cuts the round-trip that would otherwise go to a single origin region, without the cost and complexity of full multi-region infrastructure. It\'s the wrong tool for genuinely personalized, database-heavy renders, where the edge function would just end up making the same slow round-trip to the origin database anyway.',
      },
    ],
  },

  // ─── 4. API & GATEWAY LAYER ───
  {
    title: '4. API & Gateway Layer',
    color: 'purple',
    questions: [
      {
        q: 'How do you protect and speed up the API layer itself?',
        a: 'Rate limiting (token bucket for allowing bursts, sliding window for accuracy — full algorithm comparison with code in the interview-prep Architecture track) protects capacity from any single client; enforced at the edge/gateway so a rejected request never reaches application servers. Keep-alive connection reuse avoids a fresh TCP+TLS handshake on every request between services. Payload size matters directly — paginate list endpoints rather than returning everything, and let clients request only the fields they need where that\'s supported.',
      },
      {
        q: 'How do you avoid N+1 request patterns?',
        a: 'The N+1 problem — fetching a list, then making one additional call per item to get related data — shows up at every layer: a REST client calling <code>/posts</code> then <code>/users/:id</code> per post, or a GraphQL resolver naively re-querying per field. DataLoader batches and deduplicates those calls into a single query per tick, collecting everything requested synchronously before flushing together — full code example in the interview-prep Databases track. The same principle applies to gRPC vs. REST: gRPC\'s binary protocol and native streaming reduce per-call overhead meaningfully at high request volume between internal services, at the cost of being less debuggable and less universally tooled than REST/JSON — a trade worth naming rather than assuming one is strictly better.',
      },
    ],
  },

  // ─── 5. APPLICATION SERVER ───
  {
    title: '5. Application Server',
    color: 'emerald',
    questions: [
      {
        q: 'What does Node.js-specific performance hygiene look like?',
        a: 'Node runs JavaScript on a single thread — any synchronous, CPU-heavy code blocks the event loop entirely, freezing every other request being served concurrently, not just the one that triggered it. The fix is offloading genuinely CPU-bound work (image processing, heavy computation, encryption) to <code>worker_threads</code> or a separate service, keeping the main thread free for the async I/O it\'s actually built for. For scaling beyond one core, cluster the process (Node\'s built-in <code>cluster</code> module, or letting the orchestrator run multiple container replicas) since a single Node process only uses one core by default.',
        code: `// blocks the event loop — every other request waits
app.get('/report', (req, res) => {
  const result = heavyComputation(data); // synchronous, CPU-bound
  res.json(result);
});

// offloaded — event loop stays free for other requests
const worker = new Worker('./report-worker.js', { workerData: data });
worker.on('message', (result) => res.json(result));`,
      },
      {
        q: 'How does horizontal scaling and memory management fit in?',
        a: 'Stateless app servers (session state in Redis, never in-process) are what make horizontal autoscaling straightforward — an orchestrator can add or remove instances behind a load balancer purely based on real load (CPU, request queue depth), with no instance holding state that would be lost when it\'s replaced. On the memory side, watch for unbounded caches or event-listener leaks that grow heap usage over the life of a long-running process — <code>process.memoryUsage()</code> is the quickest first check, and V8\'s garbage collector can be tuned (heap size flags) for memory-heavy workloads once profiling confirms GC pauses are the actual bottleneck, not a guess.',
      },
    ],
  },

  // ─── 6. CACHING LAYER ───
  {
    title: '6. Caching Layer',
    color: 'pink',
    questions: [
      {
        q: 'Redis, CDN, or in-process — which cache for which job?',
        a: 'Three layers, each with a different scope and lifetime: an in-process cache (a simple <code>Map</code> or LRU cache in application memory) is the fastest possible option but is per-instance and vanishes on restart or redeploy — fine for something small and cheap to recompute. Redis is shared across every app instance, survives individual instance restarts, and is the default choice for session data, computed aggregates, and anything read far more often than it changes. The CDN caches at the network edge, closest to the user, for content that\'s the same (or nearly the same) across many users. Reaching for Redis when a request-scoped in-process cache would do, or vice versa, is a common miss worth naming explicitly.',
      },
      {
        q: 'What actually breaks a caching layer in production?',
        a: 'Almost always invalidation, not the caching mechanism itself. A cache stampede — many concurrent requests missing on the same just-expired hot key and hammering the database simultaneously — is solved with a lock so only one request repopulates the cache while others wait briefly, or by serving the stale value while one background request refreshes it. The other common failure is a cache key that doesn\'t vary by everything the response actually varies by (missing a user ID or a locale in the key), which silently serves one user\'s cached response to another — a correctness bug disguised as a performance win.',
      },
    ],
  },

  // ─── 7. DATABASE ───
  {
    title: '7. Database',
    color: 'orange',
    questions: [
      {
        q: 'What\'s the actual process for diagnosing a slow query?',
        a: '<code>EXPLAIN ANALYZE</code> shows what the planner chose and what actually happened when it ran — the single most useful number on the page is the gap between estimated and actual row counts: a big gap means stale statistics, while an accurate estimate paired with a bad plan (a sequential scan where an index scan should apply) points to a missing or unused index. The interview-prep Databases track has a full worked before/after example — a composite index turning a 30-second sequential scan into a sub-millisecond index scan.',
        list: [
          '<strong>Indexing beyond the default B-tree:</strong> partial indexes for a frequently-filtered subset of rows, covering indexes (<code>INCLUDE</code>) for index-only scans, GIN for JSONB/full-text/array columns.',
          '<strong>Connection pooling (PgBouncer)</strong> — a burst of connections queuing for a pool slot looks identical to "the query got slow" from the app\'s side, even though the query itself is untouched; always rule this out before touching the query.',
        ],
      },
      {
        q: 'Beyond a single query, how do you scale database throughput?',
        a: 'Read replicas absorb read traffic away from the primary, which is almost always the majority of load for a consumer app; denormalization (storing a computed or duplicated value instead of joining for it on every read) trades write complexity and storage for read speed, worth it once a specific join is proven hot; partitioning splits a large table by a key (often time-based, like partitioning an events table by month) so queries and maintenance only touch the relevant slice; sharding goes further, spreading partitions across separate database instances entirely — the biggest operational commitment on this list, and the one to reach for last, after the others have actually been tried.',
      },
    ],
  },

  // ─── 8. ASYNC & MESSAGING ───
  {
    title: '8. Async & Messaging',
    color: 'slate',
    questions: [
      {
        q: 'How do you tune a queue-based system for throughput?',
        a: 'Batch processing (consuming and processing N messages at once instead of one at a time) amortizes fixed per-operation overhead across many items — a single batched database insert instead of N individual ones is often the single biggest throughput win available. Autoscale workers off queue depth rather than a fixed instance count, so consumer capacity tracks actual backlog instead of guessing at provisioning ahead of time. Backpressure — letting queue depth signal a slow consumer to the producer, rather than the producer blindly continuing to publish — is what keeps a temporarily-slow consumer from becoming a full outage; the interview-prep Architecture track covers this alongside the SQS/SNS and DLQ patterns it pairs with.',
      },
    ],
  },

  // ─── 9. OBSERVABILITY-DRIVEN OPTIMIZATION ───
  {
    title: '9. Observability-Driven Optimization',
    color: 'amber',
    questions: [
      {
        q: 'How do you find the real bottleneck in a system with many services?',
        a: 'Golden signals (latency, traffic, errors, saturation) per service tell you <em>which</em> service is unhealthy; a distributed trace tells you <em>why</em> a specific slow request was slow, by showing the full tree of spans it touched across every service — often revealing that the bottleneck isn\'t where you\'d have guessed (a service that looks fine in isolation but is waiting on a slow downstream call). This is the loop from section 1 made concrete: metrics tell you something is wrong and roughly where, a trace tells you exactly which span in exactly which request, and that\'s what you profile and fix — never guess-and-check on a live production system.',
      },
    ],
  },

  // ─── 10. REFERENCE NUMBERS & SUMMARY ───
  {
    title: '10. Reference Numbers & Summary',
    color: 'violet',
    questions: [
      {
        q: 'What latency numbers should you just know, cold?',
        a: 'These come up constantly as a sanity check on any estimate or design discussion — the exact figures vary by hardware generation, but the <em>relative</em> gaps between them are what actually matter and are worth internalizing.',
        list: [
          '<table class="w-full text-xs border-collapse my-3"><tr><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700">Operation</th><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700">Roughly</th></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">L1 cache reference</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">~1 ns</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Main memory (RAM) reference</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">~100 ns</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Redis / in-memory cache round-trip</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">~0.5–1 ms</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">SSD random read</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">~100 µs–1 ms</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Database query (indexed, warm)</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">~1–10 ms</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Same-region network round trip</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">~0.5–2 ms</td></tr><tr><td class="p-2">Cross-continent network round trip</td><td class="p-2">~100–150 ms</td></tr></table>',
          'The takeaway that actually matters in a design discussion: memory beats disk by roughly 100,000×, and a same-region network hop beats a cross-continent one by roughly 100× — which is the entire justification for both caching and putting infrastructure close to users.',
        ],
      },
      {
        q: 'One summary table for the whole stack — what\'s the lever at each layer?',
        a: 'A closing table like this is a strong way to end the answer, showing the whole stack was covered systematically rather than as a scattered list of individually-interesting facts.',
        list: [
          '<table class="w-full text-xs border-collapse my-3"><tr><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700">Layer</th><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700">Primary lever</th></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">Client</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Core Web Vitals, code splitting, compositor-only animation, Server Components</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">Network / Edge</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">CDN cache policy, HTTP/2+, compression, edge rendering</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">API / Gateway</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Rate limiting, batching/DataLoader, connection reuse</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">App server</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Non-blocking event loop, horizontal autoscaling</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">Cache</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Redis for shared state, stampede protection, correct cache keys</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">Database</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Indexing, read replicas, connection pooling, partitioning</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">Async</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Batching, autoscale-by-queue-depth, backpressure</td></tr><tr><td class="p-2 font-semibold">Observability</td><td class="p-2">Golden signals to find it, traces to explain it</td></tr></table>',
        ],
      },
    ],
  },
];
