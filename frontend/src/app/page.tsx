"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  CheckCircle2,
  FileCheck,
  Briefcase,
  Target,
  Shield,
} from "lucide-react";
import { ProductMockup } from "@/components/landing/product-mockup";
import { PrinciplesGrid } from "@/components/landing/principles-grid";
import { FeaturesBento } from "@/components/landing/features-bento";
import { DarkCtaBanner } from "@/components/landing/dark-cta-banner";

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

function ScrollRevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`min-h-[calc(100dvh-64px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-12 blur-xs"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  // 0 = Full-Screen Hero + Rising Board ATS
  // 1..4 = Shrunk 33% Sky Banner + 2-Column Interactive Workflow Tabs 1..4
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [heroBoardTab, setHeroBoardTab] = useState<"ats" | "match" | "gap">("ats");
  const stickyTrackRef = useRef<HTMLDivElement | null>(null);

  // Sync sticky stage step (0..4) with native browser scroll (works with touchpad, wheel, scrollbar, keyboard)
  useEffect(() => {
    const handleScroll = () => {
      const track = stickyTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const scrollableDistance = track.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const scrolled = Math.max(0, Math.min(scrollableDistance, -rect.top));
      const progress = scrolled / scrollableDistance; // 0.0 -> 1.0

      if (progress < 0.18) {
        setCurrentSlide(0);
      } else if (progress < 0.39) {
        setCurrentSlide(1);
      } else if (progress < 0.60) {
        setCurrentSlide(2);
      } else if (progress < 0.81) {
        setCurrentSlide(3);
      } else {
        setCurrentSlide(4);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpToWorkflowTab = (stepIndex: number) => {
    setCurrentSlide(stepIndex);
    const track = stickyTrackRef.current;
    if (!track) return;
    const scrollableDistance = track.offsetHeight - window.innerHeight;
    const targetProgress = [0, 0.24, 0.45, 0.66, 0.88][stepIndex] ?? 0.24;
    const trackTop = track.offsetTop;
    window.scrollTo({
      top: trackTop + scrollableDistance * targetProgress,
      behavior: "smooth",
    });
  };

  const isHeroStage = currentSlide === 0;
  const activeWorkflow =
    WORKFLOW_TABS[(currentSlide >= 1 && currentSlide <= 4 ? currentSlide : 1) - 1];

  return (
    <div className="bg-[#fefefd] text-primary">
      {/* =====================================================================
          SECTION 1 & 2 (STICKY SCROLL-CHOREOGRAPHED DRIBBBLE STAGE)
          Scroll 0%: Full-screen Sky Container + Hero + Rising Board ATS
          Scroll 20%-100%: Sky Container shrinks to 33% + 2-Column 4-Step Workflow
          ===================================================================== */}
      <div ref={stickyTrackRef} className="relative h-[420vh]">
        <div className="sticky top-[60px] h-[calc(100dvh-60px)] w-full px-2.5 sm:px-4 pb-2.5 sm:pb-4 pt-1 flex flex-col overflow-hidden select-none">
          {/* TOP MORPHING SKY CONTAINER (100% height on Slide 0, 33% on Slides 1..4) */}
          <div
            className={`relative w-full rounded-[26px] sm:rounded-[34px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
              isHeroStage ? "h-full" : "h-[30%] sm:h-[33%]"
            }`}
            style={{
              background:
                "linear-gradient(180deg, #9ec5eb 0%, #c4def7 46%, #e5f0fb 82%, #f4f9fe 100%)",
            }}
          >
            {/* Animated Drifting Sky Clouds */}
            <div
              className="absolute inset-0 pointer-events-none animate-cloud-drift opacity-75"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 55% 28% at 22% 28%, rgba(255,255,255,0.75) 0%, transparent 70%), radial-gradient(ellipse 60% 32% at 78% 36%, rgba(255,255,255,0.68) 0%, transparent 72%), radial-gradient(ellipse 45% 22% at 50% 62%, rgba(255,255,255,0.55) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* SLIDE 0 CONTENT: HERO HEADLINE + RISING BOARD ATS MOCKUP */}
            <div
              className={`absolute inset-0 flex flex-col justify-between items-center text-center px-4 pt-6 sm:pt-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isHeroStage
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
                  isHeroStage
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
                        Saran CV
                      </button>
                    </div>
                    <span className="text-sm sm:text-base font-light text-slate-400">
                      Board <strong className="font-extrabold text-primary">ATS</strong>
                    </span>
                  </div>
                </div>

                {/* Card Body: Left Metrics & Right Live Feed */}
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

            {/* SLIDES 1..4 COMPACT SKY BANNER HEADLINE (Matches Frame 00:04-00:08) */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                !isHeroStage
                  ? "opacity-100 translate-y-0 blur-0 pointer-events-auto"
                  : "opacity-0 translate-y-8 blur-md pointer-events-none"
              }`}
            >
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-primary max-w-2xl leading-[1.12]">
                Otomasi evaluasi berkas, <br />
                temukan karir dalam hitungan detik
              </h2>
            </div>
          </div>

          {/* BOTTOM SPLIT INTERACTIVE STAGE (Visible on Slides 1..4, 67% height) */}
          <div
            className={`w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden ${
              isHeroStage
                ? "h-0 opacity-0 pointer-events-none mt-0"
                : "flex-1 opacity-100 pointer-events-auto mt-3 sm:mt-4"
            }`}
          >
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
                        onClick={() => jumpToWorkflowTab(tab.stepIndex)}
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

                {/* Bottom-Left Animated Feature Copy & CTA */}
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

                {/* 3D Sculpted Stone Pedestal & Mossy Grass Hill at Bottom */}
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

                {/* FLOATING INTERACTIVE CARD ABOVE THE STONE PEDESTAL */}
                <div
                  key={currentSlide}
                  className="relative z-20 w-full max-w-md mb-8 sm:mb-10 animate-fade-in-up"
                >
                  {currentSlide <= 1 && (
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
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3 (FULL PAGE): INTERACTIVE PRODUCT MOCKUP SHOWCASE
          ===================================================================== */}
      <ScrollRevealSection>
        <ProductMockup />
      </ScrollRevealSection>

      {/* =====================================================================
          SECTION 4 (FULL PAGE): 3 CORE EVALUATION PRINCIPLES & WEIGHTS
          ===================================================================== */}
      <ScrollRevealSection>
        <PrinciplesGrid />
      </ScrollRevealSection>

      {/* =====================================================================
          SECTION 5 (FULL PAGE): KEY BENEFITS BENTO & FINAL CTA BANNER
          ===================================================================== */}
      <ScrollRevealSection className="space-y-12 pb-16">
        <FeaturesBento />
        <DarkCtaBanner />
      </ScrollRevealSection>
    </div>
  );
}
