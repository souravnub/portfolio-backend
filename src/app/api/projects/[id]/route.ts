import prisma from "@/db";
import { getProjectWithContributors } from "@/lib/utils";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const projects = await prisma.project.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
    });

    const project = await getProjectWithContributors(Number(params.id));

    if (!project) {
        return Response.json({
            message: "No project found with the given input",
            input: params.id,
        });
    }

    const currProjIdx = projects.findIndex((proj) => proj.id === project.id);

    return Response.json(
        {
            project,
            // return the next project id || return the first projectid
            nextProjectId: projects[currProjIdx + 1]?.id || projects[0].id,
        },
        {
            headers: {
                "Access-Control-Allow-Origin":
                    process.env.NEXT_PUBLIC_FRONTEND_URL!,
                "Content-Type": "application/json",
            },
        }
    );
}
