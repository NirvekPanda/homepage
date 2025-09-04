"use client";

import { useState, useEffect } from "react";
import { parseContent } from "../utils/formatText.js";

export default function BlogModal({ isOpen, onClose, title, content, excerpt, publishedAt, slug }) {
  const [animateModal, setAnimateModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setAnimateModal(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateModal(false);
    }
  }, [isOpen]);

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
    
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${displayHours}:${displayMinutes} ${ampm}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-gradient-to-b from-stone-700 to-zinc-900 rounded-lg overflow-y-auto transform transition-all duration-300 ease-in-out ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        style={{
          width: "80vw",
          height: "80vh",
          maxWidth: "1200px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Content Section - No top image banner */}
        <div className="flex-1 p-6 flex flex-col">
          {/* Blog Title */}
          <h2 className="text-3xl font-bold mb-2 text-center text-white">{title}</h2>
          
          {/* Date */}
          <p className="text-center text-white mb-6">{formatDate(publishedAt)}</p>
          
          {/* Blog Content - Expanded to fill available space */}
          <div className="bg-gradient-to-b from-slate-700 to-gray-700 p-6 rounded-lg shadow-lg text-white text-lg leading-relaxed flex-1">
            <div>{parseContent(content)}</div>
          </div>
        </div>

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-700 transition"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
