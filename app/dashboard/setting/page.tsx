import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { SubmitButton } from "@/components/SubmitButton";
import { revalidatePath } from "next/cache";

async function getuser(userid: string) {
    if (userid) {

        const user = await prisma.user.findUnique({
            where: {
                id: userid,
            },
            select: {
                name: true,
                email: true,
                colorScheme: true,
            }
        });

        return user;
    }
}

export default async function SettingPage() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const userData = await getuser(user?.id as string);

    async function updateData(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const theme = formData.get("color") as string;

        await prisma.user.update({
            where: {
                id: user?.id,
            },
            data: {
                name: name ?? undefined,
                colorScheme: theme ?? undefined,
            }
        });

        revalidatePath('/', "layout")

    }

    return (
        <div className="grid items-start gap-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl md:text-4xl">Settings</h1>
                    <p className="text-lg text-muted-foreground">Your Profile Settings</p>
                </div>
            </div>
            <Card>
                <form action={updateData}>
                    <CardHeader>
                        <CardTitle>General Data</CardTitle>
                        <CardDescription>Please Provide general information about your self. Please dont forget to save.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Your Name</Label>
                                <Input name="name" type="text" id="name" placeholder="your name" defaultValue={userData?.name ?? undefined} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Your Email</Label>
                                <Input name="email" type="email" id="email" placeholder="your email" disabled defaultValue={userData?.email ?? undefined} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="color">Color Scheme</Label>
                                <Select name="color" defaultValue={userData?.colorScheme}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a color theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Color Theme</SelectLabel>
                                            <SelectItem value="theme-green">Green</SelectItem>
                                            <SelectItem value="theme-blue">Blue</SelectItem>
                                            <SelectItem value="theme-violet">Violet</SelectItem>
                                            <SelectItem value="theme-yellow">Yellow</SelectItem>
                                            <SelectItem value="theme-orange">Orange</SelectItem>
                                            <SelectItem value="theme-red">Red</SelectItem>
                                            <SelectItem value="theme-rose">Rose</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton />
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}