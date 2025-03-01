"use client";

import { useState } from "react";
import LinkButton from "./button.js";
import CardModal from "./cardModal.js";
import LanguageTile from "./langTile.js";


export default function Card({ name, description, languages, image, link }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const languageList = languages.split(",").map((lang) => lang.trim());

  return (
    <>
      {/* Card element */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer relative flex flex-col my-6 bg-zinc-800 shadow-md border border-zinc-700 rounded-lg w-full max-w-sm"
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

          {/* View Project Button */}
          <div className="flex justify-center">
            {/* Prevents the modal from opening when clicking the button */}
            <div onClick={(e) => e.stopPropagation()}>
              <LinkButton text="View Project" link={link} className="p-2" />
            </div>
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
        languages={languageList}
      />
    </>
  );
}
