import Link from "next/link";
import { Compass, Users, Shield, Cpu, BookOpen, ArrowLeft } from "lucide-react";

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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary">
          Tentang Pasbana AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Platform bimbingan karir dan pencocokan lowongan kerja presisi berbasis kecerdasan buatan, dirancang untuk menghubungkan talenta muda dengan industri secara adil dan transparan.
        </p>
      </header>

      {/* Brand Philosophy Section: Pasbana */}
      <section className="bg-gradient-to-br from-blue-50/90 via-white to-rose-50/60 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-semibold shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
            <span>Filosofi &amp; Asal-Usul Nama</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-primary">
            Dari Bahasa Minang &quot;Pas Bana&quot;: Sangat Pas, Sangat Cocok
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-slate-800 leading-relaxed">
          <p className="text-justify bg-white/80 p-5 rounded-2xl shadow-xs">
            <strong className="text-primary font-bold">Pasbana</strong> berasal dari ungkapan bahasa Minang <em className="text-secondary font-semibold">&quot;pas bana&quot;</em> yang berarti <em className="text-secondary font-semibold">&quot;sangat pas&quot;</em> atau <em className="text-secondary font-semibold">&quot;sangat cocok&quot;</em>. Filosofi ini menjadi inti dari setiap solusi yang kami hadirkan: mempertemukan potensi terbaik pencari kerja dengan kebutuhan spesifik perusahaan secara presisi.
          </p>
          <p className="text-justify bg-white/80 p-5 rounded-2xl shadow-xs">
            Melalui analisis CV cerdas berbasis AI, Pasbana membantu talenta memahami kekuatan diri, memperbaiki celah keterampilan (skill gap), dan menemukan peluang karir yang benar-benar sesuai, bukan sekadar melamar secara acak. Di sisi lain, Pasbana memastikan perusahaan mendapatkan kandidat yang paling relevan tanpa membuang waktu menyaring ratusan berkas yang tidak sesuai. Karena bagi kami, karir yang baik dimulai dari pertemuan yang pas bana.
          </p>
        </div>
      </section>

      {/* Mission & Problem Statement */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/40 rounded-2xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
            <Compass className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-primary">Misi Kami</h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Menjembatani kesenjangan antara fresh graduate dan industri kerja melalui analisis kualitas resume yang objektif 5 dimensi serta rekomendasi lowongan kerja yang transparan.
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 rounded-2xl shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Shield className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-emerald-950">Komitmen Privasi (UU PDP No. 27/2022)</h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Kami mengimplementasikan prinsip sanitasi data pribadi (PII masking) sebelum teks diproses oleh model evaluasi, dan memberikan hak penuh kepada pengguna untuk menghapus berkas kapan saja.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-bold text-primary">Tim Pengembang</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-white space-y-1.5 shadow-xs">
            <p className="font-bold text-primary text-sm">Wira Fikri Ramadanu</p>
            <p className="text-xs text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full inline-block">Frontend Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23343023</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/80 to-white space-y-1.5 shadow-xs">
            <p className="font-bold text-primary text-sm">Muhammad Gilang Ramadhan</p>
            <p className="text-xs text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded-full inline-block">Backend Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23346013</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-white space-y-1.5 shadow-xs">
            <p className="font-bold text-primary text-sm">Florensius Panca Gati</p>
            <p className="text-xs text-indigo-700 font-bold bg-indigo-100 px-2 py-0.5 rounded-full inline-block">Backend AI Lead</p>
            <p className="text-[11px] text-slate-500 font-mono">NIM: 23343006</p>
          </div>
        </div>
      </section>

      {/* Technical Architecture Summary */}
      <section className="p-6 bg-gradient-to-br from-slate-100 via-blue-50/40 to-slate-50 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Cpu className="w-4 h-4 text-primary" aria-hidden="true" />
          <span>Arsitektur Bebas Biaya Operasional (Zero Budget Strategy)</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Aplikasi ini dibangun menggunakan arsitektur modern berbiaya Rp 0: Next.js pada Vercel Hobby, Express API pada Node.js, FastAPI untuk AI microservice, database PostgreSQL dengan pgvector di Supabase Free Tier, dan model Google Gemini Free Tier.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1"
          >
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
