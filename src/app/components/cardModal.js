"use client";

import { useState, useEffect } from "react";
import { parseContent } from "../utils/formatText.js";
import LanguageTile from "./langTile.js";
import LinkButton from "./button.js";
import { PopoverProvider } from "../contexts/PopoverContext.js";
import { getProjectImageSrc } from "../utils/imageUtils.js";

export default function CardModal({ isOpen, onClose, name, description, image, link, date, code, demo, github, languages }) {
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
    <PopoverProvider>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-50"
        onClick={onClose}
      >
      <div
        data-testid="card-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-gradient-to-b from-stone-700 to-zinc-900 rounded-lg overflow-y-auto transform transition-all duration-300 ease-in-out ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        style={{
          width: "80vw",
          height: "80vh",
          maxWidth: "800px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Image Section */}
        <div className="relative w-full h-2/5">
          <img
            src={getProjectImageSrc(image, name)}
            alt={name}
            className="object-cover w-full h-full rounded-t-lg"
            onError={(e) => {
              e.target.src = '/project-images/default.jpg';
            }}
          />
          {/* Buttons overlay */}
          <div className="absolute bottom-[-20px] left-0 right-0 flex justify-center gap-4">
            {demo && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text="Example" link={link} className="p-2" />
              </div>
            )}
            {code && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text="GitHub" link={github} className="p-2" />
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 p-6 pt-10">
          {/* Extra top padding to account for the overlapping buttons */}
          <h2 className="text-3xl font-bold mb-1 text-center">{name}</h2>
          <p className="text-center text-gray-400 mb-4">{date}</p>
          <div className="bg-gradient-to-b from-slate-700 to-gray-700 p-5 rounded-lg shadow-lg text-white text-lg leading-relaxed">
            <ul>{parseContent(description)}</ul>
          </div>
          {/* Languages Section */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {languages?.map((lang, index) => (
              <LanguageTile key={index} language={lang} />
            ))}
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
    </PopoverProvider>
  );
}
