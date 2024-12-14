import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./app/lib/db";
import Resend from "next-auth/providers/resend"
import { sendVerificationRequest } from "./lib/sendVerificationsMail";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    Google,
    GitHub,
    Resend({
      from: "RK World <no-reply@rkworld.me>",
      sendVerificationRequest,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin", // Custom sign-in page

  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});