"use client";

import React from 'react';
import Link from 'next/link';

export default function CalendarIcon() {
  const today = new Date().getDate();

  return (
    <Link href="/calendar">
      <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-black/40 rounded-lg py-2 px-3 h-12 transition-all duration-200 cursor-pointer border border-white/30 dark:border-gray-700/30 flex items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          className="text-black dark:text-white transition-colors duration-200"
        >
          {/* Calendar body with curved corners */}
          <rect
            x="2"
            y="4"
            width="20"
            height="18"
            rx="3"
            ry="3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          
          {/* Top header bar */}
          <rect
            x="2"
            y="4"
            width="20"
            height="5"
            rx="3"
            ry="3"
            fill="currentColor"
          />
          {/* Bottom fill for header to make sharp bottom edge */}
          <rect
            x="2"
            y="6"
            width="20"
            height="3"
            fill="currentColor"
          />
          
          {/* Left punch hole */}
          <circle
            cx="7"
            cy="4"
            r="1.5"
            fill="currentColor"
          />
          <circle
            cx="7"
            cy="4"
            r="1"
            className="fill-white dark:fill-black"
          />
          
          {/* Right punch hole */}
          <circle
            cx="17"
            cy="4"
            r="1.5"
            fill="currentColor"
          />
          <circle
            cx="17"
            cy="4"
            r="1"
            className="fill-white dark:fill-black"
          />
          
          {/* Date number */}
          <text
            x="12"
            y="16"
            textAnchor="middle"
            dominantBaseline="central"
            fill="currentColor"
            fontSize="9"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {today}
          </text>
        </svg>
      </div>
    </Link>
  );
}
