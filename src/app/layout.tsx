import type { Metadata } from "next";
import { Geist, Geist_Mono, Geist_Pixel } from "next/font/google";
import { site } from "@/content/site";
import { Providers } from "./providers";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const geistPixel = Geist_Pixel({
  variable: "--font-geist-pixel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${geistPixel.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
