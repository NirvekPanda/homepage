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

  const formatDate = (dateInput) => {
    if (!dateInput) return 'No date';

    let date;

    if (dateInput && typeof dateInput === 'object' && dateInput.toDate) {
      date = dateInput.toDate();
    } else {
      date = new Date(dateInput);
    }

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
        className={`relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg overflow-y-auto transform transition-all duration-300 ease-in-out ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
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
        <div className="flex-1 p-6 flex flex-col">
          <h2 className="text-3xl font-bold mb-2 text-center text-black dark:text-white transition-colors duration-200">{title}</h2>
          
          <p className="text-center text-gray-700 dark:text-gray-300 mb-6 transition-colors duration-200">{formatDate(publishedAt)}</p>
          
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-lg text-black dark:text-white text-lg leading-relaxed flex-1 border border-white/30 dark:border-gray-700/30 transition-all duration-200">
            <div>{parseContent(content)}</div>
          </div>
        </div>

        <button
          className="absolute top-3 right-3 bg-slate-700 dark:bg-slate-600 text-white px-3 py-1 rounded-full hover:bg-slate-600 dark:hover:bg-slate-500 transition"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
