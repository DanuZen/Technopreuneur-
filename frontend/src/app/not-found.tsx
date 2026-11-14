import Link from "next/link";
import { Compass, ArrowLeft, FileCheck, Briefcase, Home, Info } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[72vh] flex flex-col items-center justify-center px-4 py-12 text-center space-y-6 animate-fade-in-up">
      <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
        <Compass className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-primary">
          404: Halaman Tidak Ditemukan
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Alamat tautan yang Anda tuju mungkin salah ketik, telah diperbarui ke rute baru, atau belum tersedia.
        </p>
      </div>

      {/* Suggested Valid Destinations */}
      <div className="w-full max-w-md pt-2 space-y-2">
        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Halaman Utama yang Dapat Anda Kunjungi:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white hover:bg-slate-50 text-primary shadow-xs transition"
          >
            <Home className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>Beranda</span>
          </Link>
          <Link
            href="/evaluate"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white hover:bg-blue-50/70 text-primary shadow-xs transition"
          >
            <FileCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Evaluasi CV</span>
          </Link>
          <Link
            href="/jobs"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white hover:bg-slate-50 text-primary shadow-xs transition"
          >
            <Briefcase className="w-4 h-4 text-secondary" aria-hidden="true" />
            <span>Cari Lowongan</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-white hover:bg-slate-50 text-primary shadow-xs transition"
          >
            <Info className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Tentang Kami</span>
          </Link>
        </div>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="px-6 py-2.5 bg-primary hover:bg-[#163861] text-white text-xs font-semibold rounded-full shadow-md shadow-primary/25 transition inline-flex items-center gap-2 min-h-[42px]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </main>
  );
}
