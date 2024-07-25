"use client";
import React from "react";
import ProjectForm from "./ProjectForm";
import { z } from "zod";
import { ProjectFormSchema } from "@/schemas";
import { updateProjectInfo } from "@/actions";
import { useToast } from "@/components/ui/use-toast";

interface EditProjectFormProps {
    defaultValues: z.infer<typeof ProjectFormSchema>;
    projectId: number;
}

const EditProjectForm = ({
    defaultValues,
    projectId,
}: EditProjectFormProps) => {
    const { toast } = useToast();
    async function handleFormSubmit(values: z.infer<typeof ProjectFormSchema>) {
        const res = await updateProjectInfo({ values, projectId });

        toast({
            variant: !res.success ? "destructive" : "default",
            description: res.message,
        });
    }

    return (
        <ProjectForm
            defaultValues={defaultValues}
            onFormSubmit={handleFormSubmit}
        />
    );
};

export default EditProjectForm;
