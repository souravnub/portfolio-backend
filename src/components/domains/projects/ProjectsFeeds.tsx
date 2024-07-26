import prisma from "@/db";
import React from "react";
import ProjectCard from "./ProjectCard";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ProjectsFeed = async ({ query }: { query?: string }) => {
    const searchTerm = query;
    const projects = await prisma.project.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: searchTerm?.trim() || "",
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm?.trim() || "",
                        mode: "insensitive",
                    },
                },
            ],
        },
        select: {
            id: true,
            description: true,
            yearOfProduction: true,
            githubLink: true,
            productionLink: true,
            name: true,
            isPublished: true,
        },
    });

    if (projects.length === 0) {
        return (
            <Card className="py-36 grid place-content-center place-items-center gap-1">
                <span>No Results Found</span>
                <p className="text-primary/40 text-sm">
                    Your search &ldquo;
                    {query}&rdquo; did not return any results.
                </p>
                <Link
                    href="/projects/new"
                    className="text-blue-500 hover:underline flex gap-1 items-center text-sm mt-2">
                    New Project <ArrowRight className="w-4" />
                </Link>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
};

export default ProjectsFeed;
