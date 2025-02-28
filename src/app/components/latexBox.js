"use client";

import "katex/dist/katex.min.css";
import katex from "katex";
import React from "react";

// Function to parse content with support for new lines, bullet points, tabbed bullets, italics, and hyperlinks
function parseContent(content) {
  const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/g); // Split at $$...$$ (block) or $...$ (inline)

  return parts.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
      // Block math mode
      return (
        <div
          key={index}
          className="my-2"
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(part.slice(2, -2), { displayMode: true, throwOnError: false }),
          }}
        />
      );
    } else if (part.startsWith("$") && part.endsWith("$")) {
      // Inline math mode
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(part.slice(1, -1), { throwOnError: false }),
          }}
        />
      );
    } else {
      // Process normal text (new lines, bullet points, tabbed bullets, italics, and hyperlinks)
      return (
        <div key={index} className="mb-2">
          {part.split("\\n").map((line, lineIndex) => {
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
          })}
        </div>
      );
    }
  });
}

// Function to format text (supports italics and hyperlinks)
function formatText(text) {
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

export default function LatexBox({ content }) {
  return (
    <div className="bg-zinc-800 p-5 rounded-lg shadow-md text-white text-lg leading-relaxed">
      {parseContent(content)}
    </div>
  );
}
