import AddContributorForm from "@/components/domains/contributors/forms/AddContributorForm";
import prisma from "@/db";
import React from "react";
import { MdInfo } from "react-icons/md";

const AddContributorPage = async () => {
    const projects = await prisma.project.findMany({});

    return (
        <div className="container">
            <h1 className="text-xl font-medium  mb-1">Add a new Contributor</h1>
            <p className="flex items-center gap-1 text-sm">
                <MdInfo className="text-blue-500 text-xl"></MdInfo> The Profile
                Image for the contributor can be uploaded while editting the
                contributor details
            </p>
            <AddContributorForm projects={projects} />
        </div>
    );
};

export default AddContributorPage;
