import Link from "next/link";

// Define the ordered list of chapters to look up the correct name
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

type ChapterPageProps = {
  params: {
    chapter: string;
  };
};

export default async function ChapterChoicePage({ params }: ChapterPageProps) {
  const { chapter } = params;
  
  const currentChapter = chapterList.find(c => c.slug === chapter);
  const chapterTitle = currentChapter ? currentChapter.name : "Chapter";

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        
        <header className="mb-10 md:mb-14">
          {/* --- THIS WRAPPER DIV CONTROLS THE LAYOUT --- */}
          {/* It's a flex row on mobile, and a block on medium screens and up */}
          <div className="flex items-center gap-4 md:block">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 md:py-3 md:px-5 rounded-lg text-lg inline-flex items-center md:gap-3 transition-colors shadow-sm flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
              <span className="hidden md:inline">All Chapters</span>
            </Link>
            
            {/* Margin and text size are now responsive */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 md:mt-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {chapterTitle}
              </span>
            </h1>
          </div>
          <p className="mt-4 text-lg md:text-xl text-gray-500">
            What would you like to view?
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Examples Card */}
          <Link
            href={`/chapter/${chapter}/examples`}
            className="group block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">View Examples</h2>
                <p className="mt-1 text-gray-500">See step-by-step solved problems.</p>
              </div>
            </div>
          </Link>

          {/* Exercises Card */}
          <Link
            href={`/chapter/${chapter}/exercises`}
            className="group block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-green-500 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Do Exercises</h2>
                <p className="mt-1 text-gray-500">Test your knowledge and practice.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}