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
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Redam-style Ambient Node & Mesh Background */}
      <AmbientBackground />

      <main className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-16 space-y-8 animate-fade-in-up">
        {/* Navigation Bar / Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary transition bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-xs text-primary font-bold bg-blue-100/70 border border-blue-200 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Format ATS Terverifikasi</span>
          </div>
        </div>

        {/* HERO GREETING (Redam Pattern: Brand Avatar + Speech Bubble + Prompt Question) */}
        <div className="max-w-3xl mx-auto">
          <HeroGreeting />
        </div>

        {/* FLOATING ACTION STAGE CARD (Redam Pattern: Rounded tactile well card) */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="rounded-[32px] sm:rounded-[36px] clay-card border-2 border-blue-200/80 p-5 sm:p-9 space-y-6">
            {/* Dual-Mode Selector Pills (Well Container) */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#edf2f9] rounded-full max-w-md mx-auto border border-blue-200/80 shadow-[inset_0_2px_4px_rgba(15,44,86,0.06)]">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === "upload"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-primary hover:text-secondary font-semibold"
                }`}
              >
                <UploadCloud className="w-4 h-4" aria-hidden="true" />
                <span>Saya Sudah Punya CV</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("questionnaire")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold transition-all duration-200 ${
                  activeTab === "questionnaire"
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-primary hover:text-secondary font-semibold"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                <span>Saya Belum Punya CV</span>
              </button>
            </div>

            {/* Dynamic Interactive Stage Area */}
            <div key={activeTab} className="pt-1 animate-fade-in-up">
              {activeTab === "upload" ? (
                <div className="space-y-4">
                  <CVDropzone onAnalysisComplete={handleAnalysisSuccess} />
                </div>
              ) : (
                <div className="space-y-4">
                  <AtsOnboardingWizard onComplete={handleAnalysisSuccess} />
                </div>
              )}
            </div>
          </div>

          {/* QUICK SCENARIO CHIPS (Redam Pattern: Quick Action Carousel) */}
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
