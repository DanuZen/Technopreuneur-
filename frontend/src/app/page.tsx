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
  Cpu,
  Database,
  Layers,
} from "lucide-react";

interface WorkflowStageData {
  stepIndex: number;
  tabLabel: string;
  tabSub: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

const WORKFLOW_TABS: WorkflowStageData[] = [
  {
    stepIndex: 1,
    tabLabel: "Ekstraksi",
    tabSub: "Alur Cerdas ATS",
    title: "Ekstraksi Digital",
    description:
      "Otomatisasi pembacaan layer teks resume PDF dan DOCX secara instan. Menyaring tata letak tabel berlapis dan menyamarkan identitas sensitif demi evaluasi yang murni objektif.",
    ctaText: "Mulai Unggah Berkas",
    ctaHref: "/evaluate",
  },
  {
    stepIndex: 2,
    tabLabel: "5 Dimensi",
    tabSub: "Standar Perekrut",
    title: "Analisis 5 Dimensi",
    description:
      "Mengukur kesiapan CV Anda melalui lima tolok ukur utama industri: kompatibilitas format ATS, kejelasan struktur, kata kerja aktif (action verbs), dampak terukur, dan relevansi skill.",
    ctaText: "Uji Skor 5 Dimensi",
    ctaHref: "/evaluate",
  },
  {
    stepIndex: 3,
    tabLabel: "Integrasi Loker",
    tabSub: "pgvector + LLM",
    title: "Pencocokan Presisi",
    description:
      "Menghubungkan profil kompetensi Anda dengan ekosistem lowongan mitra industri dan agregator Jooble melalui pencarian kemiripan vektor dua tahap yang akurat.",
    ctaText: "Bangun Karir Anda",
    ctaHref: "/jobs",
  },
  {
    stepIndex: 4,
    tabLabel: "Keamanan",
    tabSub: "UU PDP No. 27/2022",
    title: "Privasi & Etika",
    description:
      "Kendali penuh atas data pribadi ada di tangan Anda. Seluruh analisis menerapkan blind scoring bebas bias gender atau usia serta dilengkapi hak hapus permanen kapan saja.",
    ctaText: "Pelajari Kepatuhan",
    ctaHref: "/about",
  },
];

const TOTAL_SLIDES = 7; // 0: Hero, 1..4: Workflow Tabs 1..4, 5: Bento & Principles, 6: Final CTA & Footer

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [heroBoardTab, setHeroBoardTab] = useState<"ats" | "match" | "gap">("ats");
  const isAnimatingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);

  const goToSlide = useCallback((target: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, target));
    if (clamped === currentSlide || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setCurrentSlide(clamped);
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 720);
  }, [currentSlide]);

  // Wheel / Trackpad scroll handler (1 section per scroll gesture)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;
      if (Math.abs(e.deltaY) < 16) return;

      if (e.deltaY > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
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
    };
  }, [currentSlide, goToSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || isAnimatingRef.current) return;
    const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 40) {
      if (deltaY > 0) {
        goToSlide(currentSlide + 1);
      } else {
        goToSlide(currentSlide - 1);
      }
    }
    touchStartYRef.current = null;
  };

  const isFullSkyStage = currentSlide === 0 || currentSlide === 6;
  const isWorkflowStage = currentSlide >= 1 && currentSlide <= 4;
  const isBentoStage = currentSlide === 5;
  const activeWorkflow = WORKFLOW_TABS[(currentSlide >= 1 && currentSlide <= 4 ? currentSlide : 1) - 1];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full p-2.5 sm:p-4 flex flex-col bg-[#fefefd] relative overflow-hidden select-none"
    >
      {/* =====================================================================
          TOP MORPHING SKY CONTAINER (100% height on Slide 0 & 6, 33% on 1..5)
          ===================================================================== */}
      <div
        className={`relative w-full rounded-[26px] sm:rounded-[34px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
          isFullSkyStage ? "h-full" : "h-[30%] sm:h-[33%]"
        }`}
        style={{
          background:
            "linear-gradient(180deg, #9ec5eb 0%, #c4def7 46%, #e5f0fb 82%, #f4f9fe 100%)",
        }}
      >
        {/* Animated Drifting Sky Clouds (Matching Dribbble Sky Video) */}
        <div
          className="absolute inset-0 pointer-events-none animate-cloud-drift opacity-75"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 55% 28% at 22% 28%, rgba(255,255,255,0.75) 0%, transparent 70%), radial-gradient(ellipse 60% 32% at 78% 36%, rgba(255,255,255,0.68) 0%, transparent 72%), radial-gradient(ellipse 45% 22% at 50% 62%, rgba(255,255,255,0.55) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* -------------------------------------------------------------------
            SLIDE 0 CONTENT: HERO HEADLINE + RISING BOARD CRM/ATS MOCKUP
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col justify-between items-center text-center px-4 pt-16 sm:pt-20 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
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

          {/* Bottom Rising White Dashboard Card (Matches Dribbble 00:01-00:02 Board CRM) */}
          <div
            className={`relative z-10 w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-t-[28px] sm:rounded-t-[36px] shadow-2xl p-4 sm:p-7 pb-10 sm:pb-14 text-left transition-all duration-700 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              currentSlide === 0
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-28 opacity-0 scale-95"
            }`}
          >
            {/* Card Header: Candidate Profile Left, Board Title Right */}
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
                    Gap Skill
                  </button>
                </div>
                <span className="text-sm sm:text-base font-light text-slate-400">
                  Board <strong className="font-extrabold text-primary">ATS</strong>
                </span>
              </div>
            </div>

            {/* Card Body: Left Metrics & Right Live Feed (Exact Dribbble CRM Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left 5 Cols: 3 Big Numbers + Bottom Highlight Metric */}
              <div className="md:col-span-5 space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Ringkasan Bulan Ini
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

              {/* Right 7 Cols: Dynamic Interactive Detail Box */}
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
                      <span className="text-xs font-bold text-primary">Junior Frontend Engineer</span>
                      <span className="text-xs font-black text-emerald-600">92% Match</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      PT Solusi Teknologi Nusantara • Jakarta (Hybrid)
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-semibold shadow-2xs">
                        Next.js 14
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-semibold shadow-2xs">
                        TypeScript
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-primary text-[10px] font-semibold shadow-2xs">
                        Tailwind CSS
                      </span>
                    </div>
                  </div>
                )}

                {heroBoardTab === "gap" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900">Rekomendasi Peningkatan Skill</span>
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        +6 Poin ATS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Tambahkan pengalaman pengujian otomatis (Unit Testing / Vitest) pada deskripsi proyek akhir Anda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lush Rolling Grassy Hill Foreground Overlapping Bottom Edge (Matches Frame 00:01-00:02) */}
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
            SLIDES 1..4 COMPACT SKY BANNER HEADLINE (Matches Frame 00:04-00:08)
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-10 sm:pt-12 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isWorkflowStage
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
            SLIDE 5 COMPACT SKY BANNER HEADLINE (Bento & Principles)
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-10 sm:pt-12 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isBentoStage
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-8 blur-md pointer-events-none"
          }`}
        >
          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-primary max-w-2xl leading-[1.12]">
            Standar evaluasi objektif, <br />
            fondasi etika bebas bias
          </h2>
        </div>

        {/* -------------------------------------------------------------------
            SLIDE 6 CONTENT: FULL-SCREEN CLOSING CTA + INTEGRATED FOOTER
            ------------------------------------------------------------------- */}
        <div
          className={`absolute inset-0 flex flex-col justify-between items-center text-center px-4 pt-16 sm:pt-20 pb-8 sm:pb-12 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            currentSlide === 6
              ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
              : "opacity-0 translate-y-12 blur-md pointer-events-none"
          }`}
        >
          <div className="my-auto max-w-2xl mx-auto space-y-5 z-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md shadow-xs text-xs font-semibold text-primary">
              <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>100% Gratis • Tanpa Biaya Langganan (Rp 0)</span>
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

          {/* Integrated Compact Footer Bar inside Final Slide */}
          <footer className="w-full max-w-5xl mx-auto bg-white/85 backdrop-blur-md rounded-2xl px-5 py-3.5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 z-20">
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
          BOTTOM SPLIT INTERACTIVE STAGE (Visible on Slides 1..5, 67% height)
          ===================================================================== */}
      <div
        className={`w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${
          isFullSkyStage
            ? "h-0 opacity-0 pointer-events-none mt-0"
            : "flex-1 opacity-100 pointer-events-auto mt-3 sm:mt-4"
        }`}
      >
        {/* -------------------------------------------------------------------
            SLIDES 1..4: 2-COLUMN WORKFLOW SHOWCASE (Matches Frame 00:05-00:08)
            ------------------------------------------------------------------- */}
        {isWorkflowStage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-full">
            {/* LEFT COLUMN: 4 Horizontal Tabs at Top + Animated Title/Desc/CTA at Bottom */}
            <div className="lg:col-span-6 flex flex-col justify-between p-3 sm:p-6 h-full">
              {/* Top 4-Tab Row with Top Progress Indicator Lines */}
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
                      {/* Top Progress Line */}
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

              {/* Bottom-Left Animated Feature Copy & CTA (Blur-Slide Transition) */}
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

            {/* RIGHT COLUMN: Rounded Sky + 3D Sculpted Stone on Grass Hill + Floating UI Card */}
            <div
              className="lg:col-span-6 rounded-[26px] sm:rounded-[34px] relative overflow-hidden flex items-center justify-center p-4 sm:p-8 h-full"
              style={{
                background:
                  "linear-gradient(180deg, #9fc6ec 0%, #c8e0f7 52%, #e8f2fc 88%, #f5f9fd 100%)",
              }}
            >
              {/* Soft Cloud Glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-70"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 60% 35% at 30% 25%, rgba(255,255,255,0.75) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 75% 40%, rgba(255,255,255,0.65) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* 3D Sculpted Stone Pedestal & Mossy Grass Hill at Bottom (Matches Frame 00:05-00:08) */}
              <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 pointer-events-none z-10">
                <svg
                  viewBox="0 0 800 220"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="none"
                >
                  {/* Sculpted 3D Flat-Top Stone Boulder */}
                  <polygon points="210,125 360,92 610,104 650,155 180,165" fill="#d8dcd8" />
                  <polygon points="210,125 360,92 430,132 180,165" fill="#eaedea" />
                  <polygon points="360,92 610,104 650,155 430,132" fill="#b4bcb6" />
                  <polygon points="180,165 430,132 650,155 620,185 160,185" fill="#7c857e" />
                  {/* Grassy Mossy Hill Foreground */}
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

              {/* FLOATING INTERACTIVE CARD ABOVE THE STONE PEDESTAL */}
              <div
                key={currentSlide}
                className="relative z-20 w-full max-w-md mb-8 sm:mb-10 animate-fade-in-up"
              >
                {/* SLIDE 1 CARD: AI CV Parser Conversation Card (Matches Frame 00:06-00:07) */}
                {currentSlide === 1 && (
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl space-y-3.5 text-left">
                    {/* Top Action Icon Bar */}
                    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                      <FileCheck className="w-3.5 h-3.5 text-primary" />
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <Target className="w-3.5 h-3.5 text-secondary" />
                      <Cpu className="w-3.5 h-3.5 text-primary" />
                    </div>

                    {/* Incoming Resume File Bubble */}
                    <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl">
                      <div className="w-7 h-7 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        WF
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="font-bold text-primary">Berkas Kandidat</p>
                        <p className="text-slate-600 text-[11px]">
                          Mengunggah <span className="font-mono font-semibold">CV_Wira_Fikri_ATS.pdf</span> (1.420 kata)
                        </p>
                      </div>
                    </div>

                    {/* Pasbana AI Parser Reply Bubble */}
                    <div className="bg-blue-50/70 p-3.5 rounded-2xl space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-primary">
                        <span>Pasbana Parser</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        Layer teks digital 1-kolom terverifikasi bersih. Atribut foto wajah dan usia telah disamarkan (PII Masking) untuk blind scoring.
                      </p>
                    </div>
                  </div>
                )}

                {/* SLIDE 2 CARD: 5-Dimension Matrix Card */}
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
                        { label: "1. Struktur & Format ATS", val: 94, color: "bg-primary" },
                        { label: "2. Kejelasan Deskripsi Karir", val: 85, color: "bg-sky-500" },
                        { label: "3. Dampak Terukur (Action Verbs)", val: 82, color: "bg-emerald-500" },
                        { label: "4. Relevansi Keahlian Teknis", val: 90, color: "bg-secondary" },
                        { label: "5. Kelengkapan Profil & Kontak", val: 89, color: "bg-amber-500" },
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

                {/* SLIDE 3 CARD: 6-Tile Ecosystem Grid + Bottom Floating Pill (Matches Frame 00:08!) */}
                {currentSlide === 3 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5 text-left">
                      {[
                        { name: "React & Next.js", sub: "96% Kecocokan Skill", dot: "bg-sky-500" },
                        { name: "TypeScript", sub: "94% Kecocokan Skill", dot: "bg-primary" },
                        { name: "FastAPI Service", sub: "88% Kecocokan Skill", dot: "bg-emerald-500" },
                        { name: "PostgreSQL pgvector", sub: "Indeks Vektor HNSW", dot: "bg-indigo-500" },
                        { name: "Mitra Industri", sub: "12 Lowongan Internal", dot: "bg-secondary" },
                        { name: "Jooble Indonesia", sub: "Agregasi Loker Aktif", dot: "bg-amber-500" },
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

                    {/* Floating Center Pill below 6-grid (Exact match to Frame 00:08) */}
                    <div className="flex justify-center">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-xl text-xs font-semibold text-primary">
                        <Database className="w-3.5 h-3.5 text-primary" />
                        <Cpu className="w-3.5 h-3.5 text-secondary" />
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-mono">Two-Stage Match: 92%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 4 CARD: Privacy & UU PDP 2022 Vault */}
                {currentSlide === 4 && (
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-primary">Protokol Kepatuhan UU PDP</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                        UU No. 27/2022
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">Blind Scoring Bebas Bias</p>
                          <p className="text-[10px] text-slate-500">Tanpa parameter foto, gender, dan suku</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">Right to be Forgotten</p>
                          <p className="text-[10px] text-slate-500">Hapus riwayat &amp; berkas permanen 1-klik</p>
                        </div>
                        <span className="text-[10px] font-bold text-primary bg-blue-100 px-2 py-0.5 rounded-full">
                          Tersedia
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
            SLIDE 5: BENTO & PRINCIPLES FULL-PAGE STAGE
            ------------------------------------------------------------------- */}
        {isBentoStage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full animate-fade-in-up">
            {/* Left 7 Columns: 3 Core Evaluation Weight Cards + Primary Navy Blind Scoring Card */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-3 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-50/90 to-white shadow-sm flex flex-col justify-between">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 my-auto py-1">
                    <h3 className="text-xs sm:text-sm font-bold text-primary">1. Struktur &amp; ATS</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Keterbacaan layer teks digital 1-kolom tanpa informasi terpotong.
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
                      Penggunaan action verbs dan capaian numerik pada pengalaman.
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
                      Kesesuaian keahlian teknis dengan kebutuhan riil industri.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full self-start">
                    Bobot 45%
                  </span>
                </div>
              </div>

              {/* Navy Anchor Bento Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0f2c56] via-[#163861] to-[#0a1e3b] text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 font-bold">
                    Objektivitas Murni
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Blind Scoring Bebas Subjektivitas
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Penyaringan mengabaikan foto wajah, usia, dan gender. Evaluasi bertumpu murni pada kompetensi nyata kandidat.
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

            {/* Right 5 Columns: Stacked Ethics & Free Architecture Cards */}
            <div className="lg:col-span-5 flex flex-col gap-3 h-full">
              <div className="flex-1 p-5 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/40 to-white shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold bg-emerald-100/90 px-2.5 py-0.5 rounded-full inline-block">
                    Akses Terbuka
                  </span>
                  <h3 className="text-xl font-black text-emerald-950">100% Bebas Biaya (Rp 0)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Seluruh mahasiswa dan pencari kerja dapat mengevaluasi CV serta menyusun resume ATS tanpa biaya langganan apapun.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Zero Budget Cloud Architecture</span>
                </div>
              </div>

              <div className="flex-1 p-5 rounded-3xl bg-gradient-to-br from-rose-50/95 via-red-50/40 to-white shadow-sm flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-bold bg-rose-100/90 px-2.5 py-0.5 rounded-full inline-block">
                    Perlindungan Hukum
                  </span>
                  <h3 className="text-xl font-black text-secondary">Kepatuhan UU PDP 2022</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mematuhi regulasi UU No. 27 Tahun 2022 dengan persetujuan eksplisit dan fitur penghapusan berkas permanen.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-secondary font-semibold">
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  <span>Privasi Kandidat Terlindungi</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
