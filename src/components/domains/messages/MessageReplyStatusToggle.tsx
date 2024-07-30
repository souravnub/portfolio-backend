"use client";
import { haveRepliedToMessage } from "@/actions";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const MessageReplyStatusToggle = ({
    messageId,
    status: replyStatus,
}: {
    messageId: number;
    status: boolean;
}) => {
    const { toast } = useToast();
    async function handleReplyChange(value: string) {
        const res = await haveRepliedToMessage({
            messageId,
            replied: value === "toReply" ? false : true,
        });

        if (!res.success) {
            toast({
                variant: "destructive",
                description: res.message,
            });
            return;
        }
        toast({
            description: res.message,
        });
    }
    return (
        <div>
            <Label htmlFor="selectTrigger">Reply Status</Label>
            <Select
                defaultValue={replyStatus ? "replied" : "toReply"}
                onValueChange={handleReplyChange}>
                <SelectTrigger className="w-[180px]" id="selectTrigger">
                    <SelectValue placeholder="Reply status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="toReply">Not Replied</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default MessageReplyStatusToggle;
