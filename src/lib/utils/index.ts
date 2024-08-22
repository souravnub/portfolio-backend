import prisma from "@/db";

export async function getContributorData(contributorId: number) {
    const contributorData = await prisma.contributor.findFirst({
        where: { id: contributorId },
    });
    return contributorData;
}

export async function getProjectWithContributors(id: number) {
    const project = await prisma.project.findFirst({
        where: {
            id: Number(id),
        },
        include: {
            contributors: true,
        },
    });

    if (!project) {
        return null;
    }

    const contributorsPromiseArr = project.contributors.map((contributor) => {
        return getContributorData(contributor.contributorId);
    });
    const contributors = await Promise.all(contributorsPromiseArr);

    return {
        ...project,
        contributors: contributors.filter((c) => c !== null),
    };
}
