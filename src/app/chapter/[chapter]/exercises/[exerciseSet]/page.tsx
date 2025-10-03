import Link from "next/link";
import data from "../../../../../../public/content_index.json";
import React from "react";
import { promises as fs } from 'fs';
import path from 'path';

// --- Data and Helper Functions ---
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

const sortNumerically = (a: { id: string }, b: { id:string }) => {
    const numA = parseInt(a.id.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.id.match(/\d+/)?.[0] || "0");
    return numA - numB;
};

// --- NEW generateStaticParams FUNCTION ---
export async function generateStaticParams() {
    const params = [];
    const exercisesData = data.exercises as Record<string, Record<string, string[]>>;

    if (exercisesData) {
        for (const chapterKey in exercisesData) { // e.g., "Chapter1"
            const chapterSlug = `chapter_${chapterKey.match(/\d+/)?.[0]}_html`;
            const chapterContent = exercisesData[chapterKey];
            if (chapterContent) {
                for (const exerciseSetKey in chapterContent) { // e.g., "Ex1.1"
                    params.push({
                        chapter: chapterSlug,
                        exerciseSet: exerciseSetKey,
                    });
                }
            }
        }
    }
    return params;
}


// --- FIX 1: Update the type definition ---
type ExerciseSetPageProps = {
  params: Promise<{
    chapter: string;
    exerciseSet: string;
  }>;
};

// --- FIX 2: Update the function signature and await the params ---
export default async function QuestionsListPage({ params }: ExerciseSetPageProps) {
  const { chapter, exerciseSet } = await params;

  const currentChapter = chapterList.find(c => c.slug === chapter);
  const chapterTitle = currentChapter ? currentChapter.name : "Chapter";

  const exerciseChapterKey = getExerciseChapterKey(chapter);
  const exercisesData = data.exercises as Record<string, Record<string, string[]>>;
  const chapterExercises = exercisesData[exerciseChapterKey];

  let questionFiles: string[] = [];
  if (chapterExercises && exerciseSet) {
    const correctKey = Object.keys(chapterExercises).find(key => key.toLowerCase() === exerciseSet.toLowerCase());
    if (correctKey) {
      questionFiles = chapterExercises[correctKey];
    }
  }

  const questionsWithPreviews = await Promise.all(
    questionFiles.map(async (file) => {
      const filePath = path.join(
        process.cwd(),
        "public",
        "exercise_html",
        exerciseChapterKey,
        exerciseSet,
        file
      );
      let content = "";
      try {
        content = await fs.readFile(filePath, "utf8");
      } catch {}

      const match = content.match(/<p>([\s\S]*?)<\/p>/i);
      let previewText = match ? match[1].replace(/<[^>]*>?/gm, "").trim() : "";

      if (previewText.length > 120) {
        previewText = previewText.slice(0, 120) + "...";
      }

      return {
        id: file.replace(".html", ""),
        name: file.replace(".html", ""),
        preview: previewText,
      };
    })
  );

  questionsWithPreviews.sort(sortNumerically);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-4 md:block">
            <Link
              href={`/chapter/${chapter}/exercises`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 md:py-3 md:px-5 rounded-lg text-lg inline-flex items-center md:gap-3 transition-colors shadow-sm flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <span className="hidden md:inline">Back</span>
            </Link>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold md:mt-6 capitalize text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {chapterTitle} - {exerciseSet}
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-500 mt-2">Select a question to view the solution.</p>
        </div>

        {questionsWithPreviews.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionsWithPreviews.map((question) => (
              <li key={question.id}>
                <Link
                  href={`/chapter/${chapter}/exercises/${exerciseSet}/${question.id}`}
                  className="group flex flex-col h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200"
                >
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 capitalize">{question.name}</h3>
                  <div className="mt-2 line-clamp-1 text-gray-700 text-sm">
                    {question.preview}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No questions found for this set.</p>
          </div>
        )}
      </div>
      <Link href="/" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-full shadow-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </Link>
    </main>
  );
}
