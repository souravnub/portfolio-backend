import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import MessageReplyStatusToggle from "@/components/domains/messages/MessageReplyStatusToggle";
import prisma from "@/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const MessagesPage = async () => {
    const messages = await prisma.message.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="container">
            {messages.length > 0 ? (
                <Table>
                    <TableCaption>A list of messages.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Received At</TableHead>
                            <TableHead>Replied?</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.map(
                            ({
                                id,
                                name,
                                email,
                                message,
                                createdAt,
                                replied,
                            }) => {
                                return (
                                    <Dialog key={id}>
                                        <DialogTrigger asChild>
                                            <TableRow className="hover:cursor-pointer">
                                                <TableCell className="font-medium">
                                                    {name}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`mailto:${email}`}
                                                        className="hover:underline">
                                                        {email}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="max-w-sm">
                                                    {message.slice(0, 100)}...
                                                </TableCell>
                                                <TableCell>
                                                    {createdAt.toDateString()},{" "}
                                                    {createdAt.toLocaleTimeString()}
                                                </TableCell>
                                                <TableCell>
                                                    {replied ? (
                                                        <span className="text-green-600">
                                                            True
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-600">
                                                            False
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        </DialogTrigger>

                                        <DialogContent className="w-[90%] max-w-7xl">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Message
                                                </DialogTitle>

                                                <DialogDescription>
                                                    Here's the message from{" "}
                                                    <Link
                                                        href={`mailto:${email}`}
                                                        className="underline">
                                                        {email}
                                                    </Link>
                                                </DialogDescription>
                                            </DialogHeader>
                                            <p className="text-sm">{message}</p>
                                            <DialogFooter className="sm:justify-start">
                                                <MessageReplyStatusToggle
                                                    messageId={id}
                                                    status={replied}
                                                />
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                );
                            }
                        )}
                    </TableBody>
                </Table>
            ) : (
                <div>
                    <h1 className="text-center  text-2xl font-medium">
                        No messages to display
                    </h1>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;
