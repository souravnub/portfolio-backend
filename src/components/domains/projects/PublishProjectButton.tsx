"use client";

import { toggleProjectPublication } from "@/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { MdPublish } from "react-icons/md";
import { TbSettingsDown } from "react-icons/tb";

const PublishProjectButton = ({
    projectId,
    isPublished,
}: {
    projectId: number;
    isPublished: boolean;
}) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    async function togglePublication() {
        setIsLoading(true);
        const res = await toggleProjectPublication({
            id: projectId,
            currentPublicationStatus: isPublished
                ? "published"
                : "not-published",
        });

        if (!res?.success) {
            toast({
                variant: "destructive",
                description: res?.message,
            });
            return;
        }

        toast({
            description: res.message,
        });

        setIsLoading(false);
    }

    return (
        <Button
            onClick={togglePublication}
            variant={"secondary"}
            className="border border-border">
            {!isPublished ? (
                <MdPublish className="mr-1" />
            ) : (
                <TbSettingsDown className="mr-1" />
            )}
            {!isPublished
                ? isLoading
                    ? "Publishing..."
                    : "Publish"
                : isLoading
                ? "Dropping..."
                : "Drop"}
        </Button>
    );
};

export default PublishProjectButton;
