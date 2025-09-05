"use client";

import { useState } from "react";
import LinkButton from "./button.js";
import CardModal from "./cardModal.js";
import LanguageTile from "./langTile.js";
import { PopoverProvider } from "../contexts/PopoverContext.js";
import { getProjectImageSrc } from "../utils/imageUtils.js";

export default function Card({ name, description, languages, image, link, date, code, github, demo }) {
  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const languageList = languages.split(",").map((lang) => lang.trim());

  return (
    <PopoverProvider>
      {/* Card element */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer relative flex flex-col my-6 bg-slate-700 shadow-md border border-slate-800 hover:border-4 rounded-lg w-full max-w-sm transition-all duration-100"
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
          <h6 className="mb-2 text-white text-xl font-semibold text-center">
            {name}
          </h6>
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
        {/* Language List */}
        <div className="px-4 pb-4 pt-0 mt-2 flex flex-wrap justify-center gap-2">
          {languageList.map((lang, index) => (
            <LanguageTile key={index} language={lang} />
          ))}
        </div>
      </div>

      {/* Modal Component */}
      <CardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={name}
        description={description}
        image={image}
        date={date}
        demo={demo}
        link={link}
        code={code}
        github={github}
        languages={languageList}
      />
    </PopoverProvider>
  );
}
