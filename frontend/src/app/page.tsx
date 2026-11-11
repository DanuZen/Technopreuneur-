"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle, Shield, ArrowDown } from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { CVQuestionnaireWizard } from "@/components/cv/cv-questionnaire-wizard";
import { CVAnalysisView } from "@/components/cv/cv-analysis-view";
import { ProductMockup } from "@/components/landing/product-mockup";
import { InteractiveWorkflow } from "@/components/landing/interactive-workflow";
import { PrinciplesGrid } from "@/components/landing/principles-grid";
import { FeaturesBento } from "@/components/landing/features-bento";
import { DarkCtaBanner } from "@/components/landing/dark-cta-banner";
import { CVAnalysisResult } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"upload" | "questionnaire">("upload");
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);

  const handleAnalysisSuccess = (result: CVAnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION with Minimal Left/Right Gaps */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto space-y-8 text-center">
        {/* Subtle animated background mesh matching reference */}
        <div
          className="absolute inset-0 -top-16 -z-10 mx-auto max-w-5xl h-[460px] opacity-40 blur-3xl pointer-events-none animate-hero-mesh"
          style={{
            background: "radial-gradient(circle at 50% 30%, rgba(203, 213, 225, 0.55) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Hero Title (Cadence inspired by reference "Ask. Discover. Do more") */}
        <div className="space-y-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Ukur. Temukan. <br className="hidden sm:inline" />
            <span className="text-slate-900">Wujudkan Karir Impian.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Platform evaluasi CV objektif 5 dimensi dan pencocokan lowongan kerja cerdas untuk fresh graduate dan talenta muda.
          </p>
        </div>

        {/* ONBOARDING ACTION CARD (Omnibar inspired floating card with expansive width) */}
        <div id="onboarding-section" className="max-w-4xl mx-auto scroll-mt-24 pt-2">
          {analysisResult ? (
            <CVAnalysisView analysis={analysisResult} onReset={handleReset} />
          ) : (
            <div className="space-y-4 p-3 sm:p-6 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-200/40 hover:border-slate-300 transition-all duration-300">
              {/* Dual-Mode Selector Pills */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-full max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-semibold transition-all duration-200 ${
                    activeTab === "upload"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
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
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Saya Belum Punya CV</span>
                </button>
              </div>

              {/* Dynamic Interactive Component with Smooth Fade In */}
              <div key={activeTab} className="pt-2 animate-fade-in-up">
                {activeTab === "upload" ? (
                  <CVDropzone onAnalysisComplete={handleAnalysisSuccess} />
                ) : (
                  <CVQuestionnaireWizard onComplete={handleAnalysisSuccess} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* ECOSYSTEM / TECH BADGES (Truthful technical replacement for fake logos) */}
        <div className="pt-6 border-t border-slate-100 max-w-4xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">
            Infrastruktur Berbasis Ekosistem Terbuka &amp; Kepatuhan Hukum
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              Next.js 14 App Router
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              FastAPI AI Service
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              PostgreSQL pgvector
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              Jooble Publisher API
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              UU PDP No. 27/2022
            </span>
          </div>
        </div>
      </section>

      {/* PRODUCT MOCKUP / APP PREVIEW (Matching "For building and beyond") */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <ProductMockup />
      </section>

      {/* INTERACTIVE WORKFLOW TABS (Matching "Every team gets smarter with X-Ai") */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <InteractiveWorkflow />
      </section>

      {/* 5-DIMENSIONS CRITERIA (Matching "Real Stories" slot) */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <PrinciplesGrid />
      </section>

      {/* ARCHITECTURE & ETHICS BENTO (Matching "Smarter Help for a Smoother Day") */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <FeaturesBento />
      </section>

      {/* PRE-FOOTER DARK ACCENT BANNER (Matching "Ready to Supercharge Your Productivity?") */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <DarkCtaBanner />
      </section>
    </div>
  );
}
