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

export const sections: Section[] = [
  // ─── 1. NODE.JS OVERVIEW & ARCHITECTURE ───
  {
    title: "1. Node.js Overview & Architecture",
    color: "green",
    intro: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It uses a non-blocking, event-driven architecture designed for scalable network applications.",
    questions: [
      {
        q: "When would you absolutely NOT use Node.js?",
        a: "For heavy, long-running CPU-bound tasks (video encoding, ML inference, 3D rendering). Node is single-threaded — a heavy CPU task blocks the Event Loop, freezing the entire server for all concurrent requests.",
        hint: "Mention Worker Threads as a mitigation, but note Go/Rust/C++ are natively better for CPU-bound work. This shows you understand Node's design, not just its API.",
        code: `// CPU-bound task BLOCKS the event loop — all other requests hang
app.get('/heavy', (req, res) => {
  // ❌ This blocks for seconds — no other request can be served
  const result = fibonacci(45);
  res.json({ result });
});

// ✅ Offload to Worker Thread
import { Worker } from 'worker_threads';

app.get('/heavy', (req, res) => {
  const worker = new Worker('./fibonacci-worker.js', {
    workerData: { n: 45 }
  });
  worker.on('message', (result) => res.json({ result }));
  worker.on('error', (err) => res.status(500).json({ error: err.message }));
});`,
      },
      {
        q: "How does libuv relate to Node.js?",
        a: "V8 parses and executes JavaScript. libuv is the C library providing the Event Loop and asynchronous I/O (file system, networking). It manages the thread pool for operations the OS can't do async.",
        hint: "libuv's thread pool defaults to 4 threads (UV_THREADPOOL_SIZE). This handles fs operations, DNS lookups, and crypto. You can increase it up to 1024.",
        list: [
          "**V8 Engine:** Parses JS → bytecode → machine code. Handles memory (heap/stack), garbage collection.",
          "**libuv:** Cross-platform async I/O. Provides event loop, thread pool, timers, signals, child processes.",
          "**Thread Pool (default 4):** Used for: fs operations, DNS lookups (dns.lookup), crypto (pbkdf2, randomBytes), zlib compression.",
          "**OS-level async (no thread pool):** TCP/UDP sockets, pipes, TTY. These use epoll (Linux), kqueue (macOS), IOCP (Windows).",
        ],
      },
      {
        q: "Compare Node.js vs Deno vs Bun.",
        a: "All are JavaScript runtimes, but with very different design philosophies.",
        list: [
          "**Node.js:** Mature ecosystem (npm), massive community, battle-tested in production. CommonJS + ESM. Requires external tooling for TypeScript.",
          "**Deno:** Built-in TypeScript, secure by default (explicit permissions), web-standard APIs (fetch, URL), built-in formatter/linter. Smaller ecosystem.",
          "**Bun:** Fastest runtime (Zig-based). Built-in bundler, transpiler, test runner, package manager. Drop-in Node.js replacement for many cases. Youngest, still maturing.",
        ],
        hint: "In interviews, say: 'I use Node.js for production due to its maturity and ecosystem. I'm watching Bun closely for its performance story and would consider Deno for greenfield projects that need built-in security.'",
      },
      {
        q: "Explain the V8 garbage collection strategy.",
        a: "V8 uses a generational garbage collector. Young objects are collected frequently with Scavenge; old objects are collected less often with Mark-Sweep-Compact.",
        list: [
          "**Young Generation (Scavenge):** Small space (~1-8MB). New objects live here. Uses semi-space copying — divides into 'from' and 'to' spaces. Fast but space-inefficient.",
          "**Old Generation (Mark-Sweep-Compact):** Objects that survive 2 Scavenge cycles are promoted. Uses three phases: Mark (find reachable objects), Sweep (free unreachable), Compact (defragment memory).",
          "**Incremental Marking:** Instead of stop-the-world, V8 breaks marking into small 1ms steps interleaved with JavaScript execution.",
          "**Heap Size:** Default ~1.5GB (64-bit). Override with --max-old-space-size=4096 for memory-intensive apps.",
        ],
      },
    ],
  },

  // ─── 2. EVENT LOOP ───
  {
    title: "2. The Event Loop",
    color: "amber",
    intro: "The Event Loop offloads operations to the system kernel whenever possible, allowing Node to be non-blocking despite being single-threaded.",
    questions: [
      {
        q: "List the Event Loop phases in order.",
        a: "The Event Loop has 6 phases. Between each phase, the Microtask Queue is drained.",
        list: [
          "**1. Timers:** Executes setTimeout/setInterval callbacks whose threshold has elapsed.",
          "**2. Pending Callbacks:** Executes deferred I/O callbacks (e.g., TCP errors).",
          "**3. Idle/Prepare:** Internal use only.",
          "**4. Poll:** Retrieves new I/O events, executes I/O callbacks. Blocks here if nothing else is scheduled.",
          "**5. Check:** Executes setImmediate() callbacks.",
          "**6. Close Callbacks:** e.g., socket.on('close').",
          "**Between EVERY phase:** Drain the Microtask Queue (process.nextTick first, then Promise callbacks).",
        ],
        hint: "The key insight many miss: process.nextTick() has HIGHER priority than Promises in the microtask queue. It runs before any Promise.then() callback.",
      },
      {
        q: "What is the output of this code? (Classic interview puzzle)",
        a: "This tests understanding of the event loop phases and microtask queue ordering.",
        code: `console.log('1. script start');

setTimeout(() => console.log('2. setTimeout'), 0);

Promise.resolve()
  .then(() => console.log('3. promise 1'))
  .then(() => console.log('4. promise 2'));

process.nextTick(() => console.log('5. nextTick'));

setImmediate(() => console.log('6. setImmediate'));

console.log('7. script end');

// OUTPUT:
// 1. script start
// 7. script end
// 5. nextTick         ← microtask (highest priority)
// 3. promise 1        ← microtask (after nextTick)
// 4. promise 2        ← microtask (chained)
// 2. setTimeout       ← timers phase
// 6. setImmediate     ← check phase (order with setTimeout is non-deterministic at top level)`,
        hint: "Execution order: synchronous code → process.nextTick → Promises → timers/setImmediate. In an I/O callback, setImmediate always fires before setTimeout(fn, 0).",
      },
      {
        q: "What is 'Event Loop starvation' and how do you prevent it?",
        a: "Starvation occurs when a recursive process.nextTick() or tight synchronous loop monopolizes the event loop, preventing I/O callbacks from executing.",
        code: `// ❌ STARVATION: this prevents ALL I/O from processing
function recursive() {
  process.nextTick(recursive); // fills microtask queue forever
}
recursive(); // server stops responding

// ✅ FIX: use setImmediate to yield to the event loop
function safeRecursive() {
  setImmediate(safeRecursive); // allows I/O between iterations
}

// ✅ FIX: break CPU work into chunks
async function processLargeArray(items: any[]) {
  const CHUNK_SIZE = 1000;
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    processChunk(chunk);
    // Yield to event loop after each chunk
    await new Promise(resolve => setImmediate(resolve));
  }
}`,
      },
    ],
  },

  // ─── 3. ASYNC PATTERNS ───
  {
    title: "3. Async Patterns & Error Handling",
    color: "violet",
    questions: [
      {
        q: "Compare Callbacks vs Promises vs Async/Await. When is each appropriate?",
        a: "All handle asynchronous operations, but with different ergonomics and error handling models.",
        code: `// 1. CALLBACKS (Node.js traditional — error-first pattern)
fs.readFile('data.json', (err, data) => {
  if (err) return handleError(err); // always check err first
  console.log(data);
});

// 2. PROMISES (chainable, better error flow)
readFilePromise('data.json')
  .then(data => JSON.parse(data))
  .then(parsed => console.log(parsed))
  .catch(err => handleError(err))  // catches ANY error in the chain
  .finally(() => cleanup());

// 3. ASYNC/AWAIT (synchronous-looking, modern standard)
async function loadData() {
  try {
    const data = await readFilePromise('data.json');
    const parsed = JSON.parse(data);
    return parsed;
  } catch (err) {
    handleError(err);    // catches both readFile AND JSON.parse errors
  } finally {
    cleanup();
  }
}`,
        hint: "Always use async/await for new code. Know that under the hood, async/await is syntactic sugar over Promises. Callbacks are still used in legacy Node APIs and event emitters.",
      },
      {
        q: "Explain Promise.all vs Promise.allSettled vs Promise.race vs Promise.any.",
        a: "Each has a different failure semantic. Choosing wrong can cause silent data loss or unnecessary failures.",
        code: `const p1 = fetchUser(1);    // resolves
const p2 = fetchUser(2);    // rejects
const p3 = fetchUser(3);    // resolves

// Promise.all — FAILS FAST on first rejection
await Promise.all([p1, p2, p3]); // ❌ throws because p2 rejected
// Use when: ALL must succeed (e.g., loading page requires user + settings + permissions)

// Promise.allSettled — NEVER rejects, returns status of each
const results = await Promise.allSettled([p1, p2, p3]);
// [{ status: 'fulfilled', value: user1 },
//  { status: 'rejected', reason: Error },
//  { status: 'fulfilled', value: user3 }]
// Use when: you want partial results (e.g., dashboard widgets can load independently)

// Promise.race — resolves/rejects with FIRST settled promise
await Promise.race([fetchWithTimeout(5000), actualFetch()]);
// Use when: implementing timeouts, taking fastest response from mirrors

// Promise.any — resolves with FIRST fulfilled (ignores rejections)
await Promise.any([cdn1Fetch(), cdn2Fetch(), cdn3Fetch()]);
// Use when: fastest successful response from multiple sources`,
        hint: "Promise.allSettled is underused. It's perfect for fire-and-forget parallel operations where partial failure is acceptable.",
      },
      {
        q: "How do you handle unhandled promise rejections?",
        a: "Unhandled rejections crash Node.js in recent versions (v15+). Always catch promises and set up global handlers.",
        code: `// Global safety net — log and gracefully shut down
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { reason, promise });
  // In production: alert ops team, then graceful shutdown
  gracefulShutdown(1);
});

process.on('uncaughtException', (error) => {
  logger.fatal('Uncaught Exception:', error);
  // MUST exit — state is corrupted after uncaughtException
  gracefulShutdown(1);
});

// ✅ Always catch async errors in Express
// Option 1: try/catch wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users', asyncHandler(async (req, res) => {
  const users = await db.findAll();
  res.json(users);
}));

// Option 2: express-async-errors (patches Express automatically)
import 'express-async-errors'; // just import at top
app.get('/users', async (req, res) => {
  const users = await db.findAll(); // errors auto-passed to next()
  res.json(users);
});`,
        hint: "Key distinction: uncaughtException = process is in undefined state, MUST exit. unhandledRejection = recoverable, but still dangerous. Always have both handlers.",
      },
    ],
  },

  // ─── 4. STREAMS & BUFFERS ───
  {
    title: "4. Streams & Buffers",
    color: "sky",
    intro: "Streams process data piece-by-piece instead of loading entire payloads into RAM. A Buffer is a fixed-size chunk of memory allocated outside V8's heap.",
    questions: [
      {
        q: "Show how to stream a large file efficiently with pipeline.",
        a: "Using pipeline() instead of .pipe() handles cleanup automatically if the client disconnects or an error occurs.",
        code: `import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';

// Stream + compress a large file
app.get('/download', async (req, res) => {
  try {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', 'application/octet-stream');

    await pipeline(
      createReadStream('./massive-dataset.csv'),
      createGzip(),    // compress on-the-fly
      res              // stream to response
    );
    // pipeline automatically cleans up all streams on error or completion
  } catch (err) {
    if (!res.headersSent) res.status(500).send('Streaming failed');
  }
});`,
        hint: "Always use pipeline() over .pipe(). The #1 bug with .pipe() is that errors don't propagate and streams don't get cleaned up on failure.",
      },
      {
        q: "What is 'Backpressure' and why does it matter?",
        a: "Backpressure occurs when a readable stream produces data faster than the writable stream can consume it. Without handling, unwritten chunks fill memory and crash the process.",
        code: `// ❌ Without backpressure handling — memory grows unbounded
readable.on('data', (chunk) => {
  writable.write(chunk); // what if writable's buffer is full?
});

// ✅ Manual backpressure handling
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  if (!canContinue) {
    readable.pause(); // stop reading until writable drains
  }
});
writable.on('drain', () => {
  readable.resume(); // writable buffer cleared, continue reading
});

// ✅ Best: pipeline() handles backpressure automatically
await pipeline(readable, transform, writable);`,
      },
      {
        q: "How do you create a custom Transform stream?",
        a: "Transform streams process data as it flows through — perfect for parsing, encryption, compression, or data transformation pipelines.",
        code: `import { Transform } from 'stream';

// Custom transform: CSV line parser
class CSVParser extends Transform {
  private buffer = '';

  _transform(chunk: Buffer, encoding: string, callback: Function) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\\n');

    // Keep last (possibly incomplete) line in buffer
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        const fields = line.split(',');
        this.push(JSON.stringify(fields) + '\\n'); // output JSON
      }
    }
    callback(); // signal ready for next chunk
  }

  _flush(callback: Function) {
    // Process remaining data when stream ends
    if (this.buffer.trim()) {
      this.push(JSON.stringify(this.buffer.split(',')) + '\\n');
    }
    callback();
  }
}

// Usage
await pipeline(
  createReadStream('data.csv'),
  new CSVParser(),
  createWriteStream('data.jsonl')
);`,
        hint: "Transform streams are the building blocks of Node.js stream pipelines. They enable zero-memory processing of files larger than available RAM.",
      },
    ],
  },

  // ─── 5. MEMORY & PERFORMANCE ───
  {
    title: "5. Memory Management & Profiling",
    color: "blue",
    questions: [
      {
        q: "How do you detect and fix a memory leak in Node.js?",
        a: "Memory leaks manifest as a sawtooth pattern in RSS metrics where memory never fully releases after GC.",
        hint: "Walk through the debugging steps methodically. This shows you've dealt with production memory issues, not just read about them.",
        list: [
          "**1. Detect:** Monitor RSS/heap metrics (Datadog, PM2, process.memoryUsage()). Look for steadily increasing heap that GC can't reclaim.",
          "**2. Reproduce:** Start Node with --inspect flag. Connect Chrome DevTools via chrome://inspect.",
          "**3. Heap Snapshots:** Take snapshot → run load test (Artillery/Autocannon) → take another snapshot → compare. Look at 'Objects allocated between snapshots.'",
          "**4. Allocation Timeline:** DevTools 'Allocation instrumentation' shows exactly when and where memory is allocated.",
          "**5. Clinic.js:** Run `clinic doctor -- node server.js` for automated health analysis, `clinic heapprofiler` for deep memory profiling.",
        ],
        code: `// Common memory leak culprits:

// 1. ❌ Global arrays/maps that grow forever
const cache = new Map(); // never cleared!
app.get('/data/:id', (req, res) => {
  cache.set(req.params.id, fetchExpensiveData(req.params.id));
});

// ✅ Fix: use LRU cache with max size
import { LRUCache } from 'lru-cache';
const cache = new LRUCache({ max: 500, ttl: 1000 * 60 * 5 });

// 2. ❌ Event listeners not cleaned up
function watchFile(path: string) {
  fs.watch(path, onChange); // new listener added every call!
}

// ✅ Fix: remove listener when done
const watcher = fs.watch(path, onChange);
// later: watcher.close();

// 3. ❌ Closures retaining large objects
function processData(hugeArray: any[]) {
  return () => {
    console.log(hugeArray.length); // closure retains entire hugeArray!
  };
}`,
      },
      {
        q: "Explain process.memoryUsage() fields.",
        a: "This is the quickest way to check memory in Node.js.",
        code: `const mem = process.memoryUsage();
console.log({
  rss: mem.rss,                // Resident Set Size — total memory allocated by OS
  heapTotal: mem.heapTotal,    // V8 heap allocated
  heapUsed: mem.heapUsed,      // V8 heap actually used (watch this for leaks)
  external: mem.external,      // Memory used by C++ objects bound to JS (Buffers)
  arrayBuffers: mem.arrayBuffers // SharedArrayBuffer + ArrayBuffer memory
});

// Quick monitoring endpoint
app.get('/health/memory', (req, res) => {
  const mem = process.memoryUsage();
  const heapPercent = ((mem.heapUsed / mem.heapTotal) * 100).toFixed(1);
  res.json({
    heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(1),
    heapTotalMB: (mem.heapTotal / 1024 / 1024).toFixed(1),
    heapPercent: heapPercent + '%',
    rssMB: (mem.rss / 1024 / 1024).toFixed(1),
    uptime: process.uptime(),
  });
});`,
      },
    ],
  },

  // ─── 6. ERROR HANDLING & GRACEFUL SHUTDOWN ───
  {
    title: "6. Error Handling & Graceful Shutdown",
    color: "red",
    questions: [
      {
        q: "Show centralized error handling in Express.",
        a: "Every Express app needs a central error handler. All errors should flow through next(err) to a single middleware.",
        code: `// Custom error classes for different HTTP scenarios
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public isOperational: boolean = true // vs programmer errors
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(\`\${resource} not found\`, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// Wrap async handlers (or use express-async-errors)
const asyncHandler = (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Routes throw errors naturally
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await db.findUser(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json(user);
}));

// Central error handler (MUST have 4 params)
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, {
    code: err.code,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  res.status(err.statusCode || 500).json({
    status: 'error',
    code: err.code || 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
});`,
        hint: "Distinguish operational errors (bad user input, network timeouts — recoverable) from programmer errors (null reference, type errors — crash and restart).",
      },
      {
        q: "Implement a production-grade graceful shutdown.",
        a: "When deploying (SIGTERM from Kubernetes), you must stop accepting new requests, finish active ones, close DB connections, then exit.",
        code: `function gracefulShutdown(signal: string) {
  console.log(\`\${signal} received. Starting graceful shutdown...\`);

  // 1. Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed — no new connections accepted');

    try {
      // 2. Close database connections
      await mongoose.connection.close();
      console.log('MongoDB connection closed');

      await redis.quit();
      console.log('Redis connection closed');

      // 3. Flush any pending logs/metrics
      await logger.flush();

      console.log('Graceful shutdown complete');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // 4. Force kill after timeout (safety net)
  setTimeout(() => {
    console.error('Forced shutdown — timeout exceeded');
    process.exit(1);
  }, 30_000); // 30 seconds max
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));`,
        hint: "In Kubernetes, the pod receives SIGTERM, then has terminationGracePeriodSeconds (default 30s) before SIGKILL. Your shutdown must complete within this window.",
      },
    ],
  },

  // ─── 7. SECURITY ───
  {
    title: "7. API Security",
    color: "emerald",
    questions: [
      {
        q: "What are the essential security middlewares for a Node.js API?",
        a: "Defense in depth — multiple layers of protection.",
        code: `import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';

// 1. Helmet — sets secure HTTP headers
app.use(helmet()); // CSP, X-Frame-Options, X-Content-Type-Options, HSTS...

// 2. Rate Limiting — prevent brute force & basic DDoS
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // 100 requests per window per IP
  standardHeaders: true,
  message: { error: 'Too many requests' },
}));

// Stricter limit for auth endpoints
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // only 5 login attempts per 15 min
}));

// 3. CORS — whitelist allowed origins
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  credentials: true,
}));

// 4. Input sanitization — prevent NoSQL injection
app.use(mongoSanitize()); // strips $ and . from req.body/params/query

// 5. Body size limit — prevent large payload attacks
app.use(express.json({ limit: '10kb' }));`,
        hint: "Being able to list these from memory impresses interviewers. Bonus: mention Content-Security-Policy, CSRF tokens for cookie-based auth, and input validation with Zod/Joi.",
      },
      {
        q: "JWT vs Session-based authentication — tradeoffs?",
        a: "Both solve authentication, but with fundamentally different architectures. The choice depends on your scaling model.",
        list: [
          "**JWT (Stateless):** Server signs a token (payload + signature), client stores it. Server validates without DB lookup. ✅ Scales horizontally trivially. ❌ Can't revoke before expiry without a blacklist (which makes it stateful again).",
          "**Session (Stateful):** Server stores session in Redis/DB, sends session ID cookie. ✅ Easy to revoke (delete from Redis). ❌ Requires centralized session store for multi-server setups.",
          "**Best practice:** Short-lived JWT access tokens (15min) + long-lived refresh tokens (stored in httpOnly cookie). Refresh tokens can be revoked in DB.",
        ],
        code: `// JWT implementation pattern
import jwt from 'jsonwebtoken';

// Sign (login endpoint)
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_REFRESH_SECRET!,
  { expiresIn: '7d' }
);

// Set refresh token as httpOnly cookie (not accessible via JS)
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,       // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// Verify middleware
function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid/expired token' });
  }
}`,
      },
      {
        q: "How do you prevent SQL/NoSQL injection?",
        a: "Never concatenate user input into queries. Use parameterized queries, ORMs, and input validation.",
        code: `// ❌ SQL INJECTION — user can input: ' OR 1=1 --
const user = await db.query(\`SELECT * FROM users WHERE email = '\${req.body.email}'\`);

// ✅ Parameterized query — input is escaped
const user = await db.query('SELECT * FROM users WHERE email = $1', [req.body.email]);

// ❌ NoSQL INJECTION — user sends: { "$gt": "" }
const user = await User.findOne({ email: req.body.email }); // matches all!

// ✅ Input validation with Zod
import { z } from 'zod';
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
const validated = loginSchema.parse(req.body); // throws if invalid

// ✅ express-mongo-sanitize for defense-in-depth
app.use(mongoSanitize()); // strips $ operators from input`,
      },
    ],
  },

  // ─── 8. SCALING & CACHING ───
  {
    title: "8. Scaling, Clustering & Caching",
    color: "purple",
    questions: [
      {
        q: "What is the Cache Stampede problem and how do you solve it?",
        a: "When a popular cache key expires, thousands of requests simultaneously hit the DB to rebuild it, potentially killing the database.",
        code: `// ❌ Naive caching — vulnerable to stampede
async function getProduct(id: string) {
  let product = await redis.get(\`product:\${id}\`);
  if (!product) {
    product = await db.findProduct(id); // 1000 requests hit DB simultaneously!
    await redis.set(\`product:\${id}\`, JSON.stringify(product), 'EX', 300);
  }
  return JSON.parse(product);
}

// ✅ Promise Caching (Mutex/Coalescing) — only ONE DB query
const inflightRequests = new Map<string, Promise<any>>();

async function getProductSafe(id: string) {
  const cacheKey = \`product:\${id}\`;
  let product = await redis.get(cacheKey);
  if (product) return JSON.parse(product);

  // Check if another request is already rebuilding this cache
  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey); // wait for the first request
  }

  // First request — lock and rebuild
  const promise = db.findProduct(id).then(async (result) => {
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 300);
    inflightRequests.delete(cacheKey);
    return result;
  });

  inflightRequests.set(cacheKey, promise);
  return promise;
}`,
        hint: "Alternatives: probabilistic early expiration (refresh cache before it expires), or background refresh with a soft TTL.",
      },
      {
        q: "How does Node.js clustering work?",
        a: "The cluster module forks multiple worker processes that share the same server port. Each worker is a full Node.js process with its own V8 and event loop.",
        code: `import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(\`Primary \${process.pid} forking \${numCPUs} workers\`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart crashed workers
  cluster.on('exit', (worker, code) => {
    console.log(\`Worker \${worker.process.pid} died (code: \${code}). Restarting...\`);
    cluster.fork();
  });
} else {
  // Workers share the same TCP port
  app.listen(3000, () => {
    console.log(\`Worker \${process.pid} started\`);
  });
}

// In production, use PM2 instead:
// pm2 start server.js -i max   // fork one worker per CPU
// pm2 reload server.js         // zero-downtime restart`,
        hint: "Cluster workers don't share memory (unlike threads). For shared state, use Redis. PM2 handles clustering, process management, and zero-downtime deploys in production.",
      },
      {
        q: "Explain the DataLoader pattern for the N+1 problem.",
        a: "When resolving a list of 100 Posts, each needing its Author, naive code runs 100 separate DB queries. DataLoader batches them into one query.",
        code: `import DataLoader from 'dataloader';

// DataLoader is created per-request (avoid cross-request cache leaking)
function createLoaders() {
  return {
    userLoader: new DataLoader(async (userIds: readonly string[]) => {
      // ONE query instead of N queries
      const users = await db.query(
        'SELECT * FROM users WHERE id = ANY($1)',
        [userIds]
      );

      // MUST return results in the same order as input IDs
      const userMap = new Map(users.map(u => [u.id, u]));
      return userIds.map(id => userMap.get(id) || null);
    }),
  };
}

// Usage in GraphQL resolvers
const resolvers = {
  Post: {
    author: (post, _, { loaders }) => loaders.userLoader.load(post.authorId),
    // Even if 100 posts call this, only 1 DB query executes
  },
};`,
      },
    ],
  },

  // ─── 9. DATABASE PATTERNS ───
  {
    title: "9. Database Patterns",
    color: "orange",
    questions: [
      {
        q: "Compare Prisma, TypeORM, Sequelize, and Drizzle.",
        a: "All are ORMs/query builders for Node.js, but with different philosophies.",
        list: [
          "**Prisma:** Schema-first, auto-generated type-safe client, excellent DX, built-in migrations. Con: custom SQL is harder, adds a query engine binary.",
          "**TypeORM:** Decorator-based (like Java Hibernate), supports Active Record and Data Mapper patterns. Mature but losing mindshare. TypeScript support has edge cases.",
          "**Sequelize:** Oldest Node ORM, callback-based origin. Massive community but TypeScript is an afterthought. Being replaced in new projects.",
          "**Drizzle:** SQL-like syntax, zero overhead, fully type-safe. \"If you know SQL, you know Drizzle.\" Growing rapidly, excellent for performance-critical apps.",
        ],
        hint: "Say: 'I prefer Prisma for DX on typical CRUD apps, and Drizzle when I need fine-grained SQL control with full type safety.'",
      },
      {
        q: "Explain connection pooling and why it matters.",
        a: "Creating a new DB connection per request is expensive (~20-50ms). Connection pools maintain ready-to-use connections.",
        code: `import { Pool } from 'pg';

// Pool maintains a fixed set of connections
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  max: 20,              // max connections in pool
  idleTimeoutMillis: 30000, // close idle connections after 30s
  connectionTimeoutMillis: 2000, // fail fast if pool is exhausted
});

// ✅ Use pool.query — automatically acquires and releases connection
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// For transactions, explicitly acquire a client
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, fromId]);
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, toId]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release(); // ALWAYS release back to pool
}`,
        hint: "Common production issue: pool exhaustion caused by not releasing clients (forgetting client.release()). Always use try/finally.",
      },
    ],
  },

  // ─── 10. WORKER THREADS ───
  {
    title: "10. Worker Threads & Child Processes",
    color: "pink",
    questions: [
      {
        q: "When do you use Worker Threads vs Child Processes?",
        a: "Both run code outside the main thread, but with different isolation levels and communication models.",
        list: [
          "**Worker Threads:** Share memory (SharedArrayBuffer), lighter weight, same process. Use for: CPU-intensive JS computation (image processing, crypto, data parsing).",
          "**Child Process (fork):** Separate Node.js process, separate memory, communicate via IPC. Use for: running separate scripts, legacy module isolation, untrusted code.",
          "**Child Process (exec/spawn):** Run any OS command. Use for: shell commands, running Python/Go scripts, system administration tasks.",
        ],
        code: `// Worker Thread example
// main.js
import { Worker, isMainThread, workerData, parentPort } from 'worker_threads';

if (isMainThread) {
  // Create worker
  const worker = new Worker(new URL('./worker.js', import.meta.url), {
    workerData: { numbers: [1, 2, 3, 4, 5] }
  });

  worker.on('message', (result) => console.log('Sum:', result));
  worker.on('error', (err) => console.error('Worker error:', err));
} else {
  // worker.js — runs in separate thread
  const sum = workerData.numbers.reduce((a: number, b: number) => a + b, 0);
  parentPort?.postMessage(sum); // send result back
}

// Shared memory between threads
const sharedBuffer = new SharedArrayBuffer(1024);
const sharedArray = new Int32Array(sharedBuffer);
// Pass sharedBuffer to worker — both threads can read/write it
// Use Atomics.wait() and Atomics.notify() for synchronization`,
      },
    ],
  },

  // ─── 11. TESTING ───
  {
    title: "11. Testing in Node.js",
    color: "cyan",
    questions: [
      {
        q: "Show an integration test with Supertest.",
        a: "Integration tests verify that routes, middleware, validation, and database work together correctly.",
        code: `import request from 'supertest';
import { app } from '../app';
import { db } from '../db';

describe('POST /api/users', () => {
  beforeEach(async () => {
    await db.query('DELETE FROM users'); // clean state
  });

  afterAll(async () => {
    await db.end(); // close connection pool
  });

  it('creates a user with valid data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Dana', email: 'dana@test.com' })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: 'Dana',
      email: 'dana@test.com',
    });

    // Verify it's actually in the database
    const dbUser = await db.query('SELECT * FROM users WHERE email = $1', ['dana@test.com']);
    expect(dbUser.rows).toHaveLength(1);
  });

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Dana', email: 'not-an-email' })
      .expect(400);

    expect(res.body.code).toBe('VALIDATION_ERROR');
  });

  it('returns 409 for duplicate email', async () => {
    await request(app).post('/api/users').send({ name: 'Dana', email: 'dana@test.com' });
    await request(app)
      .post('/api/users')
      .send({ name: 'Dana2', email: 'dana@test.com' })
      .expect(409);
  });
});`,
        hint: "Test the API contract, not internal implementation. Use a real test database, not mocks — integration tests should actually integrate.",
      },
      {
        q: "Mock vs Stub vs Spy — what's the difference?",
        a: "All are test doubles, but serve different purposes.",
        list: [
          "**Stub:** Replaces a function with a fake that returns hardcoded values. You don't care how it was called — just need controlled output. `jest.fn().mockResolvedValue(data)`",
          "**Spy:** Wraps the real function, lets it execute, but tracks calls. You verify it was called correctly while keeping real behavior. `jest.spyOn(obj, 'method')`",
          "**Mock:** Pre-programs expectations. The test FAILS if the mock isn't called exactly as specified. More strict than spies. `jest.fn().mockImplementation(...)`",
        ],
        code: `// Stub — replace external service
jest.mock('../services/email');
const sendEmail = require('../services/email');
sendEmail.mockResolvedValue({ success: true }); // always succeeds

// Spy — watch real method
const spy = jest.spyOn(logger, 'error');
await handleRequest(badRequest);
expect(spy).toHaveBeenCalledWith('Validation failed', expect.any(Object));
spy.mockRestore(); // restore original

// Jest mock with implementation
const mockDb = jest.fn()
  .mockResolvedValueOnce({ id: 1, name: 'first call' })
  .mockResolvedValueOnce({ id: 2, name: 'second call' })
  .mockRejectedValueOnce(new Error('DB down')); // third call fails`,
      },
    ],
  },

  // ─── 12. EXPRESS vs FASTIFY vs NESTJS ───
  {
    title: "12. Express vs Fastify vs NestJS",
    color: "slate",
    questions: [
      {
        q: "When would you choose Express, Fastify, or NestJS?",
        a: "Each framework serves different team sizes and project complexities.",
        list: [
          "**Express:** Industry standard, massive middleware ecosystem, minimal opinions. Choose for: small-medium APIs, rapid prototyping, teams familiar with Express. Con: unoptimized routing, no built-in validation.",
          "**Fastify:** 2-5x faster than Express, built-in schema validation (AJV), Pino logging, encapsulated plugins. Choose for: high-throughput APIs, microservices needing raw performance.",
          "**NestJS:** Full enterprise framework (inspired by Angular). Dependency injection, decorators, modules, guards, interceptors. Choose for: large teams, enterprise APIs, when you need structure and conventions. Con: steep learning curve, heavier.",
        ],
        hint: "Don't just list features. Show you understand WHEN to pick each: Express for simplicity, Fastify for performance, NestJS for large teams needing architecture guardrails.",
      },
    ],
  },

  // ─── 13. ARCHITECTURE & MICROSERVICES ───
  {
    title: "13. Architecture & Microservices",
    color: "indigo",
    questions: [
      {
        q: "Synchronous vs Asynchronous microservice communication?",
        a: "The choice fundamentally affects reliability, coupling, and scaling behavior.",
        list: [
          "**Synchronous (REST/gRPC):** Service A calls Service B and waits. If B is down, A fails. Requires circuit breakers, retries, timeouts. Use for: queries needing immediate responses.",
          "**Asynchronous (RabbitMQ/Kafka/SQS):** Service A publishes event, responds to user immediately. Service B processes eventually. Use for: everything that doesn't need an immediate response (emails, notifications, analytics, order processing).",
          "**Event Sourcing:** Store events, not state. Rebuild state by replaying events. Provides complete audit trail. Complex but powerful for financial, compliance systems.",
          "**CQRS:** Separate read and write models. Write side emits events, read side builds optimized projections. Scales reads independently of writes.",
        ],
      },
      {
        q: "What is the Circuit Breaker pattern?",
        a: "Prevents cascading failures in distributed systems. When a downstream service is failing, stop calling it and fail fast.",
        code: `// Simple circuit breaker implementation
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,    // failures before opening
    private timeout: number = 30000,  // ms before trying again
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.timeout) {
        this.state = 'HALF_OPEN'; // allow one test request
      } else {
        throw new Error('Circuit breaker is OPEN — service unavailable');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const paymentCircuit = new CircuitBreaker(3, 10000);
const result = await paymentCircuit.call(() => paymentService.charge(amount));`,
        hint: "In production, use libraries like opossum (Node.js circuit breaker). Mention that Kubernetes readiness probes + service mesh (Istio) can also provide circuit breaking at the infrastructure level.",
      },
    ],
  },

  // ─── 14. PACKAGES & MODULES ───
  {
    title: "14. Modules & Package Management",
    color: "teal",
    questions: [
      {
        q: "CommonJS vs ES Modules — what are the key differences?",
        a: "CJS and ESM have fundamentally different module loading behavior.",
        list: [
          "**CommonJS (require):** Synchronous, dynamic (can require inside if-blocks), returns a copy of the exported value. Default in Node.js (without 'type': 'module').",
          "**ES Modules (import):** Asynchronous, static (imports hoisted, enables tree-shaking), returns a live binding (reference). Default in browsers.",
          "**'type': 'module' in package.json:** Makes .js files ESM. Use .cjs extension for CommonJS files in ESM projects.",
          "**Interop:** ESM can import CJS modules. CJS cannot use top-level await or static import (must use dynamic import()).",
        ],
        code: `// CommonJS
const { readFile } = require('fs');
module.exports = { myFunction };
module.exports.default = myFunction; // CJS default export

// ES Modules
import { readFile } from 'fs';
export { myFunction };
export default myFunction;

// Dynamic import (works in both CJS and ESM)
const module = await import('./heavy-module.js');

// package.json to enable ESM
{
  "type": "module",    // .js files are treated as ESM
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",   // ESM consumers
      "require": "./dist/cjs/index.cjs"   // CJS consumers
    }
  }
}`,
        hint: "In 2024+, default to ESM for new projects. CJS is legacy but still widely used due to the massive npm ecosystem. Know how to publish packages that support both (dual package hazard).",
      },
    ],
  },
];

