"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  UploadCloud,
} from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult, JobItem } from "@/types";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";

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

export default function LowonganCocokPage() {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>(DEFAULT_RECOMMENDED_JOBS);

  useEffect(() => {
    const current = api.getCurrentAnalysis();
    if (current) {
      setAnalysis(current);
    }

    api
      .getJobs()
      .then((data) => {
        if (data && data.length > 0) {
          setJobs(data);
        }
      })
      .catch(() => {
        setJobs(DEFAULT_RECOMMENDED_JOBS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#0f2c56] font-bold font-mono">
          Memuat rekomendasi lowongan kerja...
        </p>
      </div>
    );
  }

  const userTechSkills = analysis?.profile.skills?.technical || [];

  return (
    <main className="min-h-full max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <DashboardPageHeading
        badge="Lowongan Cocok"
        titleLine1="Temukan peluang karir"
        titleLine2Prefix="yang paling"
        titleHighlight="sesuai profil!"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const matchedSkillsCount = job.requiredSkills.filter((req) =>
            userTechSkills.some(
              (u) =>
                u.toLowerCase().includes(req.toLowerCase()) ||
                req.toLowerCase().includes(u.toLowerCase())
            )
          ).length;

          const matchPercent =
            analysis && job.requiredSkills.length > 0
              ? Math.min(
                  98,
                  Math.max(
                    65,
                    Math.round((matchedSkillsCount / job.requiredSkills.length) * 100)
                  )
                )
              : null;

          return (
            <div
              key={job.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-full text-white font-bold ${
                      matchPercent !== null ? "bg-[#ce2731]" : "bg-[#0f2c56]"
                    }`}
                  >
                    {matchPercent !== null ? `${matchPercent}% Cocok` : "Terbuka"}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-slate-100 text-[#0f2c56] font-bold">
                    {job.workType}
                  </span>
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-[#0f2c56] line-clamp-1">
                    {job.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {job.companyName}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#ce2731]" />
                    {job.location}
                  </span>
                  {job.salaryRange && <span>{job.salaryRange}</span>}
                </div>

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
              ) : (
                <Link
                  href={`/apply?jobId=${job.id}&title=${encodeURIComponent(
                    job.title
                  )}&company=${encodeURIComponent(job.companyName)}`}
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
    </main>
  );
}

