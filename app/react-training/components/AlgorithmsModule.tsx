"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Step = {
  line: string;
  explanation: string;
};

type Algorithm = {
  id: string;
  title: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  complexityExplained: string;
  code: string;
  steps: Step[];
  interviewTips: string[];
  followUps: string[];
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const algorithms: Algorithm[] = [
  // ── 1. Two Sum ────────────────────────────────────────────────────────────
  {
    id: 'two-sum',
    title: '1. Two Sum',
    description:
      'Find two numbers in an array that add up to a target. A hash map stores previously seen values so each look-up is O(1), turning the naive O(n^2) brute-force into a single O(n) pass.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityExplained:
      'We visit each element exactly once -> O(n) time. In the worst case we store every element in the map before finding the pair -> O(n) extra space.',
    code: [
      'function twoSum(nums, target) {',
      '  const numMap = new Map();            // 1',
      '',
      '  for (let i = 0; i < nums.length; i++) {',
      '    const complement = target - nums[i]; // 2',
      '    if (numMap.has(complement)) {        // 3',
      '      return [numMap.get(complement), i];// 4',
      '    }',
      '    numMap.set(nums[i], i);              // 5',
      '  }',
      '',
      '  return [];                             // 6',
      '}',
    ].join('\n'),
    steps: [
      {
        line: 'const numMap = new Map();',
        explanation:
          'Create a hash map. Keys = numbers we have already seen; values = their indices. This gives us O(1) average look-up time.',
      },
      {
        line: 'const complement = target - nums[i];',
        explanation:
          'Calculate what partner value is needed to reach the target. If target = 9 and nums[i] = 4, we need 5.',
      },
      {
        line: 'if (numMap.has(complement))',
        explanation:
          'Check whether that partner was already stored. If yes, we found our pair — no need to keep scanning.',
      },
      {
        line: 'return [numMap.get(complement), i];',
        explanation:
          'Retrieve the earlier index of the complement and return it alongside the current index i.',
      },
      {
        line: 'numMap.set(nums[i], i);',
        explanation:
          'If no complement found yet, save the current number and its index for future iterations.',
      },
      {
        line: 'return [];',
        explanation:
          'Problem guarantees exactly one answer, so this fallback should never be reached in practice.',
      },
    ],
    interviewTips: [
      'Always clarify: Can there be duplicate numbers? Can I use the same element twice?',
      'The hash-map approach is the canonical O(n) answer. Starting with brute-force and optimising shows your thinking.',
      'Sort + two-pointer achieves O(1) space but O(n log n) time — worth mentioning as a trade-off.',
    ],
    followUps: [
      'What if you need all pairs that sum to the target (not just one)?',
      'How would you solve Two Sum II where the input is already sorted?',
      'Extend to 3-Sum: find all triplets summing to zero.',
    ],
  },

  // ── 2. Valid Parentheses ──────────────────────────────────────────────────
  {
    id: 'valid-parentheses',
    title: '2. Valid Parentheses',
    description:
      'Determine if a bracket string is valid. A stack tracks unmatched opening brackets: push expected closing brackets on open, pop-and-compare on close. If the stack is empty at the end, the string is valid.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityExplained:
      'We scan every character once -> O(n) time. The stack can hold at most n/2 entries (all opening brackets) -> O(n) space.',
    code: [
      'function isValid(s) {',
      "  const stack = [];",
      "  const map = { '(': ')', '[': ']', '{': '}' }; // 1",
      '',
      '  for (let i = 0; i < s.length; i++) {',
      '    if (map[s[i]]) {              // 2',
      '      stack.push(map[s[i]]);      // 3',
      '    } else {',
      '      if (s[i] !== stack.pop()) { // 4',
      '        return false;             // 5',
      '      }',
      '    }',
      '  }',
      '',
      '  return stack.length === 0;      // 6',
      '}',
    ].join('\n'),
    steps: [
      {
        line: "const map = { '(': ')', '[': ']', '{': '}' };",
        explanation:
          'A lookup table mapping each opening bracket to its expected closing counterpart. This avoids chained if/else and keeps the code clean.',
      },
      {
        line: 'if (map[s[i]])',
        explanation:
          'If the current character is a key in the map it is an opening bracket. map[s[i]] returns undefined (falsy) for closing brackets.',
      },
      {
        line: 'stack.push(map[s[i]]);',
        explanation:
          'Push the EXPECTED closing bracket onto the stack, not the opening bracket itself. This simplifies the comparison later.',
      },
      {
        line: 'if (s[i] !== stack.pop())',
        explanation:
          'Pop the top of the stack (the expected closer) and compare it to the current character. If they differ the string is invalid.',
      },
      {
        line: 'return false;',
        explanation:
          'Mismatch detected — immediately bail out. Also covers the edge case where the stack was empty (pop returns undefined).',
      },
      {
        line: 'return stack.length === 0;',
        explanation:
          'After processing all characters, any leftover entries in the stack mean unclosed brackets. Only return true if the stack is empty.',
      },
    ],
    interviewTips: [
      'Think aloud: "I need to match the most recent unmatched opener — that screams stack."',
      'Edge cases to mention: empty string (return true), string starting with a closer, odd-length strings.',
      'Pushing the expected closer (not the opener) halves the comparison logic — interviewers notice that elegance.',
    ],
    followUps: [
      'What if the input contains non-bracket characters that should be ignored?',
      'Minimum add to make parentheses valid (LeetCode 921).',
      'Longest valid parentheses substring (LeetCode 32).',
    ],
  },

  // ── 3. Merge Intervals ────────────────────────────────────────────────────
  {
    id: 'merge-intervals',
    title: '3. Merge Intervals',
    description:
      'Merge all overlapping intervals. Sort by start time first — this guarantees that any overlap can only occur between consecutive intervals, so a single left-to-right pass is enough.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    complexityExplained:
      'Sorting dominates at O(n log n). The subsequent linear scan is O(n). Output array holds at most n intervals -> O(n) space.',
    code: [
      'function merge(intervals) {',
      '  if (!intervals.length) return [];',
      '',
      '  intervals.sort((a, b) => a[0] - b[0]); // 1',
      '  const result = [intervals[0]];          // 2',
      '',
      '  for (let i = 1; i < intervals.length; i++) {',
      '    const current    = intervals[i];',
      '    const lastMerged = result[result.length - 1]; // 3',
      '',
      '    if (current[0] <= lastMerged[1]) {            // 4',
      '      lastMerged[1] = Math.max(lastMerged[1], current[1]); // 5',
      '    } else {',
      '      result.push(current);                       // 6',
      '    }',
      '  }',
      '',
      '  return result;',
      '}',
    ].join('\n'),
    steps: [
      {
        line: 'intervals.sort((a, b) => a[0] - b[0]);',
        explanation:
          'Sort ascending by start value. After sorting, any two overlapping intervals must be neighbours, which makes the merge loop correct with a simple peek at the last element.',
      },
      {
        line: 'const result = [intervals[0]];',
        explanation:
          'Seed the output with the first interval. We will grow it by either extending its end or appending new non-overlapping intervals.',
      },
      {
        line: 'const lastMerged = result[result.length - 1];',
        explanation:
          'Always compare the current interval against the LAST entry in result — that is the most recently merged (and potentially extendable) interval.',
      },
      {
        line: 'if (current[0] <= lastMerged[1])',
        explanation:
          'Overlap test: if the current interval starts on or before the last merged interval ends, they overlap.',
      },
      {
        line: 'lastMerged[1] = Math.max(lastMerged[1], current[1]);',
        explanation:
          'Extend the end of the last merged interval. We use Math.max because the current interval could be completely contained inside lastMerged (e.g., [1,10] and [2,3]).',
      },
      {
        line: 'result.push(current);',
        explanation:
          'No overlap — start a fresh interval in the result array.',
      },
    ],
    interviewTips: [
      'Always ask: "Are the intervals sorted?" If not, sorting is mandatory.',
      'Watch out for contained intervals — Math.max handles that edge case automatically.',
      'This pattern (sort + greedy scan) reappears in many interval problems: Insert Interval, Meeting Rooms, etc.',
    ],
    followUps: [
      'Insert Interval: given a sorted list and a new interval, insert and merge (LeetCode 57).',
      'Meeting Rooms II: find the minimum number of conference rooms required (LeetCode 253).',
      'Non-overlapping Intervals: remove the fewest intervals to make all non-overlapping (LeetCode 435).',
    ],
  },

  // ── 4. Group Anagrams ─────────────────────────────────────────────────────
  {
    id: 'group-anagrams',
    title: '4. Group Anagrams',
    description:
      'Group strings that are anagrams of each other. Sorting the characters of a word produces a canonical key shared by all its anagrams, making a hash map the perfect grouping tool.',
    timeComplexity: 'O(n * k log k)',
    spaceComplexity: 'O(n * k)',
    complexityExplained:
      'For each of the n strings we sort its k characters in O(k log k). Map storage holds all characters of all strings -> O(n*k). If k is bounded (e.g., alphabet size), time approaches O(n).',
    code: [
      'function groupAnagrams(strs) {',
      '  const map = new Map();              // 1',
      '',
      '  for (const str of strs) {',
      "    const sorted = str              // 2",
      "      .split('')",
      '      .sort()',
      "      .join('');",
      '',
      '    if (!map.has(sorted)) {         // 3',
      '      map.set(sorted, []);',
      '    }',
      '    map.get(sorted).push(str);      // 4',
      '  }',
      '',
      '  return Array.from(map.values()); // 5',
      '}',
    ].join('\n'),
    steps: [
      {
        line: 'const map = new Map();',
        explanation:
          'The map groups strings by their sorted-character signature. Keys are sorted strings (e.g., "aet"); values are arrays of original strings.',
      },
      {
        line: "const sorted = str.split('').sort().join('');",
        explanation:
          'Split into individual characters, sort alphabetically, and rejoin. "eat", "tea", and "ate" all produce "aet". This is the anagram fingerprint.',
      },
      {
        line: 'if (!map.has(sorted)) { map.set(sorted, []); }',
        explanation:
          'Lazy-initialise the bucket for this key. If we have never seen this fingerprint before, create an empty array.',
      },
      {
        line: 'map.get(sorted).push(str);',
        explanation:
          'Append the original (unsorted) string to the correct bucket.',
      },
      {
        line: 'return Array.from(map.values());',
        explanation:
          'Collect all buckets into a flat array of arrays and return.',
      },
    ],
    interviewTips: [
      'Alternative key: a frequency array of 26 characters — O(k) instead of O(k log k) per word.',
      'If k is very large, the frequency-count key beats sort. Mention this trade-off.',
      'This pattern (canonical form as hash key) appears in "valid anagram", "find all anagrams in a string", etc.',
    ],
    followUps: [
      'Find all anagrams in a string (LeetCode 438) — sliding window instead of sort.',
      'What if we need to group by palindrome anagrams?',
      'How would you handle Unicode or multi-byte characters?',
    ],
  },

  // ── 5. Product of Array Except Self ───────────────────────────────────────
  {
    id: 'product-except-self',
    title: '5. Product Except Self',
    description:
      'Return an array where output[i] is the product of every element except nums[i], without division. Two passes — left-to-right (prefix products) and right-to-left (postfix products) — fill the answer in O(n) time and O(1) extra space.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    complexityExplained:
      'Two linear passes -> O(n) time. We reuse the result array for both passes so no auxiliary array is needed -> O(1) extra space (the output array is not counted by convention).',
    code: [
      'function productExceptSelf(nums) {',
      '  const n = nums.length;',
      '  const result = new Array(n).fill(1); // 1',
      '',
      '  let left = 1;',
      '  for (let i = 0; i < n; i++) {       // 2',
      '    result[i] = left;',
      '    left *= nums[i];',
      '  }',
      '',
      '  let right = 1;',
      '  for (let i = n - 1; i >= 0; i--) { // 3',
      '    result[i] *= right;',
      '    right *= nums[i];',
      '  }',
      '',
      '  return result;',
      '}',
    ].join('\n'),
    steps: [
      {
        line: 'const result = new Array(n).fill(1);',
        explanation:
          'Initialise with 1s — the multiplicative identity. We will overwrite each slot with the product of its left neighbours, then multiply in right neighbours.',
      },
      {
        line: 'result[i] = left; left *= nums[i];',
        explanation:
          'First pass (left to right): result[i] stores the product of all elements to the LEFT of i. We accumulate left as we move right. After this pass, result = [1, nums[0], nums[0]*nums[1], ...].',
      },
      {
        line: 'result[i] *= right; right *= nums[i];',
        explanation:
          'Second pass (right to left): multiply each result[i] (which already holds the left product) by right — the running product of all elements to the RIGHT of i. This gives us left x right = product of everything except nums[i].',
      },
    ],
    interviewTips: [
      'The key insight: product_except_self[i] = prefix_product[i-1] x suffix_product[i+1].',
      'If division were allowed you could total-product / nums[i], but zeros break that approach — always mention this.',
      'Show the two-pass on a small example ([1,2,3,4]) on the whiteboard to make the pattern concrete.',
    ],
    followUps: [
      'What if the array contains zeros — how does your approach handle it?',
      'Maximum product subarray (LeetCode 152) — negative numbers add an interesting twist.',
      'Can you do it in a single pass? (Hint: you cannot do both prefix and postfix simultaneously without extra space.)',
    ],
  },

  // ── 6. Longest Substring Without Repeating Characters ────────────────────
  {
    id: 'longest-substring',
    title: '6. Longest Substring No Repeat',
    description:
      'Find the length of the longest substring without repeating characters using the sliding window technique. Two pointers define a window; a Set enforces uniqueness inside it.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(min(n, m))',
    complexityExplained:
      'Each character is added and removed from the Set at most once, so right and left together advance at most 2n steps -> O(n). The Set holds at most min(n, m) characters where m = alphabet size (e.g., 128 for ASCII).',
    code: [
      'function lengthOfLongestSubstring(s) {',
      '  let maxLength = 0;',
      '  let left = 0;',
      '  const set = new Set();           // 1',
      '',
      '  for (let right = 0; right < s.length; right++) {',
      '    while (set.has(s[right])) {    // 2',
      '      set.delete(s[left]);',
      '      left++;',
      '    }',
      '    set.add(s[right]);             // 3',
      '    maxLength = Math.max(maxLength, right - left + 1); // 4',
      '  }',
      '',
      '  return maxLength;',
      '}',
    ].join('\n'),
    steps: [
      {
        line: 'const set = new Set();',
        explanation:
          'The Set represents the characters currently inside our sliding window [left, right]. O(1) add/has/delete makes it ideal here.',
      },
      {
        line: 'while (set.has(s[right])) { set.delete(s[left]); left++; }',
        explanation:
          'Before expanding the window rightward, shrink from the left until the duplicate character is evicted. The while loop handles the case where multiple chars need to be removed.',
      },
      {
        line: 'set.add(s[right]);',
        explanation:
          'Now that the duplicate is gone, safely add the new right character to the window.',
      },
      {
        line: 'maxLength = Math.max(maxLength, right - left + 1);',
        explanation:
          'Window size is right - left + 1 (inclusive on both ends). Update the running maximum after every expansion.',
      },
    ],
    interviewTips: [
      'Sliding window is the key pattern: recognise it when you need the best/longest contiguous subarray with a constraint.',
      'A Map<char, index> variant lets you jump left directly to the character after the last seen duplicate — fewer iterations.',
      'Always clarify whether the input is ASCII (128), extended ASCII (256), or full Unicode — affects the space constant.',
    ],
    followUps: [
      'Longest substring with at most K distinct characters (LeetCode 340).',
      'Minimum window substring (LeetCode 76) — shrink to find the minimum instead of maximum.',
      'What is the difference between using a Set vs a Map<char, lastIndex> here?',
    ],
  },

  // ── 7. Custom Promise.all ─────────────────────────────────────────────────
  {
    id: 'promise-all',
    title: '7. Custom Promise.all',
    description:
      'Implement Promise.all from scratch. It resolves with an ordered results array when ALL promises resolve, and rejects immediately if ANY one rejects — preserving insertion order regardless of resolution order.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    complexityExplained:
      'We attach .then/.catch to each of the n promises once -> O(n) setup. The results array holds n values -> O(n) space. Actual resolution time is bounded by the slowest promise, not n.',
    code: [
      'function myPromiseAll(promises) {',
      '  return new Promise((resolve, reject) => {',
      '    if (!Array.isArray(promises)) {           // 1',
      "      return reject(new TypeError('Argument must be an array'));",
      '    }',
      '',
      '    let resolvedCount = 0;',
      '    const results = new Array(promises.length); // 2',
      '',
      '    if (promises.length === 0) {              // 3',
      '      return resolve(results);',
      '    }',
      '',
      '    promises.forEach((promise, index) => {',
      '      Promise.resolve(promise)                // 4',
      '        .then(value => {',
      '          results[index] = value;             // 5',
      '          resolvedCount++;',
      '          if (resolvedCount === promises.length) {',
      '            resolve(results);                 // 6',
      '          }',
      '        })',
      '        .catch(error => reject(error));       // 7',
      '    });',
      '  });',
      '}',
    ].join('\n'),
    steps: [
      {
        line: 'if (!Array.isArray(promises))',
        explanation:
          'Guard clause — native Promise.all throws a TypeError for non-iterables. Mirroring that behaviour makes our polyfill spec-compliant.',
      },
      {
        line: 'const results = new Array(promises.length);',
        explanation:
          'Pre-allocate a sparse array. Critically, we write to results[index] (not push) so the output order matches the input order even if promise[2] resolves before promise[0].',
      },
      {
        line: 'if (promises.length === 0) { return resolve(results); }',
        explanation:
          'Empty-array edge case: Promise.all([]) resolves immediately with [].',
      },
      {
        line: 'Promise.resolve(promise)',
        explanation:
          'Wrapping each item in Promise.resolve handles non-Promise values (e.g., plain numbers) — they resolve immediately with that value.',
      },
      {
        line: 'results[index] = value;',
        explanation:
          'Store at the original index, not in arrival order. This is the key to preserving input ordering.',
      },
      {
        line: 'if (resolvedCount === promises.length) { resolve(results); }',
        explanation:
          'Only resolve the outer promise once every inner promise has resolved. resolvedCount acts as a barrier/semaphore.',
      },
      {
        line: '.catch(error => reject(error));',
        explanation:
          'Fail-fast: the first rejection immediately rejects the outer promise. Subsequent resolutions/rejections are no-ops because a promise can only settle once.',
      },
    ],
    interviewTips: [
      'This question tests async fundamentals: Promise mechanics, closures, and order preservation.',
      'Mention Promise.allSettled as a follow-up — it never rejects, collecting both fulfilled and rejected results.',
      'The resolvedCount counter is a classic closure-over-mutable-state pattern seen in many async coordination tasks.',
    ],
    followUps: [
      'Implement Promise.allSettled — resolves with [{status, value/reason}] for every promise.',
      'Implement Promise.race — resolves/rejects with the FIRST settled promise.',
      'Implement Promise.any — resolves with the FIRST fulfilled promise, rejects only if ALL reject.',
    ],
  },

  // ── 8. Custom useCallback ─────────────────────────────────────────────────
  {
    id: 'use-callback',
    title: '8. Custom useCallback',
    description:
      'Implement React\'s useCallback hook from scratch. It memoises a function reference so that the function identity stays stable across re-renders unless one of its declared dependencies changes — preventing unnecessary child re-renders.',
    timeComplexity: 'O(d)',
    spaceComplexity: 'O(d)',
    complexityExplained:
      'Comparing d dependency values is O(d) per render. Storing the previous deps array and the cached function uses O(d) memory. In practice d is very small, so this is effectively O(1).',
    code: [
      "import { useRef } from 'react';",
      '',
      'function useCustomCallback(fn, deps) {',
      '  const cacheRef = useRef(null); // 1',
      '',
      '  if (',
      '    !cacheRef.current ||                  // 2',
      '    !areDepsEqual(cacheRef.current.deps, deps)',
      '  ) {',
      '    cacheRef.current = { fn, deps };      // 3',
      '  }',
      '',
      '  return cacheRef.current.fn;            // 4',
      '}',
      '',
      '// Helper: shallow-compare two dependency arrays',
      'function areDepsEqual(prevDeps, nextDeps) {',
      '  if (prevDeps.length !== nextDeps.length) return false; // 5',
      '  return prevDeps.every(                                 // 6',
      '    (dep, i) => Object.is(dep, nextDeps[i])',
      '  );',
      '}',
      '',
      '// Usage inside a component:',
      '// const handleClick = useCustomCallback(() => {',
      '//   console.log(count);',
      '// }, [count]);',
    ].join('\n'),
    steps: [
      {
        line: 'const cacheRef = useRef(null);',
        explanation:
          'useRef creates a mutable container that persists across re-renders WITHOUT triggering them. It is the go-to storage mechanism for hooks that need to cache values between renders.',
      },
      {
        line: '!cacheRef.current || !areDepsEqual(cacheRef.current.deps, deps)',
        explanation:
          'Two conditions require a cache miss: (a) first render (no cache yet) or (b) at least one dependency changed. Only then do we create a new function reference.',
      },
      {
        line: 'cacheRef.current = { fn, deps };',
        explanation:
          'Store BOTH the new function AND the new deps together. Storing deps lets us compare them on the next render.',
      },
      {
        line: 'return cacheRef.current.fn;',
        explanation:
          'Return the cached function. If deps did not change, this is the SAME object reference as the previous render — child components that depend on referential equality (React.memo, useEffect deps) will not re-render/re-run.',
      },
      {
        line: 'if (prevDeps.length !== nextDeps.length) return false;',
        explanation:
          'Guard: if the deps array length differs between renders (a violation of the Rules of Hooks but possible in userland), treat it as changed.',
      },
      {
        line: 'return prevDeps.every((dep, i) => Object.is(dep, nextDeps[i]));',
        explanation:
          'Object.is is used instead of === because it correctly handles NaN (NaN === NaN is false, but Object.is(NaN, NaN) is true) and distinguishes +0 from -0. This matches React\'s internal behaviour exactly.',
      },
    ],
    interviewTips: [
      'useCallback is just useMemo that returns a function: useMemo(() => fn, deps). Make this connection explicit.',
      'Common mistake: listing too few or too many deps. Too few -> stale closure. Too many -> defeats the purpose.',
      'Without useCallback, every render creates a new function reference, causing child React.memo components to re-render unnecessarily.',
    ],
    followUps: [
      'How does useMemo differ from useCallback? (useMemo caches the return value; useCallback caches the function itself.)',
      'When would you NOT use useCallback? (When the child is not memoised — the overhead exceeds the benefit.)',
      'Implement a custom useMemo hook from scratch using the same useRef pattern.',
    ],
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Badge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: 'cyan' | 'purple';
}) {
  const styles =
    color === 'cyan'
      ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
      : 'bg-purple-500/10 border-purple-500/30 text-purple-400';

  return (
    <div className={`border px-4 py-2 rounded-xl flex items-center gap-2 ${styles}`}>
      <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      <span className="text-white font-mono font-bold">{value}</span>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-black/60">
      <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-gray-500 font-mono">solution.js</span>
      </div>
      <pre className="p-6 overflow-x-auto text-sm md:text-base text-gray-300 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepWalkthrough({ steps }: { steps: Step[] }) {
  return (
    <div className="mt-8">
      <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-cyan-400">&#x21BA;</span> Step-by-Step Walkthrough
      </h4>
      <ol className="space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-bold">
              {i + 1}
            </span>
            <div>
              <code className="text-xs md:text-sm text-cyan-300 bg-white/5 border border-white/10 px-2 py-1 rounded-lg block mb-2 break-all">
                {step.line}
              </code>
              <p className="text-gray-300 text-sm leading-relaxed">
                {step.explanation}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ComplexityExplained({
  time,
  space,
  explanation,
}: {
  time: string;
  space: string;
  explanation: string;
}) {
  return (
    <div className="mt-8 p-5 rounded-2xl bg-purple-900/20 border border-purple-500/20">
      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="text-purple-400">&#x2299;</span> Complexity Explained
      </h4>
      <div className="flex gap-3 mb-3 flex-wrap">
        <Badge label="Time" value={time} color="cyan" />
        <Badge label="Space" value={space} color="purple" />
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
    </div>
  );
}

function InterviewTips({
  tips,
  followUps,
}: {
  tips: string[];
  followUps: string[];
}) {
  return (
    <div className="mt-8 p-5 rounded-2xl bg-amber-900/20 border border-amber-500/30">
      <h4 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
        <span>&#x1F4A1;</span> Interview Tips
      </h4>
      <ul className="space-y-2 mb-5">
        {tips.map((tip, i) => (
          <li key={i} className="flex gap-2 text-sm text-amber-100/80">
            <span className="text-amber-400 flex-shrink-0 mt-0.5">&#x2192;</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
      <h5 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
        Likely Follow-up Questions
      </h5>
      <ul className="space-y-2">
        {followUps.map((q, i) => (
          <li key={i} className="flex gap-2 text-sm text-amber-100/70">
            <span className="text-amber-500 flex-shrink-0">Q{i + 1}.</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function AlgorithmsModule() {
  const [activeTab, setActiveTab] = useState<string>(algorithms[0].id);

  const active = algorithms.find((a) => a.id === activeTab) ?? algorithms[0];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 md:p-10 font-sans text-gray-100 bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 tracking-tight">
          Algorithm Masterclass
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Essential algorithms and data structures in JavaScript — with
          line-by-line explanations, complexity breakdowns, and interview tips.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-2">
          {algorithms.map((algo) => {
            const isActive = activeTab === algo.id;
            return (
              <button
                key={algo.id}
                onClick={() => setActiveTab(algo.id)}
                className={[
                  'relative overflow-hidden px-5 py-4 rounded-2xl text-left transition-all duration-300',
                  'backdrop-blur-md border',
                  isActive
                    ? 'bg-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)] border-purple-500/50'
                    : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/20',
                ].join(' ')}
              >
                <span
                  className={`font-semibold block text-sm ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {algo.title}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Content Panel */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Glass shimmer */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-3xl" />

              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {active.title}
                </h3>
                <p className="text-gray-300 mb-6 text-base md:text-lg leading-relaxed">
                  {active.description}
                </p>

                <CodeBlock code={active.code} />
                <StepWalkthrough steps={active.steps} />
                <ComplexityExplained
                  time={active.timeComplexity}
                  space={active.spaceComplexity}
                  explanation={active.complexityExplained}
                />
                <InterviewTips
                  tips={active.interviewTips}
                  followUps={active.followUps}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
