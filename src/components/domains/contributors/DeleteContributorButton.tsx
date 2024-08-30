"use client";
import { deleteContributor } from "@/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";

const DeleteContributorButton = ({
    contributorId,
    haveProfileImage,
}: {
    contributorId: number;
    haveProfileImage: boolean;
}) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function handleContributorDelete() {
        setIsLoading(true);
        const { message, success } = await deleteContributor({
            contributorId,
            haveProfileImage,
        });
        toast({
            variant: !success ? "destructive" : "default",
            description: message,
        });
        setIsLoading(false);
    }

    return (
        <Button
            variant={"destructive"}
            onClick={handleContributorDelete}
            disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
        </Button>
    );
};

export default DeleteContributorButton;
