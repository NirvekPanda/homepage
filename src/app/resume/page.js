"use client";

import { useState, useEffect } from "react";

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
          className="px-6 py-3 rounded-md font-medium transition-all duration-200 bg-[#F5ECD5] text-gray-900 shadow-lg hover:bg-[#E6D4B8] mt-6"
        >
          Download Resume
        </a>
      </div>

      {/* Main content container for the PDF viewer */}
      <div className="flex flex-col items-center justify-center text-white p-4 mb-2 mt-4">
        {mounted ? (
          <iframe
            src="/Nirvek_Pandey_Resume.pdf"
            className="w-full max-w-5xl h-[80vh] border border-gray-500 rounded-lg"
          >
            Your browser does not support PDFs.{" "}
            <a href="/Nirvek_Pandey_Resume.pdf" download>
              Download instead
            </a>.
          </iframe>
        ) : (
          <p className="text-gray-400">Loading PDF viewer...</p>
        )}
      </div>
    </>
  );
}

export default Resume;
