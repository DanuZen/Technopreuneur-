"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Eye,
  Calendar,
  Play,
  TrendingUp,
  Bell,
  Plus,
  Minus,
  FileText,
  Briefcase,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const TOTAL_SLIDES = 7;

interface FeatureGridItem {
  id: number;
  badgeType: "eye" | "calendar" | "video" | "rocket" | "score" | "bell";
  title: string;
  desc: string;
}

const FEATURE_GRID_ITEMS: FeatureGridItem[] = [
  {
    id: 0,
    badgeType: "eye",
    title: "Analisis struktur dan keterbacaan CV dalam satu klik",
    desc: "Ketahui bagian format yang menghambat sistem ATS dan tingkatkan kesiapan berkas Anda secara instan.",
  },
  {
    id: 1,
    badgeType: "calendar",
    title: "Peta kekuatan resume dalam 5 dimensi utama",
    desc: "Berhenti menebak letak kelemahan CV. Ukur struktur, keahlian teknis, dan dampak pengalaman secara objektif.",
  },
  {
    id: 2,
    badgeType: "video",
    title: "Pahami kalimat aktif dan kata kunci yang dicari HRD",
    desc: "Ubah deskripsi tugas pasif menjadi pencapaian terukur tanpa harus menghabiskan waktu berjam-jam di depan layar.",
  },
  {
    id: 3,
    badgeType: "rocket",
    title: "Dapatkan informasi lengkap kesiapan profil dan portofolio",
    desc: "Ketahui aspek mana yang sudah kompetitif dan bagian mana yang masih perlu ditingkatkan sebelum melamar.",
  },
  {
    id: 4,
    badgeType: "score",
    title: "Ketahui berapa poin peningkatan dari setiap revisi",
    desc: "Pantau kenaikan skor ATS secara langsung setiap kali Anda memperbaiki struktur dan deskripsi pengalaman kerja.",
  },
  {
    id: 5,
    badgeType: "bell",
    title: "Rekomendasi otomatis untuk lowongan yang paling pas bana",
    desc: "Temukan posisi kerja aktif dengan persentase kecocokan tertinggi berdasarkan keahlian di resume Anda.",
  },
];

