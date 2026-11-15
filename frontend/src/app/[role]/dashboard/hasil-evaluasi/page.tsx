"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { FileText, UploadCloud, FileSpreadsheet } from "lucide-react";
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
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/user/dashboard/evaluasi"
              className="morph-pill inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Evaluasi CV</span>
            </Link>
            <Link
              href="/user/dashboard/onboarding"
              className="morph-pill inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Onboarding CV</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-3 flex flex-col gap-4">
      <div className="shrink-0 pb-4 border-b border-slate-200">
        <DashboardPageHeading
          badge="Hasil & Konsultasi CV"
          titleLine1="Diskusikan hasil evaluasi"
          titleLine2Prefix="untuk skor"
          titleHighlight="paling optimal!"
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              {historyList.length > 1 && (
                <select
                  aria-label="Pilih dokumen hasil evaluasi"
                  value={analysis.cvId}
                  onChange={(e) => {
                    const found = historyList.find((h) => h.cvId === e.target.value);
                    if (found) {
                      api.saveAnalysis(found);
                      setAnalysis(found);
                    }
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                >
                  {historyList.map((item) => (
                    <option key={item.cvId} value={item.cvId}>
                      {item.fileName || item.profile?.fullName || "CV Tersimpan"}
                    </option>
                  ))}
                </select>
              )}
              <Link
                href="/user/dashboard/dokumen"
                className="morph-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat Dokumen CV ATS</span>
              </Link>
              <button
                type="button"
                onClick={() => router.push("/user/dashboard/evaluasi")}
                className="morph-pill inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Evaluasi CV Baru</span>
              </button>
            </div>
          }
        />
      </div>
      <CvEvaluationChat analysis={analysis} />
    </div>
  );
}
