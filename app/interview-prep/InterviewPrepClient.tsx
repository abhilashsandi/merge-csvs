'use client';

import { useEffect, useRef, useState } from 'react';

export default function InterviewPrepClient({ html }: { html: string }) {
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    // The iframe's own 'load' event isn't a reliable signal here, so retry
    // posting for a couple of seconds until the inner script's listener picks it up.
    let attempts = 0;
    const timer = setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage({ type: 'goto-section', id: hash }, '*');
      attempts += 1;
      if (attempts >= 20) clearInterval(timer);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f4f1ea' }}>
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
          Loading interview prep guide…
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Fullstack Developer Interview Prep"
        srcDoc={html}
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  );
}
