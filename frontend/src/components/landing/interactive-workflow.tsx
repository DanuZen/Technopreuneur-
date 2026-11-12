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
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Alur Pemrosesan Cerdas &amp; Terstruktur
        </h2>
        <p className="text-sm text-slate-600">
          Setiap tahapan dirancang transparan untuk memastikan rekomendasi karir Anda akurat dan beretika.
        </p>
      </div>

      {/* Pill Selector */}
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
                  ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                  : "bg-white/90 text-primary border-blue-200/80 hover:border-primary hover:bg-blue-50/50"
              }`}
            >
              {step.badge}
            </button>
          );
        })}
      </div>

      {/* Card Showcase Container with Ambient Gradient */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border border-blue-200/80 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-500 max-w-6xl mx-auto">
        <div key={activeStepId} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in-up">
          {/* Left Text Column */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-secondary font-bold bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block">
              {activeStep.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-primary leading-snug">
              {activeStep.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeStep.description}
            </p>

            <ul className="space-y-2.5 text-xs text-slate-800 pt-2">
              {activeStep.bulletPoints.map((point, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <span className="font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Preview Card: Deep Navy Command Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f2c56] via-[#163861] to-[#0f2c56] text-white border border-primary-700/80 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">{activeStep.mockTitle}</p>
                <p className="text-[10px] text-slate-300 font-mono">{activeStep.mockSub}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  ONLINE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/15 text-xs text-slate-100 leading-relaxed space-y-2">
              <p className="font-semibold text-white">Output Pemrosesan:</p>
              <p className="text-slate-200 font-mono text-[11px] bg-black/20 p-2.5 rounded-lg border border-white/10">
                {activeStep.mockContent}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
              <span>Status: Siap Produksi</span>
              <span className="font-bold text-emerald-300">Verifikasi Sukses</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

