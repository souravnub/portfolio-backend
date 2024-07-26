"use client";
import { deleteProject } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

function DeleteProjectButton({ isInpValid }: { isInpValid: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            variant={"destructive"}
            disabled={!isInpValid || pending}
            className="w-full mt-3 border">
            {pending ? "Deleting..." : "Delete project"}
        </Button>
    );
}

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
    const [deleteProjectActionRes, deleteProjectAction] = useFormState(
        deleteProject,
        {
            success: null,
        }
    );
    const { toast } = useToast();

    useEffect(() => {
        if (deleteProjectActionRes.success === true) {
            toast({
                variant: "default",
                title: "Project deleted",
                description: "Project had been deleted successfully",
            });
            setIsDialogOpen(false);
        } else if (deleteProjectActionRes.success === false) {
            toast({
                variant: "destructive",
                title: "Error!!",
                description: "Error while deleting the project",
            });
        }
    }, [deleteProjectActionRes.success]);

    useEffect(() => {
        if (val.trim() === projectName.trim()) {
            setIsInpValid(true);
        } else {
            setIsInpValid(false);
        }
    }, [val]);

    return (
        <form className="mt-4" action={deleteProjectAction}>
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
            <DeleteProjectButton isInpValid={isInpValid} />
        </form>
    );
};

export default DeleteProjectDialogForm;
