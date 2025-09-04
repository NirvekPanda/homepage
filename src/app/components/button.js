"use client";

import Link from "next/link";

export default function LinkButton({ text, link, isActive, className }) {
    return (
        <Link
            href={link}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 bg-slate-900 ${
                isActive
                    ? "bg-[#F5ECD5] text-gray-900 shadow-lg"
                    : "bg-slate-700/50 text-gray-300 hover:bg-slate-600 hover:text-white"
            } ${className || ""}`}
        >
            {text}
        </Link>
    );
}
