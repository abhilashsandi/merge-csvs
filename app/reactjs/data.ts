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
  // ─── 1. REACT + TYPESCRIPT CORE ───
  {
    title: "1. React + TypeScript Core",
    color: "blue",
    questions: [
      {
        q: "How do you type a reusable React component with generics?",
        a: "Excellent for dropdowns, tables, and lists. It narrows `T`, avoids `any`, and keeps props completely reusable.",
        hint: "Interviewers want to see you avoid `any`. Show them you understand how generics flow through component props and infer types at the call site.",
        code: `type Option<T> = { label: string; value: T };

type SelectProps<T> = {
  options: Option<T>[];
  value: T | null;
  onChange: (v: T) => void;
};

function Select<T extends string | number>({
  options, value, onChange
}: SelectProps<T>) {
  return (
    <select value={value ?? ''} onChange={e => onChange(e.target.value as T)}>
      <option value="">--</option>
      {options.map(o => (
        <option key={String(o.value)} value={String(o.value)}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// Usage — TypeScript infers T as 'admin' | 'user'
<Select
  options={[{ label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }]}
  value="admin"
  onChange={(v) => console.log(v)} // v is 'admin' | 'user'
/>`,
      },
      {
        q: "React.FC vs plain function — which do you prefer and why?",
        a: "Plain function declarations are preferred in modern React + TypeScript.",
        hint: "This tests whether you follow modern best practices. React.FC was deprecated for implicit children typing. Show you know the tradeoffs.",
        code: `// ❌ Avoid — React.FC adds implicit 'children' prop (removed in React 18 types)
const Button: React.FC<{ label: string }> = ({ label }) => <button>{label}</button>;

// ✅ Prefer — explicit, composable, supports generics naturally
function Button({ label }: { label: string }) {
  return <button>{label}</button>;
}

// ✅ With children explicitly typed
type CardProps = {
  title: string;
  children: React.ReactNode; // explicitly opt-in
};

function Card({ title, children }: CardProps) {
  return <div><h2>{title}</h2>{children}</div>;
}`,
      },
      {
        q: "How do you use discriminated unions for component props?",
        a: "Discriminated unions let TypeScript narrow prop types based on a shared literal field, making impossible states unrepresentable.",
        hint: "This is a senior-level pattern. Show you can model component APIs that prevent invalid prop combinations at compile time.",
        code: `// The 'variant' field is the discriminant
type AlertProps =
  | { variant: 'success'; message: string }
  | { variant: 'error'; message: string; retryAction: () => void }
  | { variant: 'loading' }; // no message needed

function Alert(props: AlertProps) {
  switch (props.variant) {
    case 'success':
      return <div className="green">{props.message}</div>;
    case 'error':
      return (
        <div className="red">
          {props.message}
          <button onClick={props.retryAction}>Retry</button>
        </div>
      );
    case 'loading':
      return <div>Loading...</div>;
  }
}

// ✅ TypeScript error if you pass retryAction to 'success' variant
// ✅ TypeScript error if you forget retryAction on 'error' variant`,
      },
      {
        q: "How do you type forwardRef with generics?",
        a: "forwardRef breaks generic inference. The workaround is to cast or use a wrapper pattern.",
        hint: "This catches many candidates off guard. The key insight is that forwardRef's type signature doesn't preserve generics, so you need a pattern to work around it.",
        code: `import { forwardRef, useRef } from 'react';

// Pattern: assertion to recover generics
type ListProps<T> = { items: T[]; renderItem: (item: T) => React.ReactNode };

function ListInner<T>(props: ListProps<T> & { ref?: React.Ref<HTMLUListElement> }) {
  return (
    <ul ref={props.ref}>
      {props.items.map((item, i) => <li key={i}>{props.renderItem(item)}</li>)}
    </ul>
  );
}

// React 19+ supports ref as a prop directly — no forwardRef needed!
// For React 18, use the module augmentation or casting pattern.`,
      },
      {
        q: "Explain ComponentProps, ComponentPropsWithRef, and satisfies.",
        a: "These utility types let you extract the props of any component or HTML element, enabling powerful composition patterns.",
        code: `import { ComponentProps } from 'react';

// Extract props from native elements
type InputProps = ComponentProps<'input'>;
// Now InputProps has value, onChange, placeholder, etc.

// Extract props from custom components
type ButtonProps = ComponentProps<typeof Button>;

// 'satisfies' (TS 5+) — validates without widening
const config = {
  theme: 'dark',
  size: 'lg',
} satisfies Record<string, string>;
// config.theme is 'dark' (literal), not string`,
        hint: "ComponentProps<typeof X> is crucial for building wrapper components. Show you use it instead of duplicating prop interfaces.",
      },
    ],
  },

  // ─── 2. HOOKS DEEP DIVE ───
  {
    title: "2. Hooks Deep Dive",
    color: "indigo",
    diagram: {
      title: "React Component Lifecycle (Hooks Edition)",
      svg: `<svg viewBox="0 0 800 320" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:800px">
  <rect x="10" y="10" width="780" height="300" rx="16" fill="#1e1b4b" opacity="0.05"/>
  <rect x="30" y="40" width="160" height="50" rx="10" fill="#6366f1" opacity="0.15" stroke="#6366f1" stroke-width="1.5"/>
  <text x="110" y="70" text-anchor="middle" fill="#6366f1" font-size="14" font-weight="bold">Mount</text>
  <rect x="230" y="40" width="160" height="50" rx="10" fill="#8b5cf6" opacity="0.15" stroke="#8b5cf6" stroke-width="1.5"/>
  <text x="310" y="70" text-anchor="middle" fill="#8b5cf6" font-size="14" font-weight="bold">Update (Re-render)</text>
  <rect x="430" y="40" width="160" height="50" rx="10" fill="#ec4899" opacity="0.15" stroke="#ec4899" stroke-width="1.5"/>
  <text x="510" y="70" text-anchor="middle" fill="#ec4899" font-size="14" font-weight="bold">Unmount</text>
  <line x1="190" y1="65" x2="230" y2="65" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrowV)"/>
  <line x1="390" y1="65" x2="430" y2="65" stroke="#a78bfa" stroke-width="2" marker-end="url(#arrowV)"/>
  <text x="30" y="130" fill="#6366f1" font-size="12" font-weight="bold">useState(init)</text>
  <text x="30" y="155" fill="#6366f1" font-size="12">→ lazy initializer runs</text>
  <text x="30" y="185" fill="#6366f1" font-size="12" font-weight="bold">useEffect(() => { ... })</text>
  <text x="30" y="210" fill="#6366f1" font-size="12">→ runs after paint</text>
  <text x="30" y="240" fill="#6366f1" font-size="12" font-weight="bold">useLayoutEffect</text>
  <text x="30" y="265" fill="#6366f1" font-size="12">→ runs before paint</text>
  <text x="240" y="130" fill="#8b5cf6" font-size="12" font-weight="bold">Render phase</text>
  <text x="240" y="155" fill="#8b5cf6" font-size="12">→ useMemo recalculates</text>
  <text x="240" y="185" fill="#8b5cf6" font-size="12" font-weight="bold">Commit phase</text>
  <text x="240" y="210" fill="#8b5cf6" font-size="12">→ DOM updated</text>
  <text x="240" y="240" fill="#8b5cf6" font-size="12" font-weight="bold">useEffect cleanup</text>
  <text x="240" y="265" fill="#8b5cf6" font-size="12">→ prev effect cleaned</text>
  <text x="440" y="130" fill="#ec4899" font-size="12" font-weight="bold">Cleanup functions run</text>
  <text x="440" y="155" fill="#ec4899" font-size="12">→ useEffect return()</text>
  <text x="440" y="185" fill="#ec4899" font-size="12" font-weight="bold">Refs detached</text>
  <text x="440" y="210" fill="#ec4899" font-size="12">→ refs set to null</text>
  <text x="440" y="240" fill="#ec4899" font-size="12" font-weight="bold">DOM removed</text>
  <rect x="280" y="280" width="160" height="24" rx="6" fill="#8b5cf6" opacity="0.1" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="4"/>
  <text x="360" y="296" text-anchor="middle" fill="#8b5cf6" font-size="11">↻ loop on state change</text>
  <defs><marker id="arrowV" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#a78bfa"/></marker></defs>
</svg>`
    },
    quiz: [
      {
        question: "What happens when you call setState with the same value as the current state?",
        options: [
          "The component always re-renders",
          "React bails out and skips the re-render",
          "React throws an error",
          "The component unmounts and remounts"
        ],
        correctIndex: 1,
        explanation: "React uses Object.is() to compare. If the new state is identical to the current state, React bails out without re-rendering the component or its children."
      },
      {
        question: "What is the cleanup function in useEffect used for?",
        options: [
          "To reset state to initial values",
          "To unsubscribe/remove listeners before re-running the effect or on unmount",
          "To call the garbage collector",
          "To prevent re-renders"
        ],
        correctIndex: 1,
        explanation: "The cleanup function runs before each re-execution of the effect AND on unmount. It's critical for removing event listeners, canceling subscriptions, and aborting fetch requests."
      },
      {
        question: "When is useCallback actually necessary?",
        options: [
          "Every time you define a function inside a component",
          "When passing a callback to a React.memo-wrapped child component",
          "Only for async functions",
          "When using class components"
        ],
        correctIndex: 1,
        explanation: "useCallback is needed to stabilize function identity when passing callbacks to memoized children. Without it, a new function reference is created every render, defeating React.memo."
      },
      {
        question: "What does useRef.current changing NOT do?",
        options: [
          "Persist between renders",
          "Trigger a component re-render",
          "Store mutable values",
          "Hold DOM references"
        ],
        correctIndex: 1,
        explanation: "Changing useRef.current does NOT trigger a re-render. This makes it ideal for tracking values silently — like previous state, interval IDs, or mounted status."
      },
    ],
    questions: [
      {
        q: "useMemo vs useCallback — when do you actually need them?",
        a: "`useMemo` caches computed values; `useCallback` caches function identity. Both prevent unnecessary work — but only use them when there's a measurable perf issue.",
        hint: "Interviewers love asking this. The key insight: premature memoization adds complexity. Only memoize when passing callbacks to React.memo'd children or when computation is genuinely expensive.",
        code: `// useCallback: stabilize function identity for memoized children
const handleClick = useCallback(() => {
  setCount(c => c + 1); // ✅ stable updater avoids stale closures
}, []); // empty deps = stable forever

// useMemo: expensive computation caching
const sortedItems = useMemo(
  () => items.slice().sort((a, b) => a.price - b.price),
  [items] // only re-sort when items changes
);

// ❌ DON'T memoize cheap operations
const fullName = useMemo(() => first + ' ' + last, [first, last]); // overkill
const fullName2 = first + ' ' + last; // ✅ just compute it`,
      },
      {
        q: "Explain useReducer — when is it better than useState?",
        a: "useReducer is ideal when state logic is complex, has multiple sub-values, or when next state depends on previous state with complex transitions.",
        hint: "Show you understand this isn't just 'Redux in a component.' It's about predictable state machines with type-safe actions.",
        code: `type State = { status: 'idle' | 'loading' | 'success' | 'error'; data: any; error: string | null };

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: any }
  | { type: 'FETCH_ERROR'; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { status: 'error', data: null, error: action.error };
  }
}

// Usage
const [state, dispatch] = useReducer(reducer, { status: 'idle', data: null, error: null });
dispatch({ type: 'FETCH_START' });`,
      },
      {
        q: "What are useTransition and useDeferredValue? When would you use them?",
        a: "Both are concurrent rendering features. useTransition marks a state update as non-urgent (won't block user input). useDeferredValue defers re-rendering for a value.",
        hint: "This is a React 18+ question that separates senior from mid-level. Show you understand concurrent rendering and how it keeps the UI responsive.",
        code: `// useTransition: keep the UI responsive during heavy updates
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value); // urgent: update input immediately
    startTransition(() => {
      setFilteredResults(filterHugeList(e.target.value)); // non-urgent
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <ResultsList data={filteredResults} />}
    </>
  );
}

// useDeferredValue: defer a value from an external source
function SlowList({ text }: { text: string }) {
  const deferredText = useDeferredValue(text);
  // deferredText lags behind 'text', keeping input responsive
  const items = useMemo(() => computeExpensiveList(deferredText), [deferredText]);
  return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
}`,
      },
      {
        q: "How do you build a custom hook with proper TypeScript return types?",
        a: "Custom hooks encapsulate reusable stateful logic. Always return a tuple or object with explicit types — never rely on inference for public APIs.",
        code: `// ✅ Custom hook with explicit return type
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue] as const; // 'as const' preserves tuple type
}

// Usage — types are perfectly inferred
const [theme, setTheme] = useLocalStorage('theme', 'dark');
// theme: string, setTheme: (v: string | ((prev: string) => string)) => void`,
        hint: "Return 'as const' for tuples. Use objects for hooks with 3+ return values. Always handle SSR (window check) in hooks touching browser APIs.",
      },
      {
        q: "What is useRef used for beyond DOM references?",
        a: "useRef stores any mutable value that persists across renders WITHOUT triggering re-renders. It's essentially an instance variable for function components.",
        code: `// 1. DOM reference (most common)
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// 2. Storing previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => { ref.current = value; });
  return ref.current;
}

// 3. Mutable flag that doesn't cause re-render
const isMounted = useRef(false);
useEffect(() => {
  isMounted.current = true;
  return () => { isMounted.current = false; };
}, []);

// 4. Storing interval/timeout IDs
const intervalRef = useRef<ReturnType<typeof setInterval>>();
useEffect(() => {
  intervalRef.current = setInterval(() => tick(), 1000);
  return () => clearInterval(intervalRef.current);
}, []);`,
        hint: "Key insight: useRef.current changes don't cause re-renders. This makes it perfect for tracking values you need to read in callbacks/effects without adding dependencies.",
      },
    ],
  },

  // ─── 3. STATE MANAGEMENT ───
  {
    title: "3. State Management",
    color: "purple",
    questions: [
      {
        q: "Compare Redux Toolkit, React Query, Zustand, and Context API.",
        a: "Each solves a different state problem. The senior approach is to pick the right tool for each type of state.",
        hint: "Golden rule: Server state ≠ Client state. Never put API data in Redux. Show you understand the distinction.",
        list: [
          "**Redux Toolkit (RTK):** Global client state with complex derived data. Predictable unidirectional flow. Use for: shopping cart, multi-step forms, feature flags.",
          "**React Query / TanStack Query:** Server state cache (stale-while-revalidate, retries, dedup, pagination, optimistic updates). Use for: ALL API data.",
          "**Zustand:** Lightweight global state. No boilerplate, no Provider needed. Use for: theme, sidebar state, modals, small shared state.",
          "**Context API:** Dependency injection, NOT global state. Re-renders ALL consumers on any change. Use for: theme, locale, auth user — things that change rarely.",
        ],
      },
      {
        q: "Show React Query with optimistic updates + rollback.",
        a: "Optimistic updates make the UI feel instant by updating the cache before the server responds, with rollback on failure.",
        code: `const qc = useQueryClient();

const { mutate } = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    // 1. Cancel in-flight refetches so they don't overwrite our optimistic update
    await qc.cancelQueries({ queryKey: ['todos', newTodo.id] });

    // 2. Snapshot the previous value for rollback
    const previousTodo = qc.getQueryData(['todos', newTodo.id]);

    // 3. Optimistically update the cache
    qc.setQueryData(['todos', newTodo.id], (old: Todo) => ({
      ...old,
      ...newTodo,
    }));

    return { previousTodo }; // context for onError
  },
  onError: (_err, newTodo, context) => {
    // 4. Rollback on error
    qc.setQueryData(['todos', newTodo.id], context?.previousTodo);
    toast.error('Update failed, reverted changes');
  },
  onSettled: (_data, _err, newTodo) => {
    // 5. Always refetch to ensure server/client sync
    qc.invalidateQueries({ queryKey: ['todos', newTodo.id] });
  },
});`,
        hint: "This is a very common senior interview question. Remember the 5 steps: cancel, snapshot, optimistic update, rollback on error, refetch on settle.",
      },
      {
        q: "Why is Context API bad for frequently changing state?",
        a: "Context re-renders ALL consumers whenever the provider value changes, even if a consumer only uses a small part of the state.",
        code: `// ❌ BAD: All consumers re-render when ANY part of this changes
const AppContext = createContext({ user: null, theme: 'dark', count: 0 });

// ✅ SOLUTION 1: Split into separate contexts
const UserContext = createContext(null);
const ThemeContext = createContext('dark');

// ✅ SOLUTION 2: Use useMemo on the provider value
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ✅ SOLUTION 3: Use Zustand instead (no provider, no re-render issue)
const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}));`,
        hint: "This is a trap question. Many devs use Context for everything. Show you know its re-rendering limitation and when to reach for Zustand or jotai instead.",
      },
      {
        q: "Show a minimal Zustand store with TypeScript.",
        a: "Zustand requires zero boilerplate — no providers, no reducers, no actions creators. It's just a hook.",
        code: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

const useTodoStore = create<TodoStore>()(
  devtools( // adds Redux DevTools support
    persist( // persists to localStorage
      (set) => ({
        todos: [],
        addTodo: (text) =>
          set((state) => ({
            todos: [...state.todos, { id: crypto.randomUUID(), text, done: false }],
          })),
        toggleTodo: (id) =>
          set((state) => ({
            todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t),
          })),
        removeTodo: (id) =>
          set((state) => ({
            todos: state.todos.filter(t => t.id !== id),
          })),
      }),
      { name: 'todo-storage' }
    )
  )
);

// Usage in any component — no Provider wrapper needed
function TodoList() {
  const { todos, toggleTodo } = useTodoStore();
  // Only re-renders when 'todos' changes, not on unrelated state changes
}`,
      },
    ],
  },

  // ─── 4. RENDERING & RECONCILIATION ───
  {
    title: "4. React Rendering & Reconciliation",
    color: "cyan",
    questions: [
      {
        q: "Explain React's reconciliation algorithm. What role does the 'key' prop play?",
        a: "React uses a heuristic O(n) diffing algorithm. It compares trees level by level. The 'key' prop is the identity hint that tells React which elements are the 'same' between renders.",
        hint: "This is fundamental. Explain: (1) same type = update, different type = unmount/remount, (2) keys identify list items across renders. Using index as key is bad when list order changes.",
        list: [
          "**Different element types:** React tears down the old tree entirely and builds a new one. `<div>` → `<span>` = full unmount + remount.",
          "**Same element type:** React keeps the DOM node, only updates changed attributes/props.",
          "**Lists without keys:** React re-renders ALL items when one changes. With unique keys, React knows exactly which item changed, was added, or removed.",
          "**Why index-as-key is dangerous:** If you delete item at index 0, all subsequent items shift. React thinks item[0] changed content, item[1] changed content... causing bugs with stateful components (inputs, animations).",
        ],
      },
      {
        q: "What is React Fiber and concurrent rendering?",
        a: "Fiber is React's internal reconciliation engine (since React 16). It makes rendering interruptible — React can pause, abort, or prioritize rendering work.",
        hint: "Fiber is the reason useTransition and Suspense work. Show you understand that rendering is no longer synchronous/blocking.",
        list: [
          "**Before Fiber (Stack Reconciler):** Rendering was synchronous. A large component tree would block the main thread, causing jank.",
          "**Fiber Reconciler:** Breaks rendering into units of work (fibers). Each fiber is a node in a linked list. React can pause between fibers to handle user input.",
          "**Concurrent Mode (React 18+):** Enables features like useTransition, Suspense, and automatic batching. Multiple versions of the UI can exist in memory simultaneously.",
          "**Time slicing:** React yields to the browser every ~5ms so animations and input remain smooth even during heavy renders.",
        ],
      },
      {
        q: "When does React re-render a component? How do you prevent unnecessary re-renders?",
        a: "A component re-renders when: (1) its state changes, (2) its parent re-renders, (3) its context value changes. React.memo, useMemo, and useCallback are the escape hatches.",
        code: `// React.memo: skip re-render if props haven't changed (shallow compare)
const ExpensiveList = React.memo(function ExpensiveList({ items }: { items: Item[] }) {
  return <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
});

// Custom comparison function for complex props
const Chart = React.memo(
  function Chart({ data, config }: ChartProps) { /* render */ },
  (prevProps, nextProps) => {
    // Return true to SKIP re-render
    return prevProps.data.length === nextProps.data.length
        && prevProps.config.type === nextProps.config.type;
  }
);

// ⚠️ Common mistake: creating new objects/arrays in render
function Parent() {
  // ❌ New array every render — defeats React.memo in children
  return <ExpensiveList items={data.filter(d => d.active)} />;

  // ✅ Memoize the derived data
  const activeItems = useMemo(() => data.filter(d => d.active), [data]);
  return <ExpensiveList items={activeItems} />;
}`,
        hint: "The real senior answer: Don't prematurely optimize. Profile first with React DevTools Profiler. Only add memo/useMemo when you can measure the improvement.",
      },
    ],
  },

  // ─── 5. API INTEGRATION ───
  {
    title: "5. API Integration & Data Fetching",
    color: "emerald",
    questions: [
      {
        q: "Robust REST fetch with abort, retries, and Zod validation.",
        a: "Production-grade API calls need request cancellation, retry logic for transient failures, and runtime type validation.",
        code: `import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'viewer']),
});

