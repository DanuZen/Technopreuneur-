"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileSpreadsheet,
  CheckCircle2,
  ArrowUpRight,
  FileCheck2,
  Briefcase,
  Play,
  Layers,
  ArrowRight,
} from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

function EvaluateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "questionnaire" || tabParam === "onboarding") {
      router.replace("/onboarding");
    }
  }, [searchParams, router]);

  const handleAnalysisSuccess = (result: CVAnalysisResult) => {
    api.saveAnalysis(result);
    router.push("/dashboard");
  };

  const handleRunDemoSample = async () => {
    if (isProcessingDemo) return;
    setIsProcessingDemo(true);
    try {
      const demoFile = new File(
        ["Contoh Dokumen Resume Standar ATS 1-Kolom Wira Fikri"],
        "CV_Wira_Fikri_ATS_Standard.pdf",
        { type: "application/pdf" }
      );
      const result = await api.uploadCV(demoFile);
      handleAnalysisSuccess(result);
    } catch {
      setIsProcessingDemo(false);
    }
  };

  return (
    <div className="min-h-full max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Kontainer Utama: 12-Column Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
        {/* Kolom Kiri (5 Kolom): Kartu Utama Navy + 3 Bento Statistik Solid */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Kartu Hero Workspace Solid Navy */}
          <div className="bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-7 flex flex-col justify-between flex-1">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  <span>Ruang Evaluasi Presisi</span>
                </span>
                <button
                  type="button"
                  onClick={handleRunDemoSample}
                  disabled={isProcessingDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#0f2c56] text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-60"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>
                    {isProcessingDemo ? "Memuat Sampel..." : "Uji Sampel CV (88/100)"}
                  </span>
                </button>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.15] mb-3 font-heading">
                Ukur. Temukan.{" "}
                <span className="inline-block bg-[#ce2731] text-white px-3 py-0.5 rounded-xl mt-1">
                  Karir Impian.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Platform evaluasi CV 5 dimensi dan pencocokan lowongan kerja cerdas untuk fresh graduate dan talenta muda berbasis filosofi pas bana.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-white/60">
                  Target Kesiapan
                </p>
                <p className="text-sm font-extrabold text-white">
                  Skor Optimal &ge; 80 / 100 Poin
                </p>
              </div>
              <button
                type="button"
                onClick={handleRunDemoSample}
                disabled={isProcessingDemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-[#0f2c56] hover:bg-[#ce2731] hover:text-white text-xs font-extrabold transition-colors cursor-pointer shrink-0 disabled:opacity-60"
              >
                <span>Lihat Demo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3 Kartu Indikator Solid (Bento Baris Bawah Kiri) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-base font-black text-[#0f2c56] leading-tight">
                  5 Dimensi
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Struktur, kejelasan &amp; dampak terukur
                </p>
              </div>
            </div>

            <div className="bg-[#ce2731] text-white rounded-2xl p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-white text-[#ce2731] flex items-center justify-center mb-3">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-base font-black text-white leading-tight">
                  1-Kolom ATS
                </p>
                <p className="text-[11px] text-white/85 mt-0.5 leading-snug">
                  Bebas tabel rumit &amp; mudah dipindai HRD
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center mb-3">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-base font-black text-[#0f2c56] leading-tight">
                  Loker Cocok
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Rekomendasi posisi kerja sesuai keahlian
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (7 Kolom): Fokus Unggah Dokumen CV + Tombol Menuju Halaman Onboarding */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-6 py-1 sm:px-2">
          <div>
            {/* Header Panggung + Tombol Menuju Halaman Onboarding */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200/80">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ce2731]">
                  Evaluasi Berkas Digital
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0f2c56] font-heading">
                  Unggah Dokumen CV Anda
                </h3>
              </div>

              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white font-bold text-xs transition-colors self-start sm:self-auto"
              >
                <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                <span>Belum Punya CV? Buat di Onboarding</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Area Unggah Dokumen CV */}
            <CVDropzone onAnalysisComplete={handleAnalysisSuccess} />
          </div>

          {/* Banner Pintasan Onboarding & Langkah Cepat di Bawah Dropzone */}
          <div className="pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-[#0f2c56]">
                  Tidak memiliki file CV yang siap diunggah?
                </p>
                <p className="text-xs text-slate-500">
                  Susun CV standar ATS 1-kolom dari nol melalui halaman Onboarding Terpandu.
                </p>
              </div>
            </div>

            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold transition-colors shrink-0"
            >
              <span>Buka Halaman Onboarding</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvaluatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EvaluateContent />
    </Suspense>
  );
}
