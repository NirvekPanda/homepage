"use client";

import { useState, useEffect } from "react";
import LinkButton from "./button.js";


export default function Card({ name, description, languages, image, link }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const languageList = languages.split(",").map((lang) => lang.trim());

  // When modal opens, trigger the transition
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        setAnimateModal(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateModal(false);
    }
  }, [isModalOpen]);

  return (
    <>
      {/* Card element */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer relative flex flex-col my-6 bg-zinc-800 shadow-md border border-zinc-700 rounded-lg w-full max-w-sm"
      >
        <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
          <img
            src={image}
            alt="card-image"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <h6 className="mb-2 text-white text-xl font-semibold text-center">
            {name}
          </h6>

          <div className="flex justify-center">
            <LinkButton text="View Project" link={link} className="p-2" />
          </div>


          <p className="text-gray-300 leading-normal font-light">
            {description}
          </p>
        </div>
        <div className="px-4 pb-4 pt-0 mt-2 flex flex-wrap justify-center gap-2">
          {languageList.map((lang, index) => (
            <span
              key={index}
              className="bg-zinc-700 text-gray-200 px-2 py-1 rounded"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out ${animateModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
            style={{
              width: "calc(75vmin)",
              height: "calc(75vmin)"
            }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
            {/* Dimming overlay */}
            <div className="absolute inset-0 bg-black opacity-50" />
            {/* Centered content */}
            <div className="relative flex flex-col items-center justify-center h-full text-center text-white px-4">
              <h2 className="text-3xl font-bold mb-4">{name}</h2>
              <p className="text-lg">{description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
