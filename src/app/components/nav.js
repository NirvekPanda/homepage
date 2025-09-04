"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Nav() {
    const path = usePathname();

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Projects", link: "/projects" },
        { name: "Blog", link: "/blog" },
        { name: "Resume", link: "/resume" },
        { name: "Contact Me", link: "/contact" },
    ];

    return (
        <nav className="w-full max-w-[580px] mx-auto flex justify-center mt-2">
            <div className="bg-slate-800 rounded-lg p-1 flex space-x-1 overflow-x-auto scrollbar-hide">
                {navItems.map((item) => (
                    <Link
                        key={item.link}
                        href={item.link}
                        className={`px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                            path === item.link
                                ? "bg-[#F5ECD5] text-gray-900 shadow-lg"
                                : "text-[#FFFAEC] hover:bg-slate-700"
                        }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
