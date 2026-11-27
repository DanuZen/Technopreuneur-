"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileSpreadsheet,
  ArrowUpRight,
  UploadCloud,
  X,
} from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { DashboardPageSkeleton } from "@/components/ui/dashboard-skeleton";
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";
import { ModalShell } from "@/components/ui/modal-shell";

function EvaluateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showCvOwnershipPrompt, setShowCvOwnershipPrompt] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "questionnaire" || tabParam === "onboarding") {
      router.replace("/user/dashboard/evaluasi/onboarding");
      return;
    }

    try {
      const prompted = sessionStorage.getItem("pasbana_cv_check_prompted");
      const history = api.getHistory();
      if (!prompted && history.length === 0) {
        setShowCvOwnershipPrompt(true);
      }
    } catch {
      // ignore
    }
  }, [searchParams, router]);

  const dismissPrompt = (goOnboarding = false) => {
    try {
      sessionStorage.setItem("pasbana_cv_check_prompted", "1");
    } catch {
      // ignore
    }
    setShowCvOwnershipPrompt(false);
    if (goOnboarding) {
      router.push("/user/dashboard/evaluasi/onboarding");
    }
  };

  const handleAnalysisSuccess = (result: CVAnalysisResult) => {
    api.saveAnalysis(result);
    router.push("/user/dashboard/hasil-evaluasi");
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
          href="/user/dashboard/evaluasi/onboarding"
          className="morph-pill inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold shrink-0"
        >
          <span>Buka Halaman Onboarding</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {showCvOwnershipPrompt && (
        <ModalShell
          onClose={() => dismissPrompt(false)}
          ariaLabel="Pengecekan awal CV"
          badge="Evaluasi CV ATS"
          headerPills={
            <>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 text-white/95 text-[10px] font-bold uppercase tracking-wider">
                5 Dimensi AI
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 text-white/95 text-[10px] font-bold uppercase tracking-wider">
                Standar HRD
              </span>
            </>
          }
          title="Apakah Anda sudah memiliki berkas CV?"
          subtitle="Pilih metode persiapan yang sesuai dengan kondisi dokumen Anda saat ini."
          size="md"
          footer={
            <button
              type="button"
              onClick={() => dismissPrompt(false)}
              className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-white border border-slate-200 text-[#0f2c56] hover:border-[#0f2c56] text-xs font-bold transition-colors cursor-pointer"
            >
              Lanjutkan ke Halaman Unggah CV
            </button>
          }
        >
          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => dismissPrompt(false)}
              className="w-full p-4 rounded-2xl bg-[#0f2c56] hover:bg-[#173d74] text-white text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-extrabold">Sudah Punya CV</p>
                <p className="text-[11px] text-slate-200">
                  Unggah dokumen PDF atau DOCX untuk dianalisis AI
                </p>
              </div>
              <UploadCloud className="w-5 h-5 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => dismissPrompt(true)}
              className="w-full p-4 rounded-2xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-extrabold">Belum Punya CV</p>
                <p className="text-[11px] text-white/90">
                  Susun CV standar ATS 1-kolom dari nol melalui Onboarding
                </p>
              </div>
              <FileSpreadsheet className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </ModalShell>
      )}
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
