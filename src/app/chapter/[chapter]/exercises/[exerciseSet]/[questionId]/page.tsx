import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import Link from "next/link";
import MathJaxRenderer from "../../../../../components/MathJaxRenderer";
import data from "../../../../../../../public/content_index.json";

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
const getExerciseChapterKey = (chapterParam: string): string => {
    const chapterNum = chapterParam.match(/\d+/)?.[0];
    return chapterNum ? `Chapter${chapterNum}` : "";
};
const sortNumerically = (a: string, b: string) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
    return numA - numB;
};

// --- THIS FUNCTION IS FIXED ---
// Rewritten to be more robust and prevent crashes from bad data.
export async function generateStaticParams() {
  const params = [];
  const exercisesData = data.exercises as Record<string, Record<string, string[]>>;

  if (!exercisesData) return [];

  for (const chapterKey of Object.keys(exercisesData)) {
    const chapterNumberMatch = chapterKey.match(/\d+/);
    if (!chapterNumberMatch) continue;

    const chapterSlug = `chapter_${chapterNumberMatch[0]}_html`;
    const chapterContent = exercisesData[chapterKey];

    if (chapterContent && typeof chapterContent === 'object') {
      for (const exerciseSetKey of Object.keys(chapterContent)) {
        const questionFiles = chapterContent[exerciseSetKey];

        if (Array.isArray(questionFiles)) {
          for (const questionFile of questionFiles) {
            if (typeof questionFile === 'string' && questionFile.endsWith('.html')) {
              params.push({
                chapter: chapterSlug,
                exerciseSet: exerciseSetKey,
                questionId: questionFile.replace('.html', ''),
              });
            }
          }
        }
      }
    }
  }
  return params;
}

type QuestionPageProps = {
  params: Promise<{
    chapter: string;
    exerciseSet: string;
    questionId: string;
  }>;
};

export default async function QuestionDisplayPage({ params }: QuestionPageProps): Promise<JSX.Element> {
  const { chapter, exerciseSet, questionId } = await params;

  const exerciseChapterKey = getExerciseChapterKey(chapter);
  const chapterExercises = data.exercises[exerciseChapterKey as keyof typeof data.exercises];
  if (!chapterExercises) notFound();

  const correctExerciseSetKey = Object.keys(chapterExercises).find(key => key.toLowerCase() === exerciseSet.toLowerCase());
  if (!correctExerciseSetKey) notFound();

  const questionFilesRaw: string[] = chapterExercises[correctExerciseSetKey as keyof typeof chapterExercises];
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
    correctExerciseSetKey,
    `${questionId}.html`
  );

  let fileContent: string = "";
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
      
      <Link href="/" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-full shadow-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </Link>
      
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

