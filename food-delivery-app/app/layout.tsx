import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Tabakh dziri - Traiteur Professionnel en Algérie",
  description: "Traiteur professionnel pour vos mariages et événements spéciaux en Algérie. Découvrez nos plats traditionnels et modernes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased text-gray-900 transition-colors duration-300" suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
