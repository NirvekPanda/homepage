"use client";

import { useState, useEffect } from "react";
import { parseContent } from "../utils/formatText.js";
import LanguageTile from "./langTile.js";
import LinkButton from "./button.js";
import { PopoverProvider } from "../contexts/PopoverContext.js";
import { getProjectImageSrc } from "../utils/imageUtils.js";

export default function CardModal({ isOpen, onClose, name, description, image, link, date, code, demo, github, languages, isFlipped = false }) {
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
        className={`${isFlipped ? "relative" : "fixed inset-0 z-50"} flex items-center justify-center transition-opacity duration-300 ease-in-out ${isFlipped ? "" : "bg-black bg-opacity-50"}`}
        onClick={isFlipped ? undefined : onClose}
      >
      <div
        data-testid="card-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white/95 backdrop-blur-sm ${isFlipped ? "rounded-lg" : "rounded-lg"} overflow-y-auto transform transition-all duration-300 ease-in-out ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        style={{
          width: isFlipped ? "100%" : "80vw",
          height: isFlipped ? "100%" : "80vh",
          maxWidth: isFlipped ? "none" : "800px",
          maxHeight: isFlipped ? "none" : "90vh",
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
          <h2 className="text-3xl font-bold mb-1 text-center text-black">{name}</h2>
          <p className="text-center text-gray-700 mb-4">{date}</p>
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-lg shadow-lg text-black text-lg leading-relaxed border border-white/30">
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
          className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-black px-3 py-1 rounded-full hover:bg-white transition border border-white/30"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
    </PopoverProvider>
  );
}
