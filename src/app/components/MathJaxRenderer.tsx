"use client";

import { useEffect, useRef } from "react";

type MathJaxRendererProps = {
  htmlContent: string;
};

// --- THIS IS THE FIX ---
// Use `declare global` to correctly augment the global Window type.
// This new definition is consistent and avoids the previous conflict.
declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>;
      tex?: {
        inlineMath?: [string, string][];
        [key: string]: unknown;
      };
    };
  }
}

export default function MathJaxRenderer({ htmlContent }: MathJaxRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !htmlContent) return;

    const sanitizedContent = htmlContent.replace(/<link[^>]+stylesheet[^>]*>/gi, "");
    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(sanitizedContent);
    doc.close();

    // Add viewport meta for mobile
    const meta = doc.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes";
    doc.head.appendChild(meta);

    // Add custom styles
    const style = doc.createElement("style");
    style.textContent = `
      body {
        background-color: #f9fafb;
        color: #111827;
        margin: 0;
        padding: 1rem;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 16px;
        line-height: 1.6;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      }

      @media (max-width: 640px) {
        body { font-size: 14px; padding: 0.75rem; line-height: 1.5; }
      }

      .solution-title, .final-solution-header {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 1rem 0 0.75rem 0;
        color: #2563eb;
      }

      .question-box, .step-content, .final-answer {
        display: inline-block;
        padding: 0.75rem 1rem;
        border-radius: 8px;
        background-color: #ffffff;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        margin-bottom: 1rem;
        word-break: normal;
        white-space: pre-wrap;
      }

      @media (min-width: 641px) {
        .question-box, .step-content, .final-answer {
          display: block;
          width: 100%;
        }
      }

      .step-box {
        display: flex;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .step-bullet {
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: rgba(59, 130, 246, 0.2);
        color: #2563eb;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.75rem;
      }

      .final-answer {
        background-color: rgba(59, 130, 246, 0.2);
        color: #2563eb;
        border-radius: 6px;
        font-weight: 600;
      }

      math, mjx-container {
        font-size: 1.05em;
        white-space: normal !important;
      }

      @media (max-width: 640px) {
        math, mjx-container {
          font-size: 0.95em;
        }
      }
    `;
    doc.head.appendChild(style);

    // Add titles if missing
    const questionContainer = doc.querySelector(".question");
    if (questionContainer && !questionContainer.querySelector(".solution-title")) {
      const title = doc.createElement("h2");
      title.className = "solution-title";
      title.textContent = "Problem";
      questionContainer.insertBefore(title, questionContainer.firstChild);
    }

    const solutionContainer = doc.querySelector(".answer");
    if (solutionContainer && !solutionContainer.querySelector(".solution-title")) {
      const title = doc.createElement("h2");
      title.className = "solution-title";
      title.textContent = "Solution";
      solutionContainer.insertBefore(title, solutionContainer.firstChild);
    }

    const finalAnswerDiv = doc.querySelector(".final-answer");
    if (finalAnswerDiv && !finalAnswerDiv.parentNode?.querySelector(".final-solution-header")) {
      const finalHeader = doc.createElement("h2");
      finalHeader.className = "final-solution-header";
      finalAnswerDiv.parentNode?.insertBefore(finalHeader, finalAnswerDiv);
    }

    // Adjust iframe height after MathJax typeset
    const adjustHeight = () => {
      if (iframe.contentWindow?.document.body) {
        const contentHeight = iframe.contentWindow.document.body.scrollHeight;
        iframe.style.height = `${contentHeight + 20}px`;
      }
    };

    // Wait for MathJax to finish typesetting
    const waitMathJax = async () => {
      const win = iframe.contentWindow;
      if (win?.MathJax?.typesetPromise) {
        try {
          await win.MathJax.typesetPromise();
        } catch {
          // ignore errors
        }
      }
      adjustHeight();
    };

    waitMathJax();
    iframe.onload = () => setTimeout(waitMathJax, 300);
    setTimeout(waitMathJax, 1000);

  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      title="MathJax Content"
      className="w-full min-h-[400px] rounded-xl transition-all duration-300 ease-in-out"
      style={{ border: "none", boxShadow: "none", backgroundColor: "#f9fafb" }}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}

