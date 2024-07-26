import prisma from "@/db";
import bcrypt from "bcryptjs";
import { auth } from "../auth";

interface validationRes {
    success: boolean;
    message: string;
    user: { id: number };
}

export async function authorizeUser() {
    const a = await auth();
    if (!a?.user) {
        return { isAuthorized: false };
    }
    return { isAuthorized: true };
}

export async function validate(name: string, password: string) {
    const user = await prisma.admin.findUnique({
        where: {
            name,
        },
    });

    if (!user) {
        return { success: false, message: "invalid credentials" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { success: false, message: "invalid credentials" };
    }

    return {
        success: true,
        message: "validation successfull",
        user: { id: user.id.toString(), name: user.name },
    };
}
