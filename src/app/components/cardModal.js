"use client";

import { useState, useEffect } from "react";
import { parseContent } from "../utils/formatText.js";

export default function CardModal({ isOpen, onClose, name, description, image }) {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-zinc-900 rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        style={{
          width: "80vw",
          height: "80vh",
          maxWidth: "900vw",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Image Section */}
        <div className="relative w-full h-1/2">
          <img
            src={image}
            alt="card-image"
            className="object-cover w-full h-full rounded-t-lg"
          />
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-3xl font-bold mb-4 text-center">{name}</h2>
          <div className="bg-zinc-800 p-5 rounded-lg shadow-md text-white text-lg leading-relaxed">
            <ul>{parseContent(description)}</ul>
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
