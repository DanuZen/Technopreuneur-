"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, Shield } from "lucide-react";

const TOTAL_SLIDES = 3;

const TEAM_MEMBERS = [
  {
    name: "Wira Fikri Ramadanu",
    role: "Frontend Lead",
    nim: "23343023",
    photo: "/team-danu-v2.png",
    focus: "Arsitektur UI/UX, responsivitas, dan antarmuka evaluasi CV interaktif.",
  },
  {
    name: "Muhammad Gilang Ramadhan",
    role: "Backend Lead",
    nim: "23346013",
    photo: "/gilang.png",
    focus: "REST API, autentikasi pengguna, dan integrasi data lowongan kerja.",
  },
  {
    name: "Florensius Panca Gati",
    role: "Backend AI Lead",
    nim: "23343006",
    photo: "/team-panca-v2.png",
    focus: "Pipeline NLP, penilaian CV 5 dimensi, dan pencocokan berbasis pgvector.",
  },
];

export default function AboutPage() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [prevSlide, setPrevSlide] = useState<number>(0);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [activeMemberIdx, setActiveMemberIdx] = useState<number>(0);

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

  const isAnimatingRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const activeSlideRef = useRef<number>(0);
  const teamGridRef = useRef<HTMLDivElement | null>(null);
  const memberItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [memberRect, setMemberRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({ top: 240, left: 32, width: 360, height: 220 });

  const updateMemberRect = useCallback(() => {
    const gridEl = teamGridRef.current;
    const itemEl = memberItemRefs.current[activeMemberIdx];
    if (gridEl && itemEl) {
      setMemberRect({
        top: gridEl.offsetTop + itemEl.offsetTop,
        left: gridEl.offsetLeft + itemEl.offsetLeft,
        width: itemEl.offsetWidth,
        height: itemEl.offsetHeight,
      });
    }
  }, [activeMemberIdx]);

  useEffect(() => {
    updateMemberRect();
    window.addEventListener("resize", updateMemberRect);
    return () => window.removeEventListener("resize", updateMemberRect);
  }, [updateMemberRect, activeSlide]);

  useEffect(() => {
    activeSlideRef.current = activeSlide;
  }, [activeSlide]);

  const goToSlide = useCallback((targetIndex: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, targetIndex));
    if (clamped === activeSlideRef.current || isAnimatingRef.current) return;

    setScrollDir(clamped > activeSlideRef.current ? "down" : "up");
    setPrevSlide(activeSlideRef.current);
    isAnimatingRef.current = true;
    activeSlideRef.current = clamped;
    setActiveSlide(clamped);

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 760);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;
      if (Math.abs(e.deltaY) < 22) return;
      goToSlide(activeSlideRef.current + (e.deltaY > 0 ? 1 : -1));
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
    goToSlide(activeSlideRef.current + (deltaY > 0 ? 1 : -1));
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
      default:
        return {
          top: `${memberRect.top}px`,
          left: `${memberRect.left}px`,
          width: `${memberRect.width}px`,
          height: `${memberRect.height}px`,
          borderRadius: "28px",
          backgroundColor: "#0f2c56",
        };
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="h-full w-full relative overflow-hidden bg-[#fefefd] text-[#0f2c56] select-none"
    >
      {/* GLOBAL MORPHING CARD STAGE (Desktop lg+) */}
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

      {/* SLIDE 0: TENTANG & FILOSOFI PAS BANA */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(0)}`}
      >
        <div className="w-full h-full mx-auto flex flex-col justify-between lg:grid lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 lg:items-center">
          <div className="lg:col-span-6 px-3 sm:px-8 lg:px-12 pt-2.5 sm:pt-4 lg:pt-0 space-y-4 sm:space-y-5 text-left shrink-0">
            <span className={`inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white ${getTextRevealClass(0, "delay-75")}`}>
              Tentang Pasbana AI
            </span>

            <h1 className={`text-[28px] sm:text-5xl font-extrabold tracking-tight text-[#0f2c56] leading-[1.2] sm:leading-[1.18] ${getTextRevealClass(0, "delay-150")}`}>
              Mengenal Filosofi{" "}
              <span className={`inline-block bg-[#ce2731] text-white px-3.5 py-0.5 rounded-xl mt-1.5 ${getHighlightPopClass(0, "delay-300")}`}>
                Pas Bana.
              </span>
            </h1>

            <p className={`text-xs sm:text-base text-slate-600 max-w-lg leading-[1.7] sm:leading-relaxed ${getTextRevealClass(0, "delay-200")}`}>
              Platform bimbingan karir dan pencocokan lowongan kerja presisi berbasis kecerdasan buatan untuk menghubungkan talenta muda dengan industri secara adil dan transparan.
            </p>

            <div className={`pt-0.5 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto ${getTextRevealClass(0, "delay-300")}`}>
              <button
                type="button"
                onClick={() => goToSlide(1)}
                className="px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center"
              >
                Misi &amp; Privasi
              </button>
              <button
                type="button"
                onClick={() => goToSlide(2)}
                className="px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center"
              >
                Tim Pengembang
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex-1 min-h-0 lg:h-full rounded-[28px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent p-5 sm:p-10 lg:p-14 flex flex-col justify-center gap-3.5 sm:gap-5 text-white overflow-hidden">
            <span className={`inline-flex items-center self-start px-3.5 py-1 rounded-full bg-[#ce2731] text-xs font-bold text-white ${getTextRevealClass(0, "delay-100")}`}>
              Filosofi Minang
            </span>
            <h2 className={`text-xl sm:text-3xl font-extrabold text-white leading-snug ${getTextRevealClass(0, "delay-150")}`}>
              Dari Bahasa Minang &quot;Pas Bana&quot;: Sangat Pas, Sangat Cocok
            </h2>
            <p className={`text-xs sm:text-sm text-white/85 leading-relaxed ${getTextRevealClass(0, "delay-200")}`}>
              <strong className="text-white font-bold">Pasbana</strong> berasal dari ungkapan bahasa Minang &quot;pas bana&quot; yang berarti sangat pas atau sangat cocok. Filosofi ini menjadi inti solusi kami: mempertemukan potensi terbaik pencari kerja dengan kebutuhan spesifik perusahaan secara presisi.
            </p>
            <p className={`text-xs sm:text-sm text-white/85 leading-relaxed ${getTextRevealClass(0, "delay-300")}`}>
              Melalui analisis CV cerdas, Pasbana membantu talenta memahami kekuatan diri, memperbaiki celah keterampilan, dan menemukan peluang karir yang benar-benar sesuai tanpa melamar secara acak.
            </p>
          </div>
        </div>
      </section>

      {/* SLIDE 1: MISI & KOMITMEN PRIVASI */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(1)}`}
      >
        <div className="w-full h-full mx-auto rounded-[28px] sm:rounded-[34px] bg-[#ce2731] lg:bg-transparent px-5 py-5 lg:py-0 sm:px-12 lg:px-16 flex flex-col justify-center lg:grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 lg:items-center text-white overflow-hidden">
          <div className="lg:col-span-5 space-y-3.5 sm:space-y-5 text-left">
            <span className={`inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white ${getTextRevealClass(1, "delay-75")}`}>
              Misi &amp; Privasi
            </span>
            <h2 className={`text-[24px] sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-[1.24] sm:leading-[1.22] ${getTextRevealClass(1, "delay-150")}`}>
              Menjembatani talenta{" "}
              <span className={`inline-block bg-[#0f2c56] text-white px-3 py-0.5 rounded-xl mt-1.5 ${getHighlightPopClass(1, "delay-300")}`}>
                secara adil &amp; aman.
              </span>
            </h2>
            <p className={`text-xs sm:text-base text-white/90 max-w-md leading-[1.7] sm:leading-relaxed ${getTextRevealClass(1, "delay-200")}`}>
              Kami menggabungkan penilaian kualitas resume 5 dimensi yang objektif dengan standar perlindungan data pribadi sesuai regulasi Indonesia.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
            <div className={`bg-white text-[#0f2c56] rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 space-y-2.5 sm:space-y-4 ${getTextRevealClass(1, "delay-150")}`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0f2c56] text-white flex items-center justify-center">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-[#0f2c56]">Misi Kami</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Menjembatani kesenjangan antara fresh graduate dan industri kerja melalui analisis kualitas resume 5 dimensi serta rekomendasi lowongan yang transparan.
              </p>
            </div>

            <div className={`bg-[#0f2c56] text-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 space-y-2.5 sm:space-y-4 ${getTextRevealClass(1, "delay-200")}`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ce2731] text-white flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-white">Komitmen Privasi (UU PDP No. 27/2022)</h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                Kami menerapkan sanitasi data pribadi (PII masking) sebelum teks diproses model evaluasi, serta memberi hak penuh kepada pengguna untuk menghapus berkas kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 2: TIM PENGEMBANG (MORPHING BENTO GRID) */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(2)}`}
      >
        <div className="relative w-full h-full mx-auto px-2 sm:px-8 lg:px-12 py-1 lg:py-0 flex flex-col justify-between lg:justify-center gap-2.5 sm:gap-10 lg:gap-14">
          <div className="space-y-1.5 sm:space-y-3 text-center max-w-2xl mx-auto flex flex-col items-center shrink-0">
            <span className={`inline-flex items-center px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#0f2c56] text-[11px] sm:text-xs font-bold text-white ${getTextRevealClass(2, "delay-75")}`}>
              Tim Pengembang
            </span>
            <h2 className={`text-xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#0f2c56] leading-[1.22] sm:leading-[1.22] ${getTextRevealClass(2, "delay-150")}`}>
              Dibangun oleh kolaborasi{" "}
              <span className={`inline-block bg-[#ce2731] text-white px-2.5 py-0.5 sm:px-3 rounded-xl mt-1 sm:mt-1.5 ${getHighlightPopClass(2, "delay-300")}`}>
                tiga peran inti.
              </span>
            </h2>
          </div>

          <div ref={teamGridRef} className="flex-1 min-h-0 lg:flex-initial relative grid grid-cols-1 lg:grid-cols-3 grid-rows-3 lg:grid-rows-none gap-2.5 sm:gap-7 pt-1 sm:pt-12">
            {TEAM_MEMBERS.map((member, idx) => {
              const isSelected = activeMemberIdx === idx;
              return (
                <div
                  key={member.nim}
                  ref={(el) => {
                    memberItemRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveMemberIdx(idx)}
                  onClick={() => setActiveMemberIdx(idx)}
                  className={`rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-5 cursor-pointer transition-colors duration-300 flex flex-row items-center gap-3.5 sm:gap-4 text-left ${
                    isSelected
                      ? "bg-[#0f2c56] lg:bg-transparent text-white"
                      : "bg-white border border-slate-200 text-[#0f2c56]"
                  }`}
                >
                  {/* Left: Pop-Out Portrait Stage */}
                  <div className="relative w-24 h-20 sm:w-40 sm:h-28 shrink-0 flex items-end justify-center">
                    <div
                      className={`absolute inset-x-0 bottom-0 h-20 sm:h-28 rounded-xl sm:rounded-2xl transition-colors duration-500 ${
                        isSelected ? "bg-white" : "bg-[#edf2f9]"
                      }`}
                    />
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={200}
                      height={340}
                      className={`relative z-10 w-20 h-24 sm:w-[124px] sm:h-40 object-cover object-top origin-bottom transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isSelected
                          ? "grayscale-0 scale-105 sm:scale-[1.28]"
                          : "grayscale opacity-90 scale-100"
                      }`}
                    />
                  </div>

                  {/* Right: Name, Role Badge, NIM */}
                  <div className="flex flex-col justify-center gap-1.5 sm:gap-2.5 flex-1 min-w-0">
                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-sm sm:text-lg font-extrabold leading-snug">
                        {member.name}
                      </h3>
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 sm:px-3 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#ce2731] text-white transition-colors duration-300"
                      >
                        {member.role}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] sm:text-xs font-mono font-bold ${
                        isSelected ? "text-white/75" : "text-slate-400"
                      }`}
                    >
                      NIM: {member.nim}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
