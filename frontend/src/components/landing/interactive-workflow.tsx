"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, Cpu, ShieldCheck } from "lucide-react";

interface StepData {
  id: string;
  badge: string;
  title: string;
  description: string;
  bulletPoints: string[];
  mockTitle: string;
  mockSub: string;
  mockContent: string;
}

const STEPS: StepData[] = [
  {
    id: "upload",
    badge: "Jalur 1: Punya CV",
    title: "Ekstraksi Digital Berkas PDF atau DOCX",
    description: "Unggah berkas CV Anda. Layanan backend Python mengekstrak layer teks digital murni, mengabaikan foto/atribut fisik, dan memetakan struktur riwayat kerja.",
    bulletPoints: [
      "Validasi otomatis dokumen scan/gambar kosong",
      "Pembersihan format teks dua kolom dan tabel",
      "Sanitasi data pribadi sensitif (PII masking)",
    ],
    mockTitle: "Status Parser CV",
    mockSub: "fastapi/extract-cv v1.0",
    mockContent: "Teks digital berhasil diekstraksi: 1.420 kata, 3 riwayat pendidikan, 5 keahlian teknis terpetakan.",
  },
  {
    id: "wizard",
    badge: "Jalur 2: Belum Punya CV",
    title: "Kuesioner Terpandu AI (~3 Menit)",
    description: "Bagi mahasiswa atau fresh graduate yang belum memiliki CV, jawab kuesioner 4 langkah sederhana. AI kami akan merangkai deskripsi pengalaman Anda menjadi narasi profesional.",
    bulletPoints: [
      "Langkah 1: Identitas & jenjang pendidikan",
      "Langkah 2: Posisi kerja yang Anda tuju",
      "Langkah 3: Penguasaan tools & soft skills",
      "Langkah 4: Proyek kampus atau kepanitiaan",
    ],
    mockTitle: "AI Resume Generator",
    mockSub: "gemini-api/structured-profile",
    mockContent: "Menyusun ringkasan profesional terstruktur dari 4 jawaban formulir wizard kandidat.",
  },
  {
    id: "matching",
    badge: "Pencocokan Presisi",
    title: "Pencocokan Dua Tahap: Vektor + LLM Re-Ranking",
    description: "Pertama, kueri jarak kemiripan kosinus pgvector menyaring 20 lowongan paling relevan. Kedua, LLM menganalisis gap kualifikasi dan menentukan persentase kecocokan sebenarnya.",
    bulletPoints: [
      "Pencarian semantik cepat dengan indeks HNSW",
      "Re-ranking mendalam mendeteksi missing skills",
      "Penjelasan transparan mengapa Anda cocok",
    ],
    mockTitle: "Two-Stage Match Engine",
    mockSub: "pgvector <=> + LLM Evaluator",
    mockContent: "Tahap 1 menyaring 20 lowongan dari database. Tahap 2 menghitung 92% kecocokan dengan posisi Frontend.",
  },
  {
    id: "blind",
    badge: "Kepatuhan Etika & Regulasi",
    title: "Blind Scoring Bebas Bias & Kepatuhan UU PDP",
    description: "Evaluasi dilakukan murni berdasarkan relevansi keterampilan dan pencapaian. Parameter usia, gender, suku, dan foto tidak diikutsertakan dalam prompt penilaian.",
    bulletPoints: [
      "Hak hapus data (Right to be Forgotten) aktif",
      "Tanpa penyimpanan foto atau data biometrik",
      "Persetujuan eksplisit sebelum data dianalisis",
    ],
    mockTitle: "Audit Log & Privacy",
    mockSub: "UU No. 27 Tahun 2022",
    mockContent: "Persetujuan consent tersimpan di database. Seluruh data kandidat dienkripsi saat transit dan rest.",
  },
];

export function InteractiveWorkflow() {
  const [activeStepId, setActiveStepId] = useState("upload");
  const activeStep = STEPS.find((s) => s.id === activeStepId) || STEPS[0];

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Alur Pemrosesan Cerdas &amp; Terstruktur
        </h2>
        <p className="text-sm text-slate-600">
          Setiap tahapan dirancang transparan untuk memastikan rekomendasi karir Anda akurat dan beretika.
        </p>
      </div>

      {/* Pill Selector (like reference) */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
        {STEPS.map((step) => {
          const isActive = step.id === activeStepId;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStepId(step.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition border min-h-[40px] ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {step.badge}
            </button>
          );
        })}
      </div>

      {/* Card Showcase Container (like reference) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Text Column */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              {activeStep.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {activeStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeStep.description}
            </p>

            <ul className="space-y-2 text-xs text-slate-700 pt-2">
              {activeStep.bulletPoints.map((point, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Preview Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">{activeStep.mockTitle}</p>
                <p className="text-[10px] text-slate-500 font-mono">{activeStep.mockSub}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
              <p className="font-medium text-slate-900">Output Pemrosesan:</p>
              <p className="text-slate-600 font-mono text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {activeStep.mockContent}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Status: Siap Produksi</span>
              <span className="font-semibold text-emerald-600">Verifikasi Sukses</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
