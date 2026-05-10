import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Link from "next/link";
import { AuthProvider } from "@/contexts/AuthContext";

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
        <AuthProvider>
          <div className="flex-grow">
            {children}
          </div>

          <footer className="w-full border-t border-border-subtle py-8 mt-auto bg-bg-panel">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-text-muted text-sm">&copy; {new Date().getFullYear()} itsmypaint. All rights reserved.</p>
              <div className="flex gap-6 text-sm text-text-muted">
                <Link href="/terms" className="hover:text-brand transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-brand transition-colors">Privacy</Link>
                <Link href="/cookies" className="hover:text-brand transition-colors">Cookies</Link>
                <Link href="/accessibility" className="hover:text-brand transition-colors">Accessibility</Link>
              </div>
            </div>
          </footer>
          
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
