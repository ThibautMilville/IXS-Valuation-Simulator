import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FallingAsh } from "@/components/ui/FallingAsh";
import { absoluteUrl, getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription = "IXS token valuation and price simulator";
const ogImageUrl = absoluteUrl("/api/og");

export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
  title: "IXS Valuation Simulator",
  description: siteDescription,
  openGraph: {
    title: "IXS Valuation Simulator",
    description: siteDescription,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "IXS Valuation Simulator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IXS Valuation Simulator",
    description: siteDescription,
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col text-zinc-100">
        <FallingAsh connectDistance={125} />
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
