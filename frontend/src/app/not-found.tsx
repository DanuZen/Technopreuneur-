import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <Compass className="w-7 h-7" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-black text-primary">404: Halaman Tidak Ditemukan</h1>
      <p className="text-sm text-slate-600 max-w-md">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-primary hover:bg-[#163861] text-white text-xs font-semibold rounded-full shadow-sm transition inline-flex items-center gap-2 min-h-[40px]"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>
    </main>
  );
}

