export default function MessageSent() {
  return (
    <div
      id="toast-simple"
      className="flex items-center justify-center w-full max-w-xs p-4 space-x-4 text-black bg-white/25 backdrop-blur-sm rounded-lg shadow-lg border border-white/30"
      role="alert"
    >
      <svg
        className="w-5 h-5 text-blue-600 rotate-45"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 18 20"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m9 17 8 2L9 1 1 19l8-2Zm0 0V9"
        />
      </svg>
      <div className="text-sm font-normal text-center flex-grow">
        Message sent successfully.
      </div>
    </div>
  );
}
