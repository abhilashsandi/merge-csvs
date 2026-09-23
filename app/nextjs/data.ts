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
  // ─── 1. APP ROUTER FUNDAMENTALS ───
  {
    title: '1. App Router Fundamentals',
    color: 'slate',
    intro: 'The App Router (introduced in Next.js 13, now the default) is built on React Server Components and a file-system convention for routing, layouts, and loading/error states.',
    questions: [
      {
        q: 'What do layout.tsx, page.tsx, loading.tsx, and error.tsx each control?',
        a: 'Each is a special file convention that Next.js wires into the route tree automatically — no manual routing configuration.',
        list: [
          '**page.tsx:** The unique UI for a route segment — makes the route publicly accessible.',
          '**layout.tsx:** Shared UI that wraps a segment and its children. Persists across navigations (does not re-render/reset state) and can be nested.',
          '**loading.tsx:** An instant loading UI, automatically wrapped in a React Suspense boundary around the segment below it.',
          '**error.tsx:** A client-boundary error UI, automatically wrapped in a React Error Boundary. Catches errors in the segment below it, not in the layout above it.',
          '**not-found.tsx:** Rendered when notFound() is called or a route segment cannot be matched.',
        ],
        hint: "A classic follow-up: 'why doesn't error.tsx catch errors thrown in its own layout.tsx?' — because the error boundary wraps the segment's children, not its parent layout, by design.",
      },
      {
        q: 'What is the difference between a Server Component and a Client Component?',
        a: 'Server Components (the default in the App Router) render entirely on the server and send HTML + a serialized description to the client — zero JavaScript shipped for that component. Client Components (opted into with the "use client" directive) render on the server for the initial HTML too, but also ship JS and hydrate in the browser.',
        list: [
          '**Server Components:** Can be async, can access backend resources directly (DB, filesystem, secrets), cannot use useState/useEffect/browser APIs or event handlers.',
          '**Client Components:** Required for interactivity — state, effects, event listeners, browser-only APIs (localStorage, window).',
          '**"use client" is a boundary, not a label per-file:** once a component is a Client Component, every component it imports becomes part of that client bundle too (unless passed in as children from a Server Component).',
        ],
        code: `// app/page.tsx — Server Component by default, can be async
export default async function Page() {
  const data = await fetch('https://api.example.com/products').then(r => r.json());
  return <ProductList products={data} />;
}

// app/ProductList.tsx — needs interactivity, opts into the client
'use client';
export function ProductList({ products }) {
  const [selected, setSelected] = useState(null);
  return products.map((p) => <button onClick={() => setSelected(p.id)}>{p.title}</button>);
}`,
      },
      {
        q: 'How does composing Server and Client Components together actually work?',
        a: 'A Client Component can never directly import a Server Component (since everything it imports gets bundled for the client) — but a Server Component CAN be passed to a Client Component as children/props, because the Server Component is rendered on the server first and its output is passed down as serialized data.',
        code: `// ClientWrapper.tsx
'use client';
export function ClientWrapper({ children }) {
  const [open, setOpen] = useState(false);
  return <div onClick={() => setOpen(!open)}>{open && children}</div>;
}

// page.tsx — Server Component, still async, still zero-JS for its own content
export default async function Page() {
  const data = await getData();
  return (
    <ClientWrapper>
      {/* This is still rendered on the server — "slotted in" as children */}
      <ExpensiveServerRenderedReport data={data} />
    </ClientWrapper>
  );
}`,
        hint: 'This "slotting" pattern is the standard answer to "how do you keep a component server-rendered while still nesting it inside an interactive client component?"',
      },
    ],
  },

  // ─── 2. RENDERING STRATEGIES ───
  {
    title: '2. Rendering Strategies',
    color: 'indigo',
    intro: 'Next.js supports four rendering strategies per route, and the App Router lets you mix them at a granular level rather than picking one globally.',
    questions: [
      {
        q: 'Explain SSR, SSG, ISR, and CSR — and when you would choose each.',
        a: 'They differ in when the HTML is generated and how fresh the data is.',
        list: [
          '**SSG (Static Site Generation):** HTML generated at build time. Fastest possible response (served from CDN), but content is only as fresh as the last build. Best for marketing pages, docs, blog posts.',
          '**SSR (Server-Side Rendering):** HTML generated per-request on the server. Always fresh, but adds server compute + latency per request. Best for personalized/authenticated pages that need real-time data.',
          '**ISR (Incremental Static Regeneration):** Static like SSG, but pages are regenerated in the background after a revalidate interval, without a full rebuild. Best for content that changes occasionally (product catalogs, news).',
          '**CSR (Client-Side Rendering):** Empty/minimal HTML shell, data fetched and rendered in the browser. Best for highly interactive, non-SEO-critical dashboards behind auth.',
        ],
        hint: 'In the App Router, these are no longer a single per-page setting — a route is static by default until it uses something dynamic (cookies(), headers(), a fetch with cache: "no-store", etc.), at which point Next.js opts that route into dynamic rendering automatically.',
      },
      {
        q: 'How do you configure ISR in the App Router?',
        a: 'Via the revalidate option on a fetch call, or a route-segment config export.',
        code: `// Per-fetch: revalidate every 60 seconds
const res = await fetch('https://api.example.com/products', {
  next: { revalidate: 60 },
});

// Per-route-segment: applies to the whole route
export const revalidate = 60;

// On-demand revalidation from a Server Action / Route Handler,
// instead of waiting for the interval
import { revalidatePath, revalidateTag } from 'next/cache';
revalidatePath('/products');
revalidateTag('products');`,
        hint: "revalidateTag is usually preferred over revalidatePath because it can invalidate a specific piece of cached data used across many different routes, without having to know or list every path it appears on.",
      },
      {
        q: 'What is Partial Prerendering (PPR)?',
        a: 'A rendering model that combines static and dynamic in a single route response: the static shell (everything not depending on request-time data) is prerendered and served instantly from the edge, while dynamic parts are streamed in via Suspense boundaries.',
        list: [
          'The static shell is served immediately — perceived load time matches a fully static page.',
          'Dynamic holes (e.g. a personalized "Welcome back, {user}" or a cart badge) stream in once resolved, without blocking the rest of the page.',
          'This is what lets a single route be both "instant" and "personalized" — historically you had to fully pick SSG or SSR for a whole route.',
        ],
      },
    ],
  },

  // ─── 3. DATA FETCHING & CACHING ───
  {
    title: '3. Data Fetching & Caching',
    color: 'emerald',
    intro: 'Next.js extends the native fetch API with its own caching layer, and the caching model has several distinct layers that are frequently confused in interviews.',
    questions: [
      {
        q: 'Name the distinct caching layers in Next.js and what each one caches.',
        a: 'There are four, and mixing them up is the most common interview stumble.',
        list: [
          '**Request Memoization:** Within a single render pass, calling fetch() with the same URL/options multiple times only hits the network once — React deduplicates it automatically. Lasts only for that one render.',
          '**Data Cache:** Persists fetch() results across requests and deployments (server-side, like a persistent HTTP cache). Controlled by the revalidate/cache options.',
          '**Full Route Cache:** Caches the rendered HTML + RSC payload for a route at build time, for static routes.',
          '**Router Cache (client-side):** An in-memory cache in the browser of visited route segments, so back/forward navigation is instant. Cleared on a full page reload or after a mutation with revalidatePath/revalidateTag.',
        ],
        hint: "If asked 'why did my data not update after I changed it in the database,' the answer is almost always: you hit the Data Cache with a default/long revalidate and need revalidateTag, or you need cache: 'no-store' for that specific fetch.",
      },
      {
        q: 'What does a Route Handler (app/api/.../route.ts) give you that a Server Action does not, and vice versa?',
        a: 'Both run exclusively on the server, but they serve different purposes.',
        list: [
          '**Route Handlers:** A real HTTP endpoint (GET/POST/etc.) — needed for webhooks, a public API consumed by non-React clients, or anything that must be a URL.',
          '**Server Actions:** An async function marked "use server", callable directly from a component (including from a <form action={...}>) without manually wiring up a fetch call. Automatically get progressive enhancement — the form still works with JS disabled.',
        ],
        code: `// app/actions.ts
'use server';
export async function createTodo(formData: FormData) {
  const text = formData.get('text');
  await db.todos.insert({ text });
  revalidatePath('/todos');
}

// app/todos/page.tsx — no client JS needed to submit this form
<form action={createTodo}>
  <input name="text" />
  <button type="submit">Add</button>
</form>`,
      },
      {
        q: 'How do generateStaticParams and dynamicParams interact?',
        a: 'generateStaticParams tells Next.js which dynamic segment values to prerender at build time (like getStaticPaths in the Pages Router). dynamicParams controls what happens for a value NOT in that list.',
        code: `// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const products = await getTopProducts();
  return products.map((p) => ({ id: p.id })); // prerender these at build time
}

// Default true: an unlisted id is rendered on-demand (SSR) the first time
// it's requested, then cached like the rest.
// Set to false to 404 instead for any id not returned above.
export const dynamicParams = false;`,
      },
    ],
  },

  // ─── 4. ROUTING & NAVIGATION ───
  {
    title: '4. Routing & Navigation',
    color: 'amber',
    questions: [
      {
        q: 'What are parallel routes and intercepting routes for?',
        a: 'Both are advanced App Router conventions for rendering more than one thing at once from a single URL.',
        list: [
          '**Parallel routes (@slot folders):** Render multiple independent pages in the same layout simultaneously — e.g. a dashboard with @analytics and @team slots that each have their own loading/error state and can navigate independently.',
          '**Intercepting routes ((.) / (..) / (...) folders):** "Intercept" a route to show it in the current layout (e.g. a photo opening in a modal over the feed) while still being a real, shareable, bookmarkable URL if the user navigates to it directly or refreshes.',
        ],
        hint: "The canonical example is Instagram's photo modal: clicking a photo from the feed opens it in a modal (intercepted), but pasting that same URL in a new tab loads the full standalone photo page.",
      },
      {
        q: 'How does next/link prefetching work, and how does it differ from next/navigation\'s router.push?',
        a: '<Link> automatically prefetches the linked route\'s code and, for static routes, its data, when it scrolls into the viewport — so navigation feels instant. router.push() (from useRouter, a Client Component hook) is used for programmatic navigation and does not prefetch by default the way <Link> does.',
        hint: 'Prefer <Link> whenever the destination is known at render time; reach for the imperative router only when navigation depends on an event (e.g. after a form submits successfully).',
      },
      {
        q: 'What is the difference between useRouter, usePathname, and useSearchParams?',
        a: 'All three are Client-Component-only hooks from next/navigation for reading/reacting to routing state.',
        list: [
          '**useRouter():** Imperative navigation — router.push(), router.replace(), router.refresh(), router.back().',
          '**usePathname():** Returns the current URL\'s pathname as a plain string — commonly used to compute an "active" nav link.',
          '**useSearchParams():** Returns a read-only URLSearchParams for the current URL\'s query string. Reading it opts the component into client-side rendering for that part of the tree, which is why Next.js requires wrapping it in a Suspense boundary.',
        ],
      },
    ],
  },

  // ─── 5. SERVER ACTIONS & MUTATIONS ───
  {
    title: '5. Server Actions & Mutations',
    color: 'rose',
    questions: [
      {
        q: 'How do useFormStatus and useFormState (now useActionState) improve a Server Action-backed form?',
        a: 'They give a Client Component visibility into an in-flight/completed Server Action without manually wiring loading state.',
        code: `'use client';
import { useActionState } from 'react';
import { createTodo } from './actions';

function TodoForm() {
  const [state, formAction, isPending] = useActionState(createTodo, { error: null });
  return (
    <form action={formAction}>
      <input name="text" />
      <button disabled={isPending}>{isPending ? 'Saving…' : 'Add'}</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}`,
        hint: 'useFormStatus must be called inside a component nested underneath the <form>, not in the same component that renders the <form> itself — it reads from React context set up by the nearest parent form.',
      },
      {
        q: 'Why should Server Actions always re-validate input and re-check authorization, even though the "use server" boundary looks safe?',
        a: 'A Server Action compiles to a public HTTP endpoint under the hood (Next.js creates a POST route for it) — anyone can call it directly with a crafted request, bypassing your UI entirely. The client-side call is a convenience, not a security boundary.',
        list: [
          'Always re-validate the shape/type of formData on the server, the same as you would for any API route.',
          'Always re-check that the current session/user is authorized for the specific mutation being performed — never trust an id passed from the client without checking ownership.',
        ],
      },
    ],
  },

  // ─── 6. PERFORMANCE & OPTIMIZATION ───
  {
    title: '6. Performance & Optimization',
    color: 'cyan',
    questions: [
      {
        q: 'What does next/image automatically handle that a plain <img> does not?',
        a: 'Automatic responsive sizing (srcset), lazy loading below the fold, modern format conversion (WebP/AVIF) served from an on-demand optimization endpoint, and preventing layout shift by requiring width/height (or fill) up front.',
        code: `import Image from 'next/image';

<Image
  src="/hero.png"
  alt="Hero"
  width={800}
  height={400}
  priority // disables lazy-loading for above-the-fold images (LCP)
/>`,
        hint: 'The priority prop is the answer to "how do you optimize your Largest Contentful Paint image in Next.js" — it preloads that specific image and skips lazy-loading.',
      },
      {
        q: 'How does streaming with Suspense improve perceived performance over a single blocking server render?',
        a: 'Without streaming, the whole page waits for the slowest data dependency before sending any HTML. With Suspense boundaries around slow parts, Next.js can send the fast/static shell immediately and stream in the slower chunks as they resolve, each as its own HTML chunk over the same connection.',
        code: `export default function Page() {
  return (
    <>
      <Header /> {/* renders immediately */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <SlowReviews /> {/* streams in once its fetch resolves */}
      </Suspense>
    </>
  );
}`,
      },
      {
        q: 'What is the purpose of next/font, and why is it better than a <link> to Google Fonts in the <head>?',
        a: 'next/font downloads and self-hosts font files at build time, removing the extra network round-trip to a third-party font CDN at request time — improving both privacy (no request leaked to Google) and performance (no render-blocking external request, automatic font-display: swap to avoid layout shift from font-loading).',
      },
    ],
  },

  // ─── 7. MIDDLEWARE, AUTH & DEPLOYMENT ───
  {
    title: '7. Middleware, Auth & Deployment',
    color: 'violet',
    questions: [
      {
        q: 'What runs in Next.js Middleware, and what are its constraints?',
        a: 'Middleware (middleware.ts at the project root) runs on the Edge Runtime before a request completes — before a page or Route Handler renders. Commonly used for auth redirects, A/B test cookie assignment, geolocation-based rewrites, and header manipulation.',
        list: [
          "Runs on the Edge Runtime, a restricted subset of Node's APIs (no fs, no arbitrary native modules) — keep it fast and lightweight.",
          "Executes for every matching request, so heavy logic here adds latency to every page it's configured for — scope it with the matcher config.",
          'Cannot directly query most traditional databases (no raw TCP sockets in most Edge runtimes) — typically used for auth-cookie checks, not full authorization logic.',
        ],
        code: `// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'], // only run for these paths
};`,
      },
      {
        q: 'What is the Edge Runtime vs the Node.js runtime for a route, and how do you choose?',
        a: "Route Handlers and pages can opt into either runtime. The Node.js runtime supports the full Node API surface (most npm packages, fs, native modules) but has a colder start and runs from a specific region. The Edge Runtime is a lighter, V8-isolate-based environment that starts near-instantly and runs geographically close to the user, at the cost of API compatibility (no fs, limited npm package support).",
        code: `export const runtime = 'edge'; // or 'nodejs' (default)`,
        hint: 'Choose Edge for latency-sensitive, lightweight logic (auth checks, redirects, simple API responses); choose Node.js when you need a database driver, heavy npm dependency, or full Node API access.',
      },
    ],
  },
];

