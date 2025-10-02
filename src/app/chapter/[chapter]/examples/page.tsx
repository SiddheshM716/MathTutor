"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Script from 'next/script';

// Data and Helper Functions remain the same...
const chapterList = [
    { name: "Relation and Functions", slug: "chapter_1_html" },
    { name: "Numbers and Sequences", slug: "chapter_2_html" },
    { name: "Algebra", slug: "chapter_3_html" },
    { name: "Geometry", slug: "chapter_4_html" },
    { name: "Coordinate Geometry", slug: "chapter_5_html" },
    { name: "Trigonometry", slug: "chapter_6_html" },
    { name: "Mensuration", slug: "chapter_7_html" },
    { name: "Statistics and Probability", slug: "chapter_8_html" },
];
const sortNumerically = (a: { id: string }, b: { id: string }) => {
    const numA = parseInt(a.id.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.id.match(/\d+/)?.[0] || "0");
    return numA - numB;
};
declare global {
  interface Window {
    MathJax: {
      typesetPromise?: () => Promise<any>;
    };
  }
}

export default function ExamplesListPage() {
  const params = useParams();
  const chapter = params.chapter as string;
  
  const [examplesWithPreviews, setExamplesWithPreviews] = useState<{ id: string; name: string; preview: string; }[]>([]);
  const [isMathJaxReady, setIsMathJaxReady] = useState(false);

  const currentChapter = chapterList.find(c => c.slug === chapter);
  const chapterTitle = currentChapter ? currentChapter.name : "Chapter";

  useEffect(() => {
    if (!chapter) return;
    let allFiles: string[] = [];
    fetch('/content_index.json')
      .then(res => res.json())
      .then(data => {
        allFiles = data.examples[chapter]?.html_files || [];
        return Promise.all(
          allFiles.map(file => 
            fetch(`/examples_html/${chapter}/${file}`).then(res => res.text())
          )
        );
      })
      .then(contents => {
        const previews = contents.map((content, index) => {
          const previewMatch = content.match(/<p>([\s\S]*?)<\/p>/i);
          return {
            id: allFiles[index].replace('.html', ''),
            name: allFiles[index].replace('.html', '').replace(/_/g, ' '),
            preview: previewMatch ? previewMatch[1] : 'No preview.',
          };
        });
        previews.sort(sortNumerically);
        setExamplesWithPreviews(previews);
      });
  }, [chapter]);

  useEffect(() => {
    if (isMathJaxReady && examplesWithPreviews.length > 0) {
      window.MathJax?.typesetPromise?.();
    }
  }, [isMathJaxReady, examplesWithPreviews]);

  if (!chapter || examplesWithPreviews.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-2xl text-gray-400">Loading Examples...</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          {/* --- THIS WRAPPER DIV CONTROLS THE LAYOUT --- */}
          {/* It's a flex row on mobile, and a block on medium screens and up */}
          <div className="flex items-center gap-4 md:block">
            <Link 
              href={`/chapter/${chapter}`} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 md:py-3 md:px-5 rounded-lg text-lg inline-flex items-center md:gap-3 transition-colors shadow-sm flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <span className="hidden md:inline">Back</span>
            </Link>
            
            {/* Margin and text size are now responsive */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold md:mt-6 capitalize text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {chapterTitle} - Examples
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-500 mt-2">Select an example to view the solution.</p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examplesWithPreviews.map((example) => (
            <li key={example.id}>
              <Link
                href={`/chapter/${chapter}/examples/${example.id}`}
                className="group flex flex-col h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200"
              >
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 capitalize">{example.name}</h3>
                <p className="mt-2 text-gray-500 text-sm line-clamp-1" dangerouslySetInnerHTML={{ __html: example.preview }} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Script id="mathjax-config" strategy="afterInteractive">
        {`
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']]
            }
          };
        `}
      </Script>
      <Script id="mathjax-library" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" strategy="afterInteractive" onLoad={() => setIsMathJaxReady(true)} />
    </main>
  );
}