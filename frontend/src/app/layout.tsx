import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackSage — AI-Powered Project Planning",
  description:
    "Plan, build, and deploy any project with AI-powered blueprints, agent prompts, and repo-to-text conversion. Hardware-aware recommendations powered by RAG.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <ClerkProvider>
        <body className={`${inter.variable} font-sans antialiased`}>
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
