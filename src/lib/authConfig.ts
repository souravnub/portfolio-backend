import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const NEXT_AUTH_CONFIG: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        Credentials({
            name: "email",
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
            async authorize(credentials) {
                return null;
            },
        }),
    ],
};
