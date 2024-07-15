import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ProjectSearch } from "@/components/client/ProjectSearch";
import ProjectsFeed from "@/components/domains/projects/ProjectsFeeds";
import ProjectsSkeleton from "@/components/skeletons/ProjectsSkeleton";

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
                <Button className="h-10">Add New</Button>
            </div>

            <Suspense key={searchParams?.q} fallback={<ProjectsSkeleton />}>
                <ProjectsFeed query={searchParams?.q} />
            </Suspense>
        </div>
    );
};

export default ProjectsPage;
