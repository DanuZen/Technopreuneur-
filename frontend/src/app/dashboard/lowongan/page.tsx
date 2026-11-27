"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  UploadCloud,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult, JobItem, MyApplicationItem } from "@/types";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { LowonganPageSkeleton } from "@/components/ui/dashboard-skeleton";
import { ModalShell } from "@/components/ui/modal-shell";

const DEFAULT_RECOMMENDED_JOBS: JobItem[] = [
  {
    id: "rec-1",
    title: "Junior Frontend Developer",
    companyName: "PT Teknologi Berdaya Nusantara",
    location: "Jakarta (Hybrid)",
    workType: "full-time",
    salaryRange: "Rp 6.000.000 - Rp 9.000.000",
    source: "internal",
    description: "Mencari fresh graduate dengan kemahiran React, TypeScript, dan Tailwind CSS.",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Git"],
    postedAt: "2026-11-10",
  },
  {
    id: "rec-2",
    title: "Web UI Engineer Intern",
    companyName: "PT Solusi Kreasi Bangsa",
    location: "Bandung (Remote)",
    workType: "internship",
    salaryRange: "Rp 3.500.000 (Uang Saku)",
    source: "internal",
    description: "Program magang intensif pengembangan antarmuka web modern dengan Next.js.",
    requiredSkills: ["React", "HTML/CSS", "JavaScript", "Responsive Layout"],
    postedAt: "2026-11-08",
  },
  {
    id: "rec-3",
    title: "Junior Web Developer",
    companyName: "PT Data Presisi Solusindo",
    location: "Surabaya",
    workType: "full-time",
    salaryRange: "Rp 6.500.000 - Rp 9.500.000",
    source: "jooble",
    externalUrl: "https://id.jooble.org",
    description: "Integrasi antarmuka web dengan REST API dan PostgreSQL.",
    requiredSkills: ["TypeScript", "Next.js", "REST API", "Git"],
    postedAt: "2026-11-09",
  },
];

const SKILL_DISPLAY_MAP: Record<string, string> = {
  html_css: "HTML/CSS",
  rest_api: "REST API",
  nodejs: "Node.js",
  nextjs: "Next.js",
  postgresql: "PostgreSQL",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  react: "React",
  git: "Git",
  docker: "Docker",
  python: "Python",
  fastapi: "FastAPI",
  express: "Express.js",
  mongodb: "MongoDB",
  mysql: "MySQL",
  redis: "Redis",
  graphql: "GraphQL",
  figma: "Figma",
  ui_ux: "UI/UX Design",
};

