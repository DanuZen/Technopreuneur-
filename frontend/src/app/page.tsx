"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Eye,
  Calendar,
  Play,
  TrendingUp,
  Bell,
  Plus,
  Minus,
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
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const handleAuthFlowLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetPath: string
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    try {
      const hasToken = Boolean(localStorage.getItem("cm_token"));
      if (!hasToken) {
        e.preventDefault();
        router.push(`/login?next=${encodeURIComponent(targetPath)}`);
      }
    } catch {
      // biarkan navigasi standar jika akses storage gagal
    }
  };
  const [prevSlide, setPrevSlide] = useState<number>(0);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [activeFeatureIdx, setActiveFeatureIdx] = useState<number>(0);
  const [inputMode, setInputMode] = useState<"pdf" | "questionnaire">("pdf");
  const [openAccordionId, setOpenAccordionId] = useState<number | null>(0);

  const isAnimatingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const activeSlideRef = useRef<number>(0);
  const slide4ContainerRef = useRef<HTMLDivElement | null>(null);
  const slide4GridRef = useRef<HTMLDivElement | null>(null);
  const featureItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [featureRect, setFeatureRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({ top: 240, left: 32, width: 360, height: 180 });

  const updateFeatureRect = useCallback(() => {
    const gridEl = slide4GridRef.current;
    const itemEl = featureItemRefs.current[activeFeatureIdx];
    if (gridEl && itemEl) {
      setFeatureRect({
        top: gridEl.offsetTop + itemEl.offsetTop,
        left: gridEl.offsetLeft + itemEl.offsetLeft,
        width: itemEl.offsetWidth,
        height: itemEl.offsetHeight,
      });
    }
  }, [activeFeatureIdx]);

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setIsEntered(true);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

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
    const isActive = isEntered && activeSlide === slideIndex;
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

  const getTextRevealClass = (slideIndex: number, delayClass: string = "delay-100") => {
    const isActive = isEntered && activeSlide === slideIndex;
    return isActive
      ? `opacity-100 translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${delayClass}`
      : "opacity-0 translate-y-6 transition-all duration-300 ease-in";
  };

  const getHighlightPopClass = (slideIndex: number, delayClass: string = "delay-300") => {
    const isActive = isEntered && activeSlide === slideIndex;
    return isActive
      ? `opacity-100 scale-100 translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${delayClass}`
      : "opacity-0 scale-90 translate-y-2 transition-all duration-300 ease-in";
  };

  const getGlobalMorphStyle = (slide: number): React.CSSProperties => {
    if (!isEntered) {
      return {
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
        borderRadius: "34px",
        backgroundColor: "#0f2c56",
      };
    }
    switch (slide) {
      case 0:
        return {
          top: "0px",
          left: "calc(50% + 12px)",
          width: "calc(50% - 12px)",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#0f2c56",
        };
      case 1:
        return {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#ce2731",
        };
      case 2:
        return {
          top: "0px",
          left: "0px",
          width: "calc(50% - 12px)",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#0f2c56",
        };
      case 3:
        return {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          borderRadius: "34px",
          backgroundColor: "#0f2c56",
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
        };
      case 6:
      default:
        return {
          top: "4px",
          left: "16px",
          width: "calc(41.666667% - 25px)",
          height: "calc(100% - 8px)",
          borderRadius: "28px",
          backgroundColor: "#0f2c56",
          opacity: 1,
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
        <div className="w-full h-full mx-auto flex flex-col justify-center lg:grid lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 lg:items-center">
          {/* Left 6 Cols: Editorial Headline with Inline Red Pill Icon Badge */}
          <div
            className="lg:col-span-6 px-2 sm:px-8 lg:px-12 space-y-3 sm:space-y-5 lg:space-y-7 text-left lg:text-right flex flex-col items-start lg:items-end shrink-0"
          >
            <div className={`inline-flex items-center px-3 py-1 sm:px-3.5 rounded-full bg-[#0f2c56] text-[11px] sm:text-xs font-bold text-white ${getTextRevealClass(0, "delay-75")}`}>
              Pasbana AI · Evaluasi CV &amp; Karir
            </div>

            <h1 className={`text-2xl sm:text-4xl xl:text-[50px] font-extrabold tracking-normal text-[#0f2c56] leading-[1.24] sm:leading-[1.34] ${getTextRevealClass(0, "delay-150")}`}>
              Hemat waktu evaluasi
              <br />
              dan{" "}
              <span className="inline-flex items-center justify-center align-middle w-11 sm:w-20 h-6 sm:h-11 rounded-full bg-[#ce2731] mx-1">
                <span className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <Play className="w-2 h-2 sm:w-3 sm:h-3 text-white fill-white ml-0.5" />
                </span>
              </span>{" "}
              temukan
              <br />
              <span className={`inline-block bg-[#ce2731] text-white px-3 py-0.5 sm:px-4 sm:py-1 rounded-xl mt-1.5 sm:mt-2.5 ${getHighlightPopClass(0, "delay-300")}`}>
                Karir Pas Bana.
              </span>
            </h1>

            <p className={`text-xs sm:text-base text-slate-600 max-w-lg lg:ml-auto leading-relaxed sm:leading-[1.8] ${getTextRevealClass(0, "delay-200")}`}>
              Dapatkan analisis objektif 5 dimensi terhadap kesiapan CV Anda dan rekomendasi lowongan kerja secara otomatis.
            </p>

            <div className={`pt-0.5 flex flex-wrap items-center justify-start lg:justify-end gap-2.5 sm:gap-3 ${getTextRevealClass(0, "delay-300")}`}>
              <Link
                href="/user/dashboard/evaluasi"
                onClick={(e) => handleAuthFlowLink(e, "/user/dashboard/evaluasi")}
                className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                Evaluasi CV Saya
              </Link>
              <Link
                href="/user/dashboard/evaluasi/onboarding"
                onClick={(e) =>
                  handleAuthFlowLink(e, "/user/dashboard/evaluasi/onboarding")
                }
                className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                Belum Punya CV
              </Link>
            </div>
          </div>

          {/* Right 6 Cols: Solid Isometric Vector UI Illustration inside Solid #0f2c56 Stage */}
          <div
            className={`lg:col-span-6 h-[180px] sm:h-[240px] lg:h-full shrink-0 rounded-[22px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent p-2.5 sm:p-5 lg:p-6 flex items-center justify-center overflow-hidden ${getChildAnimClass(0, "right", "delay-150")}`}
          >
            <svg
              viewBox="0 0 560 420"
              className="w-auto lg:w-full max-w-[260px] sm:max-w-[380px] lg:max-w-[680px] xl:max-w-[740px] max-h-[155px] sm:max-h-[210px] lg:max-h-[82vh] h-auto overflow-visible"
              role="img"
              aria-label="Ilustrasi Isometrik Evaluasi CV dan Pencocokan Karir"
            >
              {/* Animated Isometric Grid Lines */}
              <line x1="80" y1="310" x2="360" y2="150" stroke="#1e3a68" strokeWidth="1.5" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="180" y1="370" x2="460" y2="210" stroke="#1e3a68" strokeWidth="1.5" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="120" y1="170" x2="420" y2="340" stroke="#1e3a68" strokeWidth="1.5" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="16" dur="3s" repeatCount="indefinite" />
              </line>

              {/* Main Isometric CV Document Board (100% Solid Colors) */}
              <polygon
                points="190,196 365,96 495,171 320,271"
                fill="#ce2731"
              />
              <polygon
                points="190,187 365,87 495,162 320,262"
                fill="#ffffff"
                stroke="#0f2c56"
                strokeWidth="2"
              />
              {/* CV Header Profile Badge & Lines (aligned cleanly inside card) */}
              <ellipse cx="322" cy="144" rx="22" ry="13" fill="#ce2731" />
              <circle cx="322" cy="136" r="7" fill="#ffffff" />
              <line x1="352" y1="138" x2="408" y2="170" stroke="#0f2c56" strokeWidth="4" strokeLinecap="round" />
              <line x1="340" y1="148" x2="386" y2="174" stroke="#ce2731" strokeWidth="3" strokeLinecap="round" />
              {/* CV Body Section Lines */}
              <line x1="252" y1="184" x2="352" y2="241" stroke="#0f2c56" strokeWidth="3" strokeLinecap="round" />
              <line x1="274" y1="171" x2="374" y2="228" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="296" y1="158" x2="358" y2="194" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />

              {/* Floating Top-Right Mini Isometric Card (ATS Verified) */}
              <g className="animate-float">
                <polygon
                  points="405,68 465,34 512,61 452,95"
                  fill="#ffffff"
                  stroke="#0f2c56"
                  strokeWidth="1.5"
                />
                <circle cx="445" cy="64" r="7" fill="#ce2731" />
                <path d="M441.5,64 L444,66.5 L449,61.5" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="458" y1="57" x2="482" y2="44" stroke="#0f2c56" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Floating Top-Left Mini Isometric Badge */}
              <g className="animate-float-delay">
                <polygon
                  points="275,92 322,65 356,85 309,112"
                  fill="#ffffff"
                  stroke="#0f2c56"
                  strokeWidth="1.5"
                />
                <circle cx="315" cy="88" r="5.5" fill="#ce2731" />
              </g>

              {/* Floating Mid-Left Isometric Card (Keyword Match - strictly inside bounds) */}
              <g className="animate-float-delay">
                <polygon
                  points="142,245 224,198 286,234 204,281"
                  fill="#ffffff"
                  stroke="#0f2c56"
                  strokeWidth="1.5"
                />
                <circle cx="192" cy="240" r="7" fill="#ce2731" />
                <line x1="208" y1="231" x2="238" y2="214" stroke="#0f2c56" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="216" y1="241" x2="252" y2="221" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Bottom-Left Small Isometric Tile */}
              <polygon
                points="88,325 134,298 170,319 124,346"
                fill="#ce2731"
              />

              {/* Bottom-Center Isometric Card */}
              <g className="animate-float">
                <polygon
                  points="240,340 305,302 355,331 290,369"
                  fill="#ffffff"
                  stroke="#0f2c56"
                  strokeWidth="1.5"
                />
                <line x1="268" y1="336" x2="305" y2="315" stroke="#0f2c56" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="278" y1="345" x2="322" y2="320" stroke="#ce2731" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Right Isometric 3D Score Cylinder */}
              <g className="animate-float">
                <path
                  d="M451,215 L451,275 A34,18 0 0,0 519,275 L519,215 Z"
                  fill="#ffffff"
                />
                <ellipse cx="485" cy="215" rx="34" ry="18" fill="#ce2731" stroke="#ffffff" strokeWidth="1.5" />
                <ellipse cx="485" cy="215" rx="14" ry="7" fill="#ffffff" />
              </g>

              {/* Bottom-Right Isometric Pie Chart */}
              <ellipse cx="385" cy="348" rx="28" ry="15" fill="#ce2731" />
              <path d="M385,348 L413,348 A28,15 0 0,0 395,334 Z" fill="#ffffff" />
            </svg>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 1 (#fitur): FULL-WIDTH SOLID #CE2731 CONTAINER (Matching Video 00:04 - 00:05)
          Cropped Device Frame + Solid Gauge on Left, Clean White Copy on Right
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(1)}`}
      >
        <div className="w-full h-full mx-auto rounded-[24px] sm:rounded-[34px] bg-[#ce2731] lg:bg-transparent px-4 py-3.5 lg:py-0 sm:px-12 lg:px-16 flex flex-col justify-center lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 lg:items-center text-white overflow-hidden">
          {/* Left 6 Cols: Cropped Solid Device Frame Rising from Bottom + Overlapping Solid Gauge */}
          <div
            className={`lg:col-span-6 h-auto lg:h-full shrink-0 flex items-center lg:items-end justify-center lg:pt-8 relative ${getChildAnimClass(1, "up", "delay-100")}`}
          >
            <div className="relative w-full max-w-[310px] sm:max-w-[390px] h-auto lg:h-[88%] bg-white rounded-[20px] lg:rounded-t-[36px] lg:rounded-b-none border-4 lg:border-b-0 border-[#0f2c56] p-3 sm:px-6 sm:pt-6 sm:pb-0 flex flex-col gap-2 sm:gap-5 text-[#0f2c56] overflow-hidden sm:overflow-visible">
              {/* Top 3 Solid Circular Indicators inside Frame */}
              <div className="rounded-xl sm:rounded-2xl bg-[#0f2c56] p-2 sm:p-4 flex items-center justify-around shrink-0">
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-[#0f2c56] text-[10px] sm:text-xs font-black">
                  94%
                </div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#ce2731] flex items-center justify-center text-white text-[10px] sm:text-xs font-black animate-pulse">
                  5D
                </div>
                <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-[#0f2c56] text-[10px] sm:text-xs font-black">
                  88
                </div>
              </div>

              {/* Clean CV Solid Preview inside Frame */}
              <div className="flex-none lg:flex-1 rounded-xl lg:rounded-t-2xl lg:rounded-b-none border-2 lg:border-b-0 border-slate-200 p-2.5 sm:p-5 space-y-1.5 sm:space-y-3 bg-white">
                <div className="w-3/4 h-1.5 sm:h-2.5 rounded-full bg-[#0f2c56]" />
                <div className="w-1/2 h-1.5 sm:h-2.5 rounded-full bg-slate-300" />
                <div className="mt-1.5 sm:mt-4 h-12 sm:h-24 rounded-lg sm:rounded-xl bg-[#0f2c56] text-white flex items-center justify-center gap-2 sm:gap-3 px-2.5 sm:px-4">
                  <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-[#ce2731] text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Play className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-white ml-0.5" />
                  </span>
                  <div className="flex-1 space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="text-[10px] sm:text-xs font-bold text-white truncate">Resume_Standar_ATS.pdf</div>
                    <div className="text-[9px] sm:text-[10px] text-slate-300 truncate">Struktur 1-Kolom Terverifikasi</div>
                  </div>
                </div>
                <div className="w-full h-1.5 sm:h-2 rounded-full bg-slate-300 animate-pulse" />
                <div className="w-2/3 h-1.5 sm:h-2 rounded-full bg-slate-200" />
              </div>

              {/* Overlapping Circular Solid Navy Gauge Timer on Right Edge */}
              <div className="hidden sm:flex absolute -right-14 bottom-12 w-44 h-44 rounded-full bg-white border-4 border-[#0f2c56] shadow-xl items-center justify-center p-2.5 animate-float">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle cx="60" cy="60" r="52" fill="#0f2c56" />
                  <path d="M60,60 L60,8 A52,52 0 0,1 108,80 Z" fill="#ce2731" />
                  <line x1="60" y1="8" x2="60" y2="15" stroke="#ffffff" strokeWidth="2" />
                  <line x1="112" y1="60" x2="105" y2="60" stroke="#ffffff" strokeWidth="2" />
                  <line x1="60" y1="112" x2="60" y2="105" stroke="#ffffff" strokeWidth="2" />
                  <line x1="8" y1="60" x2="15" y2="60" stroke="#ffffff" strokeWidth="2" />
                  <line x1="60" y1="60" x2="34" y2="34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 60 60"
                      to="360 60 60"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </line>
                  <circle cx="60" cy="60" r="4" fill="#ffffff" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Clean Solid White Editorial Copy */}
          <div className="lg:col-span-6 space-y-2.5 sm:space-y-5 lg:space-y-7 text-left lg:pl-8 shrink-0">
            <span className={`inline-flex items-center px-3 py-1 sm:px-3.5 rounded-full bg-[#0f2c56] text-[11px] sm:text-xs font-bold text-white ${getTextRevealClass(1, "delay-75")}`}>
              Pemeriksa Format ATS
            </span>
            <h2 className={`text-xl sm:text-4xl lg:text-[40px] font-extrabold tracking-normal text-white leading-[1.26] sm:leading-[1.35] ${getTextRevealClass(1, "delay-150")}`}>
              Berhenti mengirim CV yang{" "}
              <span className={`inline-block bg-[#0f2c56] text-white px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-xl mt-1.5 sm:mt-2.5 ${getHighlightPopClass(1, "delay-300")}`}>
                gagal dibaca sistem.
              </span>
            </h2>
            <p className={`text-xs sm:text-base text-white max-w-lg leading-relaxed sm:leading-[1.8] ${getTextRevealClass(1, "delay-200")}`}>
              Banyak kandidat gugur saat melamar kerja bukan karena kurang kompeten, melainkan karena susunan resume gagal dipahami mesin ATS. Ketahui letak celah CV Anda dan ikuti alur perbaikannya secara instan.
            </p>
            <div className={`pt-0.5 ${getTextRevealClass(1, "delay-300")}`}>
              <Link
                href="/evaluate"
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                <span>Coba Pemeriksa Struktur ATS</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 2 (#persiapan): MORPHED NAVY STAGE ON LEFT + OPEN RIGHT
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(2)}`}
      >
        <div className="w-full h-full mx-auto flex flex-col justify-center lg:grid lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 lg:items-center">
          {/* Right 6 Cols: Clean Bold Heading & Subtitle on Open White Canvas */}
          <div className="lg:col-span-6 lg:order-2 px-2 sm:px-8 lg:px-12 space-y-2.5 sm:space-y-5 lg:space-y-7 text-left flex flex-col items-start shrink-0">
            <span className={`inline-flex items-center px-3 py-1 sm:px-3.5 rounded-full bg-[#0f2c56] text-[11px] sm:text-xs font-bold text-white ${getTextRevealClass(2, "delay-75")}`}>
              Ekosistem Persiapan Karir
            </span>
            <h2 className={`text-xl sm:text-4xl lg:text-[40px] font-extrabold tracking-normal text-[#0f2c56] leading-[1.26] sm:leading-[1.35] ${getTextRevealClass(2, "delay-150")}`}>
              Tingkatkan peluang lolos
              <br />
              dengan kesiapan{" "}
              <span className={`inline-block bg-[#ce2731] text-white px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-xl mt-1.5 sm:mt-2.5 ${getHighlightPopClass(2, "delay-300")}`}>
                paling optimal.
              </span>
            </h2>
            <p className={`text-xs sm:text-base text-slate-600 max-w-lg leading-relaxed sm:leading-[1.8] ${getTextRevealClass(2, "delay-200")}`}>
              Baik sudah memiliki file PDF maupun belum punya CV sama sekali, ukur 5 dimensi kualitas resume Anda pada waktu yang tepat untuk hasil seleksi terbaik.
            </p>
            <div className={`pt-0.5 flex flex-wrap items-center justify-start gap-2.5 sm:gap-3 ${getTextRevealClass(2, "delay-300")}`}>
              <Link
                href="/onboarding"
                className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                Buat CV
              </Link>
              <Link
                href="/evaluate"
                className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl border border-slate-200 hover:border-[#0f2c56] text-[#0f2c56] text-xs sm:text-sm font-bold transition-colors"
              >
                Unggah PDF CV
              </Link>
            </div>
          </div>

          {/* Left 6 Cols: Isometric Gauge Disc + Dot-Matrix Board inside Morphed Navy Stage */}
          <div
            className={`lg:col-span-6 lg:order-1 h-[180px] sm:h-[240px] lg:h-full shrink-0 rounded-[22px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent p-2.5 sm:p-5 lg:p-6 flex items-center justify-center overflow-hidden ${getChildAnimClass(2, "left", "delay-150")}`}
          >
            <svg
              viewBox="0 0 560 400"
              className="w-auto lg:w-full max-w-[260px] sm:max-w-[380px] lg:max-w-[680px] xl:max-w-[740px] max-h-[155px] sm:max-h-[210px] lg:max-h-[82vh] h-auto overflow-visible"
              role="img"
              aria-label="Ilustrasi Isometrik Kesiapan Karir dan Pemetaan Jadwal"
            >
              {/* Animated Isometric Grid Lines */}
              <line x1="70" y1="260" x2="350" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="170" y1="340" x2="470" y2="170" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="3s" repeatCount="indefinite" />
              </line>
              <line x1="140" y1="140" x2="450" y2="320" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="16" dur="3s" repeatCount="indefinite" />
              </line>

              {/* Top-Left Isometric 3D Solid Clock / Readiness Timer */}
              <g className="animate-float">
                <path
                  d="M144,146 L144,166 A76,42 0 0,0 296,166 L296,146 Z"
                  fill="#ffffff"
                />
                <ellipse cx="220" cy="146" rx="76" ry="42" fill="#ce2731" stroke="#ffffff" strokeWidth="2.5" />
                {/* Clock Hour Markers */}
                <circle cx="220" cy="113" r="2.5" fill="#ffffff" />
                <circle cx="280" cy="146" r="2.5" fill="#ffffff" />
                <circle cx="220" cy="179" r="2.5" fill="#ffffff" />
                <circle cx="160" cy="146" r="2.5" fill="#ffffff" />
                {/* Hour Hand */}
                <line x1="220" y1="146" x2="252" y2="156" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
                {/* Animated Rotating Minute Hand */}
                <line x1="220" y1="146" x2="220" y2="116" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 220 146"
                    to="360 220 146"
                    dur="8s"
                    repeatCount="indefinite"
                  />
                </line>
                <circle cx="220" cy="146" r="5" fill="#0f2c56" stroke="#ffffff" strokeWidth="1.5" />
              </g>

              {/* Right Standing Isometric Calendar / Schedule Board */}
              <g className="animate-float-delay">
                <polygon
                  points="355,108 475,176 475,276 355,208"
                  fill="#ffffff"
                  stroke="#0f2c56"
                  strokeWidth="1.5"
                />
                {/* Calendar Header Strip */}
                <polygon
                  points="355,108 475,176 475,194 355,126"
                  fill="#ce2731"
                />
                {/* Dot-Matrix Dates */}
                <circle cx="382" cy="154" r="4.5" fill="#e2e8f0" />
                <circle cx="403" cy="166" r="4.5" fill="#e2e8f0" />
                <circle cx="424" cy="178" r="4.5" fill="#cbd5e1" />
                <circle cx="445" cy="190" r="4.5" fill="#e2e8f0" />

                <circle cx="382" cy="177" r="4.5" fill="#e2e8f0" />
                <circle cx="403" cy="189" r="6" fill="#ce2731">
                  <animate attributeName="r" values="5.5;7.5;5.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="424" cy="201" r="6" fill="#0f2c56">
                  <animate attributeName="r" values="5.5;7.5;5.5" dur="2s" begin="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="445" cy="213" r="4.5" fill="#cbd5e1" />

                <circle cx="382" cy="200" r="4.5" fill="#cbd5e1" />
                <circle cx="403" cy="212" r="4.5" fill="#e2e8f0" />
                <circle cx="424" cy="224" r="4.5" fill="#e2e8f0" />
                <circle cx="445" cy="236" r="4.5" fill="#e2e8f0" />
              </g>

              {/* Center Connecting Red Track with Animated Signal */}
              <polygon
                points="285,220 315,202 415,260 385,278"
                fill="#ce2731"
              />
              <circle cx="300" cy="211" r="4" fill="#ffffff">
                <animate attributeName="cx" values="300;400;300" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="cy" values="211;269;211" dur="3.5s" repeatCount="indefinite" />
              </circle>

              {/* Bottom-Left Isometric Action Card */}
              <g className="animate-float">
                <polygon
                  points="170,255 240,215 360,285 290,325"
                  fill="#ffffff"
                  stroke="#0f2c56"
                  strokeWidth="1.5"
                />
                <circle cx="225" cy="252" r="7.5" fill="#ce2731" />
                <path d="M221.5,252 L224,254.5 L229,249.5" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="242" y1="262" x2="310" y2="302" stroke="#0f2c56" strokeWidth="3" strokeLinecap="round" />
                <line x1="232" y1="270" x2="285" y2="301" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" />
              </g>

              {/* Bottom-Right Isometric Milestone Tile */}
              <polygon
                points="425,305 468,280 508,303 465,328"
                fill="#1e3a68"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.3"
              />
              <circle cx="466" cy="304" r="4" fill="#ce2731">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
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
        <div className="w-full h-full mx-auto rounded-[24px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent px-4 py-3.5 lg:py-0 sm:px-12 lg:px-16 flex flex-col justify-center lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 lg:items-center text-white overflow-hidden">
          {/* Left 6 Cols: Cropped White Wireframe Rising from Bottom + Eye Badge + Upward Arrow */}
          <div
            className={`lg:col-span-6 h-auto lg:h-full shrink-0 flex items-center lg:items-end justify-center lg:pt-8 relative ${getChildAnimClass(3, "up", "delay-100")}`}
          >
            <div className="relative w-full max-w-[310px] sm:max-w-[390px] h-auto lg:h-[88%] bg-white rounded-[20px] lg:rounded-t-[36px] lg:rounded-b-none border-4 lg:border-b-0 border-slate-200 p-3 sm:px-6 sm:pt-6 sm:pb-0 flex flex-col gap-2 sm:gap-4 text-[#0f2c56] overflow-hidden sm:overflow-visible">
              {/* Card 1 inside Device Frame: Before / Passive */}
              <div className="rounded-xl sm:rounded-2xl bg-white border-2 border-slate-200 p-2 sm:p-4 space-y-1.5 sm:space-y-2.5 shrink-0">
                <div className="w-2/3 h-1.5 sm:h-2 rounded-full bg-slate-300" />
                <div className="w-1/2 h-1.5 sm:h-2 rounded-full bg-slate-200" />
                <div className="h-11 sm:h-16 rounded-lg sm:rounded-xl bg-[#0f2c56] text-white flex items-center justify-between px-2.5 sm:px-4">
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-300">Kalimat Awal</div>
                    <div className="text-[10px] sm:text-xs font-semibold text-slate-300 line-through truncate">
                      Membantu kegiatan acara kampus
                    </div>
                  </div>
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#ce2731] text-white flex items-center justify-center shrink-0">
                    <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Card 2 inside Device Frame: After / Active Impact */}
              <div className="flex-none lg:flex-1 rounded-xl lg:rounded-t-2xl lg:rounded-b-none bg-white border-2 lg:border-b-0 border-slate-200 p-2 sm:p-4 space-y-1.5 sm:space-y-2.5">
                <div className="w-3/4 h-1.5 sm:h-2 rounded-full bg-[#0f2c56]" />
                <div className="h-11 sm:h-16 rounded-lg sm:rounded-xl bg-[#ce2731] text-white flex items-center justify-between px-2.5 sm:px-4">
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="text-[9px] sm:text-[10px] font-bold uppercase text-white">Saran Pasbana AI (+24 Poin)</div>
                    <div className="text-[10px] sm:text-xs font-bold text-white truncate">
                      Mengelola seminar 350+ peserta
                    </div>
                  </div>
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#0f2c56] text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white ml-0.5" />
                  </span>
                </div>
              </div>

              {/* Overlapping Solid Circle with Red Eye Badge on Right Edge */}
              <div className="hidden sm:flex absolute -right-12 bottom-16 w-32 h-32 rounded-full bg-white border-4 border-[#0f2c56] shadow-2xl items-center justify-center animate-float">
                <div className="w-24 h-24 rounded-full bg-[#ce2731] flex items-center justify-center">
                  <Eye className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>

              {/* Upward Outline Arrow Next to Badge */}
              <svg
                viewBox="0 0 48 110"
                className="hidden sm:block absolute -right-24 bottom-24 w-10 h-24 text-white animate-float-delay"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M24,6 L42,28 L30,28 L30,104 L18,104 L18,28 L6,28 Z" />
              </svg>
            </div>
          </div>

          {/* Right 6 Cols: Bold White Heading & Clean Subtitle */}
          <div className="lg:col-span-6 space-y-2.5 sm:space-y-5 lg:space-y-7 text-left lg:pl-10 shrink-0">
            <span className={`inline-flex items-center px-3 py-1 sm:px-3.5 rounded-full bg-[#ce2731] text-[11px] sm:text-xs font-bold text-white ${getTextRevealClass(3, "delay-75")}`}>
              Asisten Kalimat Aktif
            </span>
            <h2 className={`text-xl sm:text-4xl lg:text-[40px] font-extrabold tracking-normal text-white leading-[1.26] sm:leading-[1.35] ${getTextRevealClass(3, "delay-150")}`}>
              Pahami Struktur dan
              <br />
              Kalimat Aktif dalam{" "}
              <span className={`inline-block bg-[#ce2731] text-white px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-xl mt-1.5 sm:mt-2.5 ${getHighlightPopClass(3, "delay-300")}`}>
                penilaian HRD.
              </span>
            </h2>
            <p className={`text-xs sm:text-base text-slate-200 max-w-lg leading-relaxed sm:leading-[1.8] ${getTextRevealClass(3, "delay-200")}`}>
              Lihat perubahan skor kesiapan secara langsung setelah Anda mengganti kalimat pasif menjadi pencapaian terukur, struktur yang rapi, dan kata kunci keahlian yang tepat.
            </p>
            <div className="pt-0.5">
              <Link
                href="/evaluate"
                className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition-colors"
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
          className="relative w-full h-full mx-auto px-1 sm:px-8 lg:px-12 flex flex-col justify-center gap-2.5 sm:gap-5 lg:gap-6"
        >
          {/* Top-Center Section Header */}
          <div className="space-y-1.5 sm:space-y-4 text-center max-w-2xl mx-auto flex flex-col items-center shrink-0">
            <span className={`inline-flex items-center px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#0f2c56] text-[10px] sm:text-xs font-bold text-white ${getTextRevealClass(4, "delay-75")}`}>
              Fitur &amp; Prinsip
            </span>
            <h2 className={`text-lg sm:text-4xl lg:text-[40px] font-extrabold tracking-normal text-[#0f2c56] leading-[1.25] sm:leading-[1.35] ${getTextRevealClass(4, "delay-150")}`}>
              Optimalkan kesiapan karir dengan{" "}
              <span className={`inline-block bg-[#ce2731] text-white px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-lg sm:rounded-xl mt-1 sm:mt-2.5 ${getHighlightPopClass(4, "delay-300")}`}>
                evaluasi presisi.
              </span>
            </h2>
          </div>

          {/* 2 Columns on Mobile, 3 Columns x 2 Rows on Desktop Feature Grid */}
          <div
            ref={slide4GridRef}
            className={`grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-5 ${getChildAnimClass(4, "up", "delay-150")}`}
          >
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
                  className={`p-3 sm:p-5 lg:p-6 rounded-2xl sm:rounded-[28px] text-left transition-colors duration-300 cursor-pointer ${
                    isSelected
                      ? `${isCrimson ? "bg-[#ce2731]" : "bg-[#0f2c56]"} text-white`
                      : "bg-white border-2 border-slate-200 hover:border-[#0f2c56] text-[#0f2c56]"
                  }`}
                >
                  {/* Custom Mini UI Illustration Badge at Top (100% Solid Colors) */}
                  <div className="h-7 sm:h-11 flex items-center mb-1.5 sm:mb-3 origin-left scale-90 sm:scale-100">
                    {item.badgeType === "eye" && (
                      <div className="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#ce2731] inline-flex items-center justify-center">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}
                    {item.badgeType === "calendar" && (
                      <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white border-2 border-[#0f2c56] inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f2c56]" />
                        <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
                        <span className="w-2 h-2 rounded-full bg-[#0f2c56]" />
                      </div>
                    )}
                    {item.badgeType === "video" && (
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white border-2 border-[#0f2c56] inline-flex items-center gap-2">
                        <span className="w-4 h-3 sm:w-5 sm:h-3.5 rounded bg-[#ce2731] flex items-center justify-center">
                          <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white fill-white" />
                        </span>
                        <span className="w-5 sm:w-6 h-1.5 rounded-full bg-[#0f2c56]" />
                      </div>
                    )}
                    {item.badgeType === "rocket" && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ce2731] inline-flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                    {item.badgeType === "score" && (
                      <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-white border-2 border-[#0f2c56] inline-flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[11px] sm:text-xs font-black text-white bg-[#ce2731] px-1.5 sm:px-2 py-0.5 rounded-md">
                          +24
                        </span>
                        <span className="w-4 sm:w-5 h-1.5 rounded-full bg-[#0f2c56]" />
                      </div>
                    )}
                    {item.badgeType === "bell" && (
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#0f2c56] inline-flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f2c56]" />
                        <span className="absolute top-1.5 right-1.5 sm:right-2 w-2 h-2 rounded-full bg-[#ce2731]" />
                      </div>
                    )}
                  </div>

                  <h3
                    className={`text-xs sm:text-base font-bold leading-snug sm:leading-relaxed mb-1 sm:mb-2 transition-colors duration-300 ${
                      isSelected ? "text-white" : "text-[#0f2c56]"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-[11px] sm:text-xs leading-snug sm:leading-[1.7] line-clamp-3 sm:line-clamp-none transition-colors duration-300 ${
                      isSelected ? "text-white" : "text-slate-600"
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
        <div className="w-full h-full mx-auto rounded-[24px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent px-4 py-4 lg:py-0 sm:px-12 lg:px-16 flex flex-col justify-center lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 lg:items-center text-white overflow-hidden">
          {/* Left 6 Cols: Subtitle, Bold Title, Interactive Range Slider, 2 Toggle Buttons */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-6 lg:space-y-7 text-left">
            <div className="space-y-2.5 sm:space-y-5">
              <span className={`inline-flex items-center px-3 py-1 sm:px-3.5 rounded-full bg-[#ce2731] text-[11px] sm:text-xs font-bold text-white ${getTextRevealClass(5, "delay-75")}`}>
                Cara Kerja Otomatis
              </span>
              <h2 className={`text-xl sm:text-4xl lg:text-[40px] font-extrabold tracking-normal text-white leading-[1.26] sm:leading-[1.35] ${getTextRevealClass(5, "delay-150")}`}>
                Dapatkan analisis terbaik untuk{" "}
                <span className={`inline-block bg-[#ce2731] text-white px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-xl mt-1.5 sm:mt-2.5 ${getHighlightPopClass(5, "delay-300")}`}>
                  kesiapan karir.
                </span>
              </h2>
              <p className={`text-xs sm:text-base text-slate-200 max-w-lg leading-relaxed sm:leading-[1.8] ${getTextRevealClass(5, "delay-200")}`}>
                Berhenti membuang waktu, biarkan sistem mengevaluasi secara otomatis.
              </p>
            </div>

            {/* 2 Mode Toggle Buttons */}
            <div className={`flex items-center gap-2.5 sm:gap-3 pt-0.5 ${getTextRevealClass(5, "delay-300")}`}>
              <button
                type="button"
                onClick={() => setInputMode("pdf")}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  inputMode === "questionnaire"
                    ? "bg-white text-[#0f2c56]"
                    : "border border-white/30 text-white hover:border-white"
                }`}
              >
                Buat CV
              </button>
            </div>
          </div>

          {/* Right 6 Cols: Single Clean White Card */}
          <div className={`lg:col-span-6 ${getChildAnimClass(5, "right", "delay-150")}`}>
            <div className="bg-white text-[#0f2c56] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 lg:p-9 shadow-2xl space-y-3 sm:space-y-5 max-w-lg mx-auto">
              <h3 className="text-base sm:text-2xl font-bold text-[#0f2c56] leading-snug">
                Satu alur terpadu yang menjawab seluruh kebutuhan persiapan karir Anda
              </h3>

              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <span className="text-[#0f2c56] font-bold">•</span>
                  <span>Evaluasi mendalam 5 dimensi kesiapan ATS dan standar HRD</span>
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

              <div className="pt-1 sm:pt-2 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-5xl font-black text-[#0f2c56]">Gratis</span>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">Rp 0 / Selamanya</span>
                </div>

                <Link
                  href={inputMode === "pdf" ? "/evaluate" : "/onboarding"}
                  className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  Mulai Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SLIDE 6 (#mulai): 12-COL ASYMMETRIC BENTO + SOLID ACCORDION CARDS
          ===================================================================== */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(6)}`}
      >
        <div className="w-full h-full mx-auto px-1 sm:px-4 flex flex-col justify-between lg:grid lg:grid-cols-12 gap-2.5 sm:gap-4 lg:gap-5 lg:items-stretch">
          {/* Left 5 Cols: Solid Navy CTA Card */}
          <div className="lg:col-span-5 flex flex-col lg:py-1 shrink-0">
            <div className="bg-[#0f2c56] lg:bg-transparent text-white rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-7 lg:p-10 flex flex-col justify-center items-center text-center gap-2.5 sm:gap-5 lg:gap-6 flex-1">
              <div className="space-y-1.5 sm:space-y-4 lg:space-y-5 flex flex-col items-center">
                <span className={`inline-flex items-center px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#ce2731] text-white text-[10px] sm:text-xs font-bold ${getTextRevealClass(6, "delay-75")}`}>
                  Mulai Langkah Karir
                </span>
                <h2 className={`text-lg sm:text-3xl lg:text-[40px] font-extrabold tracking-normal text-white leading-tight sm:leading-[1.35] ${getTextRevealClass(6, "delay-150")}`}>
                  Petakan langkah menuju{" "}
                  <span className={`inline-block bg-[#ce2731] text-white px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-lg sm:rounded-xl mt-1 sm:mt-2.5 ${getHighlightPopClass(6, "delay-300")}`}>
                    karir terbaik Anda.
                  </span>
                </h2>
                <p className={`text-[11px] sm:text-sm lg:text-base text-white/95 max-w-md mx-auto leading-snug sm:leading-[1.8] ${getTextRevealClass(6, "delay-200")}`}>
                  Pastikan CV Anda terbaca sempurna oleh sistem ATS, perkuat poin pencapaian, dan temukan posisi kerja yang paling pas bana.
                </p>
              </div>

              <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${getTextRevealClass(6, "delay-300")}`}>
                <Link
                  href="/evaluate"
                  className="px-4 py-2 sm:px-6 sm:py-3.5 rounded-xl bg-[#ce2731] hover:bg-white text-white hover:text-[#0f2c56] text-xs sm:text-sm font-bold transition-colors inline-flex items-center gap-1.5 sm:gap-2"
                >
                  <span>Evaluasi CV Sekarang</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
                <Link
                  href="/onboarding"
                  className="px-4 py-2 sm:px-6 sm:py-3.5 rounded-xl bg-white hover:bg-[#ce2731] text-[#0f2c56] hover:text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  Buat CV
                </Link>
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Clean Header + 5 Solid Interactive Accordion Cards */}
          <div
            className={`lg:col-span-7 flex-1 min-h-0 flex flex-col justify-center gap-1.5 sm:gap-3 lg:py-2 lg:pl-4 ${getChildAnimClass(6, "right", "delay-150")}`}
          >
            <div className="pb-0.5 sm:pb-2 space-y-1 sm:space-y-2 shrink-0">
              <span className="inline-flex items-center px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#0f2c56] text-[10px] sm:text-xs font-bold text-white">
                Pertanyaan Umum
              </span>
              <h3 className="text-sm sm:text-2xl font-extrabold text-[#0f2c56] leading-tight">
                Semua yang perlu Anda ketahui tentang Pasbana AI
              </h3>
            </div>

            <div className="space-y-1.5 sm:space-y-2.5">
              {ACCORDION_ITEMS.map((item, idx) => {
                const isOpen = openAccordionId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl sm:rounded-2xl transition-colors duration-200 ${
                      isOpen
                        ? "bg-[#0f2c56] text-white"
                        : "bg-[#f8fafc] border border-slate-200 hover:border-[#0f2c56] text-[#0f2c56]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenAccordionId(isOpen ? null : item.id)}
                      className="w-full px-3 py-2 sm:px-5 sm:py-3.5 lg:py-4 flex items-center justify-between gap-2.5 sm:gap-4 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                        <span
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg font-mono text-[11px] sm:text-xs font-black flex items-center justify-center shrink-0 ${
                            isOpen
                              ? "bg-[#ce2731] text-white"
                              : "bg-[#0f2c56] text-white"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span
                          className={`text-[11px] sm:text-sm font-bold leading-tight sm:leading-snug ${
                            isOpen ? "text-white" : "text-[#0f2c56]"
                          }`}
                        >
                          {item.question}
                        </span>
                      </div>
                      <span
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? "bg-[#ce2731] text-white"
                            : "bg-white border border-slate-200 text-[#0f2c56]"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        ) : (
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-2.5 pl-11 pr-4 sm:px-5 sm:pb-4 sm:pl-[62px] sm:pr-10 text-[11px] sm:text-sm text-white/85 leading-snug sm:leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
