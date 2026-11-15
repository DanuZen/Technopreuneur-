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
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

function EvaluateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <div className="min-h-full max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between gap-6 flex-1">
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
