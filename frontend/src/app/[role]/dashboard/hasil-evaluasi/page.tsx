"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  FileSpreadsheet,
  ChevronDown,
  Check,
} from "lucide-react";
import { api } from "@/lib/api";
import { isValidDashboardRole } from "@/lib/routes";
import { CVAnalysisResult } from "@/types";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { CvEvaluationChat } from "@/components/evaluate/cv-evaluation-chat";
import { RiwayatChatSkeleton } from "@/components/ui/dashboard-skeleton";

export default function HasilEvaluasiPage() {
  const params = useParams<{ role: string }>();
  const router = useRouter();
  const role = params?.role || "";

  const [loading, setLoading] = useState(true);
  const [historyList, setHistoryList] = useState<CVAnalysisResult[]>([]);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [docMenuOpen, setDocMenuOpen] = useState(false);
  const docMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (docMenuRef.current && !docMenuRef.current.contains(e.target as Node)) {
        setDocMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isValidDashboardRole(role) || role !== "user") {
    notFound();
  }

  useEffect(() => {
    const history = api.getHistory();
    const current = api.getCurrentAnalysis();
    const combined = [...history];
    if (current && !combined.some((item) => item.cvId === current.cvId)) {
      combined.unshift(current);
    }
    setHistoryList(combined);
    setAnalysis(current || combined[0] || null);
    setLoading(false);
  }, []);

  if (loading) {
    return <RiwayatChatSkeleton />;
  }

  if (!analysis) {
    return (
      <main className="h-full min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 flex flex-col gap-6">
        <DashboardPageHeading
          badge="Hasil Evaluasi"
          titleLine1="Belum ada hasil evaluasi"
          titleLine2Prefix="untuk CV"
          titleHighlight="Anda saat ini!"
        />
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            Unggah berkas CV PDF/DOCX atau susun CV standar ATS melalui Onboarding Terpandu untuk melihat skor 5 dimensi dan berkonsultasi dengan AI.
          </p>
          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Link
              href="/user/dashboard/evaluasi"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
            >
              <UploadCloud className="w-4 h-4 shrink-0" />
              <span>Evaluasi CV</span>
            </Link>
            <Link
              href="/user/dashboard/evaluasi/onboarding"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <span>Onboarding CV</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isOnboardingCv = analysis.cvId.startsWith("cv-gen-") || !analysis.fileName;
  const needsRebuildRecommendation =
    !isOnboardingCv &&
    ((analysis.weaknesses?.length ?? 0) > 0 || (analysis.overallScore ?? 0) < 85);

  return (
    <div className="h-full min-h-0 overflow-hidden w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-3 flex flex-col gap-3">
      <div className="shrink-0 pb-3 border-b border-slate-200 space-y-2.5">
        <DashboardPageHeading
          badge={
            isOnboardingCv
              ? "Hasil Onboarding CV Baru"
              : "Hasil Unggah CV (PDF/DOCX)"
          }
          titleLine1="Diskusikan hasil evaluasi"
          titleLine2Prefix="untuk skor"
          titleHighlight="paling optimal!"
          rightSlot={
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {historyList.length > 1 && (
                <div className="relative w-full sm:w-auto" ref={docMenuRef}>
                  <button
                    type="button"
                    onClick={() => setDocMenuOpen((s) => !s)}
                    aria-label="Pilih dokumen hasil evaluasi"
                    aria-expanded={docMenuOpen}
                    aria-haspopup="listbox"
                    className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2.5 sm:py-2 rounded-xl border border-slate-200 hover:border-[#0f2c56] bg-white text-xs font-bold text-[#0f2c56] shadow-2xs transition-colors cursor-pointer sm:max-w-[230px]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-[#ce2731] shrink-0" />
                      <span className="truncate">
                        {analysis.fileName || analysis.profile?.fullName || "CV Tersimpan"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        docMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {docMenuOpen && (
                    <div
                      role="listbox"
                      aria-label="Daftar dokumen evaluasi CV"
                      className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 sm:w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 z-50 space-y-1 animate-page-enter"
                    >
                      <p className="px-2.5 pt-1 pb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Pilih Dokumen Evaluasi ({historyList.length})
                      </p>
                      {historyList.map((item) => {
                        const isSelected = item.cvId === analysis.cvId;
                        const label =
                          item.fileName || item.profile?.fullName || "CV Tersimpan";
                        return (
                          <button
                            key={item.cvId}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              api.saveAnalysis(item);
                              setAnalysis(item);
                              setDocMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-[#0f2c56] text-white"
                                : "text-[#0f2c56] hover:bg-[#edf2f9]"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected ? "text-white" : "text-[#ce2731]"
                                }`}
                              />
                              <span className="truncate">{label}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                  isSelected
                                    ? "bg-[#ce2731] text-white"
                                    : "bg-slate-100 text-[#0f2c56]"
                                }`}
                              >
                                {item.overallScore || 85}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/user/dashboard/dokumen"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors text-center"
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Dokumen CV ATS</span>
                </Link>
                <button
                  type="button"
                  onClick={() => router.push("/user/dashboard/evaluasi")}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Evaluasi CV Baru</span>
                </button>
              </div>
            </div>
          }
        />
        {needsRebuildRecommendation && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-[#edf2f9] px-4 py-2.5 text-xs text-[#0f2c56]">
            <span>
              <strong>Rekomendasi Sistem:</strong> Terdeteksi beberapa poin perbaikan pada CV unggahan Anda. Anda dapat menyusun ulang CV standar 1-kolom dan mengunduhnya melalui <strong>Dokumen CV ATS</strong>.
            </span>
            <Link
              href="/user/dashboard/dokumen"
              className="shrink-0 px-3 py-1.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white font-bold transition-colors"
            >
              Buat Ulang CV ATS
            </Link>
          </div>
        )}
      </div>
      <CvEvaluationChat analysis={analysis} />
    </div>
  );
}

