import prisma from "@/db";
import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectsFeed = async ({ query }: { query?: string }) => {
    const searchTerm = query;
    const projects = await prisma.project.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: searchTerm?.trim(),
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm?.trim(),
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
        },
    });

    // await new Promise((res, rej) => {
    //     setTimeout(function () {
    //         res("hello");
    //     }, 3000);
    // });

    return (
        <div className="space-y-3">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
};

export default ProjectsFeed;
