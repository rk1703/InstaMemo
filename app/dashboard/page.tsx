import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "../lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Edit, File, Menu, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import { TrashButton } from "@/components/SubmitButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

async function getData(userId: string) {
    const data = await prisma.note.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        }
    })

    return data;
}

export default async function DashboardPage() {

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const data = await getData(user?.id as string);

    async function deleteNote(formData: FormData) {
        "use server"
        const noteId = formData.get('noteId') as string;

        await prisma.note.delete({
            where: {
                id: noteId,
            }
        });

        revalidatePath('/dashboard');
    }

    return (
        <div className="grid items-start gap-y-6">
            <div className="flex items-center flex-col space-y-6 md:space-y-0  md:flex-row justify-between md:px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl text-center md:text-left md:text-4xl">Your Notes</h1>
                    <p className="text-base md:text-lg text-muted-foreground">Here you can see and create new notes</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/new">Create a new note</Link>
                </Button>
            </div>
            {data.length < 1 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <File className="h-10 w-10 text-primary" />
                    </div>

                    <h2 className="mt-6 text-xl font-semibold">You dont have any notes created</h2>
                    <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">You currently dont have any notes. Please create some so that you can see them right here.</p>
                    <Button asChild>
                        <Link href="/dashboard/new">Create a new note</Link>
                    </Button>

                </div>
            ) : (
                <div className="flex flex-col gap-y-4 pb-4">
                    {data.map((note, index) => (
                        <Card key={index} className="items-center justify-between flex p-4">
                            <div>
                                <h2 className="font-semibold text-xl text-primary">{note.title}</h2>
                                <p>{new Intl.DateTimeFormat("en-US", {
                                    dateStyle: "full",
                                }).format(new Date(note.createdAt))}</p>
                            </div>
                            <div className="hidden md:flex gap-x-4">
                                <Link href={`/dashboard/new/open/${note.id}`}>
                                    <Button>
                                        Open
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/new/edit/${note.id}`}>
                                    <Button variant="outline" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>

                                <form action={deleteNote}>
                                    <input type="hidden" name="noteId" value={note.id} />
                                    <TrashButton />
                                </form>
                            </div>
                            <div className="flex md:hidden">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Menu className="h-10 w-10 rounded-full p-2 bg-primary" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="center" forceMount>
                                        <DropdownMenuGroup>
                                            <div className="flex justify-center items-center gap-x-1">
                                                <Link href={`/dashboard/new/open/${note.id}`}>
                                                    <Button size={"sm"}>
                                                        Open
                                                    </Button>
                                                </Link>
                                                <Link href={`/dashboard/new/edit/${note.id}`}>
                                                    <Button variant="outline" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>

                                                <form action={deleteNote}>
                                                    <input type="hidden" name="noteId" value={note.id} />
                                                    <TrashButton />
                                                </form>
                                            </div>
                                        </DropdownMenuGroup>

                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}