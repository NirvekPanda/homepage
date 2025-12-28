"use client";

import { useState, useEffect } from "react";
import Footer from "../components/footer";

function Resume() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Header container for the download button */}
      <div className="flex flex-col items-center">
        <a
          href="/Nirvek_Pandey_Resume.pdf"
          download
          className="px-6 py-3 rounded-md font-medium transition-all duration-200 bg-white/90 dark:bg-slate-700 text-gray-900 dark:text-white shadow-lg hover:bg-white dark:hover:bg-slate-600"
        >
          Download Resume
        </a>
      </div>

      {/* Main content container for the PDF viewer */}
      <div className="flex flex-col items-center justify-center text-black dark:text-white p-4 transition-colors duration-200 mt-2">
        {mounted ? (
          <iframe
            src="/Nirvek_Pandey_Resume.pdf"
            className="w-full max-w-4xl h-[70vh] border border-gray-500 dark:border-gray-600 rounded-lg"
          >
            Your browser does not support PDFs.{" "}
            <a href="/Nirvek_Pandey_Resume.pdf" download>
              Download instead
            </a>.
          </iframe>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Loading PDF viewer...</p>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Resume;