function formatSkillLabel(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (SKILL_DISPLAY_MAP[key]) return SKILL_DISPLAY_MAP[key];
  if (raw.includes("_")) {
    return raw
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return raw;
}

function checkUserSkillMatch(skillName: string, userTechSkills: string[]): boolean {
  const normReq = formatSkillLabel(skillName).toLowerCase();
  const rawReq = skillName.trim().toLowerCase().replace(/_/g, " ");
  return userTechSkills.some((u) => {
    const normU = formatSkillLabel(u).toLowerCase();
    return (
      normU.includes(normReq) ||
      normReq.includes(normU) ||
      normU.includes(rawReq) ||
      rawReq.includes(normU)
    );
  });
}

function computeJobMatchPercent(
  job: JobItem,
  userTechSkills: string[],
  hasAnalysis: boolean
): number | null {
  const matchedCount = job.requiredSkills.filter((req) =>
    checkUserSkillMatch(req, userTechSkills)
  ).length;

  const skillRatioPercent =
    hasAnalysis && job.requiredSkills.length > 0
      ? Math.min(
          98,
          Math.max(
            matchedCount > 0 ? 65 : 45,
            Math.round((matchedCount / job.requiredSkills.length) * 100)
          )
        )
      : null;

  if (typeof job.matchScore === "number" && job.matchScore > 0) {
    return skillRatioPercent !== null
      ? Math.max(job.matchScore, skillRatioPercent)
      : job.matchScore;
  }
  return skillRatioPercent;
}

function formatCleanMatchReasons(
  rawReasons: string[] | undefined,
  matchedSkills: string[],
  jobTitle: string
): string[] {
  const cleaned: string[] = [];
  const seen = new Set<string>();

  for (const r of rawReasons || []) {
    const stripped = r
      .replace(/\s*\("[^"]*"\)/g, "")
      .replace(/\s*\('[^']*'\)/g, "")
      .trim();
    if (!stripped) continue;
    const key = stripped.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      cleaned.push(stripped);
    }
  }

  if (matchedSkills.length > 0 && cleaned.length === 0) {
    cleaned.push(
      `Profil CV Anda telah mencantumkan keahlian ${matchedSkills.join(", ")} yang sesuai dengan kebutuhan posisi ${jobTitle}.`
    );
  }

  return cleaned;
}

const APP_STATUS_META: Record<
  MyApplicationItem["status"],
  { label: string; badgeClass: string }
> = {
  submitted: { label: "Terkirim", badgeClass: "bg-slate-100 text-[#0f2c56]" },
  reviewed: { label: "Ditinjau HR", badgeClass: "bg-[#edf2f9] text-[#0f2c56]" },
  shortlisted: { label: "Shortlisted", badgeClass: "bg-[#0f2c56] text-white" },
  rejected: { label: "Belum Sesuai", badgeClass: "bg-[#ce2731] text-white" },
};

export default function LowonganCocokPage() {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>(DEFAULT_RECOMMENDED_JOBS);
  const [applications, setApplications] = useState<MyApplicationItem[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "saved" | "applied">("all");
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  useEffect(() => {
    const current = api.getCurrentAnalysis();
    if (current) {
      setAnalysis(current);
    }
    setSavedIds(api.getSavedJobIds());

    const loadAll = async () => {
      const [recResult, appsResult] = await Promise.all([
        api
          .getRecommendedJobs()
          .catch(() => api.getJobs().catch(() => DEFAULT_RECOMMENDED_JOBS)),
        api.getMyApplications().catch(() => []),
      ]);

      if (recResult && recResult.length > 0) {
        setJobs(recResult);
      }
      setApplications(appsResult);
      setLoading(false);
    };

    loadAll();
  }, []);

  useEffect(() => {
    if (!selectedJob) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedJob(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedJob]);

  const handleToggleSave = (jobId: string) => {
    const updated = api.toggleSavedJob(jobId);
    setSavedIds(updated);
  };

  if (loading) {
    return <LowonganPageSkeleton />;
  }

  const userTechSkills = [
    ...(analysis?.profile.skills?.technical || []),
    ...(analysis?.profile.skills?.tools || []),
  ];

  const appliedJobIds = new Set(applications.map((a) => a.jobId));

  const visibleJobs =
    activeTab === "saved" ? jobs.filter((j) => savedIds.includes(j.id)) : jobs;

  return (
    <main className="h-full min-h-0 overflow-hidden w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-3 sm:pb-4 flex flex-col gap-3 sm:gap-4">
      <div className="shrink-0">
      <DashboardPageHeading
        badge="Lowongan Cocok"
        titleLine1="Temukan peluang karir"
        titleLine2Prefix="yang paling"
        titleHighlight="sesuai profil!"
        rightSlot={
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="grid grid-cols-3 sm:inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-2 py-2 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-colors cursor-pointer text-center truncate ${
                  activeTab === "all"
                    ? "bg-[#0f2c56] text-white"
                    : "text-slate-600 hover:text-[#0f2c56]"
                }`}
              >
                Rekomendasi ({jobs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={`px-2 py-2 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-colors cursor-pointer text-center truncate ${
                  activeTab === "saved"
                    ? "bg-[#ce2731] text-white"
                    : "text-slate-600 hover:text-[#0f2c56]"
                }`}
              >
                Tersimpan ({savedIds.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("applied")}
                className={`px-2 py-2 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-colors cursor-pointer text-center truncate ${
                  activeTab === "applied"
                    ? "bg-[#0f2c56] text-white"
                    : "text-slate-600 hover:text-[#0f2c56]"
                }`}
              >
                Lamaran ({applications.length})
              </button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!analysis && (
                <Link
                  href="/user/dashboard/evaluasi"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                  <span>Evaluasi CV</span>
                </Link>
              )}
              <Link
                href="/jobs"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
              >
                <span>Jelajahi Semua Lowongan</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        }
      />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none rounded-[24px] bg-slate-50/80 sm:bg-transparent border border-slate-200/80 sm:border-0 p-2.5 sm:p-0">

      {activeTab === "applied" ? (
        applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[24px] p-8 text-center space-y-3">
            <p className="text-sm font-bold text-[#0f2c56]">
              Anda belum mengirim lamaran pekerjaan.
            </p>
            <p className="text-xs text-slate-500">
              Pilih lowongan pada tab Rekomendasi dan tekan Kirim Lamaran Profil untuk melacak statusnya di sini.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className="px-4 py-2 rounded-xl bg-[#0f2c56] text-white text-xs font-bold cursor-pointer"
            >
              Jelajahi Rekomendasi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((appItem) => {
              const meta = APP_STATUS_META[appItem.status] || APP_STATUS_META.submitted;
              const appliedDate = appItem.createdAt
                ? new Date(appItem.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Baru saja";

              return (
                <div
                  key={appItem.id}
                  className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#0f2c56] text-white font-bold">
                        Skor ATS {appItem.atsScore}%
                      </span>
                      <span
                        className={`text-[10px] uppercase font-mono px-2.5 py-1 rounded-full font-bold ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <h2 className="text-sm font-extrabold text-[#0f2c56]">
                      {appItem.roleApplied}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {appItem.matchReason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#ce2731]" />
                      Dikirim {appliedDate}
                    </span>
                    <span className="font-mono font-bold text-[#0f2c56]">
                      #{appItem.id.slice(-6)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : visibleJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[24px] p-8 text-center space-y-3">
          <p className="text-sm font-bold text-[#0f2c56]">
            Belum ada lowongan yang Anda simpan.
          </p>
          <p className="text-xs text-slate-500">
            Tekan ikon bookmark pada kartu lowongan untuk menyimpannya dan meninjau kembali nanti.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className="px-4 py-2 rounded-xl bg-[#0f2c56] text-white text-xs font-bold cursor-pointer"
          >
            Lihat Semua Rekomendasi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {visibleJobs.map((job) => {
            const matchPercent = computeJobMatchPercent(
              job,
              userTechSkills,
              Boolean(analysis)
            );

            const isSaved = savedIds.includes(job.id);
            const alreadyApplied = appliedJobIds.has(job.id);

            return (
              <div
                key={job.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedJob(job)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedJob(job);
                  }
                }}
                className="p-3.5 sm:p-4 bg-white hover:border-[#0f2c56] border border-slate-200 rounded-2xl flex flex-col justify-between gap-3 transition-colors cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-full text-white font-bold ${
                          matchPercent !== null ? "bg-[#ce2731]" : "bg-[#0f2c56]"
                        }`}
                      >
                        {matchPercent !== null ? `${matchPercent}% Cocok` : "Terbuka"}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 text-[#0f2c56] font-bold">
                        {job.source === "jooble" ? "Jooble" : "Internal"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 text-[#0f2c56] font-bold">
                        {job.workType}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(job.id);
                        }}
                        aria-label={isSaved ? "Hapus dari tersimpan" : "Simpan lowongan"}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved
                            ? "bg-[#ce2731] border-[#ce2731] text-white"
                            : "bg-white border-slate-200 text-slate-400 hover:text-[#0f2c56] hover:border-[#0f2c56]"
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-extrabold text-[#0f2c56] group-hover:text-[#ce2731] transition-colors line-clamp-1">
                      {job.title}
                    </h2>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5 truncate">
                      {job.companyName}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#ce2731] shrink-0" />
                      {job.location}
                    </span>
                    {job.salaryRange && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-[#0f2c56]">{job.salaryRange}</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {job.requiredSkills.slice(0, 3).map((req, i) => {
                      const isMatched = checkUserSkillMatch(req, userTechSkills);
                      return (
                        <span
                          key={i}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            isMatched
                              ? "bg-[#0f2c56] text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {formatSkillLabel(req)}
                        </span>
                      );
                    })}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#edf2f9] text-[#0f2c56] font-bold">
                        +{job.requiredSkills.length - 3} skill
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  {job.source === "jooble" && job.externalUrl ? (
                    <a
                      href={job.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
                    >
                      <span className="truncate">Lamar di Sumber Asli</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ) : alreadyApplied ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab("applied");
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2c56] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0f2c56] shrink-0" />
                      <span className="truncate">Sudah Dilamar (Lihat Status)</span>
                    </button>
                  ) : (
                    <Link
                      href={`/apply/${job.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
                    >
                      <span className="truncate">Kirim Lamaran Profil</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* POPUP MODAL DETAIL LOWONGAN & ANALISIS KECOCOKAN AI (Mobile & Desktop) */}
      {selectedJob && (() => {
        const isUserSkillMatch = (skillName: string) =>
          checkUserSkillMatch(skillName, userTechSkills);

        const matchedRequiredSkills = selectedJob.requiredSkills
          .filter(isUserSkillMatch)
          .map(formatSkillLabel);

        const unmatchedRequiredSkills = selectedJob.requiredSkills
          .filter((req) => !isUserSkillMatch(req))
          .map(formatSkillLabel);

        const modalMatchPercent = computeJobMatchPercent(
          selectedJob,
          userTechSkills,
          Boolean(analysis)
        );

        const extraMissingSkills =
          unmatchedRequiredSkills.length > 0
            ? unmatchedRequiredSkills
            : Array.from(
                new Map(
                  (selectedJob.missingSkills || [])
                    .filter((ms) => !isUserSkillMatch(ms))
                    .map((ms) => {
                      const label = formatSkillLabel(ms);
                      return [label.toLowerCase(), label] as const;
                    })
                ).values()
              ).slice(0, 5);

        const cleanReasons = formatCleanMatchReasons(
          selectedJob.matchReason,
          matchedRequiredSkills,
          selectedJob.title
        );

        const isModalSaved = savedIds.includes(selectedJob.id);
        const isModalApplied = appliedJobIds.has(selectedJob.id);
        const totalReqCount = selectedJob.requiredSkills.length;
        const skillProgressPct =
          totalReqCount > 0
            ? Math.round((matchedRequiredSkills.length / totalReqCount) * 100)
            : 0;

        return (
          <ModalShell
            onClose={() => setSelectedJob(null)}
            ariaLabel={`Detail lowongan ${selectedJob.title}`}
            size="lg"
            badge={
              modalMatchPercent !== null
                ? `${modalMatchPercent}% Cocok`
                : "Lowongan Terbuka"
            }
            headerPills={
              <>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 text-white/95 text-[10px] font-bold uppercase tracking-wider">
                  {selectedJob.source === "jooble" ? "Jooble" : "Mitra Internal"}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 text-white/95 text-[10px] font-bold uppercase tracking-wider">
                  {selectedJob.workType}
                </span>
              </>
            }
            title={selectedJob.title}
            subtitle={
              <span className="font-semibold text-white/85">
                {selectedJob.companyName}
              </span>
            }
            headerExtra={
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/90 pt-2.5 border-t border-white/15">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ce2731] shrink-0" />
                  <span>{selectedJob.location}</span>
                </span>
                {selectedJob.salaryRange && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="font-extrabold text-white">
                      {selectedJob.salaryRange}
                    </span>
                  </>
                )}
              </div>
            }
            footer={
              <div className="flex items-center justify-between gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleSave(selectedJob.id)}
                  className={`min-h-[42px] px-4 py-2 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isModalSaved
                      ? "bg-[#0f2c56] border-[#0f2c56] text-white"
                      : "bg-white border-slate-200 text-[#0f2c56] hover:border-[#0f2c56]"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isModalSaved ? "fill-current" : ""}`} />
                  <span>{isModalSaved ? "Tersimpan" : "Simpan"}</span>
                </button>

                {selectedJob.source === "jooble" && selectedJob.externalUrl ? (
                  <a
                    href={selectedJob.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
                  >
                    <span>Lamar di Sumber Asli</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : isModalApplied ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(null);
                      setActiveTab("applied");
                    }}
                    className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Sudah Dilamar (Lihat Status)</span>
                  </button>
                ) : (
                  <Link
                    href={`/apply/${selectedJob.id}`}
                    className="flex-1 min-h-[42px] inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
                  >
                    <span>Kirim Lamaran Profil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            }
          >
            {/* Baris Ringkasan Kesiapan Skill & Status */}
            <div className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Kesesuaian Keahlian CV
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-[#0f2c56]">
                    {matchedRequiredSkills.length} dari {totalReqCount} skill utama terpenuhi
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    isModalApplied
                      ? "bg-[#0f2c56] text-white"
                      : "bg-[#edf2f9] text-[#0f2c56]"
                  }`}
                >
                  {isModalApplied ? "Sudah Dilamar" : "Siap Melamar"}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0f2c56] transition-all duration-500"
                  style={{ width: `${Math.max(12, skillProgressPct)}%` }}
                />
              </div>
            </div>

            {/* Deskripsi Pekerjaan */}
            <div className="space-y-1">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
                Deskripsi Pekerjaan
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Alasan Kecocokan AI */}
            {cleanReasons.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#edf2f9]/85 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
                  <Sparkles className="w-3.5 h-3.5 text-[#ce2731] shrink-0" />
                  <span>Alasan Kecocokan AI</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  {cleanReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0f2c56] shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pemetaan Skill Lowongan: Terpenuhi vs Perlu Ditingkatkan (Tanpa Duplikasi) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
              <div className="p-3 rounded-2xl bg-[#f8fafc] border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
                    Skill Terpenuhi ({matchedRequiredSkills.length})
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Ada di CV
                  </span>
                </div>
                {matchedRequiredSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {matchedRequiredSkills.map((label, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#0f2c56] text-white font-bold inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>{label}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Belum ada keahlian CV yang cocok langsung.
                  </p>
                )}
              </div>

              {extraMissingSkills.length > 0 && (
                <div className="p-3 rounded-2xl bg-rose-50/50 border border-rose-200/70 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ce2731]">
                      Perlu Ditingkatkan ({extraMissingSkills.length})
                    </span>
                    <span className="text-[10px] font-bold text-[#ce2731]/75">
                      Target Belajar
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {extraMissingSkills.map((label, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white text-[#ce2731] border border-rose-200 font-bold"
                      >
                        + {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ModalShell>
        );
      })()}
    </main>
  );
}
