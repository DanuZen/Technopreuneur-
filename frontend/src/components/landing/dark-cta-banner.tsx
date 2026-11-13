import Link from "next/link";

export function DarkCtaBanner() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl bg-gradient-to-r from-[#0f2c56] via-[#1a3866] to-[#ce2731] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Siap Mengetahui Kualitas CV Anda Sekarang?
        </h2>
        <p className="text-sm sm:text-base text-slate-100 max-w-xl mx-auto leading-relaxed">
          Dapatkan skor ATS objektif, analisis 5 dimensi, serta rekomendasi lowongan kerja presisi tanpa biaya apapun (100% Gratis).
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/evaluate"
            className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-100 text-primary text-xs sm:text-sm font-bold rounded-full shadow-lg transition min-h-[44px] flex items-center justify-center"
          >
            <span>Mulai Evaluasi CV Gratis</span>
          </Link>
          <Link
            href="/jobs"
            className="w-full sm:w-auto px-7 py-3.5 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold rounded-full backdrop-blur-sm transition min-h-[44px] flex items-center justify-center shadow-xs"
          >
            Lihat Lowongan Kerja
          </Link>
        </div>
      </div>
    </section>
  );
}

