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

export const ProjectFormSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    role: z.string().min(1, "Role is required"),
    yearOfProduction: z
        .string()
        .length(4, "Year should only be 4 characters")
        .regex(/^\d+$/, "Year should contain only numbers"),
    techUsed: z
        .array(z.object({ value: z.string().min(1) }))
        .min(1, "technologies should contain at least 1 element"),
    description: z
        .string()
        .min(5, "description should be atleast 5 characters"),
    quote: z.string().optional(),

    brandColor: z
        .string()
        .length(7, "Hex color code is supposed to be 7 characters"),

    productionLink: z.string().url({ message: "invalid url" }),
    githubLink: z.union([z.literal(""), z.string().trim().url()]),
});
