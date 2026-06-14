import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GratisCode — Premium AI coding models, free for Indian builders",
  description:
    "GratisCode is a sponsored AI coding client for Indian students, indie hackers, and early-career developers. Sponsor-funded ads cover the model bill so users can focus on shipping.",
  keywords: ["AI coding", "free", "India", "developers", "students", "DeepSeek", "waitlist"],
  authors: [{ name: "GratisCode" }],
  metadataBase: new URL("https://gratiscode.in"),
  openGraph: {
    title: "GratisCode — Premium AI coding models, free for Indian builders",
    description:
      "GratisCode is a sponsored AI coding client for Indian students, indie hackers, and early-career developers.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "GratisCode — Premium AI coding models, free for Indian builders",
    description:
      "GratisCode is a sponsored AI coding client for Indian students, indie hackers, and early-career developers.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
