import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";

import { GitHubLogoIcon, GlobeIcon } from "@radix-ui/react-icons";
import { TbSettingsDown } from "react-icons/tb";
import { MdPublish } from "react-icons/md";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import ProjectDropdown from "./ProjectDropdown";
import PublishProjectButton from "./PublishProjectButton";

interface Project {
    id: number;
    name: string;
    yearOfProduction: string;
    description: string;
    productionLink: string;
    githubLink: string;
    isPublished: boolean;
}

const ProjectCard = ({ project }: { project: Project }) => {
    const {
        id,
        name,
        yearOfProduction,
        description,
        productionLink,
        githubLink,
        isPublished,
    } = project;
    return (
        <Card className="p-6 flex items-start gap-4">
            <TooltipProvider delayDuration={50}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className={`${
                                isPublished ? "bg-green-600" : "bg-red-500"
                            } w-2.5 h-2.5 mt-2  rounded-full`}></div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            {isPublished
                                ? "The project is public!!"
                                : "Not publically visible in the portfolio"}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className="flex-1">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <Link
                            href={productionLink}
                            className="hover:underline underline-offset-2">
                            {name}
                        </Link>
                        <Badge variant={"secondary"}>{yearOfProduction}</Badge>
                    </div>

                    <ProjectDropdown projectId={id} projectName={name} />
                </div>

                <CardDescription className="my-3">
                    {description}
                </CardDescription>
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
                    <PublishProjectButton
                        projectId={id}
                        isPublished={isPublished}
                    />
                </div>
            </div>
        </Card>
    );
};

export default ProjectCard;
