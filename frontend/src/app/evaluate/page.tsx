"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  ArrowLeft,
  ArrowUpRight,
  FileCheck2,
  Briefcase,
  Play,
  Layers,
} from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { AtsOnboardingWizard } from "@/components/dashboard/ats-onboarding-wizard";
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

function EvaluateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"upload" | "questionnaire">("upload");
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "questionnaire" || tabParam === "onboarding") {
      setActiveTab("questionnaire");
    } else {
      setActiveTab("upload");
    }
  }, [searchParams]);

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
    <div className="min-h-full w-full bg-[#f8fafc] px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col gap-5">
      {/* Baris Atas: Navigasi Kembali & Pintasan Demo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0f2c56] hover:text-white bg-white hover:bg-[#0f2c56] px-4 py-2 rounded-full border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRunDemoSample}
            disabled={isProcessingDemo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {isProcessingDemo ? "Memuat Sampel..." : "Uji Contoh CV ATS (Skor 88/100)"}
            </span>
          </button>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0f2c56] px-3.5 py-2 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ce2731]" />
            <span>Format ATS Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Kontainer Utama: 12-Column Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
        {/* Kolom Kiri (5 Kolom): Kartu Utama Navy + 3 Bento Statistik Solid */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Kartu Hero Workspace Solid Navy */}
          <div className="bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-7 flex flex-col justify-between flex-1">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider mb-4">
                <span>Ruang Evaluasi Presisi</span>
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

        {/* Kolom Kanan (7 Kolom): Panggung Interaktif Unggah CV / Kuesioner */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[28px] p-5 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Header Panggung + Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ce2731]">
                  Metode Evaluasi
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0f2c56] font-heading">
                  {activeTab === "upload"
                    ? "Unggah Dokumen CV Anda"
                    : "Susun CV ATS dari Kuesioner"}
                </h3>
              </div>

              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "upload"
                      ? "bg-[#0f2c56] text-white"
                      : "text-slate-600 hover:text-[#0f2c56]"
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Saya Sudah Punya CV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("questionnaire")}
                  className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "questionnaire"
                      ? "bg-[#ce2731] text-white"
                      : "text-slate-600 hover:text-[#0f2c56]"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Saya Belum Punya CV</span>
                </button>
              </div>
            </div>

            {/* Area Interaktif Utama */}
            {activeTab === "upload" ? (
              <CVDropzone onAnalysisComplete={handleAnalysisSuccess} />
            ) : (
              <div className="max-h-[55vh] overflow-y-auto scrollbar-halus pr-1">
                <AtsOnboardingWizard onComplete={handleAnalysisSuccess} />
              </div>
            )}
          </div>

          {/* Baris Langkah Cepat di Bawah Dropzone */}
          <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#0f2c56] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-xs font-semibold text-[#0f2c56]">
                Unggah PDF/DOCX atau isi kuesioner
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#0f2c56] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-xs font-semibold text-[#0f2c56]">
                Periksa skor 5 dimensi &amp; saran perbaikan
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#ce2731] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <span className="text-xs font-semibold text-[#0f2c56]">
                Lamar lowongan dengan kecocokan tertinggi
              </span>
            </div>
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
