"use client"

import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"
import { Loader2, Trash, Loader } from "lucide-react"

export function SubmitButtonSave() {
    const { pending } = useFormStatus()
    return (
        <>
            {pending ? (
                <Button disabled className="w-fit">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                </Button>
            ) : (
                <Button className="w-fit" type="submit">Save Now</Button>
            )}
        </>
    )
}

export function TrashButton() {
    const { pending } = useFormStatus()
    return (
        <>
            {pending ? (
                <Button variant="destructive" size="icon" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
            ) : (
                <Button variant="destructive" size="icon" type="submit">
                    <Trash className="h-4 w-4" />
                </Button>
            )}
        </>
    )
}

export function SubmitButton({ name }: { name: string }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="w-full"
        >
            
            {pending ? <><Loader className="animate-spin h-5 w-5"/> Signing In...</> : <>{name}</>}
        </Button>
    )
}