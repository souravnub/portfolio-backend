import Appbar from "@/components/client/navigation/Appbar";
import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <Appbar />
            {children}
        </div>
    );
};

export default DashboardLayout;
