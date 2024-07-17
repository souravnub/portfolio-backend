"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateHomePageContent } from "@/actions";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { HomePageContentSchema } from "@/schemas";
import { useRef, useState } from "react";

interface HomePageContentFormProps {
    initialValues: z.infer<typeof HomePageContentSchema> | null | undefined;
}

export function HomePageContentForm({
    initialValues,
}: HomePageContentFormProps) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<z.infer<typeof HomePageContentSchema>>({
        resolver: zodResolver(HomePageContentSchema),
        defaultValues: {
            country: initialValues?.country || "",
            role: initialValues?.role || "",
            portfolio_slogan: initialValues?.portfolio_slogan || "",
            portfolio_description: initialValues?.portfolio_description || "",
        },
    });

    async function handleFormSubmit() {
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);

        setIsLoading(true);
        const res = await updateHomePageContent(formData);
        setIsLoading(false);

        if (res.success === true) {
            toast({
                title: "Content Updated Successfully!",
                description: res.message,
            });
        } else if (res.success === false) {
            toast({
                variant: "destructive",
                title: "Error while updating content!",
                description: res.message,
            });
        }
    }

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-6">
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                What you see yourself as at the moment?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="portfolio_slogan"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Portfolio Slogan</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={3}
                                    placeholder="What is the motive behind your work?"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is the the slogan/motive of the portfolio
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="portfolio_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Portfolio Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={4}
                                    placeholder="A bit more about you & skills that you have."
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Elaborate the slogan/motive a bit more adding in
                                the skills that you posses.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={isLoading} type="submit">
                    {isLoading ? "Updating..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
}
