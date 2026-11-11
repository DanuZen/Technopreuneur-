"use client";

import { useState } from "react";
import { Sparkles, FileText, CheckCircle2, ArrowRight, UploadCloud, HelpCircle } from "lucide-react";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { CVQuestionnaireWizard } from "@/components/cv/cv-questionnaire-wizard";
import { CVAnalysisView } from "@/components/cv/cv-analysis-view";
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
    <main className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* Header & Hero */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          CareerMatch AI Platform · Technopreneurship 2026
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
          Ukur Kualitas CV Anda. <br className="hidden sm:inline" />
          <span className="text-blue-600">Temukan Karir yang Benar-Benar Cocok.</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Punya CV? Unggah untuk evaluasi 5 dimensi objektif. Belum punya CV? Jawab kuesioner singkat agar AI kami yang menyusun CV digital dan mencocokkan lowongan terbaik untuk Anda.
        </p>
      </header>

      {/* Main Interaction Area */}
      <section className="max-w-3xl mx-auto">
        {analysisResult ? (
          <CVAnalysisView analysis={analysisResult} onReset={handleReset} />
        ) : (
          <div className="space-y-6">
            {/* 2-Option Tabs Switcher */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 max-w-lg mx-auto shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === "upload"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Saya Sudah Punya CV</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("questionnaire")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === "questionnaire"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Saya Belum Punya CV</span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "upload" ? (
              <CVDropzone onAnalysisComplete={handleAnalysisSuccess} />
            ) : (
              <CVQuestionnaireWizard onComplete={handleAnalysisSuccess} />
            )}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base mb-1.5">Skor Kualitas 5 Dimensi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluasi menyeluruh mencakup struktur format ATS, kejelasan teks, dampak terukur, relevansi keahlian, dan kelengkapan data.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base mb-1.5">AI Resume Builder Otomatis</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pencari kerja tanpa resume dapat menjawab 4 langkah kuesioner ringkas untuk dirangkai menjadi profil terstandar industri.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <ArrowRight className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base mb-1.5">Pencocokan Loker Dua Tahap</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kombinasi penyaringan semantik pgvector dan re-ranking LLM Gemini menyajikan persentase kecocokan beserta daftar gap skill.
          </p>
        </div>
      </section>
    </main>
  );
}
