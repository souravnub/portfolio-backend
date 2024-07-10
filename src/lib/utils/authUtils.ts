import prisma from "@/db";
import bcrypt from "bcryptjs";

interface validationRes {
    success: boolean;
    message: string;
    user: { id: number };
}

export async function validate(username: string, password: string) {
    const user = await prisma.admin.findUnique({
        where: {
            username,
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
        user: { id: user.id, username: user.username },
    };
}
