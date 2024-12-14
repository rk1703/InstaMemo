import { DashboardNav } from "@/components/DashboardNav";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
// import prisma from "../lib/db";
import { auth } from "@/auth";



export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const session = await auth();
    if (!session?.user) {
        return redirect('/')
    }

    // await getData({ email: session?.user.email as string, id: session?.user.id as string, name: session?.user.name, profileImage: session?.user.image })


    return (
        <div className="flex flex-col space-y-6 mt-10">
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-[200px] flex-col md:flex">
                    <DashboardNav />
                </aside>
                <main>{children}</main>
            </div>
        </div>

    )
}