import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Tabakh Dziri - طباخ جزايري | Traiteur Professionnel en Algérie",
  description: "Tabakh Dziri - طباخ جزايري: Traiteur professionnel pour vos mariages, événements et fêtes en Algérie. Cuisine algérienne traditionnelle et moderne. Livraison disponible.",
  keywords: [
    "tabakh dziri", "طباخ جزايري", "tabakh djazayri", "tabakhedjazayri",
    "traiteur algérie", "traiteur alger", "mariage algérie",
    "événements algérie", "cuisine algérienne", "plats algériens",
    "catering algérie", "livraison repas", "couscous", "tajine",
    "food delivery algeria", "restaurant algérien"
  ],
  authors: [{ name: "Tabakh Dziri" }],
  creator: "Tabakh Dziri",
  publisher: "Tabakh Dziri",
  metadataBase: new URL('https://tabakhdziri.com'),
  alternates: {
    canonical: 'https://tabakhdziri.com',
  },

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
    title: "Tabakh Dziri - طباخ جزايري | Traiteur Professionnel",
    description: "Tabakh Dziri - طباخ جزايري: Traiteur professionnel pour vos mariages, événements et fêtes en Algérie. Cuisine algérienne traditionnelle et moderne.",
    url: "https://tabakhdziri.com",
    siteName: "Tabakh Dziri",
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
    title: "Tabakh Dziri - طباخ جزايري | Traiteur Professionnel",
    description: "Tabakh Dziri - طباخ جزايري: Traiteur professionnel en Algérie. Cuisine algérienne traditionnelle et moderne.",
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
              "@type": "FoodEstablishment",
              name: "Tabakh Dziri - طباخ جزايري",
              alternateName: "Tabakh Djazayri",
              url: "https://tabakhdziri.com",
              logo: "https://tabakhdziri.com/logo.png",
              image: "https://tabakhdziri.com/logo.png",
              description: "Traiteur professionnel pour mariages et événements en Algérie",
              servesCuisine: "Algerian",
              priceRange: "$$",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+213560604172",
                contactType: "customer service",
                availableLanguage: ["French", "Arabic"]
              },
              address: {
                "@type": "PostalAddress",
                addressCountry: "DZ",
                addressLocality: "Algérie"
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
