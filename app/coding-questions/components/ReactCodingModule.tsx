'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const codingQuestions = [
  {
    id: 'progress-bar',
    title: 'R1: Progress Bar (setInterval + useEffect)',
    description: 'Build a progress bar that fills up over time when Start is clicked. Pause/resume must continue from where it left off (not restart), it must auto-stop at 100%, and include a Reset control.',
    code: `const STEP = 10;
const INTERVAL_MS = 500;

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + STEP, 100);
        if (next >= 100) {
          clearInterval(id);
          setIsRunning(false);
        }
        return next;
      });
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [isRunning]);

  const handleToggle = () => {
    if (progress >= 100) { setIsRunning(false); return; }
    setIsRunning((running) => !running);
  };

  const handleReset = () => {
    setIsRunning(false);
    setProgress(0);
  };

  return (
    <>
      <button onClick={handleToggle} disabled={progress >= 100}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={handleReset}>Reset</button>
      <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ width: \`\${progress}%\` }} />
      </div>
    </>
  );
}`,
    approach: 'This looks like a CSS exercise but is really a timer-lifecycle test. Three classic bugs it catches: (1) a stale closure if you write setProgress(progress + STEP) instead of the functional updater setProgress(prev => ...) — the interval callback would keep reading the value captured when the interval was created; (2) forgetting clearInterval in the effect cleanup, which leaks a timer on unmount/pause; (3) not guarding Start against rapid double-clicks, which spawns multiple overlapping intervals all incrementing the same state. Guarding with isRunning as the single effect dependency, plus disabling Start at 100%, prevents that.',
    answer: 'See code implementation.',
  },
  {
    id: 'tic-tac-toe',
    title: 'R2: Tic-Tac-Toe (win detection + time travel)',
    description: 'The classic React tutorial exercise: a 3x3 board, correct win/draw detection across all 8 lines, and — as the usual follow-up — a move-history list that lets you jump back to any previous board state.',
    code: `const LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function TicTacToe() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const squares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  const winner = calculateWinner(squares);

  const handleClick = (index) => {
    if (squares[index] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? 'X' : 'O';

    // Discard any "future" history if we'd jumped back and are now
    // branching off from a past move.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  // ...render board from squares, and a list of
  // "Go to move #n" buttons calling setCurrentMove(n)
}`,
    approach: 'The graded part is almost never the UI — it is whether state updates stay immutable (squares.slice() + reassigning the copy, not mutating squares[index] directly, since React compares by reference to decide whether to re-render) and whether history correctly truncates with history.slice(0, currentMove + 1) when a new move is made after having jumped back in time, so you cannot have two divergent futures in the same array.',
    answer: 'See code implementation.',
  },
  {
    id: 'autocomplete',
    title: 'R3: Autocomplete / Typeahead (debounce + AbortController)',
    description: 'Search-as-you-type against a real API: debounce keystrokes, support arrow-key/Enter/Escape navigation (ARIA combobox pattern), and — the part most candidates miss — handle out-of-order responses correctly.',
    code: `useEffect(() => {
  const trimmed = query.trim();
  if (!trimmed) { setResults([]); return; }

  const controller = new AbortController();
  const debounceId = setTimeout(() => {
    setIsLoading(true);
    fetch(\`\${USERS_ENDPOINT}?q=\${encodeURIComponent(trimmed)}\`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => { setResults(data); setIsOpen(true); })
      .catch((error) => {
        if (error.name !== 'AbortError') setResults([]);
      })
      .finally(() => setIsLoading(false));
  }, DEBOUNCE_MS);

  // Cancels both the pending debounce timer and, if it already fired,
  // the in-flight request - so a slow earlier response can never land
  // after a faster later one and overwrite fresher results.
  return () => {
    clearTimeout(debounceId);
    controller.abort();
  };
}, [query]);

function handleKeyDown(event) {
  if (event.key === 'ArrowDown') setActiveIndex((i) => (i + 1) % results.length);
  else if (event.key === 'ArrowUp') setActiveIndex((i) => (i - 1 + results.length) % results.length);
  else if (event.key === 'Enter' && activeIndex >= 0) handleSelect(results[activeIndex]);
  else if (event.key === 'Escape') setIsOpen(false);
}`,
    approach: 'Debouncing alone only reduces call *frequency* — it does not guarantee call *order* of responses. If request A (typed first, slower network) resolves after request B (typed later, faster), A\'s stale results can overwrite B\'s fresh ones unless every keystroke\'s effect cancels its own in-flight request via AbortController before the next one starts. The other half of the grading rubric is usually accessibility: role="combobox" with aria-expanded / aria-activedescendant on the input, and role="listbox" / role="option" on the results, not just a plain unstyled <ul>.',
    answer: 'See code implementation.',
  },
  {
    id: 'modal',
    title: 'R4: Accessible Modal (portal + focus trap)',
    description: 'Build a modal dialog rendered via a portal, that traps Tab focus inside itself while open, closes on Escape or a backdrop click, locks page scroll, and restores focus to whatever triggered it on close.',
    code: `function useFocusTrap(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    const previouslyFocused = document.activeElement;

    const focusables = () =>
      Array.from(container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      ));

    (focusables()[0] ?? container).focus();

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [containerRef]);
}

// Rendered with: createPortal(<div role="dialog" aria-modal="true">...</div>, document.body)`,
    approach: 'A ref is required here, not state — moving the browser\'s actual focus caret is an imperative DOM operation (.focus()) that no prop or piece of state can express declaratively. The trap walks the dialog\'s focusable elements on every Tab press and wraps focus from the last element back to the first (and vice-versa with Shift+Tab). Capturing document.activeElement before moving focus in is what lets it be restored correctly in the cleanup function when the modal closes.',
    answer: 'See code implementation.',
  },
  {
    id: 'todo-list',
    title: 'R5: Todo List (CRUD + localStorage)',
    description: 'Add, toggle, and delete todos; filter by all/active/completed; and persist the list to localStorage. Deceptively simple — graders watch for immutable state updates and stable list keys.',
    code: `function loadInitialTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function TodoList() {
  const [todos, setTodos] = useState(loadInitialTodos);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (text) =>
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }]);

  const handleToggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const handleDelete = (id) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  // ...render, filtered by the active "all/active/completed" tab
}`,
    approach: 'The tell for a weak submission is mutating in place (todos.push(...), todos[i].done = true) instead of .map()/.filter()/spread — React compares state by reference, so a mutated-in-place array can silently fail to trigger a re-render. crypto.randomUUID() gives a stable id independent of array position, unlike using the array index as key, which breaks once an item is deleted or reordered. localStorage.getItem is wrapped in try/catch because it can throw in private-browsing mode or when storage is disabled.',
    answer: 'See code implementation.',
  },
  {
    id: 'tabs',
    title: 'R6: Accessible Tabs (roving tabindex)',
    description: 'Build a tabbed interface implementing the WAI-ARIA Tabs pattern: role="tablist"/"tab"/"tabpanel", and arrow-key navigation that visibly moves keyboard focus between tabs, not just the active state.',
    code: `const tabRefs = useRef([]);

function handleKeyDown(event, index) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();

  let nextIndex = index;
  if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
  if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = tabs.length - 1;

  setActiveId(tabs[nextIndex].id);
  tabRefs.current[nextIndex]?.focus(); // imperatively move browser focus
}

// Each tab button: tabIndex={selected ? 0 : -1} so only the active
// tab is in the page's normal Tab order (roving tabindex).
// Panels stay mounted and are toggled with the "hidden" attribute,
// not conditionally rendered, so switching tabs never resets a
// panel's internal state.`,
    approach: 'setActiveId alone only updates which tab is logically selected (aria-selected, styling) — it does not move the browser\'s actual focus. Refs are needed to call .focus() directly on the newly-active tab\'s DOM node so a keyboard user\'s focus ring visibly follows the arrow key press, per the ARIA Authoring Practices "roving tabindex" pattern. Keeping every panel mounted (hidden attribute) instead of unmounting inactive ones avoids losing a panel\'s state — and avoids re-fetching data — every time you switch away and back.',
    answer: 'See code implementation.',
  },
  {
    id: 'fetch-table-filter',
    title: 'R7: Fetch + Table + Filter (useReducer + AbortController)',
    description: 'Fetch a list from an API, render it in a table, and filter it via a search box. Tests correct loading/error/cancellation handling, not just the happy path.',
    code: `function fetchReducer(state, action) {
  switch (action.type) {
    case 'loading': return { data: [], error: null, isLoading: true };
    case 'success': return { data: action.data, error: null, isLoading: false };
    case 'error':   return { data: [], error: action.error, isLoading: false };
    default: return state;
  }
}

function useFetch(url) {
  const [state, dispatch] = useReducer(fetchReducer, { data: [], error: null, isLoading: true });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'loading' });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed with status \${res.status}\`);
        return res.json();
      })
      .then((data) => dispatch({ type: 'success', data }))
      .catch((error) => {
        if (error.name !== 'AbortError') dispatch({ type: 'error', error });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}`,
    approach: 'useReducer collapses loading/error/data into one atomic transition, so you can never end up in an impossible combination like isLoading: true with a stale error still set — which is exactly what happens with three independent useState calls updated separately. AbortController cancels an in-flight request on unmount or when the url changes, preventing a slow stale response from overwriting fresh state. The single most common bug here: calling setIsLoading(false) synchronously right after fetch(), instead of inside .then()/.finally() — fetch is async, so that flips loading off before the response ever arrives.',
    answer: 'See code implementation.',
  },
  {
    id: 'use-suspense',
    title: 'R8: Data Fetching with use() + Suspense',
    description: 'Solve the same fetch-and-render problem using React 19\'s use() hook and Suspense instead of manual loading state — tests whether a candidate knows the newer data-fetching primitives and their trade-offs.',
    code: `// Created once at module scope: use() needs a stable promise reference,
// otherwise a new promise every render would re-suspend forever.
const usersPromise = fetch(USERS_ENDPOINT).then((res) => {
  if (!res.ok) throw new Error(\`Request failed with status \${res.status}\`);
  return res.json();
});

function UsersTable() {
  const users = use(usersPromise); // suspends until resolved, no manual isLoading
  return <table>{/* render users */}</table>;
}

// use()/Suspense throw during render on failure, and React still has
// no hook-based error boundary - only a class component can catch it.
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) return <p role="alert">{this.state.error.message}</p>;
    return this.props.children;
  }
}

// <ErrorBoundary><Suspense fallback={<Loading />}><UsersTable /></Suspense></ErrorBoundary>`,
    approach: 'Trade-off worth stating out loud in an interview: use() removes all manual loading/error state, but it is also less flexible than a hand-rolled useReducer/useEffect hook — retry-on-demand, cancellation on unmount, or a dynamic URL all require re-introducing caching/keying logic yourself (which is exactly what a data-fetching library like React Query exists to provide). use() is a strong fit for a static, one-shot fetch; anything more dynamic and the useReducer version earns its extra code back.',
    answer: 'See code implementation.',
  },
  {
    id: 'sibling-data-passing',
    title: 'R9: Passing Data Between Sibling Components',
    description: 'Given <Search /> and <ProductList /> as sibling components (not parent/child), what are the ways to get searchValue from Search into ProductList? Tests whether a candidate knows more than one tool and, more importantly, when to reach for which.',
    code: `// 1. Lift state up to the common parent (the default answer)
function App() {
  const [searchValue, setSearchValue] = useState('');
  return (
    <>
      <Search value={searchValue} onChange={setSearchValue} />
      <ProductList searchValue={searchValue} />
    </>
  );
}

// 2. React Context - same idea, but skips prop drilling through a
// deep tree between the common ancestor and the two components.
const SearchContext = createContext(null);
function SearchProvider({ children }) {
  const [value, setValue] = useState('');
  return (
    <SearchContext.Provider value={{ value, setValue }}>
      {children}
    </SearchContext.Provider>
  );
}

// 3. URL / query params - both components read/write the same URL,
// so the value is shareable and survives a page refresh.
const [searchParams, setSearchParams] = useSearchParams(); // react-router
const searchValue = searchParams.get('q') ?? '';

// 4. A global store (Zustand-style) - for a value that needs to be
// read or written from many unrelated parts of the app, not just
// these two components.
const useSearchStore = create((set) => ({
  value: '',
  setValue: (v) => set({ value: v }),
}));`,
    approach: 'All four solve the same underlying problem: two siblings cannot pass props directly, so the shared value has to live somewhere both can reach. Lifting state to the nearest common ancestor is the default — no new infrastructure, and it is exactly what "lift state up" means in the React docs. Context is the same pattern applied when that ancestor is several levels away and prop drilling would actually hurt (3+ levels), not preemptively. URL params trade a little ceremony for a real product win: the search becomes bookmarkable and survives a refresh, which local state never does. A global store (Zustand/Redux/Jotai) is only justified once searchValue needs to be read or written from unrelated parts of the app — reaching for one by default for a two-component case is over-engineering.',
    answer: 'Prefer lifting state to the nearest common parent by default; reach for Context only once prop drilling gets deep; prefer URL state whenever the value should be shareable or survive a refresh; reach for a global store only once more than these two components need it.',
  },
  {
    id: 'product-grid-all-in-one',
    title: 'R10: Product Grid — Fetch, Type, and Memoize (all together)',
    description: 'Combine everything above into one page: fetch a paginated product API with typed interfaces, clean up the in-flight request properly on unmount, and apply React.memo / useCallback / useMemo correctly — only where they actually prevent wasted work, not decoratively.',
    code: `interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  category: string;
  stock: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

type ProductsAction =
  | { type: 'loading' }
  | { type: 'success'; products: Product[] }
  | { type: 'error'; error: string };

function productsReducer(state, action: ProductsAction) {
  switch (action.type) {
    case 'loading': return { products: [], error: null, isLoading: true };
    case 'success': return { products: action.products, error: null, isLoading: false };
    case 'error':   return { products: [], error: action.error, isLoading: false };
    default: return state;
  }
}

function useProducts(url: string) {
  const [state, dispatch] = useReducer(productsReducer, { products: [], error: null, isLoading: true });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'loading' });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`Request failed with status \${res.status}\`);
        return res.json() as Promise<ProductsResponse>;
      })
      .then((data) => dispatch({ type: 'success', products: data.products }))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return; // our own cleanup
        dispatch({ type: 'error', error: error instanceof Error ? error.message : 'Something went wrong' });
      });

    return () => controller.abort(); // cancels the in-flight request on unmount / url change
  }, [url]);

  return state;
}

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

// memo: this renders in a 12-item list. Without it, selecting one
// card re-renders all twelve, since the parent re-renders on every
// selection change.
const ProductCard = memo(({ product, isSelected, onSelect }: ProductCardProps) => (
  <li className={isSelected ? 'product-card product-card--selected' : 'product-card'}>
    <button onClick={() => onSelect(product.id)} aria-pressed={isSelected}>
      <img src={product.thumbnail} alt={product.title} loading="lazy" width={200} height={200} />
      <h3>{product.title}</h3>
      <span>\${product.price.toFixed(2)}</span>
      <span>★ {product.rating.toFixed(1)}</span>
      <span>{product.stock > 0 ? \`\${product.stock} in stock\` : 'Out of stock'}</span>
    </button>
  </li>
));

function App() {
  const { products, error, isLoading } = useProducts(PRODUCTS_ENDPOINT);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // useCallback: keeps this reference stable so it doesn't defeat
  // ProductCard's memo on every App re-render.
  const handleSelect = useCallback((id: number) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  // useMemo: only recomputed when \`products\` changes, not on every
  // render - e.g. not when selecting a card.
  const summary = useMemo(() => {
    if (products.length === 0) return null;
    const inStock = products.filter((p) => p.stock > 0).length;
    const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    return { total: products.length, inStock, avgRating };
  }, [products]);

  if (isLoading) return <p role="status">Loading products…</p>;
  if (error) return <p role="alert">Couldn't load products: {error}</p>;

  return (
    <section>
      {summary && (
        <p>{summary.total} products · {summary.inStock} in stock · avg rating {summary.avgRating.toFixed(1)}</p>
      )}
      <ul className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={product.id === selectedId}
            onSelect={handleSelect}
          />
        ))}
      </ul>
    </section>
  );
}`,
    approach: 'Four pieces have to work together correctly, not in isolation: typed interfaces that match exactly what the API\'s select= param returns rather than a guessed shape; useReducer collapsing loading/error/data into one atomic transition instead of three independent useState calls that could disagree with each other; AbortController.abort() in the effect\'s cleanup function — which is what "clean up properly" actually means here — cancelling the in-flight request on unmount or when url changes, and explicitly swallowing the resulting AbortError rather than surfacing it as a UI error; and memo/useCallback/useMemo applied only where a genuine parent re-render (selecting a card) would otherwise waste work re-rendering the other eleven cards or recomputing a derived stat that did not need to change. Sprinkling memoization everywhere without a concrete reason would be the wrong lesson to take from this.',
    answer: 'See code implementation.',
  },
];

export function ReactCodingModule() {
  const [activeId, setActiveId] = useState(codingQuestions[0].id);
  const activeQuestion = codingQuestions.find(q => q.id === activeId);

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">React Coding Questions</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">The most commonly asked React interview coding exercises — timers, accessible components, data fetching, and state management patterns.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-2">
          {codingQuestions.map(q => (
            <button
              key={q.id}
              onClick={() => setActiveId(q.id)}
              className={`w-full text-left px-4 py-4 rounded-xl border transition-all duration-300 ${
                activeId === q.id
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-700 dark:text-rose-300 shadow-md shadow-rose-500/10'
                  : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-rose-300 dark:hover:border-white/20 hover:bg-rose-50 dark:hover:bg-white/10'
              }`}
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
