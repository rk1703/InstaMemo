import { SubmitButtonSave } from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/db";
import { auth } from "@/auth";

export default async function CreateNote() {
    const session = await auth();
    const user = session?.user;
    async function postData(formData: FormData) {
        "use server"
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        if (!user) {
            throw new Error("Not Authorized")
        }

        await prisma.note.create({
            data: {
                title: title,
                description: description,
                userId: user?.id,
            }
        });

        return redirect("/dashboard");
    }
    return (
        <Card>
            <form action={postData}>
                <CardHeader>
                    <CardTitle>New Note</CardTitle>
                    <CardDescription>Right here you can now create your notes</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <div className="flex flex-col gap-y-2">
                        <Label>Title</Label>
                        <Input required type="text" name="title" placeholder="Title for your note" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" required placeholder="Describe your note as you want" />
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
    );
}