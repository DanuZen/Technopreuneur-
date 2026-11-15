"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Compass, Users, Shield, Cpu, ArrowLeft, ArrowUpRight } from "lucide-react";

const TOTAL_SLIDES = 4;

const TEAM_MEMBERS = [
  {
    name: "Wira Fikri Ramadanu",
    role: "Frontend Lead",
    nim: "23343023",
    focus: "Arsitektur UI/UX, responsivitas, dan antarmuka evaluasi CV interaktif.",
  },
  {
    name: "Muhammad Gilang Ramadhan",
    role: "Backend Lead",
    nim: "23346013",
    focus: "REST API, autentikasi pengguna, dan integrasi data lowongan kerja.",
  },
  {
    name: "Florensius Panca Gati",
    role: "Backend AI Lead",
    nim: "23343006",
    focus: "Pipeline NLP, penilaian CV 5 dimensi, dan pencocokan berbasis pgvector.",
  },
];

const TECH_STACK = [
  {
    tag: "Frontend",
    title: "Next.js & Tailwind CSS",
    desc: "Antarmuka cepat dan responsif pada Vercel Hobby Tier.",
  },
  {
    tag: "Backend API",
    title: "Node.js & Express",
    desc: "Orkestrasi layanan pengguna, sesi, dan portal lowongan.",
  },
  {
    tag: "AI Engine",
    title: "FastAPI & Gemini Free",
    desc: "Evaluasi 5 dimensi dan asisten perbaikan kalimat aktif.",
  },
  {
    tag: "Database",
    title: "Supabase PostgreSQL",
    desc: "Penyimpanan relasional dan pencarian vektor pgvector.",
  },
];

