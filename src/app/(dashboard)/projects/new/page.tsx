"use client";

import { createProjectAction } from "@/actions";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { newProjectFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { MdClose, MdInfo } from "react-icons/md";
import { z } from "zod";
// adding the images is not supported in adding a new project
// when a new project is made, the user will be redirected to the edit page of the project, where the user can update the images

// time in seconds after which the redirect should happen
const REDIRECT_AFTER = 4;

const NewProjectPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof newProjectFormSchema>>({
        resolver: zodResolver(newProjectFormSchema),
        defaultValues: {
            name: "",
            role: "",
            yearOfProduction: "",
            description: "",
            quote: "",
            brandColor: "#000000",
            productionLink: "",
            githubLink: "",
            inSiteLinkText: "",
            techUsed: [{ value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "techUsed",
        control: form.control,
    });

    async function handleFormSubmit(
        values: z.infer<typeof newProjectFormSchema>
    ) {
        setIsLoading(true);
        const { dismiss: dismissLoadingToast } = toast({
            description: "Creating project...",
        });

        const res = await createProjectAction(values);

        if (!res.success) {
            toast({
                variant: "destructive",
                description: res.message,
            });
            return;
        }

        const {
            id,
            update,
            dismiss: dismissRedirectToast,
        } = toast({
            title: res.message,
            description: `Redirecting to edit page in: ${REDIRECT_AFTER}s`,
            action: (
                <ToastAction
                    altText="cancel"
                    onClick={() => {
                        clearInterval(interval);
                        router.push("/projects");
                    }}>
                    Cancel
                </ToastAction>
            ),
        });

        let time = REDIRECT_AFTER;
        const interval = setInterval(() => {
            time -= 1;

            update({
                id,
                description: `Redirecting to edit page in: ${time}s`,
            });

            if (time === 0) {
                dismissLoadingToast();
            }

            if (time < 0) {
                setIsLoading(false);
                dismissRedirectToast();
                clearInterval(interval);
                router.push(`/projects/edit/${res.projectId}`);
            }
        }, 1000);
    }

    return (
        <>
            <div className="py-16">
                <h1 className="font-medium text-4xl">
                    New Project? Let&apos;s do it
                </h1>
                <div className="mt-1 flex items-center gap-1">
                    <MdInfo className="text-xl text-blue-500" />
                    <p className="text-muted-foreground text-sm ">
                        The images can be added later when the project is to be
                        published
                    </p>
                </div>
            </div>
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(handleFormSubmit)}
                    className=" md:grid md:grid-cols-2 md:gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
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
                                    What was your role in the project?
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="yearOfProduction"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year of Production</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    The year in which the project was made
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quote"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quote</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    The quote displayed in learnings section of
                                    a project
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={5} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="brandColor"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Brand Color</FormLabel>
                                <div className="flex flex-col ">
                                    <span className="font-medium text-sm text-primary/40">
                                        {field.value}
                                    </span>
                                    <FormLabel className="inline-block w-fit">
                                        <div
                                            className="border-border border-2 w-20 aspect-[2/1] rounded-lg"
                                            style={{
                                                backgroundColor: field.value,
                                            }}></div>
                                    </FormLabel>
                                    <FormControl>
                                        <input {...field} type="color" hidden />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="md:flex md:col-span-2 md:gap-3">
                        <FormField
                            control={form.control}
                            name="productionLink"
                            render={({ field }) => (
                                <FormItem className="md:flex-1">
                                    <FormLabel>Production URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="githubLink"
                            render={({ field }) => (
                                <FormItem className="md:flex-1">
                                    <FormLabel>Github URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="inSiteLinkText"
                            render={({ field }) => (
                                <FormItem className="md:flex-1">
                                    <FormLabel>Portfolio project URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The link to the project in the portfolio
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        {fields.map((field, index) => (
                            <FormField
                                control={form.control}
                                key={field.id}
                                name={`techUsed.${index}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        {index === 0 && (
                                            <>
                                                <FormLabel>
                                                    Technologies used
                                                </FormLabel>
                                                <FormDescription>
                                                    Add all the technologies
                                                    that were used in developing
                                                    the project
                                                </FormDescription>
                                            </>
                                        )}

                                        <div className="flex gap-2">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="max-w-sm"
                                                />
                                            </FormControl>
                                            <Button
                                                variant={"destructive"}
                                                className="text-lg px-3 rounded-md"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}>
                                                <MdClose />
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            variant={"outline"}
                            type="button"
                            className="self-start px-8 mt-2"
                            onClick={() => append({ value: "" })}>
                            Add
                        </Button>
                    </div>

                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-fit px-9 mt-6">
                        {!isLoading ? "Submit" : "Submiting..."}
                    </Button>
                </form>
            </FormProvider>
        </>
    );
};

export default NewProjectPage;
