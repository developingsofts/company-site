import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { site } from "@/content/site";
import { Providers } from "./providers";
import "./globals.css";

// The opsz axis lets fontWeights pair heavier weights with a tighter optical
// size, so labels that change weight keep their width.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
