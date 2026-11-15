"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCloud, FileSpreadsheet, ArrowUpRight, Edit3, Printer } from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult } from "@/types";
import { AtsCvPreview } from "@/components/dashboard/ats-cv-preview";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";

export default function DokumenCvAtsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);

  useEffect(() => {
    const current = api.getCurrentAnalysis();
    if (current) {
      setAnalysis(current);
    }
    setLoading(false);
  }, []);

  const handleLoadSampleAnalysis = async () => {
    setLoading(true);
    try {
      const demoFile = new File(
        ["Demo CV Wira Fikri ATS Standard"],
        "CV_Wira_Fikri_ATS_Standard.pdf",
        { type: "application/pdf" }
      );
      const result = await api.uploadCV(demoFile);
      api.saveAnalysis(result);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#0f2c56] font-bold font-mono">
          Memuat dokumen CV standar ATS...
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-full w-full px-3.5 sm:px-6 py-5 sm:py-6 space-y-6">
        <DashboardPageHeading
          badge="Dokumen CV ATS"
          titleLine1="Pratinjau & cetak CV"
          titleLine2Prefix="dengan format"
          titleHighlight="siap lamaran!"
        />
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold uppercase tracking-wider">
              Dokumen CV ATS
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2c56] font-heading">
              Dokumen CV Standar ATS Belum Tersedia
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unggah CV Anda di halaman Evaluasi CV atau susun melalui Onboarding CV ATS untuk melihat pratinjau dokumen standar ATS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/user/dashboard/evaluasi"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Evaluasi CV</span>
            </Link>
            <Link
              href="/user/dashboard/onboarding"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Onboarding CV ATS</span>
            </Link>
            <button
              type="button"
              onClick={handleLoadSampleAnalysis}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#0f2c56] text-[#0f2c56] hover:bg-[#0f2c56] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Muat Sampel CV Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-full w-full px-3.5 sm:px-6 py-5 sm:py-6 space-y-6">
      <DashboardPageHeading
        badge="Dokumen CV ATS"
        titleLine1="Pratinjau & cetak CV"
        titleLine2Prefix="dengan format"
        titleHighlight="siap lamaran!"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/user/dashboard/onboarding")}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#0f2c56] text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Edit Data</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cetak / Unduh PDF</span>
            </button>
          </div>
        }
      />
      <AtsCvPreview
        profile={analysis.profile}
        hideToolbar
      />
    </main>
  );
}

