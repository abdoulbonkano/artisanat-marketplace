import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - L'artisanat, sans intermediaire`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Marketplace dediee a l'artisanat fait main : achetez en direct aupres de createurs independants, ou ouvrez votre propre boutique.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - L'artisanat, sans intermediaire`,
    description:
      "Achetez en direct aupres de createurs independants, ou ouvrez votre propre boutique d'artisanat.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - L'artisanat, sans intermediaire`,
    description:
      "Achetez en direct aupres de createurs independants, ou ouvrez votre propre boutique d'artisanat.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
