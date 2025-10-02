"use client";

import { useEffect, useRef } from 'react';

type MathJaxRendererProps = {
  htmlContent: string;
};

export default function MathJaxRenderer({ htmlContent }: MathJaxRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlContent) return;

    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      const style = doc.createElement('style');
      
      style.textContent = `
        body {
          /* --- THIS IS THE FIX --- */
          /* Changed the background to white to match the container box */
          background-color: white;
          color: rgb(17 24 39); /* text-gray-900 */
          margin: 0;
          padding: 1rem;
          font-family: sans-serif;
          font-size: 115%;
        }
      `;
      
      doc.head.appendChild(style);
    }

    const adjustHeight = () => {
      if (iframe.contentWindow?.document.body) {
        const contentHeight = iframe.contentWindow.document.body.scrollHeight;
        iframe.style.height = `${contentHeight + 20}px`;
      }
    };

    iframe.onload = () => {
      setTimeout(adjustHeight, 300);
    };

    setTimeout(adjustHeight, 1500); 

  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      title="MathJax Content"
      style={{
        width: '100%',
        border: 'none',
        minHeight: '500px',
        transition: 'height 0.3s ease-in-out',
      }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}