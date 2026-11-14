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
  id: number;
  tabLabel: string;
  tabSub: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

const WORKFLOW_STEPS: WorkflowStepItem[] = [
  {
    id: 0,
    tabLabel: "Cek Format ATS",
    tabSub: "Bebas Gagal Baca",
    title: "Pastikan CV Lolos Seleksi Awal",
    description:
      "Banyak kandidat gugur bukan karena kurang kompeten, melainkan format CV yang sulit dibaca sistem rekrutmen. Unggah CV Anda atau susun dari nol lewat panduan kuesioner praktis.",
    ctaText: "Cek CV Saya Sekarang",
    ctaHref: "/evaluate",
  },
  {
    id: 1,
    tabLabel: "Skor 5 Dimensi",
    tabSub: "Saran Perbaikan",
    title: "Ketahui Bagian yang Perlu Diperkuat",
    description:
      "Bukan sekadar angka tunggal. Anda mendapatkan rincian nilai pada 5 aspek utama yang dinilai HRD, lengkap dengan saran kalimat aktif dan cara menonjolkan pencapaian Anda.",
    ctaText: "Uji Skor 5 Dimensi",
    ctaHref: "/evaluate",
  },
  {
    id: 2,
    tabLabel: "Pencocokan Karir",
    tabSub: "Loker Pas Bana",
    title: "Lowongan yang Sesuai Keahlian",
    description:
      "Tidak perlu lagi menebak posisi mana yang cocok. Berdasarkan keahlian dan pengalaman di CV Anda, dapatkan rekomendasi lowongan terbaik beserta panduan skill yang perlu ditingkatkan.",
    ctaText: "Temukan Lowongan Cocok",
    ctaHref: "/jobs",
  },
  {
    id: 3,
    tabLabel: "Penilaian Adil",
    tabSub: "Objektif & Aman",
    title: "Dinilai Murni dari Kompetensi",
    description:
      "Evaluasi berfokus sepenuhnya pada keahlian, pengalaman proyek, dan potensi karir Anda tanpa bias latar belakang pribadi. Data Anda aman dan dapat dihapus kapan saja.",
    ctaText: "Mulai Evaluasi Gratis",
    ctaHref: "/evaluate",
  },
];

