"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
  mascotSrc: string;
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
    mascotSrc: "/mascot/mascot-power.webp",
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
    mascotSrc: "/mascot/mascot-idea.webp",
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
    mascotSrc: "/mascot/mascot-celebrate.webp",
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
    mascotSrc: "/mascot/mascot-shield.webp",
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

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 760);
  }, []);

  useEffect(() => {
    const syncSlideFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#fitur") {
        goToSlide(1);
      } else if (hash === "#cara-kerja") {
        goToSlide(3);
      } else if (hash === "#prinsip") {
        goToSlide(4);
      }
    };

    syncSlideFromHash();
    window.addEventListener("hashchange", syncSlideFromHash);
    return () => window.removeEventListener("hashchange", syncSlideFromHash);
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
        ? "opacity-0 -translate-y-12 scale-[0.96] z-10 pointer-events-none"
        : "opacity-0 translate-y-12 scale-[0.96] z-10 pointer-events-none";
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
        ? "opacity-0 -translate-y-12 scale-[0.96] z-10 pointer-events-none"
        : "opacity-0 translate-y-12 scale-[0.96] z-10 pointer-events-none";
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

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full relative overflow-hidden bg-[#fefefd] text-[#0f2c56] select-none"
    >
      {/* =====================================================================
          SLIDE 0 & 1: HERO MORPHING STAGE (CARD SHAPE-SHIFTS TO ADAPT TO NEXT SECTION)
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getHeroMorphSectionAnimClass()}`}
      >
        <div className="w-full h-full mx-auto relative">
          {/* THE MORPHING CARD: Smoothly shrinks & shifts from full-width (Slide 0) to right 6 cols (Slide 1) */}
          <div
            className={`absolute rounded-[26px] sm:rounded-[34px] overflow-hidden shadow-2xl border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-10 ${
              activeSlide === 0
                ? "inset-0 w-full h-full border-white/15"
                : "top-[48%] sm:top-[44%] lg:top-0 bottom-0 right-0 left-0 lg:left-[calc(50%+10px)] xl:left-[calc(50%+16px)] w-full lg:w-[calc(50%-10px)] xl:w-[calc(50%-16px)] h-[52%] sm:h-[56%] lg:h-full border-white/10"
            }`}
          >
            {/* Morphing Background Layer 1: Slide 0 Deep Navy Gradient */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeSlide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                background:
                  "linear-gradient(155deg, #07172e 0%, #0e2647 50%, #153866 100%)",
              }}
            >
              <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#ce2731]/20 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#275992]/30 blur-3xl pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Morphing Background Layer 2: Slide 1 Crimson Second Palette Gradient */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activeSlide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                background:
                  "linear-gradient(145deg, #ce2731 0%, #b01e27 48%, #0f2c56 100%)",
              }}
            >
              <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
                aria-hidden="true"
              />
            </div>
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
                RIGHT 6 COLS: Transitions between Slide 0 Hero Action Mascot
                and Slide 1 Stage Card with Power Mascot & Live Previews
                ================================================================= */}
            <div className="lg:col-span-6 h-[52%] sm:h-[56%] lg:h-full relative">
              {/* SLIDE 0 HERO RIGHT STAGE: Spotlight Glow + Action Mascot */}
              <div
                className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  activeSlide === 0
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div
                  className="absolute w-80 sm:w-96 lg:w-[480px] h-80 sm:h-96 lg:h-[480px] rounded-full bg-radial from-[#ce2731]/30 via-[#275992]/25 to-transparent blur-3xl pointer-events-none"
                  aria-hidden="true"
                />
                <div className="relative w-[280px] sm:w-[350px] lg:w-[410px] xl:w-[450px] h-[320px] sm:h-[420px] lg:h-[500px] xl:h-[540px] z-20 pointer-events-none animate-float">
                  <Image
                    src="/mascot/mascot-action.webp"
                    alt="Maskot Pasbana AI"
                    fill
                    className="object-contain object-bottom drop-shadow-[0_28px_40px_rgba(0,0,0,0.45)]"
                    priority
                  />
                </div>
              </div>

              {/* SLIDE 1 STAGE RIGHT CONTENT: Interactive Stage + Power Mascot */}
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

                {/* Center Live Previews + Power Mascot */}
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

                  {/* Power Pose Mascot */}
                  <div className="sm:col-span-5 flex items-center justify-center">
                    <div className="relative w-[180px] sm:w-[220px] lg:w-[260px] xl:w-[290px] h-[220px] sm:h-[260px] lg:h-[320px] xl:h-[350px]">
                      <Image
                        src="/mascot/mascot-power.webp"
                        alt="Maskot Pasbana AI Power Pose"
                        fill
                        className="object-contain object-bottom drop-shadow-[0_24px_32px_rgba(0,0,0,0.5)]"
                      />
                    </div>
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
          SLIDE 2: OPEN EDITORIAL COLUMN + 1 SINGLE SECOND (#CE2731) CARD RIGHT
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(2)}`}
      >
        <div className="w-full h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
          {/* Col 1 (5 Cols): Open Editorial & Feature List (No Card Wrapper) */}
          <div
            className={`lg:col-span-5 h-full flex flex-col justify-between py-3 sm:py-5 px-4 sm:px-8 ${getChildAnimClass(2, "left", "delay-75")}`}
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

          {/* Col 2 (7 Cols): ONE Single Bold Second (#ce2731) Stage Card with Mascot & Metrics */}
          <div
            className={`lg:col-span-7 h-full rounded-[26px] sm:rounded-[34px] p-6 sm:p-8 text-[#fefefd] flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/10 ${getChildAnimClass(2, "right", "delay-150")}`}
            style={{
              background: "linear-gradient(155deg, #ce2731 0%, #b01e27 52%, #0f2c56 100%)",
            }}
          >
            {/* Geometric Grid Pattern & Glow */}
            <div
              className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#0f2c56]/40 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

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

            {/* Center Area inside Card: Metrics & Tags on Left + Large Mascot on Right */}
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

              {/* Large Mascot Power Pose */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <div className="w-48 sm:w-56 lg:w-60 h-52 sm:h-64 lg:h-72 relative animate-float">
                  <Image
                    src="/mascot/mascot-power.webp"
                    alt="Maskot Kandidat Siap Kerja"
                    fill
                    className="object-contain object-bottom drop-shadow-[0_24px_36px_rgba(0,0,0,0.5)]"
                  />
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
        </div>
      </section>

      {/* =====================================================================
          SLIDE 3: OPEN HEADER & METRICS + TREND CHART + SECOND (#CE2731) ASSISTANT STAGE
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(3)}`}
      >
        <div className="w-full h-full mx-auto flex flex-col justify-between gap-4 py-1.5">
          {/* Top Open Editorial Row + Open Typographic Metrics (No Card Boxes) */}
          <div
            className={`w-full flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-3 border-b border-slate-200/80 px-4 sm:px-8 shrink-0 ${getChildAnimClass(3, "down", "delay-75")}`}
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

          {/* Bottom Split: Left Trend Visualization (7 Cols) + Right Second (#ce2731) Assistant Card with Mascot (5 Cols) */}
          <div className="flex-1 min-h-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left 7 Cols: Clean Soft-Rose (#fdf2f2) & Navy Trend Visualization */}
            <div
              className={`lg:col-span-7 h-full rounded-[26px] sm:rounded-[34px] bg-[#fdf2f2] border border-[#fde6e6] p-6 sm:p-7 flex flex-col justify-between ${getChildAnimClass(3, "left", "delay-150")}`}
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
                <defs>
                  <linearGradient id="crimsonAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ce2731" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#ce2731" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 92 Q80 80, 150 58 T290 36 T390 18 T450 10 L450 110 L0 110 Z"
                  fill="url(#crimsonAreaGrad)"
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
                  Buka Ruang Evaluasi →
                </Link>
              </div>
            </div>

            {/* Right 5 Cols: Bold Second (#ce2731) Card + Large Mascot Idea Pose */}
            <div
              className={`lg:col-span-5 h-full rounded-[26px] sm:rounded-[34px] p-6 sm:p-7 text-[#fefefd] flex flex-col justify-between relative overflow-hidden shadow-xl ${getChildAnimClass(3, "right", "delay-200")}`}
              style={{
                background: "linear-gradient(150deg, #ce2731 0%, #b01e27 55%, #0f2c56 100%)",
              }}
            >
              <div className="space-y-2 relative z-20">
                <span className="px-3 py-1 rounded-full bg-[#fefefd]/15 text-xs font-bold text-[#fefefd]">
                  Saran Kalimat Aktif
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#fefefd] leading-tight">
                  Ubah Pengalaman Biasa Jadi Berdampak
                </h3>
              </div>

              <div className="grid grid-cols-12 gap-3 items-center my-auto relative z-20">
                <div className="col-span-7 bg-[#fefefd] text-[#0f2c56] rounded-2xl p-4 shadow-lg space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#ce2731]">
                    Contoh Perbaikan
                  </p>
                  <p className="text-xs font-semibold leading-relaxed">
                    &quot;<strong className="text-[#ce2731]">Mengelola</strong> acara kampus dengan <strong className="text-[#0f2c56]">350+ peserta</strong> dan tingkat kepuasan 94%.&quot;
                  </p>
                </div>
                <div className="col-span-5 flex items-center justify-center">
                  <div className="w-32 h-44 sm:w-36 sm:h-48 relative animate-float">
                    <Image
                      src="/mascot/mascot-idea.webp"
                      alt="Maskot Ide Kalimat Aktif"
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
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
          SLIDE 4: OPEN 5D RADAR ON #FEFEFD + PRIMARY/SECOND BLIND SCORING STAGE WITH MASCOT SHIELD
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

          {/* Right 6 Cols: Primary (#0f2c56) & Second (#ce2731) Blind Scoring Stage with Large Mascot Shield */}
          <div
            className={`lg:col-span-6 h-full rounded-[26px] sm:rounded-[34px] p-6 sm:p-8 text-[#fefefd] flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/10 ${getChildAnimClass(4, "right", "delay-150")}`}
            style={{
              background: "linear-gradient(145deg, #0f2c56 0%, #163861 52%, #ce2731 100%)",
            }}
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

              <div className="sm:col-span-5 flex items-center justify-center">
                <div className="w-44 h-56 sm:w-52 sm:h-64 relative animate-float">
                  <Image
                    src="/mascot/mascot-shield.webp"
                    alt="Maskot Penilaian Objektif"
                    fill
                    className="object-contain drop-shadow-[0_22px_32px_rgba(8,27,55,0.5)]"
                  />
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
          SLIDE 5: OPEN ARCHITECTURAL 3-STEP TIMELINE ON #FEFEFD (NO CARD BOXES) + MASCOT
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(5)}`}
      >
        <div className="w-full h-full mx-auto flex flex-col justify-between py-2 px-4 sm:px-8">
          {/* Open Header Row */}
          <div
            className={`w-full flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b-2 border-[#0f2c56]/10 ${getChildAnimClass(5, "down", "delay-75")}`}
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

          {/* Open 12-Col Architectural Steps + Large Mascot Walk Companion */}
          <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2">
            <div className={`lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-8 ${getChildAnimClass(5, "left", "delay-150")}`}>
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
                <div key={item.step} className="space-y-3 relative">
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

            {/* Large Mascot Walking Forward on Right 3 Cols */}
            <div className={`hidden lg:flex lg:col-span-3 items-center justify-center ${getChildAnimClass(5, "right", "delay-200")}`}>
              <div className="w-52 h-64 xl:w-60 xl:h-72 relative animate-float">
                <Image
                  src="/mascot/mascot-walk.webp"
                  alt="Maskot Langkah Karir Pasbana AI"
                  fill
                  className="object-contain drop-shadow-[0_20px_28px_rgba(15,44,86,0.22)]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Strip in Second (#ce2731) & Primary (#0f2c56) */}
          <div
            className={`w-full rounded-[22px] sm:rounded-[28px] bg-[#0f2c56] text-[#fefefd] p-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${getChildAnimClass(5, "up", "delay-200")}`}
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
        <div className="w-full h-full mx-auto flex flex-col justify-between gap-3 py-1">
          {/* Top Closing Stage in Second (#ce2731) & Primary (#0f2c56) with Large Celebrating Mascot */}
          <div
            className={`flex-1 min-h-0 w-full rounded-[26px] sm:rounded-[34px] px-6 sm:px-12 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative overflow-hidden shadow-2xl border border-white/10 ${getChildAnimClass(6, "down", "delay-75")}`}
            style={{
              background: "linear-gradient(135deg, #ce2731 0%, #b01e27 52%, #0f2c56 100%)",
            }}
          >
            <div
              className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
              aria-hidden="true"
            />

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

            <div className="hidden lg:flex lg:col-span-4 items-center justify-center relative z-20">
              <div className="w-52 h-60 xl:w-60 xl:h-68 relative animate-float">
                <Image
                  src="/mascot/mascot-celebrate.webp"
                  alt="Maskot Selebrasi Pasbana AI"
                  fill
                  className="object-contain drop-shadow-[0_24px_34px_rgba(8,27,55,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Open Editorial Footer Directly on #fefefd Canvas (No Card Wrapper) */}
          <footer
            className={`shrink-0 w-full pt-1 px-4 sm:px-8 ${getChildAnimClass(6, "up", "delay-150")}`}
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
