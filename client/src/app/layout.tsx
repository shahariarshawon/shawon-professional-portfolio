import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/constants/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortName}`
  },

  description: siteConfig.description,

  keywords: siteConfig.keywords,

  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url
    }
  ],

  creator: siteConfig.author,
  publisher: siteConfig.author,

  applicationName: siteConfig.shortName,

  alternates: {
    canonical: siteConfig.url
  },

  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    locale: siteConfig.locale,
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@shawon"
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },

  category: "technology"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#11172a",
  colorScheme: "dark light"
};

type TRootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: TRootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}