import { z } from "zod";

export const HomePageContentSchema = z.object({
    country: z
        .string()
        .min(2, { message: "Country should be atleast 2 characters" }),
    role: z.string().min(2, { message: "Role should be atleast 2 characters" }),
    portfolio_slogan: z
        .string()
        .min(2, { message: "Slogan should be atleast 2 characters" }),
    portfolio_description: z
        .string()
        .min(2, { message: "Description should be atleast 2 characters" }),
});
