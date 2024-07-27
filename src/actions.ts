"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "./db";
import { clearDirectory, s3Client } from "./lib/utils/awsUtils";
import {
    ALLOWED_IMAGE_FILE_TYPES,
    ALLOWED_VIDEO_FILE_TYPES,
    generateUniqueFileName,
} from "./lib/utils/fileUtils";
import { HomePageContentSchema, ProjectFormSchema } from "./schemas";
import { authorizeUser } from "./lib/utils/authUtils";

export async function deleteProject(formData: FormData): Promise<{
    success: boolean | null;
    warning?: boolean | null;
    warningMsg?: string;
    message: string;
}> {
    const { isAuthorized } = await authorizeUser();

    if (!isAuthorized) {
        return { success: false, message: "Not authorized" };
    }

    const projectId = formData.get("projectId") as string | undefined;

    if (!projectId) return { success: false, message: "Project not found" };

    try {
        const deletedProject = await prisma.project.delete({
            where: { id: Number(projectId) },
        });
        revalidatePath("/projects");

        // TODO: what if no directory
        // delete all aws assets of the project
        const clearDirRes = await clearDirectory(
            `projects/${deletedProject.name}/`
        );

        if (!clearDirRes.success) {
            return {
                success: true,
                warning: true,
                warningMsg:
                    "Error while removing assets from AWS" +
                    `. Warning: ${clearDirRes.message}`,
                message: "Project Deleted from DB",
            };
        }

        console.log("aws res", clearDirRes);

        return {
            success: true,
            message: `Project deleted Successfully! Deleted ${clearDirRes.deletedObjects.length} related assets.`,
        };
    } catch (err) {
        return {
            success: false,
            message: "Error while deleting project",
        };
    }
}
export async function createProjectAction(
    values: z.infer<typeof ProjectFormSchema>
): Promise<
    | { success: false; message: string }
    | { success: true; projectId: number; message: string }
> {
    const { isAuthorized } = await authorizeUser();

    if (!isAuthorized) {
        return { success: false, message: "Not authorized" };
    }
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
    const { isAuthorized } = await authorizeUser();

    if (!isAuthorized) {
        return { success: false, message: "Not authorized" };
    }
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

export async function toggleProjectPublication({
    id,
    currentPublicationStatus,
}: {
    id: number;
    currentPublicationStatus: "published" | "not-published";
}) {
    const { isAuthorized } = await authorizeUser();
    if (!isAuthorized) {
        return { success: false, message: "Not authorized" };
    }
    try {
        const project = await prisma.project.update({
            where: {
                id,
            },
            data: {
                isPublished:
                    currentPublicationStatus === "published" ? false : true,
            },
        });

        revalidatePath("/projects");
        return {
            success: true,
            message: `Project ${
                project.isPublished ? "published" : "dropped"
            } successfully`,
        };
    } catch (err) {
        return { success: false, message: "Error while updating DB" };
    }
}

export async function updateProjectInfo({
    values,
    projectId,
}: {
    values: z.infer<typeof ProjectFormSchema>;
    projectId: number;
}) {
    const { isAuthorized } = await authorizeUser();

    if (!isAuthorized) {
        return { success: false, message: "Not authorized" };
    }
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
    const { isAuthorized } = await authorizeUser();

    if (!isAuthorized) {
        return { success: false, message: "Not authorized" };
    }
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
    const { isAuthorized } = await authorizeUser();

    if (!isAuthorized) {
        return { success: false, message: "Not authorized" };
    }
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
    objectDirectory?: string;
    objectKey?: string;
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
    objectDirectory,
    objectKey,
}: GetSignedURLParams): Promise<GetSignedURLResult> {
    const { isAuthorized } = await authorizeUser();

    if (!isAuthorized) {
        return { success: false, message: "Not authorized" };
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

    let fileKey;

    if (objectDirectory !== undefined) {
        if (objectKey !== undefined) {
            fileKey = objectDirectory + objectKey;
        } else {
            fileKey = objectDirectory + generateUniqueFileName();
        }
    } else if (objectDirectory === undefined && objectKey !== undefined) {
        fileKey = objectKey;
    } else {
        fileKey = generateUniqueFileName();
    }

    const command = new PutObjectCommand({
        ContentLength: fileSize,
        ContentType: fileType,
        ChecksumSHA256: checksum,
        Key: fileKey,
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

export async function runCommand() {
    const c = await clearDirectory("projects/");
    console.log(c);
}
