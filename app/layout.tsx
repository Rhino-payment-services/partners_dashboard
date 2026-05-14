import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "RukaPay Partners Dashboard",
  description: "RukaPay Partners Dashboard - Manage your payments, transactions, and business operations",
  keywords: ["RukaPay", "Partners", "Dashboard", "Payments", "Transactions", "Business", "Operations"],
  authors: [{ name: "RukaPay Limited" }],
  creator: "RukaPay Limited",
  publisher: "RukaPay Limited",
  robots: "index, follow",
  openGraph: {
    title: "RukaPay Partners Dashboard",
    description: "RukaPay Partners Dashboard - Manage your payments, transactions, and business operations",
    type: "website",
    locale: "en_US",
    siteName: "RukaPay Partners Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "RukaPay Partners Dashboard",
    description: "RukaPay Partners Dashboard - Manage your payments, transactions, and business operations",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className} bg-[#f7f7f7] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

