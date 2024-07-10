export { default } from "next-auth/middleware";

// adds authentication to each and every page
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
