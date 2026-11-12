import Link from "next/link";

export function DarkCtaBanner() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl bg-primary text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl border border-primary-700/80 hover:border-primary-600 transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Siap Mengetahui Kualitas CV Anda Sekarang?
        </h2>
        <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto leading-relaxed">
          Dapatkan skor ATS objektif, analisis 5 dimensi, serta rekomendasi lowongan kerja presisi tanpa biaya apapun.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#onboarding-section"
            className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg transition min-h-[44px] flex items-center justify-center"
          >
            Mulai Evaluasi CV Gratis
          </a>
          <Link
            href="/jobs"
            className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-full border border-white/20 transition min-h-[44px] flex items-center justify-center"
          >
            Lihat Lowongan Kerja
          </Link>
        </div>
      </div>
    </section>
  );
}

