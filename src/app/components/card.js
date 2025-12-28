"use client";

import LinkButton from "./button.js";
import LanguageTile from "./langTile.js";
import { PopoverProvider } from "../contexts/PopoverContext.js";
import { getProjectImageSrc } from "../utils/imageUtils.js";

export default function Card({ name, description, languages, image, link, date, code, github, demo, onClick, excerpt, showDate = false, isActive = false }) {
  const languageList = languages.split(",").map((lang) => lang.trim());

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
    <PopoverProvider>
      {/* Card element */}
      <div
        onClick={onClick}
        className={`cursor-pointer relative flex flex-col my-2 ${
          isActive ? "bg-white/75 border-white/60 shadow-lg" : "bg-white/25 border-white/30 shadow-md"
        } backdrop-blur-sm hover:border-white/50 rounded-lg w-full transition-colors duration-500 ease-in-out`}
      >

        {/* Image Section */}
        <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
          <img
            src={getProjectImageSrc(image, name)}
            alt={name}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.src = '/project-images/default.jpg';
            }}
          />
        </div>
        {/* Project Name */}
        <div className="p-4">
          <h6 className="mb-2 text-black text-xl font-semibold text-center">
            {name}
          </h6>
          
          {/* Excerpt for blog posts */}
          {excerpt && (
            <p className="text-gray-700 text-sm text-center mb-3 line-clamp-3">
              {excerpt}
            </p>
          )}
          
          {/* Date for blog posts */}
          {showDate && date && (
            <p className="text-gray-600 text-xs text-center mb-3">
              {formatDate(date)}
            </p>
          )}
          
          {/* Button Row */}
          <div className="flex justify-center gap-4 mt-4">
            {demo && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text="Demo" link={link} className="p-2" />
              </div>
            )}
            {code && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text="Code" link={github} className="p-2" />
              </div>
            )}
          </div>
        </div>
        
        {/* Language List - only show if there are languages */}
        {/* {languageList.length > 0 && languageList[0] !== "" && (
          <div className="px-4 pb-4 pt-0 mt-2 flex flex-wrap justify-center gap-2">
            {languageList.map((lang, index) => (
              <LanguageTile key={index} language={lang} />
            ))}
          </div>
        )} */}
      </div>
    </PopoverProvider>
  );
}
