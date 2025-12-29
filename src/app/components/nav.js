"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Nav({ isVisible = true }) {
    const [activeSection, setActiveSection] = useState("home");
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { name: "Home", link: "#home" },
        { name: "Projects", link: "#projects" },
        { name: "Resume", link: "#resume" },
        { name: "Contact", link: "#contact" },
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
        const targetId = link.substring(1);
        
        if (pathname !== "/") {
            router.push(`/${link}`);
            return;
        }
        
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <>
            <nav className={`hidden lg:flex sticky top-4 left-0 right-0 w-full justify-center z-50`}>
                <div className="bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-lg p-1 flex space-x-1 overflow-x-auto scrollbar-hide max-w-[580px] border border-white/30 dark:border-gray-700/30 transition-all duration-200">
                    {navItems.map((item) => (
                        <a
                            key={item.link}
                            href={item.link}
                            onClick={(e) => handleClick(e, item.link)}
                            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                                activeSection === item.link.substring(1)
                                    ? "bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white shadow-lg"
                                    : "text-black dark:text-white hover:bg-white/40 dark:hover:bg-black/40"
                            }`}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </nav>

            <nav className="fixed bottom-0 left-0 right-0 w-full lg:hidden z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-t border-white/30 dark:border-gray-700/30 transition-all duration-200">
                <div className="flex justify-around items-center h-20 px-2">
                    {navItems.map((item) => (
                        <a
                            key={item.link}
                            href={item.link}
                            onClick={(e) => handleClick(e, item.link)}
                            className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 flex-1 ${
                                activeSection === item.link.substring(1)
                                    ? "bg-white/90 dark:bg-black/50 text-gray-900 dark:text-white shadow-lg"
                                    : "text-black dark:text-white hover:bg-white/40 dark:hover:bg-black/40"
                            }`}
                        >
                            <span className="text-xs font-medium text-center">{item.name}</span>
                        </a>
                    ))}
                </div>
            </nav>

        </>
    );
}
