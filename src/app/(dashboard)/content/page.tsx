import ImageUpload from "@/components/domains/content/ImageUpload";
import prisma from "@/db";
import React from "react";

const ContentPage = async () => {
    const homePageContent = await prisma.homePageContent.findFirst();

    return (
        <div>
            <ImageUpload imageSource={homePageContent?.mainImageUrl} />
        </div>
    );
};

export default ContentPage;
