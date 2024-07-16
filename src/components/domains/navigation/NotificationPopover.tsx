"use client";
import { IoMdNotificationsOutline } from "react-icons/io";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";

const NotificationPopover = () => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return (
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
    );
};

export default NotificationPopover;
