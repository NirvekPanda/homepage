"use client";

import { useState } from "react";

export default function DoorbellButton() {
  const [state, setState] = useState("idle"); // 'idle' | 'ringing' | 'rang' | 'error'

  const handleRing = async () => {
    if (state !== "idle") return;
    setState("ringing");

    try {
      const res = await fetch("/api/doorbell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "admin-upload-page",
          message: "Admin rang the doorbell",
        }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      setState("rang");
      setTimeout(() => setState("idle"), 2000);
    } catch (err) {
      console.error("Doorbell ring failed:", err);
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  };

  const tooltip =
    state === "ringing"
      ? "Ringing..."
      : state === "rang"
      ? "Rung!"
      : state === "error"
      ? "Failed — try again"
      : "Ring doorbell";

  return (
    <button
      onClick={handleRing}
      disabled={state !== "idle"}
      aria-label={tooltip}
      title={tooltip}
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-200 cursor-pointer disabled:cursor-default group
        ${
          state === "rang"
            ? "bg-green-500/30 dark:bg-green-700/30 border-green-400/50 dark:border-green-600/50"
            : state === "error"
            ? "bg-red-500/30 dark:bg-red-900/30 border-red-400/50 dark:border-red-700/50"
            : "bg-white/25 dark:bg-black/25 border-white/30 dark:border-gray-700/30 hover:bg-white/40 dark:hover:bg-black/40"
        }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-all duration-200
          ${
            state === "rang"
              ? "text-green-700 dark:text-green-300"
              : state === "error"
              ? "text-red-700 dark:text-red-400"
              : "text-gray-900 dark:text-white group-hover:scale-110"
          }
          ${state === "ringing" ? "doorbell-wiggle" : ""}`}
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>

      <style jsx>{`
        @keyframes doorbell-wiggle {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-18deg); }
          30% { transform: rotate(14deg); }
          45% { transform: rotate(-10deg); }
          60% { transform: rotate(8deg); }
          75% { transform: rotate(-4deg); }
        }
        .doorbell-wiggle {
          animation: doorbell-wiggle 0.6s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>
    </button>
  );
}
