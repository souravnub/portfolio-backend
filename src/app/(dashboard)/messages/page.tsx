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

import { deleteMessage } from "@/actions";
import MessageReplyStatusToggle from "@/components/domains/messages/MessageReplyStatusToggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prisma from "@/db";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export const dynamic = "force-dynamic";

const MessagesPage = async () => {
    const messages = await prisma.message.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            isDeleted: false,
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
                            }) => (
                                <TableRow key={id}>
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
                                        {message.slice(0, 100)}
                                        ...
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

                                    <Dialog>
                                        <DropdownMenu>
                                            <TableCell>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="p-1.5  h-min">
                                                        <DotsHorizontalIcon />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                            </TableCell>

                                            <DropdownMenuContent
                                                align="end"
                                                alignOffset={-15}>
                                                <DropdownMenuItem asChild>
                                                    <DialogTrigger className="w-full">
                                                        View
                                                    </DialogTrigger>
                                                </DropdownMenuItem>

                                                <DropdownMenuItem className="p-0">
                                                    <form
                                                        action={deleteMessage.bind(
                                                            null,
                                                            id
                                                        )}>
                                                        <button className="text-start w-full px-2 py-1.5">
                                                            Delete
                                                        </button>
                                                    </form>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <DialogContent className="w-[90%] max-w-7xl">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Message
                                                </DialogTitle>

                                                <DialogDescription>
                                                    Here&aposs; the message from{" "}
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
                                </TableRow>
                            )
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
