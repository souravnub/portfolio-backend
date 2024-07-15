const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    const projects = [
        {
            name: "Project One",
            role: "Lead Developer",
            image: "project1.jpg",
            yearOfProduction: "2022",
            techUsed: ["JavaScript", "React", "Node.js"],
            description: "A web application built with React and Node.js.",
            skillsEnhanced: {
                create: [
                    {
                        name: "JavaScript",
                        description: "Improved proficiency in JavaScript.",
                    },
                    {
                        name: "React",
                        description: "Enhanced skills in React development.",
                    },
                ],
            },
            quote: "This project was a game-changer for our team.",
            brandColor: "#FF5733",
            brandImageUrl: "brand1.jpg",
            brandNameImageUrl: "brandName1.jpg",
            videoUrl: "video1.mp4",
            mobileImageUrl1: "mobile1_1.jpg",
            mobileImageUrl2: "mobile1_2.jpg",
            mobileVideoUrl: "mobileVideo1.mp4",
            productionLink: "https://project1.com",
            githubLink: "https://github.com/project1",
            inSiteLinkText: "Project One Link",
        },
        {
            name: "Project Two",
            role: "Backend Developer",
            image: "project2.jpg",
            yearOfProduction: "2021",
            techUsed: ["Python", "Django", "PostgreSQL"],
            description: "A backend system built with Django and PostgreSQL.",
            skillsEnhanced: {
                create: [
                    {
                        name: "Python",
                        description: "Improved proficiency in Python.",
                    },
                    {
                        name: "Django",
                        description: "Enhanced skills in Django development.",
                    },
                ],
            },
            quote: "A robust and scalable backend solution.",
            brandColor: "#33FF57",
            brandImageUrl: "brand2.jpg",
            brandNameImageUrl: "brandName2.jpg",
            videoUrl: "video2.mp4",
            mobileImageUrl1: "mobile2_1.jpg",
            mobileImageUrl2: "mobile2_2.jpg",
            mobileVideoUrl: "mobileVideo2.mp4",
            productionLink: "https://project2.com",
            githubLink: "https://github.com/project2",
            inSiteLinkText: "Project Two Link",
        },
        {
            name: "Project Three",
            role: "Full Stack Developer",
            image: "project3.jpg",
            yearOfProduction: "2023",
            techUsed: ["Java", "Spring Boot", "MySQL"],
            description:
                "An enterprise application built with Spring Boot and MySQL.",
            skillsEnhanced: {
                create: [
                    {
                        name: "Java",
                        description: "Improved proficiency in Java.",
                    },
                    {
                        name: "Spring Boot",
                        description:
                            "Enhanced skills in Spring Boot development.",
                    },
                ],
            },
            quote: "Delivering enterprise-level solutions.",
            brandColor: "#3357FF",
            brandImageUrl: "brand3.jpg",
            brandNameImageUrl: "brandName3.jpg",
            videoUrl: "video3.mp4",
            mobileImageUrl1: "mobile3_1.jpg",
            mobileImageUrl2: "mobile3_2.jpg",
            mobileVideoUrl: "mobileVideo3.mp4",
            productionLink: "https://project3.com",
            githubLink: "https://github.com/project3",
            inSiteLinkText: "Project Three Link",
        },
        {
            name: "Project Four",
            role: "Frontend Developer",
            image: "project4.jpg",
            yearOfProduction: "2020",
            techUsed: ["HTML", "CSS", "JavaScript"],
            description:
                "A responsive website built with HTML, CSS, and JavaScript.",
            skillsEnhanced: {
                create: [
                    {
                        name: "HTML",
                        description: "Improved proficiency in HTML.",
                    },
                    { name: "CSS", description: "Enhanced skills in CSS." },
                ],
            },
            quote: "A stunning and responsive web design.",
            brandColor: "#FF33A5",
            brandImageUrl: "brand4.jpg",
            brandNameImageUrl: "brandName4.jpg",
            videoUrl: "video4.mp4",
            mobileImageUrl1: "mobile4_1.jpg",
            mobileImageUrl2: "mobile4_2.jpg",
            mobileVideoUrl: "mobileVideo4.mp4",
            productionLink: "https://project4.com",
            githubLink: "https://github.com/project4",
            inSiteLinkText: "Project Four Link",
        },
        {
            name: "Project Five",
            role: "DevOps Engineer",
            image: "project5.jpg",
            yearOfProduction: "2019",
            techUsed: ["Docker", "Kubernetes", "AWS"],
            description:
                "A DevOps pipeline built with Docker, Kubernetes, and AWS.",
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
            quote: "Streamlined our deployment process.",
            brandColor: "#A533FF",
            brandImageUrl: "brand5.jpg",
            brandNameImageUrl: "brandName5.jpg",
            videoUrl: "video5.mp4",
            mobileImageUrl1: "mobile5_1.jpg",
            mobileImageUrl2: "mobile5_2.jpg",
            mobileVideoUrl: "mobileVideo5.mp4",
            productionLink: "https://project5.com",
            githubLink: "https://github.com/project5",
            inSiteLinkText: "Project Five Link",
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
