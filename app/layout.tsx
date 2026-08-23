import type { Metadata } from "next";
import { Bitter, Karla, Space_Mono } from "next/font/google";
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";
import { CookieBanner } from "@/components/cookie-banner";
import { InlineScript } from "@/components/inline-script";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
      suppressHydrationWarning
      className={`${karla.variable} ${spaceMono.variable} ${bitter.variable} h-full antialiased`}
    >
      <head>
        <InlineScript
          html={`(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
          }}
        />
        {children}
        <ChatbotWidget />
        <CookieBanner />
      </body>
    </html>
  );
}