/* ─────────────────────────────────────
   SECTION-LEVEL QUIZZES (by section title)
   ───────────────────────────────────── */
export const sectionQuizzes: Record<string, QuizQuestion[]> = {
  "2. The Event Loop": [
    {
      question: "Which has HIGHER priority in the microtask queue?",
      options: ["Promise.then()", "process.nextTick()", "setTimeout(fn, 0)", "setImmediate()"],
      correctIndex: 1,
      explanation: "process.nextTick() callbacks run BEFORE Promise.then() callbacks in the microtask queue. Both run between event loop phases, but nextTick always goes first."
    },
    {
      question: "In an I/O callback, which fires first: setImmediate() or setTimeout(fn, 0)?",
      options: ["setTimeout always fires first", "setImmediate always fires first", "They are non-deterministic", "Neither fires in I/O callbacks"],
      correctIndex: 1,
      explanation: "Inside an I/O callback, setImmediate() ALWAYS fires before setTimeout(fn, 0). This is because the Check phase (setImmediate) comes right after Poll (I/O), while Timers comes later."
    },
    {
      question: "What is Event Loop starvation caused by?",
      options: [
        "Too many HTTP connections",
        "Recursive process.nextTick() or heavy synchronous code blocking the loop",
        "Using too many Promises",
        "Having too many event listeners"
      ],
      correctIndex: 1,
      explanation: "Recursive process.nextTick() fills the microtask queue infinitely — the event loop never advances to the next phase, so I/O never processes. Similarly, long synchronous CPU work blocks everything."
    },
  ],
  "3. Async Patterns & Error Handling": [
    {
      question: "What does Promise.allSettled return when one promise rejects?",
      options: [
        "It rejects immediately like Promise.all",
        "An array with status 'fulfilled' or 'rejected' for EACH promise",
        "Only the fulfilled results",
        "An error object"
      ],
      correctIndex: 1,
      explanation: "Promise.allSettled NEVER rejects. It waits for all promises and returns { status: 'fulfilled', value } or { status: 'rejected', reason } for each one. Perfect for independent parallel operations."
    },
  ],
  "4. Streams & Buffers": [
    {
      question: "What happens if a readable stream produces data faster than a writable can consume?",
      options: [
        "Data is silently dropped",
        "An error is thrown",
        "Memory grows unbounded (backpressure problem)",
        "The readable automatically slows down"
      ],
      correctIndex: 2,
      explanation: "Without backpressure handling, unwritten chunks accumulate in memory buffers, eventually crashing the process with OOM. Use pipeline() which handles backpressure automatically."
    },
    {
      question: "Why should you use pipeline() instead of .pipe()?",
      options: [
        "pipeline() is faster",
        "pipeline() handles errors and cleanup automatically",
        "pipeline() supports more stream types",
        ".pipe() is deprecated"
      ],
      correctIndex: 1,
      explanation: ".pipe() doesn't propagate errors — if a stream errors, other streams in the chain may leak. pipeline() ensures all streams are properly cleaned up on error or completion."
    },
  ],
  "7. API Security": [
    {
      question: "What is the main disadvantage of JWT-based authentication?",
      options: [
        "JWTs are too small to hold user data",
        "JWTs cannot be revoked before expiry without a server-side blacklist",
        "JWTs are not secure",
        "JWTs require cookies"
      ],
      correctIndex: 1,
      explanation: "Once signed, a JWT is valid until it expires. To revoke one early, you need a server-side blacklist — which defeats the 'stateless' advantage. The solution: short-lived access tokens (15min) + revocable refresh tokens."
    },
  ],
  "8. Scaling, Clustering & Caching": [
    {
      question: "What is the Cache Stampede problem?",
      options: [
        "Too many cache servers crashing at once",
        "Cache key collisions causing wrong data",
        "Many requests simultaneously rebuilding an expired cache key, overwhelming the DB",
        "Cache becoming too large for memory"
      ],
      correctIndex: 2,
      explanation: "When a popular cache key expires, thousands of concurrent requests all try to rebuild it from the database simultaneously. The solution: promise coalescing (mutex) — only the first request rebuilds while others wait."
    },
  ],
};

