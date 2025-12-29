"use client";

import { useState, useEffect } from "react";
import { parseContent } from "../utils/formatText.js";
import LanguageTile from "./langTile.js";
import LinkButton from "./button.js";
import { PopoverProvider } from "../contexts/PopoverContext.js";
import { useBackgroundContext, shouldUseDynamicBackground } from "../contexts/BackgroundContext.js";
import { getProjectImageSrc } from "../utils/imageUtils.js";

export default function CardModal({ isOpen, onClose, projectId, name, description, image, link, date, code, demo, github, languages, isFlipped = false, category, onPrevious, onNext, hasPrevious = false, hasNext = false }) {
  const [animateModal, setAnimateModal] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { processedImageUrl, isInitialized } = useBackgroundContext();
  
  const getExampleButtonText = () => {
    const cat = category?.toLowerCase();
    if (cat === "research") return "Paper";
    if (cat === "game") return "Try it out!";
    return "Example";
  };
  
  const getImageSource = () => {
    if (shouldUseDynamicBackground(projectId) && isInitialized && processedImageUrl) {
      return processedImageUrl;
    }
    return getProjectImageSrc(image, name);
  };

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

  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => {
        setSlideDirection(null);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [projectId, slideDirection]);

  const handlePrevious = () => {
    if (onPrevious && hasPrevious && !isAnimating) {
      setIsAnimating(true);
      setSlideDirection('right');
      setTimeout(() => onPrevious(), 150);
    }
  };

  const handleNext = () => {
    if (onNext && hasNext && !isAnimating) {
      setIsAnimating(true);
      setSlideDirection('left');
      setTimeout(() => onNext(), 150);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, isAnimating]);

  const getSlideClass = () => {
    if (!slideDirection) return 'translate-x-0 opacity-100';
    if (slideDirection === 'left') return '-translate-x-4 opacity-70';
    if (slideDirection === 'right') return 'translate-x-4 opacity-70';
    return '';
  };

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
        className={`relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm ${isFlipped ? "rounded-lg" : "rounded-lg"} overflow-y-auto transform transition-all duration-300 ease-in-out ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        style={{
          width: isFlipped ? "100%" : "80vw",
          height: isFlipped ? "100%" : "80vh",
          maxWidth: isFlipped ? "none" : "1024px",
          maxHeight: isFlipped ? "none" : "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${getSlideClass()}`}>
        <div className="relative w-full h-2/5 flex-shrink-0">
          <img
            src={getImageSource()}
            alt={name}
            className="object-cover w-full h-full rounded-t-lg transition-all duration-1000 ease-in-out"
            onError={(e) => {
              e.target.src = '/project-images/default.jpg';
            }}
          />
          <div className="absolute bottom-[-20px] left-0 right-0 flex justify-center gap-4">
            {demo && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text={getExampleButtonText()} link={link} className="p-2" />
              </div>
            )}
            {code && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text="GitHub" link={github} className="p-2" />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 pt-10">
          <h2 className="text-3xl font-bold mb-1 text-center text-black dark:text-white transition-colors duration-200">{name}</h2>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">{date}</p>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 rounded-lg shadow-lg text-black dark:text-white text-lg leading-relaxed border border-white/30 dark:border-gray-700/30 transition-all duration-200">
            <ul>{parseContent(description)}</ul>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {languages?.map((lang, index) => (
              <LanguageTile key={index} language={lang} />
            ))}
          </div>
        </div>
        </div>

        <button
          className="absolute top-3 right-3 bg-white/95 dark:bg-slate-700 backdrop-blur-sm text-black dark:text-white px-3 py-1 rounded-full hover:bg-white dark:hover:bg-slate-600 transition border border-white/30 dark:border-gray-600"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
    </PopoverProvider>
  );
}
