import { Shield, Sparkles, Database, Layers, CheckCircle } from "lucide-react";

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
        {/* Box 1: Emerald Theme (100% Free Tier) */}
        <div className="p-7 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/60 to-white border border-emerald-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500 transition-all duration-300">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/90 px-2.5 py-1 rounded-md inline-block">
              Akses Terbuka
            </span>
            <div className="text-3xl font-black text-emerald-950">100% Gratis</div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Seluruh kandidat dapat melakukan evaluasi CV dan pembuatan resume tanpa biaya langganan apapun (Rp 0).
            </p>
          </div>
          <div className="pt-3 border-t border-emerald-100 flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Zero Budget Architecture</span>
          </div>
        </div>

        {/* Box 2: Navy Theme (Blind Scoring) */}
        <div className="p-7 rounded-3xl bg-gradient-to-br from-blue-50/95 via-indigo-50/60 to-white border border-blue-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-primary transition-all duration-300">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold bg-blue-100/90 px-2.5 py-1 rounded-md inline-block">
              Objektivitas
            </span>
            <div className="text-3xl font-black text-primary">Bebas Bias</div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Penyaringan mengabaikan foto wajah, gender, dan atribut demografi. Evaluasi murni bertumpu pada kompetensi nyata.
            </p>
          </div>
          <div className="pt-3 border-t border-blue-100 flex items-center gap-1.5 text-xs text-primary font-semibold">
            <CheckCircle className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>AI Blind Scoring Protocol</span>
          </div>
        </div>

        {/* Box 3: Crimson Theme (Privacy UU PDP) */}
        <div className="p-7 rounded-3xl bg-gradient-to-br from-rose-50/95 via-red-50/60 to-white border border-rose-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-secondary transition-all duration-300">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold bg-rose-100/90 px-2.5 py-1 rounded-md inline-block">
              Regulasi Hukum
            </span>
            <div className="text-3xl font-black text-secondary">UU PDP 2022</div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Kandidat memegang kendali penuh atas data mereka. Tombol hak hapus permanen (Right to be Forgotten) dapat diakses kapan pun.
            </p>
          </div>
          <div className="pt-3 border-t border-rose-100 flex items-center gap-1.5 text-xs text-secondary font-semibold">
            <Shield className="w-4 h-4 text-secondary" aria-hidden="true" />
            <span>UU No. 27 Tahun 2022</span>
          </div>
        </div>
      </div>
    </section>
  );
}

