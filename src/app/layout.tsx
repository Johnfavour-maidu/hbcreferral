import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hearts by Charming | Referral Challenge 2026",
  description: "Join the Hearts by Charming Referral Challenge. Share, earn rewards, and make a difference in youth development.",
  keywords: ["referral", "challenge", "hearts by charming", "NGO", "youth", "development", "Nigeria"],
  openGraph: {
    title: "Hearts by Charming | Referral Challenge 2026",
    description: "Join the Hearts by Charming Referral Challenge. Share, earn rewards, and make a difference.",
    url: "https://heartsbycharming.org",
    siteName: "Hearts by Charming",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hearts by Charming | Referral Challenge 2026",
    description: "Join the Hearts by Charming Referral Challenge. Share, earn rewards, and make a difference.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-chocolate antialiased">
        {children}
      </body>
    </html>
  );
}
