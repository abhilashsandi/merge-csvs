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
  // ─── 1. CSS FUNDAMENTALS ───
  {
    title: '1. CSS Fundamentals',
    color: 'sky',
    intro: 'Before Tailwind, the fundamentals: the box model, the cascade, and specificity. Interviewers use these to check whether you understand what a utility class is actually doing under the hood.',
    questions: [
      {
        q: 'Explain the CSS box model, and the difference between content-box and border-box.',
        a: 'Every element is a box made of content, padding, border, and margin. box-sizing controls how width/height are calculated relative to those layers.',
        list: [
          '**content-box (default):** width/height apply only to the content area. Padding and border are added ON TOP, so the element visually grows larger than the width you set.',
          '**border-box:** width/height include padding and border. Setting width: 200px with 20px padding still renders a 200px-wide box — padding eats into the content area instead of growing it.',
        ],
        hint: 'Tailwind sets `box-sizing: border-box` globally via Preflight (its CSS reset), which is why `w-48 p-4` behaves predictably instead of growing past 48 units — this is a very common "why does Tailwind do this" interview question.',
      },
      {
        q: 'How is CSS specificity calculated, and how does the cascade resolve conflicting rules?',
        a: 'Specificity is a four-part score: (inline styles, IDs, classes/attributes/pseudo-classes, elements/pseudo-elements). The rule with the higher score wins regardless of source order; if scores are equal, the rule that appears later in the stylesheet wins.',
        code: `#nav .item { color: blue; }   /* specificity: 0-1-1-0 */
.item.active { color: red; }  /* specificity: 0-0-2-0 */
/* #nav .item wins — one ID beats any number of classes */`,
        hint: '!important overrides specificity entirely (highest priority short of inline styles + !important). Tailwind avoids ever needing !important in normal usage because every utility class has equal, low specificity (0-0-1-0) — conflicts are resolved by CSS source order instead, which is why utility order in your stylesheet\'s generated output matters more than the order you write classNames in JSX.',
      },
      {
        q: 'What is the difference between em and rem units?',
        a: 'em is relative to the font-size of its own element (compounding when nested); rem is relative to the root (<html>) font-size only — always the same absolute value no matter how deeply nested.',
        hint: 'Nested em values compound unexpectedly (a 1.2em inside a 1.2em inside a 1.2em element keeps growing), which is why rem is generally preferred for consistent sizing — and exactly why Tailwind\'s default spacing/sizing scale (p-4, text-lg, etc.) is defined in rem, not em.',
      },
    ],
  },

  // ─── 2. FLEXBOX & GRID ───
  {
    title: '2. Flexbox & Grid',
    color: 'blue',
    questions: [
      {
        q: 'When would you reach for Flexbox vs CSS Grid?',
        a: 'Flexbox is one-dimensional (a single row or column) and content-driven — great for distributing items along one axis, like a navbar or a button group. Grid is two-dimensional and layout-driven — great for defining an overall page/component structure with explicit rows and columns.',
        list: [
          '**Flexbox:** justify-content/align-items for distributing space along the main/cross axis; flex-grow/flex-shrink for how items resize.',
          '**Grid:** grid-template-columns/rows define explicit tracks; items can span multiple tracks, overlap, and be placed by line number or named area.',
        ],
        hint: "A practical rule interviewers like: 'if I'm laying out the items inside one component, Flexbox; if I'm laying out the page/major regions, Grid.'",
      },
      {
        q: 'How do the Tailwind utilities map onto Flexbox properties?',
        a: 'Each Tailwind utility is a thin, memorable alias for the underlying CSS property/value.',
        code: `<div class="flex items-center justify-between gap-4">
  <!-- display: flex; align-items: center; justify-content: space-between; gap: 1rem; -->
  <span>Logo</span>
  <nav class="flex gap-2">...</nav>
</div>`,
        list: [
          '**justify-* → justify-content** (main-axis alignment: justify-start/center/between/around/evenly)',
          '**items-* → align-items** (cross-axis alignment: items-start/center/end/stretch)',
          '**flex-1 → flex: 1 1 0%** (grow and shrink equally, ignoring initial size)',
        ],
      },
      {
        q: 'How do you build a responsive grid that goes from 1 to 2 to 4 columns with Tailwind?',
        a: 'Stack Tailwind\'s mobile-first responsive prefixes onto grid-cols-* — each breakpoint only overrides what changes above it.',
        code: `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- 1 column below 640px, 2 columns from 640px, 4 columns from 1024px -->
</div>`,
      },
    ],
  },

  // ─── 3. RESPONSIVE DESIGN ───
  {
    title: '3. Responsive Design',
    color: 'indigo',
    questions: [
      {
        q: 'What does "mobile-first" responsive design mean, and how does it show up in Tailwind\'s breakpoint syntax?',
        a: 'Mobile-first means your base (unprefixed) styles target the smallest screen, and each breakpoint prefix (sm:, md:, lg:, xl:, 2xl:) adds an override for "this size and up" — not "only at this size."',
        code: `<p class="text-sm md:text-base lg:text-lg">
  <!-- text-sm applies below 768px.
       md:text-base applies from 768px up (overriding text-sm).
       lg:text-lg applies from 1024px up (overriding md:text-base). -->
</p>`,
        hint: 'A common mistake: assuming md: means "only on medium screens." It actually means "medium and everything larger," unless you explicitly narrow it with something like md:max-lg:.',
      },
      {
        q: 'What is a CSS container query, and how does it differ from a media query?',
        a: 'A media query responds to the viewport size. A container query responds to the size of a specific containing element, regardless of the viewport — letting the same component adapt differently depending on where it\'s placed (e.g. a card in a narrow sidebar vs. a wide main column).',
        code: `<div class="@container">
  <div class="flex flex-col @lg:flex-row">
    <!-- Switches to a row layout once the CONTAINER (not the viewport) is >= the lg container size -->
  </div>
</div>`,
        hint: "Tailwind's @container/@lg: syntax is the container-query equivalent of sm:/lg: for viewport media queries — a genuinely modern CSS feature, good to know it exists distinct from viewport-based responsiveness.",
      },
    ],
  },

  // ─── 4. TAILWIND CORE CONCEPTS ───
  {
    title: '4. Tailwind Core Concepts',
    color: 'cyan',
    intro: 'Tailwind is a utility-first framework: instead of writing custom CSS classes with semantic names, you compose small, single-purpose utility classes directly in your markup.',
    questions: [
      {
        q: 'What does "utility-first" actually mean, and what problem does it solve compared to traditional semantic CSS?',
        a: 'Instead of naming a class (.card, .btn-primary) and writing custom CSS for it, you apply small utilities (p-4, rounded-lg, bg-blue-500) directly in the markup. This avoids the classic problem of a growing, hard-to-maintain global stylesheet where unrelated components accidentally share (and break each other via) the same custom class names.',
        list: [
          'No more inventing/naming a new class for every visual variation.',
          "No CSS specificity fights between component stylesheets — every utility has equal, minimal specificity.",
          "Styles live next to the markup that uses them, so deleting a component's JSX also deletes its styling — no orphaned, unused CSS accumulating over time.",
        ],
        hint: "The standard pushback interviewers raise: 'doesn't this make the markup ugly/verbose?' — a good answer acknowledges the trade-off and mentions component extraction (a <Button> React component) as how Tailwind projects avoid repeating the same utility string everywhere.",
      },
      {
        q: 'How does Tailwind\'s JIT (Just-In-Time) engine generate CSS, and why does the content/content-path config matter?',
        a: "Tailwind doesn't ship a giant precompiled CSS file with every possible utility. Instead, it scans your actual source files (per the `content` config) for class name strings, and generates only the CSS for classes that are actually used — on demand, at build time.",
        code: `// tailwind.config.js
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'], // Tailwind only generates CSS for classes found in these files
  theme: { extend: {} },
};`,
        hint: 'This is why a class name built via string concatenation (`bg-${color}-500`) often silently fails to generate any CSS — the JIT scanner does a static text search for whole class name strings, it does not execute your JavaScript, so it never sees the interpolated result. The fix is to write out the complete class name literally, or map to a lookup table of full strings.',
      },
      {
        q: 'What are arbitrary values in Tailwind, and when are they appropriate?',
        a: 'Square-bracket syntax lets you use a one-off value outside the design system\'s predefined scale, without writing custom CSS.',
        code: `<div class="top-[117px] bg-[#1da1f2] grid-cols-[1fr_2fr_1fr]">
  <!-- one-off pixel offset, an exact brand hex color, and a custom grid track layout -->
</div>`,
        hint: "Treat these as an escape hatch, not a default habit — reaching for arbitrary values everywhere defeats the point of having a constrained design scale (consistent spacing/colors across the app). If the same arbitrary value shows up repeatedly, that's a sign it belongs in tailwind.config.js's theme instead.",
      },
    ],
  },

  // ─── 5. VARIANTS: RESPONSIVE, STATE & DARK MODE ───
  {
    title: '5. Responsive & State Variants',
    color: 'violet',
    questions: [
      {
        q: 'How do hover:, focus:, and group-hover: differ?',
        a: 'hover: and focus: apply a utility only when that specific element is in that pseudo-class state. group-hover: applies a utility to a CHILD element when its ancestor (marked with the group class) is hovered — letting one hover trigger a style change on a different element.',
        code: `<div class="group border p-4">
  <h3 class="text-slate-900">Card title</h3>
  <p class="text-slate-500 group-hover:text-slate-700">
    <!-- This paragraph's color changes when the PARENT card is hovered, not itself -->
  </p>
</div>`,
        hint: "peer works the same way but for SIBLING elements instead of a parent/child relationship — e.g. showing a validation message when a sibling input is peer-invalid:.",
      },
      {
        q: 'How does dark: mode work in Tailwind, and what are the two strategies for triggering it?',
        a: 'dark: is a variant, applied the same way as hover: or lg: — it just activates based on dark mode being "on" instead of a pseudo-class or breakpoint.',
        code: `// tailwind.config.js
export default {
  darkMode: 'class', // vs. 'media' (follows OS preference automatically)
};

// Usage — identical class-prefix pattern to every other variant
<div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">`,
        list: [
          "**darkMode: 'media':** Automatically follows the OS/browser's prefers-color-scheme — zero JS needed, but the user can't override it within your app.",
          "**darkMode: 'class':** Dark mode is toggled by adding a `.dark` class to a parent element (usually <html>) via your own JS — required if you want an in-app light/dark toggle that overrides system preference.",
        ],
      },
    ],
  },

  // ─── 6. CUSTOMIZATION & THEMING ───
  {
    title: '6. Customization & Theming',
    color: 'fuchsia',
    questions: [
      {
        q: 'What does @apply do, and when should (and shouldn\'t) you reach for it?',
        a: '@apply lets you compose multiple existing utility classes into a single custom CSS class, inside an actual CSS file.',
        code: `/* globals.css */
.btn-primary {
  @apply px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700;
}`,
        hint: "Reach for @apply when the same long utility string is genuinely repeated across many places you can't easily componentize (e.g. inside markdown-generated HTML, or a design system's base CSS) — not as a default habit, since it reintroduces the maintenance problem utility-first CSS was meant to avoid (a growing custom stylesheet). Prefer extracting a React component over @apply whenever you're already in JSX.",
      },
      {
        q: 'How do you extend Tailwind\'s default theme (colors, spacing, fonts) without losing the defaults?',
        a: 'Use theme.extend in the config, not theme directly — extend merges with the defaults, while directly overriding theme.colors/theme.spacing replaces the entire default scale.',
        code: `// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#6366f1', dark: '#4338ca' }, // adds bg-brand, text-brand-dark, etc.
      },
      spacing: {
        18: '4.5rem', // adds p-18, m-18, gap-18, alongside the existing scale
      },
    },
  },
};`,
        hint: "Putting colors directly under theme: { colors: {...} } (not theme.extend) REMOVES every default Tailwind color — a very common mistake that suddenly makes bg-red-500 stop working across the whole codebase.",
      },
    ],
  },

  // ─── 7. PERFORMANCE & BEST PRACTICES ───
  {
    title: '7. Performance & Best Practices',
    color: 'emerald',
    questions: [
      {
        q: 'Why does Tailwind\'s production CSS bundle stay small regardless of how large the app grows?',
        a: "Because of the JIT content-scanning model: the final CSS only contains the utility classes that literally appear as strings somewhere in the scanned source files. Adding more components doesn't linearly grow the CSS bundle the way traditional per-component stylesheets do — it only grows by the set of NEW unique utility combinations introduced.",
      },
      {
        q: 'What is the trade-off of extracting repeated utility strings into a React component vs. using @apply?',
        a: "Both solve 'don't repeat this long className string everywhere,' but a component extraction (e.g. <Button variant=\"primary\" />) keeps the styling co-located with markup AND gives you a typed, composable API (props, variants) — whereas @apply just gives you a new CSS class name, with none of a component's logic/composition benefits.",
        hint: "In a React/Next.js codebase specifically, component extraction is almost always the better default over @apply — @apply mainly earns its keep in non-component contexts, like styling raw HTML from a CMS or markdown.",
      },
      {
        q: 'How would you keep a long list of conditional Tailwind classes readable and correct?',
        a: 'Use a small utility library (clsx or tailwind-merge/cva) instead of manually concatenating strings and ternaries — string concatenation is error-prone (extra/missing spaces) and doesn\'t resolve conflicting utilities (e.g. two different padding classes both present at once).',
        code: `import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function Button({ variant, className }) {
  return (
    <button
      className={twMerge(
        clsx(
          'px-4 py-2 rounded-lg font-semibold',
          variant === 'primary' && 'bg-indigo-600 text-white',
          variant === 'ghost' && 'bg-transparent text-indigo-600'
        ),
        className // caller-provided overrides win, thanks to twMerge resolving conflicts
      )}
    />
  );
}`,
        hint: 'twMerge specifically resolves conflicting Tailwind classes (e.g. "px-4" and a caller-provided "px-8") by keeping only the last one for that CSS property — plain string concatenation would just apply both classes and let CSS source order decide, which is much less predictable.',
      },
    ],
  },
];

