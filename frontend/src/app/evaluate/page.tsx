"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileSpreadsheet,
  ArrowUpRight,
} from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { DashboardPageSkeleton } from "@/components/ui/dashboard-skeleton";
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
    router.push(`/user/dashboard/riwayat/${encodeURIComponent(result.cvId)}`);
  };

  return (
    <div className="relative min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 flex flex-col gap-6 overflow-hidden">
      {/* Ambient Morphing Background Shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 bg-[#0f2c56]/[0.04] blur-2xl animate-morph-blob"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 -left-20 h-60 w-60 bg-[#ce2731]/[0.04] blur-2xl animate-morph-blob-slow"
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center gap-6 py-4">
        <DashboardPageHeading
          badge="Evaluasi Berkas Digital"
          titleLine1="Uji kualitas dokumen CV"
          titleLine2Prefix="dengan analisis"
          titleHighlight="standar ATS!"
          align="center"
        />

        {/* Area Unggah Dokumen CV */}
        <div className="w-full max-w-3xl mx-auto">
          <CVDropzone autoRedirect={false} onAnalysisComplete={handleAnalysisSuccess} />
        </div>
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
          href="/user/dashboard/onboarding"
          className="morph-pill inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold shrink-0"
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
    <Suspense fallback={<DashboardPageSkeleton />}>
      <EvaluateContent />
    </Suspense>
  );
}
