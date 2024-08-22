import prisma from "@/db";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email("Invalid email"),
    message: z.string().min(10, "message should be atleast 10 characters long"),
});

export async function POST(request: Request, res: Response) {
    const body = await request.json();
    const validationRes = contactSchema.safeParse(body);

    if (!validationRes.success) {
        return Response.json(
            {
                success: false,
                message: "Input validation failed",
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

    try {
        await prisma.message.create({
            data: {
                name: validationRes.data.name,
                email: validationRes.data.email,
                message: validationRes.data.message,
            },
        });

        return Response.json(
            {
                success: true,
                message: "Message received",
            },
            {
                headers: {
                    "Access-Control-Allow-Origin":
                        process.env.NEXT_PUBLIC_FRONTEND_URL!,
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (err) {
        return Response.json(
            {
                success: false,
                message: "Error while saving message! Please try again.",
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
}
