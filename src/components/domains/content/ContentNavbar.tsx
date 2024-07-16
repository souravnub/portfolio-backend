"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
    { id: 1, title: "Home", href: "/content" },
    { id: 2, title: "About", href: "/content/about" },
];

const ContentNavbar = () => {
    const pathname = usePathname();

    return (
        <div className="flex justify-between items-center pt-6 py-10 container">
            <h1 className="font-medium text-3xl">Content Management</h1>

            <nav>
                <ul className="space-x-2">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Button
                                asChild
                                key={link.id}
                                variant={"outline"}
                                className={`${
                                    !isActive
                                        ? "bg-muted/20 hover:bg-muted"
                                        : "bg-primary text-background"
                                }`}>
                                <Link href={link.href}>{link.title}</Link>
                            </Button>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default ContentNavbar;
