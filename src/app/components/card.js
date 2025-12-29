"use client";

import LinkButton from "./button.js";
import LanguageTile from "./langTile.js";
import { PopoverProvider } from "../contexts/PopoverContext.js";
import { useBackgroundContext, shouldUseDynamicBackground } from "../contexts/BackgroundContext.js";
import { getProjectImageSrc } from "../utils/imageUtils.js";

export default function Card({ projectId, name, description, languages, image, link, date, code, github, demo, onClick, excerpt, showDate = false, isActive = false, category }) {
  const languageList = languages.split(",").map((lang) => lang.trim());
  
  const getDemoButtonText = () => {
    const cat = category?.toLowerCase();
    if (cat === "research") return "Paper";
    return "Demo";
  };
  
  const { processedImageUrl, isInitialized } = useBackgroundContext();
  
  const getImageSource = () => {
    if (shouldUseDynamicBackground(projectId) && isInitialized && processedImageUrl) {
      return processedImageUrl;
    }
    return getProjectImageSrc(image, name);
  };

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
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <PopoverProvider>
      <div
        onClick={onClick}
        className={`cursor-pointer relative flex flex-col my-2 ${
          isActive ? "bg-white/75 dark:bg-black/75 border-white/60 dark:border-gray-600/60 shadow-lg" : "bg-white/25 dark:bg-black/25 border-white/30 dark:border-gray-700/30 shadow-md"
        } backdrop-blur-sm hover:border-white/50 dark:hover:border-gray-600/50 rounded-lg w-full transition-colors duration-500 ease-in-out`}
      >

        <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
          <img
            src={getImageSource()}
            alt={name}
            className="object-cover w-full h-full transition-all duration-1000 ease-in-out"
            onError={(e) => {
              e.target.src = '/project-images/default.jpg';
            }}
          />
        </div>
        <div className="p-4">
          <h6 className="mb-2 text-black dark:text-white text-xl font-semibold text-center transition-colors duration-200">
            {name}
          </h6>
          
          {excerpt && (
            <p className="text-gray-700 dark:text-gray-300 text-sm text-center mb-3 line-clamp-3 transition-colors duration-200">
              {excerpt}
            </p>
          )}
          
          {showDate && date && (
            <p className="text-gray-600 dark:text-gray-400 text-xs text-center mb-3 transition-colors duration-200">
              {formatDate(date)}
            </p>
          )}
          
          <div className="flex justify-center gap-4 mt-4">
            {demo && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text={getDemoButtonText()} link={link} className="p-2" />
              </div>
            )}
            {code && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text="Code" link={github} className="p-2" />
              </div>
            )}
          </div>
        </div>
      </div>
    </PopoverProvider>
  );
}
