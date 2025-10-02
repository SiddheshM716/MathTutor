"use client";

import { MathJax } from "better-react-mathjax";

// This Client Component wraps the MathJax component and handles hydration.
export default function MathPreview({ text }: { text: string }) {
  return (
    // The `hideUntilTypeset` prop is the key to fixing the hydration error.
    // It tells the component to render nothing on the server and initial client render,
    // and then fade in the content after the math is typeset.
    <MathJax hideUntilTypeset="first" inline dynamic>
      {text}
    </MathJax>
  );
}