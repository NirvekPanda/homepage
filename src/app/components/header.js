"use client";
import React, { useEffect, useRef, useState } from "react";
import Nav from "./nav";

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY === 0) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={`py-5 px-10 transition-all duration-500 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                    }`}
            >
                <div className="mx-auto flex justify-center">
                    {/* Main header content - centered */}
                    <div className="max-w-4xl bg-gradient-to-b from-stone-700 to-zinc-700 rounded-3xl px-8 py-3 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left">
                        <h1 className="text-4xl sm:text-5xl text-[#F5ECD5] font-bold">
                            Nirvek Pandey
                        </h1>
                        <p
                            className="text-xl sm:text-2xl text-[#FFFAEC] mt-2 sm:mt-1 cursor-pointer"
                            onClick={() => (window.location.href = "/secret")}
                        >
                            Aspiring Network Engineer
                        </p>
                    </div>
                </div>
            </header>

            <Nav />
        </>
    );
}