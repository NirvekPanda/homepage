"use client";

import Link from "next/link";

export default function LinkButton({ text, link, isActive }) {
    const box_color = "bg-gray-900";
    const selected_box = "bg-gray-700";
    const text_color = "text-white";
    const hover_color =
        "hover:bg-grasy-700 hover:text-aqua-500 hover:underline";

    return (
        <Link
            href={link}
            className={
                isActive
                    ? `${selected_box} font-bold rounded p-2 underline ${hover_color} font-gisel-nano`
                    : `${box_color} rounded p-2 ${hover_color} ${text_color} font-gisel-nano`
            }
        >
            {text}
        </Link>
    );
}
