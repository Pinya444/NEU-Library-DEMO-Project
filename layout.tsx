// src/app/layout.tsx
// Root layout: loads Google Fonts, applies global CSS variables,
// wraps everything in the shared auth context.

import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets:  ["latin"],
  weight:   ["600", "700"],
  variable: "--font-playfair",
  display:  "swap",
});

const dmSans = DM_Sans({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display:  "swap",
});

export const metadata: Metadata = {
  title:       "NEU Library – Visitor System",
  description: "New Era University Library Visitor Management System",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
