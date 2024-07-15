"use server";

import { revalidatePath } from "next/cache";
import prisma from "./db";

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
