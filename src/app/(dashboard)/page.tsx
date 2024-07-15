import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Dashboard() {
    const session = await auth();
    // console.log(session);
    return (
        <main>
            <h1>hello</h1>
            <Button>Hello world</Button>
        </main>
    );
}
