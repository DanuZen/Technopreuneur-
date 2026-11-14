"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  CheckCircle2,
  FileCheck,
  Briefcase,
  Target,
  Shield,
  ShieldCheck,
  BarChart3,
  Layers,
} from "lucide-react";

interface StageTabItem {
  stepIndex: number;
  tabLabel: string;
  tabSub: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

// SECTION 2 (Slides 1..4): 4 Tahap Alur Kerja Utama (Layout 2-Kolom Dribbble)
const WORKFLOW_TABS: StageTabItem[] = [
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

// Total 8 slides (0..7) with 5 distinct visual layouts:
// 0     = Full-Screen Sky Hero + Rising Board ATS + Grassy Hill
// 1..4  = Shrunk 32% Sky Banner + 2-Col Dribbble Stone Stage (4 Workflow Tabs)
// 5     = Compact Navy Banner (22%) + Full-Width Interactive Browser Mockup Showcase
// 6     = Compact Sky Banner (22%) + 3-Col Evaluation Principles + Asymmetric Bento Grid
// 7     = Full-Screen Sky Closing CTA + Grassy Hill + Capsule Footer
const TOTAL_SLIDES = 8;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [heroBoardTab, setHeroBoardTab] = useState<"ats" | "match" | "gap">("ats");
  const [mockupTab, setMockupTab] = useState<"analysis" | "matching" | "skills">("analysis");
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
      }, 680);
    },
    [currentSlide]
  );

  // Wheel / Trackpad accumulator + Keyboard navigation (100% locked viewport, zero vertical scrollbar)
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

  const isFullSkyStage = currentSlide === 0 || currentSlide === 7;
  const isWorkflowSection = currentSlide >= 1 && currentSlide <= 4;
  const isMockupSection = currentSlide === 5;
  const isBentoSection = currentSlide === 6;

  const activeWorkflow =
    WORKFLOW_TABS[(isWorkflowSection ? currentSlide : 1) - 1];

  const topBannerHeightClass = isFullSkyStage
    ? "h-full"
    : isWorkflowSection
    ? "h-[30%] sm:h-[32%]"
    : "h-[20%] sm:h-[22%]";

  const topBannerBackground = isMockupSection
    ? "linear-gradient(135deg, #0a1f3d 0%, #0f2c56 50%, #1d4576 100%)"
    : isBentoSection
    ? "linear-gradient(135deg, #fce7ea 0%, #e8f1fb 55%, #d6ebfa 100%)"
    : "linear-gradient(180deg, #9ec5eb 0%, #c4def7 46%, #e5f0fb 82%, #f4f9fe 100%)";

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-1 flex flex-col bg-[#fefefd] text-primary overflow-hidden select-none"
    >
      {/* =====================================================================
          TOP MORPHING STAGE BANNER (Morphs Height, Palette & Headline per Section)
          ===================================================================== */}
      <div
        className={`relative w-full rounded-[26px] sm:rounded-[34px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${topBannerHeightClass}`}
        style={{ background: topBannerBackground }}
      >
        {/* Animated Drifting Sky Clouds (Visible on Sky & Dawn stages) */}
        {!isMockupSection && (
          <div
            className="absolute inset-0 pointer-events-none animate-cloud-drift opacity-75"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 55% 28% at 22% 28%, rgba(255,255,255,0.75) 0%, transparent 70%), radial-gradient(ellipse 60% 32% at 78% 36%, rgba(255,255,255,0.68) 0%, transparent 72%), radial-gradient(ellipse 45% 22% at 50% 62%, rgba(255,255,255,0.55) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
        )}

        {/* Subtle Grid Overlay on Navy Mockup Banner */}
        {isMockupSection && (
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* -------------------------------------------------------------------
            SECTION 1 (SLIDE 0): FULL-SCREEN HERO + RISING BOARD ATS
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col justify-between items-center text-center px-4 pt-6 sm:pt-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            currentSlide === 0
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 -translate-y-12 blur-md pointer-events-none"
          }`}
        >
          {/* Top Center Hero Typography & CTA */}
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 z-20 my-auto pb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md shadow-xs text-[11px] font-semibold text-primary">
              <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
              <span>Pasbana AI • Standar Evaluasi ATS &amp; HR</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-primary leading-[1.08]">
              Autopilot Evaluasi CV &amp; <br className="hidden sm:inline" />
              <span className="text-[#ce2731]">Pencocokan Karir Impian.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
              Ukur kesiapan resume Anda secara objektif dalam 5 dimensi dan temukan lowongan yang paling pas bana dalam hitungan detik.
            </p>

            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/evaluate"
                className="px-7 py-3 bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Evaluasi CV Saya
              </Link>
              <Link
                href="/evaluate?tab=questionnaire"
                className="px-6 py-3 bg-white/90 hover:bg-white text-primary text-xs sm:text-sm font-semibold rounded-full shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#ce2731]" aria-hidden="true" />
                <span>Saya Belum Punya CV</span>
              </Link>
            </div>
          </div>

          {/* Bottom Rising White Dashboard Card */}
          <div
            className={`relative z-10 w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-t-[28px] sm:rounded-t-[36px] shadow-2xl p-4 sm:p-7 pb-10 sm:pb-14 text-left transition-all duration-700 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              currentSlide === 0
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-28 opacity-0 scale-95"
            }`}
          >
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f2c56] to-[#1d4576] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  WF
                </div>
                <div>
                  <p className="text-xs font-bold text-primary leading-tight">Wira Fikri Ramadanu</p>
                  <p className="text-[10px] text-slate-400 font-mono">Kandidat Fresh Graduate • ID #CV-2026</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-full text-[11px]">
                  <button
                    type="button"
                    onClick={() => setHeroBoardTab("ats")}
                    className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                      heroBoardTab === "ats" ? "bg-white text-primary shadow-2xs" : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    Skor 5D
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroBoardTab("match")}
                    className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                      heroBoardTab === "match" ? "bg-white text-primary shadow-2xs" : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    Loker (92%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroBoardTab("gap")}
                    className={`px-2.5 py-1 rounded-full font-semibold transition cursor-pointer ${
                      heroBoardTab === "gap" ? "bg-white text-primary shadow-2xs" : "text-slate-500 hover:text-primary"
                    }`}
                  >
                    Saran CV
                  </button>
                </div>
                <span className="text-sm sm:text-base font-light text-slate-400">
                  Board <strong className="font-extrabold text-primary">ATS</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5 space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Ringkasan Evaluasi
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-primary">88</div>
                    <div className="text-[10px] text-slate-400">Skor ATS</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-primary">12</div>
                    <div className="text-[10px] text-slate-400">Loker Cocok</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600">0</div>
                    <div className="text-[10px] text-slate-400">Bias Data</div>
                  </div>
                </div>
                <div className="pt-1 flex items-baseline gap-2">
                  <span className="text-lg sm:text-xl font-black text-primary">92.4%</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +18% kesiapan kerja
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 bg-slate-50/90 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-inner">
                {heroBoardTab === "ats" && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-primary">Distribusi 5 Dimensi Objektif</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">Lolos Screening</span>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Struktur &amp; Format 1-Kolom</span>
                        <span className="font-mono font-bold text-primary">94%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[94%] h-full bg-primary rounded-full" />
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-slate-600">Relevansi Keahlian &amp; Action Verbs</span>
                        <span className="font-mono font-bold text-secondary">90%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[90%] h-full bg-secondary rounded-full" />
                      </div>
                    </div>
                  </>
                )}

                {heroBoardTab === "match" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">Management Trainee &amp; Analis Produk</span>
                      <span className="text-xs font-black text-emerald-600">92% Cocok</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      PT Nusantara Inovasi Mandiri • Jakarta &amp; Padang (Hybrid)
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-semibold shadow-2xs">
                        Manajemen Proyek
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-semibold shadow-2xs">
                        Analisis Data
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-semibold shadow-2xs">
                        Kepemimpinan Tim
                      </span>
                    </div>
                  </div>
                )}

                {heroBoardTab === "gap" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Saran Penguatan Isi CV</span>
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
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
          <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 pointer-events-none z-20 overflow-hidden">
            <svg
              viewBox="0 0 1440 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full preserve-3d object-cover"
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
            SECTION 2 BANNER (SLIDES 1..4): COMPACT SKY BANNER
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isWorkflowSection
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-8 blur-md pointer-events-none"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-primary max-w-2xl leading-[1.12]">
            Otomasi evaluasi berkas, <br />
            temukan karir dalam hitungan detik
          </h2>
        </div>

        {/* -------------------------------------------------------------------
            SECTION 3 BANNER (SLIDE 5): DEEP NAVY BANNER FOR PRODUCT MOCKUP
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMockupSection
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-8 blur-md pointer-events-none"
          }`}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-sky-300 font-bold mb-1">
            Pratinjau Antarmuka Langsung
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white max-w-2xl leading-tight">
            Lihat Bagaimana CV Anda Dinilai &amp; Dicocokkan
          </h2>
        </div>

        {/* -------------------------------------------------------------------
            SECTION 4 BANNER (SLIDE 6): SOFT DAWN BANNER FOR BENTO & PRINCIPLES
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isBentoSection
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-8 blur-md pointer-events-none"
          }`}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest text-secondary font-bold mb-1">
            Keunggulan &amp; Standar Penilaian
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary max-w-2xl leading-tight">
            Mengapa Ribuan Talenta Muda Memilih Pasbana AI?
          </h2>
        </div>

        {/* -------------------------------------------------------------------
            SECTION 5 (SLIDE 7): FULL-SCREEN CLOSING CTA + CAPSULE FOOTER
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col justify-between items-center text-center px-4 py-8 sm:py-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            currentSlide === 7
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-12 blur-md pointer-events-none"
          }`}
        >
          <div className="my-auto max-w-2xl mx-auto space-y-5 z-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md shadow-xs text-xs font-semibold text-primary">
              <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>100% Gratis • Tanpa Biaya Langganan</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-primary leading-[1.1]">
              Siap Mengetahui Kualitas <br className="hidden sm:inline" />
              <span className="text-[#ce2731]">CV Anda Sekarang?</span>
            </h2>

            <p className="text-xs sm:text-base text-slate-700 leading-relaxed max-w-xl mx-auto">
              Dapatkan skor ATS objektif 5 dimensi, perbaikan kata kerja aktif, serta rekomendasi lowongan kerja yang pas bana.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/evaluate"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold rounded-full shadow-xl transition-all hover:-translate-y-0.5"
              >
                Mulai Evaluasi CV Gratis
              </Link>
              <Link
                href="/jobs"
                className="w-full sm:w-auto px-7 py-3.5 bg-white/90 hover:bg-white text-primary text-xs sm:text-sm font-semibold rounded-full shadow-md transition-all"
              >
                Eksplorasi Lowongan Kerja
              </Link>
            </div>
          </div>

          <footer className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 z-20">
            <div className="flex items-center gap-2 font-bold text-primary">
              <span>Pasbana<span className="text-[#ce2731]"> AI</span></span>
              <span className="text-slate-300">|</span>
              <span className="font-normal text-[11px] text-slate-500">
                Karir yang Baik Dimulai dari Pertemuan yang Pas Bana
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-600">
              <Link href="/evaluate" className="hover:text-primary transition">Evaluasi CV</Link>
              <Link href="/evaluate?tab=questionnaire" className="hover:text-primary transition">Kuesioner</Link>
              <Link href="/jobs" className="hover:text-primary transition">Lowongan</Link>
              <Link href="/about" className="hover:text-primary transition">Tentang Kami</Link>
              <Link href="/login" className="hover:text-primary transition">Masuk</Link>
            </div>
          </footer>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM DYNAMIC STAGE (Switches Layout per Section!)
          - Slides 1..4: 2-Column Dribbble Workflow Stage
          - Slide 5: Full-Width Centered Interactive Browser Window Showcase
          - Slide 6: 3-Column Principles + Asymmetric Bento Grid
          ===================================================================== */}
      <div
        className={`w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${
          isFullSkyStage
            ? "h-0 opacity-0 pointer-events-none mt-0"
            : "flex-1 opacity-100 pointer-events-auto mt-3 sm:mt-4"
        }`}
      >
        {/* -------------------------------------------------------------------
            SECTION 2 (SLIDES 1..4): 2-COLUMN DRIBBBLE WORKFLOW STAGE
            ------------------------------------------------------------------- */}
        {isWorkflowSection && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-full animate-fade-in-up">
            {/* LEFT COLUMN: 4 Step Tabs at Top + Animated Title/Desc/CTA at Bottom */}
            <div className="lg:col-span-6 flex flex-col justify-between p-3 sm:p-6 h-full">
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {WORKFLOW_TABS.map((tab) => {
                  const isActive = currentSlide === tab.stepIndex;
                  const isPassed = currentSlide > tab.stepIndex;
                  return (
                    <button
                      key={tab.stepIndex}
                      type="button"
                      onClick={() => goToSlide(tab.stepIndex)}
                      className="text-left group cursor-pointer focus-visible:outline-none"
                    >
                      <div className="h-[2px] w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isActive
                              ? "w-full bg-primary"
                              : isPassed
                              ? "w-full bg-primary/40"
                              : "w-0 bg-primary"
                          }`}
                        />
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-bold transition-colors truncate ${
                          isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
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

              <div
                key={activeWorkflow.stepIndex}
                className="space-y-3 sm:space-y-4 my-auto lg:my-0 pt-2 animate-fade-in-up"
              >
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
                  {activeWorkflow.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
                  {activeWorkflow.description}
                </p>
                <div className="pt-1">
                  <Link
                    href={activeWorkflow.ctaHref}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0f2c56] hover:bg-[#163861] text-white text-xs font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                  >
                    {activeWorkflow.ctaText}
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Rounded Sky + 3D Sculpted Stone on Grass Hill + Floating Card */}
            <div
              className="lg:col-span-6 rounded-[26px] sm:rounded-[34px] relative overflow-hidden flex items-center justify-center p-4 sm:p-8 h-full"
              style={{
                background:
                  "linear-gradient(180deg, #9fc6ec 0%, #c8e0f7 52%, #e8f2fc 88%, #f5f9fd 100%)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 60% 35% at 30% 25%, rgba(255,255,255,0.75) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 75% 40%, rgba(255,255,255,0.65) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 pointer-events-none z-10">
                <svg
                  viewBox="0 0 800 220"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="none"
                >
                  <polygon points="210,125 360,92 610,104 650,155 180,165" fill="#d8dcd8" />
                  <polygon points="210,125 360,92 430,132 180,165" fill="#eaedea" />
                  <polygon points="360,92 610,104 650,155 430,132" fill="#b4bcb6" />
                  <polygon points="180,165 430,132 650,155 620,185 160,185" fill="#7c857e" />
                  <path
                    d="M0 220L800 220L800 148C680 128 540 135 410 148C260 162 120 150 0 172Z"
                    fill="url(#rightHill1)"
                  />
                  <path
                    d="M60 220L800 220L800 168C640 152 480 158 330 175C190 190 110 205 60 220Z"
                    fill="url(#rightHill2)"
                  />
                  <defs>
                    <linearGradient id="rightHill1" x1="400" y1="128" x2="400" y2="220" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6f9454" />
                      <stop offset="1" stopColor="#355024" />
                    </linearGradient>
                    <linearGradient id="rightHill2" x1="430" y1="152" x2="430" y2="220" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#89ae6b" />
                      <stop offset="1" stopColor="#263c18" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div
                key={currentSlide}
                className="relative z-20 w-full max-w-md mb-8 sm:mb-10 animate-fade-in-up"
              >
                {currentSlide === 1 && (
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl space-y-3.5 text-left">
                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                      <FileCheck className="w-3.5 h-3.5 text-primary" />
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <Target className="w-3.5 h-3.5 text-secondary" />
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl">
                      <div className="w-7 h-7 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        WF
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-primary">Kandidat Fresh Graduate</p>
                        <p className="text-slate-600 text-[11px]">
                          Mengunggah <span className="font-mono font-semibold">CV_Wira_Fikri_ATS.pdf</span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-blue-50/70 p-3.5 rounded-2xl space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-primary">
                        <span>Asisten Karir Pasbana</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        Format CV 1-kolom Anda sudah rapi dan mudah dibaca HRD. Kami menemukan 3 poin pengalaman organisasi yang bisa diperkuat agar peluang wawancara meningkat.
                      </p>
                    </div>
                  </div>
                )}

                {currentSlide === 2 && (
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">Evaluasi 5 Dimensi Objektif</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black">
                        Skor: 88/100
                      </span>
                    </div>
                    <div className="space-y-2 text-[11px]">
                      {[
                        { label: "1. Struktur & Keterbacaan ATS", val: 94, color: "bg-primary" },
                        { label: "2. Kejelasan Ringkasan Profil", val: 85, color: "bg-sky-500" },
                        { label: "3. Kalimat Aktif & Pencapaian", val: 82, color: "bg-emerald-500" },
                        { label: "4. Kesesuaian Keahlian", val: 90, color: "bg-secondary" },
                        { label: "5. Kelengkapan Pengalaman", val: 89, color: "bg-amber-500" },
                      ].map((d) => (
                        <div key={d.label} className="space-y-1">
                          <div className="flex justify-between font-medium text-slate-700">
                            <span>{d.label}</span>
                            <span className="font-mono font-bold text-slate-900">{d.val}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentSlide === 3 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5 text-left">
                      {[
                        { name: "Kesesuaian Posisi", sub: "92% Pas dengan Profil Anda", dot: "bg-emerald-500" },
                        { name: "Analisis Gap Skill", sub: "Panduan Skill Tambahan", dot: "bg-sky-500" },
                        { name: "Saran Kata Kerja", sub: "Perbaikan Kalimat CV", dot: "bg-primary" },
                        { name: "Belum Punya CV", sub: "Susun Lewat Kuesioner", dot: "bg-amber-500" },
                        { name: "Lowongan Terkurasi", sub: "Peluang Fresh Graduate", dot: "bg-secondary" },
                        { name: "Siap Melamar", sub: "Unduh Format Standar HR", dot: "bg-indigo-500" },
                      ].map((tile) => (
                        <div
                          key={tile.name}
                          className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg flex items-center gap-2.5"
                        >
                          <span className={`w-3 h-3 rounded-full ${tile.dot} shrink-0`} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-primary truncate">{tile.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{tile.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-xl text-xs font-semibold text-primary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <Briefcase className="w-3.5 h-3.5 text-primary" />
                        <Target className="w-3.5 h-3.5 text-secondary" />
                        <span className="text-[11px] font-semibold">Rekomendasi Karir yang Pas Bana</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentSlide === 4 && (
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-primary">Keunggulan Evaluasi Objektif</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                        100% Adil
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">Fokus Murni pada Kemampuan</p>
                          <p className="text-[10px] text-slate-500">Dinilai dari keahlian, proyek, dan pengalaman Anda</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Bebas Bias
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">Kendali Penuh Data Pribadi</p>
                          <p className="text-[10px] text-slate-500">Riwayat dan berkas CV dapat dihapus kapan saja</p>
                        </div>
                        <span className="text-[10px] font-bold text-primary bg-blue-100 px-2 py-0.5 rounded-full">
                          Terlindungi
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            SECTION 3 (SLIDE 5): FULL-WIDTH CENTERED INTERACTIVE BROWSER MOCKUP
            ------------------------------------------------------------------- */}
        {isMockupSection && (
          <div className="h-full flex items-center justify-center px-1 sm:px-6 animate-fade-in-up">
            <div className="w-full max-w-5xl rounded-[28px] sm:rounded-[34px] bg-white shadow-2xl shadow-primary/15 overflow-hidden flex flex-col max-h-full">
              {/* Browser Top Bar */}
              <div className="bg-[#0f2c56] px-5 py-3 flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ce2731] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-xs font-mono text-slate-300 ml-2 hidden sm:inline">
                    pasbana.ai/dashboard/candidate
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[11px] font-medium text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-beacon shrink-0" aria-hidden="true" />
                  <span>Penilaian Objektif Aktif</span>
                </div>
              </div>

              {/* Interactive Mockup Body */}
              <div className="p-4 sm:p-7 space-y-5 bg-gradient-to-br from-slate-50/80 via-blue-50/30 to-white flex-1 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMockupTab("analysis")}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shadow-2xs ${
                        mockupTab === "analysis"
                          ? "bg-primary text-white"
                          : "text-primary bg-white hover:bg-slate-100"
                      }`}
                    >
                      Skor 5 Dimensi
                    </button>
                    <button
                      type="button"
                      onClick={() => setMockupTab("matching")}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shadow-2xs ${
                        mockupTab === "matching"
                          ? "bg-primary text-white"
                          : "text-slate-600 bg-white hover:text-primary"
                      }`}
                    >
                      Rekomendasi Loker (92%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMockupTab("skills")}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer shadow-2xs ${
                        mockupTab === "skills"
                          ? "bg-primary text-white"
                          : "text-slate-600 bg-white hover:text-primary"
                      }`}
                    >
                      Saran Penguatan CV
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    ID Berkas: CV-2026-F09
                  </span>
                </div>

                <div key={mockupTab} className="animate-fade-in-up">
                  {mockupTab === "analysis" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-[#0f2c56] via-[#163861] to-[#0f2c56] text-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center text-center space-y-2">
                        <div className="w-20 h-20 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 flex flex-col items-center justify-center shadow-inner">
                          <span className="text-2xl font-black text-white">88</span>
                          <span className="text-[9px] uppercase font-mono text-emerald-300 font-semibold">Skor ATS</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                            Sangat Kompetitif
                          </span>
                          <p className="text-[11px] text-slate-200 mt-1">
                            Format rapi dan siap lolos penyaringan awal HRD.
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-2 bg-white p-5 rounded-2xl shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-primary">
                          <span>Distribusi Kualitas 5 Dimensi</span>
                          <span className="text-[11px] text-slate-400 font-normal">Standar HR &amp; Recruiter</span>
                        </div>
                        {[
                          { label: "Struktur & Format ATS", score: 94, color: "bg-primary" },
                          { label: "Kejelasan Deskripsi Karir", score: 85, color: "bg-sky-500" },
                          { label: "Pencapaian Terukur (Action Verbs)", score: 82, color: "bg-emerald-500" },
                          { label: "Relevansi Keahlian", score: 90, color: "bg-[#ce2731]" },
                          { label: "Kelengkapan Informasi Kontak & Edu", score: 89, color: "bg-amber-500" },
                        ].map((bar) => (
                          <div key={bar.label} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-600">{bar.label}</span>
                              <span className="font-mono font-bold text-slate-900">{bar.score}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mockupTab === "matching" && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">Management Trainee &amp; Business Analyst</h3>
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-medium">
                              Rekomendasi Utama
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">PT Nusantara Inovasi Mandiri • Jakarta &amp; Padang (Hybrid)</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-emerald-600">92%</span>
                          <p className="text-[10px] text-slate-400 uppercase font-mono">Tingkat Kecocokan</p>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                        <p className="font-semibold text-slate-800">Mengapa Posisi Ini Cocok untuk Anda:</p>
                        <p>
                          Pengalaman magang, kepemimpinan organisasi, dan keahlian analisis data Anda memenuhi 4 dari 5 kualifikasi utama yang dicari perusahaan ini.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-[11px] font-medium text-slate-500">Keahlian Sesuai:</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">Analisis Data</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">Manajemen Proyek</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">Kepemimpinan Tim</span>
                      </div>
                    </div>
                  )}

                  {mockupTab === "skills" && (
                    <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
                      <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                        Panduan Penguatan CV &amp; Kompetensi
                      </h3>
                      <p className="text-xs text-slate-600">
                        Berikut adalah saran perbaikan langsung agar CV Anda semakin menonjol dan lolos tahap penyaringan awal HRD:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 rounded-xl bg-amber-50/70 space-y-1">
                          <span className="text-xs font-bold text-amber-900">Tambahkan Capaian Berbasis Angka</span>
                          <p className="text-[11px] text-amber-800">
                            Perkuat deskripsi pengalaman dengan dampak terukur, misalnya persentase pertumbuhan atau jumlah anggota tim yang dikelola.
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-blue-50/70 space-y-1">
                          <span className="text-xs font-bold text-blue-900">Lengkapi Sertifikasi Pendukung</span>
                          <p className="text-[11px] text-blue-800">
                            Mencantumkan pelatihan atau sertifikasi relevan dapat meningkatkan daya saing profil fresh graduate hingga 25%.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            SECTION 4 (SLIDE 6): 3 EVALUATION PILLARS + ASYMMETRIC BENTO GRID
            ------------------------------------------------------------------- */}
        {isBentoSection && (
          <div className="h-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 py-1 animate-fade-in-up">
            {/* Left 7 Columns: 3 Core Evaluation Weight Cards + Navy Blind Scoring Card */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-3 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-50/90 to-white shadow-sm flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 my-auto py-1">
                    <h3 className="text-xs sm:text-sm font-bold text-primary">1. Struktur &amp; ATS</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Memastikan format CV mudah dibaca mesin rekrutmen tanpa informasi terpotong.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-primary bg-blue-100/80 px-2.5 py-0.5 rounded-full self-start">
                    Bobot 25%
                  </span>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50/90 to-white shadow-sm flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-xl bg-secondary text-white flex items-center justify-center shadow-xs">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 my-auto py-1">
                    <h3 className="text-xs sm:text-sm font-bold text-secondary">2. Dampak Terukur</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Menilai kekuatan kata kerja aktif dan capaian angka pada pengalaman.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-secondary bg-rose-100/80 px-2.5 py-0.5 rounded-full self-start">
                    Bobot 30%
                  </span>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50/90 to-white shadow-sm flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 my-auto py-1">
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-900">3. Relevansi Skill</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Memetakan kesesuaian keahlian Anda dengan kebutuhan nyata industri.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full self-start">
                    Bobot 45%
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0f2c56] via-[#163861] to-[#0a1e3b] text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 font-bold">
                    Objektivitas Murni
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Penilaian Adil Tanpa Diskriminasi
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Setiap kandidat dinilai murni dari kompetensi, pengalaman proyek, dan kesiapan kerja tanpa memandang latar belakang pribadi.
                  </p>
                </div>
                <Link
                  href="/evaluate"
                  className="px-5 py-2.5 rounded-full bg-white text-primary text-xs font-bold shadow-sm hover:bg-slate-100 transition shrink-0 self-start sm:self-center"
                >
                  Coba Sekarang
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Stacked Value & Benefit Cards */}
            <div className="lg:col-span-5 flex flex-col gap-3 h-full">
              <div className="flex-1 p-5 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/40 to-white shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/90 px-2.5 py-0.5 rounded-full inline-block">
                    Akses Tanpa Batas
                  </span>
                  <h3 className="text-xl font-black text-emerald-950">100% Gratis Tanpa Langganan</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Seluruh mahasiswa dan pencari kerja dapat mengevaluasi CV maupun membuat resume standar ATS lewat kuesioner tanpa biaya sepeser pun.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Mendukung Persiapan Karir Talenta Muda</span>
                </div>
              </div>

              <div className="flex-1 p-5 rounded-3xl bg-gradient-to-br from-rose-50/95 via-red-50/40 to-white shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold bg-rose-100/90 px-2.5 py-0.5 rounded-full inline-block">
                    Langkah Terintegrasi
                  </span>
                  <h3 className="text-xl font-black text-secondary">Dari Evaluasi Langsung Melamar</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Begitu resume Anda siap, langsung temukan dan lamar lowongan kerja aktif yang paling pas dengan kompetensi dan minat karir Anda.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold">
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  <span>Privasi Terjaga &amp; Hak Hapus Permanen</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
