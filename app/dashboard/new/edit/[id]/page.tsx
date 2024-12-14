import { SubmitButtonSave } from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

type Params = Promise<{ id: string }>

async function getData({ userId, noteId }: { userId: string, noteId: string }) {
    const data = await prisma.note.findUnique({
        where: {
            id: noteId,
            userId: userId,
        },
        select: {
            title: true,
            description: true,
            id: true,
        }
    });

    return data;
}

export default async function DynamicRoute(props: {
    params: Params
}) {
    const params = await props.params
    const id = params.id
    const session = await auth();
    const user = session?.user;
    const data = await getData({ userId: user?.id as string, noteId: id as string });

    async function postData(formData: FormData) {
        "use server"
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        await prisma.note.update({
            where: {
                id: data?.id,
                userId: user?.id,
            },
            data: {
                title: title,
                description: description,
            }
        });
        revalidatePath("/dashboard")
        return redirect('/dashboard')
    }

    return (
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>Edit Note</CardTitle>
                    <CardDescription>Right here you can edit your notes</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <div className="flex flex-col gap-y-2">
                        <Label>Title</Label>
                        <Input required type="text" name="title" placeholder="Title for your note" defaultValue={data?.title} />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" required placeholder="Describe your note as you want" defaultValue={data?.description} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button asChild variant="destructive">
                        <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <SubmitButtonSave />
                </CardFooter>
            </form>
        </Card>
    )
}