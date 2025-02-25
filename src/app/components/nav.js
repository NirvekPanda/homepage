"use client";

import { usePathname } from "next/navigation";
import LinkButton from "./button";

export default function Nav() {
    const path = usePathname();

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Projects", link: "/projects" },
        { name: "Resume", link: "/resume" },
        { name: "Contact Me", link: "/contact" },
    ];

    return (
        <nav className="w-5/6 sm:w-3/4 max-w-screen-lg mx-auto flex justify-center items-center p-6 bg-gray-600 text-white border border-gray-500 rounded-xl">
            <ul className="flex flex-nowrap gap-x-3">
                {navItems.map((item, index) => (
                    <li key={index} className="whitespace-nowrap">
                        <LinkButton
                            text={item.name}
                            link={item.link}
                            isActive={path === item.link}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
}
