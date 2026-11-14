"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  FileCheck,
  FileSpreadsheet,
  ShieldCheck,
  Target,
  Briefcase,
  BarChart3,
  Clock,
  Lock,
} from "lucide-react";

interface WorkflowStepItem {
  id: number;
  num: string;
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
    num: "01",
    tabLabel: "Cek Format ATS",
    tabSub: "Bebas Gagal Baca",
    title: "Pastikan CV Terbaca Sistem Seleksi",
    description:
      "Banyak kandidat gugur bukan karena kurang kompeten, melainkan karena susunan CV gagal dibaca sistem HR. Pasbana AI memeriksa struktur 1-kolom dan kelengkapan profil Anda secara instan.",
    ctaText: "Coba Evaluasi CV",
    ctaHref: "/evaluate",
  },
  {
    id: 1,
    num: "02",
    tabLabel: "Skor 5 Dimensi",
    tabSub: "Saran Perbaikan",
    title: "Ketahui Letak Kekuatan & Celah CV",
    description:
      "Dapatkan penilaian terukur pada 5 aspek utama mulai dari keterbacaan format, kata kerja aktif, hingga dampak pencapaian, lengkap dengan panduan kalimat yang siap disalin.",
    ctaText: "Lihat Simulasi Skor",
    ctaHref: "/evaluate",
  },
  {
    id: 2,
    num: "03",
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
    num: "04",
    tabLabel: "Penilaian Adil",
    tabSub: "Objektif & Aman",
    title: "Dinilai Murni dari Kompetensi",
    description:
      "Evaluasi berfokus sepenuhnya pada keahlian, pengalaman proyek, dan kesiapan kerja tanpa bias nama, gender, maupun latar belakang pribadi. Anda memegang kendali penuh atas data CV.",
    ctaText: "Pelajari Prinsip Kami",
    ctaHref: "/about",
  },
];

