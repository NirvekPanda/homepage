"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Enables GitHub-Flavored Markdown

export default function MarkdownBox({ content }) {
  return (
    <div className="bg-zinc-800 p-5 rounded-lg shadow-md text-white">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => <p className="text-lg leading-relaxed mb-2" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-4 mb-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2" {...props} />, // Adds spacing between list items
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4">{props.children}</li>, // Prevents all bullets from being in one line
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-300" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-gray-800 p-1 rounded text-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
