"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  category: string;
  tabLabel: string;
  tabSub: string;
  title: string;
  description: string;
  bullets: string[];
  ctaText: string;
  ctaHref: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "extract",
    category: "Tahap 1 • Fokus Berkas",
    tabLabel: "Ekstraksi Digital",
    tabSub: "Parsing & Sanitasi",
    title: "Ekstraksi Digital & Blind Scoring Bebas Bias",
    description: "Memastikan layer teks digital resume terbaca sempurna oleh sistem ATS tanpa kendala tabel berlapis. Parameter foto, usia, dan gender disanitasi secara ketat demi objektivitas murni.",
    bullets: [
      "Validasi otomatis dokumen scan atau gambar murni",
      "Pembersihan tata letak tabel kompleks menjadi format 1-kolom",
      "Sanitasi data pribadi sensitif (PII masking) sebelum dianalisis",
    ],
    ctaText: "Mulai Unggah Berkas CV",
    ctaHref: "/evaluate",
  },
  {
    id: "dimensions",
    category: "Tahap 2 • Standar HR",
    tabLabel: "Analisis 5 Dimensi",
    tabSub: "Struktur & Kualitas",
    title: "Evaluasi Komprehensif Berbasis 5 Dimensi Objektif",
    description: "Tidak sekadar mencocokkan kata kunci, model AI mengevaluasi kedalaman pengalaman, rasio kata kerja aktif (action verbs), dan pencapaian berbasis metrik terukur.",
    bullets: [
      "Pengukuran bobot struktur dan keterbacaan mesin ATS (94%)",
      "Deteksi kekuatan deskripsi karir dan dampak numerik (85%)",
      "Pemetaan keselarasan skill teknis terhadap standar industri (90%)",
    ],
    ctaText: "Uji Kualitas 5 Dimensi",
    ctaHref: "/evaluate",
  },
  {
    id: "matching",
    category: "Tahap 3 • Pencocokan Pas Bana",
    tabLabel: "Pencocokan Presisi",
    tabSub: "pgvector + LLM",
    title: "Pencocokan Karir Presisi Dua Tahap",
    description: "Pertama, kueri jarak kemiripan kosinus pgvector menyaring 20 lowongan paling relevan. Kedua, evaluasi LLM menganalisis gap kualifikasi dan menentukan persentase kecocokan riil.",
    bullets: [
      "Pencarian semantik cepat dengan embedding vektor 1536-dimensi",
      "Identifikasi akurat missing skills dan saran tindakan konkret",
      "Agregasi lowongan mitra industri terverifikasi dan portal kerja",
    ],
    ctaText: "Eksplorasi Lowongan Kerja",
    ctaHref: "/jobs",
  },
  {
    id: "privacy",
    category: "Tahap 4 • Regulasi Hukum",
    tabLabel: "Kepatuhan Privasi",
    tabSub: "UU PDP No. 27/2022",
    title: "Keamanan Data Kandidat & Kepatuhan UU PDP 2022",
    description: "Kandidat memegang kendali penuh atas privasi mereka. Seluruh data diproses secara transparan dengan opsi penghapusan permanen kapan saja (Right to be Forgotten).",
    bullets: [
      "Persetujuan eksplisit sebelum data diproses oleh layanan AI",
      "Enkripsi penuh saat transit dan penyimpanan aman berstandar industri",
      "Tombol hak hapus data permanen satu klik tanpa sisa di server",
    ],
    ctaText: "Pelajari Komitmen Privasi",
    ctaHref: "/about",
  },
];

