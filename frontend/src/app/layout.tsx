import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { SplashScreen } from "@/components/ui/splash-screen";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pasbana AI: Evaluasi CV & Rekomendasi Karir Presisi",
  description: "Pasbana (bahasa Minang: 'sangat pas'): Platform evaluasi kualitas CV dan pencocokan lowongan kerja cerdas untuk fresh graduate dan talenta muda.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased text-primary bg-[#fefefd] min-h-screen">
        <SplashScreen />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
