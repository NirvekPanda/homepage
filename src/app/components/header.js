"use client";
import React, { useEffect, useState } from "react";
import Nav from "./nav";

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    let lastScrollY = 0;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY === 0) {
                setIsVisible(true); // Show header when at the top
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false); // Hide header when scrolling down
            } else {
                setIsVisible(true); // Show header when scrolling up
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={`bg-zinc-800 py-6 px-10 transition-all duration-700 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                    }`}
            >
                <div className="max-w-5xl mx-auto bg-neutral-600 rounded-3xl px-8 py-6 flex flex-row items-center justify-between">
                    {/* Left: Name */}
                    <h1 className={`${geistMono.variable} text-6xl text-[#F5ECD5] font-bold`}>
                        Nirvek Pandey
                    </h1>

                    {/* Right: Title */}
                    <p className={`${geistSans.variable} text-4xl text-[#FFFAEC] ml-8 sm:ml-12`}>
                        Software & ML Engineer
                    </p>
                </div>
            </header>

            <div className="bg-light-gray text-transparent text-center py-1">
                (secret)
            </div>
            <Nav />
        </>
    );
}
