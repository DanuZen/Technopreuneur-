import Link from "next/link";
import { Compass, Users, Shield, Cpu, Sparkles, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="max-w-[1400px] w-full mx-auto px-4 py-12 sm:px-6 lg:px-10 space-y-12 animate-fade-in-up">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span>Proyek Technopreneurship 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary">
          Tentang Pasbana AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Platform bimbingan karir dan pencocokan lowongan kerja presisi berbasis kecerdasan buatan, dirancang untuk menghubungkan talenta muda dengan industri secara adil dan transparan.
        </p>
      </header>

      {/* Brand Philosophy Section: Pasbana */}
      <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
            <span>Filosofi &amp; Asal-Usul Nama</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-primary">
            Dari Bahasa Minang &quot;Pas Bana&quot;: Sangat Pas, Sangat Cocok
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-slate-700 leading-relaxed">
          <p className="text-justify">
            <strong className="text-primary font-semibold">Pasbana</strong> berasal dari ungkapan bahasa Minang <em className="text-primary font-medium">&quot;pas bana&quot;</em> yang berarti <em className="text-primary font-medium">&quot;sangat pas&quot;</em> atau <em className="text-primary font-medium">&quot;sangat cocok&quot;</em>. Filosofi ini menjadi inti dari setiap solusi yang kami hadirkan: mempertemukan potensi terbaik pencari kerja dengan kebutuhan spesifik perusahaan secara presisi.
          </p>
          <p className="text-justify">
            Melalui analisis CV cerdas berbasis AI, Pasbana membantu talenta memahami kekuatan diri, memperbaiki celah keterampilan (skill gap), dan menemukan peluang karir yang benar-benar sesuai, bukan sekadar melamar secara acak. Di sisi lain, Pasbana memastikan perusahaan mendapatkan kandidat yang paling relevan tanpa membuang waktu menyaring ratusan berkas yang tidak sesuai. Karena bagi kami, karir yang baik dimulai dari pertemuan yang pas bana.
          </p>
        </div>
      </section>

      {/* Mission & Problem Statement */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Compass className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-primary">Misi Kami</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Menjembatani kesenjangan antara fresh graduate dan industri kerja melalui analisis kualitas resume yang objektif 5 dimensi serta rekomendasi lowongan kerja yang transparan.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-primary">Komitmen Privasi (UU PDP No. 27/2022)</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kami mengimplementasikan prinsip sanitasi data pribadi (PII masking) sebelum teks diproses oleh model evaluasi, dan memberikan hak penuh kepada pengguna untuk menghapus berkas kapan saja.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-bold text-primary">Tim Pengembang</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-bold text-primary text-sm">Wira Fikri Ramadanu</p>
            <p className="text-xs text-[#ce2731] font-semibold">Frontend Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23343023</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-bold text-primary text-sm">Muhammad Gilang Ramadhan</p>
            <p className="text-xs text-[#ce2731] font-semibold">Backend Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23346013</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-bold text-primary text-sm">Florensius Panca Gati</p>
            <p className="text-xs text-[#ce2731] font-semibold">Backend AI Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23343006</p>
          </div>
        </div>
      </section>

      {/* Technical Architecture Summary */}
      <section className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm">
          <Cpu className="w-4 h-4 text-primary" aria-hidden="true" />
          <span>Arsitektur Bebas Biaya Operasional (Zero Budget Strategy)</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Aplikasi ini dibangun menggunakan arsitektur modern berbiaya Rp 0: Next.js pada Vercel Hobby, Express API pada Node.js, FastAPI untuk AI microservice, database PostgreSQL dengan pgvector di Supabase Free Tier, dan model Google Gemini Free Tier.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Kembali ke Halaman Utama
          </Link>
        </div>
      </section>
    </main>
  );
}
