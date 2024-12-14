"use client"

import { cn } from "@/lib/utils";
import { DoorClosed} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./UserNav";
import { handleSignOut } from "@/actions/auth";
import { Button } from "./ui/button";

export function DashboardNav() {
    const pathname = usePathname();
    return(
        <nav className="grid items-start gap-2">
            {navItems.map((item,index)=>(
                <Link key={index} href={item.href}>
                    <span className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href ? "bg-accent":"bg-transparent"
                    )}>
                        <item.icon className="mr-2 h-4 w-4 text-primary"/>
                        <span>{item.name}</span>
                    </span>
                </Link>
            ))}
            <form action={handleSignOut}>
                        <Button type="submit" variant={"destructive"} className="w-full justify-start px-3 py-2" size={"lg"}>
                            <span><DoorClosed className="h-4 w-4" /></span>
                            Logout
                        </Button>
                    </form>
        </nav>
    )
}