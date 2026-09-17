'use client';

import { useState } from 'react';

export default function InterviewPrepClient({ html }: { html: string }) {
  const [loaded, setLoaded] = useState(false);

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
        title="Fullstack Developer Interview Prep"
        srcDoc={html}
        onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      />
    </div>
  );
}
