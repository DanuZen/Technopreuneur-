"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileSpreadsheet,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

function EvaluateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "questionnaire" || tabParam === "onboarding") {
      router.replace("/user/dashboard/onboarding");
    }
  }, [searchParams, router]);

  const handleAnalysisSuccess = (result: CVAnalysisResult) => {
    api.saveAnalysis(result);
    router.push("/user/dashboard");
  };

  return (
    <div className="min-h-full w-full px-3.5 sm:px-6 py-5 sm:py-6 flex flex-col gap-6">
      <DashboardPageHeading
        badge="Evaluasi Berkas Digital"
        titleLine1="Uji kualitas dokumen CV"
        titleLine2Prefix="dengan analisis"
        titleHighlight="standar ATS!"
        rightSlot={
          <Link
            href="/user/dashboard/onboarding"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white font-bold text-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            <span>Belum Punya CV? Buat di Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        }
      />

      {/* Area Unggah Dokumen CV */}
      <CVDropzone onAnalysisComplete={handleAnalysisSuccess} />

      {/* Banner Pintasan Onboarding & Langkah Cepat di Bawah Dropzone */}
      <div className="mt-auto pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          href="/user/dashboard/onboarding"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold transition-colors shrink-0"
        >
          <span>Buka Halaman Onboarding</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
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
