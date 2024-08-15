import prisma from "@/db";

export async function GET(request: Request, res: Response) {
    const { searchParams } = new URL(request.url);

    const projects = await prisma.project.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
    });

    const count = searchParams.get("count");

    const finalProjects = count ? projects.slice(0, Number(count)) : projects;

    return Response.json(
        { projects: finalProjects },
        {
            headers: {
                "Access-Control-Allow-Origin":
                    process.env.NEXT_PUBLIC_FRONTEND_URL!,
                "Content-Type": "application/json",
            },
        }
    );
}
