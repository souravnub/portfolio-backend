"use client";
import { deleteProject } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { FormEvent, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const DeleteProjectDialogForm = ({
    projectId,
    projectName,
    setIsDialogOpen,
}: {
    projectId: number;
    projectName: string;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [val, setVal] = useState("");
    const [isInpValid, setIsInpValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    useEffect(() => {
        if (val.trim() === projectName.trim()) {
            setIsInpValid(true);
        } else {
            setIsInpValid(false);
        }
    }, [val]);

    async function handleFormSubmit(e: FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.target as HTMLFormElement);

        const { success, warning, warningMsg, message } = await deleteProject(
            formData
        );

        if (!success) {
            toast({
                title: "Error!!",
                description: message,
            });
        } else if (success && !warning) {
            toast({
                title: "Project Deleted!!",
                description: message,
            });
        } else if (success && warning) {
            toast({
                title: "Project Deleted!!",
                description: message,
            });
            toast({
                title: "Warning!!",
                variant: "destructive",
                description: warningMsg,
            });
        }

        setIsLoading(false);
        setIsDialogOpen(false);
    }

    return (
        <form className="mt-4" onSubmit={handleFormSubmit}>
            <Label htmlFor={`dialog-delete-${projectId}`}>
                To confirm, type &ldquo;{projectName}&rdquo; in the input below
            </Label>
            <input type="hidden" name="projectId" value={projectId} />
            <Input
                id={`dialog-delete-${projectId}`}
                value={val}
                className={`${
                    isInpValid
                        ? "outline-input ring-input border-input"
                        : "outline-destructive ring-destructive border-destructive  focus-visible:ring-destructive"
                }`}
                onChange={(e) => setVal(e.target.value)}></Input>
            <Button
                type="submit"
                variant={"destructive"}
                disabled={!isInpValid || isLoading}
                className="w-full mt-3 border">
                {isLoading ? "Deleting..." : "Delete project"}
            </Button>
        </form>
    );
};

export default DeleteProjectDialogForm;
