"use client";

import React from "react";

// Function to format text (supports italics and hyperlinks)
export function formatText(text) {
    return text.split(/(\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
        if (part.startsWith("*") && part.endsWith("*")) {
            // Italic text
            return (
                <em key={index} className="italic">
                    {part.slice(1, -1)}
                </em>
            );
        } else if (part.match(/\[([^\]]+)\]\(([^)]+)\)/)) {
            // Hyperlink
            const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
            return (
                <a key={index} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                    {match[1]}
                </a>
            );
        }
        return part; // Regular text
    });
}

// Function to parse content with support for new lines, bullet points, tabbed bullets, italics, and hyperlinks
export function parseContent(content) {
    return content.split("\\n").map((line, lineIndex) => {
        if (line.startsWith("-- ")) {
            // Tabbed bullet point
            return (
                <li key={lineIndex} className="ml-12 list-disc">
                    {formatText(line.slice(3))}
                </li>
            );
        } else if (line.startsWith("- ")) {
            // Regular bullet point
            return (
                <li key={lineIndex} className="ml-4 list-disc">
                    {formatText(line.slice(2))}
                </li>
            );
        } else {
            // Regular text with formatting
            return (
                <p key={lineIndex} className="mb-2">
                    {formatText(line)}
                </p>
            );
        }
    });
}
