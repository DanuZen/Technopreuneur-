"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
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
  const [currentStep, setCurrentStep] = useState(1);

  const handleOnboardingSuccess = (result: CVAnalysisResult) => {
    api.saveAnalysis(result);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-full w-full bg-[#f8fafc] px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col gap-5">
      {/* Baris Atas: Navigasi Kembali ke Unggah CV */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/evaluate"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0f2c56] hover:text-white bg-white hover:bg-[#0f2c56] px-4 py-2 rounded-full border border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kembali ke Unggah Dokumen CV</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/evaluate"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white border border-slate-200 text-xs font-bold transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sudah Punya File CV? Unggah di Sini</span>
          </Link>
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0f2c56] px-3.5 py-2 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ce2731]" />
            <span>Generator CV ATS 1-Kolom</span>
          </div>
        </div>
      </div>

      {/* Kontainer Utama: 12-Column Asymmetric Bento Grid */}
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
    </div>
  );
}

