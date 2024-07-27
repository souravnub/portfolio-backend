"use client";
import { generateSignedUrl } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import {
    ALLOWED_IMAGE_FILE_TYPES,
    ALLOWED_VIDEO_FILE_TYPES,
    computeSHA256,
    getImageData,
} from "@/lib/utils/fileUtils";
import Image from "next/image";
import { useRef, useState } from "react";
import { MdImage, MdInfoOutline, MdVideoFile } from "react-icons/md";

const Preview = ({
    preview,
    assetType,
    previewWidth,
}: {
    preview: string | null;
    assetType: "image" | "video";
    previewWidth: number;
}) => {
    if (!preview) {
        return (
            <div className="text-primary/30 bg-muted-foreground/10 w-full h-full grid place-content-center place-items-center gap-2 py-10 cursor-pointer">
                {assetType === "image" ? (
                    <MdImage className="text-6xl" />
                ) : (
                    <MdVideoFile className="text-6xl" />
                )}
                <span className=" font-bold text-xl">
                    {assetType === "image"
                        ? "No Image to display"
                        : "No video to display"}
                </span>
            </div>
        );
    }

    switch (assetType) {
        case "image":
            return (
                <Image
                    src={preview}
                    alt=""
                    width={previewWidth}
                    height={0} // will be auto as per css
                    className="hover:cursor-pointer"
                />
            );

        case "video":
            return (
                <video
                    width={previewWidth}
                    height={"auto"}
                    autoPlay
                    loop
                    muted
                    src={preview}
                    className="hover:cursor-pointer"
                />
            );

        default:
            break;
    }
};

const FileUpload = ({
    id,
    label,
    description,
    width,
    fileSource = null,
    saveFileInDbAction,
    objectDirectory = undefined,
    assetType,
}: {
    id: string;
    width: number;
    label: string;
    description?: string;
    aspectRatio?: number;
    fileSource?: string | null;
    assetType: "video" | "image";
    objectDirectory?: string;

    saveFileInDbAction: (
        url: string
    ) => Promise<{ success: boolean; message: string }>;
}) => {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState(fileSource);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    async function handleFileSave() {
        if (!file) return;

        toast({
            description: "Generating Signed URL",
        });

        setIsUploading(true);

        const checksum = await computeSHA256(file);
        const signedUrlRes = await generateSignedUrl({
            fileSize: file.size,
            fileType: file.type,
            checksum,
            objectDirectory,
        });

        if (!signedUrlRes.success) {
            toast({
                variant: "destructive",
                description: signedUrlRes.message,
            });
            setIsUploading(false);
            return;
        }

        // 1. save the url in DB
        // 2. if update in DB is successfull, then add the files to aws
        const newFileUrl = signedUrlRes.url.split("?")[0];

        toast({
            description: "Updating file URL in DB",
        });
        const dbActionRes = await saveFileInDbAction(newFileUrl);

        if (!dbActionRes.success) {
            toast({
                variant: "destructive",
                description: dbActionRes.message,
            });
            setIsUploading(false);
            return;
        }

        toast({
            description: "Uploading to S3",
        });

        const res = await fetch(signedUrlRes.url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });
        if (!res.ok) {
            toast({
                variant: "destructive",
                description: (
                    <div>
                        <span className="block">
                            Error while uploading to S3
                        </span>
                        <span>
                            {res.status} {res.statusText}
                        </span>
                    </div>
                ),
            });
            setIsUploading(false);
            return;
        }

        toast({
            description: "Successfully uploaded to S3",
        });

        setIsUploading(false);
        setPreview(newFileUrl);
        setFile(null);
    }

    return (
        <div className="relative space-y-2 w-fit">
            <div className="flex items-center mb-2">
                <div>
                    {!description && <Label htmlFor={id}>{label}</Label>}
                    {description && (
                        <TooltipProvider delayDuration={50}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Label
                                        htmlFor={id}
                                        className="flex gap-1 items-center">
                                        <span>{label}</span>
                                        <MdInfoOutline />
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{description}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
                {/* Undo and save comp */}
                {file && (
                    <div className="ml-auto space-x-3">
                        {!isUploading && (
                            <Button
                                variant={"ghost"}
                                type="button"
                                className="p-0 h-min hover:underline hover:bg-transparent"
                                onClick={() => {
                                    !fileSource
                                        ? setPreview(null)
                                        : setPreview(fileSource);

                                    setFile(null);

                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}>
                                Undo
                            </Button>
                        )}

                        <Button
                            type="button"
                            disabled={isUploading}
                            variant={"ghost"}
                            className="p-0 h-min hover:underline hover:bg-transparent"
                            onClick={handleFileSave}>
                            {!isUploading ? "Save" : "Saving..."}
                        </Button>
                    </div>
                )}
            </div>
            <Label htmlFor={id} className="block mx-auto" style={{ width }}>
                <Preview
                    assetType={assetType}
                    preview={preview}
                    previewWidth={width}
                />
            </Label>

            <div className="flex gap-2">
                <Input
                    id={id}
                    ref={fileInputRef}
                    type="file"
                    accept={
                        assetType == "image"
                            ? ALLOWED_IMAGE_FILE_TYPES.join(",")
                            : ALLOWED_VIDEO_FILE_TYPES.join(",") + ", .mkv"
                    }
                    className="hover:bg-muted/40 cursor-pointer"
                    multiple={false}
                    onChange={(e) => {
                        if (!e.target.files) return;

                        const file = e.target.files[0];
                        const { displayUrl } = getImageData(file);

                        setFile(file);
                        setPreview(displayUrl);
                    }}
                />
            </div>
        </div>
    );
};

export default FileUpload;
