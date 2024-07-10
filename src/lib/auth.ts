import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { validate } from "./utils/authUtils";
import NextAuth, { CredentialsSignin } from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "usernmae",
            credentials: {
                username: {
                    label: "username",
                    type: "text",
                    placeholder: "Enter your username",
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
                        username: z
                            .string()
                            .min(
                                1,
                                "username should be minimum 1 character long"
                            ),
                        password: z.string(),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    throw new CredentialsSignin("invalid inputs");
                }

                const { username, password } = parsedCredentials.data;
                const validationRes = await validate(username, password);

                if (!validationRes.success) {
                    throw new CredentialsSignin(validationRes.message);
                }

                return null;
            },
        }),
    ],
});
