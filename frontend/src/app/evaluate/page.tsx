"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { AtsOnboardingWizard } from "@/components/dashboard/ats-onboarding-wizard";
import { AmbientBackground } from "@/components/evaluate/ambient-background";
import { HeroGreeting } from "@/components/evaluate/hero-greeting";
import { QuickScenarioChips } from "@/components/evaluate/quick-scenario-chips";
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
    <div className="relative h-full w-full flex flex-col justify-between items-center overflow-hidden py-3 sm:py-4 px-3 sm:px-6 select-none">
      {/* Redam-style Ambient Node & Mesh Background */}
      <AmbientBackground />

      <main className="relative z-10 max-w-4xl w-full flex flex-col justify-between h-full my-auto gap-2 sm:gap-3 animate-fade-in-up">
        {/* Navigation Bar / Breadcrumb (Compact) */}
        <div className="flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-primary transition bg-white/80 hover:bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-3 h-3" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-primary font-bold bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Format ATS Terverifikasi</span>
          </div>
        </div>

        {/* HERO GREETING (Compact) */}
        <div className="shrink-0">
          <HeroGreeting />
        </div>

        {/* FLOATING ACTION STAGE CARD (Fitted & Responsive) */}
        <div className="shrink-0 w-full space-y-2 sm:space-y-2.5">
          <div className="rounded-[24px] sm:rounded-[30px] clay-card border border-blue-200/80 p-3.5 sm:p-5 space-y-3 shadow-xl">
            {/* Dual-Mode Selector Pills (Well Container) */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#edf2f9] rounded-full max-w-sm mx-auto border border-blue-200/80 shadow-[inset_0_2px_4px_rgba(15,44,86,0.06)]">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === "upload"
                    ? "bg-primary text-white shadow-xs shadow-primary/25"
                    : "text-primary hover:text-secondary font-semibold"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Saya Sudah Punya CV</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("questionnaire")}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === "questionnaire"
                    ? "bg-primary text-white shadow-xs shadow-primary/25"
                    : "text-primary hover:text-secondary font-semibold"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Saya Belum Punya CV</span>
              </button>
            </div>

            {/* Dynamic Interactive Stage Area */}
            <div key={activeTab} className="pt-0.5">
              {activeTab === "upload" ? (
                <CVDropzone onAnalysisComplete={handleAnalysisSuccess} />
              ) : (
                <div className="max-h-[38vh] sm:max-h-[44vh] overflow-y-auto scrollbar-halus pr-1">
                  <AtsOnboardingWizard onComplete={handleAnalysisSuccess} />
                </div>
              )}
            </div>
          </div>

          {/* QUICK SCENARIO CHIPS */}
          <QuickScenarioChips
            sedangMemproses={isProcessingDemo}
            onPilihSampel={handleRunDemoSample}
            onPilihWizard={() => setActiveTab("questionnaire")}
            onPilihInfoATS={() => setActiveTab("upload")}
          />
        </div>
      </main>
    </div>
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
