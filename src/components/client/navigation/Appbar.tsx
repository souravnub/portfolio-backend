"use client";
import React, { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const Topbar = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <div className="container flex justify-between border-b">
            <Navbar />

            <div className="flex gap-4 items-center">
                <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
                    <PopoverTrigger>
                        <div
                            className="text-xl p-1 rounded-full border border-border"
                            style={{
                                backgroundColor: isPopoverOpen
                                    ? "hsl(var(--muted))"
                                    : "transparent",
                            }}>
                            <IoMdNotificationsOutline />
                        </div>
                    </PopoverTrigger>

                    <PopoverContent className="mt-3 mr-20 rounded-lg">
                        Place content for the popover here.
                    </PopoverContent>
                </Popover>
                <Button variant={"outline"} onClick={() => signOut()}>
                    LogOut
                </Button>
            </div>
        </div>
    );
};

export default Topbar;
