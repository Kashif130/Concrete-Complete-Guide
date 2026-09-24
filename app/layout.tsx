import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/lib/LocaleProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HelpChatBot } from "@/components/HelpChatBot";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

export const metadata: Metadata = {
  title: "Concrete — The Complete Guide",
  description:
    "An independent, community-written field guide to Concrete (concrete.xyz): vaults, yield, risk, tools and live on-chain data.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Concrete Guide",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#1F3A5F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Noto+Sans:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-paper font-body text-ink antialiased">
        <LocaleProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <HelpChatBot />
          <PwaInstallPrompt />
        </LocaleProvider>
      </body>
    </html>
  );
}
