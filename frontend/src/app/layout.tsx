import type { Metadata } from "next";
import "./globals.css";

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
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}

