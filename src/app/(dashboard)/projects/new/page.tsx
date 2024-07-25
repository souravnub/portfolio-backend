"use client";

import { createProjectAction } from "@/actions";
import ProjectForm from "@/components/domains/projects/forms/ProjectForm";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { ProjectFormSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { MdInfo } from "react-icons/md";
import { z } from "zod";
// adding the images is not supported in adding a new project
// when a new project is made, the user will be redirected to the edit page of the project, where the user can update the images

// time in seconds after which the redirect should happen
const REDIRECT_AFTER = 4;

const NewProjectPage = () => {
    const router = useRouter();
    const { toast } = useToast();

    async function handleFormSubmit(values: z.infer<typeof ProjectFormSchema>) {
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
                dismissRedirectToast();
                clearInterval(interval);
                router.push(`/projects/${res.projectId}/edit`);
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
            <ProjectForm
                disableSubmitAfterFirstSubmission={true}
                onFormSubmit={(values) => handleFormSubmit(values)}
            />
        </>
    );
};

export default NewProjectPage;
