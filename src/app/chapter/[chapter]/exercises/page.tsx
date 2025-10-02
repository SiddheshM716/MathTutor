"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Script from 'next/script';

// Chapter data
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

const getExerciseChapterKey = (chapterParam: string): string => {
  const chapterNum = chapterParam.match(/\d+/)?.[0];
  return chapterNum ? `Chapter${chapterNum}` : "";
};

const sortSets = (a: string, b: string) => {
  const [aMajor, aMinor] = a.replace('Ex', '').split('.').map(Number);
  const [bMajor, bMinor] = b.replace('Ex', '').split('.').map(Number);
  if (aMajor !== bMajor) return aMajor - bMajor;
  return aMinor - bMinor;
};

declare global {
  interface Window {
    MathJax: {
      typesetPromise?: () => Promise<any>;
    };
  }
}

export default function ExerciseSetListPage() {
  const params = useParams();
  const chapter = params.chapter as string;

  const [exerciseSets, setExerciseSets] = useState<string[]>([]);
  const [isMathJaxReady, setIsMathJaxReady] = useState(false);

  const currentChapter = chapterList.find(c => c.slug === chapter);
  const chapterTitle = currentChapter ? currentChapter.name : "Chapter";

  useEffect(() => {
    if (!chapter) return;
    fetch('/content_index.json')
      .then(res => res.json())
      .then(data => {
        const exerciseChapterKey = getExerciseChapterKey(chapter);
        if (data.exercises[exerciseChapterKey]) {
          const sets = Object.keys(data.exercises[exerciseChapterKey]);
          sets.sort(sortSets);
          setExerciseSets(sets);
        }
      });
  }, [chapter]);

  useEffect(() => {
    if (isMathJaxReady && exerciseSets.length > 0) {
      window.MathJax?.typesetPromise?.();
    }
  }, [isMathJaxReady, exerciseSets]);

  if (!chapter || exerciseSets.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-2xl text-gray-400">Loading Exercises...</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          {/* Back button and title wrapper */}
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold md:mt-6 capitalize text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {chapterTitle} - Exercises
              </span>
            </h1>
          </div>

          <p className="text-lg text-gray-500 mt-2">Select an exercise set to practice.</p>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {exerciseSets.map((set) => (
            <li key={set}>
              <Link
                href={`/chapter/${chapter}/exercises/${set}`}
                className="group flex items-center justify-center h-20 p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200"
              >
                <span className="font-semibold text-gray-700 group-hover:text-blue-600">{set}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* MathJax Scripts for consistency */}
      <Script id="mathjax-config" strategy="afterInteractive">
        {`
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\$begin:math:text$', '\\\\\\$end:math:text$']]
            }
          };
        `}
      </Script>
      <Script id="mathjax-library" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" strategy="afterInteractive" onLoad={() => setIsMathJaxReady(true)} />
    </main>
  );
}