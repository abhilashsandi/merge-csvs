import Link from 'next/link';

export default function StudyGuideLink({ href, label = 'Study guide' }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="fixed bottom-4 left-4 z-50 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
    >
      ← {label}
    </Link>
  );
}
