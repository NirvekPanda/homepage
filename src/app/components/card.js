"use client";

import { useState } from "react";
import LinkButton from "./button.js";
import CardModal from "./cardModal.js";
import LanguageTile from "./langTile.js";

// hasDemo={project.demo}
// hasCode={project.code}
// github={project.github}
// date={project.date}

export default function Card({ name, description, languages, image, link, date, hasCode, github, hasDemo }) {
  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const languageList = languages.split(",").map((lang) => lang.trim());

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
            src={image}
            alt="card-image"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Project Name */}
        <div className="p-4">
          <h6 className="mb-2 text-white text-xl font-semibold text-center">
            {name}
          </h6>
          {/* Button Row */}
          <div className="flex justify-center gap-4 mt-4">
            {hasDemo && (
              <div onClick={(e) => e.stopPropagation()}>
                <LinkButton text="Demo" link={link} className="p-2" />
              </div>
            )}
            {hasCode && (
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
        hasDemo={hasDemo}
        link={link}
        hasCode={hasCode}
        github={github}
        languages={languageList}
      />
    </>
  );
}
