"use client";
import { generateSignedUrl } from "@/actions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { computeSHA256, getImageData } from "@/lib/utils/fileUtils";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { MdImage } from "react-icons/md";

const ImageUpload = ({
    imageSource = null,
    saveImageInDbAction,
}: {
    imageSource?: string | null;
    saveImageInDbAction: (url: string) => Promise<void>;
}) => {
    const { toast } = useToast();
    const imgInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState(imageSource);
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
        });

        if (!signedUrlRes.success) {
            toast({
                variant: "destructive",
                description: signedUrlRes.message,
            });
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

        const newImageUrl = signedUrlRes.url.split("?")[0];
        await saveImageInDbAction(newImageUrl);

        setIsUploading(false);
        setPreview(newImageUrl);
        setFile(null);
    }

    return (
        <div className="relative space-y-2 max-w-lg">
            <div className="flex items-center mb-2">
                <Label htmlFor="imageInp">Portfolio Image</Label>
                {/* Undo and save comp */}
                {file && (
                    <div className="ml-auto space-x-3">
                        {!isUploading && (
                            <Button
                                variant={"ghost"}
                                type="button"
                                className="p-0 h-min hover:underline hover:bg-transparent"
                                onClick={() => {
                                    !imageSource
                                        ? setPreview(null)
                                        : setPreview(imageSource);

                                    setFile(null);

                                    if (imgInputRef.current) {
                                        imgInputRef.current.value = "";
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
            <Label htmlFor="imageInp">
                <AspectRatio
                    ratio={16 / 9}
                    className="rounded-lg overflow-hidden">
                    {/* iamge display */}
                    {preview ? (
                        <Image
                            fill
                            src={preview}
                            alt=""
                            className="object-cover object-top hover:cursor-pointer"
                        />
                    ) : (
                        <div className="text-primary/30 bg-muted/40 w-full h-full grid place-content-center place-items-center gap-2">
                            <MdImage className="text-6xl" />
                            <span className=" font-bold text-xl">
                                no Image To Display
                            </span>
                        </div>
                    )}
                </AspectRatio>
            </Label>

            <div className="flex gap-2">
                <Input
                    id="imageInp"
                    ref={imgInputRef}
                    type="file"
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

export default ImageUpload;
