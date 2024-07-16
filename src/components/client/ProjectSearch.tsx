"use client";

import { Cross, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";
import { Button } from "../ui/button";

export function ProjectSearch({
    initialSearchQuery,
}: {
    initialSearchQuery: string | null | undefined;
}) {
    const [input, setInput] = useState(initialSearchQuery || "");
    const debouncedSearchTerm = useDebounce(input, 400);
    const router = useRouter();

    useEffect(() => {
        const encodedSearchQuery = encodeURI(debouncedSearchTerm);
        router.push(`/projects?q=${encodedSearchQuery}`);
    }, [debouncedSearchTerm]);

    return (
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search Projects..."
                className="w-full rounded-lg pl-8 py-5"
            />
            {input.length > 0 && (
                <Button
                    variant={"ghost"}
                    className="p-0 absolute right-0 top-1/2 -translate-y-1/2  h-full px-3 group hover:bg-transparent"
                    onClick={() => setInput("")}>
                    <MdClose className="group-hover:text-primary text-primary/40" />
                </Button>
            )}
        </div>
    );
}