const TOTAL_SLIDES = 7;

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [prevSlide, setPrevSlide] = useState<number>(0);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState<number>(0);

  const isAnimatingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const activeSlideRef = useRef<number>(0);

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  const goToSlide = useCallback((targetIndex: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, targetIndex));
    if (clamped === activeSlideRef.current || isAnimatingRef.current) return;

    const direction = clamped > activeSlideRef.current ? "down" : "up";
    setScrollDir(direction);
    setPrevSlide(activeSlideRef.current);
    isAnimatingRef.current = true;
    activeSlideRef.current = clamped;
    setActiveSlide(clamped);
    window.dispatchEvent(new CustomEvent("pasbana:activeSlide", { detail: clamped }));

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 760);
  }, []);

  useEffect(() => {
    const hashMap: Record<string, number> = {
      "": 0,
      "#": 0,
      "#beranda": 0,
      "#fitur": 1,
      "#persiapan": 2,
      "#asisten": 3,
      "#prinsip": 4,
      "#cara-kerja": 5,
      "#mulai": 6,
    };

    const syncSlideFromHash = () => {
      const target = hashMap[window.location.hash];
      if (typeof target === "number") {
        goToSlide(target);
      }
    };

    const handleSlideEvent = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === "number") {
        goToSlide(customEvent.detail);
      }
    };

    syncSlideFromHash();
    window.addEventListener("hashchange", syncSlideFromHash);
    window.addEventListener("pasbana:slide", handleSlideEvent);
    return () => {
      window.removeEventListener("hashchange", syncSlideFromHash);
      window.removeEventListener("pasbana:slide", handleSlideEvent);
    };
  }, [goToSlide]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;
      if (Math.abs(e.deltaY) < 22) return;

      if (e.deltaY > 0) {
        goToSlide(activeSlideRef.current + 1);
      } else {
        goToSlide(activeSlideRef.current - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        goToSlide(activeSlideRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSlide(activeSlideRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(TOTAL_SLIDES - 1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || isAnimatingRef.current) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartYRef.current = null;
    if (Math.abs(deltaY) < 40) return;
    if (deltaY > 0) {
      goToSlide(activeSlideRef.current + 1);
    } else {
      goToSlide(activeSlideRef.current - 1);
    }
  };

  const getSectionAnimClass = (index: number) => {
    if (index === activeSlide) {
      return "opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto";
    }
    if (index === prevSlide) {
      return scrollDir === "down"
        ? "opacity-0 -translate-y-12 scale-[0.96] z-[15] pointer-events-none"
        : "opacity-0 translate-y-12 scale-[0.96] z-[15] pointer-events-none";
    }
    return index < activeSlide
      ? "opacity-0 -translate-y-16 scale-[0.94] z-0 pointer-events-none"
      : "opacity-0 translate-y-16 scale-[0.94] z-0 pointer-events-none";
  };

  const getHeroMorphSectionAnimClass = () => {
    if (activeSlide === 0 || activeSlide === 1) {
      return "opacity-100 translate-y-0 scale-100 z-20 pointer-events-auto";
    }
    if (prevSlide === 0 || prevSlide === 1) {
      return scrollDir === "down"
        ? "opacity-0 -translate-y-12 scale-[0.96] z-[15] pointer-events-none"
        : "opacity-0 translate-y-12 scale-[0.96] z-[15] pointer-events-none";
    }
    return activeSlide > 1
      ? "opacity-0 -translate-y-16 scale-[0.94] z-0 pointer-events-none"
      : "opacity-0 translate-y-16 scale-[0.94] z-0 pointer-events-none";
  };

  const getChildAnimClass = (
    slideIndex: number,
    enterFrom: "up" | "down" | "left" | "right" = "up",
    delayClass: string = "delay-100"
  ) => {
    const isActive = activeSlide === slideIndex;
    if (isActive) {
      return `opacity-100 translate-x-0 translate-y-0 scale-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${delayClass}`;
    }
    const offsetMap = {
      up: "translate-y-10 scale-[0.97]",
      down: "-translate-y-10 scale-[0.97]",
      left: "-translate-x-10 scale-[0.97]",
      right: "translate-x-10 scale-[0.97]",
    };
    return `opacity-0 ${offsetMap[enterFrom]} transition-all duration-500 ease-in`;
  };

  const activeWorkflow = WORKFLOW_STEPS[activeWorkflowIdx];

  const getGlobalMorphStyle = (slide: number): React.CSSProperties => {
    switch (slide) {
      case 0:
        return {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#0f2c56",
        };
      case 1:
        return {
          top: "0px",
          left: "calc(50% + 16px)",
          width: "calc(50% - 16px)",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#ce2731",
        };
      case 2:
        return {
          top: "0px",
          left: "0px",
          width: "calc(58.333333% - 13.33px)",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#ce2731",
        };
      case 3:
        return {
          top: "120px",
          left: "calc(58.333333% + 11.67px)",
          width: "calc(41.666667% - 11.67px)",
          height: "calc(100% - 120px)",
          borderRadius: "34px",
          backgroundColor: "#ce2731",
        };
      case 4:
        return {
          top: "0px",
          left: "calc(50% + 16px)",
          width: "calc(50% - 16px)",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#0f2c56",
        };
      case 5:
        return {
          top: "calc(100% - 88px)",
          left: "0px",
          width: "100%",
          height: "88px",
          borderRadius: "28px",
          backgroundColor: "#0f2c56",
        };
      case 6:
      default:
        return {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "calc(100% - 144px)",
          borderRadius: "34px",
          backgroundColor: "#ce2731",
        };
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full relative overflow-hidden bg-[#fefefd] text-[#0f2c56] select-none"
    >
      {/* GLOBAL PERSISTENT MORPHING CARD STAGE (Desktop lg+): Shape-shifts smoothly across ALL 7 slides */}
      <div
        className="hidden lg:block absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 pointer-events-none z-10"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <div
            className="absolute shadow-2xl border border-white/15 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={getGlobalMorphStyle(activeSlide)}
          />
        </div>
      </div>

      {/* =====================================================================
          SLIDE 0 & 1: HERO MORPHING STAGE (CARD SHAPE-SHIFTS TO ADAPT TO NEXT SECTION)
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getHeroMorphSectionAnimClass()}`}
      >
        <div className="w-full h-full mx-auto relative">
          {/* MOBILE/TABLET LOCAL MORPHING CARD (lg+ uses Global Persistent Morphing Card above) */}
          <div
            className={`lg:hidden absolute rounded-[26px] sm:rounded-[34px] overflow-hidden shadow-2xl border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-10 ${
              activeSlide === 0
                ? "inset-0 w-full h-full border-white/15"
                : "top-[48%] sm:top-[44%] lg:top-0 bottom-0 right-0 left-0 lg:left-[calc(50%+10px)] xl:left-[calc(50%+16px)] w-full lg:w-[calc(50%-10px)] xl:w-[calc(50%-16px)] h-[52%] sm:h-[56%] lg:h-full border-white/10"
            }`}
          >
            {/* Morphing Background Layer 1: Slide 0 Deep Navy Solid */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeSlide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                backgroundColor: "#0f2c56",
              }}
            />

            {/* Morphing Background Layer 2: Slide 1 Crimson Second Palette Solid */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeSlide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                backgroundColor: "#ce2731",
              }}
            />
          </div>

          {/* 12-COLUMN CONTENT GRID IN FRONT OF MORPHING CARD */}
          <div className="w-full h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch relative z-20">
            {/* =================================================================
                LEFT 6 COLS: Transitions between Hero White Text (Slide 0) and
                Open Workflow Editorial on #fefefd Canvas (Slide 1)
                ================================================================= */}
            <div className="lg:col-span-6 h-[48%] sm:h-[44%] lg:h-full relative">
              {/* SLIDE 0 HERO EDITORIAL (White on Navy) */}
              <div
                className={`absolute inset-0 h-full flex flex-col justify-center py-2 sm:py-5 px-3 sm:px-8 lg:px-12 space-y-4 sm:space-y-5 text-left transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  activeSlide === 0
                    ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                    : "opacity-0 -translate-x-12 scale-95 pointer-events-none"
                }`}
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-[#fefefd] self-start">
                  <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
                  <span>Pasbana AI • Standar Evaluasi ATS &amp; HRD</span>
                </div>

                <h1 className="text-2xl sm:text-4xl xl:text-[54px] font-black tracking-tight text-white leading-[1.08]">
                  Autopilot Evaluasi CV &amp;{" "}
                  <span className="text-[#ce2731]">Pencocokan Karir Impian.</span>
                </h1>

                <p className="text-xs sm:text-base text-slate-200 max-w-xl leading-relaxed font-normal">
                  Ukur kesiapan resume Anda secara objektif dalam 5 dimensi dan temukan lowongan yang paling pas bana dalam hitungan detik, tanpa biaya berlangganan.
                </p>

                <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/evaluate"
                    className="inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-[#ce2731]/35 transition-all hover:-translate-y-0.5"
                  >
                    <span>Evaluasi CV Saya</span>
                    <span className="w-7 h-7 rounded-full bg-white text-[#ce2731] flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </Link>
                  <Link
                    href="/evaluate?tab=questionnaire"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold rounded-full shadow-sm transition-all"
                  >
                    Saya Belum Punya CV
                  </Link>
                </div>

                <div className="pt-2 sm:pt-4 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg">
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-white">88/100</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Simulasi Skor ATS</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-white">92%</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Akurasi Loker Cocok</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-white">5D</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium">Dimensi Objektif</div>
                  </div>
                </div>
              </div>

              {/* SLIDE 1 WORKFLOW EDITORIAL (Navy & Red on White #fefefd Canvas) */}
              <div
                className={`absolute inset-0 h-full flex flex-col justify-between py-2 sm:py-5 px-3 sm:px-8 lg:px-12 text-left transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  activeSlide === 1
                    ? "opacity-100 translate-x-0 scale-100 pointer-events-auto delay-100"
                    : "opacity-0 -translate-x-12 scale-95 pointer-events-none"
                }`}
              >
                <div className="space-y-1 sm:space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#ce2731]">
                    Tahapan Evaluasi Cerdas
                  </span>
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0f2c56] leading-tight">
                    Otomasi evaluasi berkas,{" "}
                    <span className="text-[#ce2731]">temukan karir dalam hitungan detik.</span>
                  </h2>
                </div>

                {/* 4 Interactive Progress Tabs */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-1">
                  {WORKFLOW_STEPS.map((tab) => {
                    const isActive = activeWorkflowIdx === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveWorkflowIdx(tab.id)}
                        className="text-left group cursor-pointer focus:outline-none"
                      >
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1.5 sm:mb-2.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isActive ? "w-full bg-[#ce2731]" : "w-0 group-hover:w-full group-hover:bg-[#0f2c56]/40"
                            }`}
                          />
                        </div>
                        <div className={`text-[10px] sm:text-[11px] font-black tracking-wide ${isActive ? "text-[#ce2731]" : "text-slate-400 group-hover:text-[#0f2c56]"}`}>
                          0{tab.id + 1}
                        </div>
                        <div className={`text-[11px] sm:text-xs font-bold leading-snug line-clamp-1 ${isActive ? "text-[#0f2c56]" : "text-slate-500 group-hover:text-[#0f2c56]"}`}>
                          {tab.tabLabel}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 hidden sm:block">
                          {tab.tabSub}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 sm:space-y-3 pt-1">
                  <h3 className="text-lg sm:text-2xl font-black text-[#0f2c56]">
                    {activeWorkflow.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                    {activeWorkflow.description}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      href={activeWorkflow.ctaHref}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#ce2731] hover:bg-[#b01e27] text-[#fefefd] text-xs font-bold shadow-md transition"
                    >
                      <span>{activeWorkflow.ctaText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setActiveWorkflowIdx((prev) => (prev + 1) % WORKFLOW_STEPS.length)}
                      className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#0f2c56]/20 hover:border-[#0f2c56] text-[#0f2c56] text-xs font-bold transition cursor-pointer"
                    >
                      Tahap Berikutnya →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================================
                RIGHT 6 COLS: Transitions between Slide 0 Hero Live Inspector Card
                and Slide 1 Stage Card with Interactive ATS Previews
                ================================================================= */}
            <div className="lg:col-span-6 h-[52%] sm:h-[56%] lg:h-full relative">
              {/* SLIDE 0 HERO RIGHT STAGE: Live Simulated ATS Inspection & Match Showcase */}
              <div
                className={`absolute inset-0 flex items-center justify-center p-3 sm:p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  activeSlide === 0
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* Floating Interactive Product Card */}
                <div className="relative z-20 w-full max-w-md rounded-3xl bg-[#0e2647]/85 backdrop-blur-xl border border-white/15 p-5 sm:p-6 shadow-2xl text-white space-y-4">
                  {/* Card Header with Active Pulse */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-white tracking-wide">Simulasi Evaluasi ATS</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-[#ce2731] text-white px-2 py-0.5 rounded-full">
                      Skor 88/100
                    </span>
                  </div>

                  {/* Candidate File Preview Pill */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-bold text-white truncate">Resume_Standar_ATS.pdf</div>
                      <div className="text-[10px] text-slate-300">Format 1-Kolom • 14 Kata Kerja Aktif</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                      Lolos Parsing
                    </span>
                  </div>

                  {/* 5-Dimension Mini Progress Bars */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                      <span>Struktur &amp; Keterbacaan Mesin</span>
                      <span className="text-[#ce2731] font-mono font-bold">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[94%] h-full bg-[#ce2731] rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200 pt-1">
                      <span>Kesesuaian Kualifikasi Lowongan</span>
                      <span className="text-emerald-400 font-mono font-bold">92%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-[92%] h-full bg-emerald-400 rounded-full" />
                    </div>
                  </div>

                  {/* Bottom Recommendation Pill */}
                  <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between text-xs">
                    <span className="text-slate-200">Target Karir Terdeteksi</span>
                    <span className="font-bold text-white bg-white/15 px-2.5 py-0.5 rounded-full text-[11px]">
                      Product &amp; Tech Role
                    </span>
                  </div>
                </div>
              </div>

              {/* SLIDE 1 STAGE RIGHT CONTENT: Interactive Stage + Live Previews */}
              <div
                className={`absolute inset-0 flex flex-col justify-between p-4 sm:p-7 text-[#fefefd] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  activeSlide === 1
                    ? "opacity-100 scale-100 pointer-events-auto delay-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                {/* Top Badges */}
                <div className="relative z-20 flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-[#fefefd]/15 backdrop-blur-md text-xs font-bold text-[#fefefd]">
                    Tahap {activeWorkflow.num} • {activeWorkflow.tabLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#fde6e6]">
                    {activeWorkflow.tabSub}
                  </span>
                </div>

                {/* Center Live Previews + Validation Inspector */}
                <div className="relative z-20 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto">
                  <div className="sm:col-span-7">
                    {activeWorkflowIdx === 0 && (
                      <div className="bg-[#fefefd] text-[#0f2c56] rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-black text-[#0f2c56]">Pemeriksa Struktur CV</span>
                          <span className="text-[10px] font-bold bg-[#fdf2f2] text-[#ce2731] px-2.5 py-0.5 rounded-full">
                            94% Lolos
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Susunan 1-kolom terverifikasi. Bagian pendidikan, pengalaman, dan keahlian siap dibaca sistem ATS.
                        </p>
                        <div className="p-2.5 rounded-2xl bg-[#0f2c56] text-[#fefefd] text-[11px] font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#faa9ab] shrink-0" />
                          <span>Bebas Risiko Gagal Parsing</span>
                        </div>
                      </div>
                    )}

                    {activeWorkflowIdx === 1 && (
                      <div className="bg-[#fefefd] text-[#0f2c56] rounded-3xl p-4 sm:p-5 shadow-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#0f2c56]">Rincian 5 Dimensi</span>
                          <span className="text-xs font-black text-[#ce2731]">88 / 100</span>
                        </div>
                        {[
                          { label: "Format & Keterbacaan ATS", val: "94%", w: "w-[94%]", c: "bg-[#0f2c56]" },
                          { label: "Relevansi Keahlian", val: "90%", w: "w-[90%]", c: "bg-[#ce2731]" },
                          { label: "Dampak & Pencapaian", val: "84%", w: "w-[84%]", c: "bg-[#0f2c56]" },
                        ].map((row) => (
                          <div key={row.label} className="space-y-1 text-[11px]">
                            <div className="flex justify-between font-bold">
                              <span>{row.label}</span>
                              <span className="text-[#ce2731]">{row.val}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`${row.w} h-full ${row.c} rounded-full`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeWorkflowIdx === 2 && (
                      <div className="bg-[#fefefd] text-[#0f2c56] rounded-3xl p-4 sm:p-5 shadow-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#0f2c56]">Loker Paling Pas Bana</span>
                          <span className="text-[10px] font-bold text-[#ce2731] bg-[#fdf2f2] px-2 py-0.5 rounded-full">
                            Skor &gt; 90%
                          </span>
                        </div>
                        {[
                          { title: "Product Operations Analyst", match: "94% Cocok" },
                          { title: "Junior Management Trainee", match: "92% Cocok" },
                        ].map((job) => (
                          <div key={job.title} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-[#0f2c56]">{job.title}</span>
                            <span className="text-[10px] font-black text-[#ce2731] bg-[#fdf2f2] px-2 py-0.5 rounded-full shrink-0">
                              {job.match}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeWorkflowIdx === 3 && (
                      <div className="bg-[#fefefd] text-[#0f2c56] rounded-3xl p-4 sm:p-5 shadow-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#0f2c56]">Mode Penilaian Anonim</span>
                          <span className="text-[10px] font-bold bg-[#fdf2f2] text-[#ce2731] px-2 py-0.5 rounded-full">
                            Identitas Terlindungi
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Foto, gender, usia, dan nama disembunyikan agar evaluasi berfokus murni pada kualifikasi dan portofolio.
                        </p>
                        <div className="p-2 rounded-2xl bg-[#0f2c56] text-[#fefefd] text-[10px] font-bold flex items-center justify-between">
                          <span>Evaluasi Objektif 100%</span>
                          <span className="text-[#faa9ab]">Standar HRD</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Complementary Validation Inspector Panel */}
                  <div className="sm:col-span-5 space-y-2.5">
                    {activeWorkflowIdx === 0 && (
                      <div className="bg-[#0f2c56]/90 border border-white/15 rounded-3xl p-4 shadow-xl space-y-2 text-white">
                        <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Parameter Standar ATS</div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                            <span>Format 1-Kolom Simetris</span>
                            <span className="text-emerald-400 font-bold">Lolos</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                            <span>Tipografi Bersih (11pt)</span>
                            <span className="text-emerald-400 font-bold">Lolos</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                            <span>Bebas Simbol Kompleks</span>
                            <span className="text-emerald-400 font-bold">Lolos</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeWorkflowIdx === 1 && (
                      <div className="bg-[#0f2c56]/90 border border-white/15 rounded-3xl p-4 shadow-xl space-y-2 text-white">
                        <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Analisis Dampak Karir</div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="p-2 rounded-xl bg-white/5">
                            <div className="text-[10px] text-slate-300">Kata Kerja Aktif</div>
                            <div className="font-bold text-emerald-300 text-xs mt-0.5">18 Frasa Terdeteksi</div>
                          </div>
                          <div className="p-2 rounded-xl bg-white/5">
                            <div className="text-[10px] text-slate-300">Peluang Lolos Seleksi</div>
                            <div className="font-bold text-white text-xs mt-0.5">+24% Poin Tambahan</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeWorkflowIdx === 2 && (
                      <div className="bg-[#0f2c56]/90 border border-white/15 rounded-3xl p-4 shadow-xl space-y-2 text-white">
                        <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Keahlian Terpetakan</div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {["Next.js", "TypeScript", "Tailwind CSS", "REST API", "Git"].map((sk) => (
                            <span key={sk} className="text-[10px] font-mono font-bold bg-white/10 px-2 py-1 rounded-lg text-white">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeWorkflowIdx === 3 && (
                      <div className="bg-[#0f2c56]/90 border border-white/15 rounded-3xl p-4 shadow-xl space-y-2 text-white">
                        <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">Sanitasi Data PII</div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/20 text-emerald-300 font-bold">
                            Identitas Terenkripsi
                          </div>
                          <div className="p-2 rounded-xl bg-white/5 text-slate-200">
                            Patuh UU PDP No. 27/2022
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Tags */}
                <div className="relative z-20 flex items-center justify-between text-[11px] text-[#fde6e6] pt-1">
                  <span>Filosofi Karir yang Pas Bana</span>
                  <span className="font-semibold">Gratis untuk Pencari Kerja</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 2: 1 SINGLE SECOND (#CE2731) CARD ON LEFT + OPEN EDITORIAL ON RIGHT
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(2)}`}
      >
        <div className="w-full h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
          {/* Col 1 (7 Cols): ONE Single Bold Second (#ce2731) Stage Card ON THE LEFT */}
          <div
            className={`lg:col-span-7 h-full rounded-[26px] sm:rounded-[34px] p-6 sm:p-8 text-[#fefefd] flex flex-col justify-between relative overflow-hidden bg-[#ce2731] lg:bg-transparent shadow-2xl lg:shadow-none border border-white/10 lg:border-transparent origin-left ${getChildAnimClass(2, "left", "delay-100")}`}
          >

            {/* Top Bar inside Card */}
            <div className="flex items-center justify-between relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-[#fefefd] text-[#ce2731] text-xs font-black shadow-xs">
                Kandidat Siap Kerja
              </span>
              <div className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 text-xs">
                <span className="font-black text-[#fde6e6]">+24 Poin Skor</span>
                <span className="w-1 h-1 rounded-full bg-white/60" />
                <span className="font-bold text-white">92% Pas Bana</span>
              </div>
            </div>

            {/* Center Area inside Card: Metrics & Tags on Left + Live Job Snapshot on Right */}
            <div className="my-auto grid grid-cols-1 sm:grid-cols-12 gap-5 items-center py-2 relative z-10">
              {/* Metric & Career Match Tags */}
              <div className="sm:col-span-7 space-y-3.5">
                <div className="space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-[#fefefd] tracking-tight">
                    92%
                  </div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#fde6e6]">
                    Akurasi Kecocokan Karir Pas Bana
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {["Product Analyst", "Management Trainee", "Project Officer", "UI/UX Engineer"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/10 text-[11px] font-bold text-[#fefefd]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5 text-xs text-[#fde6e6]">
                  <CheckCircle2 className="w-4 h-4 text-[#faa9ab] shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Format dan kalimat pengalaman otomatis diselaraskan dengan kriteria seleksi posisi target.
                  </p>
                </div>
              </div>

              {/* Target Job Matching Snapshot Card */}
              <div className="sm:col-span-5 space-y-2.5">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#fefefd]">Rekomendasi Utama</span>
                    <span className="bg-[#ce2731] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      94% Cocok
                    </span>
                  </div>
                  <div className="text-sm font-black text-white">Junior Frontend Developer</div>
                  <div className="text-[11px] text-[#fde6e6]">PT Teknologi Berdaya Nusantara</div>
                  <div className="pt-1 flex flex-wrap gap-1">
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono text-white">React</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono text-white">TypeScript</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono text-white">Next.js</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-xs text-[#fde6e6] flex items-center justify-between">
                  <span>Status Kesiapan</span>
                  <span className="font-bold text-emerald-300">Siap Kirim ke HRD</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar inside Card */}
            <div className="pt-3 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#fefefd]">
                  Uji &amp; Perbaiki Seketika
                </h3>
                <p className="text-xs text-[#fde6e6] leading-relaxed">
                  Dapatkan rekomendasi kalimat aktif yang langsung meningkatkan peluang lolos seleksi HRD.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[#fefefd]">
                  Hemat Waktu Melamar
                </h3>
                <p className="text-xs text-[#fde6e6] leading-relaxed">
                  Fokus pada lowongan terkurasi yang benar-benar relevan dengan profil Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Col 2 (5 Cols): Open Editorial & Feature List on the RIGHT */}
          <div
            className={`lg:col-span-5 h-full flex flex-col justify-between py-3 sm:py-5 px-4 sm:px-8 origin-right ${getChildAnimClass(2, "right", "delay-150")}`}
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fdf2f2] text-[#ce2731] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
                <span>Ekosistem Persiapan Karir</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0f2c56] leading-[1.1]">
                Platform Lengkap untuk{" "}
                <span className="text-[#ce2731]">Persiapan Karir Anda.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sudah punya CV maupun belum, Anda bisa mengukur kesiapan kerja dan menyusun resume standar HRD dalam satu alur terpadu.
              </p>
            </div>

            {/* Open Unboxed List with Crimson Second (#ce2731) Accents */}
            <div className="space-y-4 my-auto py-3">
              {[
                {
                  num: "01",
                  title: "Evaluasi & Kuesioner Pembuat CV",
                  desc: "Unggah PDF CV Anda atau buat CV standar ATS dari nol lewat panduan kuesioner.",
                },
                {
                  num: "02",
                  title: "Analisis 5 Dimensi & Kalimat Aktif",
                  desc: "Ukur struktur, relevansi keahlian, dan dampak pengalaman secara objektif.",
                },
                {
                  num: "03",
                  title: "Rekomendasi Lowongan Presisi",
                  desc: "Temukan posisi kerja aktif yang paling pas dengan kompetensi Anda.",
                },
              ].map((item) => (
                <div key={item.num} className="flex items-start gap-3.5 border-b border-slate-200/80 pb-3.5 last:border-none last:pb-0">
                  <span className="px-2.5 py-1 rounded-lg bg-[#ce2731] text-[#fefefd] font-mono text-xs font-black shrink-0 mt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#0f2c56]">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 3: OPEN HEADER & METRICS + TREND CHART + SECOND (#CE2731) ASSISTANT STAGE
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(3)}`}
      >
        <div className="w-full h-full mx-auto flex flex-col justify-between gap-4 py-1.5 lg:py-0">
          {/* Top Open Editorial Row + Open Typographic Metrics (No Card Boxes) */}
          <div
            className={`w-full flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-3 border-b border-slate-200/80 px-4 sm:px-8 shrink-0 lg:h-[104px] ${getChildAnimClass(3, "down", "delay-75")}`}
          >
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#ce2731]">
                Pantauan Skor &amp; Asisten Kalimat
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0f2c56]">
                Cepat Digunakan, <span className="text-[#ce2731]">Mudah Dipahami.</span>
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-5 sm:gap-8">
              {[
                { val: "88/100", label: "Skor ATS Total", color: "text-[#0f2c56]" },
                { val: "5 Dimensi", label: "Aspek Dinilai", color: "text-[#ce2731]" },
                { val: "12 Posisi", label: "Loker Aktif", color: "text-[#0f2c56]" },
                { val: "+24 Poin", label: "Rata-rata Revisi", color: "text-[#ce2731]" },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className={`text-lg sm:text-2xl font-black ${stat.color}`}>{stat.val}</div>
                  <div className="text-[11px] font-semibold text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Split: Left Trend Visualization (7 Cols) + Right Second (#ce2731) Assistant Card (5 Cols) */}
          <div className="flex-1 min-h-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left 7 Cols: Clean Soft-Rose (#fdf2f2) & Navy Trend Visualization */}
            <div
              className={`lg:col-span-7 h-full rounded-[26px] sm:rounded-[34px] bg-[#fdf2f2] border border-[#fde6e6] p-6 sm:p-7 flex flex-col justify-between origin-bottom-left shadow-lg ${getChildAnimClass(3, "left", "delay-150")}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#0f2c56]">
                    Tren Kenaikan Skor Kesiapan Resume
                  </h3>
                  <p className="text-xs text-slate-600">
                    Perbandingan skor CV sebelum dan sesudah menerapkan saran kalimat aktif
                  </p>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#ce2731] text-[#fefefd] text-xs font-bold">
                  +24 Poin Revisi
                </span>
              </div>

              <svg viewBox="0 0 460 110" className="w-full h-28 sm:h-36 my-auto">
                <path
                  d="M0 92 Q80 80, 150 58 T290 36 T390 18 T450 10 L450 110 L0 110 Z"
                  fill="rgba(206,39,49,0.08)"
                />
                <path
                  d="M0 92 Q80 80, 150 58 T290 36 T390 18 T450 10"
                  fill="none"
                  stroke="#ce2731"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="58" r="5" fill="#0f2c56" />
                <circle cx="290" cy="36" r="5" fill="#0f2c56" />
                <circle cx="450" cy="10" r="6" fill="#ce2731" />
              </svg>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#fcd0d1]/60">
                <span className="text-xs font-bold text-[#0f2c56]">
                  Pantau perkembangan skor ATS dari draf awal hingga siap kirim ke HRD.
                </span>
                <Link
                  href="/evaluate"
                  className="px-5 py-2.5 rounded-full bg-[#0f2c56] hover:bg-[#163861] text-[#fefefd] text-xs font-bold transition"
                >
                  Buka Ruang Evaluasi
                </Link>
              </div>
            </div>

            {/* Right 5 Cols: Bold Second (#ce2731) Card + Before-After Active Voice Comparison */}
            <div
              className={`lg:col-span-5 h-full rounded-[26px] sm:rounded-[34px] p-6 sm:p-7 text-[#fefefd] flex flex-col justify-between relative overflow-hidden bg-[#ce2731] lg:bg-transparent shadow-xl lg:shadow-none origin-bottom-right border border-white/10 lg:border-transparent ${getChildAnimClass(3, "right", "delay-200")}`}
            >
              <div className="space-y-2 relative z-20">
                <span className="px-3 py-1 rounded-full bg-[#fefefd]/15 text-xs font-bold text-[#fefefd]">
                  Saran Kalimat Aktif
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#fefefd] leading-tight">
                  Ubah Pengalaman Biasa Jadi Berdampak
                </h3>
              </div>

              {/* Before vs After Active Voice Showcase */}
              <div className="space-y-2.5 my-auto relative z-20">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#faa9ab]">
                    <span>Sebelum (Pasif &amp; Standar)</span>
                    <span className="text-rose-300 font-mono">Skor 45</span>
                  </div>
                  <p className="text-xs text-slate-200 line-through opacity-75">
                    &quot;Membantu mengurus acara dan kegiatan mahasiswa di kampus.&quot;
                  </p>
                </div>
                <div className="bg-[#fefefd] text-[#0f2c56] rounded-2xl p-3.5 shadow-lg space-y-1 border border-white">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#ce2731]">
                    <span>Sesudah Pasbana AI (Aktif &amp; Terukur)</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-black font-mono">Skor 92</span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">
                    &quot;<strong className="text-[#ce2731]">Menginisiasi &amp; mengelola</strong> seminar karir dengan <strong className="text-[#0f2c56]">350+ peserta</strong> serta kepuasan 94%.&quot;
                  </p>
                </div>
              </div>

              <Link
                href="/evaluate"
                className="relative z-20 w-full py-3 rounded-full bg-[#fefefd] text-[#ce2731] hover:bg-[#fdf2f2] text-xs font-black text-center shadow-md transition"
              >
                Uji Kalimat CV Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 4: OPEN 5D RADAR ON #FEFEFD + PRIMARY/SECOND BLIND SCORING STAGE
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(4)}`}
      >
        <div className="w-full h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left 6 Cols: Open 5-Dimension Radar & Competency Breakdown (No Outer Card) */}
          <div className={`lg:col-span-6 h-full flex flex-col justify-between py-3 sm:py-5 px-4 sm:px-8 lg:px-12 ${getChildAnimClass(4, "left", "delay-75")}`}>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fdf2f2] text-[#ce2731] text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#ce2731]" />
                <span>Standar Penilaian Adil &amp; Analitik 5D</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0f2c56] leading-[1.1]">
                Peta Kekuatan CV &amp;{" "}
                <span className="text-[#ce2731]">Rekrutmen Bebas Bias.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                Ketahui aspek resume yang sudah kuat dan bagian yang masih perlu ditingkatkan melalui pemetaan 5 dimensi yang transparan.
              </p>
            </div>

            {/* Open Radar Visualization + Dimension Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
              <div className="sm:col-span-6 flex justify-center">
                <svg viewBox="0 0 200 140" className="w-full max-w-[240px] h-40">
                  <polygon points="100,14 148,42 148,96 100,124 52,96 52,42" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
                  <polygon points="100,32 132,50 132,86 100,104 68,86 68,50" fill="none" stroke="#e2e8f0" strokeWidth="1.2" />
                  <polygon
                    points="100,18 142,46 138,90 100,114 60,88 64,44"
                    fill="rgba(206,39,49,0.16)"
                    stroke="#ce2731"
                    strokeWidth="2.8"
                  />
                  <text x="100" y="9" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#0f2c56">Format ATS (94%)</text>
                  <text x="155" y="45" textAnchor="start" fontSize="8.5" fontWeight="bold" fill="#0f2c56">Struktur</text>
                  <text x="155" y="96" textAnchor="start" fontSize="8.5" fontWeight="bold" fill="#ce2731">Dampak</text>
                  <text x="44" y="96" textAnchor="end" fontSize="8.5" fontWeight="bold" fill="#0f2c56">Keahlian</text>
                  <text x="44" y="45" textAnchor="end" fontSize="8.5" fontWeight="bold" fill="#0f2c56">Profil</text>
                </svg>
              </div>
              <div className="sm:col-span-6 space-y-2.5 text-xs">
                <div className="border-l-4 border-[#ce2731] pl-3 py-0.5">
                  <p className="font-black text-[#0f2c56]">0% Bias Data Pribadi</p>
                  <p className="text-slate-600 text-[11px]">Tanpa penilaian foto wajah, gender, maupun usia.</p>
                </div>
                <div className="border-l-4 border-[#0f2c56] pl-3 py-0.5">
                  <p className="font-black text-[#0f2c56]">5 Dimensi Standar HRD</p>
                  <p className="text-slate-600 text-[11px]">Dinilai murni dari keahlian, pengalaman, dan hasil kerja.</p>
                </div>
                <div className="border-l-4 border-[#ce2731] pl-3 py-0.5">
                  <p className="font-black text-[#0f2c56]">Kendali Privasi Penuh</p>
                  <p className="text-slate-600 text-[11px]">Hapus berkas dan riwayat evaluasi kapan saja.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Primary (#0f2c56) & Second (#ce2731) Blind Scoring Stage */}
          <div
            className={`lg:col-span-6 h-full rounded-[26px] sm:rounded-[34px] p-6 sm:p-8 text-[#fefefd] flex flex-col justify-between relative overflow-hidden bg-[#0f2c56] lg:bg-transparent shadow-2xl lg:shadow-none border border-white/10 lg:border-transparent origin-right ${getChildAnimClass(4, "right", "delay-150")}`}
          >
            <div className="flex items-center justify-between relative z-20">
              <span className="px-3.5 py-1 rounded-full bg-[#ce2731] text-[#fefefd] text-xs font-black">
                Bebas Bias Rekrutmen
              </span>
              <span className="text-xs font-mono font-bold text-[#fde6e6]">BLIND SCORING</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto relative z-20">
              <div className="sm:col-span-7 space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-[#fefefd] leading-tight">
                  Fokus Murni pada Kompetensi Anda
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Pasbana AI menyaring resume berdasarkan keahlian, pengalaman proyek, dan dampak kerja nyata agar setiap talenta muda mendapat kesempatan yang setara.
                </p>
                <div className="pt-2">
                  <Link
                    href="/evaluate"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ce2731] hover:bg-[#b01e27] text-[#fefefd] text-xs sm:text-sm font-bold shadow-lg transition"
                  >
                    <span>Uji CV Secara Objektif</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* PII Masking Live Status Card */}
              <div className="sm:col-span-5 space-y-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Blind Scoring
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
                      UU PDP No. 27/2022
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#fde6e6]">
                    <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                      <span>Foto &amp; Penampilan</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                        Disamarkan
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                      <span>Usia &amp; Gender</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                        Disamarkan
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                      <span>Fokus Evaluasi</span>
                      <span className="text-[10px] font-bold text-white">Kompetensi Murni</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-20 grid grid-cols-3 gap-3 pt-3 border-t border-white/15 text-center">
              <div>
                <div className="text-lg font-black text-[#fefefd]">100%</div>
                <div className="text-[10px] text-slate-200">Objektif</div>
              </div>
              <div>
                <div className="text-lg font-black text-[#faa9ab]">Aman</div>
                <div className="text-[10px] text-slate-200">Privasi Terjaga</div>
              </div>
              <div>
                <div className="text-lg font-black text-[#fefefd]">Gratis</div>
                <div className="text-[10px] text-slate-200">Tanpa Biaya</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 5: OPEN ARCHITECTURAL 3-STEP TIMELINE ON #FEFEFD (NO CARD BOXES)
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(5)}`}
      >
        <div className="w-full h-full mx-auto flex flex-col justify-between py-2 lg:py-0">
          {/* Open Header Row */}
          <div
            className={`w-full flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 px-4 sm:px-8 border-b-2 border-[#0f2c56]/10 ${getChildAnimClass(5, "down", "delay-75")}`}
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#ce2731]">
                Alur Cepat &amp; Terpandu
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#0f2c56] mt-1">
                Siapkan Karir Impian dalam{" "}
                <span className="text-[#ce2731]">3 Langkah Sederhana.</span>
              </h2>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-[#ce2731] text-[#fefefd] text-xs font-bold self-start sm:self-auto">
              Gratis Selamanya
            </span>
          </div>

          {/* Open 12-Col Architectural Steps */}
          <div className="my-auto py-2 px-4 sm:px-8">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 ${getChildAnimClass(5, "up", "delay-150")}`}>
              {[
                {
                  step: "01",
                  accent: "text-[#ce2731]",
                  bar: "bg-[#ce2731]",
                  title: "Unggah CV atau Isi Kuesioner",
                  desc: "Sudah punya file CV? Unggah langsung. Belum punya CV? Jawab kuesioner singkat dan sistem akan menyusun CV standar ATS untuk Anda.",
                },
                {
                  step: "02",
                  accent: "text-[#0f2c56]",
                  bar: "bg-[#0f2c56]",
                  title: "Terima Skor 5D & Saran Revisi",
                  desc: "Dapatkan rincian skor kesiapan kerja beserta rekomendasi kalimat aktif untuk memperkuat deskripsi pengalaman dan keahlian Anda.",
                },
                {
                  step: "03",
                  accent: "text-[#ce2731]",
                  bar: "bg-[#ce2731]",
                  title: "Lamar Lowongan yang Pas Bana",
                  desc: "Pilih posisi kerja aktif dengan persentase kecocokan tertinggi dan kirim lamaran Anda dengan penuh percaya diri.",
                },
              ].map((item) => (
                <div key={item.step} className="space-y-3 relative p-6 rounded-3xl bg-slate-50/70 border border-slate-100">
                  <div className={`text-5xl sm:text-6xl font-black tracking-tighter ${item.accent}`}>
                    {item.step}
                  </div>
                  <div className={`w-14 h-1.5 rounded-full ${item.bar}`} />
                  <h3 className="text-lg sm:text-xl font-black text-[#0f2c56] pt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Strip in Primary (#0f2c56) */}
          <div
            className={`w-full shrink-0 lg:h-[88px] rounded-[22px] sm:rounded-[28px] bg-[#0f2c56] lg:bg-transparent text-[#fefefd] p-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${getChildAnimClass(5, "up", "delay-200")}`}
          >
            <div className="space-y-0.5">
              <p className="text-sm sm:text-base font-black text-[#fefefd]">
                Belum punya CV? Jangan khawatir!
              </p>
              <p className="text-xs text-slate-300">
                Susun resume 1-kolom berstandar ATS dari nol hanya dalam beberapa menit lewat kuesioner terpandu.
              </p>
            </div>
            <Link
              href="/evaluate?tab=questionnaire"
              className="shrink-0 px-6 py-2.5 rounded-full bg-[#ce2731] hover:bg-[#b01e27] text-[#fefefd] text-xs sm:text-sm font-bold shadow-lg transition"
            >
              Buat CV dari Kuesioner →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 6: BOLD SECOND (#CE2731) & PRIMARY (#0F2C56) CTA STAGE + OPEN FOOTER
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(6)}`}
      >
        <div className="w-full h-full mx-auto flex flex-col justify-between gap-3 py-1 lg:py-0">
          {/* Top Closing Stage in Second (#ce2731) with Value Assurance */}
          <div
            className={`flex-1 min-h-0 w-full rounded-[26px] sm:rounded-[34px] px-6 sm:px-12 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative overflow-hidden bg-[#ce2731] lg:bg-transparent shadow-2xl lg:shadow-none border border-white/10 lg:border-transparent origin-center ${getChildAnimClass(6, "down", "delay-75")}`}
          >

            <div className="lg:col-span-8 space-y-4 text-left relative z-20">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fefefd] text-[#ce2731] text-xs font-black shadow-xs">
                <span>100% Gratis untuk Mahasiswa &amp; Pencari Kerja</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#fefefd] tracking-tight leading-[1.08]">
                Mulai Bersama Pasbana AI Sekarang.
              </h2>
              <p className="text-xs sm:text-base text-[#fde6e6] max-w-xl leading-relaxed font-medium">
                Siap meningkatkan kualitas CV, memperbaiki kalimat pengalaman, dan menemukan peluang kerja yang paling pas bana?
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/evaluate"
                  className="px-7 py-3.5 rounded-full bg-[#fefefd] hover:bg-[#fdf2f2] text-[#ce2731] text-xs sm:text-sm font-black shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Evaluasi CV Sekarang
                </Link>
                <Link
                  href="/jobs"
                  className="px-6 py-3.5 rounded-full bg-[#0f2c56] hover:bg-[#163861] text-[#fefefd] text-xs sm:text-sm font-bold shadow-md transition-all"
                >
                  Lihat Lowongan Kerja
                </Link>
              </div>
            </div>

            {/* Value Assurance Card */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-3 relative z-20">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <div className="text-xs font-black text-white">Analisis Instan 30 Detik</div>
                <div className="text-[11px] text-[#fde6e6] leading-relaxed">
                  Langsung dapatkan evaluasi 5 dimensi dan rekomendasi perbaikan kalimat pengalaman.
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <div className="text-xs font-black text-white">100% Akses Terbuka</div>
                <div className="text-[11px] text-[#fde6e6] leading-relaxed">
                  Tanpa biaya berlangganan, didedikasikan untuk seluruh talenta dan pencari kerja Indonesia.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Open Editorial Footer Directly on #fefefd Canvas (No Card Wrapper) */}
          <footer
            className={`shrink-0 lg:h-[132px] w-full pt-1 px-4 sm:px-8 ${getChildAnimClass(6, "up", "delay-150")}`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-3 border-b border-slate-200/80 text-xs">
              <div className="col-span-2 sm:col-span-1 space-y-1.5">
                <div className="font-black text-base text-[#0f2c56]">
                  Pasbana<span className="text-[#ce2731]"> AI</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Karir yang Baik Dimulai dari Pertemuan yang Pas Bana.
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-[#0f2c56]">Fitur Utama</p>
                <ul className="space-y-1 text-slate-600">
                  <li><Link href="/evaluate" className="hover:text-[#ce2731] transition">Evaluasi CV 5D</Link></li>
                  <li><Link href="/evaluate?tab=questionnaire" className="hover:text-[#ce2731] transition">Kuesioner ATS</Link></li>
                  <li><Link href="/jobs" className="hover:text-[#ce2731] transition">Pencocokan Karir</Link></li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-[#0f2c56]">Platform</p>
                <ul className="space-y-1 text-slate-600">
                  <li><Link href="/dashboard" className="hover:text-[#ce2731] transition">Dashboard ATS</Link></li>
                  <li><Link href="/about" className="hover:text-[#ce2731] transition">Tentang Kami</Link></li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-[#0f2c56]">Akun</p>
                <ul className="space-y-1 text-slate-600">
                  <li><Link href="/login" className="hover:text-[#ce2731] transition">Masuk</Link></li>
                  <li><Link href="/register" className="hover:text-[#ce2731] transition">Daftar Akun</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>© 2026 Pasbana AI. All rights reserved.</span>
              <span>Standar Evaluasi Objektif &amp; Bebas Bias</span>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
