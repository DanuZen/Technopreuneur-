import Link from "next/link";
import { Compass, Users, Shield, Cpu, ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fefefd] text-[#0f2c56]">
      <div className="max-w-[1400px] w-full mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-10 animate-fade-in-up">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2c56] hover:text-[#ce2731] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Header */}
        <header className="space-y-3">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white">
            Tentang Pasbana AI
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#0f2c56] leading-[1.18]">
            Mengenal Filosofi{" "}
            <span className="inline-block bg-[#ce2731] text-white px-3 py-0.5 rounded-xl">
              Pas Bana.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Platform bimbingan karir dan pencocokan lowongan kerja presisi berbasis kecerdasan buatan, dirancang untuk menghubungkan talenta muda dengan industri secara adil dan transparan.
          </p>
        </header>

        {/* Brand Philosophy Section: Solid 2-Col Bento */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-8 space-y-4">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#ce2731] text-xs font-bold text-white">
              Filosofi Minang
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              Dari Bahasa Minang &quot;Pas Bana&quot;: Sangat Pas, Sangat Cocok
            </h2>
            <p className="text-sm text-white/85 leading-relaxed">
              <strong className="text-white font-bold">Pasbana</strong> berasal dari ungkapan bahasa Minang <em className="font-semibold text-white">&quot;pas bana&quot;</em> yang berarti <em className="font-semibold text-white">&quot;sangat pas&quot;</em> atau <em className="font-semibold text-white">&quot;sangat cocok&quot;</em>. Filosofi ini menjadi inti dari setiap solusi yang kami hadirkan: mempertemukan potensi terbaik pencari kerja dengan kebutuhan spesifik perusahaan secara presisi.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 space-y-4">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white">
              Solusi Presisi
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2c56] leading-snug">
              Pertemuan Talenta &amp; Industri yang Tepat Sasaran
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Melalui analisis CV cerdas berbasis AI, Pasbana membantu talenta memahami kekuatan diri, memperbaiki celah keterampilan (skill gap), dan menemukan peluang karir yang benar-benar sesuai, bukan sekadar melamar secara acak. Di sisi lain, Pasbana memastikan perusahaan mendapatkan kandidat yang paling relevan tanpa membuang waktu menyaring berkas yang tidak sesuai.
            </p>
          </div>
        </section>

        {/* Mission & Privacy Commitment */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-[28px] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0f2c56] text-white flex items-center justify-center">
              <Compass className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0f2c56]">Misi Kami</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Menjembatani kesenjangan antara fresh graduate dan industri kerja melalui analisis kualitas resume yang objektif 5 dimensi serta rekomendasi lowongan kerja yang transparan.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[#ce2731] text-white rounded-[28px] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#ce2731] flex items-center justify-center">
              <Shield className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">Komitmen Privasi (UU PDP No. 27/2022)</h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Kami mengimplementasikan prinsip sanitasi data pribadi (PII masking) sebelum teks diproses oleh model evaluasi, dan memberikan hak penuh kepada pengguna untuk menghapus berkas kapan saja.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-5">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#ce2731]" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2c56]">Tim Pengembang</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-[24px] bg-white border border-slate-200 space-y-2.5">
              <p className="font-extrabold text-[#0f2c56] text-base">Wira Fikri Ramadanu</p>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#0f2c56] text-white text-xs font-bold">
                Frontend Lead
              </span>
              <p className="text-xs text-slate-500 font-mono">NIM: 23343023</p>
            </div>

            <div className="p-6 rounded-[24px] bg-white border border-slate-200 space-y-2.5">
              <p className="font-extrabold text-[#0f2c56] text-base">Muhammad Gilang Ramadhan</p>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#ce2731] text-white text-xs font-bold">
                Backend Lead
              </span>
              <p className="text-xs text-slate-500 font-mono">NIM: 23346013</p>
            </div>

            <div className="p-6 rounded-[24px] bg-white border border-slate-200 space-y-2.5">
              <p className="font-extrabold text-[#0f2c56] text-base">Florensius Panca Gati</p>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#0f2c56] text-white text-xs font-bold">
                Backend AI Lead
              </span>
              <p className="text-xs text-slate-500 font-mono">NIM: 23343006</p>
            </div>
          </div>
        </section>

        {/* Technical Architecture Summary */}
        <section className="p-6 sm:p-8 bg-[#0f2c56] text-white rounded-[28px] space-y-4">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#ce2731]" aria-hidden="true" />
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              Arsitektur Bebas Biaya Operasional (Zero Budget Strategy)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-4xl">
            Aplikasi ini dibangun menggunakan arsitektur modern berbiaya Rp 0: Next.js pada Vercel Hobby, Express API pada Node.js, FastAPI untuk AI microservice, database PostgreSQL dengan pgvector di Supabase Free Tier, dan model Google Gemini Free Tier.
          </p>
          <div className="pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ce2731] hover:bg-white text-white hover:text-[#0f2c56] text-xs font-bold transition-colors"
            >
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
