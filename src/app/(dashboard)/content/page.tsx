import { updateHomePageImage } from "@/actions";
import { HomePageContentForm } from "@/components/domains/content/HomePageContentForm";
import FileUpload from "@/components/domains/content/FileUpload";
import prisma from "@/db";
import React from "react";

export const dynamic = "force-dynamic";

const ContentPage = async () => {
    const homePageContent = await prisma.homePageContent.findFirst();

    return (
        <div>
            <FileUpload
                objectKey="portfolio-image"
                id="portfolio image"
                width={500}
                label="Portfolio Image"
                fileSource={homePageContent?.mainImageUrl}
                saveFileInDbAction={updateHomePageImage}
                assetType="image"
            />
            <div className="mt-5">
                <HomePageContentForm initialValues={homePageContent} />
            </div>
        </div>
    );
};

export default ContentPage;
