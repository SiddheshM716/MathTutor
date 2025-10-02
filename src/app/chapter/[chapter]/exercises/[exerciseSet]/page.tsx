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

type ExerciseSetPageProps = {
  params: {
    chapter: string;
    exerciseSet: string;
  };
};

export default async function QuestionsListPage({ params: { chapter, exerciseSet } }: ExerciseSetPageProps) {
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

  // Read all question files in parallel to get their content
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
      } catch {
        // file not found, ignore
      }

      // Extract the first <p>...</p> and clean tags
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
          {/* Back button + title wrapper */}
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

        {/* Grid of question cards */}
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
    </main>
  );
}