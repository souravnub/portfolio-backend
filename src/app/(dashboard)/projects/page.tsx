import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import ProjectsFeed from "@/components/domains/projects/ProjectsFeeds";
import ProjectsSkeleton from "@/components/skeletons/ProjectsSkeleton";
import { ProjectSearch } from "@/components/domains/projects/ProjectSearch";
import Link from "next/link";

const ProjectsPage = async ({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { q: string };
}) => {
    return (
        <div className="space-y-5">
            <div className="flex gap-2 ">
                <ProjectSearch initialSearchQuery={searchParams?.q} />
                <Button asChild className="h-10">
                    <Link href={"/projects/new"}>Add New</Link>
                </Button>
            </div>

            <Suspense key={searchParams?.q} fallback={<ProjectsSkeleton />}>
                <ProjectsFeed query={searchParams?.q} />
            </Suspense>
        </div>
    );
};

export default ProjectsPage;
