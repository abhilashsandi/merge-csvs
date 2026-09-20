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
  // ─── 1. FRAMING THE PROBLEM ───
  {
    title: '1. Framing the Problem',
    color: 'blue',
    intro:
      'The first five minutes decide whether the rest of the interview goes well. Resist the urge to start drawing boxes — an interviewer is grading how you scope an ambiguous problem as much as the final architecture.',
    questions: [
      {
        q: 'How do you open when asked to "design a full-stack app that serves millions of users"?',
        a: 'Treat the prompt as deliberately underspecified and spend the first few minutes narrowing it, out loud, before any design work starts. Two categories of questions matter: functional (what does the app actually do — pick one or two core workflows to design deeply rather than trying to cover everything shallowly) and non-functional (how many users, what "millions" means concretely, read-heavy or write-heavy, global or single-region, latency and availability targets, what data is sensitive enough to need special handling). Anchoring on a concrete example — "let\'s say this is a member portal, the core flows are browsing content, checking account status, and one write-heavy action like submitting a claim" — gives every later decision something real to be justified against instead of floating in the abstract.',
        list: [
          '<strong>Functional scope:</strong> pick 2–3 core user workflows and say so explicitly — designing everything shallowly is worse than designing the important 20% deeply.',
          '<strong>Non-functional targets:</strong> concrete numbers for scale (10M registered / 1M daily active is a reasonable anchor), availability (99.9% vs 99.99% changes the entire reliability story), and latency (sub-200ms API responses vs "reasonably fast").',
          '<strong>Read vs. write ratio:</strong> most consumer apps are 90%+ reads — this single fact justifies caching and read replicas before anything else does.',
          '<strong>Time budget:</strong> roughly 5 minutes on requirements, 10–15 on high-level architecture, 15–20 going deep on 2–3 components the interviewer steers you toward, 5 on trade-offs and what you\'d cut for an MVP.',
        ],
      },
      {
        q: 'How would you size the system with a back-of-envelope estimate?',
        a: 'A rough capacity estimate is what turns "millions of users" from a scary phrase into a specific number of servers, a specific database size, and a specific caching strategy — and it\'s a strong signal on its own, independent of the final numbers being exactly right. The goal is order-of-magnitude accuracy in under two minutes, not precision.',
        code: `// Assume: 10M registered users, 10% daily active (DAU) = 1M DAU
// Each active user makes ~20 requests/day (page views + API calls)

Average requests/sec = (1,000,000 users × 20 requests) / 86,400 sec
                      ≈ 231 req/sec

// Traffic is never flat — plan for peak, not average.
// A typical peak-to-average ratio for a consumer app is 3-5x.
Peak req/sec ≈ 231 × 5 ≈ 1,150 req/sec

// Storage: assume each user generates 50KB of data over their lifetime
// (profile, activity history, documents)
Total storage ≈ 10,000,000 × 50KB ≈ 500GB

// growing at, say, 500K new users/month × 50KB ≈ 25GB/month
// — comfortably within a single well-provisioned PostgreSQL instance
// for years, which is the point: this justifies NOT sharding on day one.`,
        list: [
          'The exact multiplier matters less than showing you know average traffic and peak traffic are different numbers, and that peak is what you provision for.',
          'A storage estimate this small is itself a finding: it tells you a single primary database with read replicas is enough for a long time, and sharding would be solving a problem you don\'t have yet.',
        ],
      },
    ],
  },

  // ─── 2. CLIENT LAYER & WEB FRAMEWORK ───
  {
    title: '2. Client Layer & Web Framework',
    color: 'indigo',
    questions: [
      {
        q: 'Which web framework would you choose, and why?',
        a: 'Next.js is the default-strong answer for a consumer-facing full-stack app today, and the reason to give isn\'t "it\'s popular" — it\'s that it lets each page pick its own rendering strategy instead of forcing the whole app into one model. A marketing/landing page can be statically generated at build time; a product page that changes daily can use ISR (incremental static regeneration) to stay fast while staying fresh; a logged-in dashboard that must be current on every load uses SSR; and a page with one slow, non-critical section can stream that section in via Suspense while the rest of the page is already interactive.',
        list: [
          '<strong>Next.js (App Router)</strong> — the right default: mixed rendering strategies per route, React Server Components to ship less client JS, built-in image/font optimization, and a mature deployment story on Vercel or self-hosted via Node.',
          '<strong>Remix</strong> — a strong alternative if the app is heavily form/mutation-driven; its loader/action model maps very directly onto server-driven data flows, at the cost of a smaller ecosystem than Next.js.',
          '<strong>A plain SPA (Vite + React Router)</strong> — reasonable for an internal tool or admin dashboard where SEO doesn\'t matter and everything is behind auth anyway; wrong choice for a public-facing product where first-load performance and SEO both matter.',
          '<strong>Mobile clients</strong> — React Native (code/logic sharing with the web team, see the interview-prep track on React Native) for most product teams, or fully native when a feature needs the top tier of platform integration or performance.',
        ],
      },
      {
        q: 'REST, GraphQL, or tRPC for the API contract?',
        a: 'This is a "depends on the org, not the technology" answer, and saying so is the strong signal — naming one winner unconditionally is the weaker answer. REST is the safe, boring default: cacheable by URL, understood by every tool and every engineer, trivial to version. GraphQL earns its complexity when the client genuinely needs to shape its own queries — a mobile app and a web app with very different data needs hitting the same backend, or a product with deeply nested, client-driven views where REST would mean either over-fetching or a combinatorial explosion of endpoints. tRPC is the pragmatic middle ground specifically when both ends are TypeScript in the same monorepo — end-to-end type safety with none of GraphQL\'s schema/resolver ceremony, at the cost of tight coupling to that one stack.',
        list: [
          'A useful rule: start with REST, reach for GraphQL only once "the frontend needs a slightly different shape of this data on three different screens" has actually happened more than once.',
          'Whatever is chosen, the API Gateway layer (below) is what actually terminates it before it reaches internal services — the contract choice doesn\'t change that boundary.',
        ],
      },
    ],
  },

  // ─── 3. AUTH & IDENTITY ───
  {
    title: '3. Auth & Identity',
    color: 'purple',
    questions: [
      {
        q: 'Session cookies or JWTs — and where does auth actually get checked?',
        a: 'Session cookies (an opaque ID, server-side session store, typically Redis) and JWTs (a signed, self-contained token) trade off in exactly one place: JWTs avoid a server-side lookup on every request by putting the claims in the token itself, at the cost of being hard to revoke before they expire — a compromised JWT is valid until it naturally expires unless you build a denylist, which reintroduces the server-side check you were trying to avoid. For a system with millions of users, a hybrid is the pragmatic default: a short-lived JWT access token (5–15 minutes) for stateless verification at the edge, paired with a longer-lived, revocable refresh token stored server-side that mints new access tokens — most of the read traffic never touches the session store, but a compromised session can still be killed within minutes, not left valid for the JWT\'s full lifetime.',
        list: [
          '<strong>Where it terminates:</strong> validate the access token at the API Gateway (below) so a request with a bad or expired token never reaches an internal service — internal services trust a verified identity header the gateway attaches, they don\'t re-verify the token themselves.',
          '<strong>Third-party/enterprise login:</strong> OAuth2 for delegated access (login with Google, connect a calendar), OIDC (a thin identity layer on OAuth2) for actual authentication, SAML if an enterprise customer\'s IdP requires it — Okta/Auth0/Cognito are the usual off-the-shelf choices rather than hand-rolling this.',
          '<strong>Multi-tenant SaaS:</strong> tenant ID belongs in the token\'s claims, checked at the gateway, so a leaked or forged request can\'t cross tenant boundaries even if a downstream service has a bug.',
        ],
      },
    ],
  },

  // ─── 4. EDGE, CDN & API GATEWAY ───
  {
    title: '4. Edge, CDN & API Gateway',
    color: 'cyan',
    questions: [
      {
        q: 'What sits between the client and your services?',
        a: 'Two distinct layers, often conflated in an interview answer but worth naming separately: a CDN handles static, cacheable content close to the user (JS/CSS bundles, images, fonts, and — with the right cache-control headers — public HTML and API responses); an API Gateway handles everything that actually needs to reach your backend, and is where cross-cutting concerns get enforced exactly once instead of duplicated in every service.',
        list: [
          '<strong>CDN responsibilities:</strong> versioned static assets with long <code>max-age</code> + <code>immutable</code>; selectively cached public API/HTML responses with short TTLs and <code>stale-while-revalidate</code>; edge rendering for pages that are mostly the same across users.',
          '<strong>API Gateway responsibilities:</strong> TLS termination, authentication (validating the access token from the section above), rate limiting per user/IP/API key, request routing to the right backend service, and request/response logging with a correlation ID attached to every request for tracing.',
        ],
        code: `// Illustrative gateway route config (Kong-style) — the shape matters
// more than the specific product: authn + rate limit + route, in that order
routes:
  - path: /api/v1/claims
    service: claims-service
    plugins:
      - jwt-auth          # reject before it reaches the service
      - rate-limiting:
          minute: 60
          policy: sliding-window
      - correlation-id      # attach a request ID for tracing downstream`,
      },
    ],
  },

  // ─── 5. SERVICE ARCHITECTURE ───
  {
    title: '5. Service Architecture',
    color: 'emerald',
    questions: [
      {
        q: 'Monolith or microservices — and how do you decide when to split?',
        a: 'Start with a modular monolith — a single deployable with clear internal module boundaries (auth, billing, notifications as separate packages/directories with disciplined interfaces between them) — and split a module out into its own service only once a specific, concrete reason forces it: the module needs an independently faster deploy cadence than the rest of the app, a genuinely different scaling profile (a notification worker that needs 50 instances while the core API needs 5), or a different team needs to own its release cycle without coordinating with everyone else. Splitting by default, before any of those pressures exist, buys network calls, distributed tracing, and data-consistency complexity in exchange for nothing.',
        list: [
          'The modular-monolith\'s internal boundaries are what make a later split cheap — if auth already only talks to the rest of the app through a clean interface, extracting it is a deployment change, not a rewrite.',
          'A monorepo (Nx, Turborepo) is a separate axis entirely from this decision — see the interview-prep track\'s microservices/monorepo/microfrontends question for the full breakdown of why a monorepo doesn\'t imply microservices, and vice versa.',
        ],
      },
      {
        q: 'What is a BFF (Backend-for-Frontend), and when do you add one?',
        a: 'A BFF is a thin service that sits between a specific client (web, iOS, a partner API) and the backend services, shaped around exactly what that client needs — aggregating three internal service calls into one response, or reshaping a payload so the mobile app doesn\'t have to do that work on a slow connection. It earns its place once different clients start needing meaningfully different shapes of the same data; before that point, every client hitting the same general-purpose API is simpler and one less thing to deploy and own.',
      },
    ],
  },

  // ─── 6. DATA LAYER ───
  {
    title: '6. Data Layer',
    color: 'orange',
    questions: [
      {
        q: 'SQL or NoSQL — how do you actually decide?',
        a: 'The honest answer is "most core application data is relational, and PostgreSQL is a strong default even at large scale" — reach for NoSQL when a specific access pattern genuinely doesn\'t fit rows and joins, not because "NoSQL scales better" (a myth; a well-indexed, properly-replicated PostgreSQL instance handles far more scale than most systems ever reach).',
        list: [
          '<table class="w-full text-xs border-collapse my-3"><tr><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700"></th><th class="text-left p-2 border-b-2 border-zinc-300 dark:border-zinc-700">Reach for it when</th></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">PostgreSQL (relational)</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Data has real relationships, you need transactions/ACID guarantees, or the access patterns aren\'t fully known yet — the default for core application data.</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">DynamoDB / key-value</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Access is almost always "get by known key," at massive scale, with predictable low-latency reads — a session store, a shopping cart, a feature-flag lookup.</td></tr><tr><td class="p-2 border-b border-zinc-200 dark:border-zinc-800 font-semibold">Elasticsearch</td><td class="p-2 border-b border-zinc-200 dark:border-zinc-800">Full-text search, faceted filtering, relevance ranking — never the source of truth, always synced from the real database.</td></tr><tr><td class="p-2 font-semibold">A vector store (pgvector, etc.)</td><td class="p-2">The product has an AI/RAG feature needing similarity search over embeddings — see the interview-prep AI-tooling question for a worked example.</td></tr></table>',
        ],
      },
      {
        q: 'How do you scale the database as write and read volume grow?',
        a: 'In order of how early you reach for them: indexing correctly first (the single highest-leverage, lowest-cost fix — see the interview-prep track\'s query-regression question for a worked EXPLAIN ANALYZE example), then read replicas (routes the 90%+ read traffic most apps have away from the primary, which stays dedicated to writes), then connection pooling (PgBouncer) so thousands of app-server connections don\'t exhaust the database\'s own connection limit, and only once all of that is saturated, sharding (splitting data across multiple database instances by a key like <code>user_id</code> hash) — a much bigger operational commitment that a system sized like the estimate above rarely justifies from day one.',
        list: [
          'Sharding is presented last deliberately — naming it as the <em>last</em> resort, after indexing/replicas/pooling, is a stronger signal than jumping straight to "shard the database," which is what a less experienced answer does.',
          'Once sharded, cross-shard queries and transactions become genuinely hard — a strong follow-up to have ready is naming that trade-off explicitly rather than presenting sharding as a free scaling lever.',
        ],
      },
    ],
  },

  // ─── 7. CACHING STRATEGY ───
  {
    title: '7. Caching Strategy',
    color: 'pink',
    diagram: {
      title: 'The full-stack caching waterfall',
      svg: `<svg viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px">
  <rect x="10" y="10" width="780" height="180" rx="16" fill="#ec4899" opacity="0.04"/>
  ${['Browser cache','CDN edge','API Gateway','Redis (app)','DB query cache'].map((label,i)=>`
  <rect x="${30 + i*152}" y="60" width="132" height="60" rx="10" fill="#ec4899" opacity="0.12" stroke="#ec4899" stroke-width="1.5"/>
  <text x="${96 + i*152}" y="95" text-anchor="middle" fill="#ec4899" font-size="12" font-weight="bold">${label}</text>`).join('')}
  ${[0,1,2,3].map(i=>`<line x1="${162 + i*152}" y1="90" x2="${182 + i*152}" y2="90" stroke="#f472b6" stroke-width="2" marker-end="url(#arrowP)"/>`).join('')}
  <text x="400" y="35" text-anchor="middle" fill="#ec4899" font-size="12" opacity="0.7">A request only reaches the DB if every layer to its left misses</text>
  <text x="400" y="155" text-anchor="middle" fill="#ec4899" font-size="11" opacity="0.6">Each hop that hits saves a network round-trip and a unit of backend load</text>
  <defs><marker id="arrowP" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#f472b6"/></marker></defs>
</svg>`,
    },
    questions: [
      {
        q: 'What does caching look like across the whole stack, end to end?',
        a: 'The strongest way to answer this is the waterfall above: a request only reaches the database once it has missed at every faster layer in front of it, and each layer exists because it\'s progressively cheaper and closer to the user than the one behind it. Browser cache and the CDN handle anything static or public; the API Gateway can cache whole responses for cacheable, non-personalized endpoints; Redis sits in front of the database for computed aggregates, session data, and anything read far more often than it changes; and the database\'s own query cache/shared buffers are the last line before disk I/O.',
        list: [
          '<strong>Invalidation is the actually hard part</strong> — a short TTL is the simple, safe default (bounded staleness, no explicit invalidation logic); explicit invalidation-on-write is fresher but means finding every code path that changes the underlying data.',
          '<strong>Cache stampede</strong> — when a hot key expires, many concurrent requests can miss simultaneously and hammer the database at once; fix with a lock so only one request repopulates the cache, or <code>stale-while-revalidate</code> so everyone gets the stale value while one background request refreshes it.',
          'See the interview-prep Databases track for the cache-aside / read-through / write-through / write-behind comparison in full depth.',
        ],
      },
    ],
  },

  // ─── 8. ASYNC & MESSAGING ───
  {
    title: '8. Async & Messaging',
    color: 'slate',
    questions: [
      {
        q: 'What moves off the request/response path, and how?',
        a: 'Anything that doesn\'t need to complete before the user gets a response — sending a notification, generating a document, updating a search index, calling a slow third-party API — goes through a queue instead of holding an HTTP request open. The producer publishes an event and returns immediately; one or more consumers process it independently, on their own schedule, and a failure in one consumer never blocks the request that triggered it or any other consumer.',
        list: [
          '<strong>Queue vs. pub/sub:</strong> a queue (SQS) is point-to-point — one worker per message, good for distributing units of work across a pool; pub/sub (SNS, or a topic generally) is one-to-many — good for "several unrelated systems all need to react to this event." They combine constantly: publish once to a topic, fan out to several queues, one per consumer.',
          '<strong>Failure handling:</strong> a dead-letter queue catches messages that exceed their retry limit, so they stop blocking the main queue instead of being silently dropped — see the interview-prep Architecture track for the full DLQ/retry/backoff treatment.',
        ],
      },
      {
        q: 'How do you keep data consistent across services without a distributed transaction?',
        a: 'The Saga pattern: a sequence of local transactions, one per service, where every step has a matching compensating transaction that undoes its work if a later step fails. Placing an order might be create-order → charge-payment → reserve-inventory → schedule-shipping; if inventory reservation fails, you don\'t roll back a database transaction spanning services (there isn\'t one) — you run compensations forward, refunding the payment and cancelling the order. The interview-prep System Design track has the full choreography-vs-orchestration breakdown and the Transactional Outbox pattern that makes the first step of a saga reliably publish its event.',
      },
    ],
  },

  // ─── 9. DEPLOYMENT & INFRASTRUCTURE ───
  {
    title: '9. Deployment & Infrastructure',
    color: 'teal',
    questions: [
      {
        q: 'What does the path from a merged PR to production look like?',
        a: 'Code is packaged into a container image, pushed to a registry, and deployed by an orchestrator (ECS or Kubernetes) that handles scheduling, health checks, and restarts — with the infrastructure itself defined as code (Terraform or CloudFormation) so an environment can be reproduced or torn down deterministically rather than hand-configured. The pipeline promotes a build through environments in order — dev → staging → production — gated by automated tests at minimum, and often a manual approval before the final production step.',
        list: [
          '<strong>Rollout strategy:</strong> canary (a small % of traffic first, ramp up while watching error rate and latency against a control group) for anything with real user-facing risk; blue-green when instant rollback matters more than gradual exposure; rolling updates as the default for routine, lower-risk deploys. Full comparison and trade-offs in the interview-prep Cloud track.',
          '<strong>Why this matters at "millions of users" scale specifically:</strong> a bad deploy at this scale isn\'t a minor incident — canary/staged rollout is what turns "one engineer\'s mistake" into "a blip affecting 1% of traffic for two minutes" instead of an outage.',
        ],
      },
    ],
  },

  // ─── 10. RELIABILITY & OBSERVABILITY ───
  {
    title: '10. Reliability & Observability',
    color: 'amber',
    questions: [
      {
        q: 'How do you design for things going wrong, not just for the happy path?',
        a: 'Every outbound call between services gets the same layered defense: a timeout so nothing waits forever, retries with backoff and jitter for transient failures, a circuit breaker that stops calling a dependency entirely once it\'s clearly down, and a bulkhead that caps how much of your own capacity any single dependency can consume — each one covered in full depth, with code, in the interview-prep Architecture & Reliability track. For availability specifically: Multi-AZ (redundant infrastructure across physically separate datacenters in the same region, with automatic failover) covers the failure mode that actually happens most often; multi-region is reserved for when a full-region outage is genuinely unacceptable for the business, given the real cost and consistency trade-offs it adds.',
        list: [
          '<strong>SLOs and error budgets</strong> turn "how reliable should this be" from a vague aspiration into a number the whole team is accountable to, and a concrete trigger for when to prioritize reliability work over new features. Full breakdown, with the SLA/SLO/SLI distinction, in the interview-prep track.',
          '<strong>Golden signals</strong> (latency, traffic, errors, saturation) are what every service\'s dashboard should be built around — generic infrastructure metrics (CPU, memory) are useful for debugging but rarely tell you a user is actually affected.',
        ],
      },
      {
        q: 'How do you know something is wrong before a user reports it?',
        a: 'Three complementary signals, not one: logs for deep-diving a specific incident after the fact, metrics for cheap, always-on alerting on trends, and distributed traces for following one slow or failed request across every service it touched. A trace context (trace ID + parent span ID) generated at the very first entry point and propagated on every outbound call — as an HTTP header, or in a message\'s metadata for async paths — is what lets the full picture reassemble later even though no single service ever saw the whole request. The interview-prep Cloud track has the full mechanics, including the <code>traceparent</code> header format and how logs, metrics, and traces tie together via a shared correlation ID.',
      },
    ],
  },

  // ─── 11. SECURITY ───
  {
    title: '11. Security',
    color: 'red',
    questions: [
      {
        q: 'What does defense-in-depth look like for a system at this scale?',
        a: 'No single control is trusted to be the only thing standing between an attacker and the data — each layer assumes the ones around it could fail. Encryption in transit (TLS everywhere, including internal service-to-service traffic via a service mesh\'s mTLS) and at rest (database and object storage encryption, keys managed by a dedicated service like KMS, never embedded in application config); secrets in a dedicated manager, never in environment variables checked into source or baked into an image; least-privilege IAM so a compromised service can only reach what it specifically needs, not the whole account; a WAF at the edge filtering common attack patterns before they reach the application; and rate limiting (covered above) doing double duty as both a reliability control and an abuse/credential-stuffing defense.',
        list: [
          'Input validation and output encoding at every trust boundary — never trust that a request reaching an internal service has already been validated by whatever called it.',
          'For a system handling sensitive data specifically (health, financial, PII): audit logging on every access to that data, not just on writes — "who looked at this record and when" is often a compliance requirement, not an optional nice-to-have.',
        ],
      },
    ],
  },

  // ─── 12. PUTTING IT ALL TOGETHER ───
  {
    title: '12. Putting It All Together',
    color: 'violet',
    diagram: {
      title: 'End-to-end architecture',
      svg: `<svg viewBox="0 0 820 380" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:820px">
  <rect x="10" y="10" width="800" height="360" rx="16" fill="#8b5cf6" opacity="0.04"/>
  <rect x="30" y="30" width="140" height="44" rx="8" fill="#8b5cf6" opacity="0.15" stroke="#8b5cf6" stroke-width="1.5"/>
  <text x="100" y="57" text-anchor="middle" fill="#8b5cf6" font-size="12" font-weight="bold">Web / Mobile</text>
  <rect x="30" y="100" width="140" height="40" rx="8" fill="#06b6d4" opacity="0.15" stroke="#06b6d4" stroke-width="1.5"/>
  <text x="100" y="125" text-anchor="middle" fill="#06b6d4" font-size="11" font-weight="bold">CDN / Edge</text>
  <rect x="30" y="165" width="140" height="40" rx="8" fill="#06b6d4" opacity="0.15" stroke="#06b6d4" stroke-width="1.5"/>
  <text x="100" y="190" text-anchor="middle" fill="#06b6d4" font-size="11" font-weight="bold">API Gateway</text>
  <rect x="230" y="120" width="130" height="40" rx="8" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="1.5"/>
  <text x="295" y="145" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Service A</text>
  <rect x="230" y="175" width="130" height="40" rx="8" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="1.5"/>
  <text x="295" y="200" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Service B</text>
  <rect x="230" y="230" width="130" height="40" rx="8" fill="#10b981" opacity="0.15" stroke="#10b981" stroke-width="1.5"/>
  <text x="295" y="255" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">Service C</text>
  <rect x="420" y="90" width="130" height="40" rx="8" fill="#ec4899" opacity="0.15" stroke="#ec4899" stroke-width="1.5"/>
  <text x="485" y="115" text-anchor="middle" fill="#ec4899" font-size="11" font-weight="bold">Redis cache</text>
  <rect x="420" y="150" width="130" height="40" rx="8" fill="#f97316" opacity="0.15" stroke="#f97316" stroke-width="1.5"/>
  <text x="485" y="175" text-anchor="middle" fill="#f97316" font-size="11" font-weight="bold">Postgres primary</text>
  <rect x="420" y="205" width="130" height="40" rx="8" fill="#f97316" opacity="0.15" stroke="#f97316" stroke-width="1.5"/>
  <text x="485" y="230" text-anchor="middle" fill="#f97316" font-size="11" font-weight="bold">Read replicas</text>
  <rect x="420" y="260" width="130" height="40" rx="8" fill="#64748b" opacity="0.15" stroke="#64748b" stroke-width="1.5"/>
  <text x="485" y="285" text-anchor="middle" fill="#64748b" font-size="11" font-weight="bold">Queue (SQS)</text>
  <rect x="610" y="260" width="150" height="40" rx="8" fill="#64748b" opacity="0.15" stroke="#64748b" stroke-width="1.5"/>
  <text x="685" y="285" text-anchor="middle" fill="#64748b" font-size="11" font-weight="bold">Async workers</text>
  <rect x="600" y="30" width="170" height="90" rx="8" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="685" y="50" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">Observability</text>
  <text x="685" y="70" text-anchor="middle" fill="#f59e0b" font-size="10">logs · metrics</text>
  <text x="685" y="86" text-anchor="middle" fill="#f59e0b" font-size="10">traces · alerts</text>
  <text x="685" y="105" text-anchor="middle" fill="#f59e0b" font-size="10">(every layer reports here)</text>
  <line x1="100" y1="74" x2="100" y2="100" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrowE)"/>
  <line x1="100" y1="140" x2="100" y2="165" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrowE)"/>
  <line x1="170" y1="185" x2="230" y2="140" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrowE)"/>
  <line x1="170" y1="185" x2="230" y2="195" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrowE)"/>
  <line x1="170" y1="185" x2="230" y2="250" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrowE)"/>
  <line x1="360" y1="140" x2="420" y2="115" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#arrowE)"/>
  <line x1="360" y1="150" x2="420" y2="175" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#arrowE)"/>
  <line x1="360" y1="240" x2="420" y2="280" stroke="#a78bfa" stroke-width="1.5" marker-end="url(#arrowE)"/>
  <line x1="550" y1="280" x2="610" y2="280" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrowE)"/>
  <line x1="485" y1="190" x2="485" y2="205" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arrowE)"/>
  <defs><marker id="arrowE" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#a78bfa"/></marker></defs>
</svg>`,
    },
    questions: [
      {
        q: 'How does everything above fit together into one diagram?',
        a: 'The diagram above is the answer this whole design converges on: client traffic hits the CDN and gateway first (edge, auth, rate limiting), fans out to independently-scalable services behind it, each service reads through Redis before Postgres and writes to Postgres\'s primary with replicas absorbing read load, anything non-blocking goes through a queue to async workers, and every single layer — client through worker — reports into one observability stack rather than each having its own island of logs no one correlates.',
        list: [
          'Notice what\'s <em>not</em> in the diagram at this scale: no sharded database, no service mesh, no multi-region active-active setup. Naming what you deliberately left out — and why — is as strong a signal as naming what you included.',
        ],
      },
      {
        q: 'What would you build for an MVP vs. design in from day one?',
        a: 'Some things are genuinely fine to defer because retrofitting them later is a bounded, well-understood amount of work: read replicas, sharding, a service mesh, and multi-region can all be added once real traffic proves they\'re needed, without a rewrite. Other things are expensive or impossible to retrofit cleanly, and belong in the design from day one even for an MVP: the service boundaries and API contracts (a bad boundary calcifies fast once other things depend on it), auth and the security posture around sensitive data (retrofitting security is where breaches come from), and basic observability (you cannot debug production problems on a system you were never watching — this one is cheap to add early and very expensive to be missing during an incident).',
      },
      {
        q: 'How do you pace this as a 30–45 minute interview answer?',
        a: 'Roughly: 5 minutes clarifying requirements and stating the capacity estimate (section 1 above), 10–15 minutes on the high-level architecture — walk left to right through client → edge → services → data, at a level where every box gets one sentence, not a paragraph — then let the interviewer steer the remaining 15–20 minutes into 2–3 components they want depth on (this is usually caching, the database, or reliability), and close with 5 minutes on trade-offs: what you\'d cut for an MVP, and the one or two things you\'re least confident about and would want to validate with load testing before shipping. Ending on that last, honest note — naming your own uncertainty — reads as seniority, not weakness.',
      },
    ],
  },
];
