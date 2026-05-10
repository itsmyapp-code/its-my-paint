import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "itsmypaint | Professional Paint Job Manager",
  description: "High-performance PWA for painters and contractors.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-bg-base text-text-main`}
    >
      <body className="min-h-full flex flex-col bg-bg-base">
        {/* We can add a global header here or leave it to page.tsx, let's leave it to page for now or add a global layout shell */}
        {children}
      </body>
    </html>
  );
}
