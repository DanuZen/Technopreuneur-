"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileSpreadsheet,
  ArrowUpRight,
  Edit3,
  Printer,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult } from "@/types";
import { AtsCvPreview } from "@/components/dashboard/ats-cv-preview";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";

export default function DokumenCvAtsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);

  useEffect(() => {
    const current = api.getCurrentAnalysis();
    if (current) {
      setAnalysis(current);
    }
    setLoading(false);
  }, []);

  const handleLoadSampleAnalysis = async () => {
    setLoading(true);
    try {
      const demoFile = new File(
        ["Demo CV Wira Fikri ATS Standard"],
        "CV_Wira_Fikri_ATS_Standard.pdf",
        { type: "application/pdf" }
      );
      const result = await api.uploadCV(demoFile);
      api.saveAnalysis(result);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#0f2c56] font-bold font-mono">
          Memuat dokumen CV standar ATS...
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-6">
        <DashboardPageHeading
          badge="Dokumen CV ATS"
          titleLine1="Pratinjau & cetak CV"
          titleLine2Prefix="dengan format"
          titleHighlight="siap lamaran!"
        />
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold uppercase tracking-wider">
              Dokumen CV ATS
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2c56] font-heading">
              Dokumen CV Standar ATS Belum Tersedia
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unggah CV Anda di halaman Evaluasi CV atau susun melalui Onboarding CV ATS untuk melihat pratinjau dokumen standar ATS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/user/dashboard/evaluasi"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Evaluasi CV</span>
            </Link>
            <Link
              href="/user/dashboard/onboarding"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Onboarding CV ATS</span>
            </Link>
            <button
              type="button"
              onClick={handleLoadSampleAnalysis}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#0f2c56] text-[#0f2c56] hover:bg-[#0f2c56] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Muat Sampel CV Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="xl:h-full xl:overflow-hidden min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 flex flex-col gap-4 print:h-auto print:overflow-visible">
      <div className="shrink-0">
        <DashboardPageHeading
          badge="Dokumen CV ATS"
          titleLine1="Pratinjau & cetak CV"
          titleLine2Prefix="dengan format"
          titleHighlight="siap lamaran!"
          rightSlot={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/user/dashboard/onboarding")}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#0f2c56] text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Edit Data</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Cetak / Unduh PDF</span>
              </button>
            </div>
          }
        />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch print:block">
        {/* Kolom Kiri: Panel Keterangan Solid Navy + Panduan Flat tanpa Card Bersarang */}
        <aside className="xl:col-span-5 flex flex-col justify-between gap-4 xl:overflow-y-auto scrollbar-none print:hidden">
          <div className="bg-[#0f2c56] text-white rounded-3xl p-5 sm:p-6 space-y-4 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Standar A4 ATS</span>
              </span>
              <span className="text-xs font-extrabold text-white/80">
                Skor {analysis.overallScore}/100
              </span>
            </div>

            <div className="flex items-center gap-4">
              <svg
                viewBox="0 0 96 112"
                className="w-16 h-auto shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="8" y="4" width="80" height="104" rx="8" fill="#FFFFFF" />
                <rect x="16" y="12" width="64" height="88" rx="4" stroke="#CBD5E1" strokeDasharray="3 3" />
                <rect x="26" y="20" width="44" height="6" rx="3" fill="#0F2C56" />
                <rect x="32" y="30" width="32" height="3" rx="1.5" fill="#94A3B8" />
                <rect x="22" y="42" width="28" height="4" rx="2" fill="#CE2731" />
                <rect x="22" y="50" width="52" height="3" rx="1.5" fill="#CBD5E1" />
                <rect x="22" y="56" width="46" height="3" rx="1.5" fill="#CBD5E1" />
                <rect x="22" y="68" width="32" height="4" rx="2" fill="#0F2C56" />
                <rect x="22" y="76" width="52" height="3" rx="1.5" fill="#CBD5E1" />
                <rect x="22" y="82" width="40" height="3" rx="1.5" fill="#CBD5E1" />
              </svg>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight leading-snug">
                  Keterangan Dokumen CV
                </h2>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Pratinjau di samping menggunakan proporsi kertas standar A4 (210 x 297 mm) dengan tata letak 1-kolom ramah ATS.
                </p>
              </div>
            </div>

            <div className="border-t border-white/15 divide-y divide-white/10 text-xs">
              <div className="py-2 flex items-center justify-between gap-3">
                <span className="text-white/70">Nama Kandidat</span>
                <span className="font-bold text-white text-right truncate">
                  {analysis.profile.fullName}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <span className="text-white/70">Target Peran</span>
                <span className="font-bold text-white text-right truncate">
                  {analysis.profile.headline || "Kandidat Profesional"}
                </span>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <span className="text-white/70">Ukuran Kertas</span>
                <span className="font-bold text-white">A4 (210 x 297 mm)</span>
              </div>
              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-white/70">Format Struktur</span>
                <span className="font-bold text-white">1-Kolom Bersih</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-3 px-1">
            <div className="space-y-2.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0f2c56]">
                Panduan &amp; Tips Cetak PDF
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ce2731] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-[#0f2c56]">Proporsi A4 Akurat:</span> lebar 210 mm dan tinggi 297 mm agar hasil ekspor PDF tetap rapi saat dibuka rekruter.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ce2731] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-[#0f2c56]">100% Terbaca Parser ATS:</span> bebas tabel rumit, kolom ganda, maupun elemen grafis yang menghambat ekstraksi teks.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ce2731] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-[#0f2c56]">Pengaturan Cetak:</span> klik <span className="font-semibold">Cetak / Unduh PDF</span>, pilih ukuran <span className="font-semibold">A4</span>, lalu nonaktifkan opsi <span className="font-semibold">Headers and footers</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Kelengkapan Bagian CV
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: "Ringkasan Profil", ok: Boolean(analysis.profile.summary) },
                  { label: "Keahlian & Alat", ok: Boolean(analysis.profile.skills) },
                  {
                    label: "Pengalaman / Proyek",
                    ok: Boolean(analysis.profile.experiences?.length),
                  },
                  {
                    label: "Pendidikan Formal",
                    ok: Boolean(analysis.profile.education?.length),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`text-xs font-bold flex items-center gap-2 ${
                      item.ok ? "text-[#0f2c56]" : "text-slate-400"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        item.ok ? "text-[#0f2c56]" : "text-slate-300"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Kolom Kanan: Lembar Dokumen CV Ukuran A4 Langsung tanpa Card Pembungkus */}
        <div className="xl:col-span-7 min-h-0 h-full w-full print:block">
          <AtsCvPreview
            profile={analysis.profile}
            hideToolbar
            fitViewport
          />
        </div>
      </div>
    </main>
  );
}

