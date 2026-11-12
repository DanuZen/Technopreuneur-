import { FileCheck, BarChart3, Target } from "lucide-react";

export function PrinciplesGrid() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Standar Evaluasi Industri Objektif
        </h2>
        <p className="text-sm text-slate-600">
          Pasbana AI menggunakan 5 kriteria pengujian yang diadopsi dari standar penyaringan rekruter profesional dan sistem pelacak pelamar (ATS).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Card 1: Navy / Blue Theme */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border border-blue-200/90 shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-primary transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/25">
            <FileCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-primary">1. Struktur &amp; Kompatibilitas ATS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memastikan tata letak berkas digital Anda memiliki layer teks yang dapat dibaca mesin perekrut tanpa ada informasi terpotong atau format yang rusak.
            </p>
          </div>
          <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-[11px] text-primary/80 font-mono">
            <span>Bobot Evaluasi</span>
            <span className="font-bold text-primary px-2 py-0.5 rounded-full bg-blue-100/80">25% Total Nilai</span>
          </div>
        </div>

        {/* Card 2: Crimson / Rose Theme */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/90 via-red-50/40 to-white border border-rose-200/90 shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-secondary transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-md shadow-secondary/25">
            <BarChart3 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-secondary">2. Kejelasan &amp; Dampak Terukur</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengevaluasi penggunaan kata kerja aktif dan pencapaian berbasis angka terukur pada pengalaman magang, organisasi, maupun proyek kuliah.
            </p>
          </div>
          <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-[11px] text-secondary/80 font-mono">
            <span>Bobot Evaluasi</span>
            <span className="font-bold text-secondary px-2 py-0.5 rounded-full bg-rose-100/80">30% Total Nilai</span>
          </div>
        </div>

        {/* Card 3: Emerald / Teal Theme */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 shadow-sm space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-600 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25">
            <Target className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-emerald-800">3. Relevansi Keahlian (Skills Fit)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memetakan keahlian teknis dan software spesifik kandidat terhadap kebutuhan riil lowongan kerja industri yang sedang membuka rekrutmen.
            </p>
          </div>
          <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800/80 font-mono">
            <span>Bobot Evaluasi</span>
            <span className="font-bold text-emerald-800 px-2 py-0.5 rounded-full bg-emerald-100/80">45% Total Nilai</span>
          </div>
        </div>
      </div>
    </section>
  );
}

