"use client";

import { useState } from "react";
import BlogModal from "./blogModal.js";

export default function BlogCard({ title, excerpt, publishedAt, slug, content }) {
  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format the date consistently for SSR
  const formatDate = (dateInput) => {
    if (!dateInput) return 'No date';
    
    let date;
    
    // Handle Firestore Timestamp objects
    if (dateInput && typeof dateInput === 'object' && dateInput.toDate) {
      date = dateInput.toDate();
    } else {
      date = new Date(dateInput);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <>
      {/* Card element */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer relative flex flex-col my-6 bg-white/25 dark:bg-black/25 backdrop-blur-sm shadow-md border border-white/30 dark:border-gray-700/30 hover:border-white/50 dark:hover:border-gray-600/50 rounded-lg w-full max-w-sm transition-all duration-100"
      >
                        {/* Image Section */}
                <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                  <img
                    src={`/blog-images/${slug}.jpg`}
                    alt={title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = '/blog-images/default.jpg';
                    }}
                  />
                </div>

        {/* Blog Content */}
        <div className="p-4">
          <h6 className="mb-2 text-black dark:text-white text-xl font-semibold text-center transition-colors duration-200">
            {title}
          </h6>
          
          {/* Excerpt */}
          <p className="text-gray-700 dark:text-gray-300 text-sm text-center mb-3 line-clamp-3 transition-colors duration-200">
            {excerpt}
          </p>
          
          {/* Date */}
          <p className="text-gray-600 dark:text-gray-400 text-xs text-center transition-colors duration-200">
            {formatDate(publishedAt)}
          </p>
        </div>
      </div>

      {/* Modal Component */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        content={content}
        excerpt={excerpt}
        publishedAt={publishedAt}
        slug={slug}
      />
    </>
  );
}
