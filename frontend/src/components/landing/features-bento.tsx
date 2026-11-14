import { Shield, CheckCircle } from "lucide-react";

export function FeaturesBento() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Keunggulan Utama untuk Persiapan Karir Anda
        </h2>
        <p className="text-sm text-slate-600">
          Dirancang agar setiap mahasiswa dan pencari kerja mendapatkan evaluasi yang adil, mudah, dan siap pakai.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-6xl mx-auto">
        {/* Primary Anchor (Lg: col-span-7): Navy Theme (Blind Scoring) */}
        <div className="lg:col-span-7 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#0f2c56] via-[#163861] to-[#0a1e3b] text-white shadow-xl shadow-primary/15 flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 font-bold bg-white/10 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
              Keunggulan Utama
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white">Penilaian Objektif Tanpa Diskriminasi</div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
              Penyaringan mengabaikan foto wajah, gender, dan latar belakang pribadi. Evaluasi murni bertumpu pada kompetensi nyata, pengalaman organisasi atau magang, serta kekuatan kalimat di CV Anda.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-200 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Memberi Kesempatan yang Setara bagi Setiap Talenta Muda</span>
          </div>
        </div>

        {/* Stacked Right Column (Lg: col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Card 1: Emerald Theme (100% Free Tier) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/50 to-white shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex-1">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Akses Tanpa Batas
              </span>
              <div className="text-2xl font-black text-emerald-950">100% Gratis Tanpa Langganan</div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Seluruh kandidat dapat mengevaluasi CV, membuat resume lewat kuesioner, dan mencari lowongan tanpa biaya sepeser pun.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>Mendukung Kesuksesan Karir Fresh Graduate</span>
            </div>
          </div>

          {/* Card 2: Crimson Theme (Privacy Control) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/95 via-red-50/50 to-white shadow-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex-1">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold bg-rose-100/90 px-2.5 py-0.5 rounded-full inline-block">
                Privasi Terjaga
              </span>
              <div className="text-2xl font-black text-secondary">Kendali Penuh Data Anda</div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Berkas CV Anda hanya digunakan untuk evaluasi karir dan dapat dihapus secara permanen kapan saja dengan satu klik.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold">
              <Shield className="w-4 h-4 text-secondary" aria-hidden="true" />
              <span>Keamanan &amp; Kerahasiaan Berkas Terjamin</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

