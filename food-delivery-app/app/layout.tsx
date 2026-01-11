import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Tabakh dziri - Traiteur Professionnel en Algérie",
  description: "Traiteur professionnel pour vos mariages et événements spéciaux en Algérie. Découvrez nos plats traditionnels et modernes.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Tabakh dziri - Traiteur Professionnel en Algérie",
    description: "Traiteur professionnel pour vos mariages et événements spéciaux en Algérie. Découvrez nos plats traditionnels et modernes.",
    url: "https://tabakh-dziri.com", // Replacement URL or generic if not known, but usually required for OG. I'll omit URL if not known to avoid broken links, or use a placeholder if necessary. Better to just set images.
    siteName: "Tabakh dziri",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Tabakh dziri Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tabakh dziri - Traiteur Professionnel en Algérie",
    description: "Traiteur professionnel pour vos mariages et événements spéciaux en Algérie.",
    images: ["/logo.png"],
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
