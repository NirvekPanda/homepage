"use client";

import "katex/dist/katex.min.css";
import katex from "katex";
import React from "react";

// Function to process text and separate math from normal text
function parseContent(content) {
  const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/g); // Split at $$...$$ (block) or $...$ (inline)
  
  return parts.map((part, index) => {
    if (part.startsWith("$$") && part.endsWith("$$")) {
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
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{
            __html: katex.renderToString(part.slice(1, -1), { throwOnError: false }),
          }}
        />
      );
    } else {
      // Handle normal text with Markdown-like features
      return (
        <p key={index} className="mb-2">
          {part
            .split("\n")
            .map((line, lineIndex) =>
              line.startsWith("- ") ? (
                <li key={lineIndex} className="ml-4 list-disc">
                  {line.slice(2)}
                </li>
              ) : (
                <span key={lineIndex}>{line} <br /></span>
              )
            )}
        </p>
      );
    }
  });
}

export default function LatexBox({ content }) {
  return (
    <div className="bg-zinc-800 p-5 rounded-lg shadow-md text-white text-lg leading-relaxed">
      {parseContent(content)}
    </div>
  );
}
