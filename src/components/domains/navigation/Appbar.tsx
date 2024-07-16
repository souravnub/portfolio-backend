"use client";
import React from "react";

import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import NotificationPopover from "./NotificationPopover";

const Topbar = () => {
    return (
        <div className="border-b">
            <div className="flex justify-between  container">
                <Navbar />

                <div className="flex gap-4 items-center">
                    <NotificationPopover />
                    <Button
                        variant={"outline"}
                        className="bg-transparent"
                        onClick={() => signOut()}>
                        LogOut
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
