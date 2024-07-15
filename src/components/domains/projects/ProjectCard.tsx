import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdEdit } from "react-icons/md";

import {
    DotsHorizontalIcon,
    GitHubLogoIcon,
    GlobeIcon,
} from "@radix-ui/react-icons";
import { AiFillDelete } from "react-icons/ai";

import Link from "next/link";

interface Project {
    id: number;
    name: string;
    yearOfProduction: string;
    description: string;
    productionLink: string;
    githubLink: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
    const { name, yearOfProduction, description, productionLink, githubLink } =
        project;
    return (
        <Card className="p-6">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <Link
                        href={productionLink}
                        className="hover:underline underline-offset-2">
                        {name}
                    </Link>
                    <Badge variant={"secondary"}>{yearOfProduction}</Badge>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="p-1.5 h-min">
                            <DotsHorizontalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="center"
                        className="p-2 rounded-xl">
                        <DropdownMenuItem className="rounded-lg py-2">
                            <Link
                                href={"/projects"}
                                className="flex justify-between w-full items-center">
                                Edit
                                <DropdownMenuShortcut className="text-base">
                                    <MdEdit />
                                </DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg py-2">
                            <Button
                                variant={"ghost"}
                                className="p-0 h-min flex justify-between items-center w-full">
                                Delete
                                <DropdownMenuShortcut className="text-base">
                                    <AiFillDelete />
                                </DropdownMenuShortcut>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <CardDescription className="my-3">{description}</CardDescription>
            <div className="flex gap-4">
                <Link href={githubLink}>
                    <Button variant="outline">
                        <GitHubLogoIcon className="mr-1" /> Github
                    </Button>
                </Link>
                <Link href={productionLink}>
                    <Button variant="outline">
                        <GlobeIcon className="mr-1" />
                        Production
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

export default ProjectCard;
