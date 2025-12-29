"use client";

import { useState, useEffect } from "react";

export default function Nav({ isVisible = true, isMobileMenuOpen = false, onNavClick = () => {} }) {
    const [activeSection, setActiveSection] = useState("home");

    const navItems = [
        { name: "Home", link: "#home" },
        { name: "Projects", link: "#projects" },
        { name: "Resume", link: "#resume" },
        { name: "Contact Me", link: "#contact" },
    ];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                    window.history.replaceState(null, "", `#${entry.target.id}`);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    const handleClick = (e, link) => {
        e.preventDefault();
        const targetId = link.substring(1); // Remove '#'
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        onNavClick();
    };

    return (
        <>
            <nav className={`hidden sm:flex fixed top-24 left-0 right-0 w-full justify-center z-50 transition-transform duration-200 ease-out ${
                isVisible ? "translate-y-0" : "-translate-y-full"
            }`}>
                <div className="bg-white/25 backdrop-blur-sm rounded-lg p-1 flex space-x-1 overflow-x-auto scrollbar-hide max-w-[580px]">
                    {navItems.map((item) => (
                        <a
                            key={item.link}
                            href={item.link}
                            onClick={(e) => handleClick(e, item.link)}
                            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                                activeSection === item.link.substring(1)
                                    ? "bg-[#F5ECD5] text-gray-900 shadow-lg"
                                    : "text-black hover:bg-white/40"
                            }`}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </nav>

            <nav className={`fixed top-20 right-0 h-screen w-64 bg-white/95 backdrop-blur-sm z-40 transition-transform duration-200 ease-out transform sm:hidden border-l border-white/30 ${
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}>
                <div className="flex flex-col py-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <a
                            key={item.link}
                            href={item.link}
                            onClick={(e) => handleClick(e, item.link)}
                            className={`px-4 py-3 rounded-md font-medium transition-all duration-200 text-center ${
                                activeSection === item.link.substring(1)
                                    ? "bg-[#F5ECD5] text-gray-900 shadow-lg"
                                    : "text-black hover:bg-white/40"
                            }`}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 sm:hidden"
                    onClick={onNavClick}
                />
            )}
        </>
    );
}
