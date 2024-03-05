
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { CreditCard, DoorClosed, Home, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";


export const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Setting", href: "/dashboard/setting", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard }
]


export async function UserNav({first_name,last_name,email,profile_pic}:{first_name:string,last_name:string,email:string,profile_pic:string}) {
    const default_profile_pic = first_name.charAt(0).toUpperCase() + last_name.charAt(0).toUpperCase();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 rounded-full">
                        <AvatarImage src={profile_pic} alt="user" />
                        <AvatarFallback>{default_profile_pic}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="center" forceMount>
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{first_name} {last_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {navItems.map((item, index) => (
                        <DropdownMenuItem asChild key={index}>
                            <Link key={index} href={item.href} className="w-full flex justify-between items-center">
                                {item.name}
                                <span><item.icon className="h-4 w-4" /></span>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full flex justify-between items-center" asChild>
                    <LogoutLink>
                        Logout
                        <span><DoorClosed className="h-4 w-4" /></span>
                    </LogoutLink>

                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}