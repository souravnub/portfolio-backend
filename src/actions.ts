"use server";

import { revalidatePath } from "next/cache";
import prisma from "./db";
import { HomePageContentSchema } from "./schemas";
import { auth } from "./lib/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./lib/utils/awsUtils";
import { generateUniqueFileName } from "./lib/utils/fileUtils";

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

export async function updateHomePageImage(newImageUrl: string) {
    const homePageContentStore = await prisma.homePageContent.findFirst({
        select: { id: true },
    });
    await prisma.homePageContent.update({
        where: {
            id: homePageContentStore?.id,
        },
        data: {
            mainImageUrl: newImageUrl,
        },
    });
    revalidatePath("/content");
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

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 1048576 * 5; // 1048576bytes = 1mb, therefore, 1mb * 5 = 5mb

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
    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
        return {
            success: false,
            message: "invalid file type",
        };
    }
    if (fileSize > MAX_FILE_SIZE) {
        return {
            success: false,
            message: "file size larger than 5MB",
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
