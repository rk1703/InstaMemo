import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import prisma from "@/app/lib/db";
import { Toaster } from "@/components/ui/sonner"
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstaMemo",
  description: "Handle Notes simply and beautifully",
};

async function getdata(userid: string) {
  if (userid) {
    const data = await prisma.user.findUnique({
      where: {
        id: userid,
      },
      select: {
        colorScheme: true,
      },
    });
    return data;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;
  const data = await getdata(user?.id as string);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${data?.colorScheme ?? 'theme-rose'}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > <Navbar />
          {children}
          <Toaster position="top-right" richColors/>
        </ThemeProvider></body>
    </html>
  );
}