import { z } from "zod";

// Example usage
export const signInWithResendSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
});

export const signUpWithResendSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  name: z.string().min(3,"Please Enter Valid Name").trim()
});

