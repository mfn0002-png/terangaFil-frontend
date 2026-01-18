import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import ThemeManager from "@/components/ThemeManager";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Teranga-Fil | Marketplace de Mercerie Sénégalaise",
  description: "La première plateforme multi-boutiques dédiée à la couture et au crochet au Sénégal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Providers>
          <ThemeManager />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <ThemeSwitcher />
        </Providers>
      </body>
    </html>
  );
}
