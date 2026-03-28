import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { FallingAsh } from "@/components/ui/FallingAsh";
import { getPublicSiteUrl } from "@/lib/site-url";
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

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-host");
  const hostRaw = (forwarded ?? h.get("host") ?? "").split(",")[0]?.trim() ?? "";
  const base =
    hostRaw.length > 0
      ? (() => {
          const protoHeader = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
          const isLocal =
            hostRaw.startsWith("127.") ||
            hostRaw.startsWith("localhost") ||
            hostRaw.startsWith("192.168.");
          const scheme =
            protoHeader === "http" || (isLocal && !protoHeader)
              ? "http"
              : "https";
          return `${scheme}://${hostRaw}`;
        })()
      : getPublicSiteUrl();
  const ogImageUrl = `${base}/og.png`;
  const userAgent = h.get("user-agent") ?? "";

  console.log("[ixs:metadata]", {
    host: hostRaw || null,
    "x-forwarded-host": forwarded ?? null,
    "x-forwarded-proto": h.get("x-forwarded-proto") ?? null,
    fallbackBase: hostRaw.length === 0 ? getPublicSiteUrl() : null,
    resolvedBase: base,
    ogImageUrl,
    userAgentPreview: userAgent.slice(0, 120),
  });

  return {
    metadataBase: new URL(base),
    title: "IXS Valuation Simulator",
    description: siteDescription,
    openGraph: {
      title: "IXS Valuation Simulator",
      description: siteDescription,
      type: "website",
      url: `${base}/`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "IXS Valuation Simulator",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "IXS Valuation Simulator",
      description: siteDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "IXS Valuation Simulator",
          type: "image/png",
        },
      ],
    },
  };
}

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
