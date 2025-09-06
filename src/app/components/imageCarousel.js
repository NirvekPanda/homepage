"use client";

import React, { useState, useEffect, useRef } from "react";

const ImageCarousel = ({ title, images, className = "" }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // Auto-advance carousel every 8 seconds (reduced for better UX)
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Set up new interval
        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 8000);

        // Cleanup function
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [images.length]);

    // Reset timer when slide changes manually
    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 8000);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        resetTimer();
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
        resetTimer();
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
        resetTimer();
    };

    // Touch event handlers for mobile swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        
        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };


    return (
        <div 
            className={`relative w-full h-full ${className}`} 
            data-carousel="slide"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label={`${title} image carousel`}
        >
            {/* Carousel wrapper */}
            <div className="relative h-full overflow-hidden rounded-inherit">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                        data-carousel-item
                    >
                        <img
                            src={image}
                            alt={`${title} - Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                        />
                    </div>
                ))}
            </div>

            {/* Slider indicators - improved mobile visibility */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-3 sm:bottom-5 left-1/2 space-x-2 sm:space-x-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide 
                                ? 'bg-white shadow-lg scale-110' 
                                : 'bg-white/60 hover:bg-white/80 hover:scale-105'
                        }`}
                        aria-current={index === currentSlide}
                        aria-label={`Go to slide ${index + 1}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>

            {/* Slider controls - improved mobile visibility and theme consistency */}
            <button
                type="button"
                className={`absolute top-0 start-0 z-30 flex items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none transition-all duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0'
                }`}
                onClick={goToPrevious}
                aria-label="Previous image"
            >
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800/80 backdrop-blur-sm group-hover:bg-slate-700/90 group-focus:ring-4 group-focus:ring-slate-500 group-focus:outline-none transition-all duration-200 shadow-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                    </svg>
                </span>
            </button>
            <button
                type="button"
                className={`absolute top-0 end-0 z-30 flex items-center justify-center h-full px-2 sm:px-4 cursor-pointer group focus:outline-none transition-all duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-0'
                }`}
                onClick={goToNext}
                aria-label="Next image"
            >
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800/80 backdrop-blur-sm group-hover:bg-slate-700/90 group-focus:ring-4 group-focus:ring-slate-500 group-focus:outline-none transition-all duration-200 shadow-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                </span>
            </button>

            {/* Mobile touch indicators - only visible on mobile */}
            <div className="absolute top-2 right-2 z-20 sm:hidden">
                <div className="flex items-center space-x-1 text-white/70 text-xs">
                    <span className="bg-slate-800/60 px-2 py-1 rounded-full backdrop-blur-sm">
                        {currentSlide + 1} / {images.length}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ImageCarousel;