export default function AboutPage() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [prevSlide, setPrevSlide] = useState<number>(0);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const [activeMemberIdx, setActiveMemberIdx] = useState<number>(0);

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
    const isActive = activeSlide === slideIndex;
    return isActive
      ? `opacity-100 translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${delayClass}`
      : "opacity-0 translate-y-6 transition-all duration-300 ease-in";
  };

  const getHighlightPopClass = (slideIndex: number, delayClass: string = "delay-300") => {
    const isActive = activeSlide === slideIndex;
    return isActive
      ? `opacity-100 scale-100 translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${delayClass}`
      : "opacity-0 scale-90 translate-y-2 transition-all duration-300 ease-in";
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
      case 2: {
        const isCrimson = activeMemberIdx % 2 === 1;
        return {
          top: `${memberRect.top}px`,
          left: `${memberRect.left}px`,
          width: `${memberRect.width}px`,
          height: `${memberRect.height}px`,
          borderRadius: "28px",
          backgroundColor: isCrimson ? "#ce2731" : "#0f2c56",
        };
      }
      case 3:
      default:
        return {
          top: "4px",
          left: "16px",
          width: "calc(41.666667% - 25px)",
          height: "calc(100% - 8px)",
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
        <div className="w-full h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          <div className="lg:col-span-6 px-4 sm:px-8 lg:px-12 space-y-5 text-left">
            <div className={getTextRevealClass(0, "delay-75")}>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2c56] hover:text-[#ce2731] transition-colors mb-3"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Kembali ke Beranda</span>
              </Link>
              <div>
                <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white">
                  Tentang Pasbana AI
                </span>
              </div>
            </div>

            <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0f2c56] leading-[1.18] ${getTextRevealClass(0, "delay-150")}`}>
              Mengenal Filosofi{" "}
              <span className={`inline-block bg-[#ce2731] text-white px-3.5 py-0.5 rounded-xl mt-1.5 ${getHighlightPopClass(0, "delay-300")}`}>
                Pas Bana.
              </span>
            </h1>

            <p className={`text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed ${getTextRevealClass(0, "delay-200")}`}>
              Platform bimbingan karir dan pencocokan lowongan kerja presisi berbasis kecerdasan buatan untuk menghubungkan talenta muda dengan industri secara adil dan transparan.
            </p>

            <div className={`pt-1 flex flex-wrap items-center gap-3 ${getTextRevealClass(0, "delay-300")}`}>
              <button
                type="button"
                onClick={() => goToSlide(1)}
                className="px-6 py-3.5 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Misi &amp; Privasi
              </button>
              <button
                type="button"
                onClick={() => goToSlide(2)}
                className="px-6 py-3.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Tim Pengembang
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 h-full rounded-[28px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent p-6 sm:p-10 lg:p-14 flex flex-col justify-center gap-5 text-white">
            <span className={`inline-flex items-center self-start px-3.5 py-1 rounded-full bg-[#ce2731] text-xs font-bold text-white ${getTextRevealClass(0, "delay-100")}`}>
              Filosofi Minang
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold text-white leading-snug ${getTextRevealClass(0, "delay-150")}`}>
              Dari Bahasa Minang &quot;Pas Bana&quot;: Sangat Pas, Sangat Cocok
            </h2>
            <p className={`text-sm text-white/85 leading-relaxed ${getTextRevealClass(0, "delay-200")}`}>
              <strong className="text-white font-bold">Pasbana</strong> berasal dari ungkapan bahasa Minang &quot;pas bana&quot; yang berarti sangat pas atau sangat cocok. Filosofi ini menjadi inti solusi kami: mempertemukan potensi terbaik pencari kerja dengan kebutuhan spesifik perusahaan secara presisi.
            </p>
            <p className={`text-sm text-white/85 leading-relaxed ${getTextRevealClass(0, "delay-300")}`}>
              Melalui analisis CV cerdas, Pasbana membantu talenta memahami kekuatan diri, memperbaiki celah keterampilan, dan menemukan peluang karir yang benar-benar sesuai tanpa melamar secara acak.
            </p>
          </div>
        </div>
      </section>

      {/* SLIDE 1: MISI & KOMITMEN PRIVASI */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(1)}`}
      >
        <div className="w-full h-full mx-auto rounded-[28px] sm:rounded-[34px] bg-[#ce2731] lg:bg-transparent px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white overflow-hidden">
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className={`inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white ${getTextRevealClass(1, "delay-75")}`}>
              Misi &amp; Privasi
            </span>
            <h2 className={`text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-[1.22] ${getTextRevealClass(1, "delay-150")}`}>
              Menjembatani talenta{" "}
              <span className={`inline-block bg-[#0f2c56] text-white px-3 py-0.5 rounded-xl mt-1.5 ${getHighlightPopClass(1, "delay-300")}`}>
                secara adil &amp; aman.
              </span>
            </h2>
            <p className={`text-sm sm:text-base text-white/90 max-w-md leading-relaxed ${getTextRevealClass(1, "delay-200")}`}>
              Kami menggabungkan penilaian kualitas resume 5 dimensi yang objektif dengan standar perlindungan data pribadi sesuai regulasi Indonesia.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className={`bg-white text-[#0f2c56] rounded-[28px] p-6 sm:p-8 space-y-4 ${getTextRevealClass(1, "delay-150")}`}>
              <div className="w-12 h-12 rounded-2xl bg-[#0f2c56] text-white flex items-center justify-center">
                <Compass className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#0f2c56]">Misi Kami</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Menjembatani kesenjangan antara fresh graduate dan industri kerja melalui analisis kualitas resume 5 dimensi serta rekomendasi lowongan yang transparan.
              </p>
            </div>

            <div className={`bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-8 space-y-4 ${getTextRevealClass(1, "delay-200")}`}>
              <div className="w-12 h-12 rounded-2xl bg-[#ce2731] text-white flex items-center justify-center">
                <Shield className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">Komitmen Privasi (UU PDP No. 27/2022)</h3>
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
        <div className="relative w-full h-full mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-center gap-6">
          <div className="space-y-3 text-left max-w-2xl">
            <span className={`inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white ${getTextRevealClass(2, "delay-75")}`}>
              Tim Pengembang
            </span>
            <h2 className={`text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#0f2c56] leading-[1.22] ${getTextRevealClass(2, "delay-150")}`}>
              Dibangun oleh kolaborasi{" "}
              <span className={`inline-block bg-[#ce2731] text-white px-3 py-0.5 rounded-xl mt-1.5 ${getHighlightPopClass(2, "delay-300")}`}>
                tiga peran inti.
              </span>
            </h2>
          </div>

          <div ref={teamGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TEAM_MEMBERS.map((member, idx) => {
              const isSelected = activeMemberIdx === idx;
              const isCrimson = idx % 2 === 1;
              return (
                <div
                  key={member.nim}
                  ref={(el) => {
                    memberItemRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => setActiveMemberIdx(idx)}
                  onClick={() => setActiveMemberIdx(idx)}
                  className={`rounded-[28px] p-6 sm:p-8 cursor-pointer transition-colors duration-300 flex flex-col justify-between gap-5 min-h-[210px] ${
                    isSelected
                      ? isCrimson
                        ? "bg-[#ce2731] lg:bg-transparent text-white"
                        : "bg-[#0f2c56] lg:bg-transparent text-white"
                      : "bg-white border border-slate-200 text-[#0f2c56]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          isSelected
                            ? "bg-white text-[#0f2c56]"
                            : isCrimson
                            ? "bg-[#ce2731] text-white"
                            : "bg-[#0f2c56] text-white"
                        }`}
                      >
                        {member.role}
                      </span>
                      <Users
                        className={`w-5 h-5 ${isSelected ? "text-white/80" : "text-slate-400"}`}
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold">{member.name}</h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isSelected ? "text-white/85" : "text-slate-600"
                      }`}
                    >
                      {member.focus}
                    </p>
                  </div>
                  <p
                    className={`text-xs font-mono font-bold ${
                      isSelected ? "text-white/75" : "text-slate-400"
                    }`}
                  >
                    NIM: {member.nim}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SLIDE 3: ARSITEKTUR ZERO BUDGET & CTA */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(3)}`}
      >
        <div className="w-full h-full mx-auto px-2 sm:px-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5 flex flex-col py-1">
            <div className="bg-[#0f2c56] lg:bg-transparent text-white rounded-[28px] p-6 sm:p-8 lg:p-10 flex flex-col justify-center items-center text-center gap-6 flex-1">
              <div className="space-y-4 flex flex-col items-center">
                <span className={`inline-flex items-center px-3.5 py-1 rounded-full bg-[#ce2731] text-white text-xs font-bold ${getTextRevealClass(3, "delay-75")}`}>
                  Arsitektur Zero Budget
                </span>
                <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.22] ${getTextRevealClass(3, "delay-150")}`}>
                  Infrastruktur modern{" "}
                  <span className={`inline-block bg-[#ce2731] text-white px-3 py-0.5 rounded-xl mt-1.5 ${getHighlightPopClass(3, "delay-300")}`}>
                    biaya Rp 0.
                  </span>
                </h2>
                <p className={`text-sm text-white/85 max-w-md mx-auto leading-relaxed ${getTextRevealClass(3, "delay-200")}`}>
                  Dirancang dengan strategi zero operational cost agar seluruh mahasiswa dan pencari kerja dapat menikmati evaluasi CV tanpa biaya berlangganan.
                </p>
              </div>

              <div className={`flex flex-wrap items-center justify-center gap-3 ${getTextRevealClass(3, "delay-300")}`}>
                <Link
                  href="/evaluate"
                  className="px-6 py-3.5 rounded-xl bg-[#ce2731] hover:bg-white text-white hover:text-[#0f2c56] text-xs sm:text-sm font-bold transition-colors inline-flex items-center gap-2"
                >
                  <span>Evaluasi CV Sekarang</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#ce2731] text-[#0f2c56] hover:text-white text-xs sm:text-sm font-bold transition-colors"
                >
                  Halaman Utama
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center gap-4 py-2 lg:pl-4">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-[#ce2731]" aria-hidden="true" />
              <span className="text-sm font-extrabold text-[#0f2c56]">Tumpukan Teknologi Terpadu</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TECH_STACK.map((item, idx) => (
                <div
                  key={item.title}
                  className={`rounded-[24px] bg-white border border-slate-200 p-6 space-y-2.5 ${getTextRevealClass(3, idx < 2 ? "delay-150" : "delay-200")}`}
                >
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold">
                    {item.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0f2c56]">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING SECTION INDICATOR PILL */}
      <nav
        aria-label="Navigasi section tentang"
        className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-2 bg-white/90 border border-slate-200 rounded-full p-1.5 shadow-sm"
      >
        {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goToSlide(idx)}
            aria-label={`Section ${idx + 1}`}
            className={`w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              activeSlide === idx ? "h-7 bg-[#ce2731]" : "h-2.5 bg-[#0f2c56]/25 hover:bg-[#0f2c56]/60"
            }`}
          />
        ))}
      </nav>
    </div>
  );
}
