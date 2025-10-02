"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Define a simple type for the data we expect from the JSON file
interface ContentIndex {
  examples: Record<string, any>;
  exercises: Record<string, any>;
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
      .then(setData);
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
            Your personal guide to mastering mathematics. Select a chapter to begin your journey.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapterList.map((chapter, index) => (
            <li key={chapter.slug}>
              <Link
                href={`/chapter/${chapter.slug}`}
                className="group flex items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300 h-full"
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-4">
                    {/* --- THIS IS THE CHANGE --- */}
                    {/* The number circle now has a blue background and text by default */}
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg transition-colors">
                      {index + 1}
                    </span>
                    <h2 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {chapter.name}
                    </h2>
                  </div>

                  <span className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}