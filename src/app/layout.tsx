import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hearts by Charming | Referral Challenge 2026",
  description: "Join the Hearts by Charming Referral Challenge. Share, earn rewards, and make a difference in youth development.",
  keywords: ["referral", "challenge", "hearts by charming", "NGO", "youth", "development", "Nigeria"],
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "Hearts by Charming | Referral Challenge 2026",
    description: "Join the Hearts by Charming Referral Challenge. Share, earn rewards, and make a difference.",
    url: "https://heartsbycharming.org",
    siteName: "Hearts by Charming",
    locale: "en_NG",
    type: "website",
    images: ["/assets/logo/logo-horizontal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-brown-dark antialiased">
        {children}
      </body>
    </html>
  );
}
