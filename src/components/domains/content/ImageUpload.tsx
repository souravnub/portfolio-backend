"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { MdImage } from "react-icons/md";

function getImageData(file: File) {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer();

    if (!file) return { displayUrl: "" };
    // Add newly uploaded image
    dataTransfer.items.add(file);

    const displayUrl = URL.createObjectURL(file);

    return { displayUrl };
}

const ImageUpload = ({ imageSource }: { imageSource?: string }) => {
    const imgInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState("");

    return (
        <div className="relative space-y-2 max-w-lg">
            <div className="flex justify-between items-center mb-2">
                <Label htmlFor="imageInp">Portfolio Image</Label>
                {preview && preview !== imageSource && (
                    <Button
                        variant={"ghost"}
                        className="p-0 h-min hover:underline hover:bg-transparent"
                        onClick={() => {
                            if (!imageSource) return setPreview("");
                            setPreview(imageSource);
                            if (imgInputRef.current) {
                                imgInputRef.current.value = "";
                            }
                        }}>
                        Undo
                    </Button>
                )}
            </div>
            <Label htmlFor="imageInp">
                <AspectRatio
                    ratio={16 / 9}
                    className="rounded-lg overflow-hidden">
                    {preview || imageSource ? (
                        <Image
                            fill
                            src={
                                preview
                                    ? preview
                                    : imageSource
                                    ? imageSource
                                    : ""
                            }
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
                        if (e.target.files) {
                            const file = e.target.files[0];
                            const { displayUrl } = getImageData(file);
                            setPreview(displayUrl);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ImageUpload;
