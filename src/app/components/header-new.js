"use client";
import React, { useEffect, useRef, useState } from "react";
import Nav from "./nav";
import LocationTile from "./locationTile";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(0);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY.current) {
                setIsVisible(true);
            }
            else if (currentScrollY - lastScrollY.current > 50) {
                setIsVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header
                className={`py-5 px-4 sm:px-10 transition-all duration-300 fixed top-0 left-0 right-0 z-50 ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                <div className="mx-auto flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-4 relative">
                    <div className="w-64 h-12 order-1 sm:order-1 hidden sm:block"></div>
                    
                    <div className="max-w-4xl bg-white/25 backdrop-blur-sm rounded-lg px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left flex-1 order-2 sm:order-2 mx-4">
                        <h1 className="text-2xl sm:text-5xl text-black font-bold">
                            Nirvek Pandey
                        </h1>
                        <p
                            className="text-sm sm:text-2xl text-black mt-2 sm:mt-1 cursor-pointer"
                            onClick={() => (window.location.href = "/secret")}
                        >
                            Aspiring Network Engineer
                        </p>
                    </div>
                    
                    <div className="bg-white/25 backdrop-blur-sm hover:bg-white/40 rounded-lg py-4 px-4 h-12 order-1 sm:order-3 max-w-64 transition-all duration-200 cursor-pointer hidden sm:block">
                        <LocationTile />
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="sm:hidden order-3 p-2 rounded-lg bg-white/25 backdrop-blur-sm hover:bg-white/40 transition-all border border-white/30"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-black" />
                        ) : (
                            <Menu className="w-6 h-6 text-black" />
                        )}
                    </button>
                </div>
            </header>

            <Nav isVisible={isVisible} isMobileMenuOpen={isMobileMenuOpen} onNavClick={handleNavClick} />
        </>
    );
}
