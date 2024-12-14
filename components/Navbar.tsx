import Link from "next/link";
import { ThemeToggle } from "./themeToogle";
import { Button } from "./ui/button";
import { UserNav } from "./UserNav";
import { auth } from "@/auth";
export const dynamic = 'force-dynamic'
export async function Navbar() {
    const session = await auth();
    const user = session?.user;
    return (
        <nav className="border-b bg-background h-[10vh] flex items-center">
            <div className="container flex items-center justify-between">
                <Link href="/">
                    <h1 className="font-bold text-3xl">Insta<span className="text-primary">Memo</span></h1>
                </Link>

                <div className="flex items-center gap-x-5">
                    <ThemeToggle />
                    {(session?.user) ? (
                        <>
                            <UserNav name={user?.name as string} email={user?.email as string} profile_pic={user?.image as string} />
                        </>
                    ) : (
                        <div className="flex items-center gap-x-5">
                            <Link href="/signin">
                                <Button>Sign In</Button>
                            </Link>
                            <Link href="/signup" className="hidden md:inline-flex">
                                <Button>Sign Up</Button>
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}