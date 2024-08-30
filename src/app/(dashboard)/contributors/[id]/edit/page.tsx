import { updateContributor } from "@/actions";
import FileUpload from "@/components/domains/content/FileUpload";
import EditContributorForm from "@/components/domains/contributors/forms/EditContributorForm";
import prisma from "@/db";
import React from "react";

interface PageProps {
    params: { id: string };
}

export const dynamic = "force-dynamic";

const EditContributorPage = async ({ params }: PageProps) => {
    if (Number.isNaN(Number(params.id)) === true) {
        return <div>invalid args</div>;
    }

    const contributor = await prisma.contributor.findFirst({
        where: { id: Number(params.id) },
    });

    if (!contributor) {
        return <div>No contributor found</div>;
    }

    const projects = await prisma.project.findMany({
        select: { id: true, name: true },
    });
    const contributions = await prisma.contribution
        .findMany({
            where: { contributorId: contributor.id },
        })
        .then((res) => {
            return res.map((contributionObj) => contributionObj.projectId);
        });

    return (
        <div className="container">
            <FileUpload
                id="profileImage"
                width={100}
                label="Profile image"
                assetType="image"
                fileSource={contributor.profileImage}
                objectDirectory="contributors/"
                objectKey={contributor.id.toString()}
                saveFileInDbAction={async (newImageUrl) => {
                    "use server";
                    return updateContributor({
                        id: contributor.id,
                        data: { profileImage: newImageUrl },
                    });
                }}
            />
            <EditContributorForm
                contributorId={contributor.id}
                projects={projects}
                defaultValues={{ ...contributor, contributions }}
            />
        </div>
    );
};

export default EditContributorPage;
