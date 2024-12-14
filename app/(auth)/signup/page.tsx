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
import { handleSignUpWithResend, handleSignInWithGithub, handleSignInWithGoogle } from "@/actions/auth"
import { toast } from "sonner"
import {SubmitButton} from "@/components/SubmitButton"
import { Loader } from "lucide-react"
import { Label } from "@/components/ui/label"

const initialState = {
    error: { nameError: '', emailError: '', generalError: '' },
    status: ''
}

export type SignUpState = typeof initialState;

export default function LoginForm() {
    const [stateResend, formActionResend, isPendingResend] = useActionState(handleSignUpWithResend, initialState)

    useEffect(() => {
        if (stateResend.error?.generalError) {
            toast.error(`${stateResend.error?.generalError}`, {
                duration: 5000,
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
                    <CardTitle className="text-2xl text-center">Register</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <form
                            onSubmit={handleSubmit} className="grid gap-4"
                        >
                            <div className="grid gap-1">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Ravikant Baghel"
                                    required
                                />
                                {stateResend.error?.nameError && <p className="text-red-500 text-sm ml-2">{stateResend.error?.nameError}</p>}
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" name="email" id="email" placeholder="Email" required />

                                {stateResend.error?.emailError && <p className="text-red-500 text-sm ml-2">{stateResend.error?.emailError}</p>}
                            </div>
                            <Button type="submit" disabled={isPendingResend}>{isPendingResend ? <><Loader className="animate-spin h-5 w-5" /> Sending Link...</> : "Register with Email"}</Button>
                        </form>
                        <div className="relative py-1">
                            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 dark:bg-[#1C1917] bg-white">OR</p>
                            <p className="h-[1px] w-full border-[1px] border-muted-foreground" />
                        </div>
                        <form action={handleSignInWithGithub}
                        >
                            <SubmitButton name="Register with Github" />
                        </form>
                        <form action={handleSignInWithGoogle}
                        >
                            <SubmitButton name="Register with Google" />
                        </form>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/signin" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

