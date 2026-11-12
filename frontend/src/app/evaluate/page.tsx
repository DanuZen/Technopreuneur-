"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCloud, FileSpreadsheet, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

function EvaluateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"upload" | "questionnaire">("upload");

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

  return (
    <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16 space-y-10 animate-fade-in-up">
      {/* Back to Home Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Page Title & Context */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span>Pasbana AI: Evaluasi Kesiapan Karir &amp; Standar ATS</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-primary leading-tight">
          Ukur Kualitas CV Anda Secara Objektif
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Pilih metode evaluasi: unggah berkas resume digital untuk dipindai atau gunakan alur onboarding mandiri jika Anda belum memiliki berkas CV.
        </p>
      </div>

      {/* CORE ACTION CARD (The Standalone Card) */}
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6 p-4 sm:p-8 rounded-3xl bg-[#fefefd] border border-slate-200/90 shadow-xl shadow-slate-200/40 hover:border-slate-300 transition-all duration-300">
          {/* Dual-Mode Selector Pills */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeTab === "upload"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Saya Sudah Punya CV</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("questionnaire")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeTab === "questionnaire"
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Saya Belum Punya CV</span>
            </button>
          </div>

          {/* Dynamic Component Area */}
          <div key={activeTab} className="pt-2 animate-fade-in-up">
            {activeTab === "upload" ? (
              <CVDropzone onAnalysisComplete={handleAnalysisSuccess} />
            ) : (
              <div className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <FileSpreadsheet className="w-6 h-6" aria-hidden="true" />
                </div>

                <div className="space-y-1.5 max-w-lg mx-auto">
                  <h2 className="text-base sm:text-lg font-bold text-primary">
                    Belum Memiliki Berkas CV Siap Pakai?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Sistem kami memandu Anda menyusun resume berstandar industri ATS (1-kolom, ramah parser mesin rekrutmen) melalui alur onboarding 5 tahap terstruktur.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard?onboarding=true")}
                    className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-[#163861] text-white text-xs sm:text-sm font-semibold rounded-full shadow-md transition flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Mulai Onboarding CV ATS di Dashboard</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TECH & LEGAL BADGES */}
      <div className="pt-6 border-t border-slate-100 max-w-4xl mx-auto text-center space-y-3">
        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          Infrastruktur Berbasis Ekosistem Terbuka &amp; Kepatuhan Hukum
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 font-mono text-[11px]">
            Next.js 14 App Router
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 font-mono text-[11px]">
            FastAPI AI Service
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 font-mono text-[11px]">
            PostgreSQL pgvector
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 font-mono text-[11px]">
            Jooble Publisher API
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 font-mono text-[11px]">
            UU PDP No. 27/2022
          </span>
        </div>
      </div>
    </main>
  );
}

export default function EvaluatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EvaluateContent />
    </Suspense>
  );
}

