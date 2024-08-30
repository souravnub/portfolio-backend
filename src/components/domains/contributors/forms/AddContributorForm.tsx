"use client";
import { addContributor } from "@/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ContributorFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const AddContributorForm = ({
    projects,
}: {
    projects: { id: number; name: string }[];
}) => {
    const form = useForm<z.infer<typeof ContributorFormSchema>>({
        resolver: zodResolver(ContributorFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            socialUrl: "",
            contributions: [],
        },
    });
    const { toast } = useToast();
    const router = useRouter();

    form.watch(["firstName", "lastName"]);

    async function onFormSubmit(values: z.infer<typeof ContributorFormSchema>) {
        const res = await addContributor({
            data: {
                ...values,
                contributions: {
                    createMany: {
                        data: values.contributions.map((c) => ({
                            projectId: c,
                        })),
                    },
                },
            },
        });

        toast({
            variant: res.success ? "default" : "destructive",
            description: res.message,
        });

        if (res.success) {
            router.push("/contributors");
        }
    }

    return (
        <FormProvider {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-3 py-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="socialUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Social</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <FormField
                        control={form.control}
                        name={`contributions`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contributions</FormLabel>
                                <FormDescription>
                                    Select the projects in which{" "}
                                    <span className="font-medium text-primary capitalize">
                                        {form.getValues("firstName")}{" "}
                                        {form.getValues("lastName")}{" "}
                                    </span>
                                    contributed
                                </FormDescription>

                                {projects.map(({ name, id }) => (
                                    <FormField
                                        key={id}
                                        control={form.control}
                                        name="contributions"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={id}
                                                    className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(
                                                                id
                                                            )}
                                                            onCheckedChange={(
                                                                checked
                                                            ) => {
                                                                return checked
                                                                    ? field.onChange(
                                                                          [
                                                                              ...field.value,
                                                                              id,
                                                                          ]
                                                                      )
                                                                    : field.onChange(
                                                                          field.value?.filter(
                                                                              (
                                                                                  value
                                                                              ) =>
                                                                                  value !==
                                                                                  id
                                                                          )
                                                                      );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {name}
                                                    </FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    className="!mt-10 px-10"
                    disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting" : "Submit"}
                </Button>
            </form>
        </FormProvider>
    );
};

export default AddContributorForm;
