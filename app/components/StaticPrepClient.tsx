'use client';

import { useEffect, useRef, useState } from 'react';

export default function StaticPrepClient({
  html,
  title,
  loadingLabel,
}: {
  html: string;
  title: string;
  loadingLabel?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    // Format is "<sectionId>" or "<sectionId>:<questionIndex>" for a direct link to one card.
    const [id, qIdxRaw] = hash.split(':');
    const qIdx = qIdxRaw !== undefined ? Number(qIdxRaw) : undefined;
    // The iframe's own 'load' event isn't a reliable signal here, so retry
    // posting for a couple of seconds until the inner script's listener picks it up.
    let attempts = 0;
    const timer = setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage({ type: 'goto-section', id, qIdx }, '*');
      attempts += 1;
      if (attempts >= 20) clearInterval(timer);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#F1F2F6' }}>
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            color: '#666',
          }}
        >
          {loadingLabel ?? 'Loading…'}
        </div>
      )}
      <iframe
        ref={iframeRef}
        title={title}
        srcDoc={html}
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  );
}
