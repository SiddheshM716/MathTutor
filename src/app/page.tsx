"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Define the shape of the data inside content_index.json
interface ChapterExamples {
  html_files: string[];
  images: string[];
}

interface ChapterExercises {
  [exerciseId: string]: string[];
}

interface ContentIndex {
  examples: Record<string, ChapterExamples>;
  exercises: Record<string, ChapterExercises>;
}

// Define the ordered list of chapters with their display names and URL slugs
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

export default function Home() {
  const [data, setData] = useState<ContentIndex | null>(null);

  useEffect(() => {
    fetch("/content_index.json")
      .then((res) => res.json())
      .then((json: ContentIndex) => setData(json));
  }, []);

  if (!data) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-2xl text-gray-500">Loading Content...</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Math Tutor
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Your personal guide to mastering mathematics. Select a chapter to
            begin your journey.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapterList.map((chapter, index) => (
            <li
              key={chapter.slug}
              className="flex flex-col p-6 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-4">
                  <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                    {index + 1}
                  </span>
                  <h2 className="font-semibold text-gray-800">
                    {chapter.name}
                  </h2>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/chapter/${chapter.slug}/examples`}
                  className="w-full sm:w-auto inline-flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Examples
                </Link>
                <Link
                  href={`/chapter/${chapter.slug}/exercises`}
                  className="w-full sm:w-auto inline-flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Exercises
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}