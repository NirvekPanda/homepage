"use client";

import { useState, useRef, useEffect } from "react";

function BellIcon({ hasRing }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={`text-black dark:text-white transition-colors duration-200 ${
        hasRing ? "animate-bounce" : ""
      }`}
    >
      <path
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="transition-colors duration-200"
    >
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BellMessageWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus textarea when opening
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setError("");
    const formData = new FormData();
    formData.append("access_key", "5fbc3b8f-4eaa-46ff-a565-2dae4fc75cc5");
    formData.append("message", message);
    formData.append("subject", "Quick message from Bell Widget");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage("");
        setIsSent(true);
        setTimeout(() => {
          setIsSent(false);
          setIsOpen(false);
        }, 2000);
      } else {
        setError("Failed to send. Please try again.");
      }
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  const canSend = message.trim() && !isSending;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 flex flex-col items-end gap-2"
    >
      {/* Expandable message box */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 max-h-48 translate-y-0" : "opacity-0 max-h-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 rounded-lg p-3 w-72 shadow-lg">
          {isSent ? (
            <div className="flex items-center justify-center gap-2 py-3 text-green-500 font-medium">
              <CheckIcon />
              <span>Message sent!</span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <textarea
                ref={textareaRef}
                rows={3}
                className="flex-1 bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm resize-none outline-none"
                placeholder="Send a quick message… (Ctrl+Enter to send)"
                value={message}
                onChange={(e) => { setMessage(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                disabled={!canSend}
                title="Send message"
                className={`mt-1 p-1.5 rounded-lg transition-all duration-200 ${
                  canSend
                    ? "text-green-500 hover:bg-white/40 dark:hover:bg-black/40 cursor-pointer"
                    : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                }`}
              >
                {isSending ? (
                  <svg
                    className="animate-spin"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="31.4"
                      strokeDashoffset="10"
                    />
                  </svg>
                ) : (
                  <CheckIcon />
                )}
              </button>
            </div>
            {error && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
            )}
          )}
        </div>
      </div>

      {/* Bell icon button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close message box" : "Open message box"}
        className="bg-white/25 dark:bg-black/25 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-black/40 rounded-lg p-3 h-12 w-12 transition-all duration-200 cursor-pointer border border-white/30 dark:border-gray-700/30 flex items-center justify-center shadow-lg"
      >
        <BellIcon hasRing={!isOpen} />
      </button>
    </div>
  );
}
