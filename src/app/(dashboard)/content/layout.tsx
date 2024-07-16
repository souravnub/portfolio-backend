import React, { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import ContentNavbar from "@/components/domains/content/ContentNavbar";

const ContentLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <ContentNavbar />
            <Separator />

            <div className="container py-4">{children}</div>
        </div>
    );
};

export default ContentLayout;
