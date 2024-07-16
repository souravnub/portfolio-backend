import React, { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

const ContentLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <div className="flex justify-between items-center pt-6 py-10 container">
                <h1 className="font-medium text-3xl">Content Management</h1>
                <div className="space-x-2">
                    <Button
                        asChild
                        variant={"outline"}
                        className="bg-muted/20 hover:bg-muted">
                        <Link href={"/content"}>Home</Link>
                    </Button>

                    <Button
                        asChild
                        variant={"outline"}
                        className="bg-muted/20 hover:bg-muted">
                        <Link href={"/content/about"}>About</Link>
                    </Button>
                </div>
            </div>
            <Separator />
            {children}
        </div>
    );
};

export default ContentLayout;
