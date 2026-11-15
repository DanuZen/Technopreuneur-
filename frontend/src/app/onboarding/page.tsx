"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  UploadCloud,
  CheckCircle2,
  FileCheck2,
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileSpreadsheet,
} from "lucide-react";
import { AtsOnboardingWizard } from "@/components/dashboard/ats-onboarding-wizard";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

const ONBOARDING_STEPS = [
  {
    num: 1,
    title: "Identitas & Kontak Resmi",
    desc: "Nama lengkap, email aktif, telepon, dan tautan portofolio",
    icon: User,
  },
  {
    num: 2,
    title: "Riwayat Pendidikan Formal",
    desc: "Jenjang studi, institusi kampus/sekolah, dan jurusan",
    icon: GraduationCap,
  },
  {
    num: 3,
    title: "Target Posisi & Fokus Karir",
    desc: "Peran spesifik yang dituju untuk penyelarasan kata kunci",
    icon: Briefcase,
  },
  {
    num: 4,
    title: "Keahlian Teknis & Alat Kerja",
    desc: "Kompetensi teknis, bahasa pemrograman, dan perangkat lunak",
    icon: Award,
  },
  {
    num: 5,
    title: "Pengalaman & Proyek Nyata",
    desc: "Magang, organisasi, atau tugas akhir dengan dampak terukur",
    icon: FileSpreadsheet,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleOnboardingSuccess = (result: CVAnalysisResult) => {
    api.saveAnalysis(result);
    router.push(`/user/dashboard/riwayat/${encodeURIComponent(result.cvId)}`);
  };

  return (
    <div className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 flex flex-col gap-5">
      <DashboardPageHeading
        badge="Onboarding CV ATS"
        titleLine1="Susun dokumen CV standar"
        titleLine2Prefix="dengan struktur"
        titleHighlight="ATS 1-kolom!"
        rightSlot={
          hasStarted ? (
            <button
              type="button"
              onClick={() => setHasStarted(false)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0f2c56] hover:text-white bg-white hover:bg-[#0f2c56] px-4 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Kembali ke Ringkasan</span>
            </button>
          ) : undefined
        }
      />

      {!hasStarted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          {/* Kolom Kiri: Panel Pengantar Solid Navy tanpa Card Bersarang */}
          <div className="lg:col-span-7 bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-3.5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider">
                <span>Belum Punya CV</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug font-heading">
                Buat CV Profesional dari Nol dalam 5 Langkah Singkat
              </h2>
              <p className="text-xs sm:text-sm text-white leading-relaxed max-w-xl">
                Tidak perlu bingung memikirkan desain atau format. Cukup lengkapi informasi diri, pendidikan, keahlian, dan pengalaman Anda, lalu sistem Pasbana AI akan menyusun CV standar ATS 1-kolom yang siap dipakai melamar kerja.
              </p>
            </div>

            {/* Ilustrasi Proses Penyusunan CV ATS (Langsung di atas permukaan Navy) */}
            <div className="py-4 border-y border-white/15 flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0">
                <svg
                  viewBox="0 0 220 156"
                  className="w-48 sm:w-52 h-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Decorative dots */}
                  <circle cx="20" cy="24" r="3" fill="#CE2731" />
                  <circle cx="198" cy="132" r="4" fill="#FFFFFF" fillOpacity="0.25" />
                  <circle cx="186" cy="20" r="2.5" fill="#FFFFFF" fillOpacity="0.35" />

                  {/* Back sheet */}
                  <rect x="26" y="18" width="136" height="126" rx="12" fill="#1E3F73" />
                  {/* Main A4 CV sheet */}
                  <rect x="38" y="10" width="136" height="132" rx="12" fill="#FFFFFF" />
                  <rect x="52" y="24" width="62" height="8" rx="4" fill="#0F2C56" />
                  <rect x="52" y="37" width="90" height="4" rx="2" fill="#94A3B8" />
                  <rect x="52" y="48" width="108" height="1.5" fill="#E2E8F0" />

                  <rect x="52" y="57" width="44" height="5" rx="2.5" fill="#CE2731" />
                  <rect x="52" y="67" width="106" height="4" rx="2" fill="#CBD5E1" />
                  <rect x="52" y="75" width="88" height="4" rx="2" fill="#CBD5E1" />

                  <rect x="52" y="88" width="52" height="5" rx="2.5" fill="#0F2C56" />
                  <circle cx="55" cy="100" r="2.5" fill="#CE2731" />
                  <rect x="62" y="98" width="92" height="4" rx="2" fill="#CBD5E1" />
                  <circle cx="55" cy="110" r="2.5" fill="#CE2731" />
                  <rect x="62" y="108" width="76" height="4" rx="2" fill="#CBD5E1" />
                  <circle cx="55" cy="120" r="2.5" fill="#CE2731" />
                  <rect x="62" y="118" width="84" height="4" rx="2" fill="#CBD5E1" />

                  {/* Floating verified badge */}
                  <rect x="134" y="18" width="66" height="24" rx="12" fill="#CE2731" />
                  <path
                    d="M146 30L149.5 33.5L156 26.5"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="161" y="28" width="26" height="4" rx="2" fill="#FFFFFF" />
                </svg>
              </div>

              <div className="space-y-3 flex-1 min-w-0">
                <p className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
                  Output Dokumen Standar Rekruter
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <p className="text-xs text-white leading-snug">
                      <span className="font-bold">Struktur 1-Kolom Rapi:</span> bebas tabel rumit agar mudah dipindai mesin ATS.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <p className="text-xs text-white leading-snug">
                      <span className="font-bold">Panduan Kalimat Dampak:</span> dilengkapi contoh penulisan pengalaman yang terukur.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <p className="text-xs text-white leading-snug">
                      <span className="font-bold">Siap Cetak &amp; Evaluasi:</span> langsung tersimpan ke Dokumen CV ATS dan Riwayat Sesi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setHasStarted(true)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#ce2731] hover:bg-white text-white hover:text-[#0f2c56] text-xs sm:text-sm font-extrabold transition-colors cursor-pointer"
              >
                <span>Mulai Susun CV Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-2 text-xs text-white font-medium px-2">
                <FileCheck2 className="w-4 h-4 text-white" />
                <span>Estimasi 3 sampai 5 menit</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Daftar Tahapan Flat tanpa Card Bersarang */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 py-1 text-[#0f2c56]">
            <div className="flex-1 flex flex-col gap-3">
              <p className="text-base sm:text-lg font-heading font-extrabold tracking-tight text-[#0f2c56] shrink-0">
                Tahapan Kuesioner (5 Langkah)
              </p>
              <div className="flex-1 flex flex-col divide-y divide-slate-200/80 border-y border-slate-200/80">
                {ONBOARDING_STEPS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.num}
                      className="flex-1 py-3 flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-extrabold truncate">
                          {item.num}. {item.title}
                        </p>
                        <p className="text-xs truncate">{item.desc}</p>
                      </div>
                      <span className="text-[11px] font-mono font-bold shrink-0">
                        0{item.num}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Kontainer Utama: 12-Column Asymmetric Bento Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1">
        {/* Kolom Kiri (5 Kolom): Panduan 5 Langkah Onboarding Solid Navy */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-7 flex flex-col justify-between flex-1">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider mb-4">
                <span>Belum Punya CV</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-[1.15] mb-3 font-heading">
                Susun CV Standar ATS{" "}
                <span className="inline-block bg-[#ce2731] text-white px-3 py-0.5 rounded-xl mt-1">
                  dari Kuesioner.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
                Jawab 5 langkah singkat berikut. Sistem kami akan menyusun dokumen CV 1-kolom berstandar ATS sekaligus menghitung skor kesiapan karir Anda.
              </p>

              {/* Daftar 5 Tahap Onboarding */}
              <div className="space-y-2.5">
                {ONBOARDING_STEPS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentStep === item.num;
                  const isDone = currentStep > item.num;
                  return (
                    <div
                      key={item.num}
                      className={`p-3 rounded-2xl flex items-center gap-3 transition-colors ${
                        isActive
                          ? "bg-white text-[#0f2c56]"
                          : isDone
                          ? "bg-[#ce2731] text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs ${
                          isActive
                            ? "bg-[#ce2731] text-white"
                            : isDone
                            ? "bg-white text-[#ce2731]"
                            : "bg-white/15 text-white"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-extrabold truncate ${
                            isActive ? "text-[#0f2c56]" : "text-white"
                          }`}
                        >
                          {item.num}. {item.title}
                        </p>
                        <p
                          className={`text-[11px] truncate ${
                            isActive ? "text-slate-500" : "text-white/75"
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kartu Info Output ATS (Solid Crimson) */}
          <div className="bg-[#ce2731] text-white rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white text-[#ce2731] flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white leading-tight">
                Langsung Dapat Dokumen CV Siap Cetak
              </p>
              <p className="text-xs text-white/85 mt-0.5 leading-snug">
                Hasil kuesioner dapat langsung disalin atau dicetak menjadi PDF bersih di Dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (7 Kolom): Formulir Onboarding Interaktif */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 flex flex-col justify-between">
          <AtsOnboardingWizard
            onComplete={handleOnboardingSuccess}
            onStepChange={setCurrentStep}
          />
        </div>
      </div>
      )}

      {/* Banner Pintasan Evaluasi CV di Bawah */}
      <div className="mt-auto pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-[#0f2c56]">
              Sudah memiliki file CV yang siap diunggah?
            </p>
            <p className="text-xs text-slate-500">
              Unggah berkas PDF atau DOCX Anda langsung melalui halaman Evaluasi CV.
            </p>
          </div>
        </div>

        <Link
          href="/user/dashboard/evaluasi"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold transition-colors shrink-0"
        >
          <span>Buka Halaman Evaluasi</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

