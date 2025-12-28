export default function MessageSent() {
  return (
    <div
      className="flex items-center justify-center py-2 gap-2"
      role="alert"
    >
      <svg
        className="w-5 h-5 text-black dark:text-white flex-shrink-0 transition-colors duration-200 rotate-45"
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
      <span className="text-black dark:text-white text-base font-medium transition-all duration-200 text-center leading-tight">
        Message sent successfully.
      </span>
    </div>
  );
}
