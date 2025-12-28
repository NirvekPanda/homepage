"use client";
import React, { useEffect, useRef, useState } from "react";
import Nav from "./nav";
import LocationTile from "./locationTile";

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
                className={`py-2 px-10 mt-2 mb-6`}
            >
                <div className="mx-auto flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-2 relative">
                    {/* Invisible placeholder - same dimensions as location tile */}
                    <div className="w-64 h-12 order-1 sm:order-1"></div>
                    
                    {/* Main header content*/}
                    <div className="max-w-4xl bg-white/25 backdrop-blur-sm rounded-lg px-8 py-2 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left flex-1 order-2 sm:order-2">
                        <h1 className="text-4xl sm:text-5xl text-black font-bold">
                            Nirvek Pandey
                        </h1>
                        <p
                            className="text-xl sm:text-2xl text-black mt-2 sm:mt-1 cursor-pointer"
                            onClick={() => (window.location.href = "/secret")}
                        >
                            Aspiring Network Engineer
                        </p>
                    </div>
                    
                    {/* Location Carousel - separate box on the right */}
                    <div className="bg-white/25 backdrop-blur-sm hover:bg-white/40 rounded-lg py-2 px-4 h-12 order-1 sm:order-3 max-w-64 transition-all duration-200 cursor-pointer">
                        <LocationTile />
                    </div>

                </div>
            </header>

            <Nav isVisible={isVisible} />
        </>
    );
}