type User = z.infer<typeof UserSchema>; // auto-generate TypeScript type

async function getUser(id: number, signal?: AbortSignal): Promise<User> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(\`/api/users/\${id}\`, { signal });

    if (res.ok) {
      const data = await res.json();
      return UserSchema.parse(data); // runtime validation!
    }

    if (res.status >= 400 && res.status < 500) {
      throw new Error(\`Client error: \${res.status}\`); // don't retry 4xx
    }

    // Exponential backoff for 5xx
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
  }
  throw new Error('Retries exhausted');
}

// Usage with AbortController (cleanup on unmount)
useEffect(() => {
  const controller = new AbortController();
  getUser(1, controller.signal).then(setUser).catch(console.error);
  return () => controller.abort(); // cancel if component unmounts
}, []);`,
        hint: "Three things interviewers look for: (1) AbortController for cleanup, (2) only retry server errors, (3) runtime validation with Zod to bridge the TS/runtime gap.",
      },
      {
        q: "How do you handle errors gracefully in a React application?",
        a: "Use a multi-layer error strategy: Error Boundaries for render errors, try/catch for async, and a normalized error shape across the app.",
        code: `// 1. Error Boundary (class component — still required, no hook equivalent)
class ErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to Sentry/Datadog
    errorReportingService.captureException(error, { extra: info });
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// 2. Usage: wrap at route level
<ErrorBoundary fallback={<FullPageError />}>
  <Suspense fallback={<PageSkeleton />}>
    <DashboardPage />
  </Suspense>
</ErrorBoundary>

// 3. Normalized error shape for API errors
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public isRetryable: boolean
  ) {
    super(message);
  }
}`,
        hint: "Error Boundaries only catch render/lifecycle errors, NOT event handlers or async code. You need both Error Boundaries AND try/catch.",
      },
      {
        q: "Explain Suspense for data fetching. How does it work?",
        a: "Suspense lets you declaratively specify loading states. A component 'suspends' by throwing a Promise. Suspense catches it and shows fallback until it resolves.",
        code: `// With React Query's suspense mode
function UserProfile({ userId }: { userId: string }) {
  // This 'suspends' — throws a promise until data is ready
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // No loading check needed! data is guaranteed to exist here
  return <h1>{data.name}</h1>;
}

// Parent wraps with Suspense boundary
function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile userId="123" />
      </Suspense>
    </ErrorBoundary>
  );
}

// Nested Suspense for granular loading states
<Suspense fallback={<PageShell />}>
  <Header />
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
  </Suspense>
  <Suspense fallback={<ContentSkeleton />}>
    <MainContent />
  </Suspense>
</Suspense>`,
        hint: "Suspense + Error Boundaries at route level is the modern pattern. Mention streaming SSR with Suspense in Next.js for bonus points.",
      },
    ],
  },

  // ─── 6. PERFORMANCE & OPTIMIZATION ───
  {
    title: "6. Performance & Optimization",
    color: "red",
    questions: [
      {
        q: "What's your checklist for debugging a slow React page?",
        a: "Systematic performance debugging follows a structured approach from bundle to render.",
        hint: "Having a structured mental framework impresses interviewers more than knowing one optimization trick.",
        list: [
          "**1. Measure First:** React DevTools Profiler → identify which components re-render most. Lighthouse → Core Web Vitals scores.",
          "**2. Bundle Size:** Analyze with `npx bundle-analyzer`. Code-split routes with `React.lazy` / Next.js dynamic imports. Tree-shake unused exports.",
          "**3. Network Waterfalls:** Are components fetching sequentially? Use parallel fetching, prefetch on hover, cache with React Query.",
          "**4. Unnecessary Re-renders:** Profile with React DevTools. Add React.memo / useMemo only where profiler shows excessive re-renders.",
          "**5. Virtualize Long Lists:** Use `react-window` or `@tanstack/react-virtual` for lists > 100 items. Only render visible rows.",
          "**6. Image Optimization:** Use Next/Image with proper sizes/srcSet. Serve WebP/AVIF. Lazy-load below-fold images.",
          "**7. CSS:** Use `content-visibility: auto` for off-screen sections. Avoid layout thrashing (reading then writing DOM).",
        ],
      },
      {
        q: "How does React.lazy work and how do you handle loading/error states?",
        a: "React.lazy enables code-splitting by dynamically importing components. They must be wrapped in Suspense.",
        code: `// Basic code splitting
const AdminDashboard = React.lazy(() => import('./AdminDashboard'));
const UserSettings = React.lazy(() => import('./UserSettings'));

function App() {
  return (
    <ErrorBoundary fallback={<p>Failed to load page</p>}>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/settings" element={<UserSettings />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

// Prefetch on hover for instant page transitions
const prefetchAdmin = () => import('./AdminDashboard');
<Link to="/admin" onMouseEnter={prefetchAdmin}>Admin</Link>

// Named exports require a wrapper
const MyComponent = React.lazy(() =>
  import('./components').then(mod => ({ default: mod.MyComponent }))
);`,
      },
      {
        q: "How do you virtualize a list of 10,000 items?",
        a: "Virtualization renders only visible items in the viewport, dramatically reducing DOM nodes. Libraries like react-window handle the math.",
        code: `import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style} className="flex items-center px-4 border-b">
      <span>{items[index].name}</span>
      <span className="ml-auto">{items[index].price}</span>
    </div>
  );

  return (
    <FixedSizeList
      height={600}           // viewport height
      width="100%"
      itemCount={items.length} // total items
      itemSize={48}           // row height in px
    >
      {Row}
    </FixedSizeList>
  );
}

// For variable-height rows, use VariableSizeList
// For grids, use FixedSizeGrid
// For infinite scroll, combine with react-window-infinite-loader`,
        hint: "Mention @tanstack/react-virtual as the modern alternative. Key metric: rendering 10K items without virtualization = ~10K DOM nodes. With virtualization = ~20 DOM nodes.",
      },
      {
        q: "How do you prevent Cumulative Layout Shift (CLS)?",
        a: "CLS is caused by elements changing size/position after the initial render. Reserve space upfront for dynamic content.",
        list: [
          "**Images/Video:** Always set explicit `width` and `height` attributes or use CSS `aspect-ratio: 16/9`. Next/Image does this automatically.",
          "**Fonts:** Use `font-display: swap` to prevent Flash of Invisible Text (FOIT). Preload critical fonts with `<link rel='preload'>`.",
          "**Skeleton Screens:** Render exact-sized skeletons while data loads — not spinners that collapse to zero height.",
          "**Ads/Embeds:** Pre-allocate fixed-size containers for ads, iframes, and third-party widgets.",
          "**Dynamic Content:** Never insert content above existing visible content. Use `min-height` on containers that will receive async data.",
        ],
      },
    ],
  },

  // ─── 7. TESTING ───
  {
    title: "7. Testing (Jest, RTL, Playwright)",
    color: "orange",
    questions: [
      {
        q: "Test a component with async fetch using React Testing Library.",
        a: "Use `findBy*` queries for async elements. Mock network calls with MSW (Mock Service Worker), not by mocking fetch directly.",
        code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// 1. Setup MSW server
const server = setupServer(
  http.get('/api/user/1', () => {
    return HttpResponse.json({ name: 'Dana', role: 'admin' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// 2. Test
test('displays user data after loading', async () => {
  render(<UserProfile userId="1" />);

  // Assert loading state
  expect(screen.getByRole('status')).toBeInTheDocument();

  // Assert data loaded (findBy* waits up to 1s)
  expect(await screen.findByText(/dana/i)).toBeInTheDocument();
  expect(screen.getByText(/admin/i)).toBeInTheDocument();

  // Assert loading state is gone
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

// 3. Test error handling
test('shows error on API failure', async () => {
  server.use(http.get('/api/user/1', () => HttpResponse.error()));
  render(<UserProfile userId="1" />);
  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
});`,
        hint: "Key principles: (1) test behavior, not implementation, (2) use getByRole/getByText, never getByClassName, (3) MSW over jest.mock(fetch) — MSW intercepts at the network level.",
      },
      {
        q: "What is the Testing Trophy and how do you decide what to test?",
        a: "The Testing Trophy (Kent C. Dodds) prioritizes integration tests over unit tests, because they give the most confidence per cost.",
        list: [
          "**Static Analysis (base):** TypeScript + ESLint catch bugs at write time. Zero cost, maximum ROI.",
          "**Unit Tests:** Test pure functions, utilities, reducers. Fast, isolated, but low confidence in real user flows.",
          "**Integration Tests (most important):** Test components with their children, hooks, and mocked API calls. Highest confidence-to-cost ratio.",
          "**E2E Tests (top):** Playwright/Cypress testing full user flows. High confidence but slow and flaky. Use sparingly for critical paths (login, checkout, signup).",
        ],
        hint: "Don't say 'we aim for 100% code coverage.' Say 'we focus on testing user behaviors and critical paths at the integration level, with E2E for happy paths.'",
      },
      {
        q: "How do you handle flaky tests?",
        a: "Flaky tests erode trust in the entire test suite. Systematic prevention is better than chasing intermittent failures.",
        list: [
          "**Use locators that auto-wait:** Playwright and Cypress auto-retry finding elements. Avoid explicit `sleep()` or `wait()`.",
          "**Deterministic data:** Seed test databases/fixtures. Never rely on production data or shared test state.",
          "**Mock time:** For anything time-based, use `jest.useFakeTimers()` or Playwright's clock API.",
          "**Isolate tests:** Each test should set up and tear down its own state. No test should depend on another test's output.",
          "**Mock network:** MSW gives deterministic API responses. No flakiness from real network calls.",
          "**Retry once, fix always:** CI can retry flaky tests once, but track flakiness rate and fix root causes.",
        ],
      },
    ],
  },

  // ─── 8. DESIGN PATTERNS ───
  {
    title: "8. React Design Patterns",
    color: "pink",
    questions: [
      {
        q: "Explain the Compound Component pattern.",
        a: "Compound components share implicit state via Context, giving consumers flexible composition without prop drilling.",
        code: `// Compound Component: Accordion
const AccordionContext = createContext<{
  openItem: string | null;
  toggle: (id: string) => void;
} | null>(null);

function Accordion({ children }: { children: React.ReactNode }) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const toggle = (id: string) => setOpenItem(prev => prev === id ? null : id);
  return (
    <AccordionContext.Provider value={{ openItem, toggle }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, title, children }: {
  id: string; title: string; children: React.ReactNode
}) {
  const ctx = useContext(AccordionContext)!;
  const isOpen = ctx.openItem === id;
  return (
    <div>
      <button onClick={() => ctx.toggle(id)}>{title} {isOpen ? '▲' : '▼'}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// Usage — flexible, declarative API
<Accordion>
  <AccordionItem id="1" title="Section 1">Content 1</AccordionItem>
  <AccordionItem id="2" title="Section 2">Content 2</AccordionItem>
</Accordion>`,
        hint: "Compound components are used in Headless UI, Radix, and Reach UI. The pattern replaces render props for most use cases.",
      },
      {
        q: "Controlled vs Uncontrolled components — when to use each?",
        a: "Controlled: React state is the source of truth (value + onChange). Uncontrolled: DOM is the source of truth (ref to read value).",
        code: `// Controlled — React controls the input value
function ControlledForm() {
  const [email, setEmail] = useState('');
  return (
    <input value={email} onChange={e => setEmail(e.target.value)} />
    // ✅ Easy validation, conditional logic, derived state
  );
}

// Uncontrolled — DOM holds the value
function UncontrolledForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const handleSubmit = () => {
    console.log(emailRef.current?.value); // read from DOM
  };
  return <input ref={emailRef} defaultValue="initial" />;
  // ✅ Less re-renders, simpler for basic forms
}

// Real-world: use react-hook-form (uncontrolled + validation)
import { useForm } from 'react-hook-form';
function RHFForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('email', { required: true, pattern: /^\\S+@\\S+$/ })} />
      {errors.email && <span>Invalid email</span>}
    </form>
  );
}`,
        hint: "In interviews, mention react-hook-form as the best of both worlds: uncontrolled performance + validation. It's the industry standard for complex forms.",
      },
      {
        q: "What is the Render Props pattern and is it still relevant?",
        a: "Render props pass a function as a prop to share logic. Largely replaced by custom hooks, but still useful for some UI abstraction patterns.",
        code: `// Render Props pattern
function MouseTracker({ render }: {
  render: (pos: { x: number; y: number }) => React.ReactNode
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return <>{render(pos)}</>;
}

// Usage
<MouseTracker render={({ x, y }) => <p>Mouse: {x}, {y}</p>} />

// ✅ Modern equivalent: custom hook (preferred)
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => { /* same listener logic */ }, []);
  return pos;
}
const { x, y } = useMousePosition();`,
        hint: "Say: 'Render props are mostly replaced by hooks, but the pattern is still useful in libraries like Downshift and when you need component-level code sharing that hooks can't provide (e.g., rendering the output in a specific DOM location).'",
      },
    ],
  },

  // ─── 9. NEXT.JS & SSR ───
  {
    title: "9. Next.js & Server-Side Rendering",
    color: "slate",
    questions: [
      {
        q: "Compare SSR, SSG, ISR, and Server Components.",
        a: "Each rendering strategy has different tradeoffs for performance, SEO, and data freshness.",
        list: [
          "**SSR (Server-Side Rendering):** HTML generated on every request. Best for personalized/auth-gated pages. `getServerSideProps` in Pages Router, or just fetching in Server Components.",
          "**SSG (Static Site Generation):** HTML generated at build time. Best for marketing pages, docs, blogs. `getStaticProps` + `getStaticPaths` in Pages Router.",
          "**ISR (Incremental Static Regeneration):** SSG that revalidates on a timer. `revalidate: 60` regenerates the page at most every 60 seconds. Best of both worlds for semi-static data.",
          "**Server Components (React 19 / Next.js App Router):** Components render on the server, send HTML + minimal JS. Zero client bundle for server components. Can directly access databases, file systems, secrets.",
        ],
        hint: "In interviews, demonstrate you know WHEN to use each: SSG for content sites, SSR for dashboards, ISR for e-commerce product pages, Server Components for everything that doesn't need interactivity.",
      },
      {
        q: "Explain the Next.js App Router and Server Components vs Client Components.",
        a: "In the App Router, all components are Server Components by default. Add 'use client' only when you need browser APIs, state, or effects.",
        code: `// ✅ Server Component (default) — runs ONLY on the server
// Can directly query databases, access env secrets
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await db.query('SELECT * FROM products WHERE id = $1', [params.id]);
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartButton productId={product.id} /> {/* Client Component */}
    </div>
  );
}

// ✅ Client Component — 'use client' directive at top
'use client';
import { useState } from 'react';

function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => { addToCart(productId); setAdded(true); }}>
      {added ? '✓ Added' : 'Add to Cart'}
    </button>
  );
}

// ✅ Server Action — run server code from client components
'use server';
async function addToCart(productId: string) {
  await db.insert('cart_items', { productId, userId: getCurrentUser() });
  revalidatePath('/cart');
}`,
        hint: "The mental model: Server Components are the default. Push 'use client' as far down the tree as possible (leaf components). Server Components can import Client Components but NOT vice versa.",
      },
      {
        q: "How does streaming SSR work in Next.js?",
        a: "Streaming sends HTML to the browser progressively. Suspense boundaries define where React can 'break' the stream, showing fallback content first and filling in later.",
        list: [
          "**Traditional SSR:** Server generates ALL HTML, sends it in one chunk. User sees blank page until everything is ready.",
          "**Streaming SSR:** Server sends the shell immediately, then streams in Suspense fallback boundaries as data resolves. User sees content progressively.",
          "**loading.tsx:** Next.js auto-wraps page content in Suspense with this file as fallback. Instant page navigation with streaming.",
          "**Benefit:** Time to First Byte (TTFB) is near-instant. Slow database queries don't block the entire page render.",
        ],
      },
    ],
  },

  // ─── 10. SECURITY IN REACT ───
  {
    title: "10. Security in React",
    color: "rose",
    questions: [
      {
        q: "How does React prevent XSS attacks? When is it NOT safe?",
        a: "React escapes all string values in JSX by default. But dangerouslySetInnerHTML, href='javascript:...', and server-rendered user content are attack vectors.",
        code: `// ✅ SAFE: React auto-escapes this
const userInput = '<script>alert("xss")</script>';
return <div>{userInput}</div>; // renders as text, NOT executed

// ❌ DANGEROUS: bypasses React's escaping
return <div dangerouslySetInnerHTML={{ __html: userInput }} />;

// ✅ If you MUST render HTML, sanitize first
import DOMPurify from 'dompurify';
return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />;

// ❌ DANGEROUS: javascript: URLs
const userUrl = 'javascript:alert("xss")';
return <a href={userUrl}>Click me</a>; // XSS!

// ✅ Validate URLs
function SafeLink({ href }: { href: string }) {
  const isSafe = href.startsWith('https://') || href.startsWith('/');
  return isSafe ? <a href={href}>Link</a> : <span>Invalid URL</span>;
}`,
        hint: "Mention: (1) React's auto-escaping, (2) dangerouslySetInnerHTML + DOMPurify, (3) CSP headers as defense-in-depth, (4) never trust user input in href attributes.",
      },
      {
        q: "What security headers should every React app have?",
        a: "Security headers are your first line of defense. Configure them in your web server or Next.js middleware.",
        list: [
          "**Content-Security-Policy (CSP):** Whitelist allowed script/style sources. Prevents inline script injection.",
          "**X-Content-Type-Options: nosniff:** Prevents MIME type sniffing attacks.",
          "**X-Frame-Options: DENY:** Prevents clickjacking by blocking iframe embedding.",
          "**Strict-Transport-Security (HSTS):** Forces HTTPS for all future requests.",
          "**Referrer-Policy: strict-origin-when-cross-origin:** Controls what referrer info is sent.",
          "**Permissions-Policy:** Disable unused browser features (camera, microphone, geolocation).",
        ],
      },
    ],
  },

  // ─── 11. BUILD TOOLING & CSS ───
  {
    title: "11. Build Tooling & CSS",
    color: "yellow",
    questions: [
      {
        q: "Vite vs Webpack vs Turbopack?",
        a: "All are bundlers, but with very different architectures and performance characteristics.",
        list: [
          "**Vite:** Uses native ESM for dev (no bundling!), Rollup for prod. Lightning-fast HMR. The default choice for new projects.",
          "**Webpack:** Mature, massive plugin ecosystem. Needed for Module Federation, complex legacy configs. Slower HMR.",
          "**Turbopack (Next.js):** Written in Rust. Aims to be Webpack's successor. Incremental computation means only changed modules are rebuilt. Still stabilizing.",
        ],
        hint: "Say: 'I default to Vite for new projects, Turbopack comes built-in with Next.js, and Webpack for legacy apps that need Module Federation.'",
      },
      {
        q: "Tailwind CSS vs CSS Modules vs CSS-in-JS — how do you choose?",
        a: "Each has tradeoffs for DX, performance, and scalability.",
        list: [
          "**Tailwind CSS:** Utility-first, design tokens built-in, zero dead CSS, excellent DX. Con: verbose class strings, learning curve.",
          "**CSS Modules:** Scoped CSS with zero runtime cost. Works everywhere. Con: no design tokens, separate files.",
          "**CSS-in-JS (styled-components, Emotion):** Dynamic styles from JS state, colocation. Con: runtime overhead, SSR complexity. Being abandoned by many libraries.",
          "**Senior approach:** Tailwind + Headless UI (Radix/Ark) for design systems. CSS Modules for library code. Avoid CSS-in-JS in new projects.",
        ],
      },
    ],
  },

  // ─── 12. ACCESSIBILITY ───
  {
    title: "12. Accessibility (WCAG 2.1)",
    color: "teal",
    questions: [
      {
        q: "Core WCAG principles and what you implement by default?",
        a: "Accessibility is a legal requirement (ADA/EAA) and a quality signal. Follow POUR: Perceivable, Operable, Understandable, Robust.",
        list: [
          "**Semantic HTML:** Use `<button>`, `<nav>`, `<main>`, `<article>` — NOT `<div onClick>`. Screen readers depend on correct element roles.",
          "**Color Contrast:** Minimum 4.5:1 for normal text, 3:1 for large text (WCAG AA).",
          "**Keyboard Navigation:** All interactive elements must be reachable via Tab. Visible focus indicators. Never `outline: none` without replacement.",
          "**Form Labels:** Every input must have an associated `<label>` via `htmlFor`/`id` pairing. Placeholder is NOT a label.",
          "**aria-live regions:** For dynamic content (toasts, loading states). `aria-live='polite'` for non-urgent, `'assertive'` for critical updates.",
          "**Focus Management:** After navigation, route changes, or modal open/close — move focus to the appropriate element.",
        ],
        hint: "In interviews, mention you test with: (1) keyboard-only navigation, (2) screen reader (VoiceOver/NVDA), (3) axe-core browser extension, (4) Lighthouse accessibility audit.",
      },
      {
        q: "Make a custom dropdown fully accessible.",
        a: "Custom dropdowns require extensive ARIA attributes and keyboard handling to match native `<select>` accessibility.",
        code: `function AccessibleSelect({ options, value, onChange, label }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = useId();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          onChange(options[activeIndex]);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div>
      <label id={\`\${listboxId}-label\`}>{label}</label>
      <button
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={\`\${listboxId}-label\`}
        onKeyDown={handleKeyDown}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || 'Select...'}
      </button>
      {isOpen && (
        <ul role="listbox" id={listboxId}>
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={i === activeIndex ? 'bg-blue-100' : ''}
              onClick={() => { onChange(opt); setIsOpen(false); }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
        hint: "In real projects, use Radix UI or Headless UI instead of building custom accessible components. But understanding the ARIA pattern shows deep knowledge.",
      },
    ],
  },
];

/* ─────────────────────────────────────
   SECTION-LEVEL QUIZZES (by section title)
   ───────────────────────────────────── */
export const sectionQuizzes: Record<string, QuizQuestion[]> = {
  "3. State Management": [
    {
      question: "Which tool is best for caching server-side API data?",
      options: ["Redux Toolkit", "React Query / TanStack Query", "Zustand", "Context API"],
      correctIndex: 1,
      explanation: "React Query (TanStack Query) is purpose-built for server state — it handles caching, dedup, background refetch, pagination, and optimistic updates out of the box."
    },
    {
      question: "Why is Context API a poor choice for frequently changing state?",
      options: [
        "Context is synchronous and blocks rendering",
        "Context values cannot be objects",
        "All consumers re-render on any provider value change",
        "Context cannot hold complex data types"
      ],
      correctIndex: 2,
      explanation: "When a Context provider's value changes, ALL consuming components re-render — even if they only use a small part of the context object. Split into multiple contexts or use Zustand instead."
    },
  ],
  "4. React Rendering & Reconciliation": [
    {
      question: "What happens when you use array index as the key prop in a list that gets reordered?",
      options: [
        "React optimizes the reorder perfectly",
        "React may incorrectly reuse component state for wrong items",
        "React throws a key collision error",
        "The list fails to render"
      ],
      correctIndex: 1,
      explanation: "When items reorder, index-as-key makes React think item[0] just 'changed content' instead of recognizing the reorder. This causes bugs with stateful components (inputs lose their values, animations break)."
    },
    {
      question: "React.memo performs what type of comparison on props?",
      options: ["Deep equality", "Shallow equality (Object.is per key)", "Reference equality on the entire props object", "JSON string comparison"],
      correctIndex: 1,
      explanation: "React.memo does a shallow comparison — it checks each prop with Object.is(). This is why passing new object/array literals as props to a memo'd component defeats the optimization."
    },
  ],
  "6. Performance & Optimization": [
    {
      question: "How many DOM nodes does react-window render for a list of 10,000 items?",
      options: ["10,000", "~100", "~20 (only visible rows)", "Depends on item size"],
      correctIndex: 2,
      explanation: "Virtualization renders ONLY the rows visible in the viewport (plus a small overscan buffer). This brings 10K DOM nodes down to ~20, dramatically improving performance."
    },
    {
      question: "What is the fastest way to diagnose which React components re-render most?",
      options: ["Add console.log to every render", "React DevTools Profiler", "Network tab", "Lighthouse audit"],
      correctIndex: 1,
      explanation: "React DevTools Profiler records render commits, showing exactly which components rendered, how long each took, and why they rendered ('Props changed', 'Hooks changed', etc.)."
    },
  ],
  "9. Next.js & Server-Side Rendering": [
    {
      question: "In the Next.js App Router, what are components by default?",
      options: ["Client Components", "Server Components", "Shared Components", "Static Components"],
      correctIndex: 1,
      explanation: "All components are Server Components by default in the App Router. You must explicitly add 'use client' at the top of the file to make a component a Client Component."
    },
    {
      question: "Which rendering strategy is best for an e-commerce product page that changes twice a day?",
      options: ["SSR on every request", "SSG at build time only", "ISR with revalidate: 3600", "Client-side rendering"],
      correctIndex: 2,
      explanation: "ISR (Incremental Static Regeneration) is perfect — you get the speed of static pages but they regenerate in the background. A 1-hour revalidate window means fresh data without per-request server load."
    },
  ],
};

/* ─────────────────────────────────────
   CONSOLE OUTPUT EXAMPLES (key → output lines)
   ───────────────────────────────────── */
export const consoleExamples: {
  sectionTitle: string;
  title: string;
  code: string;
  output: string[];
}[] = [
  {
    sectionTitle: "2. Hooks Deep Dive",
    title: "useState & useEffect execution order",
    code: `function Demo() {
  console.log("1. Render");
  const [count, setCount] = useState(() => {
    console.log("2. Lazy init (mount only)");
    return 0;
  });
  useEffect(() => {
    console.log("4. useEffect (after paint)");
    return () => console.log("5. Cleanup (before next effect or unmount)");
  });
  console.log("3. Render continues");
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}`,
    output: [
      "// ── Mount ──",
      "1. Render",
      "2. Lazy init (mount only)",
      "3. Render continues",
      "> DOM painted to screen",
      "4. useEffect (after paint)",
      "",
      "// ── Click button (re-render) ──",
      "1. Render",
      "3. Render continues",
      "> DOM painted to screen",
      "5. Cleanup (before next effect or unmount)",
      "4. useEffect (after paint)",
    ],
  },
  {
    sectionTitle: "4. React Rendering & Reconciliation",
    title: "React.memo prevents unnecessary re-renders",
    code: `const Child = React.memo(({ name }: { name: string }) => {
  console.log("Child rendered:", name);
  return <div>{name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  console.log("Parent rendered, count:", count);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <Child name="Alice" />
    </>
  );
}`,
    output: [
      "// ── Mount ──",
      "Parent rendered, count: 0",
      "Child rendered: Alice",
      "",
      "// ── Click +1 ──",
      "Parent rendered, count: 1",
      "// Child does NOT re-render (props unchanged, React.memo bails out)",
      "",
      "// ── Click +1 again ──",
      "Parent rendered, count: 2",
      "// Child still skipped! ✅",
    ],
  },
  {
    sectionTitle: "3. State Management",
    title: "useState batching behavior (React 18+)",
    code: `function BatchDemo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  function handleClick() {
    setA(1); // batched
    setB(2); // batched
    console.log("After setState:", a, b); // still old values!
  }

  console.log("Render:", a, b);
  return <button onClick={handleClick}>Click</button>;
}`,
    output: [
      "// ── Mount ──",
      "Render: 0 0",
      "",
      "// ── Click button ──",
      "After setState: 0 0  ← state hasn't updated yet (batched)",
      "Render: 1 2  ← ONE re-render with both updates (React 18 auto-batching)",
    ],
  },
];

/* ─────────────────────────────────────
   DIAGRAMS (section-level)
   ───────────────────────────────────── */
export const sectionDiagrams: Record<string, { title: string; svg: string }> = {
  "4. React Rendering & Reconciliation": {
    title: "React Reconciliation: Virtual DOM Diffing",
    svg: `<svg viewBox="0 0 780 280" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:780px">
  <rect x="5" y="5" width="770" height="270" rx="14" fill="#164e63" opacity="0.04"/>
  <text x="130" y="30" text-anchor="middle" fill="#0891b2" font-size="13" font-weight="bold">Previous Virtual DOM</text>
  <text x="400" y="30" text-anchor="middle" fill="#7c3aed" font-size="13" font-weight="bold">Diff Algorithm</text>
  <text x="650" y="30" text-anchor="middle" fill="#16a34a" font-size="13" font-weight="bold">New Virtual DOM</text>
  <rect x="80" y="50" width="100" height="36" rx="8" fill="#0891b2" opacity="0.15" stroke="#0891b2" stroke-width="1.5"/>
  <text x="130" y="73" text-anchor="middle" fill="#0891b2" font-size="12">&lt;App/&gt;</text>
  <rect x="40" y="110" width="80" height="30" rx="6" fill="#0891b2" opacity="0.1" stroke="#0891b2"/>
  <text x="80" y="130" text-anchor="middle" fill="#0891b2" font-size="11">&lt;Header/&gt;</text>
  <rect x="140" y="110" width="80" height="30" rx="6" fill="#0891b2" opacity="0.1" stroke="#0891b2"/>
  <text x="180" y="130" text-anchor="middle" fill="#0891b2" font-size="11">&lt;List/&gt;</text>
  <line x1="130" y1="86" x2="80" y2="110" stroke="#0891b2" stroke-width="1"/>
  <line x1="130" y1="86" x2="180" y2="110" stroke="#0891b2" stroke-width="1"/>
  <rect x="110" y="160" width="70" height="26" rx="5" fill="#ef4444" opacity="0.15" stroke="#ef4444"/>
  <text x="145" y="178" text-anchor="middle" fill="#ef4444" font-size="10">Item A</text>
  <rect x="190" y="160" width="70" height="26" rx="5" fill="#0891b2" opacity="0.1" stroke="#0891b2"/>
  <text x="225" y="178" text-anchor="middle" fill="#0891b2" font-size="10">Item B</text>
  <line x1="180" y1="140" x2="145" y2="160" stroke="#0891b2" stroke-width="1"/>
  <line x1="180" y1="140" x2="225" y2="160" stroke="#0891b2" stroke-width="1"/>
  <rect x="600" y="50" width="100" height="36" rx="8" fill="#16a34a" opacity="0.15" stroke="#16a34a" stroke-width="1.5"/>
  <text x="650" y="73" text-anchor="middle" fill="#16a34a" font-size="12">&lt;App/&gt;</text>
  <rect x="560" y="110" width="80" height="30" rx="6" fill="#16a34a" opacity="0.1" stroke="#16a34a"/>
  <text x="600" y="130" text-anchor="middle" fill="#16a34a" font-size="11">&lt;Header/&gt;</text>
  <rect x="660" y="110" width="80" height="30" rx="6" fill="#16a34a" opacity="0.1" stroke="#16a34a"/>
  <text x="700" y="130" text-anchor="middle" fill="#16a34a" font-size="11">&lt;List/&gt;</text>
  <line x1="650" y1="86" x2="600" y2="110" stroke="#16a34a" stroke-width="1"/>
  <line x1="650" y1="86" x2="700" y2="110" stroke="#16a34a" stroke-width="1"/>
  <rect x="630" y="160" width="70" height="26" rx="5" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" stroke-width="2"/>
  <text x="665" y="178" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="bold">Item A*</text>
  <rect x="710" y="160" width="70" height="26" rx="5" fill="#16a34a" opacity="0.1" stroke="#16a34a"/>
  <text x="745" y="178" text-anchor="middle" fill="#16a34a" font-size="10">Item B</text>
  <line x1="700" y1="140" x2="665" y2="160" stroke="#16a34a" stroke-width="1"/>
  <line x1="700" y1="140" x2="745" y2="160" stroke="#16a34a" stroke-width="1"/>
  <rect x="320" y="80" width="160" height="110" rx="10" fill="#7c3aed" opacity="0.08" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="400" y="105" text-anchor="middle" fill="#7c3aed" font-size="11" font-weight="bold">O(n) Comparison</text>
  <text x="400" y="125" text-anchor="middle" fill="#7c3aed" font-size="10">1. Same type? Update</text>
  <text x="400" y="143" text-anchor="middle" fill="#7c3aed" font-size="10">2. Diff type? Remount</text>
  <text x="400" y="161" text-anchor="middle" fill="#7c3aed" font-size="10">3. Key match? Reuse</text>
  <text x="400" y="179" text-anchor="middle" fill="#7c3aed" font-size="10">4. Minimal DOM ops</text>
  <line x1="260" y1="130" x2="320" y2="130" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#arrowR)" stroke-dasharray="5"/>
  <line x1="480" y1="130" x2="560" y2="130" stroke="#7c3aed" stroke-width="1.5" marker-end="url(#arrowR)" stroke-dasharray="5"/>
  <rect x="280" y="220" width="220" height="40" rx="8" fill="#f59e0b" opacity="0.1" stroke="#f59e0b"/>
  <text x="390" y="237" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">Result: only Item A is patched</text>
  <text x="390" y="253" text-anchor="middle" fill="#f59e0b" font-size="10">Header, List, Item B unchanged ✅</text>
  <defs><marker id="arrowR" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="#7c3aed"/></marker></defs>
</svg>`
  },
  "9. Next.js & Server-Side Rendering": {
    title: "Next.js Rendering Strategies Comparison",
    svg: `<svg viewBox="0 0 780 240" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:780px">
  <rect x="5" y="5" width="770" height="230" rx="14" fill="#1e293b" opacity="0.04"/>
  <rect x="20" y="20" width="170" height="100" rx="10" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="105" y="45" text-anchor="middle" fill="#3b82f6" font-size="12" font-weight="bold">SSG</text>
  <text x="105" y="65" text-anchor="middle" fill="#3b82f6" font-size="10">Build time HTML</text>
  <text x="105" y="80" text-anchor="middle" fill="#3b82f6" font-size="10">⚡ Fastest TTFB</text>
  <text x="105" y="95" text-anchor="middle" fill="#3b82f6" font-size="10">📄 Blogs, docs</text>
  <text x="105" y="110" text-anchor="middle" fill="#3b82f6" font-size="9" opacity="0.7">Stale until rebuild</text>
  <rect x="210" y="20" width="170" height="100" rx="10" fill="#8b5cf6" opacity="0.1" stroke="#8b5cf6" stroke-width="1.5"/>
  <text x="295" y="45" text-anchor="middle" fill="#8b5cf6" font-size="12" font-weight="bold">ISR</text>
  <text x="295" y="65" text-anchor="middle" fill="#8b5cf6" font-size="10">Static + revalidate</text>
  <text x="295" y="80" text-anchor="middle" fill="#8b5cf6" font-size="10">🔄 Best of both</text>
  <text x="295" y="95" text-anchor="middle" fill="#8b5cf6" font-size="10">🛍️ E-commerce</text>
  <text x="295" y="110" text-anchor="middle" fill="#8b5cf6" font-size="9" opacity="0.7">Background refresh</text>
  <rect x="400" y="20" width="170" height="100" rx="10" fill="#f59e0b" opacity="0.1" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="485" y="45" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">SSR</text>
  <text x="485" y="65" text-anchor="middle" fill="#f59e0b" font-size="10">Per-request HTML</text>
  <text x="485" y="80" text-anchor="middle" fill="#f59e0b" font-size="10">🔐 Personalized</text>
  <text x="485" y="95" text-anchor="middle" fill="#f59e0b" font-size="10">📊 Dashboards</text>
  <text x="485" y="110" text-anchor="middle" fill="#f59e0b" font-size="9" opacity="0.7">Server load per req</text>
  <rect x="590" y="20" width="170" height="100" rx="10" fill="#10b981" opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
  <text x="675" y="45" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">RSC</text>
  <text x="675" y="65" text-anchor="middle" fill="#10b981" font-size="10">Server Components</text>
  <text x="675" y="80" text-anchor="middle" fill="#10b981" font-size="10">📦 Zero client JS</text>
  <text x="675" y="95" text-anchor="middle" fill="#10b981" font-size="10">🗃️ Direct DB access</text>
  <text x="675" y="110" text-anchor="middle" fill="#10b981" font-size="9" opacity="0.7">No state/effects</text>
  <line x1="105" y1="140" x2="105" y2="165" stroke="#3b82f6" stroke-width="1.5"/>
  <line x1="295" y1="140" x2="295" y2="165" stroke="#8b5cf6" stroke-width="1.5"/>
  <line x1="485" y1="140" x2="485" y2="165" stroke="#f59e0b" stroke-width="1.5"/>
  <line x1="675" y1="140" x2="675" y2="165" stroke="#10b981" stroke-width="1.5"/>
  <rect x="20" y="170" width="740" height="50" rx="8" fill="#1e293b" opacity="0.04" stroke="#64748b" stroke-width="1" stroke-dasharray="4"/>
  <text x="40" y="192" fill="#64748b" font-size="11" font-weight="bold">TTFB:</text>
  <text x="105" y="192" text-anchor="middle" fill="#3b82f6" font-size="11" font-weight="bold">~10ms</text>
  <text x="295" y="192" text-anchor="middle" fill="#8b5cf6" font-size="11" font-weight="bold">~10ms*</text>
  <text x="485" y="192" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">~200ms</text>
  <text x="675" y="192" text-anchor="middle" fill="#10b981" font-size="11" font-weight="bold">~50ms</text>
  <text x="390" y="212" text-anchor="middle" fill="#64748b" font-size="9">* ISR serves stale-while-revalidate; TTFB is fast except first cold request</text>
</svg>`
  },
};
