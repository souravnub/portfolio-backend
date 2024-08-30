import prisma from "@/db";
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email("Invalid email"),
    message: z
        .string()
        .trim()
        .min(10, "message should be atleast 10 characters long"),
    token: z.string().min(1),
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

    const captchaURL =
        "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const captchaValidationRes = await fetch(captchaURL, {
        body: JSON.stringify({
            secret: process.env.CLOUDFLARE_SITE_SECRET_KEY,
            response: validationRes.data.token,
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const captchaValidationOutcome = await captchaValidationRes.json();

    if (!captchaValidationOutcome.success) {
        return Response.json(
            {
                success: false,
                message: "Capthcha validation failed",
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
