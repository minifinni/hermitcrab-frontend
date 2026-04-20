import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hermitcrab — Expert Brains for AI",
  description: "Browse expert brains built by creators. Get opinionated AI guidance from experts you trust. Stay sharp.",
  keywords: ["AI brains", "expert brains", "OpenClaw", "brain marketplace", "expert knowledge"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>

      <body className="bg-[#0d0f14] text-gray-200 antialiased font-body min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
