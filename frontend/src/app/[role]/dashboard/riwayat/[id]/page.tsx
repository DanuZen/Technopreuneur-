"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { FileText, UploadCloud } from "lucide-react";
import { api } from "@/lib/api";
import { isValidDashboardRole } from "@/lib/routes";
import { CVAnalysisResult } from "@/types";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { CvEvaluationChat } from "@/components/evaluate/cv-evaluation-chat";

export default function RiwayatSesiDetailPage() {
  const params = useParams<{ role: string; id: string }>();
  const router = useRouter();
  const role = params?.role || "";
  const sessionId = decodeURIComponent(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  useEffect(() => {
    const stored = api.getAnalysisById(sessionId);
    if (stored) {
      api.saveAnalysis(stored);
      setAnalysis(stored);
    }
    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-6">
        <DashboardPageHeading
          badge="Riwayat Sesi"
          titleLine1="Sesi evaluasi CV"
          titleLine2Prefix="tidak"
          titleHighlight="ditemukan!"
        />
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            Sesi riwayat yang Anda pilih sudah dihapus atau belum tersedia. Silakan mulai evaluasi CV baru.
          </p>
          <Link
            href={`/${role}/dashboard/evaluasi`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Evaluasi CV Baru</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="h-full overflow-hidden w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-3 flex flex-col gap-4">
      <div className="shrink-0 pb-4 border-b border-slate-200/80">
        <DashboardPageHeading
          badge="Hasil & Konsultasi CV"
          titleLine1="Diskusikan hasil evaluasi"
          titleLine2Prefix="untuk skor"
          titleHighlight="paling optimal!"
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/${role}/dashboard/dokumen`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat Dokumen CV ATS</span>
              </Link>
              <button
                type="button"
                onClick={() => router.push(`/${role}/dashboard/evaluasi`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors cursor-pointer"
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
