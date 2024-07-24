import Appbar from "@/components/domains/navigation/Appbar";
import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <Appbar />

            <main>
                <div className="py-4">{children}</div>
            </main>
        </>
    );
};

export default DashboardLayout;
