"use server";

import { signIn, signOut } from "@/auth";
import { SignInState } from "../app/(auth)/signin/page";
import { signInWithResendSchema, signUpWithResendSchema } from "@/lib/zod";
import prisma from "@/app/lib/db";
import { SignUpState } from "../app/(auth)/signup/page";

export async function handleSignInWithResend(
  prevState: SignInState,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const validateForm = signInWithResendSchema.safeParse({ email });
  if (!validateForm.success) {
    let emailError = "";
    validateForm.error.errors.forEach((err) => {
      if (err.path[0] === "email") emailError = err.message;
    });
    return {
      ...prevState,
      error: { emailError, serverError: "" },
      status: "failure",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        ...prevState,
        error: {
          emailError: "",
          serverError: "Please! Signup First with Email",
        },
        status: "failure",
      };
    }
    if (!user?.emailVerified) {
      return {
        ...prevState,
        error: { emailError: "", serverError: "Please! Check your Email for Verification Link" },
        status: "failure",
      };
    }
  } catch (error) {
    return {
      ...prevState,
      error: { emailError: "", serverError: "Sorry! We face Error at our Servers" },
      status: "failure",
    };
  }
  await signIn("resend", formData);
  return { ...prevState, status: "success" };
}

export async function handleSignInWithGithub() {
  await signIn("github", { redirectTo: "/dashboard" });
}

export async function handleSignInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function handleSignUpWithResend(
  prevState: SignUpState,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const validateForm = signUpWithResendSchema.safeParse({ email, name });
  if (!validateForm.success) {
    const error: {
      emailError: string;
      nameError: string;
      generalError: string;
    } = {
      emailError: "",
      nameError: "",
      generalError: "",
    };
    validateForm.error.errors.forEach((err) => {
      if (err.path[0] === "email") error.emailError = err.message;
      if (err.path[0] === "name") error.nameError = err.message;
    });

    return { ...prevState, error, status: "failure" };
  }
  try {
    const prevUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!prevUser) {
      await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    } else {
      return {
        ...prevState,
        error: {
          emailError: "",
          nameError: "",
          generalError: "An User is Already Exists with this Email",
        },
        status: "failure",
      };
    }
  } catch (error) {
    return {
      ...prevState,
      error: {
        emailError: "",
        nameError: "",
        generalError: "Sorry! We face Error at our Servers",
      },
      status: "failure",
    };
  }
  await signIn("resend", formData);
  return {
    ...prevState,
    status: "success",
  };
}

export async function handleSignOut(){
  await signOut();
}