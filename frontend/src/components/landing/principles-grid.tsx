import { FileCheck, BarChart3, Target } from "lucide-react";

export function PrinciplesGrid() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Standar Evaluasi Industri Objektif
        </h2>
        <p className="text-sm text-slate-600">
          CareerMatch AI menggunakan 5 kriteria pengujian yang diadopsi dari standar penyaringan rekruter profesional dan sistem pelacak pelamar (ATS).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <FileCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">1. Struktur &amp; Kompatibilitas ATS</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memastikan tata letak berkas digital Anda memiliki layer teks yang dapat dibaca mesin perekrut tanpa ada informasi terpotong atau format yang rusak.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Bobot Evaluasi</span>
            <span className="font-semibold text-slate-900">25% Total Nilai</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">2. Kejelasan &amp; Dampak Terukur</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengevaluasi penggunaan kata kerja aktif dan pencapaian berbasis angka terukur pada pengalaman magang, organisasi, maupun proyek kuliah.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Bobot Evaluasi</span>
            <span className="font-semibold text-slate-900">30% Total Nilai</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Target className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">3. Relevansi Keahlian (Skills Fit)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memetakan keahlian teknis dan software spesifik kandidat terhadap kebutuhan riil lowongan kerja industri yang sedang membuka rekrutmen.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Bobot Evaluasi</span>
            <span className="font-semibold text-slate-900">45% Total Nilai</span>
          </div>
        </div>
      </div>
    </section>
  );
}
