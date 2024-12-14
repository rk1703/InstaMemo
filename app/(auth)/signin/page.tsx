"use client"
 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { startTransition, useActionState, useEffect } from 'react';
import { handleSignInWithResend, handleSignInWithGithub, handleSignInWithGoogle } from "@/actions/auth"
import {SubmitButton} from "@/components/SubmitButton"
import { Loader } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const initialState = {
    error: {emailError:'',serverError:''},
    status: ''
}

export type SignInState = typeof initialState;

export default function LoginForm() {
    const [stateResend, formActionResend, isPendingResend] = useActionState(handleSignInWithResend, initialState)

    useEffect(() => {
        if (stateResend.error?.serverError) {
            toast.error(`${stateResend.error.serverError}`,{
                duration:4000,
            })
        }
    }, [stateResend])


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default browser submission

        const formData = new FormData(event.currentTarget); // Extract form data

        startTransition(() => {
            formActionResend(formData)
        });
    }


    return (
        <div className="flex w-full items-center justify-center px-4 py-20 md:py-6">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <form
                            onSubmit={handleSubmit}
                            className="grid gap-2"
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" name="email" id="email" placeholder="Email" required />
                                {stateResend.error && <p className="text-red-500 text-sm ml-2 -mt-1">{stateResend.error?.emailError}</p>}
                                <Button type="submit" disabled={isPendingResend}>{isPendingResend ? <><Loader className="animate-spin h-5 w-5" /> Sending Link...</> : "Login with Email"}</Button>
                            </div>
                        </form>
                        <div className="relative py-1">
                            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 dark:bg-[#1C1917] bg-white">OR</p>
                            <p className="h-[1px] w-full border-[1px] border-muted-foreground" />
                        </div>
                        <form action={handleSignInWithGithub}
                        >
                            <SubmitButton name="Login with Github" />
                        </form>
                        <form action={handleSignInWithGoogle}
                        >
                            <SubmitButton name="Login with Google" />
                        </form>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Register
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}