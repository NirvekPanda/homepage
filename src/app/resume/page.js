"use client";

import { useState, useEffect } from "react";

function Resume() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const box_color = "bg-gray-900";
  const hover_color = "hover:bg-gray-700 hover:text-aqua-500 hover:underline";
  const text_color = "text-white";

  return (
    <>
      {/* Header container for the download button */}
      <div className="flex flex-col items-center">
        <a
          href="/Nirvek_Pandey_Resume.pdf"
          download
          className={`${box_color} rounded px-4 py-2 ${hover_color} ${text_color} font-gisel-nano mt-6`}
        >
          Download Resume
        </a>
      </div>

      {/* Main content container for the PDF viewer */}
      <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 -mt-12">
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
