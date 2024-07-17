"use server";

import { revalidatePath } from "next/cache";
import prisma from "./db";
import { HomePageContentSchema } from "./schemas";

export async function deleteProject(
    prevState: any,
    formData: FormData
): Promise<{ success: boolean | null }> {
    const projectId = formData.get("projectId") as string | undefined;

    if (!projectId) return { success: false };

    await prisma.project.delete({ where: { id: Number(projectId) } });
    revalidatePath("/projects");

    return {
        success: true,
    };
}

export async function updateHomePageContent(
    formData: FormData
): Promise<{ success: boolean | null; message: string }> {
    const data = Object.fromEntries(formData);
    const parsed = HomePageContentSchema.safeParse(data);
    if (!parsed.success) {
        return { success: false, message: "Invalid form data" };
    }

    const { country, role, portfolio_slogan, portfolio_description } =
        parsed.data;

    // storageObj will be the first record in the homePageContent table that contains data for the home page
    const storageObj = await prisma.homePageContent.findFirst({
        select: { id: true },
    });

    // In this case either their is no homePageContent table in DB containing the first record that will contain all the data
    // or There is some problem while fetching the record ex. problem in connecting to DB
    if (storageObj === null) {
        return { success: false, message: "No storage object found in DB." };
    }

    await prisma.homePageContent.update({
        where: {
            id: storageObj.id,
        },
        data: {
            country,
            role,
            portfolio_slogan,
            portfolio_description,
        },
    });

    revalidatePath("/content/");

    return { success: true, message: "data updated Successfully!" };
}