interface AccordionItem {
  id: number;
  question: string;
  answer: string;
}

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: 0,
    question: "Dapatkan analisis komprehensif 5 dimensi untuk CV Anda",
    answer:
      "Pasbana AI memeriksa keterbacaan format 1-kolom, kejelasan deskripsi karir, penggunaan kata kerja aktif, relevansi keahlian teknis, serta kelengkapan profil dalam waktu sekitar 30 detik.",
  },
  {
    id: 1,
    question: "Gunakan kuesioner terpandu jika Anda belum memiliki file CV",
    answer:
      "Cukup jawab pertanyaan singkat mengenai riwayat pendidikan, pengalaman organisasi atau proyek, serta keahlian Anda. Sistem akan menyusun draf CV standar ATS secara otomatis.",
  },
  {
    id: 2,
    question: "Pahami kalimat aktif dan kata kunci yang meningkatkan peluang lolos",
    answer:
      "Asisten kalimat memberikan contoh perbaikan langsung dari kalimat pasif menjadi kalimat berdampak lengkap dengan metrik pencapaian yang disukai perekrut.",
  },
  {
    id: 3,
    question: "Temukan lowongan kerja aktif yang paling sesuai dengan kompetensi Anda",
    answer:
      "Sistem memetakan keahlian di resume Anda terhadap kualifikasi lowongan kerja dan menampilkan persentase kecocokan beserta analisis celah keahlian.",
  },
  {
    id: 4,
    question: "Nikmati evaluasi objektif 100% gratis tanpa biaya berlangganan",
    answer:
      "Seluruh fitur evaluasi CV, penyusunan resume via kuesioner, dan pencocokan lowongan didedikasikan secara terbuka untuk mahasiswa dan pencari kerja.",
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [prevSlide, setPrevSlide] = useState<number>(0);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const [activeFeatureIdx, setActiveFeatureIdx] = useState<number>(0);
  const [sliderStep, setSliderStep] = useState<number>(5);
  const [inputMode, setInputMode] = useState<"pdf" | "questionnaire">("pdf");
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(0);

  const isAnimatingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const activeSlideRef = useRef<number>(0);
  const slide4ContainerRef = useRef<HTMLDivElement | null>(null);
  const featureItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [featureRect, setFeatureRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({ top: 140, left: 32, width: 360, height: 190 });

  const updateFeatureRect = useCallback(() => {
    const itemEl = featureItemRefs.current[activeFeatureIdx];
    if (itemEl) {
      setFeatureRect({
        top: itemEl.offsetTop,
        left: itemEl.offsetLeft,
        width: itemEl.offsetWidth,
        height: itemEl.offsetHeight,
      });
    }
  }, [activeFeatureIdx]);

  useEffect(() => {
    updateFeatureRect();
    window.addEventListener("resize", updateFeatureRect);
    return () => window.removeEventListener("resize", updateFeatureRect);
  }, [updateFeatureRect, activeSlide]);

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

  const getGlobalMorphStyle = (slide: number): React.CSSProperties => {
    switch (slide) {
      case 0:
        return {
          top: "0px",
          left: "calc(50% + 12px)",
          width: "calc(50% - 12px)",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#fdf2f2",
          border: "1px solid #f5d0d2",
          boxShadow: "0 20px 50px rgba(206, 39, 49, 0.08)",
        };
      case 1:
        return {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#f4f5f7",
          border: "1px solid #e2e8f0",
          boxShadow: "0 24px 60px rgba(15, 44, 86, 0.07)",
        };
      case 2:
        return {
          top: "0px",
          left: "calc(50% + 12px)",
          width: "calc(50% - 12px)",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#0f2c56",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 60px rgba(15, 44, 86, 0.22)",
        };
      case 3:
        return {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#0f2c56",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 60px rgba(15, 44, 86, 0.25)",
        };
      case 4: {
        const isCrimson = activeFeatureIdx % 2 === 1;
        return {
          top: `${featureRect.top}px`,
          left: `${featureRect.left}px`,
          width: `${featureRect.width}px`,
          height: `${featureRect.height}px`,
          borderRadius: "28px",
          backgroundColor: isCrimson ? "#ce2731" : "#0f2c56",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: isCrimson
            ? "0 24px 55px rgba(206, 39, 49, 0.25)"
            : "0 24px 55px rgba(15, 44, 86, 0.25)",
        };
      }
      case 5:
        return {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#0f2c56",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 60px rgba(15, 44, 86, 0.25)",
        };
      case 6:
      default:
        return {
          top: "calc(100% - 76px)",
          left: "0px",
          width: "100%",
          height: "76px",
          borderRadius: "28px",
          backgroundColor: "#0f2c56",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 20px 50px rgba(15, 44, 86, 0.22)",
        };
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full relative overflow-hidden bg-[#fefefd] text-[#0f2c56] select-none"
    >
      {/* GLOBAL PERSISTENT MORPHING CARD STAGE (Desktop lg+): Edge-to-edge tight gap matching Navbar */}
      <div
        className="hidden lg:block absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 pointer-events-none z-10"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <div
            className="absolute transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={getGlobalMorphStyle(activeSlide)}
          />
        </div>
      </div>

      {/* =====================================================================
          SLIDE 0 (#beranda): HERO SECTION (Matching Video 00:00 - 00:03)
          Tight Edge-to-Edge Gap + Left Headline + Right Morphing Isometric Stage
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(0)}`}
      >
        <div className="w-full h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          {/* Left 6 Cols: Editorial Headline with Inline Red Pill Icon Badge */}
          <div
            className={`lg:col-span-6 px-4 sm:px-8 lg:px-12 space-y-5 sm:space-y-6 text-left ${getChildAnimClass(0, "left", "delay-75")}`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fdf2f2] border border-[#f5d0d2] text-xs font-bold text-[#ce2731]">
              <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
              <span>Pasbana AI • Evaluasi CV &amp; Karir</span>
            </div>

            <h1 className="text-3xl sm:text-5xl xl:text-[56px] font-bold tracking-tight text-[#0f2c56] leading-[1.1]">
              Hemat waktu evaluasi
              <br />
              dan{" "}
              <span className="inline-flex items-center justify-center align-middle w-14 sm:w-20 h-8 sm:h-11 rounded-full bg-[#ce2731] mx-1 shadow-md shadow-[#ce2731]/25">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white/80 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white ml-0.5" />
                </span>
              </span>{" "}
              temukan
              <br />
              Karir Pas Bana
            </h1>

            <p className="text-xs sm:text-base text-slate-500 max-w-lg leading-relaxed">
              Dapatkan analisis objektif 5 dimensi terhadap kesiapan CV Anda dan rekomendasi lowongan kerja secara otomatis!
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/evaluate"
                className="px-7 py-3.5 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:-translate-y-0.5"
              >
                Evaluasi CV Saya
              </Link>
              <Link
                href="/evaluate?tab=questionnaire"
                className="px-6 py-3.5 rounded-xl border border-slate-200 hover:border-[#0f2c56] text-[#0f2c56] text-xs sm:text-sm font-bold transition-all"
              >
                Belum Punya CV
              </Link>
            </div>
          </div>

          {/* Right 6 Cols: Isometric Vector UI Illustration inside Morphing Right Stage */}
          <div
            className={`lg:col-span-6 h-full rounded-[28px] sm:rounded-[34px] bg-[#fdf2f2] lg:bg-transparent border border-[#f5d0d2] lg:border-transparent p-4 sm:p-8 flex items-center justify-center ${getChildAnimClass(0, "right", "delay-150")}`}
          >
            <svg
              viewBox="0 0 560 420"
              className="w-full max-w-[540px] h-auto"
              role="img"
              aria-label="Ilustrasi Isometrik Evaluasi CV dan Pencocokan Karir"
            >
              <line x1="80" y1="310" x2="360" y2="150" stroke="#e2cbd0" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="180" y1="370" x2="460" y2="210" stroke="#e2cbd0" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="120" y1="170" x2="420" y2="340" stroke="#e2cbd0" strokeWidth="1" strokeDasharray="4 4" />

              {/* Main Isometric Tablet / Dashboard Board */}
              <polygon
                points="190,195 365,95 495,170 320,270"
                fill="#f5d0d2"
                stroke="#e2b4b7"
                strokeWidth="2"
              />
              <polygon
                points="190,187 365,87 495,162 320,262"
                fill="#ffffff"
                stroke="#0f2c56"
                strokeWidth="1.8"
              />
              <polygon
                points="280,195 385,135 425,158 320,218"
                fill="#ce2731"
                opacity="0.9"
              />
              <circle cx="340" cy="145" r="14" fill="#ffffff" stroke="#0f2c56" strokeWidth="1.6" />
              <path
                d="M312,182 C312,164 368,164 368,182"
                fill="#faa9ab"
                stroke="#0f2c56"
                strokeWidth="1.6"
              />

              {/* Floating Top-Right Mini Isometric Card */}
              <polygon
                points="405,68 465,34 510,60 450,94"
                fill="#ffffff"
                stroke="#0f2c56"
                strokeWidth="1.4"
              />
              <line x1="428" y1="66" x2="462" y2="47" stroke="#0f2c56" strokeWidth="2" strokeLinecap="round" />
              <line x1="436" y1="74" x2="478" y2="50" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              {/* Floating Top-Left Mini Isometric Card */}
              <polygon
                points="275,92 322,65 356,85 309,112"
                fill="#ffffff"
                stroke="#0f2c56"
                strokeWidth="1.3"
              />
              <circle cx="315" cy="88" r="4.5" fill="#ce2731" />

              {/* Floating Mid-Left Isometric Card with Play / ATS Badge */}
              <polygon
                points="145,245 225,198 285,233 205,280"
                fill="#ffffff"
                stroke="#0f2c56"
                strokeWidth="1.5"
              />
              <circle cx="205" cy="232" r="7" fill="#ce2731" />
              <line x1="218" y1="226" x2="250" y2="208" stroke="#0f2c56" strokeWidth="2" strokeLinecap="round" />
              <line x1="185" y1="254" x2="235" y2="225" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

              {/* Bottom-Left Small Isometric Tile */}
              <polygon
                points="85,325 132,298 168,319 121,346"
                fill="#ffffff"
                stroke="#0f2c56"
                strokeWidth="1.3"
              />

              {/* Bottom-Center Isometric Card */}
              <polygon
                points="240,340 305,302 355,331 290,369"
                fill="#ffffff"
                stroke="#0f2c56"
                strokeWidth="1.5"
              />
              <line x1="268" y1="336" x2="305" y2="315" stroke="#0f2c56" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="278" y1="345" x2="322" y2="320" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

              {/* Right Isometric Cylinder Column */}
              <ellipse cx="485" cy="275" rx="34" ry="18" fill="#f5d0d2" />
              <path
                d="M451,215 L451,275 A34,18 0 0,0 519,275 L519,215 Z"
                fill="#faa9ab"
                opacity="0.7"
              />
              <ellipse cx="485" cy="215" rx="34" ry="18" fill="#ce2731" />

              {/* Bottom-Right Isometric Pie / Disc Badges */}
              <ellipse cx="430" cy="292" rx="18" ry="10" fill="#0f2c56" />
              <ellipse cx="430" cy="288" rx="18" ry="10" fill="#94a3b8" />
              <ellipse cx="385" cy="348" rx="28" ry="15" fill="#ce2731" />
              <path d="M385,348 L413,348 A28,15 0 0,0 395,334 Z" fill="#ffffff" />
            </svg>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 1 (#fitur): FULL-WIDTH MORPHED SOFT CONTAINER (Matching Video 00:04 - 00:05)
          Cropped Device Frame + Circular Red Gauge on Left, Clean Copy on Right
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(1)}`}
      >
        <div className="w-full h-full mx-auto rounded-[28px] sm:rounded-[34px] bg-[#f4f5f7] lg:bg-transparent px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden">
          {/* Left 6 Cols: Cropped Device Frame Rising from Bottom + Overlapping Red Circular Gauge */}
          <div
            className={`lg:col-span-6 h-full flex items-end justify-center pt-8 relative ${getChildAnimClass(1, "up", "delay-100")}`}
          >
            <div className="relative w-full max-w-[390px] h-[88%] bg-white rounded-t-[36px] border-t-2 border-x-2 border-slate-300 shadow-sm px-6 pt-6 flex flex-col gap-5">
              {/* Top 3 Circular Indicators inside Frame */}
              <div className="rounded-2xl bg-[#f4f5f7] p-4 flex items-center justify-around">
                <div className="w-11 h-11 rounded-full bg-[#0f2c56] flex items-center justify-center text-white text-xs font-black">
                  94%
                </div>
                <div className="w-11 h-11 rounded-full bg-slate-300 flex items-center justify-center text-[#0f2c56] text-xs font-black">
                  5D
                </div>
                <div className="w-11 h-11 rounded-full bg-[#ce2731] flex items-center justify-center text-white text-xs font-black">
                  88
                </div>
              </div>

              {/* Clean CV Skeleton Preview inside Frame */}
              <div className="flex-1 rounded-t-2xl bg-[#f4f5f7] p-5 space-y-3">
                <div className="w-3/4 h-2.5 rounded-full bg-slate-300" />
                <div className="w-1/2 h-2.5 rounded-full bg-slate-200" />
                <div className="mt-4 h-24 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center gap-3 px-4">
                  <span className="w-8 h-8 rounded-lg bg-[#ce2731] text-white flex items-center justify-center shrink-0">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-bold text-[#0f2c56]">Resume_Standar_ATS.pdf</div>
                    <div className="text-[10px] text-slate-500">Struktur 1-Kolom Terverifikasi</div>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-300" />
                <div className="w-2/3 h-2 rounded-full bg-slate-200" />
              </div>

              {/* Overlapping Circular Red Gauge Timer on Right Edge */}
              <div className="hidden sm:flex absolute -right-14 bottom-12 w-44 h-44 rounded-full bg-white border-2 border-slate-300 shadow-xl items-center justify-center p-2.5">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle cx="60" cy="60" r="52" fill="#ce2731" opacity="0.85" />
                  <path d="M60,60 L60,8 A52,52 0 0,1 108,80 Z" fill="#ce2731" />
                  <line x1="60" y1="8" x2="60" y2="15" stroke="#ffffff" strokeWidth="2" />
                  <line x1="112" y1="60" x2="105" y2="60" stroke="#ffffff" strokeWidth="2" />
                  <line x1="60" y1="112" x2="60" y2="105" stroke="#ffffff" strokeWidth="2" />
                  <line x1="8" y1="60" x2="15" y2="60" stroke="#ffffff" strokeWidth="2" />
                  <line x1="60" y1="60" x2="34" y2="34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="60" cy="60" r="4" fill="#ffffff" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Clean Uncluttered Editorial Copy */}
          <div
            className={`lg:col-span-6 space-y-4 sm:space-y-5 text-left lg:pl-8 ${getChildAnimClass(1, "right", "delay-150")}`}
          >
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#ce2731]">
              Pemeriksa Format ATS
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#0f2c56] leading-[1.14]">
              Berhenti mengirim CV
              <br />
              yang gagal dibaca sistem
            </h2>
            <p className="text-xs sm:text-base text-slate-600 max-w-lg leading-relaxed">
              Banyak kandidat gugur saat melamar kerja bukan karena kurang kompeten, melainkan karena susunan resume gagal dipahami mesin ATS. Ketahui letak celah CV Anda dan ikuti alur perbaikannya secara instan!
            </p>
            <div className="pt-1">
              <Link
                href="/evaluate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold transition shadow-md"
              >
                <span>Coba Pemeriksa Struktur ATS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 2 (#persiapan): OPEN LEFT + MORPHED NAVY STAGE ON RIGHT (Matching Video 00:06 - 00:08)
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(2)}`}
      >
        <div className="w-full h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          {/* Left 6 Cols: Clean Bold Heading & Subtitle on Open White Canvas */}
          <div
            className={`lg:col-span-6 px-4 sm:px-8 lg:px-12 space-y-4 sm:space-y-5 text-left ${getChildAnimClass(2, "left", "delay-75")}`}
          >
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#ce2731]">
              Ekosistem Persiapan Karir
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#0f2c56] leading-[1.14]">
              Tingkatkan peluang lolos
              <br />
              dengan kesiapan berkas
              <br />
              yang paling optimal!
            </h2>
            <p className="text-xs sm:text-base text-slate-500 max-w-lg leading-relaxed">
              Baik sudah memiliki file PDF maupun belum punya CV sama sekali, ukur 5 dimensi kualitas resume Anda pada waktu yang tepat untuk hasil seleksi terbaik!
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link
                href="/evaluate?tab=questionnaire"
                className="px-6 py-3 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition shadow-md"
              >
                Buat CV via Kuesioner
              </Link>
              <Link
                href="/evaluate"
                className="px-5 py-3 rounded-xl border border-slate-200 hover:border-[#0f2c56] text-[#0f2c56] text-xs sm:text-sm font-bold transition"
              >
                Unggah PDF CV
              </Link>
            </div>
          </div>

          {/* Right 6 Cols: Isometric Gauge Disc + Dot-Matrix Board inside Morphed Navy Stage */}
          <div
            className={`lg:col-span-6 h-full rounded-[28px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent p-4 sm:p-8 flex items-center justify-center ${getChildAnimClass(2, "right", "delay-150")}`}
          >
            <svg
              viewBox="0 0 560 400"
              className="w-full max-w-[540px] h-auto"
              role="img"
              aria-label="Ilustrasi Isometrik Kesiapan Karir dan Pemetaan Jadwal"
            >
              <line x1="70" y1="260" x2="350" y2="100" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="170" y1="340" x2="470" y2="170" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="140" y1="140" x2="450" y2="320" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="4 4" />

              {/* Top-Left Isometric 3D Red Gauge / Clock Cylinder */}
              <ellipse cx="220" cy="162" rx="76" ry="42" fill="#1e3a68" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" />
              <ellipse cx="220" cy="146" rx="76" ry="42" fill="#ce2731" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M220,146 L220,104 A76,42 0 0,1 286,166 Z" fill="#faa9ab" />
              <line x1="220" y1="146" x2="220" y2="108" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="220" y1="146" x2="268" y2="162" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

              {/* Right Standing Isometric Dot-Matrix Board */}
              <polygon
                points="360,115 475,180 475,275 360,210"
                fill="#ffffff"
                stroke="#ce2731"
                strokeWidth="1.5"
              />
              <circle cx="385" cy="155" r="5" fill="#e2e8f0" />
              <circle cx="405" cy="166" r="5" fill="#e2e8f0" />
              <circle cx="425" cy="177" r="5" fill="#cbd5e1" />
              <circle cx="445" cy="188" r="5" fill="#e2e8f0" />

              <circle cx="385" cy="178" r="5" fill="#e2e8f0" />
              <circle cx="405" cy="189" r="6" fill="#ce2731" />
              <circle cx="425" cy="200" r="6" fill="#0f2c56" />
              <circle cx="445" cy="211" r="5" fill="#cbd5e1" />

              <circle cx="385" cy="201" r="5" fill="#cbd5e1" />
              <circle cx="405" cy="212" r="5" fill="#e2e8f0" />
              <circle cx="425" cy="223" r="5" fill="#e2e8f0" />
              <circle cx="445" cy="234" r="5" fill="#e2e8f0" />

              {/* Center Isometric Soft Red Pill Bar */}
              <polygon
                points="285,220 315,202 415,260 385,278"
                fill="#ce2731"
              />

              {/* Bottom-Left Isometric Card with Bullet & Lines */}
              <polygon
                points="170,255 240,215 360,285 290,325"
                fill="#ffffff"
                stroke="#ffffff"
                strokeWidth="1.4"
              />
              <circle cx="225" cy="252" r="6" fill="#ce2731" />
              <line x1="242" y1="262" x2="310" y2="302" stroke="#0f2c56" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="232" y1="270" x2="285" y2="301" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

              {/* Bottom-Right Small Isometric Tile */}
              <polygon
                points="425,305 468,280 508,303 465,328"
                fill="#1e3a68"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 3 (#asisten): FULL-WIDTH MORPHED DARK CONTAINER (Matching Video 00:09 - 00:10)
          Cropped Frame + Eye Badge + Up Arrow on Left, Clean White Text on Right
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(3)}`}
      >
        <div className="w-full h-full mx-auto rounded-[28px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white overflow-hidden">
          {/* Left 6 Cols: Cropped White Wireframe Rising from Bottom + Eye Badge + Upward Arrow */}
          <div
            className={`lg:col-span-6 h-full flex items-end justify-center pt-8 relative ${getChildAnimClass(3, "up", "delay-100")}`}
          >
            <div className="relative w-full max-w-[390px] h-[88%] bg-white rounded-t-[36px] border-t-4 border-x-4 border-slate-200 px-6 pt-6 flex flex-col gap-4 text-[#0f2c56]">
              {/* Card 1 inside Device Frame: Before / Passive */}
              <div className="rounded-2xl bg-[#f4f5f7] border border-slate-200 p-4 space-y-2.5">
                <div className="w-2/3 h-2 rounded-full bg-slate-300" />
                <div className="w-1/2 h-2 rounded-full bg-slate-200" />
                <div className="h-16 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between px-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Kalimat Awal</div>
                    <div className="text-xs font-semibold text-slate-500 line-through">
                      Membantu kegiatan acara kampus
                    </div>
                  </div>
                  <span className="w-7 h-7 rounded-md bg-[#ce2731] text-white flex items-center justify-center shrink-0">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Card 2 inside Device Frame: After / Active Impact */}
              <div className="flex-1 rounded-t-2xl bg-[#f4f5f7] border-t border-x border-slate-200 p-4 space-y-2.5">
                <div className="w-3/4 h-2 rounded-full bg-slate-300" />
                <div className="h-16 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between px-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase text-[#ce2731]">Saran Pasbana AI (+24 Poin)</div>
                    <div className="text-xs font-bold text-[#0f2c56]">
                      Mengelola seminar 350+ peserta
                    </div>
                  </div>
                  <span className="w-7 h-7 rounded-md bg-[#ce2731] text-white flex items-center justify-center shrink-0">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Overlapping White Circle with Red Eye Badge on Right Edge */}
              <div className="hidden sm:flex absolute -right-12 bottom-16 w-32 h-32 rounded-full bg-white border-2 border-slate-300 shadow-2xl items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#fdf2f2] flex items-center justify-center">
                  <Eye className="w-10 h-10 text-[#ce2731]" />
                </div>
              </div>

              {/* Upward Outline Arrow Next to Badge */}
              <svg
                viewBox="0 0 48 110"
                className="hidden sm:block absolute -right-24 bottom-24 w-10 h-24 text-white/40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M24,6 L42,28 L30,28 L30,104 L18,104 L18,28 L6,28 Z" />
              </svg>
            </div>
          </div>

          {/* Right 6 Cols: Bold White Heading & Clean Muted Subtitle */}
          <div
            className={`lg:col-span-6 space-y-4 sm:space-y-5 text-left lg:pl-10 ${getChildAnimClass(3, "right", "delay-150")}`}
          >
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#faa9ab]">
              Asisten Kalimat Aktif
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-[1.14]">
              Pahami bagaimana Struktur
              <br />
              dan Kalimat Aktif memengaruhi
              <br />
              penilaian HRD
            </h2>
            <p className="text-xs sm:text-base text-slate-300 max-w-lg leading-relaxed">
              Lihat perubahan skor kesiapan secara langsung setelah Anda mengganti kalimat pasif menjadi pencapaian terukur, struktur yang rapi, dan kata kunci keahlian yang tepat.
            </p>
            <div className="pt-1">
              <Link
                href="/evaluate"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition shadow-lg"
              >
                <span>Uji Kalimat CV Sekarang</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 4 (#prinsip): 3x2 FEATURE BENTO GRID (Matching Video 00:11 - 00:13)
          Global Morphing Card Shrinks into Active Colored Feature Tile!
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(4)}`}
      >
        <div
          ref={slide4ContainerRef}
          className="relative w-full h-full mx-auto px-4 sm:px-8 flex flex-col justify-center gap-6"
        >
          {/* Top-Left Section Header */}
          <div className={`space-y-1.5 text-left max-w-2xl ${getChildAnimClass(4, "down", "delay-75")}`}>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#ce2731]">
              Fitur &amp; Prinsip
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0f2c56] leading-[1.15]">
              Optimalkan kesiapan karir Anda dengan perangkat evaluasi presisi
            </h2>
          </div>

          {/* 3 Columns x 2 Rows Feature Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${getChildAnimClass(4, "up", "delay-150")}`}>
            {FEATURE_GRID_ITEMS.map((item, idx) => {
              const isSelected = activeFeatureIdx === idx;
              const isCrimson = idx % 2 === 1;
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    featureItemRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveFeatureIdx(idx)}
                  onClick={() => setActiveFeatureIdx(idx)}
                  className={`p-5 sm:p-6 rounded-[28px] text-left transition-colors duration-300 cursor-pointer ${
                    isSelected
                      ? `${
                          isCrimson ? "bg-[#ce2731]" : "bg-[#0f2c56]"
                        } lg:bg-transparent text-white shadow-xl lg:shadow-none border border-white/15 lg:border-transparent`
                      : "bg-[#f4f5f7] hover:bg-[#ebedf0] border border-slate-200/80 text-[#0f2c56]"
                  }`}
                >
                  {/* Custom Mini UI Illustration Badge at Top */}
                  <div className="h-11 flex items-center mb-3">
                    {item.badgeType === "eye" && (
                      <div className="px-4 py-1.5 rounded-full bg-white border border-[#f5d0d2] inline-flex items-center justify-center shadow-2xs">
                        <Eye className="w-5 h-5 text-[#ce2731]" />
                      </div>
                    )}
                    {item.badgeType === "calendar" && (
                      <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 inline-flex items-center gap-1.5 shadow-2xs">
                        <Calendar className="w-4 h-4 text-[#0f2c56]" />
                        <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                      </div>
                    )}
                    {item.badgeType === "video" && (
                      <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 inline-flex items-center gap-2 shadow-2xs">
                        <span className="w-5 h-3.5 rounded bg-[#ce2731] flex items-center justify-center">
                          <Play className="w-2.5 h-2.5 text-white fill-white" />
                        </span>
                        <span className="w-6 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    )}
                    {item.badgeType === "rocket" && (
                      <div className="w-10 h-10 rounded-full bg-white border border-[#f5d0d2] inline-flex items-center justify-center shadow-2xs">
                        <TrendingUp className="w-4 h-4 text-[#ce2731]" />
                      </div>
                    )}
                    {item.badgeType === "score" && (
                      <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 inline-flex items-center gap-2 shadow-2xs">
                        <span className="text-xs font-black text-[#ce2731] bg-[#fdf2f2] px-2 py-0.5 rounded-md">
                          +24
                        </span>
                        <span className="w-5 h-1.5 rounded-full bg-slate-300" />
                      </div>
                    )}
                    {item.badgeType === "bell" && (
                      <div className="relative w-10 h-10 rounded-full bg-white border border-slate-200 inline-flex items-center justify-center shadow-2xs">
                        <Bell className="w-4 h-4 text-[#0f2c56]" />
                        <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#ce2731]" />
                      </div>
                    )}
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold leading-snug mb-1.5 transition-colors duration-300 ${
                      isSelected ? "text-white" : "text-[#0f2c56]"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed transition-colors duration-300 ${
                      isSelected ? "text-white/85" : "text-slate-600"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 5 (#cara-kerja): FULL-WIDTH MORPHED DARK CARD (Matching Video 00:14)
          Left Interactive Slider & Mode Toggles + Right Single Clean White Card
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(5)}`}
      >
        <div className="w-full h-full mx-auto rounded-[28px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white overflow-hidden">
          {/* Left 6 Cols: Subtitle, Bold Title, Interactive Range Slider, 2 Toggle Buttons */}
          <div
            className={`lg:col-span-6 space-y-5 text-left ${getChildAnimClass(5, "left", "delay-100")}`}
          >
            <div className="space-y-2">
              <p className="text-xs text-slate-300">
                Berhenti membuang waktu, biarkan sistem mengevaluasi secara otomatis
              </p>
              <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-[1.14]">
                Dapatkan analisis terbaik
                <br />
                untuk kesiapan karir Anda!
              </h2>
            </div>

            {/* Interactive Dimension / Step Slider */}
            <div className="space-y-2 max-w-md pt-1">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-300">1</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={sliderStep}
                  onChange={(e) => setSliderStep(Number(e.target.value))}
                  aria-label="Jumlah dimensi evaluasi"
                  className="w-full accent-white cursor-pointer h-1.5 bg-white/20 rounded-lg"
                />
                <span className="text-xs font-bold text-slate-300">5</span>
              </div>
              <p className="text-xs text-slate-300">
                Berdasarkan evaluasi {sliderStep} dimensi utama standar HRD
              </p>
            </div>

            {/* 2 Mode Toggle Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setInputMode("pdf")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  inputMode === "pdf"
                    ? "bg-white text-[#0f2c56]"
                    : "border border-white/30 text-white hover:border-white"
                }`}
              >
                Unggah File PDF
              </button>
              <button
                type="button"
                onClick={() => setInputMode("questionnaire")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  inputMode === "questionnaire"
                    ? "bg-white text-[#0f2c56]"
                    : "border border-white/30 text-white hover:border-white"
                }`}
              >
                Isi Kuesioner CV
              </button>
            </div>
          </div>

          {/* Right 6 Cols: Single Clean White Card */}
          <div className={`lg:col-span-6 ${getChildAnimClass(5, "right", "delay-150")}`}>
            <div className="bg-white text-[#0f2c56] rounded-[32px] p-6 sm:p-9 shadow-2xl space-y-5 max-w-lg mx-auto">
              <h3 className="text-lg sm:text-2xl font-bold text-[#0f2c56] leading-snug">
                Satu alur terpadu yang menjawab seluruh kebutuhan persiapan karir Anda
              </h3>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <span className="text-[#0f2c56] font-bold">•</span>
                  <span>Evaluasi mendalam {sliderStep} dimensi kesiapan ATS dan standar HRD</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f2c56] font-bold">•</span>
                  <span>
                    {inputMode === "pdf"
                      ? "Pemeriksaan instan struktur 1-kolom dan perbaikan kalimat aktif dari PDF Anda"
                      : "Penyusunan draf CV 1-kolom otomatis dari nol melalui kuesioner terpandu"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f2c56] font-bold">•</span>
                  <span>Rekomendasi lowongan kerja aktif yang paling relevan dengan keahlian Anda</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-5xl font-black text-[#0f2c56]">Gratis</span>
                  <span className="text-xs text-slate-400 font-semibold">Rp 0 / Selamanya</span>
                </div>

                <Link
                  href={inputMode === "pdf" ? "/evaluate" : "/evaluate?tab=questionnaire"}
                  className="px-7 py-3.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold shadow-md transition"
                >
                  Mulai Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 6 (#mulai): ACCORDION LIST & MORPHED NAVY FOOTER BAR (Matching Video 00:15 - 00:16)
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(6)}`}
      >
        <div className="w-full h-full mx-auto flex flex-col justify-between">
          {/* Top Heading + 5 Expandable Horizontal Rows on Open White Canvas */}
          <div className={`my-auto px-4 sm:px-8 space-y-5 ${getChildAnimClass(6, "down", "delay-75")}`}>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0f2c56] leading-[1.14] max-w-xl text-left">
              Seluruh perangkat cerdas ini juga
              <br />
              siap memetakan peluang karir terbaik Anda
            </h2>

            <div className="border-t border-slate-200">
              {ACCORDION_ITEMS.map((item) => {
                const isOpen = openAccordionId === item.id;
                return (
                  <div key={item.id} className="border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setOpenAccordionId(isOpen ? null : item.id)}
                      className="w-full py-3 sm:py-3.5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                    >
                      <span className="text-xs sm:text-sm font-semibold text-[#0f2c56] group-hover:text-[#ce2731] transition">
                        {item.question}
                      </span>
                      <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 group-hover:border-[#0f2c56] flex items-center justify-center text-slate-500 shrink-0 transition">
                        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-3.5 pr-10 text-xs text-slate-500 leading-relaxed max-w-3xl">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Minimal Footer inside Morphed Navy Bar */}
          <footer
            className={`relative z-20 h-[68px] lg:h-[76px] rounded-[24px] sm:rounded-[28px] bg-[#0f2c56] lg:bg-transparent px-6 sm:px-8 flex items-center justify-between text-xs text-white ${getChildAnimClass(6, "up", "delay-150")}`}
          >
            <div className="flex items-center gap-2.5 font-black text-base text-white">
              <span className="w-7 h-7 rounded-full bg-[#ce2731] inline-flex items-center justify-center text-white text-xs">
                P
              </span>
              <span>
                Pasbana<span className="text-[#ce2731]"> AI</span>
              </span>
              <span className="hidden sm:inline text-xs font-normal text-slate-300 ml-3">
                © 2026 Karir yang Pas Bana
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/evaluate"
                title="Evaluasi CV"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ce2731] text-white flex items-center justify-center transition"
              >
                <FileText className="w-4 h-4" />
              </Link>
              <Link
                href="/jobs"
                title="Lowongan Kerja"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ce2731] text-white flex items-center justify-center transition"
              >
                <Briefcase className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                title="Tentang Kami"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ce2731] text-white flex items-center justify-center transition"
              >
                <ShieldCheck className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                title="Masuk Akun"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#ce2731] text-white flex items-center justify-center transition"
              >
                <UserCheck className="w-4 h-4" />
              </Link>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
