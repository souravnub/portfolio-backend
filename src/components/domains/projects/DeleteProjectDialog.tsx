import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import DeleteProjectDialogForm from "./DeleteProjectDialogForm";

const DeleteProjectDialog = ({
    projectId,
    projectName,
    setIsDialogOpen,
}: {
    projectId: number;
    projectName: string;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the project.
                </DialogDescription>
                <DeleteProjectDialogForm
                    projectId={projectId}
                    projectName={projectName}
                    setIsDialogOpen={setIsDialogOpen}
                />
            </DialogHeader>
        </DialogContent>
    );
};

export default DeleteProjectDialog;
