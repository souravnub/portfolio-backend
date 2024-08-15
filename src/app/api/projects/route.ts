import prisma from "@/db";
export async function GET(request: Request, res: Response) {
    const projects = await prisma.project.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
    });

    return Response.json(
        { projects },
        {
            headers: {
                "Access-Control-Allow-Origin":
                    process.env.NEXT_PUBLIC_FRONTEND_URL!,
                "Content-Type": "application/json",
            },
        }
    );
}
