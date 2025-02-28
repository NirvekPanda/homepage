"use client";

import Link from "next/link";

export default function LinkButton({ text, link, isActive, className }) {
    const box_color = "bg-gray-900";
    const selected_box = "bg-gray-700";
    const text_color = "text-white";
    const hover_color = "hover:bg-gray-700 hover:text-aqua-500 hover:underline";

    return (
        <Link
            href={link}
            className={`${isActive ? selected_box : box_color} rounded px-3 py-2 ${hover_color} ${text_color} font-gisel-nano ${className}`}
        >
            {text}
        </Link>
    );
}