/* ─────────────────────────────────────
   SECTION QUIZZES
   ───────────────────────────────────── */
export const sectionQuizzes: Record<string, QuizQuestion[]> = {
  '1. CSS Fundamentals': [
    {
      question: 'With box-sizing: border-box and width: 200px; padding: 20px, how wide does the element actually render?',
      options: ['200px', '240px', '160px', '220px'],
      correctIndex: 0,
      explanation: 'border-box includes padding and border inside the specified width — the content area shrinks to fit, but the box stays exactly 200px wide.',
    },
  ],
  '4. Tailwind Core Concepts': [
    {
      question: 'Why does `className={`bg-${color}-500`}` often fail to produce any styling in a real Tailwind build?',
      options: [
        'Template literals are not supported in JSX',
        "The JIT scanner does a static text search for full class names and never evaluates the interpolated string",
        'Tailwind does not support dynamic colors at all',
        'It only fails in production, not in development',
      ],
      correctIndex: 1,
      explanation: 'The build-time scanner looks for literal class name substrings in your source files — it does not execute your code, so an interpolated class name it never sees as a complete string is never generated.',
    },
  ],
  '6. Customization & Theming': [
    {
      question: 'What happens if you define colors directly under `theme: { colors: {...} }` instead of `theme: { extend: { colors: {...} } }`?',
      options: [
        'Nothing different — they behave identically',
        'It merges your colors with the defaults',
        "It REPLACES Tailwind's entire default color palette with only what you defined",
        'It only affects dark mode colors',
      ],
      correctIndex: 2,
      explanation: 'theme.colors (without extend) is a full override, not a merge — every default color utility (bg-red-500, text-blue-600, etc.) stops working unless you re-declare it yourself.',
    },
  ],
};

export const consoleExamples: {
  sectionTitle: string;
  title: string;
  code: string;
  output: string[];
}[] = [];

export const sectionDiagrams: Record<string, { title: string; svg: string }> = {};