export function InteractiveWorkflow() {
  const [activeTab, setActiveTab] = useState<string>("extract");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeIndex = WORKFLOW_STEPS.findIndex((s) => s.id === activeTab);
  const currentStep = WORKFLOW_STEPS[activeIndex] || WORKFLOW_STEPS[0];

  // Auto-cycle through tabs every 5 seconds (matching Dribbble showcase feel)
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveTab((prev) => {
        const nextIdx = (WORKFLOW_STEPS.findIndex((s) => s.id === prev) + 1) % WORKFLOW_STEPS.length;
        return WORKFLOW_STEPS[nextIdx].id;
      });
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeTab]);

  return (
    <section
      className="space-y-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Alur Pemrosesan Cerdas Pasbana AI"
    >
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary">
          Otomasi &amp; Analisis Presisi, Selesaikan Evaluasi dalam Hitungan Detik
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Setiap tahapan dirancang transparan untuk memastikan rekomendasi karir Anda akurat, terstruktur, dan beretika sesuai filosofi pas bana.
        </p>
      </div>

      {/* Dribbble-Style Horizontal Step Bar (4 Tabs with Live Progress Indicator) */}
      <div className="max-w-5xl mx-auto px-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-1.5 bg-[#edf2f9] rounded-2xl sm:rounded-full shadow-inner">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = step.id === activeTab;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setActiveTab(step.id);
                  setIsPaused(true);
                }}
                className={`relative flex flex-col items-center justify-center py-2.5 px-3 rounded-xl sm:rounded-full text-center transition-all duration-300 overflow-hidden cursor-pointer ${
                  isActive
                    ? "bg-white text-primary shadow-md font-bold"
                    : "text-slate-600 hover:text-primary hover:bg-white/50"
                }`}
              >
                <span className="text-xs font-bold leading-tight truncate w-full">
                  {step.tabLabel}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-medium truncate w-full hidden sm:inline">
                  {step.tabSub}
                </span>

                {/* Animated active progress bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary overflow-hidden">
                    <div
                      key={activeTab}
                      className={`h-full bg-secondary ${
                        isPaused ? "w-full" : "animate-tab-progress"
                      }`}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dribbble-Style 2-Column Showcase Canvas (Text + 3D Atmospheric Pedestal Card) */}
      <div className="max-w-6xl mx-auto rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#f8fafd] via-white to-[#edf3fa] p-6 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Subtle ethereal sky background glow */}
        <div
          className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Context, Features & Tactile CTA (5 Columns) */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold bg-rose-50 px-3 py-1 rounded-full shadow-2xs inline-block">
              {currentStep.category}
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight leading-snug">
              {currentStep.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentStep.description}
            </p>

            <ul className="space-y-2.5 pt-1 text-xs text-slate-700">
              {currentStep.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-medium leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href={currentStep.ctaHref}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-[#163861] text-white text-xs font-bold rounded-full shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 cursor-pointer min-h-[44px]"
              >
                <span>{currentStep.ctaText}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Serene 3D Pedestal & Floating Animated Card (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[360px] sm:min-h-[420px]">
            {/* The Ethereal Landscape Pedestal (Mossy hill / organic stone shape) */}
            <div className="absolute bottom-0 w-full max-w-lg h-36 rounded-[48px] bg-gradient-to-t from-emerald-950/15 via-teal-900/10 to-transparent blur-md pointer-events-none" />
            
            <div className="absolute bottom-2 w-full max-w-md h-24 rounded-full bg-gradient-to-r from-emerald-100/60 via-teal-50/70 to-blue-100/50 shadow-inner pointer-events-none" />

            {/* The Floating Frosted Clay Card (Animated Hover Float) */}
            <div className="w-full max-w-lg relative z-20 animate-float">
              {/* TAB 1 PREVIEW: Digital Parser Stream */}
              {activeTab === "extract" && (
                <div className="rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 bg-slate-50/80 -mx-6 -mt-6 px-6 pt-5 rounded-t-3xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-primary">Mesin Ekstraksi Digital ATS</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                      Layer Teks 100% Bersih
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50/60 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span>Status Pemindaian</span>
                        <span className="text-primary font-bold">1.420 Kata Terbaca</span>
                      </div>
                      <div className="w-full bg-blue-200/50 h-1.5 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-primary rounded-full" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Sanitasi PII</span>
                        <p className="font-bold text-slate-800 text-xs">Foto &amp; Gender Disamarkan</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-slate-400">Kompatibilitas</span>
                        <p className="font-bold text-emerald-700 text-xs">Format 1-Kolom Ramah ATS</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 text-[11px] text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Berkas siap diteruskan ke tahap analisis 5 dimensi objektif.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 PREVIEW: 5-Dimension Radar & Scorecard */}
              {activeTab === "dimensions" && (
                <div className="rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 bg-slate-50/80 -mx-6 -mt-6 px-6 pt-5 rounded-t-3xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-xs font-bold text-primary">Matriks Kualitas 5 Dimensi</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <span>Skor ATS: 88</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700">
                        <span>1. Struktur &amp; Kompatibilitas ATS</span>
                        <span className="font-mono font-bold text-primary">94%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[94%] h-full bg-primary rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700">
                        <span>2. Kejelasan Deskripsi Karir</span>
                        <span className="font-mono font-bold text-sky-600">85%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-sky-500 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700">
                        <span>3. Pencapaian Berbasis Angka Terukur</span>
                        <span className="font-mono font-bold text-emerald-600">82%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[82%] h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-700">
                        <span>4. Relevansi Keahlian Teknis</span>
                        <span className="font-mono font-bold text-secondary">90%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="w-[90%] h-full bg-secondary rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3 PREVIEW: Two-Stage Job Matching */}
              {activeTab === "matching" && (
                <div className="rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 bg-slate-50/80 -mx-6 -mt-6 px-6 pt-5 rounded-t-3xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                      <span className="text-xs font-bold text-primary">Two-Stage Precision Match</span>
                    </div>
                    <span className="text-[10px] font-mono text-primary bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">
                      pgvector + LLM
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-slate-50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Junior Frontend Developer</h4>
                        <p className="text-[11px] text-slate-500">PT Solusi Teknologi Nusantara · Jakarta</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-emerald-600">92%</span>
                        <p className="text-[9px] uppercase font-mono text-slate-400">Match Rate</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-medium shadow-2xs">
                        React / Next.js
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-medium shadow-2xs">
                        TypeScript
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-medium shadow-2xs">
                        Tailwind CSS
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 text-slate-600">
                    <span>Tahap 1: 20 Kandidat Lowongan</span>
                    <span className="font-bold text-emerald-700">Tahap 2: Lolos Kualifikasi</span>
                  </div>
                </div>
              )}

              {/* TAB 4 PREVIEW: UU PDP 2022 Privacy Vault */}
              {activeTab === "privacy" && (
                <div className="rounded-3xl bg-white/95 backdrop-blur-md p-6 sm:p-7 shadow-2xl space-y-4 text-left">
                  <div className="flex items-center justify-between pb-3 bg-slate-50/80 -mx-6 -mt-6 px-6 pt-5 rounded-t-3xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-emerald-950">Protokol Kepatuhan UU PDP</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-bold">
                      UU No. 27/2022
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">Hak Hapus Data (Right to be Forgotten)</p>
                        <p className="text-[11px] text-slate-500">Hapus riwayat dan berkas resume dalam 1 klik</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Aktif
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">Enkripsi Data Transit &amp; Rest</p>
                        <p className="text-[11px] text-slate-500">Protokol TLS 1.3 dan penyimpanan aman</p>
                      </div>
                      <span className="text-[10px] font-bold text-primary bg-blue-100 px-2 py-0.5 rounded-full">
                        Terverifikasi
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 text-[11px] text-primary flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                      <span>Data resume tidak dibagikan ke pihak ketiga tanpa persetujuan kandidat.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
