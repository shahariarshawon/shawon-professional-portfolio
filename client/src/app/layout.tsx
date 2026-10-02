import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { siteConfig } from "@/constants/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
  // Only used for small code/label text; don't compete with the main fonts.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortName}`,
  },

  description: siteConfig.description,

  keywords: siteConfig.keywords,

  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url,
    },
  ],

  creator: siteConfig.author,
  publisher: siteConfig.author,

  applicationName: siteConfig.shortName,

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    locale: siteConfig.locale,
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },

  // Icons come from the file conventions in this folder (icon.svg, favicon.ico,
  // apple-icon.png), all rendered from the navbar BrandMark. Next.js appends a
  // content hash to the icon URLs, so a changed logo is never stuck in caches.

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06080f" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
  colorScheme: "dark light",
};

type TRootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: TRootLayoutProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author,
    url: siteConfig.url,
    jobTitle: "Senior Backend Developer & Software Engineer",
    knowsAbout: [
      "Backend Architecture",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Distributed Systems",
      "RESTful APIs",
      "Docker",
      "Redis",
    ],
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <AppProviders>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
