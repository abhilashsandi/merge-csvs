import PrivateGate from './PrivateGate';

// Not linked anywhere and excluded from search engines; the content itself is encrypted (see scripts/encrypt-private.mjs).
export const metadata = {
  title: 'Private notes',
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <PrivateGate />;
}
