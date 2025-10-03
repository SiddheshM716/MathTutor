"use client";
import { useEffect, useRef } from 'react';

export default function IframePreview({ htmlSnippet }: { htmlSnippet: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlSnippet) return;

    const iframeContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <script>
            MathJax = {
              tex: { inlineMath: [['\\\\(', '\\\\)'], ['$', '$']] },
              svg: { fontCache: 'global' }
            };
          </script>
          <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-size: 14px;
              color: rgb(75 85 99);
              margin: 0;
              padding: 0;
              background-color: transparent;
              /* vertically center the content */
              display: flex;
              align-items: center;
              height: 100%;
            }
          </style>
        </head>
        <body>
          ${htmlSnippet}
        </body>
      </html>
    `;

    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(iframeContent);
      doc.close();
    }
  }, [htmlSnippet]);

  return (
    <iframe
      ref={iframeRef}
      title="Math Preview"
      style={{
        width: '100%',
        border: 'none',
        // Increased height for better rendering
        height: '30px', 
        pointerEvents: 'none',
      }}
      scrolling="no"
      sandbox="allow-scripts"
    />
  );
}