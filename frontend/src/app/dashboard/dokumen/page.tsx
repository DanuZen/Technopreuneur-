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
  Ruler,
  FileCheck2,
  SlidersHorizontal,
  User,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult } from "@/types";
import { AtsCvPreview } from "@/components/dashboard/ats-cv-preview";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { DokumenPageSkeleton } from "@/components/ui/dashboard-skeleton";

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
    return <DokumenPageSkeleton />;
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
              href="/user/dashboard/evaluasi/onboarding"
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
    <main className="lg:h-full lg:overflow-hidden min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-3 flex flex-col gap-3 print:h-auto print:overflow-visible">
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
                onClick={() => router.push("/user/dashboard/evaluasi/onboarding")}
                className="px-4 py-2.5 bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
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

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch print:block">
        {/* Kolom Kiri: Panel Keterangan Solid Navy + Panduan Flat tanpa Card Bersarang */}
        <aside className="xl:col-span-5 min-h-0 flex flex-col justify-between gap-3 xl:overflow-hidden print:hidden">
          <div className="bg-[#0f2c56] text-white rounded-3xl p-4 sm:p-5 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Standar A4 ATS</span>
              </span>
              <span className="text-xs font-extrabold text-white">
                Skor {analysis.overallScore}/100
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <svg
                viewBox="0 0 96 112"
                className="w-14 h-auto shrink-0"
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
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight leading-snug text-white">
                  Keterangan Dokumen CV
                </h2>
                <p className="text-xs text-white mt-1 leading-relaxed">
                  Pratinjau di samping menggunakan proporsi kertas standar A4 (210 x 297 mm) dengan tata letak 1-kolom ramah ATS.
                </p>
              </div>
            </div>

            <div className="border-t border-white/15 divide-y divide-white/10 text-xs text-white">
              <div className="py-1.5 flex items-center justify-between gap-3">
                <span>Nama Kandidat</span>
                <span className="font-bold text-right truncate">
                  {analysis.profile.fullName}
                </span>
              </div>
              <div className="py-1.5 flex items-center justify-between gap-3">
                <span>Target Peran</span>
                <span className="font-bold text-right truncate">
                  {analysis.profile.headline || "Kandidat Profesional"}
                </span>
              </div>
              <div className="py-1.5 flex items-center justify-between gap-3">
                <span>Ukuran Kertas</span>
                <span className="font-bold">A4 (210 x 297 mm)</span>
              </div>
              <div className="pt-1.5 flex items-center justify-between gap-3">
                <span>Format Struktur</span>
                <span className="font-bold">1-Kolom Bersih</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 flex-1 min-h-0 flex flex-col justify-center gap-2.5 text-[#0f2c56]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                  <Printer className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider">
                    Panduan &amp; Tips Cetak PDF
                  </p>
                  <p className="text-[11px] font-medium">
                    Pastikan hasil ekspor siap lamaran kerja
                  </p>
                </div>
              </div>

              {/* Ilustrasi Mini Cetak PDF A4 */}
              <svg
                viewBox="0 0 88 64"
                className="w-16 h-auto shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="18" y="6" width="44" height="22" rx="4" fill="#EDF2F9" />
                <rect x="8" y="20" width="64" height="24" rx="7" fill="#0F2C56" />
                <circle cx="60" cy="28" r="2.5" fill="#CE2731" />
                <rect x="20" y="34" width="40" height="24" rx="4" fill="#FFFFFF" stroke="#0F2C56" strokeWidth="1.5" />
                <rect x="26" y="40" width="24" height="3" rx="1.5" fill="#0F2C56" />
                <rect x="26" y="46" width="28" height="2.5" rx="1.25" fill="#CBD5E1" />
                <rect x="26" y="51" width="20" height="2.5" rx="1.25" fill="#CBD5E1" />
                <rect x="52" y="44" width="28" height="14" rx="7" fill="#CE2731" />
                <path
                  d="M59 51L62 54L68 48"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="70" y="50" width="5" height="2" rx="1" fill="#FFFFFF" />
              </svg>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#edf2f9] text-[#0f2c56] flex items-center justify-center shrink-0 mt-0.5">
                  <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <p className="text-[11px] leading-snug">
                  <span className="font-bold">Proporsi A4 Akurat:</span> lebar 210 mm dan tinggi 297 mm agar hasil ekspor PDF tetap rapi saat dibuka rekruter.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#edf2f9] text-[#0f2c56] flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck2 className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <p className="text-[11px] leading-snug">
                  <span className="font-bold">100% Terbaca Parser ATS:</span> bebas tabel rumit, kolom ganda, maupun elemen grafis yang menghambat ekstraksi teks.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#edf2f9] text-[#0f2c56] flex items-center justify-center shrink-0 mt-0.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <p className="text-[11px] leading-snug">
                  <span className="font-bold">Pengaturan Cetak:</span> klik <span className="font-semibold">Cetak / Unduh PDF</span>, pilih ukuran <span className="font-semibold">A4</span>, lalu nonaktifkan opsi <span className="font-semibold">Headers and footers</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shrink-0 flex flex-col justify-center gap-2.5 text-[#0f2c56]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider">
                    Kelengkapan Bagian CV
                  </p>
                  <p className="text-[11px] font-medium">
                    4 komponen utama standar rekruter
                  </p>
                </div>
              </div>

              {/* Ilustrasi Mini Checklist Bagian CV */}
              <svg
                viewBox="0 0 88 64"
                className="w-16 h-auto shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="14" y="6" width="52" height="52" rx="8" fill="#EDF2F9" />
                <rect x="20" y="10" width="44" height="44" rx="6" fill="#FFFFFF" stroke="#0F2C56" strokeWidth="1.5" />
                <circle cx="28" cy="20" r="2.5" fill="#CE2731" />
                <rect x="34" y="18.5" width="22" height="3" rx="1.5" fill="#0F2C56" />
                <circle cx="28" cy="29" r="2.5" fill="#0F2C56" />
                <rect x="34" y="27.5" width="18" height="3" rx="1.5" fill="#CBD5E1" />
                <circle cx="28" cy="38" r="2.5" fill="#0F2C56" />
                <rect x="34" y="36.5" width="20" height="3" rx="1.5" fill="#CBD5E1" />
                <circle cx="28" cy="47" r="2.5" fill="#0F2C56" />
                <rect x="34" y="45.5" width="16" height="3" rx="1.5" fill="#CBD5E1" />
                <rect x="52" y="38" width="28" height="16" rx="8" fill="#CE2731" />
                <path
                  d="M60 46L63.5 49.5L71 42"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: "Ringkasan Profil", ok: Boolean(analysis.profile.summary), icon: User },
                { label: "Keahlian & Alat", ok: Boolean(analysis.profile.skills), icon: Award },
                {
                  label: "Pengalaman / Proyek",
                  ok: Boolean(analysis.profile.experiences?.length),
                  icon: Briefcase,
                },
                {
                  label: "Pendidikan Formal",
                  ok: Boolean(analysis.profile.education?.length),
                  icon: GraduationCap,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="text-xs font-bold flex items-center gap-2.5 text-[#0f2c56]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#edf2f9] text-[#0f2c56] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
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

