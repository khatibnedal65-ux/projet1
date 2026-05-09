import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MÉCA DRIVE – Garage Auto Vauxbuin / Soissons",
  description:
    "Ton garage de confiance. Spécialiste Entretien & Réparation Auto. Ouvert 7j/7 de 08h00 à 19h00 NON-STOP. Pneus, Vidange, Freinage, Distribution. Forfait Distribution à 380€.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
