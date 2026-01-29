import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VG Control Tower",
  description: "Venture Global LNG command center dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
        <MobileNav />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1">
            <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_85%_20%,rgba(249,115,22,0.12),transparent_35%),radial-gradient(circle_at_30%_80%,rgba(20,184,166,0.12),transparent_40%)]" />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
