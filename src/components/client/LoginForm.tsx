"use client";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const { toast } = useToast();
    const router = useRouter();

    async function handleLoginFormAction(formData: FormData) {
        const name = formData.get("name") as string | undefined;
        const password = formData.get("password") as string | undefined;

        if (!name || !password) {
            return toast({
                variant: "destructive",
                title: "Invalid inputs",
                description: "Please provide all the credentials",
            });
        }

        const res = await signIn("credentials", {
            name,
            password,
            redirect: false,
        });
        if (res?.error) {
            return toast({
                variant: "destructive",
                title: "Invalid Credentials",
                description:
                    "The credentails provided were in-correct. Please Try with valid credentials",
            });
        }

        router.push("/");
    }

    return (
        <form
            className="grid w-full items-center gap-4"
            action={handleLoginFormAction}>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" />
            </div>

            <Button type="submit" className="px-8 w-min">
                Login
            </Button>
        </form>
    );
};

export default LoginForm;
