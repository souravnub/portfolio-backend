"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Links = [
    { id: 1, title: "Overview", href: "/" },
    { id: 2, title: "Content", href: "/content" },
    { id: 3, title: "Projects", href: "/projects" },
];

const Appbar = () => {
    const [activeLink, setActiveLink] = useState<number | null>(null);
    const path = usePathname();

    useEffect(() => {
        const lastPathEle = path.split("/")[path.split("/").length - 1];
        const currentPath = "/" + lastPathEle;

        const activeLinkEle = Links.find((link) => link.href === currentPath);
        if (activeLinkEle === undefined) return setActiveLink(null);
        setActiveLink(activeLinkEle.id);
    }, [path]);

    return (
        <nav>
            <ul className="text-sm">
                {Links.map((link) => {
                    return (
                        <li key={link.id} className="inline-block">
                            <Link
                                href={link.href}
                                className={`inline-block py-2 border-b-2 ${
                                    link.id === activeLink
                                        ? "border-secondary-foreground"
                                        : "border-transparent"
                                }`}>
                                <span className="transition hover:bg-accent inline-block px-3 py-1.5 rounded-md">
                                    {link.title}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Appbar;
