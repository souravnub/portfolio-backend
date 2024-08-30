import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import prisma from "@/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import DeleteContributorButton from "@/components/domains/contributors/DeleteContributorButton";

export const dynamic = "force-dynamic";

const ContributorsPage = async () => {
    const contributors = await prisma.contributor.findMany({
        include: {
            contributions: true,
        },
        orderBy: {
            id: "asc",
        },
    });

    return (
        <div className="container">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-semibold text-xl">Contributors</h1>
                    <p className="text-sm">
                        People that have contributed to your projects!
                    </p>
                </div>

                <Button asChild>
                    <Link href={"/contributors/new"}>Add Contributor</Link>
                </Button>
            </div>

            <Table className="border border-border">
                <TableCaption>
                    {contributors.length > 0
                        ? "A list of contributors."
                        : "No active contributors to display"}
                </TableCaption>
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Profile</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Social</TableHead>

                        <TableHead>Contributed In</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contributors.map(
                        ({
                            id,
                            firstName,
                            lastName,
                            profileImage,
                            contributions,
                            socialUrl,
                        }) => {
                            return (
                                <TableRow key={id}>
                                    <TableCell>{id}</TableCell>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    profileImage
                                                        ? profileImage
                                                        : undefined
                                                }
                                            />
                                            <AvatarFallback className="w-full grid place-content-center bg-neutral-200 font-medium">
                                                {firstName[0].toUpperCase() +
                                                    lastName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {firstName + " " + lastName}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant={"link"}
                                            asChild
                                            className="p-0 text-blue-400">
                                            <Link href={socialUrl}>
                                                View Social
                                            </Link>
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {contributions.map(
                                            async (contribution, idx) => {
                                                const project =
                                                    await prisma.project.findFirst(
                                                        {
                                                            where: {
                                                                id: contribution.projectId,
                                                            },
                                                        }
                                                    );

                                                if (!project) return null;

                                                return (
                                                    <Link
                                                        key={contribution.id}
                                                        href={`${project.productionLink}`}
                                                        className="hover:underline">
                                                        {project.name}
                                                        {idx + 1 !==
                                                        contributions.length
                                                            ? ", "
                                                            : ""}
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </TableCell>
                                    <TableCell className="w-min space-x-2">
                                        <Button asChild variant={"outline"}>
                                            <Link
                                                href={`/contributors/${id}/edit`}>
                                                Edit
                                            </Link>
                                        </Button>

                                        <DeleteContributorButton
                                            contributorId={id}
                                            haveProfileImage={
                                                profileImage ? true : false
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ContributorsPage;
