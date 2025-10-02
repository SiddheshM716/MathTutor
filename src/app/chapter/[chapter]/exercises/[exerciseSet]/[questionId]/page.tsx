import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import Link from "next/link";
import MathJaxRenderer from "../../../../../components/MathJaxRenderer";
import data from "../../../../../../../public/content_index.json";

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

const getExerciseChapterKey = (chapterParam: string) => {
  const chapterNum = chapterParam.match(/\d+/)?.[0];
  return chapterNum ? `Chapter${chapterNum}` : "";
};

const sortNumerically = (a: string, b: string) => {
  const numA = parseInt(a.match(/\d+/)?.[0] || "0");
  const numB = parseInt(b.match(/\d+/)?.[0] || "0");
  return numA - numB;
};

type QuestionPageProps = {
  params: {
    chapter: string;
    exerciseSet: string;
    questionId: string;
  };
};

export default async function QuestionDisplayPage({
  params: { chapter, exerciseSet, questionId },
}: QuestionPageProps): Promise<JSX.Element> {
  const exerciseChapterKey = getExerciseChapterKey(chapter);
  const chapterExercises = data.exercises[exerciseChapterKey];

  if (!chapterExercises) notFound();

  const questionFilesRaw = chapterExercises[exerciseSet];
  if (!questionFilesRaw) notFound();

  const questionFiles = [...questionFilesRaw].sort(sortNumerically);
  const currentIndex = questionFiles.indexOf(`${questionId}.html`);
  if (currentIndex === -1) notFound();

  const prevQuestionId =
    currentIndex > 0
      ? questionFiles[currentIndex - 1].replace(".html", "")
      : null;
  const nextQuestionId =
    currentIndex < questionFiles.length - 1
      ? questionFiles[currentIndex + 1].replace(".html", "")
      : null;

  const filePath = path.join(
    process.cwd(),
    "public",
    "exercise_html",
    exerciseChapterKey,
    exerciseSet,
    `${questionId}.html`
  );

  let fileContent = "";
  try {
    fileContent = await fs.readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  const currentChapter = chapterList.find((c) => c.slug === chapter);
  const chapterTitle = currentChapter ? currentChapter.name : "Chapter";

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pb-28">
        <header className="mb-8">
          <div className="flex items-center gap-4 md:block">
            <Link
              href={`/chapter/${chapter}/exercises/${exerciseSet}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 md:py-3 md:px-5 rounded-lg text-lg inline-flex items-center md:gap-3 transition-colors shadow-sm flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
              <span className="hidden md:inline">Back to Exercises</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 md:mt-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {chapterTitle} - {exerciseSet} - {questionId}
              </span>
            </h1>
          </div>
        </header>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <MathJaxRenderer htmlContent={fileContent} />
        </div>
      </div>

      {/* Prev Button */}
      {prevQuestionId && (
        <Link
          href={`/chapter/${chapter}/exercises/${exerciseSet}/${prevQuestionId}`}
          className="fixed bottom-4 left-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg text-base md:text-xl flex items-center gap-2 md:gap-3 shadow-md transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </Link>
      )}

      {/* Next Button */}
      {nextQuestionId && (
        <Link
          href={`/chapter/${chapter}/exercises/${exerciseSet}/${nextQuestionId}`}
          className="fixed bottom-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg text-base md:text-xl flex items-center gap-2 md:gap-3 shadow-md transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      )}
    </main>
  );
}