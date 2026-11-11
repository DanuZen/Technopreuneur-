"use client";

import Link from "next/link";
import { CheckCircle2, AlertTriangle, Lightbulb, ShieldCheck, RefreshCw } from "lucide-react";
import { CVAnalysisResult } from "@/types";

interface CVAnalysisViewProps {
  analysis: CVAnalysisResult;
  onReset?: () => void;
}

export function CVAnalysisView({ analysis, onReset }: CVAnalysisViewProps) {
  const { overallScore, dimensions, strengths, weaknesses, recommendations, profile } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 border-emerald-500 bg-emerald-50";
    if (score >= 60) return "text-amber-600 border-amber-500 bg-amber-50";
    return "text-rose-600 border-rose-500 bg-rose-50";
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 animate-fadeIn">
      {/* Header Result */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
            Hasil Evaluasi AI Objektif (Blind Scoring)
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Profil: {profile.fullName || "Pencari Kerja"}
          </h2>
          <p className="text-xs text-slate-500 max-w-md">
            Skor dihitung berdasarkan 5 dimensi kualitas industri tanpa mempertimbangkan faktor usia, foto, atau gender.
          </p>
        </div>

        {/* Score Badge */}
        <div className="flex items-center gap-4">
          <div className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center shadow-sm ${getScoreColor(overallScore)}`}>
            <span className="text-3xl font-black tracking-tight">{overallScore}</span>
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
              Skor Kualitas
            </span>
          </div>
        </div>
      </div>

      {/* 5 Dimensions Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
          Rincian 5 Dimensi Evaluasi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DimensionBar label="Struktur & Format (ATS-Friendly)" score={dimensions.structure} getBarColor={getBarColor} />
          <DimensionBar label="Kejelasan Deskripsi Karir" score={dimensions.clarity} getBarColor={getBarColor} />
          <DimensionBar label="Pencapaian Terukur (Action Verbs & Angka)" score={dimensions.measurableImpact} getBarColor={getBarColor} />
          <DimensionBar label="Relevansi Keahlian (Skills Fit)" score={dimensions.skillRelevance} getBarColor={getBarColor} />
          <div className="sm:col-span-2">
            <DimensionBar label="Kelengkapan Informasi Profil" score={dimensions.completeness} getBarColor={getBarColor} />
          </div>
        </div>
      </div>

      {/* 3 Columns: Strengths, Weaknesses, Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Kelebihan CV
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs uppercase tracking-wider font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Area Perbaikan
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable Recommendations */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-800 font-semibold text-xs uppercase tracking-wider font-mono">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            Saran Aksi Konkret
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Analisa Dokumen / Isi Kuesioner Ulang
          </button>
        )}

        <Link
          href="/jobs"
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center transition min-h-[44px]"
        >
          Lihat Lowongan Kerja yang Cocok
        </Link>
      </div>
    </div>
  );
}

function DimensionBar({
  label,
  score,
  getBarColor,
}: {
  label: string;
  score: number;
  getBarColor: (score: number) => string;
}) {
  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-mono font-bold text-slate-900">{score}%</span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
        />
      </div>
    </div>
  );
}