// 7 Varied Full-Screen Sections (0..6) - Each has a completely different header & full-viewport layout:
// Slide 0: Full-Screen Sky Hero + Rising Board ATS + Rolling Hill
// Slide 1: Shrunk 33% Sky Banner + 2-Column Interactive Workflow Stage (4 Clickable Tabs)
// Slide 2: Split 2-Col Editorial Header (No Banner Box) + 3 Full-Height Feature Bento Cards
// Slide 3: Full-Height Left Vertical Sidebar Header (4 Cols) + Right 8-Col Overview Dashboard & Assistant
// Slide 4: Full-Screen Deep Ocean Navy Stage + Inline Stat Pills + 3-Col Blind Scoring, Area Chart & 5D Radar
// Slide 5: Minimal Step-Counter Header + 3 Full-Height Visual Showcase Cards (Grid, Checkerboard, Chat)
// Slide 6: Split Sky CTA Horizon Banner + Full-Width 4-Column Editorial Footer Card
const TOTAL_SLIDES = 7;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [heroBoardTab, setHeroBoardTab] = useState<"ats" | "match" | "gap">("ats");
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState<number>(0);
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
      }, 780);
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

  // Directional Section Enter & Exit Animation (Masuk & Keluar)
  const getSectionAnimClass = (idx: number) => {
    if (currentSlide === idx) {
      return "opacity-100 translate-y-0 scale-100 blur-0 pointer-events-auto z-20";
    }
    if (currentSlide > idx) {
      // Exits upward when scrolling down
      return "opacity-0 -translate-y-20 scale-[0.95] blur-sm pointer-events-none z-10";
    }
    // Enters from below / Exits downward when scrolling up
    return "opacity-0 translate-y-20 scale-[0.95] blur-sm pointer-events-none z-10";
  };

  // Staggered Child Enter & Exit Animation (Left, Center, Right, Top, Bottom)
  const getChildAnimClass = (
    idx: number,
    direction: "up" | "down" | "left" | "right",
    delayClass: string
  ) => {
    const base = `transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${delayClass}`;
    if (currentSlide === idx) {
      return `${base} opacity-100 translate-x-0 translate-y-0 scale-100`;
    }
    const isPast = currentSlide > idx;
    if (direction === "left") {
      return `${base} opacity-0 -translate-x-12 ${isPast ? "-translate-y-8" : "translate-y-8"} scale-95`;
    }
    if (direction === "right") {
      return `${base} opacity-0 translate-x-12 ${isPast ? "-translate-y-8" : "translate-y-8"} scale-95`;
    }
    if (direction === "down") {
      return `${base} opacity-0 ${isPast ? "-translate-y-10" : "-translate-y-12"} scale-95`;
    }
    return `${base} opacity-0 ${isPast ? "-translate-y-12" : "translate-y-14"} scale-95`;
  };

  const activeWorkflow = WORKFLOW_STEPS[activeWorkflowIdx];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full relative overflow-hidden bg-[#f4f9fe] text-[#0d1f33] select-none"
    >
      {/* =====================================================================
          SLIDE 0: FULL-SCREEN SKY HERO + RISING BOARD ATS + HORIZON HILL
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-2 sm:p-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(0)}`}
      >
        <div
          className="h-full w-full rounded-[26px] sm:rounded-[34px] relative overflow-hidden flex flex-col justify-between items-center text-center px-4 sm:px-10 pt-16 sm:pt-20"
          style={{
            background:
              "linear-gradient(165deg, #4b94e6 0%, #6cb2f2 45%, #9ad0fa 80%, #d7ecfe 100%)",
          }}
        >
          {/* Ambient Sky Glow */}
          <div
            className="absolute inset-0 pointer-events-none animate-cloud-drift opacity-75"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 35% at 20% 25%, rgba(255,255,255,0.35) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(255,255,255,0.45) 0%, transparent 72%)",
            }}
            aria-hidden="true"
          />

          {/* Top Center Hero Typography & Dual Pill CTAs */}
          <div className={`max-w-3xl mx-auto space-y-3 sm:space-y-4 z-20 my-auto pb-2 ${getChildAnimClass(0, "down", "delay-75")}`}>
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
            className={`relative z-10 w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-t-[28px] sm:rounded-t-[36px] shadow-2xl p-4 sm:p-7 pb-10 sm:pb-14 text-left ${getChildAnimClass(0, "up", "delay-150")}`}
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
      </section>

      {/* =====================================================================
          SLIDE 1: DRIBBBLE VIDEO MORPHING STAGE (33% Top Sky Banner + 67% 2-Col Stage)
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-2 sm:p-3 flex flex-col gap-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(1)}`}
      >
        {/* Top 33% Sky Banner (Unique to Slide 1) */}
        <div
          className={`h-[32%] sm:h-[34%] w-full rounded-[26px] sm:rounded-[34px] relative overflow-hidden flex flex-col items-center justify-center text-center px-4 pt-12 sm:pt-14 shrink-0 ${getChildAnimClass(1, "down", "delay-75")}`}
          style={{
            background:
              "linear-gradient(165deg, #4b94e6 0%, #6cb2f2 45%, #9ad0fa 80%, #d7ecfe 100%)",
          }}
        >
          <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-black tracking-tight text-white max-w-2xl leading-[1.12] drop-shadow-xs">
            Otomasi evaluasi berkas, <br />
            <span className="text-[#051e34]">temukan karir dalam hitungan detik</span>
          </h2>
        </div>

        {/* Bottom 67% 2-Column Interactive Stage */}
        <div className="flex-1 min-h-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Left 6 Cols: 4 Interactive Workflow Tabs + Editorial Bottom */}
          <div
            className={`lg:col-span-6 h-full rounded-[26px] sm:rounded-[34px] bg-white border border-[#e3edf7] p-5 sm:p-8 lg:p-10 flex flex-col justify-between ${getChildAnimClass(1, "left", "delay-150")}`}
          >
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {WORKFLOW_STEPS.map((tab) => {
                const isActive = activeWorkflowIdx === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveWorkflowIdx(tab.id)}
                    className="text-left group cursor-pointer focus:outline-none"
                  >
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isActive ? "w-full bg-[#4b94e6]" : "w-full bg-transparent group-hover:bg-slate-300"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-[11px] sm:text-xs font-bold transition-colors truncate ${
                        isActive ? "text-[#0d1f33]" : "text-slate-400 group-hover:text-slate-600"
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

            <div key={activeWorkflow.id} className="space-y-4 my-auto lg:my-0 lg:pt-4 animate-fade-in-up">
              <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#0d1f33] leading-[1.1]">
                {activeWorkflow.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5a6b7f] max-w-lg leading-relaxed">
                {activeWorkflow.description}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <Link
                  href={activeWorkflow.ctaHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#051e34] hover:bg-[#0d2e4d] text-white text-xs sm:text-sm font-bold rounded-full shadow-md transition-all hover:-translate-y-0.5"
                >
                  <span>{activeWorkflow.ctaText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveWorkflowIdx((prev) => (prev + 1) % WORKFLOW_STEPS.length)}
                  className="px-4 py-3 rounded-full bg-[#f4f9fe] hover:bg-[#e3effd] text-[#3b8eeb] text-xs font-bold transition cursor-pointer"
                >
                  Tahap Berikutnya →
                </button>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Sky & Stone/Meadow Stage */}
          <div
            className={`lg:col-span-6 h-full rounded-[26px] sm:rounded-[34px] relative overflow-hidden flex items-center justify-center p-4 sm:p-8 ${getChildAnimClass(1, "right", "delay-200")}`}
            style={{
              background:
                "linear-gradient(165deg, #4b94e6 0%, #7ec0f8 52%, #cbe5fe 88%, #eef7ff 100%)",
            }}
          >
            <div className="relative z-20 w-full max-w-md mb-6 sm:mb-10">
              {activeWorkflowIdx === 0 && (
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

              {activeWorkflowIdx === 1 && (
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

              {activeWorkflowIdx === 2 && (
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
              )}

              {activeWorkflowIdx === 3 && (
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

            {/* Stone & Grassy Horizon Foreground */}
            <div className="absolute bottom-0 inset-x-0 h-20 sm:h-24 pointer-events-none z-10 overflow-hidden">
              <svg
                viewBox="0 0 800 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full object-cover"
                preserveAspectRatio="none"
              >
                <path d="M150 155L210 92L420 76L635 88L685 155Z" fill="#d7dde4" />
                <path d="M210 92L420 76L635 88L590 155L245 155Z" fill="#bcc5cf" />
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
      </section>

      {/* =====================================================================
          SLIDE 2: SPLIT EDITORIAL HEADER (NO BANNER BOX) + 3 FULL-HEIGHT BENTO CARDS
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-16 sm:pt-20 pb-2.5 sm:pb-3 px-2.5 sm:px-4 flex flex-col gap-3.5 bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(2)}`}
      >
        {/* Split 2-Column Editorial Header Directly on Canvas (No Sky Banner Box!) */}
        <div
          className={`w-full px-3 sm:px-6 pt-1 grid grid-cols-1 lg:grid-cols-12 gap-3 items-end shrink-0 ${getChildAnimClass(2, "down", "delay-75")}`}
        >
          <div className="lg:col-span-7 space-y-1.5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b8eeb]" />
              <span>Ekosistem Persiapan Karir Terpadu</span>
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#0d1f33] leading-[1.08]">
              Platform Lengkap untuk <span className="text-[#4b94e6]">Persiapan Karir Anda</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start sm:items-end lg:items-end justify-between gap-2">
            <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed lg:text-right max-w-md">
              Dirancang untuk membantu talenta muda melewati seleksi awal dengan percaya diri, dari menyusun CV hingga melamar lowongan yang cocok.
            </p>
          </div>
        </div>

        {/* 3 Full-Height Feature Bento Cards Stretching to Bottom Edge */}
        <div className="flex-1 min-h-0 w-full grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
          {/* Card 1 */}
          <div
            className={`h-full rounded-[28px] sm:rounded-[34px] bg-[#f8fbff] border border-[#e3edf7] p-6 sm:p-8 flex flex-col justify-between ${getChildAnimClass(2, "left", "delay-100")}`}
          >
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-white border border-slate-100 text-xs font-bold text-[#0d1f33] shadow-2xs">
                Ekosistem <span className="text-[#4b94e6]">Pasbana AI</span>
              </span>
              <span className="text-xs font-bold text-[#4b94e6]">8 Modul Inti</span>
            </div>

            <div className="grid grid-cols-4 gap-3 my-auto py-3">
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
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#e3edf7]">
              <h3 className="text-lg sm:text-xl font-black text-[#0d1f33]">
                Evaluasi &amp; Kuesioner Terpadu
              </h3>
              <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                Sudah punya CV maupun belum, Anda bisa langsung mengukur kesiapan kerja dalam satu tempat.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className={`h-full rounded-[28px] sm:rounded-[34px] bg-[#f8fbff] border border-[#e3edf7] p-6 sm:p-8 flex flex-col justify-between ${getChildAnimClass(2, "up", "delay-150")}`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-slate-100 text-xs font-bold text-[#0d1f33] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Kandidat Siap Kerja
              </span>
              <span className="text-xs font-bold text-emerald-600">+24 Poin Skor</span>
            </div>

            <div className="my-auto flex flex-col items-center justify-center gap-5 py-3">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#5aa9f4] to-[#3b8eeb] text-white flex items-center justify-center shadow-xl shadow-blue-400/30">
                <Rocket className="w-12 h-12" />
              </div>
              <div className="px-4 py-2 rounded-2xl bg-white border border-slate-100 text-xs font-bold text-[#0d1f33] shadow-xs">
                Tingkatkan Peluang Lolos Seleksi HRD
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#e3edf7]">
              <h3 className="text-lg sm:text-xl font-black text-[#0d1f33]">
                Uji &amp; Perbaiki dalam Hitungan Detik
              </h3>
              <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                Dapatkan rincian skor dan saran kalimat aktif yang langsung bisa Anda terapkan pada resume.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className={`h-full rounded-[28px] sm:rounded-[34px] bg-[#f8fbff] border border-[#e3edf7] p-6 sm:p-8 flex flex-col justify-between ${getChildAnimClass(2, "right", "delay-200")}`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-slate-100 text-xs font-bold text-[#0d1f33] shadow-2xs">
                <Target className="w-3.5 h-3.5 text-[#4b94e6]" />
                Rekomendasi Otomatis
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4b94e6]">
                <Clock className="w-3.5 h-3.5" />
                Hemat Waktu
              </span>
            </div>

            <div className="my-auto flex items-center justify-center py-3">
              <div className="w-32 h-32 rounded-full border-4 border-[#90c6fa]/40 flex items-center justify-center">
                <div className="w-22 h-22 rounded-full border-4 border-[#5aa9f4]/70 flex items-center justify-center p-4">
                  <div className="w-11 h-11 rounded-full bg-[#4b94e6] shadow-md" />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#e3edf7]">
              <h3 className="text-lg sm:text-xl font-black text-[#0d1f33]">
                Pencocokan Karir yang Pas Bana
              </h3>
              <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                Temukan posisi aktif yang sesuai keahlian Anda tanpa perlu menebak kualifikasi perusahaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 3: LEFT VERTICAL SIDEBAR HEADER (4 COLS) + RIGHT 8-COL DASHBOARD & ASSISTANT
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-16 sm:pt-20 pb-2.5 sm:pb-3 px-2.5 sm:px-4 flex flex-col bg-[#f4f9fe] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(3)}`}
      >
        <div className="flex-1 min-h-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* Left 4 Cols: Full-Height Vertical Sky Sidebar Header Card (Zero Top Header!) */}
          <div
            className={`lg:col-span-4 h-full rounded-[28px] sm:rounded-[34px] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden ${getChildAnimClass(3, "left", "delay-75")}`}
            style={{
              background: "linear-gradient(160deg, #3b8eeb 0%, #5aa9f4 55%, #86c5fa 100%)",
            }}
          >
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Ringkasan Antarmuka</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-[1.1]">
                Pasbana AI Cepat Digunakan, Mudah Dipahami.
              </h2>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                Tidak perlu bingung membaca laporan yang rumit. Pantau grafik kenaikan skor ATS, rincian 5 dimensi, dan panduan kalimat aktif dalam satu layar bersih.
              </p>
            </div>

            <div className="space-y-2.5 my-auto py-3 relative z-10 text-xs font-semibold text-white">
              <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-xs rounded-2xl p-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Simulasi skor standar seleksi HRD</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-xs rounded-2xl p-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Saran perbaikan kalimat langsung</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-xs rounded-2xl p-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Rekomendasi lowongan kerja aktif</span>
              </div>
            </div>

            <Link
              href="/evaluate"
              className="relative z-10 w-full py-3.5 rounded-full bg-[#051e34] hover:bg-[#0d2e4d] text-white text-xs sm:text-sm font-bold text-center shadow-lg transition"
            >
              Buka Ruang Evaluasi CV
            </Link>
          </div>

          {/* Right 8 Cols: Full-Height Overview Dashboard + Bottom Assistant Strip */}
          <div className="lg:col-span-8 h-full flex flex-col gap-3.5 min-h-0">
            {/* Top Dashboard Card */}
            <div
              className={`flex-1 min-h-0 bg-white rounded-[28px] sm:rounded-[34px] border border-[#e3edf7] p-5 sm:p-7 flex flex-col justify-between ${getChildAnimClass(3, "right", "delay-150")}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0d1f33]">Ringkasan Evaluasi CV</h3>
                  <p className="text-xs text-[#5a6b7f]">Perkembangan skor kesiapan kerja kandidat</p>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-xs font-bold">
                  Standar HRD
                </span>
              </div>

              <div className="my-3 flex-1 min-h-0 rounded-2xl bg-gradient-to-r from-[#4b94e6] to-[#7abdf7] p-4 sm:p-5 text-white flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Tren Kenaikan Skor Kesiapan Resume</span>
                  <span className="bg-white/20 px-3 py-0.5 rounded-full text-[11px]">+24 Poin Revisi</span>
                </div>
                <svg viewBox="0 0 420 75" className="w-full h-16 sm:h-20 my-auto">
                  <path
                    d="M0 64 Q70 54, 130 40 T260 26 T360 14 T420 8"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="420" cy="8" r="5" fill="#ffffff" />
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Skor ATS Total", val: "88/100", sub: "Kompetitif" },
                  { label: "Aspek Dinilai", val: "5 Dimensi", sub: "Objektif" },
                  { label: "Loker Cocok", val: "12 Posisi", sub: "Aktif" },
                  { label: "Tingkat Kecocokan", val: "92%", sub: "Pas Bana" },
                ].map((m) => (
                  <div key={m.label} className="p-3 rounded-2xl bg-[#f8fbff] border border-[#e6eef7]">
                    <p className="text-[11px] text-[#5a6b7f] font-medium">{m.label}</p>
                    <p className="text-lg font-black text-[#0d1f33] mt-0.5">{m.val}</p>
                    <p className="text-[11px] font-bold text-[#3b8eeb]">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Assistant Conversation Card */}
            <div
              className={`shrink-0 bg-white rounded-[26px] sm:rounded-[30px] border border-[#e3edf7] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${getChildAnimClass(3, "up", "delay-200")}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#4b94e6] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  PA
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-[#0d1f33]">Saran Kalimat Aktif</p>
                  <p className="text-xs text-[#5a6b7f]">
                    Gunakan kata kerja seperti <strong className="text-[#0d1f33]">&quot;Mengelola&quot;</strong> disertai angka dampak, contoh: <strong className="text-[#3b8eeb]">&quot;Mengelola acara kampus dengan 350+ peserta.&quot;</strong>
                  </p>
                </div>
              </div>
              <Link
                href="/evaluate"
                className="shrink-0 px-5 py-2.5 rounded-full bg-[#ebf4fd] hover:bg-[#dcebfb] text-[#3b8eeb] text-xs font-bold transition"
              >
                Uji Kalimat CV →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 4: FULL-SCREEN DEEP OCEAN NAVY STAGE + INLINE STAT PILLS + 3-COL ANALYTICS & RADAR
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-2 sm:p-3 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(4)}`}
      >
        <div
          className="h-full w-full rounded-[26px] sm:rounded-[34px] pt-16 sm:pt-20 pb-4 sm:pb-6 px-4 sm:px-8 flex flex-col justify-between text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(155deg, #051e34 0%, #092c4b 55%, #0d3a62 100%)",
          }}
        >
          {/* Top Inline Navy Header + 4 Stat Pills */}
          <div
            className={`w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-white/10 shrink-0 ${getChildAnimClass(4, "down", "delay-75")}`}
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[#79bdf9] text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Standar Penilaian Adil &amp; Analitik Kesiapan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Penilaian Objektif &amp; <span className="text-[#79bdf9]">Pantauan Perkembangan CV</span>
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 shrink-0">
              {[
                { num: "5D", label: "Kriteria HRD" },
                { num: "92%", label: "Akurasi Cocok" },
                { num: "100%", label: "Bebas Biaya" },
                { num: "0%", label: "Bias Pribadi" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-center"
                >
                  <div className="text-lg sm:text-xl font-black text-[#79bdf9]">{s.num}</div>
                  <div className="text-[10px] text-white/85 font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Full-Height Columns Inside Deep Navy Stage */}
          <div className="flex-1 min-h-0 w-full pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* Col 1: Glassmorphic Blind Scoring Card */}
            <div
              className={`h-full rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 flex flex-col justify-between ${getChildAnimClass(4, "left", "delay-100")}`}
            >
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full bg-[#5aa9f4]/25 text-[#96cdfc] text-xs font-bold">
                  Bebas Bias Rekrutmen
                </span>
                <h3 className="text-xl font-black text-white">
                  Fokus Murni pada Kompetensi Anda
                </h3>
                <p className="text-xs text-[#c4dcf2] leading-relaxed">
                  Pasbana AI menyaring resume berdasarkan keahlian, pengalaman proyek, dan dampak kerja tanpa memandang foto wajah, usia, maupun latar belakang pribadi.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-[#e2effb] my-auto py-2">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#79bdf9] shrink-0" />
                  <span>Tanpa penilaian foto, gender, atau usia</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#79bdf9] shrink-0" />
                  <span>Kendali penuh hapus data CV kapan saja</span>
                </div>
              </div>

              <Link
                href="/evaluate"
                className="w-full py-3 rounded-full bg-[#5aa9f4] hover:bg-[#4b94e6] text-white text-xs font-bold text-center transition shadow-md"
              >
                Uji CV Secara Objektif
              </Link>
            </div>

            {/* Col 2: Crisp White Area Chart Card */}
            <div
              className={`h-full rounded-3xl bg-white text-[#0d1f33] p-6 flex flex-col justify-between shadow-xl ${getChildAnimClass(4, "up", "delay-150")}`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Grafik Kenaikan Skor ATS</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-[10px]">
                  Sebelum vs Sesudah
                </span>
              </div>

              <svg viewBox="0 0 240 100" className="w-full h-32 my-auto">
                <defs>
                  <linearGradient id="navyImpactGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5aa9f4" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#5aa9f4" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 84 Q45 78, 85 52 T165 44 T240 14 L240 100 L0 100 Z"
                  fill="url(#navyImpactGrad)"
                />
                <path
                  d="M0 84 Q45 78, 85 52 T165 44 T240 14"
                  fill="none"
                  stroke="#4b94e6"
                  strokeWidth="3"
                />
              </svg>

              <div className="p-4 rounded-2xl bg-[#f8fbff] border border-[#e6eef7] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0d1f33]">
                  <CheckCircle2 className="w-4 h-4 text-[#4b94e6]" />
                  <span>3 Saran Perbaikan Tersedia</span>
                </div>
                <p className="text-[11px] text-[#5a6b7f] leading-relaxed">
                  Perkuat pencapaian proyek dan lengkapi keahlian inti agar peluang wawancara meningkat.
                </p>
              </div>
            </div>

            {/* Col 3: Crisp White 5D Radar Chart Card */}
            <div
              className={`h-full rounded-3xl bg-white text-[#0d1f33] p-6 flex flex-col justify-between shadow-xl ${getChildAnimClass(4, "right", "delay-200")}`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Peta 5 Dimensi Kompetensi</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px]">
                  Seimbang
                </span>
              </div>

              <svg viewBox="0 0 180 120" className="w-full h-36 my-auto mx-auto">
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

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h3 className="text-sm font-black text-[#0d1f33]">Visualisasi Kekuatan CV</h3>
                <p className="text-[11px] text-[#5a6b7f] leading-relaxed">
                  Ketahui dengan cepat aspek resume yang sudah kuat dan bagian yang masih perlu ditingkatkan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 5: STEP-COUNTER INLINE HEADER + 3 GIANT VISUAL STEP CARDS (Grid, Checkerboard, Chat)
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-16 sm:pt-20 pb-2.5 sm:pb-3 px-2.5 sm:px-4 flex flex-col gap-3.5 bg-[#f6f9fd] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(5)}`}
      >
        {/* Minimal Step-Counter Header Row */}
        <div
          className={`w-full px-3 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0 ${getChildAnimClass(5, "down", "delay-75")}`}
        >
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0d1f33]">
            Siapkan Karir Impian dalam <span className="text-[#4b94e6]">3 Langkah Sederhana</span>
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e3edf7] text-xs font-bold text-[#0d1f33] shadow-2xs">
            <span className="text-[#4b94e6]">01</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#4b94e6]">02</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#4b94e6]">03</span>
            <span className="ml-1 text-[#5a6b7f]">Gratis Selamanya</span>
          </div>
        </div>

        {/* 3 Giant Architectural Visual Step Cards Filling Remaining Height */}
        <div className="flex-1 min-h-0 w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* Step 1: Sky Grid Visual Card */}
          <div
            className={`h-full rounded-[28px] sm:rounded-[34px] bg-white border border-[#e3edf7] overflow-hidden shadow-sm flex flex-col ${getChildAnimClass(5, "left", "delay-100")}`}
          >
            <div
              className="flex-1 min-h-0 relative flex items-center justify-center p-6"
              style={{
                background: "linear-gradient(135deg, #4b94e6 0%, #86c3fa 100%)",
              }}
            >
              <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff26_1px,transparent_1px),linear-gradient(to_bottom,#ffffff26_1px,transparent_1px)] bg-[size:38px_38px]"
                aria-hidden="true"
              />
              <span className="relative z-10 px-6 py-2.5 rounded-full bg-white text-[#0d1f33] text-xs sm:text-sm font-black shadow-lg">
                Unggah CV / Isi Kuesioner
              </span>
            </div>
            <div className="p-6 sm:p-7 space-y-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b94e6]">Langkah 01</span>
                <FileSpreadsheet className="w-4 h-4 text-[#4b94e6]" />
              </div>
              <h3 className="text-lg font-black text-[#0d1f33]">Mulai Tanpa Biaya</h3>
              <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                Unggah file CV Anda atau susun CV standar HR dari nol menggunakan kuesioner terpandu.
              </p>
            </div>
          </div>

          {/* Step 2: Checkerboard Blue & White Visual Card */}
          <div
            className={`h-full rounded-[28px] sm:rounded-[34px] bg-white border border-[#e3edf7] overflow-hidden shadow-sm flex flex-col ${getChildAnimClass(5, "up", "delay-150")}`}
          >
            <div className="flex-1 min-h-0 relative grid grid-cols-4 grid-rows-3 bg-white">
              <div className="bg-[#7bbcf8]/50" />
              <div className="bg-white" />
              <div className="bg-[#64aef5]/70" />
              <div className="bg-white" />
              <div className="bg-white" />
              <div className="bg-[#4b94e6]/80" />
              <div className="bg-white" />
              <div className="bg-[#7bbcf8]/50" />
              <div className="bg-[#64aef5]/60" />
              <div className="bg-white" />
              <div className="bg-[#8ec8fb]/50" />
              <div className="bg-white" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center font-black text-xl text-[#4b94e6]">
                  5D
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-7 space-y-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b94e6]">Langkah 02</span>
                <BarChart3 className="w-4 h-4 text-[#4b94e6]" />
              </div>
              <h3 className="text-lg font-black text-[#0d1f33]">Terima Skor &amp; Saran</h3>
              <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                Lihat nilai 5 dimensi CV Anda beserta rekomendasi perbaikan kalimat agar lebih kuat di mata HRD.
              </p>
            </div>
          </div>

          {/* Step 3: Mini Chat Bubble Card */}
          <div
            className={`h-full rounded-[28px] sm:rounded-[34px] bg-white border border-[#e3edf7] overflow-hidden shadow-sm flex flex-col ${getChildAnimClass(5, "right", "delay-200")}`}
          >
            <div className="flex-1 min-h-0 bg-[#eef6fe] p-6 flex flex-col justify-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-xs self-start text-xs font-bold text-[#0d1f33]">
                <span className="w-5 h-5 rounded-full bg-[#4b94e6] text-white text-[9px] flex items-center justify-center font-bold">
                  PA
                </span>
                <span>CV Anda siap dikirim!</span>
              </div>
              <div className="bg-[#5aa9f4] text-white text-xs sm:text-sm p-3.5 rounded-2xl rounded-tr-sm self-end max-w-[88%] shadow-sm font-medium">
                Ditemukan 12 lowongan aktif yang sangat pas dengan keahlian Anda.
              </div>
            </div>
            <div className="p-6 sm:p-7 space-y-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4b94e6]">Langkah 03</span>
                <Briefcase className="w-4 h-4 text-[#4b94e6]" />
              </div>
              <h3 className="text-lg font-black text-[#0d1f33]">Lamar Posisi Terbaik</h3>
              <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                Pilih lowongan yang sesuai dengan kompetensi Anda dan mulai perjalanan karir impian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 6: SPLIT CLOSING SKY STAGE + FULL-WIDTH 4-COLUMN EDITORIAL FOOTER CARD
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-2 sm:p-3 flex flex-col gap-3 bg-[#f4f9fe] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(6)}`}
      >
        {/* Top Luminous Sky-Blue Rounded CTA Stage with Rolling Hill */}
        <div
          className={`flex-1 min-h-0 w-full rounded-[28px] sm:rounded-[36px] flex flex-col items-center justify-center text-center px-6 pt-14 pb-10 relative overflow-hidden ${getChildAnimClass(6, "down", "delay-75")}`}
          style={{
            background: "linear-gradient(155deg, #4b94e6 0%, #6cb2f2 55%, #9bd0fb 100%)",
          }}
        >
          <div className="relative z-20 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 text-[#0d1f33] text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
              <span>100% Gratis untuk Mahasiswa &amp; Pencari Kerja</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-xs">
              Mulai Bersama <span className="text-[#051e34]">Pasbana AI</span> Sekarang
            </h2>
            <p className="text-xs sm:text-base text-white/95 leading-relaxed font-medium">
              Siap meningkatkan kualitas CV, memperbaiki kalimat pengalaman, dan menemukan peluang kerja yang paling pas bana?
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/evaluate"
                className="px-7 py-3.5 rounded-full bg-[#051e34] hover:bg-[#0d2e4d] text-white text-xs sm:text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5"
              >
                Evaluasi CV Sekarang
              </Link>
              <Link
                href="/jobs"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#0d1f33] text-xs sm:text-sm font-bold shadow-md transition-all"
              >
                Lihat Lowongan Kerja
              </Link>
            </div>
          </div>

          {/* Rolling Green Hill at Bottom of Closing Banner */}
          <div className="absolute bottom-0 inset-x-0 h-12 sm:h-16 pointer-events-none z-10 overflow-hidden">
            <svg
              viewBox="0 0 1440 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full object-cover"
              preserveAspectRatio="none"
            >
              <path
                d="M0 160L1440 160L1440 45C1220 20 960 65 680 100C420 132 210 145 0 158Z"
                fill="#5c8444"
                fillOpacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Full-Width 4-Column Editorial Footer Card */}
        <footer
          className={`shrink-0 w-full rounded-[26px] sm:rounded-[32px] bg-white border border-[#e3edf7] px-6 sm:px-10 py-5 sm:py-6 ${getChildAnimClass(6, "up", "delay-150")}`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-4 border-b border-slate-100 text-xs">
            <div className="col-span-2 sm:col-span-1 space-y-1.5">
              <div className="font-black text-base text-[#0d1f33]">
                Pasbana<span className="text-[#ce2731]"> AI</span>
              </div>
              <p className="text-[11px] text-[#5a6b7f] leading-relaxed">
                Karir yang Baik Dimulai dari Pertemuan yang Pas Bana.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-[#0d1f33]">Fitur Utama</p>
              <ul className="space-y-1 text-[#5a6b7f]">
                <li><Link href="/evaluate" className="hover:text-[#4b94e6] transition">Evaluasi CV 5D</Link></li>
                <li><Link href="/evaluate?tab=questionnaire" className="hover:text-[#4b94e6] transition">Kuesioner ATS</Link></li>
                <li><Link href="/jobs" className="hover:text-[#4b94e6] transition">Pencocokan Karir</Link></li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-[#0d1f33]">Platform</p>
              <ul className="space-y-1 text-[#5a6b7f]">
                <li><Link href="/dashboard" className="hover:text-[#4b94e6] transition">Dashboard ATS</Link></li>
                <li><Link href="/about" className="hover:text-[#4b94e6] transition">Tentang Kami</Link></li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-[#0d1f33]">Akun</p>
              <ul className="space-y-1 text-[#5a6b7f]">
                <li><Link href="/login" className="hover:text-[#4b94e6] transition">Masuk</Link></li>
                <li><Link href="/register" className="hover:text-[#4b94e6] transition">Daftar Akun</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>© 2026 Pasbana AI. All rights reserved.</span>
            <span>Standar Evaluasi Objektif &amp; Bebas Bias</span>
          </div>
        </footer>
      </section>
    </div>
  );
}
