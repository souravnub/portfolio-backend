import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const DashboardPage = () => {
    return (
        <div>
            <h1>DashboardPage - overview of everything</h1>
            <Button asChild variant={"link"}>
                <Link href={"/projects"}>Manage Projects</Link>
            </Button>
            <Button asChild variant={"link"}>
                <Link href={"/content"}>Manage content</Link>
            </Button>
        </div>
    );
};

export default DashboardPage;
