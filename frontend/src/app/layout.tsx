import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "CareerMatch AI — Analisis CV & Rekomendasi Karir Presisi",
  description: "Platform analisis kualitas CV berbasis AI dan pencocokan lowongan kerja cerdas untuk fresh graduate dan profesional muda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

