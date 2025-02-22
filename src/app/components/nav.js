"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {

    const path = usePathname();

    const box_color = "bg-gray-900";
    const text_color = "text-white";
    const hover_color = "hover:bg-gray-700 hover:text-aqua-500";

    const navItems = [
        {name: "Home", link: "/"},
        {name: "Projects", link: "/projects"},
        {name: "Resume", link: "/resume"},
        {name: "Contact Me", link: "/contact"}
    ];

    const navItemsList = navItems.map((item, index) => {
        return (
            <li>   
                <Link key={index} href={item.link} className={path === item.link ? `font-bold mr-4 rounded p-2 ${hover_color}`: `mr-4 ${box_color} rounded p-2 ${hover_color} ${text_color}`}>
                    {item.name}
                </Link>
            </li>
        );
    });


    return (
    <nav className="flex justify-center items-center p-6 bg-gray-600 text-white">
        <ul className="flex gap-1">
            {navItemsList}
        </ul>
    </nav>
);
}