'use client';

import { useState, type FormEvent } from 'react';
import StaticPrepClient from '../components/StaticPrepClient';
import payload from './private.enc.json';

const b64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

// PBKDF2-SHA256 -> AES-256-GCM, matching scripts/encrypt-private.mjs. Runs entirely in the browser.
async function decrypt(password: string): Promise<string> {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: b64(payload.salt), iterations: payload.iter, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(payload.iv) }, key, b64(payload.ct));
  return new TextDecoder().decode(plain);
}

export default function PrivateGate() {
  const [password, setPassword] = useState('');
  const [html, setHtml] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError('');
    try {
      setHtml(await decrypt(password));
      setPassword('');
    } catch {
      setError('That password did not work.');
    } finally {
      setBusy(false);
    }
  }

  if (html) {
    return <StaticPrepClient html={html} title="Private notes" loadingLabel="Opening notes…" />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={unlock} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Private notes</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter the password to open this page.</p>
        <label htmlFor="pw" className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="off"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? 'Unlocking…' : 'Unlock'}
        </button>
      </form>
    </main>
  );
}
