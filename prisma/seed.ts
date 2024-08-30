const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const projects = [
        {
            name: "S Mart",
            role: "development & design",
            image: null,
            yearOfProduction: "2024",
            techUsed: ["reactjs", "scss", "axios"],
            description: "This is smart project, a shopping website ",
            quote: "The smart website",
            brandColor: "#58c0d5",
            brandImageUrl:
                "https://portfolio-bucket-prod.s3.us-east-1.amazonaws.com/projects/S%20Mart/brand-image?1722052269054",
            brandNameImageUrl:
                "https://portfolio-bucket-prod.s3.us-east-1.amazonaws.com/projects/S%20Mart/brand-name-image?1722052282702",
            videoUrl:
                "https://portfolio-bucket-prod.s3.us-east-1.amazonaws.com/projects/S%20Mart/macbook-video?1722052324184",
            mobileImageUrl1:
                "https://portfolio-bucket-prod.s3.us-east-1.amazonaws.com/projects/S%20Mart/mobileAssets/mobile-image-1?1722052362449",
            mobileImageUrl2:
                "https://portfolio-bucket-prod.s3.us-east-1.amazonaws.com/projects/S%20Mart/mobileAssetsmobile-image-2?1722052359335",
            mobileVideoUrl:
                "https://portfolio-bucket-prod.s3.us-east-1.amazonaws.com/projects/S%20Mart/mobileAssets/mobile-video?1722052370294",
            productionLink: "https://smart-shopping-website.netlify.app/",
            githubLink:
                "https://github.com/souravnub/smart-shopping-website-frontend",
            tabletImageUrl:
                "https://portfolio-bucket-prod.s3.us-east-1.amazonaws.com/projects/S%20Mart/tabletAssets/tablet-image?1722052430560",
            tabletVideoUrl:
                "https://portfolio-bucket-prod.s3.us-east-1.amazonaws.com/projects/S%20Mart/tabletAssets/tablet-video?1722052438453",

            skillsEnhanced: {
                create: [
                    {
                        name: "Docker",
                        description: "Improved proficiency in Docker.",
                    },
                    {
                        name: "Kubernetes",
                        description: "Enhanced skills in Kubernetes.",
                    },
                ],
            },
        },
    ];

    for (const project of projects) {
        await prisma.project.create({
            data: {
                ...project,
                skillsEnhanced: {
                    create: project.skillsEnhanced.create,
                },
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
