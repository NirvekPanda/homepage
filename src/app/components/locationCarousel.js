"use client";

import React, { useState, useEffect, useRef } from "react";

const LocationCarousel = ({ locations, className = "" }) => {
    const [currentLocation, setCurrentLocation] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isBlurred, setIsBlurred] = useState(false);
    const intervalRef = useRef(null);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // Auto-advance carousel every 6 seconds
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setCurrentLocation((prev) => (prev + 1) % locations.length);
        }, 6000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [locations.length]);

    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
            setCurrentLocation((prev) => (prev + 1) % locations.length);
        }, 6000);
    };

    const goToLocation = (index) => {
        setCurrentLocation(index);
        resetTimer();
    };

    const goToPrevious = () => {
        setCurrentLocation((prev) => (prev - 1 + locations.length) % locations.length);
        resetTimer();
    };

    const goToNext = () => {
        setCurrentLocation((prev) => (prev + 1) % locations.length);
        resetTimer();
    };

    // Handle blur toggle when pin is clicked
    const handlePinClick = (e) => {
        e.stopPropagation(); // Prevent carousel navigation
        setIsBlurred(!isBlurred);
    };

    // Apply blur effect to body
    useEffect(() => {
        if (isBlurred) {
            document.body.style.filter = 'blur(3px)';
            document.body.style.transition = 'filter 0.5s ease-in-out';
        } else {
            document.body.style.filter = 'none';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.filter = 'none';
        };
    }, [isBlurred]);

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
        const isLeftSwipe = distance > 30; // Reduced threshold for easier swiping
        const isRightSwipe = distance < -30;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Mouse drag support for desktop
    const handleMouseDown = (e) => {
        if (e.target.closest('button')) return; // Don't drag if clicking the pin button
        touchStartX.current = e.clientX;
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (touchStartX.current === null) return;
        touchEndX.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        
        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > 30;
        const isRightSwipe = distance < -30;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrevious();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        }
    };

    return (
        <div 
            className={`relative w-full h-full ${className}`} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Location carousel - swipe left/right or use arrow keys to navigate"
        >
            {/* Location wrapper */}
            <div className="relative h-full overflow-hidden rounded-inherit">
                {locations.map((location, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                            index === currentLocation ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <div className="flex items-center justify-center h-full px-2">
                            <div className="flex items-center space-x-2 whitespace-nowrap">
                                <button
                                    onClick={handlePinClick}
                                    className="p-1 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                    aria-label={isBlurred ? "Disable blur" : "Enable blur"}
                                >
                                    <svg 
                                        className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 transition-colors duration-200 ${
                                            isBlurred ? 'text-black' : 'text-[#F5ECD5]'
                                        }`}
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <span className="text-[#F5ECD5] text-sm sm:text-base font-medium">
                                    {location}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>



        </div>
    );
};

export default LocationCarousel;