/* ─────────────────────────────────────
   CONSOLE OUTPUT EXAMPLES
   ───────────────────────────────────── */
export const consoleExamples: {
  sectionTitle: string;
  title: string;
  code: string;
  output: string[];
}[] = [
  {
    sectionTitle: "2. The Event Loop",
    title: "Event Loop execution order puzzle",
    code: `console.log('1. script start');

setTimeout(() => console.log('2. setTimeout'), 0);

Promise.resolve()
  .then(() => console.log('3. promise 1'))
  .then(() => console.log('4. promise 2'));

process.nextTick(() => console.log('5. nextTick'));

setImmediate(() => console.log('6. setImmediate'));

console.log('7. script end');`,
    output: [
      "1. script start",
      "7. script end",
      "// ── Microtask Queue (drained between phases) ──",
      "5. nextTick         ← highest microtask priority",
      "3. promise 1        ← Promise.then after nextTick",
      "4. promise 2        ← chained promise",
      "// ── Timers Phase ──",
      "2. setTimeout       ← timers phase callback",
      "// ── Check Phase ──",
      "6. setImmediate     ← check phase (order with setTimeout is non-deterministic at top level)",
    ],
  },
  {
    sectionTitle: "5. Memory Management & Profiling",
    title: "process.memoryUsage() output explained",
    code: `const mem = process.memoryUsage();
console.log(JSON.stringify(mem, null, 2));`,
    output: [
      "{",
      '  "rss": 35651584,          // 34MB — Total OS-allocated memory',
      '  "heapTotal": 6537216,     // 6.2MB — V8 heap allocated',
      '  "heapUsed": 4287456,      //  4.1MB — Actually used (watch for leaks!)',
      '  "external": 1081442,      // 1MB — C++ objects (Buffers)',
      '  "arrayBuffers": 10507     // 10KB — SharedArrayBuffer memory',
      "}",
      "",
      "// 🚨 Leak indicator: heapUsed grows steadily across requests",
      "// ✅ Healthy: heapUsed stabilizes after GC cycles",
    ],
  },
  {
    sectionTitle: "6. Error Handling & Graceful Shutdown",
    title: "Graceful shutdown sequence",
    code: `// When Kubernetes sends SIGTERM:
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));`,
    output: [
      "> SIGTERM received. Starting graceful shutdown...",
      "> HTTP server closed — no new connections accepted",
      "> Waiting for 12 active requests to complete...",
      "> All requests completed",
      "> MongoDB connection closed",
      "> Redis connection closed",
      "> Logs flushed",
      "> Graceful shutdown complete (exit 0)",
      "",
      "// If shutdown takes > 30s:",
      "Error Forced shutdown — timeout exceeded (exit 1)",
    ],
  },
];

