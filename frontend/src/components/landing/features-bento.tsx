import { Shield, Sparkles, Database, Layers, CheckCircle } from "lucide-react";

export function FeaturesBento() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Fondasi Arsitektur &amp; Etika Platform
        </h2>
        <p className="text-sm text-slate-600">
          Menjamin keandalan teknis, kepatuhan hukum privasi, dan transparansi algoritma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {/* Box 1: Zero Cost (100% Free Tier) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Akses Terbuka
            </span>
            <div className="text-3xl font-black text-slate-900">100% Gratis</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seluruh kandidat dapat melakukan evaluasi CV dan pembuatan resume tanpa biaya langganan apapun (Rp 0).
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Zero Budget Architecture</span>
          </div>
        </div>

        {/* Box 2: Blind Scoring */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Objektivitas
            </span>
            <div className="text-3xl font-black text-slate-900">Bebas Bias</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Penyaringan mengabaikan foto wajah, gender, dan atribut demografi. Evaluasi murni bertumpu pada kompetensi nyata.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-blue-700 font-medium">
            <CheckCircle className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <span>AI Blind Scoring Protocol</span>
          </div>
        </div>

        {/* Box 3: Privacy UU PDP */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Regulasi Hukum
            </span>
            <div className="text-3xl font-black text-slate-900">UU PDP 2022</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kandidat memegang kendali penuh atas data mereka. Tombol hak hapus permanen (Right to be Forgotten) dapat diakses kapan pun.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <Shield className="w-4 h-4 text-slate-600" aria-hidden="true" />
            <span>UU No. 27 Tahun 2022</span>
          </div>
        </div>
      </div>
    </section>
  );
}
