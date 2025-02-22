import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { JSX } from "react";
import { Providers } from "./providers";
import { Sidebar } from "@/components/Sidebar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className="bg-[#ebe6e6]">
     
      <Providers>
        <body className={`${geistSans.variable} ${geistMono.variable}`}  >
          <div className="min-w-screen min-h-screen flex">
            <Sidebar />
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