/* ─────────────────────────────────────
   SECTION QUIZZES
   ───────────────────────────────────── */
export const sectionQuizzes: Record<string, QuizQuestion[]> = {
  '1. App Router Fundamentals': [
    {
      question: 'Can a Client Component directly import a Server Component?',
      options: [
        'Yes, always',
        'No — but a Server Component can be passed to a Client Component as children/props',
        'Only if it uses async/await',
        'Only inside a layout.tsx',
      ],
      correctIndex: 1,
      explanation: 'Importing pulls the Server Component into the client bundle, which is not allowed. Passing it down as children (the "slot" pattern) works because it is rendered on the server first.',
    },
  ],
  '2. Rendering Strategies': [
    {
      question: 'What triggers a route to opt into dynamic rendering in the App Router by default?',
      options: [
        'Using any React hook',
        "Using dynamic data APIs like cookies(), headers(), or a fetch with cache: 'no-store'",
        'Having more than one page.tsx',
        'Using next/image',
      ],
      correctIndex: 1,
      explanation: 'A route is static until something in it explicitly requires request-time data — at that point Next.js automatically renders it dynamically per-request.',
    },
  ],
  '3. Data Fetching & Caching': [
    {
      question: 'Which cache layer should you invalidate to reflect a database change across every page that uses that data, without knowing every URL it appears on?',
      options: ['Router Cache', 'Request Memoization', 'revalidateTag on the Data Cache', 'Full Route Cache only'],
      correctIndex: 2,
      explanation: 'revalidateTag invalidates every cached fetch tagged with that value, regardless of which route(s) fetched it — more targeted than knowing and calling revalidatePath for every affected page.',
    },
  ],
  '5. Server Actions & Mutations': [
    {
      question: 'Why must a Server Action re-validate input and authorization on the server, even though it is only called from your own UI?',
      options: [
        "It doesn't need to — the 'use server' directive handles it",
        'A Server Action is compiled to a real HTTP endpoint that can be called directly, bypassing the UI',
        'Only for performance reasons',
        'Only if TypeScript is not used',
      ],
      correctIndex: 1,
      explanation: "'use server' marks where the function runs, not who is allowed to call it. It becomes a public POST endpoint, so it needs the same validation/authorization as any API route.",
    },
  ],
};

export const consoleExamples: {
  sectionTitle: string;
  title: string;
  code: string;
  output: string[];
}[] = [
  {
    sectionTitle: '3. Data Fetching & Caching',
    title: 'Request memoization in action',
    code: `// Called from three different Server Components in the same render pass
async function getUser(id: string) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`);
  return res.json();
}

// Header.tsx, Sidebar.tsx, and Page.tsx all call getUser('42')`,
    output: [
      '> Rendering Header, Sidebar, and Page for this request...',
      "> fetch('.../users/42') — network request #1 (cache MISS)",
      "> fetch('.../users/42') — deduplicated, reused from request #1 (no network call)",
      "> fetch('.../users/42') — deduplicated, reused from request #1 (no network call)",
      '// Only one actual network request for this render, regardless of how',
      '// many components call the same fetch with the same URL/options.',
    ],
  },
];

export const sectionDiagrams: Record<string, { title: string; svg: string }> = {};
