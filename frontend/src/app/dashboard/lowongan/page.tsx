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
} from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult, JobItem, MyApplicationItem } from "@/types";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { LowonganPageSkeleton } from "@/components/ui/dashboard-skeleton";

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
    <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-6">
      <DashboardPageHeading
        badge="Lowongan Cocok"
        titleLine1="Temukan peluang karir"
        titleLine2Prefix="yang paling"
        titleHighlight="sesuai profil!"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === "applied"
                    ? "bg-[#0f2c56] text-white"
                    : "text-slate-600 hover:text-[#0f2c56]"
                }`}
              >
                Lamaran Saya ({applications.length})
              </button>
            </div>
            {!analysis && (
              <Link
                href="/user/dashboard/evaluasi"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Evaluasi CV</span>
              </Link>
            )}
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
            >
              <span>Jelajahi Semua Lowongan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        }
      />

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleJobs.map((job) => {
            const matchedSkillsCount = job.requiredSkills.filter((req) =>
              userTechSkills.some(
                (u) =>
                  u.toLowerCase().includes(req.toLowerCase()) ||
                  req.toLowerCase().includes(u.toLowerCase())
              )
            ).length;

            const computedLocal =
              analysis && job.requiredSkills.length > 0
                ? Math.min(
                    98,
                    Math.max(
                      65,
                      Math.round((matchedSkillsCount / job.requiredSkills.length) * 100)
                    )
                  )
                : null;

            const matchPercent =
              typeof job.matchScore === "number" ? job.matchScore : computedLocal;

            const isSaved = savedIds.includes(job.id);
            const alreadyApplied = appliedJobIds.has(job.id);

            return (
              <div
                key={job.id}
                className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-full text-white font-bold ${
                          matchPercent !== null ? "bg-[#ce2731]" : "bg-[#0f2c56]"
                        }`}
                      >
                        {matchPercent !== null ? `${matchPercent}% Cocok` : "Terbuka"}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-1 rounded-md bg-slate-100 text-[#0f2c56] font-bold">
                        {job.source === "jooble" ? "Jooble" : "Internal"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono px-2 py-1 rounded-md bg-slate-100 text-[#0f2c56] font-bold">
                        {job.workType}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleSave(job.id)}
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
                    <h2 className="text-sm font-extrabold text-[#0f2c56] line-clamp-1">
                      {job.title}
                    </h2>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      {job.companyName}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ce2731]" />
                      {job.location}
                    </span>
                    {job.salaryRange && <span>{job.salaryRange}</span>}
                  </div>

                  {job.matchReason && job.matchReason.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#edf2f9] border border-slate-200/80 space-y-1">
                      <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
                        <Sparkles className="w-3 h-3 text-[#ce2731]" />
                        <span>Alasan Kecocokan AI</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed line-clamp-2">
                        {job.matchReason[0]}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                      Skill Lowongan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map((req, i) => {
                        const isMatched = userTechSkills.some(
                          (u) =>
                            u.toLowerCase().includes(req.toLowerCase()) ||
                            req.toLowerCase().includes(u.toLowerCase())
                        );
                        return (
                          <span
                            key={i}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                              isMatched
                                ? "bg-[#0f2c56] text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {req}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {job.missingSkills && job.missingSkills.length > 0 && (
                    <div className="space-y-1 pt-0.5">
                      <span className="text-[10px] font-mono uppercase text-[#ce2731] font-bold">
                        Perlu Ditingkatkan:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {job.missingSkills.slice(0, 4).map((ms, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-[#ce2731] border border-red-200 font-bold"
                          >
                            {ms}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {job.source === "jooble" && job.externalUrl ? (
                  <a
                    href={job.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
                  >
                    <span>Lamar di Sumber Asli</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : alreadyApplied ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab("applied")}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2c56] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0f2c56]" />
                    <span>Sudah Dilamar (Lihat Status)</span>
                  </button>
                ) : (
                  <Link
                    href={`/apply/${job.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
                  >
                    <span>Kirim Lamaran Profil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
