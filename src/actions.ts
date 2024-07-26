"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "./db";
import { auth } from "./lib/auth";
import { s3Client } from "./lib/utils/awsUtils";
import {
    ALLOWED_IMAGE_FILE_TYPES,
    ALLOWED_VIDEO_FILE_TYPES,
    generateUniqueFileName,
} from "./lib/utils/fileUtils";
import { HomePageContentSchema, ProjectFormSchema } from "./schemas";

export async function deleteProject(
    prevState: any,
    formData: FormData
): Promise<{ success: boolean | null }> {
    const projectId = formData.get("projectId") as string | undefined;

    if (!projectId) return { success: false };

    try {
        await prisma.project.delete({ where: { id: Number(projectId) } });
        revalidatePath("/projects");
        return {
            success: true,
        };
    } catch (err) {
        return {
            success: false,
        };
    }
}
export async function createProjectAction(
    values: z.infer<typeof ProjectFormSchema>
): Promise<
    | { success: false; message: string }
    | { success: true; projectId: number; message: string }
> {
    const zodParseRes = ProjectFormSchema.safeParse(values);

    if (!zodParseRes.success) {
        return { success: false, message: "Invalid inputs" };
    }

    const parsedData = {
        ...zodParseRes.data,
        techUsed: zodParseRes.data.techUsed.map((obj) => obj.value),
    };

    try {
        const createdProj = await prisma.project.create({
            data: parsedData,
            select: {
                id: true,
            },
        });
        revalidatePath("/projects");
        return {
            success: true,
            message: "project created successfully",
            projectId: createdProj.id,
        };
    } catch (err) {
        return {
            success: false,
            message: "Error while adding project to DB",
        };
    }
}

export async function updateProjectAction({
    id,
    data,
}: {
    id: number;
    data: Prisma.ProjectUpdateInput;
}) {
    try {
        await prisma.project.update({
            where: {
                id,
            },
            data,
        });
        revalidatePath(`/projects/${id}/edit`);
        return {
            success: true,
            message: "DB update successfull",
        };
    } catch (err) {
        return { success: false, message: "Error while updating data in DB" };
    }
}

export async function updateProjectInfo({
    values,
    projectId,
}: {
    values: z.infer<typeof ProjectFormSchema>;
    projectId: number;
}) {
    const parsed = ProjectFormSchema.safeParse(values);
    if (!parsed.success) {
        return { success: false, message: "Invalid inputs" };
    }

    const requierdData = {
        ...parsed.data,
        techUsed: parsed.data.techUsed.map((e) => e.value),
    };

    try {
        await prisma.project.update({
            where: {
                id: projectId,
            },
            data: requierdData,
        });
        revalidatePath(`/projects/${projectId}/edit`);
        return { success: true, message: "Project Updated Successfully" };
    } catch (err) {
        return {
            success: false,
            message: "Error while updating project in DB",
        };
    }
}
export async function updateHomePageImage(newImageUrl: string) {
    const homePageContentStore = await prisma.homePageContent.findFirst({
        select: { id: true },
    });
    try {
        await prisma.homePageContent.update({
            where: {
                id: homePageContentStore?.id,
            },
            data: {
                mainImageUrl: newImageUrl,
            },
        });

        revalidatePath("/content");
        return { success: true, message: "Image upload successfull" };
    } catch (err) {
        return { success: false, message: "Error while updating DB" };
    }
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

    try {
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
    } catch (err) {
        return { success: false, message: "Error while updating data in DB" };
    }
}

const MAX_FILE_SIZE = 1048576 * 10; // 1048576bytes = 1mb, therefore, 1mb * 10 = 10mb

type GetSignedURLParams = {
    fileType: string;
    fileSize: number;
    checksum: string;
};
type GetSignedURLResult =
    | {
          success: false;
          message: string;
      }
    | {
          success: true;
          url: string;
      };
export async function generateSignedUrl({
    fileType,
    fileSize,
    checksum,
}: GetSignedURLParams): Promise<GetSignedURLResult> {
    const session = await auth();
    if (!session) {
        return {
            success: false,
            message: "not authenticated",
        };
    }
    if (
        !ALLOWED_IMAGE_FILE_TYPES.concat(ALLOWED_VIDEO_FILE_TYPES).includes(
            fileType
        )
    ) {
        return {
            success: false,
            message: "invalid file type",
        };
    }
    if (fileSize > MAX_FILE_SIZE) {
        return {
            success: false,
            message: `file size larger than ${MAX_FILE_SIZE / 1048576} MB`,
        };
    }

    const command = new PutObjectCommand({
        ContentLength: fileSize,
        ContentType: fileType,
        ChecksumSHA256: checksum,
        Key: generateUniqueFileName(),
        Bucket: process.env.AWS_BUCKET_NAME,
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        return { success: true, url };
    } catch (err) {
        return {
            success: false,
            message: "Error while generating signed url.",
        };
    }
}
