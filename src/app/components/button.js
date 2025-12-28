"use client";

import Link from "next/link";

export default function LinkButton({ text, link, isActive, className }) {
    return (
        <Link
            href={link}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                isActive
                    ? "bg-white/90 dark:bg-slate-700 text-gray-900 dark:text-white shadow-lg"
                    : "bg-slate-700/50 dark:bg-slate-800/50 text-gray-300 hover:bg-slate-600 dark:hover:bg-slate-700 hover:text-white"
            } ${className || ""}`}
        >
            {text}
        </Link>
    );
}
