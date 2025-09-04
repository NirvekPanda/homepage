"use client";

import React from "react";
import { parseContent } from "../utils/formatText.js";
import ImageCarousel from "./imageCarousel.js";
import Footer from "./footer.js";


const profileImages = [
    "/profile-pictures/redondo_pier.jpg",
    "/profile-pictures/golf_range.jpg",
    "/profile-pictures/london_bridge.jpg", 
    "/profile-pictures/pantheon.jpg",
    "/profile-pictures/rick_car.jpg",
    "/profile-pictures/sagrada_famila.jpg",
    "/profile-pictures/ucsd_sweater.jpg",
    "/profile-pictures/vespa.jpg"
];

const Hero = ({ title, paragraph }) => {
    return (
        <section className="w-5/6 max-w-6xl mx-auto flex flex-col md:flex-row bg-white rounded-3xl shadow-lg min-h-[60vh] overflow-hidden border border-gray-400">

            <div className="md:w-1/2 relative h-64 md:h-auto">
                <ImageCarousel 
                    title={title}
                    images={profileImages}
                    className="rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
                />
            </div>


            <div className="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center bg-gray-600 rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">{title}</h1>
                <div className="text-gray-200 space-y-3 sm:space-y-4 w-full max-w-md text-justify leading-relaxed text-xs sm:text-sm md:text-base px-2 mb-4">
                    {parseContent(paragraph)}
                </div>
            
            <Footer />            
            
            </div>

            
        </section>
    );
};

export default Hero;