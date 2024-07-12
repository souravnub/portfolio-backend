import LoginForm from "@/components/client/LoginForm";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function LoginPage() {
    return (
        <div className="container max-w-2xl pt-20">
            <Card>
                <CardHeader className="space-y-2">
                    <CardTitle>Login to portfolio manager</CardTitle>
                    <CardDescription>
                        This is the official portfolio manager for{" "}
                        <Link
                            href="https://know-sourav.netlify.app"
                            className="underline hover:text-primary">
                            https://know-sourav.netlify.app
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
