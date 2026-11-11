import Link from "next/link";
import { Compass, Users, Shield, Cpu } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Tentang CareerMatch AI
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Platform bimbingan karir dan pencocokan lowongan kerja cerdas yang dikembangkan sebagai proyek Technopreneurship 2026.
        </p>
      </header>

      {/* Mission & Problem Statement */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Compass className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Misi Kami</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Menjembatani kesenjangan antara fresh graduate dan industri kerja melalui analisis kualitas resume yang objektif serta rekomendasi lowongan kerja yang transparan.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Komitmen Privasi (UU PDP)</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kami mengimplementasikan prinsip sanitasi data pribadi (PII masking) sebelum teks diproses oleh model evaluasi, dan memberikan hak penuh kepada pengguna untuk menghapus berkas kapan saja.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <h2 className="text-xl font-bold text-slate-900">Tim Pengembang</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900 text-sm">Wira Fikri Ramadanu</p>
            <p className="text-xs text-blue-600 font-semibold">Frontend Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23343023</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900 text-sm">Muhammad Gilang Ramadhan</p>
            <p className="text-xs text-blue-600 font-semibold">Backend Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23346013</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-bold text-slate-900 text-sm">Florensius Panca Gati</p>
            <p className="text-xs text-blue-600 font-semibold">Backend AI Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23343006</p>
          </div>
        </div>
      </section>

      {/* Technical Architecture Summary */}
      <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
          <Cpu className="w-4 h-4 text-slate-700" aria-hidden="true" />
          <span>Arsitektur Bebas Biaya Operasional (Zero Budget Strategy)</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Aplikasi ini dibangun menggunakan arsitektur modern berbiaya Rp 0: Next.js pada Vercel Hobby, Express API pada Node.js, FastAPI untuk AI microservice, database PostgreSQL dengan pgvector di Supabase Free Tier, dan model Google Gemini Free Tier.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </section>
    </main>
  );
}
