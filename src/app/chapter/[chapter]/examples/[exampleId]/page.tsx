import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import Link from 'next/link';
import MathJaxRenderer from '../../../../components/MathJaxRenderer';
import data from '../../../../../../public/content_index.json';

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
const sortNumerically = (a: string, b: string) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.match(/\d+/)?.[0] || '0');
    return numA - numB;
};

// --- THIS FUNCTION IS FIXED ---
// The implementation has been restored to correctly return an array of params.
export async function generateStaticParams() {
  const params = [];
  if (data.examples) {
    for (const chapterKey in data.examples) {
      const chapterData = data.examples[chapterKey as keyof typeof data.examples];
      if (chapterData && Array.isArray(chapterData.html_files)) {
        for (const htmlFile of chapterData.html_files) {
          if (typeof htmlFile === 'string') {
            params.push({
              chapter: chapterKey,
              exampleId: htmlFile.replace('.html', ''),
            });
          }
        }
      }
    }
  }
  return params;
}

// The type definition is now correct for the latest Next.js versions
type ExampleDisplayPageProps = {
  params: Promise<{
    chapter: string;
    exampleId: string;
  }>;
};

export default async function ExampleDisplayPage({ params }: ExampleDisplayPageProps): Promise<JSX.Element> {
  // We correctly await the params here
  const { chapter, exampleId } = await params;

  const filePath = path.join(process.cwd(), 'public', 'examples_html', chapter, `${exampleId}.html`);

  let fileContent: string = '';
  try {
    fileContent = await fs.readFile(filePath, 'utf8');
  } catch {
    notFound();
  }

  const currentChapter = chapterList.find(c => c.slug === chapter);
  const chapterTitle = currentChapter ? currentChapter.name : "Chapter";

  const exampleNumberMatch = exampleId.match(/\d+/);
  const exampleNumber = exampleNumberMatch ? exampleNumberMatch[0] : exampleId;
  const pageTitle = `${chapterTitle} - Example ${exampleNumber}`;

  const allExamples = data.examples[chapter as keyof typeof data.examples]?.html_files || [];
  const sortedExampleIds = [...allExamples].sort(sortNumerically).map(file => file.replace('.html', ''));
  const currentIndex = sortedExampleIds.indexOf(exampleId);
  const prevExampleId = currentIndex > 0 ? sortedExampleIds[currentIndex - 1] : null;
  const nextExampleId = currentIndex < sortedExampleIds.length - 1 ? sortedExampleIds[currentIndex + 1] : null;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pb-28">

        <header className="mb-8">
          <div className="flex items-center gap-4 md:block">
            <Link 
              href={`/chapter/${chapter}/examples`} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 md:py-3 md:px-5 rounded-lg text-lg inline-flex items-center md:gap-3 transition-colors shadow-sm flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <span className="hidden md:inline">Back to Examples</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 md:mt-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {pageTitle}
              </span>
            </h1>
          </div>
        </header>

        <MathJaxRenderer htmlContent={fileContent} />
      </div>

      {prevExampleId && (
        <Link
          href={`/chapter/${chapter}/examples/${prevExampleId}`}
          className="fixed bottom-4 left-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg text-base md:text-xl flex items-center gap-2 md:gap-3 shadow-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </Link>
      )}

      {nextExampleId && (
        <Link
          href={`/chapter/${chapter}/examples/${nextExampleId}`}
          className="fixed bottom-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 md:py-3 md:px-6 rounded-lg text-base md:text-xl flex items-center gap-2 md:gap-3 shadow-md transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      )}
      {/* 2. --- NEW FLOATING HOME BUTTON --- */}
      <Link href="/" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-full shadow-md transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </Link>
    </main>
  );
}