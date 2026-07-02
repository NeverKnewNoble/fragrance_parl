import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/alert";
import { SessionProvider } from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fragrance Parl — Maison de Parfum",
  description:
    "An apothecary of curated fragrances. Eaux de parfum, extraits, and travel sizes — composed for those who keep late hours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} ${cormorant.variable} antialiased bg-ink text-vellum`}
      >
        <SessionProvider>
          <Toaster />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
