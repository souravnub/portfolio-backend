"use client";
import React, { useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MdEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteProjectDialog from "./DeleteProjectDialog";

const ProjectDropdown = ({
    projectId,
    projectName,
}: {
    projectId: number;
    projectName: string;
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="p-1.5  h-min">
                        <DotsHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="center"
                    className="p-2  rounded-xl space-y-1">
                    <DropdownMenuItem className="rounded-lg ">
                        <Link
                            href={`/projects/${projectId}/edit`}
                            className="flex justify-between w-full items-center">
                            Edit
                            <DropdownMenuShortcut className="text-base">
                                <MdEdit />
                            </DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                    <DialogTrigger asChild>
                        <DropdownMenuItem className=" rounded-lg">
                            <button className="flex  justify-between items-center w-full">
                                Delete
                                <DropdownMenuShortcut className="text-base">
                                    <AiFillDelete />
                                </DropdownMenuShortcut>
                            </button>
                        </DropdownMenuItem>
                    </DialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteProjectDialog
                projectId={projectId}
                projectName={projectName}
                setIsDialogOpen={setIsDialogOpen}
            />
        </Dialog>
    );
};

export default ProjectDropdown;
