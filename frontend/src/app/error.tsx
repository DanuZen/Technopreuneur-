"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
        <AlertCircle className="w-7 h-7" aria-hidden="true" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-primary">
        Terjadi Kendala Memuat Halaman
      </h1>
      <p className="text-sm text-slate-600 max-w-md">
        Sistem mendeteksi kendala sementara saat memuat data. Silakan coba muat ulang halaman.
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2.5 bg-primary hover:bg-[#163861] text-white text-xs font-semibold rounded-full shadow-sm transition inline-flex items-center gap-2 min-h-[40px]"
        >
          <RotateCcw className="w-4 h-4" />
          Coba Lagi
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 bg-white hover:bg-slate-50 text-primary border border-slate-200 text-xs font-semibold rounded-full shadow-sm transition inline-flex items-center gap-2 min-h-[40px]"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}

