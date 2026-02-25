import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavSidebar from "@/components/NavSidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Meeting Intelligence Hub",
  description: "Make Dylan's meetings smarter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>
        <div className="min-h-screen text-textPrimary">
          <NavSidebar />
          <main className="pb-24 pt-8 md:pl-64 md:pr-10 px-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
