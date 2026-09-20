'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, X, ExternalLink } from 'lucide-react';
import { rows, categoryColors } from './data';

const categories = Array.from(new Set(rows.map((r) => r.category)));

export default function CheatsheetClient() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return rows.filter((r) => {
      if (activeCategory && r.category !== activeCategory) return false;
      if (!term) return true;
      return (
        r.topic.toLowerCase().includes(term) ||
        r.answer.toLowerCase().includes(term) ||
        r.category.toLowerCase().includes(term)
      );
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:px-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Interview Cheatsheet
          </h1>
          <p className="mt-2 text-base text-zinc-600 dark:text-zinc-300 max-w-3xl">
            {rows.length} topics across every prep track, each with a one-line answer and a link to the full
            explanation — for a fast pass right before you walk in.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search topics, answers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === null
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
              }`}
            >
              All ({rows.length})
            </button>
            {categories.map((c) => {
              const count = rows.filter((r) => r.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(activeCategory === c ? null : c)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    activeCategory === c
                      ? categoryColors[c] + ' border-transparent'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {c} ({count})
                </button>
              );
            })}
          </div>

          {(search || activeCategory) && (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              Showing {filtered.length} of {rows.length}
            </p>
          )}
        </header>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wide w-32">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wide w-56">
                  Topic
                </th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wide">
                  Answer
                </th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wide w-24">
                  Full answer
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-100 dark:border-zinc-800/60 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors align-top"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md whitespace-nowrap ${categoryColors[r.category] ?? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}
                    >
                      {r.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-50">{r.topic}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">{r.answer}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={r.href}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
                    >
                      Read <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-zinc-400">
                    No topics match &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
