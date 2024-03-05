import { SubmitButton } from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowLeftCircle } from "lucide-react";

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

export default async function DynamicRoute({ params }: { params: { id: string } }) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const data = await getData({ userId: user?.id as string, noteId: params?.id as string });

    return (
        <Card>
                <CardHeader>
                    <CardTitle>Your Note</CardTitle>
                    <CardDescription>Right here you can see your note</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5">
                    <div className="flex flex-col gap-y-2">
                        <Label>Title</Label>
                        <Input disabled type="text" name="title" placeholder="Title for your note" defaultValue={data?.title} />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Label>Description</Label>
                        <Textarea disabled name="description" required placeholder="Describe your note as you want" defaultValue={data?.description} />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button asChild>
                        <Link href="/dashboard"><ArrowLeftCircle className="h-4 w-4 mr-2"/> Back</Link>
                    </Button>
                </CardFooter>
        </Card>
    )
}