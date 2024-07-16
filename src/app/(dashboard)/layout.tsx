import Appbar from "@/components/client/navigation/Appbar";
import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Appbar />

            <main className="bg-muted/20">
                <div className="container py-4">{children}</div>
            </main>
        </>
    );
};

export default DashboardLayout;
