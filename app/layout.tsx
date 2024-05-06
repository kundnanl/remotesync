import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "./components/pages/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remote Sync",
  description: "RemoteSync: Empowering Remote Teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className=
      {cn(
        "grainy",
        inter.className
      )}
      >
        {children}
        </body>
    </html>
    </ClerkProvider>
  );
}
