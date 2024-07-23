import { updateHomePageImage } from "@/actions";
import { HomePageContentForm } from "@/components/domains/content/HomePageContentForm";
import ImageUpload from "@/components/domains/content/ImageUpload";
import prisma from "@/db";
import React from "react";

export const dynamic = "force-dynamic";

const ContentPage = async () => {
    const homePageContent = await prisma.homePageContent.findFirst();

    return (
        <div>
            <ImageUpload
                imageSource={homePageContent?.mainImageUrl}
                saveImageInDbAction={updateHomePageImage}
            />
            <div className="mt-5">
                <HomePageContentForm initialValues={homePageContent} />
            </div>
        </div>
    );
};

export default ContentPage;
