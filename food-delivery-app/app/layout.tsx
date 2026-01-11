import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Tabakh dziri - Traiteur Professionnel en Algérie",
  description: "Traiteur professionnel pour vos mariages et événements spéciaux en Algérie. Découvrez nos plats traditionnels et modernes.",
  keywords: ["traiteur algérie", "mariage algérie", "événements", "cuisine algérienne", "tabakh dziri", "catering"],
  authors: [{ name: "Tabakh Dziri" }],
  creator: "Tabakh Dziri",
  publisher: "Tabakh Dziri",

  // Favicons and App Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/logo.svg",
        color: "#1a5f3f",
      },
    ],
  },

  // Web App Manifest
  manifest: "/site.webmanifest",

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "Tabakh dziri - Traiteur Professionnel en Algérie",
    description: "Traiteur professionnel pour vos mariages et événements spéciaux en Algérie. Découvrez nos plats traditionnels et modernes.",
    url: "https://tabakh-dziri.com",
    siteName: "Tabakh dziri",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Tabakh dziri - Traiteur Professionnel",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Tabakh dziri - Traiteur Professionnel en Algérie",
    description: "Traiteur professionnel pour vos mariages et événements spéciaux en Algérie.",
    images: ["/logo.png"],
    creator: "@tabakhdziri",
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your verification codes when available)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased text-gray-900 transition-colors duration-300" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Tabakh dziri",
              url: "https://tabakh-dziri.com",
              logo: "https://tabakh-dziri.com/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+213-555-555-555",
                contactType: "customer service"
              }
            }),
          }}
        />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
