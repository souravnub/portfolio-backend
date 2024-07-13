"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Links = [
    { id: 1, title: "Overview", href: "/" },
    { id: 2, title: "Projects", href: "/projects" },
];

const Appbar = () => {
    const [activeLink, setActiveLink] = useState<number | null>(null);
    const path = usePathname();

    useEffect(() => {
        const lastPathEle = path.split("/")[path.split("/").length - 1];
        const currentPath = "/" + lastPathEle;

        Links.forEach((link) => {
            if (link.href === currentPath) {
                setActiveLink(link.id);
            } else if (currentPath === "" && link.href === "/") {
                setActiveLink(link.id);
            }
        });
    }, [path]);

    return (
        <nav>
            <ul>
                {Links.map((link) => {
                    return (
                        <Link
                            key={link.id}
                            href={link.href}
                            className={`inline-block py-2 border-secondary-foreground ${
                                link.id === activeLink && "border-b-2"
                            }`}>
                            <span className="transition hover:bg-accent inline-block px-3 py-1.5 rounded-md">
                                {link.title}
                            </span>
                        </Link>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Appbar;
