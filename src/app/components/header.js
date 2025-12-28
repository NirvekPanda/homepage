"use client";
import React, { useEffect, useRef, useState } from "react";
import Nav from "./nav";
import LocationTile from "./locationTile";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // If user scrolls up, show header/nav
            if (currentScrollY < lastScrollY.current) {
                setIsVisible(true);
            }
            // If user scrolls down more than 50px, hide header/nav
            else if (currentScrollY - lastScrollY.current > 50) {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={`py-2 mt-2 mb-0 lg:mb-8`}
            >
                {/* Mobile Layout */}
                <div className="sm:hidden flex flex-col items-center gap-1">
                    {/* Top row: Dark mode toggle + Location tile */}
                    <div className="flex items-center justify-center gap-3">
                        <DarkModeToggle />
                        <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-black/40 rounded-lg py-2 px-4 h-12 transition-all duration-200 cursor-pointer border border-white/30 dark:border-gray-700/30">
                            <LocationTile />
                        </div>
                    </div>
                    {/* Name box - same width as hero, centered */}
                    <div className="w-5/6 max-w-5xl bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg px-8 py-3 border border-white/30 dark:border-gray-700/30 transition-all duration-200">
                        <h1 className="text-3xl text-black dark:text-white font-bold text-center transition-colors duration-200">
                            Nirvek Pandey
                        </h1>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex px-10 items-center justify-center relative">
                    {/* Dark mode toggle on left - absolute positioned */}
                    <div className="absolute left-10">
                        <DarkModeToggle />
                    </div>
                    
                    {/* Main header content - centered */}
                    <div className="max-w-4xl bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg px-8 py-2 flex flex-row items-center justify-between text-left border border-white/30 dark:border-gray-700/30 transition-all duration-200">
                        <h1 className="text-4xl md:text-5xl text-black dark:text-white font-bold transition-colors duration-200">
                            Nirvek Pandey
                        </h1>
                        <p
                            className="text-xl sm:text-2xl text-black dark:text-white mt-1 cursor-pointer transition-colors duration-200 ml-8"
                            onClick={() => (window.location.href = "/secret")}
                        >
                            Aspiring Network Engineer
                        </p>
                    </div>
                    
                    {/* Location Carousel on right - absolute positioned */}
                    <div className="absolute right-10 bg-white/25 dark:bg-black/25 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-black/40 rounded-lg py-2 px-4 h-12 transition-all duration-200 cursor-pointer border border-white/30 dark:border-gray-700/30">
                        <LocationTile />
                    </div>
                </div>
            </header>

            <Nav isVisible={isVisible} />
        </>
    );
}