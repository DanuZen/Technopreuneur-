import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SplashScreen } from "@/components/ui/splash-screen";

export const metadata: Metadata = {
  title: "Pasbana AI: Evaluasi CV & Rekomendasi Karir Presisi",
  description: "Pasbana (bahasa Minang: 'sangat pas'): Platform evaluasi kualitas CV dan pencocokan lowongan kerja cerdas untuk fresh graduate dan talenta muda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased text-primary bg-[#fefefd] min-h-screen flex flex-col justify-between">
        <SplashScreen />
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