/* ─────────────────────────────────────
   DIAGRAMS (section-level)
   ───────────────────────────────────── */
export const sectionDiagrams: Record<string, { title: string; svg: string }> = {
  "2. The Event Loop": {
    title: "Node.js Event Loop Phases",
    svg: `<svg viewBox="0 0 780 340" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:780px">
  <rect x="5" y="5" width="770" height="330" rx="14" fill="#78350f" opacity="0.03"/>
  <text x="390" y="30" text-anchor="middle" fill="#92400e" font-size="14" font-weight="bold">Node.js Event Loop — 6 Phases + Microtask Queue</text>
  <rect x="30" y="50" width="150" height="55" rx="10" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="105" y="73" text-anchor="middle" fill="#b45309" font-size="12" font-weight="bold">1. Timers</text>
  <text x="105" y="93" text-anchor="middle" fill="#92400e" font-size="10">setTimeout/setInterval</text>
  <rect x="210" y="50" width="150" height="55" rx="10" fill="#fb923c" opacity="0.15" stroke="#fb923c" stroke-width="1.5"/>
  <text x="285" y="73" text-anchor="middle" fill="#c2410c" font-size="12" font-weight="bold">2. Pending I/O</text>
  <text x="285" y="93" text-anchor="middle" fill="#9a3412" font-size="10">Deferred callbacks</text>
  <rect x="390" y="50" width="150" height="55" rx="10" fill="#94a3b8" opacity="0.15" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="465" y="73" text-anchor="middle" fill="#475569" font-size="12" font-weight="bold">3. Idle/Prepare</text>
  <text x="465" y="93" text-anchor="middle" fill="#64748b" font-size="10">Internal only</text>
  <rect x="30" y="130" width="150" height="55" rx="10" fill="#3b82f6" opacity="0.15" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="105" y="153" text-anchor="middle" fill="#1d4ed8" font-size="12" font-weight="bold">4. Poll</text>
  <text x="105" y="173" text-anchor="middle" fill="#1e40af" font-size="10">I/O events, blocks here</text>
  <rect x="210" y="130" width="150" height="55" rx="10" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="1.5"/>
  <text x="285" y="153" text-anchor="middle" fill="#047857" font-size="12" font-weight="bold">5. Check</text>
  <text x="285" y="173" text-anchor="middle" fill="#065f46" font-size="10">setImmediate()</text>
  <rect x="390" y="130" width="150" height="55" rx="10" fill="#ef4444" opacity="0.15" stroke="#ef4444" stroke-width="1.5"/>
  <text x="465" y="153" text-anchor="middle" fill="#b91c1c" font-size="12" font-weight="bold">6. Close</text>
  <text x="465" y="173" text-anchor="middle" fill="#991b1b" font-size="10">socket.on('close')</text>
  <line x1="180" y1="77" x2="210" y2="77" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrowE)"/>
  <line x1="360" y1="77" x2="390" y2="77" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrowE)"/>
  <line x1="465" y1="105" x2="465" y2="125" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrowE)"/>
  <line x1="390" y1="157" x2="360" y2="157" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrowEr)"/>
  <line x1="210" y1="157" x2="180" y2="157" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrowEr)"/>
  <line x1="105" y1="105" x2="105" y2="125" stroke="#d97706" stroke-width="1.5" marker-end="url(#arrowE)"/>
  <rect x="580" y="50" width="185" height="135" rx="12" fill="#8b5cf6" opacity="0.08" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="6"/>
  <text x="672" y="75" text-anchor="middle" fill="#6d28d9" font-size="12" font-weight="bold">Microtask Queue</text>
  <text x="672" y="98" text-anchor="middle" fill="#7c3aed" font-size="11">1. process.nextTick()</text>
  <text x="672" y="118" text-anchor="middle" fill="#7c3aed" font-size="11">2. Promise.then()</text>
  <text x="672" y="145" text-anchor="middle" fill="#6d28d9" font-size="10" font-weight="bold">⚡ Drained between</text>
  <text x="672" y="162" text-anchor="middle" fill="#6d28d9" font-size="10" font-weight="bold">EVERY phase</text>
  <rect x="30" y="220" width="510" height="100" rx="10" fill="#1e293b" opacity="0.04" stroke="#64748b" stroke-width="1"/>
  <text x="50" y="245" fill="#475569" font-size="11" font-weight="bold">Key Takeaways:</text>
  <text x="50" y="268" fill="#475569" font-size="10">• process.nextTick() > Promise.then() > setTimeout(fn,0) > setImmediate()</text>
  <text x="50" y="288" fill="#475569" font-size="10">• In I/O callbacks: setImmediate() ALWAYS fires before setTimeout(fn, 0)</text>
  <text x="50" y="308" fill="#475569" font-size="10">• Poll phase blocks if nothing is scheduled (efficient idle behavior)</text>
  <defs>
    <marker id="arrowE" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#d97706"/></marker>
    <marker id="arrowEr" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto"><path d="M8,0 L0,3 L8,6" fill="#d97706"/></marker>
  </defs>
</svg>`
  },
  "1. Node.js Overview & Architecture": {
    title: "Node.js Architecture: V8 + libuv",
    svg: `<svg viewBox="0 0 780 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:780px">
  <rect x="5" y="5" width="770" height="210" rx="14" fill="#14532d" opacity="0.03"/>
  <rect x="20" y="20" width="230" height="180" rx="12" fill="#22c55e" opacity="0.08" stroke="#22c55e" stroke-width="1.5"/>
  <text x="135" y="45" text-anchor="middle" fill="#166534" font-size="13" font-weight="bold">V8 Engine (Google)</text>
  <text x="135" y="70" text-anchor="middle" fill="#15803d" font-size="10">JS → Bytecode → Machine Code</text>
  <rect x="40" y="85" width="90" height="35" rx="6" fill="#22c55e" opacity="0.15" stroke="#22c55e"/>
  <text x="85" y="107" text-anchor="middle" fill="#166534" font-size="10">Heap (GC)</text>
  <rect x="145" y="85" width="90" height="35" rx="6" fill="#22c55e" opacity="0.15" stroke="#22c55e"/>
  <text x="190" y="107" text-anchor="middle" fill="#166534" font-size="10">Call Stack</text>
  <text x="135" y="148" text-anchor="middle" fill="#15803d" font-size="10">Young Gen → Old Gen GC</text>
  <text x="135" y="168" text-anchor="middle" fill="#15803d" font-size="10">Incremental Marking</text>
  <text x="135" y="188" text-anchor="middle" fill="#15803d" font-size="10">Default heap: ~1.5GB</text>
  <rect x="280" y="20" width="230" height="180" rx="12" fill="#3b82f6" opacity="0.08" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="395" y="45" text-anchor="middle" fill="#1d4ed8" font-size="13" font-weight="bold">libuv (C Library)</text>
  <text x="395" y="70" text-anchor="middle" fill="#2563eb" font-size="10">Event Loop + Async I/O</text>
  <rect x="298" y="85" width="90" height="35" rx="6" fill="#3b82f6" opacity="0.15" stroke="#3b82f6"/>
  <text x="343" y="107" text-anchor="middle" fill="#1d4ed8" font-size="10">Event Loop</text>
  <rect x="403" y="85" width="90" height="35" rx="6" fill="#3b82f6" opacity="0.15" stroke="#3b82f6"/>
  <text x="448" y="100" text-anchor="middle" fill="#1d4ed8" font-size="10">Thread Pool</text>
  <text x="448" y="114" text-anchor="middle" fill="#2563eb" font-size="9">(default 4)</text>
  <text x="395" y="148" text-anchor="middle" fill="#2563eb" font-size="10">fs, DNS, crypto → pool</text>
  <text x="395" y="168" text-anchor="middle" fill="#2563eb" font-size="10">TCP/UDP → OS async</text>
  <text x="395" y="188" text-anchor="middle" fill="#2563eb" font-size="10">epoll/kqueue/IOCP</text>
  <rect x="540" y="20" width="225" height="180" rx="12" fill="#f59e0b" opacity="0.08" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="652" y="45" text-anchor="middle" fill="#b45309" font-size="13" font-weight="bold">Node.js APIs</text>
  <text x="652" y="70" text-anchor="middle" fill="#d97706" font-size="10">Bindings to V8 + libuv</text>
  <rect x="558" y="85" width="90" height="35" rx="6" fill="#f59e0b" opacity="0.15" stroke="#f59e0b"/>
  <text x="603" y="107" text-anchor="middle" fill="#b45309" font-size="10">http/https</text>
  <rect x="663" y="85" width="90" height="35" rx="6" fill="#f59e0b" opacity="0.15" stroke="#f59e0b"/>
  <text x="708" y="107" text-anchor="middle" fill="#b45309" font-size="10">fs/path</text>
  <text x="652" y="148" text-anchor="middle" fill="#d97706" font-size="10">stream, crypto, net</text>
  <text x="652" y="168" text-anchor="middle" fill="#d97706" font-size="10">worker_threads</text>
  <text x="652" y="188" text-anchor="middle" fill="#d97706" font-size="10">child_process, cluster</text>
  <line x1="250" y1="110" x2="280" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#arrowN)"/>
  <line x1="510" y1="110" x2="540" y2="110" stroke="#64748b" stroke-width="2" marker-end="url(#arrowN)"/>
  <defs><marker id="arrowN" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#64748b"/></marker></defs>
</svg>`
  },
};
