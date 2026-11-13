import { Shield, CheckCircle } from "lucide-react";

export function FeaturesBento() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Fondasi Arsitektur &amp; Etika Platform
        </h2>
        <p className="text-sm text-slate-600">
          Menjamin keandalan teknis, kepatuhan hukum privasi, dan transparansi algoritma.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-6xl mx-auto">
        {/* Primary Anchor (Lg: col-span-7): Navy Theme (Blind Scoring) */}
        <div className="lg:col-span-7 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#0f2c56] via-[#163861] to-[#0a1e3b] text-white shadow-xl shadow-primary/15 flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 font-bold bg-white/10 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
              Objektivitas Murni
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white">Blind Scoring Bebas Bias</div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
              Penyaringan mengabaikan foto wajah, gender, dan atribut demografi. Evaluasi murni bertumpu pada kompetensi nyata, capaian riil, serta relevansi kata kerja aktif standar ATS.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-200 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Protokol Sanitasi Data Bebas Subjektivitas Rekruter</span>
          </div>
        </div>

        {/* Stacked Right Column (Lg: col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Card 1: Emerald Theme (100% Free Tier) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/50 to-white shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex-1">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Akses Terbuka
              </span>
              <div className="text-2xl font-black text-emerald-950">100% Gratis</div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Seluruh kandidat dapat melakukan evaluasi CV dan pembuatan resume tanpa biaya langganan apapun (Rp 0).
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Zero Budget Architecture</span>
            </div>
          </div>

          {/* Card 2: Crimson Theme (Privacy UU PDP) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/95 via-red-50/50 to-white shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex-1">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold bg-rose-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Regulasi Hukum
              </span>
              <div className="text-2xl font-black text-secondary">UU PDP 2022</div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Kandidat memegang kendali penuh atas data mereka. Tombol hak hapus permanen dapat diakses kapan pun.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold">
              <Shield className="w-4 h-4 text-secondary" aria-hidden="true" />
              <span>UU No. 27 Tahun 2022</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

