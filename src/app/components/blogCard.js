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
        className="cursor-pointer relative flex flex-col my-6 bg-slate-700 shadow-md border border-slate-800 hover:border-4 rounded-lg w-full max-w-sm transition-all duration-100"
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
          <h6 className="mb-2 text-white text-xl font-semibold text-center">
            {title}
          </h6>
          
          {/* Excerpt */}
          <p className="text-gray-300 text-sm text-center mb-3 line-clamp-3">
            {excerpt}
          </p>
          
          {/* Date */}
          <p className="text-white text-xs text-center">
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
