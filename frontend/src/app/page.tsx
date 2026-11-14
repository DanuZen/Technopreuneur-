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

const TOTAL_SLIDES = 7;

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
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

  // Locked viewport wheel/touchpad/keyboard handler (zero vertical scrollbar)
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

  const slideStateClass = (idx: number) => {
    if (currentSlide === idx) {
      return "opacity-100 translate-y-0 scale-100 blur-0 pointer-events-auto z-20";
    }
    if (currentSlide > idx) {
      return "opacity-0 -translate-y-10 scale-[0.98] blur-sm pointer-events-none z-10";
    }
    return "opacity-0 translate-y-10 scale-[0.98] blur-sm pointer-events-none z-10";
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full relative overflow-hidden bg-[#f7fafe] text-[#0d1f33] select-none"
    >
      {/* =====================================================================
          SLIDE 0: LUMINOUS SKY-BLUE SPLIT HERO + FLOATING CHAT/ATS CARD
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-2.5 sm:p-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${slideStateClass(0)}`}
      >
        <div
          className="h-full w-full rounded-[28px] sm:rounded-[36px] relative overflow-hidden flex items-center px-6 sm:px-12 lg:px-16"
          style={{
            background:
              "linear-gradient(165deg, #4b94e6 0%, #6cb2f2 42%, #9ad0fa 78%, #d7ecfe 100%)",
          }}
        >
          {/* Flowing Wave Ambient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-65"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 65% 40% at 18% 20%, rgba(255,255,255,0.28) 0%, transparent 70%), radial-gradient(ellipse 60% 45% at 85% 75%, rgba(255,255,255,0.45) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Crisp White Typography & Dual Pill CTA */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-white" />
                <span>Pasbana AI • Karir yang Pas Bana</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-white leading-[1.06] drop-shadow-xs">
                Ukur. Temukan. <br />
                Wujudkan Karir <br />
                Impian Anda.
              </h1>

              <p className="text-sm sm:text-base text-white/90 max-w-lg leading-relaxed font-medium">
                Platform evaluasi CV cerdas 5 dimensi yang membantu mahasiswa dan fresh graduate lolos seleksi HRD serta menemukan lowongan paling pas bana.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/evaluate"
                  className="inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-[#7dbaf5]/80 hover:bg-[#7dbaf5] text-white font-bold text-sm shadow-lg shadow-[#1d5ca3]/25 transition-all hover:-translate-y-0.5 backdrop-blur-md border border-white/30"
                >
                  <span>Mulai Evaluasi Gratis</span>
                  <span className="w-9 h-9 rounded-full bg-white text-[#0d1f33] flex items-center justify-center shadow-xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link
                  href="/evaluate?tab=questionnaire"
                  className="text-xs sm:text-sm font-semibold text-white/95 hover:text-white underline-offset-4 hover:underline flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Belum punya CV? Isi Kuesioner</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Floating Evaluation Card + Flanking Metric Chips */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Floating Left Metric Chip */}
                <div className="hidden sm:block absolute -left-10 top-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl w-36 animate-float">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                    <FileCheck className="w-3.5 h-3.5 text-[#3b8eeb]" />
                    <span>Skor ATS</span>
                  </div>
                  <div className="text-2xl font-black text-[#0d1f33] mt-1">88</div>
                  <div className="text-[10px] font-semibold text-emerald-600">+18% kesiapan</div>
                </div>

                {/* Floating Right Metric Chip */}
                <div className="hidden sm:block absolute -right-8 top-14 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl w-36 animate-float-delay">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                    <Target className="w-3.5 h-3.5 text-[#3b8eeb]" />
                    <span>Kecocokan Karir</span>
                  </div>
                  <div className="text-2xl font-black text-[#0d1f33] mt-1">92%</div>
                  <div className="text-[10px] font-semibold text-[#3b8eeb]">12 Loker Cocok</div>
                </div>

                {/* Main Center Card (Chat/Assistant Style from Reference) */}
                <div className="bg-white/95 backdrop-blur-xl rounded-[28px] p-5 shadow-2xl shadow-[#164b8a]/20 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#4b94e6] text-white text-xs font-bold flex items-center justify-center">
                        PA
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0d1f33]">Asisten Karir Pasbana</p>
                        <p className="text-[10px] text-emerald-600 font-semibold">Evaluasi 5 Dimensi Aktif</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">CV-2026</span>
                  </div>

                  {/* Conversation Bubbles */}
                  <div className="space-y-2.5 text-xs">
                    <div className="bg-slate-100 text-slate-700 p-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                      Halo! Apakah format CV 1-kolom saya sudah aman untuk seleksi HRD?
                    </div>
                    <div className="bg-[#5aa9f4] text-white p-3 rounded-2xl rounded-tr-sm ml-auto max-w-[88%] shadow-sm">
                      Format CV Anda sangat rapi (Skor 94%). Tambahkan angka pencapaian pada pengalaman magang agar nilai dampak naik ke 90%!
                    </div>
                    <div className="bg-slate-100 text-slate-700 p-2.5 rounded-2xl rounded-tl-sm max-w-[80%] font-medium">
                      Rekomendasi posisi: <span className="text-[#0d1f33] font-bold">Management Trainee (92%)</span>
                    </div>
                  </div>
                </div>

                {/* Floating Bottom-Left Mini Area Chart Card */}
                <div className="hidden sm:block absolute -left-8 -bottom-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl w-44">
                  <p className="text-[10px] font-bold text-slate-500 mb-1">Progres Kesiapan CV</p>
                  <svg viewBox="0 0 160 44" className="w-full h-10">
                    <defs>
                      <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5aa9f4" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#5aa9f4" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 38 Q30 34, 55 24 T110 18 T160 6 L160 44 L0 44 Z"
                      fill="url(#heroArea)"
                    />
                    <path
                      d="M0 38 Q30 34, 55 24 T110 18 T160 6"
                      fill="none"
                      stroke="#4b94e6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 1: THE COMPLETE PLATFORM — 3 DISTINCT FEATURE SHOWCASE CARDS
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-4 sm:p-8 lg:p-12 flex flex-col justify-center bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${slideStateClass(1)}`}
      >
        <div className="max-w-6xl mx-auto w-full space-y-8">
          {/* Split Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d1f33] leading-tight">
                Platform Lengkap untuk <br />
                <span className="text-[#4b94e6]">Persiapan Karir Anda</span>
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-sm text-[#5a6b7f] leading-relaxed max-w-xl">
                Pasbana AI dirancang untuk membantu talenta muda melewati tahap seleksi awal dengan percaya diri, mulai dari menyusun CV standar HR hingga menemukan lowongan yang paling sesuai.
              </p>
            </div>
          </div>

          {/* 3 Feature Cards (Matches Ref Part 1 Bottom) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 8-Tile Feature Grid */}
            <div className="rounded-[28px] bg-[#f8fbff] border border-[#e6eef7] p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition">
              <div className="space-y-4">
                <div className="text-center font-bold text-sm text-[#0d1f33]">
                  Ekosistem Fitur <span className="text-[#4b94e6]">Pasbana AI</span>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { icon: FileCheck, bg: "bg-blue-50 text-[#3b8eeb]", label: "ATS" },
                    { icon: BarChart3, bg: "bg-sky-50 text-sky-600", label: "5D" },
                    { icon: FileSpreadsheet, bg: "bg-indigo-50 text-indigo-600", label: "Form" },
                    { icon: Briefcase, bg: "bg-emerald-50 text-emerald-600", label: "Loker" },
                    { icon: Target, bg: "bg-amber-50 text-amber-600", label: "Skill" },
                    { icon: ShieldCheck, bg: "bg-rose-50 text-rose-600", label: "Adil" },
                    { icon: CheckCircle2, bg: "bg-teal-50 text-teal-600", label: "Saran" },
                    { icon: Lock, bg: "bg-slate-100 text-slate-700", label: "Aman" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-2xl bg-white border border-slate-100 shadow-2xs flex flex-col items-center justify-center gap-1"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.bg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#0d1f33]">Evaluasi &amp; Kuesioner Terpadu</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Sudah punya CV maupun belum, Anda bisa langsung mengukur kesiapan kerja dalam satu tempat.
                </p>
              </div>
            </div>

            {/* Card 2: Rocket Boost Illustration */}
            <div className="rounded-[28px] bg-[#f8fbff] border border-[#e6eef7] p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition">
              <div className="relative h-40 flex flex-col items-center justify-center">
                <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-100 text-[10px] font-bold text-[#0d1f33] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Kandidat Siap Kerja
                </span>
                <div className="my-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5aa9f4] to-[#3b8eeb] text-white flex items-center justify-center shadow-lg shadow-blue-400/30">
                  <Rocket className="w-8 h-8" />
                </div>
                <div className="self-end px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-bold text-[#0d1f33] shadow-xs">
                  Tingkatkan Peluang Lolos HRD
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#0d1f33]">Uji &amp; Perbaiki dalam Hitungan Detik</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Dapatkan rincian skor dan saran kalimat aktif yang langsung bisa Anda terapkan pada resume.
                </p>
              </div>
            </div>

            {/* Card 3: Concentric Blue Target */}
            <div className="rounded-[28px] bg-[#f8fbff] border border-[#e6eef7] p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition">
              <div className="relative h-40 flex flex-col items-center justify-center">
                <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-100 text-[10px] font-bold text-[#0d1f33] shadow-2xs">
                  <Target className="w-3 h-3 text-[#4b94e6]" />
                  Rekomendasi Otomatis
                </span>
                <div className="my-auto relative flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-4 border-[#90c6fa]/40 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-[#5aa9f4]/70 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#4b94e6]" />
                    </div>
                  </div>
                </div>
                <div className="self-end inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-100 text-[10px] font-bold text-[#0d1f33] shadow-xs">
                  <Clock className="w-3 h-3 text-[#4b94e6]" />
                  <span>Hemat Waktu Cari Loker</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#0d1f33]">Pencocokan Karir yang Pas Bana</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Temukan posisi aktif yang sesuai keahlian Anda tanpa perlu menebak kualifikasi perusahaan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 2: DASHBOARD OVERVIEW + SIDE ASSISTANT (Ref Part 2 Bottom)
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-4 sm:p-8 lg:p-10 flex flex-col justify-center bg-[#f6f9fd] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${slideStateClass(2)}`}
      >
        <div className="max-w-6xl mx-auto w-full space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0d1f33]">
              <span className="text-[#4b94e6]">Pasbana AI</span> Cepat Digunakan, <br />
              Mudah Dipahami Semua Kalangan.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left 8 Cols: Clean Overview Dashboard Window */}
            <div className="lg:col-span-8 bg-white rounded-[28px] border border-[#e3edf7] shadow-xl shadow-[#4b94e6]/10 p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0d1f33]">Ringkasan Evaluasi CV</h3>
                  <p className="text-[11px] text-[#5a6b7f]">Pantau perkembangan skor dan kesiapan kerja Anda</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-[11px] font-bold">
                  Standar HRD
                </span>
              </div>

              {/* Sky-Blue Chart Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-[#539ce8] to-[#7abdf7] p-4 text-white space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Tren Skor Kesiapan Resume</span>
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px]">+24 Poin</span>
                </div>
                <svg viewBox="0 0 420 75" className="w-full h-16">
                  <path
                    d="M0 62 Q70 54, 130 40 T260 28 T360 16 T420 8"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="420" cy="8" r="4.5" fill="#ffffff" />
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
                  <div key={m.label} className="p-3 rounded-2xl bg-[#f8fbff] border border-[#e6eef7]">
                    <p className="text-[10px] text-[#5a6b7f] font-medium">{m.label}</p>
                    <p className="text-lg font-black text-[#0d1f33] mt-0.5">{m.val}</p>
                    <p className="text-[10px] font-bold text-[#3b8eeb]">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 4 Cols: Side Assistant Card */}
            <div className="lg:col-span-4 bg-white rounded-[28px] border border-[#e3edf7] shadow-xl shadow-[#4b94e6]/10 p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-[#0d1f33]">Saran Perbaikan Langsung</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="space-y-3 text-xs my-auto">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
                  Bagaimana cara memperkuat pengalaman organisasi saya di CV?
                </div>
                <div className="p-3 rounded-2xl bg-[#5aa9f4] text-white shadow-xs leading-relaxed">
                  Gunakan kata kerja aktif seperti &quot;Memimpin&quot; atau &quot;Mengelola&quot; dan sertakan hasil terukur, misalnya: &quot;Mengelola acara kampus dengan 350+ peserta.&quot;
                </div>
              </div>
              <Link
                href="/evaluate"
                className="w-full py-2.5 rounded-full bg-[#0d1f33] hover:bg-[#193554] text-white text-xs font-bold text-center transition"
              >
                Coba Evaluasi Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 3: DEEP OCEAN NAVY STAGE — OBJEKTIVITAS & BLIND SCORING (Ref Part 3 Top)
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-2.5 sm:p-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${slideStateClass(3)}`}
      >
        <div
          className="h-full w-full rounded-[28px] sm:rounded-[36px] relative overflow-hidden flex flex-col justify-center px-6 sm:px-12 lg:px-16 text-white"
          style={{
            background: "linear-gradient(155deg, #051e34 0%, #092c4b 55%, #0d3a62 100%)",
          }}
        >
          {/* Subtle Navy Wave Lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 50% at 80% 20%, rgba(90,169,244,0.35) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8">
            {/* Split White Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-7">
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight">
                  Penilaian Objektif untuk <br />
                  <span className="text-[#79bdf9]">Kesempatan Karir yang Setara</span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <p className="text-xs sm:text-sm text-[#c4dcf2] leading-relaxed">
                  Pasbana AI menyaring resume murni berdasarkan keahlian, pengalaman proyek, dan dampak kerja Anda tanpa bias foto, usia, maupun latar belakang pribadi.
                </p>
              </div>
            </div>

            {/* Inner Showcase Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white/10 backdrop-blur-md border border-white/15 rounded-[28px] p-5 sm:p-8">
              <div className="lg:col-span-6 space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5aa9f4]/20 text-[#96cdfc] text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Prinsip Blind Scoring &amp; Privasi</span>
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Fokus Murni pada Kompetensi Anda
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#d4e7f8]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#79bdf9] shrink-0" />
                    <span>Tidak menilai foto wajah, gender, maupun usia kandidat.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#79bdf9] shrink-0" />
                    <span>Kendali penuh atas berkas CV dengan fitur hapus kapan saja.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#79bdf9] shrink-0" />
                    <span>100% gratis untuk seluruh mahasiswa dan pencari kerja.</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 bg-white text-[#0d1f33] rounded-3xl p-5 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Rincian Penilaian Objektif</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ebf4fd] text-[#3b8eeb] text-[10px] font-bold">
                    Bebas Bias
                  </span>
                </div>
                {[
                  { label: "Struktur & Keterbacaan ATS", val: 94 },
                  { label: "Kejelasan Deskripsi Pengalaman", val: 85 },
                  { label: "Kalimat Aktif & Dampak Terukur", val: 82 },
                  { label: "Relevansi Keahlian Industri", val: 90 },
                ].map((row) => (
                  <div key={row.label} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span>{row.label}</span>
                      <span className="text-[#3b8eeb] font-mono">{row.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4b94e6] rounded-full" style={{ width: `${row.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 4: ANALYTICS IMPACT (RADAR + AREA) + 4 BOLD SKY-BLUE STATS (Ref Part 3 Bottom & Part 4)
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-4 sm:p-8 lg:p-10 flex flex-col justify-center bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${slideStateClass(4)}`}
      >
        <div className="max-w-6xl mx-auto w-full space-y-7">
          {/* Split Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-6">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0d1f33] leading-tight">
                Pantau Bagaimana CV Anda <br />
                <span className="text-[#4b94e6]">Berkembang Lebih Baik</span>
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="text-xs sm:text-sm text-[#5a6b7f] leading-relaxed">
                Temukan insight perbaikan CV secara jelas dan mudah dipahami tanpa perlu menebak apa yang dicari oleh tim rekrutmen perusahaan.
              </p>
            </div>
          </div>

          {/* 3 Analytics Cards (Area Chart + Readiness Card + SVG Radar Chart) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Area Chart */}
            <div className="rounded-3xl bg-[#f8fbff] border border-[#e6eef7] p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#0d1f33]">
                <span>Grafik Kenaikan Skor</span>
                <span className="text-[10px] text-[#4b94e6]">Sebelum vs Sesudah</span>
              </div>
              <svg viewBox="0 0 240 100" className="w-full h-24">
                <defs>
                  <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5aa9f4" stopOpacity="0.4" />
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
                  strokeWidth="2.5"
                />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-[#0d1f33]">Perkembangan Skor ATS</h3>
                <p className="text-[11px] text-[#5a6b7f]">Pantau peningkatan kualitas resume setelah revisi.</p>
              </div>
            </div>

            {/* Card 2: Gap Skill Identification */}
            <div className="rounded-3xl bg-[#f8fbff] border border-[#e6eef7] p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#0d1f33]">
                <span>Kesiapan Melamar</span>
                <span className="text-[10px] text-emerald-600 font-bold">Siap</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 my-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0d1f33]">
                  <CheckCircle2 className="w-4 h-4 text-[#4b94e6]" />
                  <span>3 Saran Perbaikan Tersedia</span>
                </div>
                <p className="text-[11px] text-[#5a6b7f] leading-relaxed">
                  Perkuat bagian pencapaian proyek dan lengkapi keahlian inti agar peluang panggilan wawancara meningkat.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0d1f33]">Identifikasi Celah Keahlian</h3>
                <p className="text-[11px] text-[#5a6b7f]">Ketahui skill tambahan yang paling dicari industri.</p>
              </div>
            </div>

            {/* Card 3: 6-Axis Radar Chart (Exact Match to Reference Part 3 Bottom Right!) */}
            <div className="rounded-3xl bg-[#f8fbff] border border-[#e6eef7] p-5 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0d1f33]">
                <span>Peta 5 Dimensi</span>
                <span className="text-[10px] text-[#4b94e6]">Seimbang</span>
              </div>
              <svg viewBox="0 0 180 120" className="w-full h-24 mx-auto">
                <polygon points="90,14 134,39 134,89 90,114 46,89 46,39" fill="none" stroke="#dbe8f6" strokeWidth="1" />
                <polygon points="90,30 120,47 120,81 90,98 60,81 60,47" fill="none" stroke="#dbe8f6" strokeWidth="1" />
                <polygon
                  points="90,18 128,44 124,84 90,104 54,82 58,42"
                  fill="rgba(90,169,244,0.22)"
                  stroke="#4b94e6"
                  strokeWidth="2"
                />
                <text x="90" y="10" textAnchor="middle" fontSize="7" fill="#5a6b7f">ATS</text>
                <text x="148" y="42" textAnchor="start" fontSize="7" fill="#5a6b7f">Struktur</text>
                <text x="148" y="92" textAnchor="start" fontSize="7" fill="#5a6b7f">Dampak</text>
                <text x="32" y="92" textAnchor="end" fontSize="7" fill="#5a6b7f">Skill</text>
                <text x="32" y="42" textAnchor="end" fontSize="7" fill="#5a6b7f">Profil</text>
              </svg>
              <div>
                <h3 className="text-sm font-bold text-[#0d1f33]">Keseimbangan Kompetensi</h3>
                <p className="text-[11px] text-[#5a6b7f]">Visualisasi menyeluruh aspek kekuatan CV Anda.</p>
              </div>
            </div>
          </div>

          {/* 4 Bold Sky-Blue Stats Row (Matches Reference Part 4) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 text-center">
            {[
              { num: "5D", title: "Kriteria Evaluasi", sub: "Diadopsi dari standar seleksi HRD" },
              { num: "92%", title: "Akurasi Pencocokan", sub: "Memetakan loker sesuai keahlian" },
              { num: "100%", title: "Bebas Biaya", sub: "Gratis tanpa langganan bagi talenta muda" },
              { num: "#1", title: "Fokus Mahasiswa", sub: "Mendukung fresh graduate siap kerja" },
            ].map((stat) => (
              <div key={stat.title} className="space-y-0.5">
                <div className="text-3xl sm:text-4xl font-black text-[#5aa9f4]">{stat.num}</div>
                <div className="text-xs font-bold text-[#0d1f33]">{stat.title}</div>
                <div className="text-[10px] text-[#5a6b7f]">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 5: GET UP AND RUNNING IN 3 SIMPLE STEPS (Ref Part 5 Top)
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-4 sm:p-8 lg:p-12 flex flex-col justify-center bg-[#f6f9fd] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${slideStateClass(5)}`}
      >
        <div className="max-w-5xl mx-auto w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d1f33] leading-tight">
              Siapkan Karir Impian dalam <br />
              <span className="text-[#4b94e6]">3 Langkah Sederhana</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Grid Blue Visual Card */}
            <div className="rounded-[28px] bg-white border border-[#e3edf7] overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
              <div
                className="h-44 relative flex items-center justify-center p-4"
                style={{
                  background: "linear-gradient(135deg, #4b94e6 0%, #86c3fa 100%)",
                }}
              >
                <div
                  className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)] bg-[size:36px_36px]"
                  aria-hidden="true"
                />
                <span className="relative z-10 px-5 py-2 rounded-full bg-white text-[#0d1f33] text-xs font-bold shadow-md">
                  Unggah CV / Isi Kuesioner
                </span>
              </div>
              <div className="p-6 space-y-1.5">
                <h3 className="text-sm font-bold text-[#0d1f33]">Langkah 1: Mulai Gratis</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Unggah file CV Anda atau susun CV baru dari nol menggunakan kuesioner terpandu tanpa biaya.
                </p>
              </div>
            </div>

            {/* Step 2: Checkerboard Blue & White Visual Card */}
            <div className="rounded-[28px] bg-white border border-[#e3edf7] overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
              <div className="h-44 relative grid grid-cols-4 grid-rows-3 bg-white">
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
                  <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center font-black text-base text-[#4b94e6]">
                    5D
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-1.5">
                <h3 className="text-sm font-bold text-[#0d1f33]">Langkah 2: Terima Skor &amp; Saran</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Lihat nilai 5 dimensi CV Anda beserta rekomendasi perbaikan kalimat agar lebih menarik di mata HRD.
                </p>
              </div>
            </div>

            {/* Step 3: Mini Chat Bubble Card */}
            <div className="rounded-[28px] bg-white border border-[#e3edf7] overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
              <div className="h-44 bg-[#f5f9fe] p-5 flex flex-col justify-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-2xl shadow-2xs self-start text-xs font-semibold text-[#0d1f33]">
                  <span className="w-5 h-5 rounded-full bg-[#4b94e6] text-white text-[9px] flex items-center justify-center font-bold">
                    PA
                  </span>
                  <span>CV Anda siap dikirim!</span>
                </div>
                <div className="bg-[#5aa9f4] text-white text-xs p-3 rounded-2xl rounded-tr-sm self-end max-w-[85%] shadow-sm">
                  Ditemukan 12 lowongan aktif yang sangat pas dengan profil Anda.
                </div>
              </div>
              <div className="p-6 space-y-1.5">
                <h3 className="text-sm font-bold text-[#0d1f33]">Langkah 3: Lamar Posisi Terbaik</h3>
                <p className="text-xs text-[#5a6b7f] leading-relaxed">
                  Pilih lowongan yang sesuai dengan kompetensi Anda dan mulai perjalanan karir impian.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 6: LUMINOUS SKY-BLUE CTA BANNER + CLEAN 4-COL FOOTER (Ref Part 5 Bottom)
          ===================================================================== */}
      <section
        className={`absolute inset-0 p-4 sm:p-8 lg:p-10 flex flex-col justify-between bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${slideStateClass(6)}`}
      >
        {/* Top Luminous Sky-Blue Rounded CTA Banner */}
        <div
          className="flex-1 max-w-6xl mx-auto w-full rounded-[30px] sm:rounded-[38px] flex flex-col items-center justify-center text-center px-6 py-8 relative overflow-hidden shadow-xl shadow-[#4b94e6]/15"
          style={{
            background: "linear-gradient(155deg, #549ee9 0%, #75b9f6 55%, #9bd0fb 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 60% 45% at 25% 20%, rgba(255,255,255,0.45) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(255,255,255,0.35) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Mulai Bersama Pasbana AI Gratis
            </h2>
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
              Siap meningkatkan kualitas CV, memperbaiki kalimat pengalaman, dan menemukan peluang kerja yang paling pas bana?
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/evaluate"
                className="px-7 py-3 rounded-full bg-white hover:bg-slate-50 text-[#0d1f33] text-xs sm:text-sm font-bold shadow-md transition-all hover:-translate-y-0.5"
              >
                Evaluasi CV Sekarang
              </Link>
              <Link
                href="/jobs"
                className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-semibold backdrop-blur-sm border border-white/30 transition-all"
              >
                Lihat Lowongan Kerja
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Clean 4-Column Editorial Footer */}
        <footer className="max-w-6xl mx-auto w-full pt-7 pb-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-5 border-b border-slate-100 text-xs">
            <div className="col-span-2 sm:col-span-1 space-y-2">
              <div className="font-black text-base text-[#0d1f33]">
                Pasbana<span className="text-[#ce2731]"> AI</span>
              </div>
              <p className="text-[11px] text-[#5a6b7f] leading-relaxed">
                Karir yang Baik Dimulai dari Pertemuan yang Pas Bana.
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#0d1f33]">Fitur Utama</p>
              <ul className="space-y-1 text-[#5a6b7f]">
                <li><Link href="/evaluate" className="hover:text-[#4b94e6] transition">Evaluasi CV 5D</Link></li>
                <li><Link href="/evaluate?tab=questionnaire" className="hover:text-[#4b94e6] transition">Kuesioner ATS</Link></li>
                <li><Link href="/jobs" className="hover:text-[#4b94e6] transition">Pencocokan Karir</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[#0d1f33]">Platform</p>
              <ul className="space-y-1 text-[#5a6b7f]">
                <li><Link href="/dashboard" className="hover:text-[#4b94e6] transition">Dashboard ATS</Link></li>
                <li><Link href="/about" className="hover:text-[#4b94e6] transition">Tentang Kami</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
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
