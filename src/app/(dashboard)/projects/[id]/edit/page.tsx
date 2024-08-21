import { updateProjectAction } from "@/actions";
import FileUpload from "@/components/domains/content/FileUpload";
import EditProjectForm from "@/components/domains/projects/forms/EditProjectForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import prisma from "@/db";
import Link from "next/link";

interface EditProjectpageProps {
    params: { id: string };
}

export const dynamic = "force-dynamic";

async function getProject(id: number) {
    const project = await prisma.project.findFirst({
        where: {
            id: Number(id),
        },
        include: {
            contributors: true,
        },
    });
    return project;
}

async function getContributorData(contributorId: number) {
    const contributorData = await prisma.contributor.findFirst({
        where: { id: contributorId },
    });
    return contributorData;
}

const EditProjectPage = async ({ params }: EditProjectpageProps) => {
    // TODO: error page showing "invalid args"
    if (Number.isNaN(Number(params.id)) === true) {
        return <div>invalid args</div>;
    }

    const project = await getProject(Number(params.id));

    // TODO: error page showing "no project"
    if (!project) return <div>No project</div>;

    const contributorsPromiseArr = project.contributors.map((c) =>
        getContributorData(c.contributorId)
    );

    const contributors = await Promise.all(contributorsPromiseArr);

    const defaultValues = {
        ...project,
        techUsed: project?.techUsed.map((e) => ({ value: e })),
        quote: project.quote === null ? undefined : project.quote,
        githubLink: project.githubLink === null ? "" : project.githubLink,
    };

    return (
        <div className="space-y-16">
            <FileUpload
                objectDirectory={`projects/${project.name}/`}
                objectKey="main-image"
                description="The main image that will used for the project"
                id="main-image"
                width={400}
                label="main image"
                assetType="image"
                fileSource={defaultValues.image}
                saveFileInDbAction={async (newImageUrl) => {
                    "use server";
                    const res = updateProjectAction({
                        id: defaultValues.id,
                        data: {
                            image: newImageUrl,
                        },
                    });
                    return res;
                }}
            />

            <div className=" space-y-12">
                <div className="bg-muted p-5 rounded-lg flex gap-10 flex-wrap justify-between">
                    <FileUpload
                        objectDirectory={`projects/${project.name}/`}
                        objectKey="brand-image"
                        description="The image that would related the project to the users"
                        id="brand image"
                        width={300}
                        label="Brand image"
                        assetType="image"
                        fileSource={defaultValues.brandImageUrl}
                        saveFileInDbAction={async (newImageUrl) => {
                            "use server";
                            const res = updateProjectAction({
                                id: defaultValues.id,
                                data: {
                                    brandImageUrl: newImageUrl,
                                },
                            });
                            return res;
                        }}
                    />
                    <FileUpload
                        objectDirectory={`projects/${project.name}/`}
                        objectKey="brand-name-image"
                        id="brand name image"
                        description="The name of the project that is placed inside the brand image"
                        width={300}
                        label={"Brand name image"}
                        assetType="image"
                        fileSource={defaultValues.brandNameImageUrl}
                        saveFileInDbAction={async (newImageUrl) => {
                            "use server";
                            const res = updateProjectAction({
                                id: defaultValues.id,
                                data: {
                                    brandNameImageUrl: newImageUrl,
                                },
                            });
                            return res;
                        }}
                    />
                    <FileUpload
                        id="macvideo"
                        objectDirectory={`projects/${project.name}/`}
                        objectKey="macbook-video"
                        width={300}
                        label={"Macbook video"}
                        assetType="video"
                        fileSource={defaultValues.videoUrl}
                        saveFileInDbAction={async (newVideoUrl) => {
                            "use server";
                            const res = updateProjectAction({
                                id: defaultValues.id,
                                data: {
                                    videoUrl: newVideoUrl,
                                },
                            });
                            return res;
                        }}
                    />
                </div>

                <div className="flex justify-between gap-10 flex-wrap rounded-lg p-5">
                    <FileUpload
                        id="mobileimage1"
                        objectKey="mobile-image-1"
                        objectDirectory={`projects/${project.name}/mobileAssets/`}
                        width={200}
                        label={"Mobile image 1"}
                        assetType="image"
                        fileSource={defaultValues.mobileImageUrl1}
                        saveFileInDbAction={async (newImageUrl) => {
                            "use server";
                            const res = updateProjectAction({
                                id: defaultValues.id,
                                data: {
                                    mobileImageUrl1: newImageUrl,
                                },
                            });
                            return res;
                        }}
                    />
                    <FileUpload
                        id="mobilevideo"
                        objectDirectory={`projects/${project.name}/mobileAssets/`}
                        objectKey="mobile-video"
                        width={200}
                        label={"Mobile Video"}
                        assetType="video"
                        fileSource={defaultValues.mobileVideoUrl}
                        saveFileInDbAction={async (newVideoUrl) => {
                            "use server";
                            const res = updateProjectAction({
                                id: defaultValues.id,
                                data: {
                                    mobileVideoUrl: newVideoUrl,
                                },
                            });
                            return res;
                        }}
                    />
                    <FileUpload
                        id="mobile image 2"
                        objectDirectory={`projects/${project.name}/mobileAssets/`}
                        objectKey="mobile-image-2"
                        width={200}
                        label={"Mobile image 2"}
                        assetType="image"
                        fileSource={defaultValues.mobileImageUrl2}
                        saveFileInDbAction={async (newImageUrl) => {
                            "use server";
                            const res = updateProjectAction({
                                id: defaultValues.id,
                                data: {
                                    mobileImageUrl2: newImageUrl,
                                },
                            });
                            return res;
                        }}
                    />
                </div>

                <div className="bg-muted p-5 rounded-lg flex justify-around flex-wrap">
                    <FileUpload
                        id="tablet image"
                        objectDirectory={`projects/${project.name}/tabletAssets/`}
                        objectKey="tablet-image"
                        width={400}
                        label={"Table Image"}
                        assetType="image"
                        fileSource={defaultValues.tabletImageUrl}
                        saveFileInDbAction={async (newImageUrl) => {
                            "use server";
                            const res = updateProjectAction({
                                id: defaultValues.id,
                                data: {
                                    tabletImageUrl: newImageUrl,
                                },
                            });
                            return res;
                        }}
                    />
                    <FileUpload
                        id="tablet video"
                        objectDirectory={`projects/${project.name}/tabletAssets/`}
                        objectKey="tablet-video"
                        width={400}
                        label={"Table Video"}
                        assetType="video"
                        fileSource={defaultValues.tabletVideoUrl}
                        saveFileInDbAction={async (newVideoUrl) => {
                            "use server";
                            const res = updateProjectAction({
                                id: defaultValues.id,
                                data: {
                                    tabletVideoUrl: newVideoUrl,
                                },
                            });
                            return res;
                        }}
                    />
                </div>
            </div>

            <div>
                <Label className="mb-4 block">Contributors</Label>
                <div className="flex gap-2 flex-wrap">
                    {contributors
                        .filter((c) => c !== null)
                        .map(({ profileImage, firstName, lastName, id }) => {
                            return (
                                <Button
                                    key={id}
                                    variant={"outline"}
                                    className="h-auto w-fit space-x-2"
                                    asChild>
                                    <Link href={`/contributors/${id}/edit`}>
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

                                        <span>
                                            {firstName} {lastName}
                                        </span>
                                    </Link>
                                </Button>
                            );
                        })}
                </div>
            </div>

            <EditProjectForm
                defaultValues={defaultValues}
                projectId={defaultValues.id}
            />
        </div>
    );
};

export default EditProjectPage;
