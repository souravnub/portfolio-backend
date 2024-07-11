import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { validate } from "./utils/authUtils";
import NextAuth, { CredentialsSignin } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            name: "usernmae",
            credentials: {
                name: {
                    label: "name",
                    type: "text",
                    placeholder: "Enter your name",
                },
                password: {
                    label: "password",
                    type: "text",
                    placeholder: "Enter your password",
                },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({
                        name: z
                            .string()
                            .min(1, "name should be minimum 1 character long"),
                        password: z.string(),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    throw new CredentialsSignin("invalid inputs");
                }

                const { name, password } = parsedCredentials.data;
                const validationRes = await validate(name, password);

                if (!validationRes.success) {
                    throw new CredentialsSignin(validationRes.message);
                }
                // will never happed as user will always exsist on success
                if (!validationRes.user) {
                    return null;
                }
                return validationRes.user;
            },
        }),
    ],
});
