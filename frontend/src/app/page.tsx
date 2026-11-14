"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  FileCheck,
  FileSpreadsheet,
  Rocket,
  ShieldCheck,
  Target,
  Briefcase,
  BarChart3,
  Clock,
  Lock,
} from "lucide-react";

interface WorkflowStepItem {
  stepIndex: number;
  tabLabel: string;
  tabSub: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

const WORKFLOW_STEPS: WorkflowStepItem[] = [
  {
    stepIndex: 1,
    tabLabel: "Cek Format ATS",
    tabSub: "Bebas Gagal Baca",
    title: "Pastikan CV Lolos Seleksi Awal",
    description:
      "Banyak kandidat gugur bukan karena kurang kompeten, melainkan format CV yang sulit dibaca sistem rekrutmen. Unggah CV Anda atau susun dari nol lewat panduan kuesioner praktis.",
    ctaText: "Cek CV Saya Sekarang",
    ctaHref: "/evaluate",
  },
  {
    stepIndex: 2,
    tabLabel: "Skor 5 Dimensi",
    tabSub: "Saran Perbaikan",
    title: "Ketahui Bagian yang Perlu Diperkuat",
    description:
      "Bukan sekadar angka tunggal. Anda mendapatkan rincian nilai pada 5 aspek utama yang dinilai HRD, lengkap dengan saran kalimat aktif dan cara menonjolkan pencapaian Anda.",
    ctaText: "Uji Skor 5 Dimensi",
    ctaHref: "/evaluate",
  },
  {
    stepIndex: 3,
    tabLabel: "Pencocokan Karir",
    tabSub: "Loker Pas Bana",
    title: "Lowongan yang Sesuai Keahlian",
    description:
      "Tidak perlu lagi menebak posisi mana yang cocok. Berdasarkan keahlian dan pengalaman di CV Anda, dapatkan rekomendasi lowongan terbaik beserta panduan skill yang perlu ditingkatkan.",
    ctaText: "Temukan Lowongan Cocok",
    ctaHref: "/jobs",
  },
  {
    stepIndex: 4,
    tabLabel: "Penilaian Adil",
    tabSub: "Objektif & Aman",
    title: "Dinilai Murni dari Kompetensi",
    description:
      "Evaluasi berfokus sepenuhnya pada keahlian, pengalaman proyek, dan potensi karir Anda tanpa bias latar belakang pribadi. Data Anda aman dan dapat dihapus kapan saja.",
    ctaText: "Mulai Evaluasi Gratis",
    ctaHref: "/evaluate",
  },
];

// Total 9 full-viewport states (0..8) inside the morphing full-page frame:
// 0    = Full-Screen Sky Hero + Rising Board ATS + Rolling Horizon (100% height)
// 1..4 = Shrunk 35% Sky Banner + Full-Height 2-Column Interactive Stage (4 Workflow Tabs)
// 5    = Shrunk 28% Sky Banner + Full-Height 3-Column Feature Bento Stage
// 6    = Shrunk 28% Sky Banner + Full-Height 8+4 Overview Dashboard & Side Assistant Stage
// 7    = Shrunk 28% Deep Ocean Navy Banner + Full-Height 3-Column Analytics, Radar & Blind Scoring Stage
// 8    = Full-Screen Sky Closing Stage + 3 Simple Steps + Horizon & Integrated Footer (100% height)
const TOTAL_SLIDES = 9;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [heroBoardTab, setHeroBoardTab] = useState<"ats" | "match" | "gap">("ats");
  const isAnimatingRef = useRef<boolean>(false);
  const wheelDeltaRef = useRef<number>(0);
  const wheelResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const goToSlide = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, target));
      if (clamped === currentSlide || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      wheelDeltaRef.current = 0;
      setCurrentSlide(clamped);
      setTimeout(() => {
        isAnimatingRef.current = false;
        wheelDeltaRef.current = 0;
      }, 650);
    },
    [currentSlide]
  );

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;

      wheelDeltaRef.current += e.deltaY;
      if (wheelResetTimerRef.current) {
        clearTimeout(wheelResetTimerRef.current);
      }
      wheelResetTimerRef.current = setTimeout(() => {
        wheelDeltaRef.current = 0;
      }, 180);

      if (Math.abs(wheelDeltaRef.current) >= 32) {
        if (wheelDeltaRef.current > 0) {
          goToSlide(currentSlide + 1);
        } else {
          goToSlide(currentSlide - 1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      if (wheelResetTimerRef.current) {
        clearTimeout(wheelResetTimerRef.current);
      }
    };
  }, [currentSlide, goToSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || isAnimatingRef.current) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 36) {
      if (deltaY > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
    touchStartYRef.current = null;
  };

  const isFullSkyStage = currentSlide === 0 || currentSlide === 8;
  const isWorkflowSection = currentSlide >= 1 && currentSlide <= 4;
  const isFeatureBentoSection = currentSlide === 5;
  const isOverviewDashboardSection = currentSlide === 6;
  const isNavyAnalyticsSection = currentSlide === 7;

  const activeWorkflow =
    WORKFLOW_STEPS[(isWorkflowSection ? currentSlide : 1) - 1];

  const topStageHeightClass = isFullSkyStage
    ? "h-full"
    : isWorkflowSection
    ? "h-[33%] sm:h-[35%]"
    : "h-[27%] sm:h-[29%]";

  const topStageBackground = isNavyAnalyticsSection
    ? "linear-gradient(155deg, #051e34 0%, #092c4b 55%, #0d3a62 100%)"
    : "linear-gradient(165deg, #4b94e6 0%, #6cb2f2 45%, #9ad0fa 80%, #d7ecfe 100%)";

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full p-2 sm:p-3 flex flex-col bg-[#fefefd] text-[#0d1f33] overflow-hidden select-none"
    >
      {/* =====================================================================
          TOP MORPHING STAGE CONTAINER (Fills 100% on Slide 0 & 8, Morphs to Header Banner on 1..7)
          ===================================================================== */}
      <div
        className={`relative w-full rounded-[26px] sm:rounded-[34px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${topStageHeightClass}`}
        style={{ background: topStageBackground }}
      >
        {/* Ambient Sky / Wave Glow Overlay */}
        <div
          className="absolute inset-0 pointer-events-none animate-cloud-drift opacity-75"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 35% at 20% 25%, rgba(255,255,255,0.35) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(255,255,255,0.45) 0%, transparent 72%)",
          }}
          aria-hidden="true"
        />

        {/* -------------------------------------------------------------------
            SLIDE 0: FULL-SCREEN HERO + RISING BOARD ATS + HORIZON HILL
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col justify-between items-center text-center px-4 sm:px-10 pt-16 sm:pt-20 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            currentSlide === 0
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 -translate-y-12 blur-md pointer-events-none"
          }`}
        >
          {/* Center Hero Typography & Dual Pill CTAs */}
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 z-20 my-auto pb-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs text-[11px] font-bold text-[#0d1f33]">
              <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
              <span>Pasbana AI • Standar Evaluasi ATS &amp; HR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-white leading-[1.06] drop-shadow-xs">
              Autopilot Evaluasi CV &amp; <br className="hidden sm:inline" />
              <span className="text-[#051e34]">Pencocokan Karir Impian.</span>
            </h1>

            <p className="text-xs sm:text-base text-white/95 max-w-xl mx-auto leading-relaxed font-medium">
              Ukur kesiapan resume Anda secara objektif dalam 5 dimensi dan temukan lowongan yang paling pas bana dalam hitungan detik.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/evaluate"
                className="inline-flex items-center gap-2.5 pl-6 pr-2 py-2 bg-[#051e34] hover:bg-[#0d2e4d] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-[#051e34]/25 transition-all hover:-translate-y-0.5"
              >
                <span>Evaluasi CV Saya</span>
                <span className="w-7 h-7 rounded-full bg-white text-[#051e34] flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                href="/evaluate?tab=questionnaire"
                className="px-6 py-2.5 bg-white/95 hover:bg-white text-[#0d1f33] text-xs sm:text-sm font-bold rounded-full shadow-sm transition-all flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#4b94e6]" aria-hidden="true" />
                <span>Saya Belum Punya CV</span>
              </Link>
            </div>
          </div>

          {/* Bottom Rising White Dashboard Card (Board ATS + Flanking Metric Chips) */}
          <div
            className={`relative z-10 w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-t-[28px] sm:rounded-t-[36px] shadow-2xl p-4 sm:p-7 pb-10 sm:pb-14 text-left transition-all duration-700 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              currentSlide === 0
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-28 opacity-0 scale-95"
            }`}
          >
            {/* Floating Left Metric Chip */}
            <div className="hidden xl:block absolute -left-28 top-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl w-36 animate-float">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <FileCheck className="w-3.5 h-3.5 text-[#4b94e6]" />
                <span>Skor ATS</span>
              </div>
              <div className="text-2xl font-black text-[#0d1f33] mt-0.5">88/100</div>
              <div className="text-[10px] font-semibold text-emerald-600">+18% kesiapan</div>
            </div>

            {/* Floating Right Metric Chip */}
            <div className="hidden xl:block absolute -right-28 top-10 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl w-36 animate-float-delay">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                <Target className="w-3.5 h-3.5 text-[#4b94e6]" />
                <span>Kecocokan</span>
              </div>
              <div className="text-2xl font-black text-[#0d1f33] mt-0.5">92%</div>
              <div className="text-[10px] font-semibold text-[#4b94e6]">12 Loker Aktif</div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4b94e6] to-[#051e34] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  WF
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0d1f33] leading-tight">Wira Fikri Ramadanu</p>
                  <p className="text-[10px] text-slate-400 font-mono">Kandidat Fresh Graduate • ID #CV-2026</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center bg-[#f4f9fe] p-1 rounded-full border border-[#e3edf7]">
                  <button
                    type="button"
                    onClick={() => setHeroBoardTab("ats")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                      heroBoardTab === "ats"
                        ? "bg-white text-[#0d1f33] shadow-2xs"
                        : "text-slate-500 hover:text-[#0d1f33]"
                    }`}
                  >
                    Skor 5D
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroBoardTab("match")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                      heroBoardTab === "match"
                        ? "bg-white text-[#0d1f33] shadow-2xs"
                        : "text-slate-500 hover:text-[#0d1f33]"
                    }`}
                  >
                    Loker (92%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroBoardTab("gap")}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                      heroBoardTab === "gap"
                        ? "bg-white text-[#0d1f33] shadow-2xs"
                        : "text-slate-500 hover:text-[#0d1f33]"
                    }`}
                  >
                    Saran CV
                  </button>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-400 pl-1">
                  Board <strong className="text-[#0d1f33]">ATS</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-3">
              <div className="md:col-span-5 space-y-2.5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Ringkasan Evaluasi
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-[#0d1f33]">88</div>
                    <div className="text-[10px] text-slate-400">Skor ATS</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-[#4b94e6]">12</div>
                    <div className="text-[10px] text-slate-400">Loker Cocok</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600">0</div>
                    <div className="text-[10px] text-slate-400">Bias Data</div>
                  </div>
                </div>
                <div className="pt-0.5 flex items-baseline gap-2">
                  <span className="text-lg sm:text-xl font-black text-[#0d1f33]">92.4%</span>
                  <span className="text-[10px] font-bold text-[#3b8eeb] bg-[#ebf4fd] px-2 py-0.5 rounded-full">
                    +18% kesiapan kerja
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 bg-[#f8fbff] border border-[#e6eef7] rounded-2xl p-3.5 sm:p-4 space-y-2.5">
                {heroBoardTab === "ats" && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0d1f33]">Distribusi 5 Dimensi Objektif</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Lolos Screening</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Struktur &amp; Format 1-Kolom</span>
                        <span className="font-mono font-bold text-[#0d1f33]">94%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[94%] h-full bg-[#051e34] rounded-full" />
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-slate-600">Relevansi Keahlian &amp; Kalimat Aktif</span>
                        <span className="font-mono font-bold text-[#4b94e6]">90%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[90%] h-full bg-[#4b94e6] rounded-full" />
                      </div>
                    </div>
                  </>
                )}

                {heroBoardTab === "match" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0d1f33]">Management Trainee &amp; Analis Produk</span>
                      <span className="text-xs font-black text-[#4b94e6]">92% Cocok</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      PT Nusantara Inovasi Mandiri • Jakarta &amp; Padang (Hybrid)
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-white text-[#0d1f33] text-[10px] font-semibold shadow-2xs">
                        Manajemen Proyek
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-[#0d1f33] text-[10px] font-semibold shadow-2xs">
                        Analisis Data
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-[#0d1f33] text-[10px] font-semibold shadow-2xs">
                        Kepemimpinan Tim
                      </span>
                    </div>
                  </div>
                )}

                {heroBoardTab === "gap" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0d1f33]">Saran Penguatan Isi CV</span>
                      <span className="text-[10px] font-mono text-[#3b8eeb] bg-[#ebf4fd] px-2 py-0.5 rounded-full">
                        +6 Poin ATS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Cantumkan dampak terukur (contoh: meningkatkan partisipasi kegiatan hingga 35%) pada deskripsi pengalaman organisasi Anda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lush Rolling Grassy Hill Foreground Overlapping Bottom Edge */}
          <div className="absolute bottom-0 inset-x-0 h-14 sm:h-20 pointer-events-none z-20 overflow-hidden">
            <svg
              viewBox="0 0 1440 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full object-cover"
              preserveAspectRatio="none"
            >
              <path
                d="M0 160L1440 160L1440 35C1260 15 1040 55 820 85C580 118 280 135 0 155Z"
                fill="url(#hillGrad1)"
              />
              <path
                d="M220 160L1440 160L1440 65C1180 45 960 95 680 125C450 148 310 155 220 160Z"
                fill="url(#hillGrad2)"
              />
              <defs>
                <linearGradient id="hillGrad1" x1="720" y1="15" x2="720" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6c8f52" stopOpacity="0.92" />
                  <stop offset="1" stopColor="#3c592b" />
                </linearGradient>
                <linearGradient id="hillGrad2" x1="830" y1="45" x2="830" y2="160" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#86ab68" stopOpacity="0.88" />
                  <stop offset="1" stopColor="#2c441e" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            SLIDES 1..4 COMPACT SKY BANNER (Workflow Section)
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-12 sm:pt-14 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isWorkflowSection
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-8 blur-md pointer-events-none"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-white max-w-2xl leading-[1.12] drop-shadow-xs">
            Otomasi evaluasi berkas, <br />
            <span className="text-[#051e34]">temukan karir dalam hitungan detik</span>
          </h2>
        </div>

        {/* -------------------------------------------------------------------
            SLIDE 5 COMPACT SKY BANNER (Complete Platform 3-Card Bento)
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-12 sm:pt-14 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isFeatureBentoSection
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-8 blur-md pointer-events-none"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-2xl leading-tight drop-shadow-xs">
            Platform Lengkap untuk <span className="text-[#051e34]">Persiapan Karir Anda</span>
          </h2>
        </div>

        {/* -------------------------------------------------------------------
            SLIDE 6 COMPACT SKY BANNER (Overview Dashboard & Assistant)
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-12 sm:pt-14 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOverviewDashboardSection
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-8 blur-md pointer-events-none"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-3xl leading-tight drop-shadow-xs">
            Pasbana AI Cepat Digunakan, <span className="text-[#051e34]">Mudah Dipahami Semua Kalangan</span>
          </h2>
        </div>

        {/* -------------------------------------------------------------------
            SLIDE 7 COMPACT DEEP NAVY BANNER (Blind Scoring, Radar & Stats)
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-12 sm:pt-14 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isNavyAnalyticsSection
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-8 blur-md pointer-events-none"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-3xl leading-tight">
            Penilaian Objektif &amp; <span className="text-[#79bdf9]">Pantauan Perkembangan CV Anda</span>
          </h2>
        </div>

        {/* -------------------------------------------------------------------
            SLIDE 8: FULL-SCREEN CLOSING SKY STAGE + 3 STEPS + INTEGRATED FOOTER
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col justify-between items-center text-center px-4 sm:px-10 pt-16 sm:pt-20 pb-4 sm:pb-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            currentSlide === 8
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-12 blur-md pointer-events-none"
          }`}
        >
          <div className="w-full max-w-6xl mx-auto my-auto space-y-5 z-20">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-white leading-tight drop-shadow-xs">
                Siapkan Karir Impian dalam <span className="text-[#051e34]">3 Langkah Sederhana</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/95 max-w-xl mx-auto font-medium">
                Mulai gratis tanpa biaya langganan, perbaiki kualitas CV Anda, dan temukan lowongan paling pas bana.
              </p>
            </div>

            {/* 3 Step Cards inside Full-Screen Closing Stage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="rounded-3xl bg-white/95 backdrop-blur-md p-5 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-[11px] font-bold">
                    Langkah 01
                  </span>
                  <FileSpreadsheet className="w-5 h-5 text-[#4b94e6]" />
                </div>
                <h3 className="text-base font-bold text-[#0d1f33]">Unggah CV atau Isi Kuesioner</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Sudah punya berkas CV maupun belum, Anda bisa memulai evaluasi atau menyusun CV standar HR dari nol.
                </p>
              </div>

              <div className="rounded-3xl bg-white/95 backdrop-blur-md p-5 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-[11px] font-bold">
                    Langkah 02
                  </span>
                  <BarChart3 className="w-5 h-5 text-[#4b94e6]" />
                </div>
                <h3 className="text-base font-bold text-[#0d1f33]">Terima Skor 5D &amp; Saran Kalimat</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Lihat rincian skor kesiapan kerja beserta rekomendasi kalimat aktif agar pengalaman Anda lebih menonjol.
                </p>
              </div>

              <div className="rounded-3xl bg-white/95 backdrop-blur-md p-5 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-[11px] font-bold">
                    Langkah 03
                  </span>
                  <Briefcase className="w-5 h-5 text-[#4b94e6]" />
                </div>
                <h3 className="text-base font-bold text-[#0d1f33]">Lamar Lowongan yang Pas Bana</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Langsung terhubung dengan daftar lowongan kerja aktif yang paling sesuai dengan kompetensi Anda.
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/evaluate"
                className="px-7 py-3 bg-[#051e34] hover:bg-[#0d2e4d] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all hover:-translate-y-0.5"
              >
                Mulai Evaluasi Gratis
              </Link>
              <Link
                href="/jobs"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#0d1f33] text-xs sm:text-sm font-bold rounded-full shadow-md transition-all"
              >
                Lihat Lowongan Kerja
              </Link>
            </div>
          </div>

          {/* Integrated Glassmorphic Footer Bar at Bottom of Full-Screen Stage */}
          <div className="relative z-20 w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-full px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs shadow-lg">
            <div className="flex items-center gap-2 font-bold text-[#0d1f33]">
              <span>Pasbana<span className="text-[#ce2731]"> AI</span></span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-normal text-[#5a6b7f]">
                Karir yang Baik Dimulai dari Pertemuan yang Pas Bana
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold text-[#5a6b7f]">
              <Link href="/evaluate" className="hover:text-[#4b94e6] transition">Evaluasi CV</Link>
              <Link href="/jobs" className="hover:text-[#4b94e6] transition">Lowongan</Link>
              <Link href="/about" className="hover:text-[#4b94e6] transition">Tentang Kami</Link>
              <span className="text-slate-400 font-normal">© 2026 Pasbana AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM FULL-BLEED STAGE (Active on Slides 1..7, Fills 100% Remaining Height & Width)
          ===================================================================== */}
      <div
        className={`w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${
          isFullSkyStage
            ? "h-0 opacity-0 pointer-events-none pt-0"
            : "flex-1 min-h-0 opacity-100 pointer-events-auto pt-2.5 sm:pt-3"
        }`}
      >
        {/* -------------------------------------------------------------------
            SLIDES 1..4: 2-COLUMN DRIBBBLE WORKFLOW STAGE (Fills 100% Width & Height)
            ------------------------------------------------------------------- */}
        {isWorkflowSection && (
          <div className="h-full w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            {/* Left Column: 4 Step Tabs at Top + Large Editorial Content at Bottom */}
            <div className="lg:col-span-6 h-full rounded-[26px] sm:rounded-[34px] bg-white border border-[#e3edf7] p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
              {/* Top 4-Tab Progress Bar */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {WORKFLOW_STEPS.map((tab) => {
                  const isActive = currentSlide === tab.stepIndex;
                  const isPassed = currentSlide > tab.stepIndex;
                  return (
                    <button
                      key={tab.stepIndex}
                      type="button"
                      onClick={() => goToSlide(tab.stepIndex)}
                      className="text-left group cursor-pointer focus:outline-none"
                    >
                      <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isActive
                              ? "w-full bg-[#4b94e6]"
                              : isPassed
                              ? "w-full bg-[#051e34]/40"
                              : "w-0 bg-transparent"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-[11px] sm:text-xs font-bold transition-colors truncate ${
                          isActive
                            ? "text-[#0d1f33]"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      >
                        {tab.tabLabel}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                        {tab.tabSub}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Editorial Title, Description & Pill CTA */}
              <div key={activeWorkflow.stepIndex} className="space-y-4 my-auto lg:my-0 lg:pt-6 animate-fade-in-up">
                <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#0d1f33] leading-[1.1]">
                  {activeWorkflow.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5a6b7f] max-w-lg leading-relaxed">
                  {activeWorkflow.description}
                </p>
                <div className="pt-1">
                  <Link
                    href={activeWorkflow.ctaHref}
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#051e34] hover:bg-[#0d2e4d] text-white text-xs sm:text-sm font-bold rounded-full shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <span>{activeWorkflow.ctaText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Full-Height Sky & Stone/Meadow Visual Stage */}
            <div
              className="lg:col-span-6 h-full rounded-[26px] sm:rounded-[34px] relative overflow-hidden flex items-center justify-center p-4 sm:p-8"
              style={{
                background:
                  "linear-gradient(165deg, #4b94e6 0%, #7ec0f8 52%, #cbe5fe 88%, #eef7ff 100%)",
              }}
            >
              {/* Floating UI Showcase Cards (Changes per Tab 1..4) */}
              <div className="relative z-20 w-full max-w-md mb-6 sm:mb-10">
                {currentSlide === 1 && (
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-[#4b94e6]" />
                        <span className="text-xs font-bold text-[#0d1f33]">Asisten Pemeriksa CV</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                        Siap Evaluasi
                      </span>
                    </div>
                    <div className="bg-slate-100 rounded-2xl p-3 text-xs text-slate-700">
                      Apakah format CV 1-kolom saya sudah aman untuk sistem seleksi HRD?
                    </div>
                    <div className="bg-[#5aa9f4] text-white rounded-2xl p-3.5 text-xs space-y-1 shadow-sm">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Format 1-Kolom Terverifikasi (94%)</span>
                      </div>
                      <p className="text-[11px] text-white/95 leading-relaxed">
                        Seluruh bagian pendidikan, pengalaman, dan keahlian terbaca sempurna tanpa kendala.
                      </p>
                    </div>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#4b94e6]" />
                        <span className="text-xs font-bold text-[#0d1f33]">Rincian Skor 5 Dimensi</span>
                      </div>
                      <span className="text-xs font-black text-[#4b94e6]">88 / 100</span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      {[
                        { label: "Keterbacaan & Format ATS", val: "94%", w: "w-[94%]", c: "bg-[#051e34]" },
                        { label: "Relevansi Keahlian", val: "90%", w: "w-[90%]", c: "bg-[#4b94e6]" },
                        { label: "Dampak & Pencapaian Terukur", val: "82%", w: "w-[82%]", c: "bg-emerald-500" },
                        { label: "Kelengkapan Struktur Profil", val: "88%", w: "w-[88%]", c: "bg-sky-500" },
                      ].map((row) => (
                        <div key={row.label} className="space-y-1">
                          <div className="flex justify-between font-semibold text-slate-700">
                            <span>{row.label}</span>
                            <span className="font-mono font-bold text-[#0d1f33]">{row.val}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`${row.w} h-full ${row.c} rounded-full`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5 text-left">
                      {[
                        { role: "Product Analyst", match: "94% Cocok", loc: "Jakarta • Hybrid" },
                        { role: "Management Trainee", match: "92% Cocok", loc: "Padang • Penuh Waktu" },
                        { role: "Project Officer", match: "89% Cocok", loc: "Bandung • Remote" },
                        { role: "Riset Operasi", match: "87% Cocok", loc: "Surabaya • Hybrid" },
                      ].map((item) => (
                        <div
                          key={item.role}
                          className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <Briefcase className="w-3.5 h-3.5 text-[#4b94e6]" />
                            <span className="text-[10px] font-mono font-bold text-emerald-600">
                              {item.match}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#0d1f33] truncate">{item.role}</p>
                          <p className="text-[10px] text-slate-400 truncate">{item.loc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentSlide === 4 && (
                  <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#4b94e6]" />
                        <span className="text-xs font-bold text-[#0d1f33]">Standar Evaluasi Objektif</span>
                      </div>
                      <span className="text-[10px] font-bold bg-[#ebf4fd] text-[#3b8eeb] px-2.5 py-0.5 rounded-full">
                        100% Adil
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl bg-[#f8fbff] border border-[#e6eef7] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#0d1f33]">Fokus Murni pada Kemampuan</p>
                          <p className="text-[10px] text-[#5a6b7f]">Dinilai dari keahlian, proyek, dan pengalaman Anda</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Bebas Bias
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#f8fbff] border border-[#e6eef7] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#0d1f33]">Kendali Penuh Data Pribadi</p>
                          <p className="text-[10px] text-[#5a6b7f]">Riwayat dan berkas CV dapat dihapus kapan saja</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#3b8eeb] bg-[#ebf4fd] px-2 py-0.5 rounded-full">
                          Terlindungi
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stone & Grassy Horizon Foreground at Bottom of Right Stage */}
              <div className="absolute bottom-0 inset-x-0 h-20 sm:h-24 pointer-events-none z-10 overflow-hidden">
                <svg
                  viewBox="0 0 800 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M150 155L210 92L420 76L635 88L685 155Z"
                    fill="#d7dde4"
                  />
                  <path
                    d="M210 92L420 76L635 88L590 155L245 155Z"
                    fill="#bcc5cf"
                  />
                  <path
                    d="M0 180L800 180L800 118C650 102 480 120 310 135C160 148 60 155 0 164Z"
                    fill="url(#rightStageHill)"
                  />
                  <defs>
                    <linearGradient id="rightStageHill" x1="400" y1="102" x2="400" y2="180" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6f9454" />
                      <stop offset="1" stopColor="#2e461f" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            SLIDE 5: 3 FULL-HEIGHT FEATURE BENTO CARDS (Fills 100% Width & Height)
            ------------------------------------------------------------------- */}
        {isFeatureBentoSection && (
          <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            {/* Card 1: 8-Tile Feature Ecosystem Grid */}
            <div className="h-full rounded-[26px] sm:rounded-[34px] bg-[#f8fbff] border border-[#e3edf7] p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white border border-slate-100 text-xs font-bold text-[#0d1f33] shadow-2xs">
                  Ekosistem <span className="text-[#4b94e6]">Pasbana AI</span>
                </span>
                <span className="text-[11px] font-bold text-[#4b94e6]">8 Fitur Utama</span>
              </div>

              <div className="grid grid-cols-4 gap-3 my-auto py-2">
                {[
                  { icon: FileCheck, bg: "bg-blue-50 text-[#3b8eeb]", label: "ATS" },
                  { icon: BarChart3, bg: "bg-sky-50 text-sky-600", label: "Skor 5D" },
                  { icon: FileSpreadsheet, bg: "bg-indigo-50 text-indigo-600", label: "Kuesioner" },
                  { icon: Briefcase, bg: "bg-emerald-50 text-emerald-600", label: "Loker" },
                  { icon: Target, bg: "bg-amber-50 text-amber-600", label: "Skill" },
                  { icon: ShieldCheck, bg: "bg-rose-50 text-rose-600", label: "Objektif" },
                  { icon: CheckCircle2, bg: "bg-teal-50 text-teal-600", label: "Saran" },
                  { icon: Lock, bg: "bg-slate-100 text-slate-700", label: "Privasi" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-1.5"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.bg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-[#0d1f33]">
                  Evaluasi &amp; Kuesioner Terpadu
                </h3>
                <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                  Sudah punya CV maupun belum, Anda bisa langsung mengukur kesiapan kerja dalam satu tempat.
                </p>
              </div>
            </div>

            {/* Card 2: Rocket Readiness Visual */}
            <div className="h-full rounded-[26px] sm:rounded-[34px] bg-[#f8fbff] border border-[#e3edf7] p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-100 text-xs font-bold text-[#0d1f33] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Kandidat Siap Kerja
                </span>
                <span className="text-[11px] font-bold text-emerald-600">+24 Poin Skor</span>
              </div>

              <div className="my-auto flex flex-col items-center justify-center gap-4 py-2">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#5aa9f4] to-[#3b8eeb] text-white flex items-center justify-center shadow-xl shadow-blue-400/30">
                  <Rocket className="w-10 h-10" />
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white border border-slate-100 text-xs font-bold text-[#0d1f33] shadow-xs">
                  Tingkatkan Peluang Lolos Seleksi HRD
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-[#0d1f33]">
                  Uji &amp; Perbaiki dalam Hitungan Detik
                </h3>
                <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                  Dapatkan rincian skor dan saran kalimat aktif yang langsung bisa Anda terapkan pada resume.
                </p>
              </div>
            </div>

            {/* Card 3: Concentric Blue Target */}
            <div className="h-full rounded-[26px] sm:rounded-[34px] bg-[#f8fbff] border border-[#e3edf7] p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-100 text-xs font-bold text-[#0d1f33] shadow-2xs">
                  <Target className="w-3.5 h-3.5 text-[#4b94e6]" />
                  Rekomendasi Otomatis
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4b94e6]">
                  <Clock className="w-3.5 h-3.5" />
                  Hemat Waktu
                </span>
              </div>

              <div className="my-auto flex items-center justify-center py-2">
                <div className="w-28 h-28 rounded-full border-4 border-[#90c6fa]/40 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-4 border-[#5aa9f4]/70 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#4b94e6] shadow-md" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-[#0d1f33]">
                  Pencocokan Karir yang Pas Bana
                </h3>
                <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                  Temukan posisi aktif yang sesuai keahlian Anda tanpa perlu menebak kualifikasi perusahaan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            SLIDE 6: FULL-HEIGHT OVERVIEW DASHBOARD + SIDE ASSISTANT (Fills 100% Width & Height)
            ------------------------------------------------------------------- */}
        {isOverviewDashboardSection && (
          <div className="h-full w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
            {/* Left 8 Cols: Full-Height Overview Window */}
            <div className="lg:col-span-8 h-full bg-white rounded-[26px] sm:rounded-[34px] border border-[#e3edf7] p-5 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0d1f33]">Ringkasan Evaluasi CV</h3>
                  <p className="text-xs text-[#5a6b7f]">Pantau perkembangan skor dan kesiapan kerja Anda secara menyeluruh</p>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-xs font-bold">
                  Standar HRD
                </span>
              </div>

              {/* Sky-Blue Chart Banner (Stretches Flex-1) */}
              <div className="my-3 flex-1 min-h-0 rounded-3xl bg-gradient-to-r from-[#4b94e6] to-[#7abdf7] p-5 text-white flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span>Tren Kenaikan Skor Kesiapan Resume</span>
                  <span className="bg-white/20 px-3 py-0.5 rounded-full text-xs">+24 Poin Revisi</span>
                </div>
                <svg viewBox="0 0 420 80" className="w-full h-20 sm:h-24 my-auto">
                  <path
                    d="M0 68 Q70 58, 130 42 T260 28 T360 16 T420 8"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="420" cy="8" r="5" fill="#ffffff" />
                </svg>
              </div>

              {/* 4 Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Skor ATS Total", val: "88/100", sub: "Kompetitif" },
                  { label: "Aspek Dinilai", val: "5 Dimensi", sub: "Objektif" },
                  { label: "Loker Cocok", val: "12 Posisi", sub: "Aktif" },
                  { label: "Tingkat Kecocokan", val: "92%", sub: "Pas Bana" },
                ].map((m) => (
                  <div key={m.label} className="p-3.5 rounded-2xl bg-[#f8fbff] border border-[#e6eef7]">
                    <p className="text-[11px] text-[#5a6b7f] font-medium">{m.label}</p>
                    <p className="text-lg sm:text-xl font-black text-[#0d1f33] mt-0.5">{m.val}</p>
                    <p className="text-[11px] font-bold text-[#3b8eeb]">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Full-Height Side Assistant Card */}
            <div className="lg:col-span-4 h-full bg-[#f8fbff] rounded-[26px] sm:rounded-[34px] border border-[#e3edf7] p-5 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-[#e3edf7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#4b94e6] text-white text-xs font-bold flex items-center justify-center">
                    PA
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0d1f33]">Saran Perbaikan Langsung</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Panduan Kalimat Aktif</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="space-y-3 text-xs sm:text-sm my-auto py-2">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-700 shadow-2xs">
                  Bagaimana cara memperkuat pengalaman organisasi saya di CV?
                </div>
                <div className="p-3.5 rounded-2xl bg-[#5aa9f4] text-white shadow-sm leading-relaxed">
                  Gunakan kata kerja aktif seperti &quot;Memimpin&quot; atau &quot;Mengelola&quot; dan sertakan hasil terukur, misalnya: &quot;Mengelola acara kampus dengan 350+ peserta.&quot;
                </div>
              </div>

              <Link
                href="/evaluate"
                className="w-full py-3 rounded-full bg-[#051e34] hover:bg-[#0d2e4d] text-white text-xs sm:text-sm font-bold text-center transition shadow-md"
              >
                Coba Evaluasi Sekarang
              </Link>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            SLIDE 7: 3-COL DEEP NAVY + AREA CHART + 5D RADAR STAGE (Fills 100% Width & Height)
            ------------------------------------------------------------------- */}
        {isNavyAnalyticsSection && (
          <div className="h-full w-full grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
            {/* Col 1: Deep Ocean Navy Blind Scoring & 4 Key Stats */}
            <div
              className="h-full rounded-[26px] sm:rounded-[34px] p-6 sm:p-8 text-white flex flex-col justify-between"
              style={{
                background: "linear-gradient(155deg, #051e34 0%, #092c4b 60%, #0d3a62 100%)",
              }}
            >
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5aa9f4]/20 text-[#96cdfc] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Prinsip Blind Scoring</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-tight">
                  Fokus Murni pada Kompetensi Anda
                </h3>
                <p className="text-xs text-[#c4dcf2] leading-relaxed">
                  Menyaring resume berdasarkan keahlian dan dampak kerja tanpa bias foto, usia, maupun latar belakang pribadi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                {[
                  { num: "5D", title: "Kriteria HRD" },
                  { num: "92%", title: "Akurasi Cocok" },
                  { num: "100%", title: "Bebas Biaya" },
                  { num: "0%", title: "Bias Pribadi" },
                ].map((stat) => (
                  <div key={stat.title} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-2xl font-black text-[#79bdf9]">{stat.num}</div>
                    <div className="text-[11px] font-semibold text-white/90">{stat.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2: Area Chart Score Progression + Actionable Readiness */}
            <div className="h-full rounded-[26px] sm:rounded-[34px] bg-[#f8fbff] border border-[#e3edf7] p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-[#0d1f33]">
                <span>Grafik Kenaikan Skor</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-[10px]">
                  Sebelum vs Sesudah
                </span>
              </div>

              <svg viewBox="0 0 240 100" className="w-full h-28 my-auto">
                <defs>
                  <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5aa9f4" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#5aa9f4" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 84 Q45 78, 85 52 T165 44 T240 14 L240 100 L0 100 Z"
                  fill="url(#impactGrad)"
                />
                <path
                  d="M0 84 Q45 78, 85 52 T165 44 T240 14"
                  fill="none"
                  stroke="#4b94e6"
                  strokeWidth="3"
                />
              </svg>

              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0d1f33]">
                  <CheckCircle2 className="w-4 h-4 text-[#4b94e6]" />
                  <span>3 Saran Perbaikan Tersedia</span>
                </div>
                <p className="text-[11px] text-[#5a6b7f] leading-relaxed">
                  Perkuat pencapaian proyek dan lengkapi keahlian inti agar peluang wawancara meningkat.
                </p>
              </div>
            </div>

            {/* Col 3: 5-Dimension SVG Radar Chart + Competency Balance */}
            <div className="h-full rounded-[26px] sm:rounded-[34px] bg-[#f8fbff] border border-[#e3edf7] p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-bold text-[#0d1f33]">
                <span>Peta 5 Dimensi Kompetensi</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px]">
                  Seimbang
                </span>
              </div>

              <svg viewBox="0 0 180 120" className="w-full h-32 my-auto mx-auto">
                <polygon points="90,14 134,39 134,89 90,114 46,89 46,39" fill="none" stroke="#dbe8f6" strokeWidth="1" />
                <polygon points="90,30 120,47 120,81 90,98 60,81 60,47" fill="none" stroke="#dbe8f6" strokeWidth="1" />
                <polygon
                  points="90,18 128,44 124,84 90,104 54,82 58,42"
                  fill="rgba(90,169,244,0.25)"
                  stroke="#4b94e6"
                  strokeWidth="2.5"
                />
                <text x="90" y="10" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#0d1f33">ATS (94%)</text>
                <text x="144" y="42" textAnchor="start" fontSize="7.5" fontWeight="bold" fill="#0d1f33">Struktur</text>
                <text x="144" y="92" textAnchor="start" fontSize="7.5" fontWeight="bold" fill="#0d1f33">Dampak</text>
                <text x="36" y="92" textAnchor="end" fontSize="7.5" fontWeight="bold" fill="#0d1f33">Skill</text>
                <text x="36" y="42" textAnchor="end" fontSize="7.5" fontWeight="bold" fill="#0d1f33">Profil</text>
              </svg>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-[#0d1f33]">Visualisasi Kekuatan CV</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Ketahui dengan cepat aspek resume yang sudah kuat dan bagian yang masih perlu ditingkatkan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
