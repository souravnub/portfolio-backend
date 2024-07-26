"use client";

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
import { ProjectFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { MdClose } from "react-icons/md";
import { z } from "zod";

interface ProjectFormProps {
    onFormSubmit: (values: z.infer<typeof ProjectFormSchema>) => Promise<void>;
    defaultValues?: z.infer<typeof ProjectFormSchema>;
    disableSubmitAfterFirstSubmission?: boolean;
}

const EMPTY_FORM_VALUES = {
    name: "",
    role: "",
    yearOfProduction: new Date().getFullYear().toString(),
    description: "",
    quote: "",
    brandColor: "#000000",
    productionLink: "",
    githubLink: "",
    inSiteLinkText: "",
    techUsed: [{ value: "" }],
};

const ProjectForm = ({
    onFormSubmit,
    defaultValues = EMPTY_FORM_VALUES,
    disableSubmitAfterFirstSubmission = false,
}: ProjectFormProps) => {
    const form = useForm<z.infer<typeof ProjectFormSchema>>({
        resolver: zodResolver(ProjectFormSchema),
        defaultValues,
    });

    const { isSubmitting, isSubmitSuccessful } = form.formState;

    const { fields, append, remove } = useFieldArray({
        name: "techUsed",
        control: form.control,
    });

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
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
                                The quote displayed in learnings section of a
                                project
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
                                                Add all the technologies that
                                                were used in developing the
                                                project
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
                    disabled={
                        isSubmitting ||
                        (disableSubmitAfterFirstSubmission &&
                            (isSubmitSuccessful ? true : false))
                    }
                    type="submit"
                    className="w-fit px-9 mt-6">
                    {isSubmitting ? "Submiting..." : "Submit"}
                </Button>
            </form>
        </FormProvider>
    );
};

export default ProjectForm;
