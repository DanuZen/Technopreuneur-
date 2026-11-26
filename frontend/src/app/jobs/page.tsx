"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  ExternalLink,
  Filter,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { JobItem } from "@/types";
import { api } from "@/lib/api";

const TOTAL_SLIDES = 2;

export default function JobsPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [prevSlide, setPrevSlide] = useState<number>(0);
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");
  const [isEntered, setIsEntered] = useState<boolean>(false);

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

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getJobs({ keyword, location, workType });
      if (!data || data.length === 0) {
        setJobs(SAMPLE_JOBS);
      } else {
        setJobs(data);
      }
    } catch {
      setJobs(SAMPLE_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
    goToSlide(1);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      const scrollContainer = target?.closest("[data-jobs-scroll='true']") as HTMLElement | null;

      if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight + 2) {
        const atTop = scrollContainer.scrollTop <= 1;
        const atBottom =
          scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight - 2;

        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
          return;
        }
      }

      e.preventDefault();
      if (isAnimatingRef.current) return;
      if (Math.abs(e.deltaY) < 22) return;
      goToSlide(activeSlideRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "SELECT" || activeTag === "TEXTAREA") {
        return;
      }
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
      default:
        return {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
          borderRadius: "34px",
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

      {/* SLIDE 0: HERO PENCARIAN & FILTER LOWONGAN */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(0)}`}
      >
        <div className="w-full h-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          <div className="lg:col-span-6 px-4 sm:px-8 lg:px-12 space-y-5 text-left">
            <span className={`inline-flex items-center px-3.5 py-1 rounded-full bg-[#0f2c56] text-xs font-bold text-white ${getTextRevealClass(0, "delay-75")}`}>
              Pencocokan Karir
            </span>

            <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0f2c56] leading-[1.18] ${getTextRevealClass(0, "delay-150")}`}>
              Eksplorasi{" "}
              <span className={`inline-block bg-[#ce2731] text-white px-3.5 py-0.5 rounded-xl mt-1.5 ${getHighlightPopClass(0, "delay-300")}`}>
                Lowongan Kerja
              </span>
            </h1>

            <p className={`text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed ${getTextRevealClass(0, "delay-200")}`}>
              Temukan lowongan dari mitra internal terverifikasi dan agregasi portal Jooble Indonesia, lengkap dengan analisis kesesuaian keahlian Pasbana AI.
            </p>

            <div className={`pt-1 flex flex-wrap items-center gap-3 ${getTextRevealClass(0, "delay-300")}`}>
              <button
                type="button"
                onClick={() => goToSlide(1)}
                className="px-6 py-3.5 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Lihat {jobs.length} Lowongan Aktif</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <Link
                href="/evaluate"
                className="px-6 py-3.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs sm:text-sm font-bold transition-colors"
              >
                Cek Kecocokan CV
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 h-full rounded-[28px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
            <form
              onSubmit={handleSearch}
              className="bg-white text-[#0f2c56] rounded-[28px] p-6 sm:p-8 space-y-4 shadow-2xl"
            >
              <div className="space-y-1.5">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold">
                  Filter Cerdas
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0f2c56]">
                  Cari posisi yang paling pas bana
                </h2>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Posisi, keahlian, atau perusahaan..."
                    className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f2c56] bg-white text-[#0f2c56]"
                  />
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Kota (Jakarta, Bandung, Remote)..."
                    className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f2c56] bg-white text-[#0f2c56]"
                  />
                </div>

                <div className="relative">
                  <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0f2c56] cursor-pointer bg-white text-[#0f2c56]"
                  >
                    <option value="">Semua Tipe Kerja</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Magang (Internship)</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#ce2731] hover:bg-[#b01e27] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cari Lowongan
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* SLIDE 1: DAFTAR LOWONGAN AKTIF */}
      <section
        className={`absolute inset-0 pt-1 sm:pt-1.5 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${getSectionAnimClass(1)}`}
      >
        <div className="w-full h-full mx-auto rounded-[28px] sm:rounded-[34px] bg-[#0f2c56] lg:bg-transparent px-5 sm:px-10 lg:px-14 py-6 flex flex-col gap-5 text-white overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="space-y-1.5">
              <span className={`inline-flex items-center px-3.5 py-1 rounded-full bg-[#ce2731] text-xs font-bold text-white ${getTextRevealClass(1, "delay-75")}`}>
                Lowongan Terkurasi
              </span>
              <h2 className={`text-2xl sm:text-3xl font-extrabold text-white ${getTextRevealClass(1, "delay-150")}`}>
                Menampilkan {jobs.length} Peluang Aktif
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => goToSlide(0)}
                className="px-4 py-2.5 rounded-xl bg-white text-[#0f2c56] hover:bg-[#ce2731] hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ubah Filter</span>
              </button>
            </div>
          </div>

          <div
            data-jobs-scroll="true"
            className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 select-text"
          >
            {loading && (
              <div className="h-full flex flex-col items-center justify-center gap-3 py-12">
                <Loader2 className="w-8 h-8 text-white animate-spin" aria-hidden="true" />
                <p className="text-sm text-white/80 font-medium">Memuat data lowongan kerja...</p>
              </div>
            )}

            {!loading && error && (
              <div className="p-5 bg-[#ce2731] text-white rounded-[24px] text-sm font-medium flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div className="py-16 text-center space-y-3 bg-white text-[#0f2c56] rounded-[28px] p-8">
                <Briefcase className="w-12 h-12 text-[#0f2c56] mx-auto" aria-hidden="true" />
                <h3 className="text-base font-bold">Tidak ada lowongan yang sesuai kriteria</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau bersihkan filter lokasi untuk melihat lowongan lainnya.
                </p>
              </div>
            )}

            {!loading && !error && jobs.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-2">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function JobCard({ job }: { job: JobItem }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(api.getSavedJobIds().includes(job.id));
  }, [job.id]);

  const handleToggleSave = () => {
    const updated = api.toggleSavedJob(job.id);
    setSaved(updated.includes(job.id));
  };

  return (
    <article className="p-5 sm:p-6 bg-white text-[#0f2c56] border border-slate-200 rounded-[24px] space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-[#0f2c56]">{job.title}</h3>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                job.source === "internal"
                  ? "bg-[#0f2c56] text-white"
                  : "border border-slate-200 text-[#0f2c56] bg-white"
              }`}
            >
              {job.source === "internal" ? "Mitra Terverifikasi" : "Jooble"}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-700">{job.companyName}</p>

          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 pt-0.5">
            <span className="flex items-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#ce2731]" aria-hidden="true" />
              {job.location}
            </span>
            <span>•</span>
            <span className="capitalize font-semibold">{job.workType}</span>
            {job.salaryRange && (
              <>
                <span>•</span>
                <span className="font-bold text-[#0f2c56]">{job.salaryRange}</span>
              </>
            )}
          </div>
        </div>

        {job.matchScore !== undefined && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#ce2731] text-white rounded-full text-[11px] font-bold self-start shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            <span>{job.matchScore}% Cocok</span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>

      <div className="flex flex-wrap items-center gap-1.5">
        {job.requiredSkills.map((skill, idx) => (
          <span
            key={idx}
            className="text-[11px] px-2.5 py-0.5 rounded-lg border border-slate-200 bg-white text-[#0f2c56] font-bold"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
        <button
          type="button"
          onClick={handleToggleSave}
          className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
            saved
              ? "bg-[#0f2c56] border-[#0f2c56] text-white"
              : "bg-white border-slate-200 text-[#0f2c56] hover:border-[#0f2c56]"
          }`}
          aria-label={saved ? "Hapus dari simpanan" : "Simpan lowongan ini"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-white text-white" : ""}`} aria-hidden="true" />
          {saved ? "Disimpan" : "Simpan"}
        </button>

        {job.externalUrl ? (
          <a
            href={job.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-4 py-2 bg-[#0f2c56] hover:bg-[#ce2731] text-white rounded-xl transition-colors flex items-center gap-1.5"
          >
            Lamar di Sumber Asli
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        ) : (
          <Link
            href={`/apply/${job.id}`}
            className="text-xs font-bold px-4 py-2 bg-[#ce2731] hover:bg-[#b01e27] text-white rounded-xl transition-colors inline-flex items-center"
          >
            Kirim Lamaran Cepat
          </Link>
        )}
      </div>
    </article>
  );
}

const SAMPLE_JOBS: JobItem[] = [
  {
    id: "job-1",
    title: "Junior Frontend Developer",
    companyName: "PT Teknologi Berdaya Nusantara",
    location: "Jakarta (Hybrid)",
    workType: "full-time",
    salaryRange: "Rp 6.000.000 - Rp 9.000.000",
    source: "internal",
    description: "Kami mencari fresh graduate atau talenta muda dengan kemahiran React, TypeScript, dan Tailwind CSS untuk bergabung dengan tim produk web kami.",
    requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
    postedAt: "2026-11-10",
    matchScore: 92,
  },
  {
    id: "job-2",
    title: "Web UI Engineer Intern",
    companyName: "PT Solusi Kreasi Bangsa",
    location: "Bandung (Remote)",
    workType: "internship",
    salaryRange: "Rp 3.500.000 (Uang Saku)",
    source: "internal",
    description: "Program magang intensif 6 bulan untuk mahasiswa tingkat akhir / fresh graduate yang ingin mengasah kemampuan arsitektur UI dan implementasi desain Figma.",
    requiredSkills: ["HTML/CSS", "JavaScript", "Figma to Code", "Responsive Layout"],
    postedAt: "2026-11-08",
    matchScore: 85,
  },
  {
    id: "job-3",
    title: "Junior Backend Developer",
    companyName: "PT Data Presisi Solusindo",
    location: "Surabaya",
    workType: "full-time",
    salaryRange: "Rp 6.500.000 - Rp 9.500.000",
    source: "jooble",
    externalUrl: "https://id.jooble.org",
    description: "Tanggung jawab mencakup pengembangan API RESTful menggunakan Node.js Express atau Python FastAPI serta integrasi database PostgreSQL.",
    requiredSkills: ["Node.js", "Express", "PostgreSQL", "REST API"],
    postedAt: "2026-11-09",
    matchScore: 78,
  },
];
