"use client";

function Resume() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <a
        href="/Nirvek_Pandey_Resume.pdf"
        download
        className="bg-stone-900 rounded p-2 text-white hover:bg-stone-800 hover:text-aqua-500 hover:underline font-gisel-nano mb-6"
      >
        Download Resume
      </a>

      {/* PDF Viewer */}
      <iframe
        src="/Nirvek_Pandey_Resume.pdf"
        className="w-full max-w-4xl h-[80vh] border border-gray-500 rounded-lg"
      >
        Your browser does not support PDFs. <a href="/Nirvek_Pandey_Resume.pdf">Download instead</a>.
      </iframe>
    </div>
  );
}

export default Resume;
