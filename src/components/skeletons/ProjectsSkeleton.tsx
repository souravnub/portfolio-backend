import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProjectsSkeleton = () => {
    return [1, 2, 3, 4].map((e) => {
        return (
            <div key={e} className="flex flex-col space-y-3">
                <Skeleton className="h-40 rounded-xl p-6">
                    <Skeleton className="h-6 rounded-md max-w-28" />
                    <Skeleton className="h-4 rounded-md max-w-md mt-3" />
                    <div className="flex gap-3 mt-5">
                        <Skeleton className="h-8 rounded-md w-24" />
                        <Skeleton className="h-8 rounded-md w-24" />
                    </div>
                </Skeleton>
            </div>
        );
    });
};

export default ProjectsSkeleton;
