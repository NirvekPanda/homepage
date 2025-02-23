"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
    const path = usePathname();

    const box_color = "bg-gray-900";
    const selected_box = "bg-gray-700";
    const text_color = "text-white";
    const hover_color =
        "hover:bg-gray-700 hover:text-aqua-500 hover:underline";

    const navItems = [
        { name: "Home", link: "/" },
        { name: "Projects", link: "/projects" },
        { name: "Resume", link: "/resume" },
        { name: "Contact Me", link: "/contact" },
    ];

    const navItemsList = navItems.map((item, index) => {
        const isActive = path === item.link;
        return (
            <li key={index} className="whitespace-nowrap">
                <Link
                    href={item.link}
                    className={
                        isActive
                            ? `${selected_box} font-bold rounded p-2 underline ${hover_color} font-gisel-nano`
                            : `${box_color} rounded p-2 ${hover_color} ${text_color} font-gisel-nano`
                    }
                >
                    {item.name}
                </Link>
            </li>
        );
    });

    return (
        <nav className="w-5/6 sm:w-3/4 max-w-screen-lg mx-auto flex justify-center items-center p-6 bg-gray-600 text-white border border-gray-500 rounded-xl">
            <ul className="flex flex-nowrap gap-x-3">{navItemsList}</ul>
        </nav>
    );
}