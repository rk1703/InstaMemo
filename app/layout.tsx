import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import prisma from "./lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstaMemo",
  description: "Handle Notes simply and beautifully",
};

async function getdata(userid: string) {
  if(userid){
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
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getdata(user?.id as string);

  return (
    <html lang="en">
      <body className={`${inter.className} ${data?.colorScheme ?? 'theme-orange'}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > <Navbar />
          {children}
        </ThemeProvider></body>
    </html>
  );
}
