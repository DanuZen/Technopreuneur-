"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck,
  FileSpreadsheet,
  MapPin,
  Plus,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import {
  CompanyFunnelDiagram,
  CompanyTrendDiagram,
} from "@/components/dashboard/dashboard-diagrams";
import { api } from "@/lib/api";

type ApplicantStatus = "submitted" | "reviewed" | "shortlisted" | "rejected";

interface CompanyJobItem {
  id: string;
  title: string;
  location: string;
  type: string;
  applicants: number;
  active: boolean;
}

interface CompanyCandidateItem {
  id: string;
  codeName: string;
  roleApplied: string;
  atsScore: number;
  matchReason: string;
  status: ApplicantStatus;
  candidateSummary?: {
    headline: string;
    education: string;
    skills: string[];
    experienceHighlight: string;
    cvSource: "upload" | "onboarding";
  };
}

const INITIAL_COMPANY_JOBS: CompanyJobItem[] = [
  {
    id: "job-1",
    title: "Junior Frontend Developer",
    location: "Jakarta (Hybrid)",
    type: "Full-time",
    applicants: 14,
    active: true,
  },
  {
    id: "job-2",
    title: "UI/UX Product Designer",
    location: "Remote",
    type: "Full-time",
    applicants: 9,
    active: true,
  },
  {
    id: "job-3",
    title: "Backend Node.js Engineer",
    location: "Bandung (On-site)",
    type: "Contract",
    applicants: 7,
    active: false,
  },
];

const INITIAL_COMPANY_CANDIDATES: CompanyCandidateItem[] = [
  {
    id: "cand-01",
    codeName: "Kandidat #ATS-8841",
    roleApplied: "Junior Frontend Developer",
    atsScore: 91,
    matchReason: "Menguasai React, Next.js, TypeScript, dan portofolio proyek terukur.",
    status: "shortlisted",
    candidateSummary: {
      headline: "Junior Frontend & Fullstack Developer",
      education: "S1 Teknik Informatika - Universitas Negeri Padang (2026)",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST API"],
      experienceHighlight:
        "Membangun antarmuka web interaktif Next.js dengan peningkatan kecepatan muat 38%.",
      cvSource: "upload",
    },
  },
  {
    id: "cand-02",
    codeName: "Kandidat #ATS-7520",
    roleApplied: "UI/UX Product Designer",
    atsScore: 86,
    matchReason: "Struktur pengalaman desain sistem rapi dan metrik konversi jelas.",
    status: "reviewed",
    candidateSummary: {
      headline: "UI/UX & Product Designer",
      education: "S1 Desain Komunikasi Visual (2025)",
      skills: ["Design System", "Prototyping", "Wireframing", "HTML/CSS"],
      experienceHighlight:
        "Merancang ulang alur checkout aplikasi mobile dan meningkatkan konversi pengguna.",
      cvSource: "onboarding",
    },
  },
  {
    id: "cand-03",
    codeName: "Kandidat #ATS-6394",
    roleApplied: "Backend Node.js Engineer",
    atsScore: 79,
    matchReason: "Pengalaman REST API solid, perlu penguatan optimasi query database.",
    status: "submitted",
  },
  {
    id: "cand-04",
    codeName: "Kandidat #ATS-5108",
    roleApplied: "Junior Frontend Developer",
    atsScore: 84,
    matchReason: "Kuat di Tailwind CSS dan aksesibilitas antarmuka web modern.",
    status: "submitted",
  },
];

export function CompanyJobsSubpage() {
  const [jobs, setJobs] = useState<CompanyJobItem[]>(INITIAL_COMPANY_JOBS);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");

  useEffect(() => {
    api
      .getCompanyJobs<CompanyJobItem[]>()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) setJobs(res);
      })
      .catch(() => {});
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const cleanTitle = title.trim();
    const cleanLoc = location.trim() || "Indonesia (Remote)";
    try {
      const created = await api.createCompanyJob<CompanyJobItem>({
        title: cleanTitle,
        location: cleanLoc,
        type,
      });
      setJobs((prev) => [created, ...prev]);
    } catch {
      setJobs((prev) => [
        {
          id: `job-${Date.now()}`,
          title: cleanTitle,
          location: cleanLoc,
          type,
          applicants: 0,
          active: true,
        },
        ...prev,
      ]);
    }
    setTitle("");
    setLocation("");
    setShowForm(false);
  };

  const toggleActive = async (id: string) => {
    const target = jobs.find((j) => j.id === id);
    const nextActive = target ? !target.active : true;
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, active: nextActive } : j))
    );
    try {
      await api.toggleCompanyJob(id, nextActive);
    } catch {
      // tetap gunakan state optimis lokal jika offline
    }
  };

  const activeJobsCount = jobs.filter((j) => j.active).length;
  const totalApplicantsCount = jobs.reduce((acc, j) => acc + j.applicants, 0);
  const reviewedEstimate = Math.round(totalApplicantsCount * 0.65);
  const shortlistedEstimate = Math.round(totalApplicantsCount * 0.25);
  const rejectedEstimate = Math.max(totalApplicantsCount - reviewedEstimate - shortlistedEstimate, 0);

  return (
    <main className="min-h-full lg:h-full lg:min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4 lg:overflow-hidden">
      <DashboardPageHeading
        badge="Manajemen Lowongan"
        titleLine1="Kelola posisi kerja"
        titleLine2Prefix="untuk menjaring"
        titleHighlight="talenta terbaik!"
        rightSlot={
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="morph-pill inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Pasang Lowongan</span>
          </button>
        }
      />

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-[#0f2c56]/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <form
            onSubmit={handleAdd}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-extrabold text-[#0f2c56]">
                  Publikasikan Lowongan Baru
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lowongan aktif otomatis terindeks oleh sistem pencocokan AI.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Tutup popup"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0f2c56] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <label className="block space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-slate-500">
                  Nama Posisi
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Data Analyst"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  required
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-slate-500">
                    Lokasi
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Misal: Jakarta / Remote"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-slate-500">
                    Tipe Pekerjaan
                  </span>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2c56] text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="morph-pill px-5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold cursor-pointer"
              >
                Simpan &amp; Terbitkan
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto lg:overflow-hidden scrollbar-none">
        <div className="shrink-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
          {jobs.map((job) => (
          <div
            key={job.id}
            className="morph-surface rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white ${
                    job.active
                      ? "bg-emerald-600"
                      : "bg-slate-600"
                  }`}
                >
                  {job.active ? "Aktif" : "Dijeda"}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {job.type}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-[#0f2c56]">{job.title}</h3>
              <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#ce2731]" />
                <span>{job.location}</span>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0f2c56]">
                {job.applicants} Pelamar
              </span>
              <button
                type="button"
                onClick={() => toggleActive(job.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-colors cursor-pointer ${
                  job.active
                    ? "bg-[#0f2c56] hover:bg-[#ce2731]"
                    : "bg-[#ce2731] hover:bg-[#0f2c56]"
                }`}
              >
                {job.active ? "Jeda Lowongan" : "Aktifkan"}
              </button>
            </div>
          </div>
        ))}
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
          <div className="xl:col-span-6 min-h-0">
            <CompanyFunnelDiagram
              totalJobs={activeJobsCount}
              totalApplicants={totalApplicantsCount}
              reviewedCount={reviewedEstimate}
              shortlistedCount={shortlistedEstimate}
              rejectedCount={rejectedEstimate}
            />
          </div>
          <div className="xl:col-span-6 min-h-0">
            <CompanyTrendDiagram />
          </div>
        </div>
      </div>
    </main>
  );
}

export function CompanyCandidatesSubpage() {
  const [candidates, setCandidates] = useState<CompanyCandidateItem[]>(INITIAL_COMPANY_CANDIDATES);
  const [filter, setFilter] = useState<"all" | ApplicantStatus>("all");
  const [selectedId, setSelectedId] = useState<string>(INITIAL_COMPANY_CANDIDATES[0].id);

  useEffect(() => {
    api
      .getCompanyApplicants<CompanyCandidateItem[]>("all")
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setCandidates(res);
          setSelectedId(res[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const updateStatus = (id: string, status: ApplicantStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    if (status !== "submitted") {
      api.updateCompanyApplicantStatus(id, status).catch(() => {});
    }
  };

  const visible =
    filter === "all" ? candidates : candidates.filter((c) => c.status === filter);
  const selected =
    visible.find((c) => c.id === selectedId) || visible[0] || candidates[0];

  return (
    <main className="min-h-full lg:h-full lg:min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4 lg:overflow-hidden">
      <DashboardPageHeading
        badge="Seleksi Kandidat"
        titleLine1="Tinjau kesiapan pelamar"
        titleLine2Prefix="berdasarkan skor"
        titleHighlight="evaluasi ATS!"
        rightSlot={
          <div className="flex flex-wrap items-center gap-1.5">
            {(["all", "submitted", "reviewed", "shortlisted", "rejected"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                    filter === tab
                      ? "bg-[#0f2c56] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-[#0f2c56]"
                  }`}
                >
                  {tab === "all" ? "Semua" : tab}
                </button>
              )
            )}
          </div>
        }
      />

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:overflow-hidden">
        {/* Tabel List Ringkas (Tanpa Kolom Aksi) */}
        <div className="flex-1 min-h-[260px] lg:min-h-0 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="shrink-0 grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <span className="col-span-5">Kandidat</span>
            <span className="col-span-4">Posisi Dilamar</span>
            <span className="col-span-3 text-right">Skor &amp; Status</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none divide-y divide-slate-100">
            {visible.map((cand) => {
              const isSelected = selected?.id === cand.id;
              return (
                <button
                  key={cand.id}
                  type="button"
                  onClick={() => setSelectedId(cand.id)}
                  className={`w-full text-left grid grid-cols-12 gap-2 items-center px-4 py-3.5 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#edf2f9] border-l-4 border-l-[#0f2c56]"
                      : "hover:bg-slate-50 border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="col-span-5 min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold text-[#0f2c56] truncate">
                      {cand.codeName}
                    </p>
                  </div>
                  <div className="col-span-4 min-w-0">
                    <p className="text-xs font-semibold text-slate-600 truncate">
                      {cand.roleApplied}
                    </p>
                  </div>
                  <div className="col-span-3 flex items-center justify-end gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#0f2c56] text-white text-[10px] font-bold">
                      {cand.atsScore}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize text-white ${
                        cand.status === "shortlisted"
                          ? "bg-emerald-600"
                          : cand.status === "rejected"
                          ? "bg-[#ce2731]"
                          : cand.status === "reviewed"
                          ? "bg-[#0f2c56]"
                          : "bg-slate-600"
                      }`}
                    >
                      {cand.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Side Detail Panel Card */}
        {selected && (
          <aside className="w-full lg:w-80 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold">
                  Skor ATS {selected.atsScore}/100
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize text-white ${
                    selected.status === "shortlisted"
                      ? "bg-emerald-600"
                      : selected.status === "rejected"
                      ? "bg-[#ce2731]"
                      : selected.status === "reviewed"
                      ? "bg-[#0f2c56]"
                      : "bg-slate-600"
                  }`}
                >
                  {selected.status}
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0f2c56]">
                  {selected.codeName}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {selected.roleApplied}
                </p>
              </div>
              <div className="rounded-xl bg-[#f4f7fb] p-3.5 space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  Ringkasan Kecocokan AI
                </p>
                <p className="text-xs text-[#0f2c56] leading-relaxed">
                  {selected.matchReason}
                </p>
              </div>

              {selected.candidateSummary && (
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
                      Isi CV &amp; Profil di Sistem
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-[#edf2f9] text-[#0f2c56] text-[10px] font-bold">
                      {selected.candidateSummary.cvSource === "onboarding"
                        ? "CV Onboarding"
                        : "CV Unggahan"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#0f2c56]">
                    {selected.candidateSummary.headline}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {selected.candidateSummary.education}
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {selected.candidateSummary.experienceHighlight}
                  </p>
                  {selected.candidateSummary.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {selected.candidateSummary.skills.slice(0, 5).map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-full bg-[#0f2c56] text-white text-[10px] font-bold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Ubah Status Pelamar
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "reviewed")}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] font-bold text-white bg-[#0f2c56] hover:bg-[#1a3f75] transition-colors cursor-pointer ${
                    selected.status === "reviewed" ? "ring-2 ring-offset-1 ring-[#0f2c56]" : ""
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Tinjau</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "shortlisted")}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer ${
                    selected.status === "shortlisted" ? "ring-2 ring-offset-1 ring-emerald-600" : ""
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Shortlist</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "rejected")}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] font-bold text-white bg-[#ce2731] hover:bg-[#a81e27] transition-colors cursor-pointer ${
                    selected.status === "rejected" ? "ring-2 ring-offset-1 ring-[#ce2731]" : ""
                  }`}
                >
                  <XCircle className="w-3 h-3" />
                  <span>Tolak</span>
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}

export function CompanyProfileSubpage() {
  const [companyName, setCompanyName] = useState("PT Nusantara Inovasi");
  const [industry, setIndustry] = useState("Teknologi Informasi & Produk Digital");
  const [website, setWebsite] = useState("https://nusantara.co.id");
  const [city, setCity] = useState("Jakarta Selatan (Hybrid)");
  const [keywords, setKeywords] = useState(
    "React, Next.js, TypeScript, Tailwind CSS, REST API"
  );
  const [description, setDescription] = useState(
    "Perusahaan teknologi yang berfokus pada pengembangan talenta digital dan solusi perangkat lunak modern di Indonesia."
  );
  const [saved, setSaved] = useState(false);

  const keywordList = keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  useEffect(() => {
    api
      .getCompanyProfile<{
        companyName?: string;
        industry?: string;
        website?: string;
        city?: string;
        keywords?: string;
        description?: string;
      }>()
      .then((res) => {
        if (!res) return;
        if (res.companyName) setCompanyName(res.companyName);
        if (res.industry) setIndustry(res.industry);
        if (res.website) setWebsite(res.website);
        if (res.city) setCity(res.city);
        if (res.keywords) setKeywords(res.keywords);
        if (res.description) setDescription(res.description);
      })
      .catch(() => {});
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .updateCompanyProfile({
        companyName,
        industry,
        website,
        city,
        keywords,
        description,
      })
      .catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="min-h-full lg:h-full lg:min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4 lg:overflow-hidden">
      <DashboardPageHeading
        badge="Profil Mitra"
        titleLine1="Identitas perusahaan"
        titleLine2Prefix="untuk pencocokan"
        titleHighlight="talenta akurat!"
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch overflow-y-auto lg:overflow-hidden scrollbar-none">
        <form
          onSubmit={handleSave}
          className="xl:col-span-8 h-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs"
        >
          <div className="flex-1 min-h-0 flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#0f2c56]">{companyName}</p>
                <p className="text-xs text-slate-500">Mitra Rekrutmen Terverifikasi</p>
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Bidang Industri
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Website Perusahaan
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Lokasi Kantor Utama
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Kata Kunci Pencocokan (Keywords)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Pisahkan dengan koma, misal: React, TypeScript, Node.js"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase shrink-0">
                  Deskripsi Singkat Perusahaan
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 min-h-[96px] w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] leading-relaxed focus:outline-none focus:border-[#0f2c56] resize-none"
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-between pt-3 border-t border-slate-100">
            {saved ? (
              <span className="text-xs font-bold text-emerald-700">
                Perubahan profil perusahaan tersimpan.
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Data ini tampil pada kartu lowongan mitra.
              </span>
            )}
            <button
              type="submit"
              className="morph-pill px-5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold cursor-pointer"
            >
              Simpan Profil
            </button>
          </div>
        </form>

        <aside className="xl:col-span-4 h-full flex flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase">
                  Terverifikasi Admin
                </span>
                <span className="text-[11px] font-bold text-slate-400">Pratinjau Portal</span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0f2c56]">{companyName}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{industry}</p>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ce2731] shrink-0" />
                  <span>{city}</span>
                </p>
                <p className="text-[11px] font-semibold text-[#0f2c56] truncate">{website}</p>
              </div>
              <div className="rounded-xl bg-[#f4f7fb] p-3.5 text-xs text-slate-600 leading-relaxed">
                {description}
              </div>
              {keywordList.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {keywordList.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-full bg-[#edf2f9] text-[#0f2c56] text-[10px] font-bold"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Status Audit &amp; Kepatuhan
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="rounded-xl bg-[#edf2f9] px-3 py-2 text-[#0f2c56]">
                  NIB &amp; NPWP Valid
                </div>
                <div className="rounded-xl bg-[#0f2c56] px-3 py-2 text-white">
                  Blind Screening On
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl bg-[#0f2c56] text-white p-5 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ce2731]" />
              <p className="text-xs font-extrabold uppercase tracking-wider">
                Standar Rekrutmen UU PDP
              </p>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Identitas pelamar ditampilkan dalam format kode ATS terenkripsi selama proses seleksi berlangsung.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

interface PartnerMonitoringRecord {
  id: string;
  company: string;
  sector: string;
  location: string;
  status: "verified" | "pending" | "incomplete";
  legalityDoc: string;
  pdpCompliance: string;
  note: string;
}

const MONITORED_COMPANY_APPLICATIONS: PartnerMonitoringRecord[] = [
  {
    id: "pm-1",
    company: "PT Nusantara Inovasi",
    sector: "Teknologi & Cloud",
    location: "Jakarta Selatan",
    status: "verified",
    legalityDoc: "NIB & NPWP Terverifikasi",
    pdpCompliance: "Blind Screening Aktif",
    note: "Memenuhi seluruh standar kemitraan Pasbana dan siap mengelola rekrutmen secara mandiri.",
  },
  {
    id: "pm-2",
    company: "Studio Karya Digital",
    sector: "Produk & Desain",
    location: "Bandung",
    status: "pending",
    legalityDoc: "Menunggu Verifikasi NIB",
    pdpCompliance: "Persetujuan UU PDP Tercatat",
    note: "Pengajuan kemitraan baru sedang dipantau kelengkapan legalitas dan kesiapan standarnya.",
  },
  {
    id: "pm-3",
    company: "CV Sentosa Abadi",
    sector: "Operasional & Jasa",
    location: "Surabaya",
    status: "incomplete",
    legalityDoc: "NPWP Perlu Pembaruan",
    pdpCompliance: "Belum Mengaktifkan Blind Screening",
    note: "Belum memenuhi ambang standar kemitraan platform sebelum dapat bergabung sebagai mitra resmi.",
  },
];

export function AdminModerationSubpage() {
  const [items, setItems] = useState<PartnerMonitoringRecord[]>(
    MONITORED_COMPANY_APPLICATIONS
  );
  const [selectedId, setSelectedId] = useState<string>(MONITORED_COMPANY_APPLICATIONS[0].id);

  useEffect(() => {
    api
      .getAdminPartners<PartnerMonitoringRecord[]>()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setItems(res);
          setSelectedId(res[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const setAuditStatus = (
    id: string,
    status: PartnerMonitoringRecord["status"]
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status } : it))
    );
    api
      .auditAdminPartner<PartnerMonitoringRecord>(id, { status })
      .then((updated) => {
        if (updated && updated.id) {
          setItems((prev) =>
            prev.map((it) => (it.id === id ? updated : it))
          );
        }
      })
      .catch(() => {});
  };

  const selected = items.find((it) => it.id === selectedId) || items[0];

  return (
    <main className="min-h-full lg:h-full lg:min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4 lg:overflow-hidden">
      <DashboardPageHeading
        badge="Audit & Verifikasi Mitra (FR-50)"
        titleLine1="Audit & verifikasi"
        titleLine2Prefix="pendaftaran company"
        titleHighlight="calon mitra!"
      />

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:overflow-hidden">
        {/* Tabel List Ringkas (Tanpa Kolom Aksi) */}
        <div className="flex-1 min-h-[260px] lg:min-h-0 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="shrink-0 grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <span className="col-span-5">Perusahaan</span>
            <span className="col-span-4">Sektor &amp; Lokasi</span>
            <span className="col-span-3 text-right">Status Audit</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none divide-y divide-slate-100">
            {items.map((item) => {
              const isSelected = selected?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left grid grid-cols-12 gap-2 items-center px-4 py-3.5 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#edf2f9] border-l-4 border-l-[#0f2c56]"
                      : "hover:bg-slate-50 border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="col-span-5 min-w-0 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-[#0f2c56] shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold text-[#0f2c56] truncate">
                      {item.company}
                    </span>
                  </div>
                  <div className="col-span-4 min-w-0">
                    <span className="text-xs text-slate-500 truncate block">
                      {item.sector} &middot; {item.location}
                    </span>
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white ${
                        item.status === "verified"
                          ? "bg-emerald-600"
                          : item.status === "incomplete"
                          ? "bg-[#ce2731]"
                          : "bg-amber-600"
                      }`}
                    >
                      {item.status === "verified"
                        ? "Terverifikasi"
                        : item.status === "incomplete"
                        ? "Perlu Kelengkapan"
                        : "Dalam Audit"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Side Detail Panel Card */}
        {selected && (
          <aside className="w-full lg:w-80 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs">
            <div className="space-y-3">
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white ${
                  selected.status === "verified"
                    ? "bg-emerald-600"
                    : selected.status === "incomplete"
                    ? "bg-[#ce2731]"
                    : "bg-amber-600"
                }`}
              >
                {selected.status === "verified"
                  ? "Mitra Terverifikasi"
                  : selected.status === "incomplete"
                  ? "Perlu Kelengkapan Dokumen"
                  : "Menunggu Audit Admin"}
              </span>
              <div>
                <h3 className="text-base font-extrabold text-[#0f2c56]">
                  {selected.company}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {selected.sector} &middot; {selected.location}
                </p>
              </div>
              <div className="space-y-2 rounded-xl bg-[#f4f7fb] p-3.5 text-xs text-slate-600">
                <p>
                  <strong className="text-[#0f2c56]">Audit Legalitas:</strong> {selected.legalityDoc}
                </p>
                <p>
                  <strong className="text-[#0f2c56]">Kepatuhan PDP:</strong> {selected.pdpCompliance}
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{selected.note}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Keputusan Audit &amp; Verifikasi
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAuditStatus(selected.id, "verified")}
                  className="px-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Verifikasi
                </button>
                <button
                  type="button"
                  onClick={() => setAuditStatus(selected.id, "pending")}
                  className="px-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Audit
                </button>
                <button
                  type="button"
                  onClick={() => setAuditStatus(selected.id, "incomplete")}
                  className="px-2 py-2 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Lengkapi
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}

export function AdminAuditSubpage() {
  const [minAtsScore, setMinAtsScore] = useState<number>(75);
  const [maxCvSizeMb, setMaxCvSizeMb] = useState<number>(5);
  const [slaSeconds, setSlaSeconds] = useState<number>(60);
  const [allowedFormat, setAllowedFormat] = useState<"pdf_docx" | "pdf_only">("pdf_docx");
  const [blindScreeningRequired, setBlindScreeningRequired] = useState<boolean>(true);
  const [requireFullLegality, setRequireFullLegality] = useState<boolean>(true);
  const [retentionDays, setRetentionDays] = useState<string>("90");
  const [savedStandard, setSavedStandard] = useState<boolean>(false);
  const [aggCounts, setAggCounts] = useState({
    totalJobseekers: 1248,
    totalPartnerCompanies: 24,
    pendingCompanyAudits: 3,
  });

  useEffect(() => {
    api
      .getAdminOverview<{
        totalJobseekers?: number;
        totalPartnerCompanies?: number;
        pendingCompanyAudits?: number;
      }>()
      .then((ov) => {
        if (!ov) return;
        setAggCounts((prev) => ({
          totalJobseekers: ov.totalJobseekers ?? prev.totalJobseekers,
          totalPartnerCompanies:
            ov.totalPartnerCompanies ?? prev.totalPartnerCompanies,
          pendingCompanyAudits:
            ov.pendingCompanyAudits ?? prev.pendingCompanyAudits,
        }));
      })
      .catch(() => {});

    api
      .getAdminStandards<{
        minAtsScore?: number;
        maxCvSizeMb?: number;
        slaSeconds?: number;
        allowedFormat?: "pdf_docx" | "pdf_only";
        blindScreeningRequired?: boolean;
        requireFullLegality?: boolean;
        retentionDays?: string;
      }>()
      .then((std) => {
        if (!std) return;
        if (typeof std.minAtsScore === "number") setMinAtsScore(std.minAtsScore);
        if (typeof std.maxCvSizeMb === "number") setMaxCvSizeMb(std.maxCvSizeMb);
        if (typeof std.slaSeconds === "number") setSlaSeconds(std.slaSeconds);
        if (std.allowedFormat) setAllowedFormat(std.allowedFormat);
        if (typeof std.blindScreeningRequired === "boolean") {
          setBlindScreeningRequired(std.blindScreeningRequired);
        }
        if (typeof std.requireFullLegality === "boolean") {
          setRequireFullLegality(std.requireFullLegality);
        }
        if (std.retentionDays) setRetentionDays(std.retentionDays);
      })
      .catch(() => {});
  }, []);

  const ecosystemStats = [
    {
      id: "s1",
      metric: "Total Jobseeker Terdaftar",
      value: `${aggCounts.totalJobseekers.toLocaleString("id-ID")} Akun`,
      note: "Data agregat pencari kerja aktif di platform",
      icon: Users,
    },
    {
      id: "s2",
      metric: "Company Bekerja Sama",
      value: `${aggCounts.totalPartnerCompanies} Perusahaan`,
      note: "Mitra terverifikasi yang memenuhi standar platform",
      icon: Building2,
    },
    {
      id: "s3",
      metric: "Calon Mitra Dalam Audit",
      value: `${aggCounts.pendingCompanyAudits} Pengajuan`,
      note: "Menunggu audit legalitas & kepatuhan standar PDP",
      icon: ShieldCheck,
    },
  ];

  const standardRules = [
    {
      id: "r1",
      title: "Verifikasi Legalitas Usaha (NIB & NPWP)",
      desc: "Wajib diaudit Admin sebelum perusahaan mendapat akses kemitraan.",
      status: requireFullLegality ? "Wajib Penuh" : "NIB Saja",
    },
    {
      id: "r2",
      title: "Kebijakan Blind Screening Anti-Bias",
      desc: "Identitas sensitif pelamar (usia, gender, agama, foto) disembunyikan otomatis.",
      status: blindScreeningRequired ? "Wajib Aktif" : "Opsional",
    },
    {
      id: "r3",
      title: "Validasi Dokumen Berbasis Teks Digital",
      desc: "Berkas CV hasil foto/scan otomatis ditolak sistem agar parsing AI akurat.",
      status: `Maks ${maxCvSizeMb} MB`,
    },
    {
      id: "r4",
      title: "Ambang Kelayakan Skor ATS & SLA AI",
      desc: "Standar evaluasi kualitas CV kandidat serta batas waktu pemrosesan asinkron.",
      status: `Skor >= ${minAtsScore} / ${slaSeconds}d`,
    },
  ];

  const handleReset = () => {
    setMinAtsScore(75);
    setMaxCvSizeMb(5);
    setSlaSeconds(60);
    setAllowedFormat("pdf_docx");
    setBlindScreeningRequired(true);
    setRequireFullLegality(true);
    setRetentionDays("90");
    setSavedStandard(false);
  };

  return (
    <main className="min-h-full lg:h-full lg:min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4 lg:overflow-hidden">
      <DashboardPageHeading
        badge="Standarisasi Platform (FR-51)"
        titleLine1="Tetapkan standarisasi"
        titleLine2Prefix="dan pantau agregat"
        titleHighlight="ekosistem Pasbana!"
      />

      <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto lg:overflow-hidden scrollbar-none">
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
        {ecosystemStats.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className="morph-surface rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-500">{a.metric}</p>
              <p className="text-2xl font-black text-[#0f2c56]">{a.value}</p>
              <p className="text-xs text-slate-500">{a.note}</p>
            </div>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            api
              .updateAdminStandards({
                minAtsScore,
                maxCvSizeMb,
                slaSeconds,
                allowedFormat,
                blindScreeningRequired,
                requireFullLegality,
                retentionDays,
              })
              .catch(() => {});
            setSavedStandard(true);
          }}
          className="xl:col-span-7 h-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <p className="text-xs font-extrabold text-[#0f2c56] uppercase tracking-wider">
                Parameter Standarisasi Global Platform
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Aturan baku untuk evaluasi CV kandidat dan syarat audit pendaftaran company.
              </p>
            </div>
            {savedStandard && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Standar Disimpan</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
              1. Standar Dokumen &amp; Evaluasi ATS
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase text-slate-500">
                  Ambang Skor Minimum ATS
                </span>
                <input
                  type="number"
                  min={50}
                  max={95}
                  value={minAtsScore}
                  onChange={(e) => {
                    setMinAtsScore(Number(e.target.value));
                    setSavedStandard(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-[#0f2c56]"
                />
                <span className="block text-[11px] text-slate-400">
                  Batas minimal kelayakan CV standar ATS (50 - 95).
                </span>
              </label>

              <label className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase text-slate-500">
                  Batas Ukuran CV (MB)
                </span>
                <input
                  type="number"
                  min={2}
                  max={15}
                  value={maxCvSizeMb}
                  onChange={(e) => {
                    setMaxCvSizeMb(Number(e.target.value));
                    setSavedStandard(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-[#0f2c56]"
                />
                <span className="block text-[11px] text-slate-400">
                  Ukuran berkas maksimal saat jobseeker mengunggah CV.
                </span>
              </label>

              <label className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase text-slate-500">
                  Format Dokumen Diizinkan
                </span>
                <select
                  value={allowedFormat}
                  onChange={(e) => {
                    setAllowedFormat(e.target.value as "pdf_docx" | "pdf_only");
                    setSavedStandard(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-[#0f2c56]"
                >
                  <option value="pdf_docx">PDF &amp; DOCX Teks Digital</option>
                  <option value="pdf_only">PDF Teks Digital Saja</option>
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase text-slate-500">
                  Target SLA Analisis AI (Detik)
                </span>
                <input
                  type="number"
                  min={15}
                  max={120}
                  value={slaSeconds}
                  onChange={(e) => {
                    setSlaSeconds(Number(e.target.value));
                    setSavedStandard(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold text-[#0f2c56]"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
              2. Standar Audit Kemitraan &amp; UU PDP
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase text-slate-500">
                  Blind Screening PDP
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBlindScreeningRequired((prev) => !prev);
                    setSavedStandard(false);
                  }}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-left transition-colors cursor-pointer ${
                    blindScreeningRequired
                      ? "bg-[#0f2c56] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {blindScreeningRequired ? "Wajib Semua Mitra" : "Opsional"}
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase text-slate-500">
                  Syarat Legalitas Company
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRequireFullLegality((prev) => !prev);
                    setSavedStandard(false);
                  }}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-left transition-colors cursor-pointer ${
                    requireFullLegality
                      ? "bg-[#0f2c56] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {requireFullLegality ? "Wajib NIB + NPWP" : "NIB Saja"}
                </button>
              </div>

              <label className="space-y-1.5">
                <span className="block text-[11px] font-bold uppercase text-slate-500">
                  Retensi Data CV
                </span>
                <select
                  value={retentionDays}
                  onChange={(e) => {
                    setRetentionDays(e.target.value);
                    setSavedStandard(false);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-[#0f2c56]"
                >
                  <option value="90">90 Hari Tidak Aktif</option>
                  <option value="180">180 Hari Tidak Aktif</option>
                  <option value="manual">Sesuai Permintaan User</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer"
            >
              Reset Default
            </button>
            <button
              type="submit"
              className="morph-pill px-5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold cursor-pointer"
            >
              Simpan Standarisasi
            </button>
          </div>
        </form>

        <div className="xl:col-span-5 h-full flex flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold text-[#0f2c56] uppercase tracking-wider">
                  Standar Wajib Calon Mitra
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Acuan audit saat Admin memverifikasi pendaftaran company.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#edf2f9] text-[#0f2c56] text-[11px] font-bold">
                4 Aturan Aktif
              </span>
            </div>

            <div className="space-y-2.5">
              {standardRules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xl border border-slate-200 bg-[#f8fafd] p-3.5 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-extrabold text-[#0f2c56]">{rule.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{rule.desc}</p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[#0f2c56] text-[10px] font-extrabold">
                    {rule.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#0f2c56] text-white p-5 space-y-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ce2731]" />
              <p className="text-xs font-extrabold uppercase tracking-wider">
                Batasan Wewenang Standarisasi
              </p>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              Admin menetapkan standar global dan mengaudit legalitas pendaftaran company, tanpa masuk ke pengelolaan lowongan atau proses seleksi kandidat di dalam perusahaan.
            </p>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

export function AdminReportSubpage() {
  const [period, setPeriod] = useState<"bulan" | "kuartal" | "tahun">("bulan");
  const [reportCounts, setReportCounts] = useState({
    totalJobseekers: 1248,
    totalPartnerCompanies: 24,
    totalPartnerAudits: 27,
    pdpAnonymizationRate: 100,
  });

  useEffect(() => {
    api
      .getAdminReport<{
        totalJobseekers?: number;
        totalPartnerCompanies?: number;
        totalPartnerAudits?: number;
        pdpAnonymizationRate?: number;
      }>(period)
      .then((rep) => {
        if (!rep) return;
        setReportCounts((prev) => ({
          totalJobseekers: rep.totalJobseekers ?? prev.totalJobseekers,
          totalPartnerCompanies:
            rep.totalPartnerCompanies ?? prev.totalPartnerCompanies,
          totalPartnerAudits:
            rep.totalPartnerAudits ?? prev.totalPartnerAudits,
          pdpAnonymizationRate:
            rep.pdpAnonymizationRate ?? prev.pdpAnonymizationRate,
        }));
      })
      .catch(() => {});
  }, [period]);

  const periodLabel =
    period === "bulan"
      ? "November 2026"
      : period === "kuartal"
      ? "Q4 2026 (Okt - Des)"
      : "Tahun Penuh 2026";

  const summaryCards = [
    {
      id: "r1",
      title: "Total Jobseeker Terdaftar",
      value: `${reportCounts.totalJobseekers.toLocaleString("id-ID")} Akun`,
      note: "+14% pertumbuhan agregat dibanding periode lalu",
      icon: Users,
      accent: "text-[#0f2c56]",
    },
    {
      id: "r2",
      title: "Company Bekerja Sama",
      value: `${reportCounts.totalPartnerCompanies} Perusahaan`,
      note: "Seluruh mitra lulus audit legalitas NIB & NPWP",
      icon: Building2,
      accent: "text-[#0f2c56]",
    },
    {
      id: "r3",
      title: "Audit Pendaftaran Company",
      value: `${reportCounts.totalPartnerAudits} Pengajuan`,
      note: "24 Terverifikasi · 3 Dalam antrean audit Admin",
      icon: FileCheck,
      accent: "text-[#0f2c56]",
    },
    {
      id: "r4",
      title: "Kepatuhan Privasi UU PDP",
      value: "100% Anonimisasi",
      note: "Kode ATS terenkripsi & blind screening aktif",
      icon: ShieldCheck,
      accent: "text-[#ce2731]",
    },
  ];

  const monthlyBreakdown = [
    { month: "Juni 2026", jobseekers: 820, companies: 14, auditPassRate: "93%" },
    { month: "Juli 2026", jobseekers: 910, companies: 16, auditPassRate: "94%" },
    { month: "Agustus 2026", jobseekers: 985, companies: 18, auditPassRate: "95%" },
    { month: "September 2026", jobseekers: 1070, companies: 20, auditPassRate: "96%" },
    { month: "Oktober 2026", jobseekers: 1160, companies: 22, auditPassRate: "98%" },
    { month: "November 2026", jobseekers: 1248, companies: 24, auditPassRate: "100%" },
  ];

  const complianceMetrics = [
    { label: "Kelengkapan Legalitas Mitra (NIB & NPWP)", value: "24 / 24", pct: 100, color: "#0f2c56" },
    { label: "Kepatuhan Blind Screening Anti-Bias", value: "24 / 24", pct: 100, color: "#0f2c56" },
    { label: "Dokumen CV Memenuhi Standar ATS (>= 75)", value: "1.023 / 1.248", pct: 82, color: "#ce2731" },
  ];

  return (
    <main className="min-h-full lg:h-full lg:min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4 lg:overflow-hidden">
      <DashboardPageHeading
        badge="Laporan Eksekutif"
        titleLine1="Ringkasan kepatuhan"
        titleLine2Prefix="dan performa"
        titleHighlight="ekosistem Pasbana!"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
              {[
                { key: "bulan", label: "Bulan Ini" },
                { key: "kuartal", label: "Kuartal" },
                { key: "tahun", label: "2026" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setPeriod(opt.key as "bulan" | "kuartal" | "tahun")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    period === opt.key
                      ? "bg-[#0f2c56] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="morph-pill inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        }
      />

      <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto lg:overflow-hidden scrollbar-none">
      <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="morph-surface rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs"
            >
              <div className={`flex items-center gap-2 ${card.accent}`}>
                <Icon className="w-4 h-4" />
                <span className="text-xs font-extrabold uppercase">{card.title}</span>
              </div>
              <p className="text-2xl font-black text-[#0f2c56]">{card.value}</p>
              <p className="text-xs text-slate-500">{card.note}</p>
            </div>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-7 h-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0f2c56]">
                Rekap Pertumbuhan Agregat &amp; Kemitraan
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Periode aktif: {periodLabel} (tanpa data individu/internal perusahaan)
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#edf2f9] text-[#0f2c56] text-[11px] font-bold">
              6 Bulan Terakhir
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[440px]">
              <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <span className="col-span-4">Periode</span>
                <span className="col-span-3 text-right">Jobseeker</span>
                <span className="col-span-3 text-right">Company Mitra</span>
                <span className="col-span-2 text-right">Patuh</span>
              </div>

              <div className="flex-1 divide-y divide-slate-100">
                {monthlyBreakdown.map((row) => (
                  <div
                    key={row.month}
                    className="grid grid-cols-12 gap-2 px-5 py-3.5 text-xs items-center"
                  >
                    <span className="col-span-4 font-bold text-[#0f2c56]">{row.month}</span>
                    <span className="col-span-3 text-right font-semibold text-slate-700">
                      {row.jobseekers.toLocaleString("id-ID")}
                    </span>
                    <span className="col-span-3 text-right font-semibold text-slate-700">
                      {row.companies} Perusahaan
                    </span>
                    <span className="col-span-2 text-right font-extrabold text-[#0f2c56]">
                      {row.auditPassRate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 bg-[#f4f7fb] border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-600">
              Pertumbuhan 6 Bulan: <strong className="text-[#0f2c56]">+428 Jobseeker (+52%)</strong>
            </span>
            <span className="font-bold text-[#ce2731]">
              +10 Company Mitra Terverifikasi
            </span>
          </div>
        </div>

        <div className="xl:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-xs">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#0f2c56]">
                Ringkasan Kepatuhan Standar Ekosistem
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi kepatuhan mitra terhadap standarisasi platform dan UU PDP.
              </p>
            </div>

            <div className="space-y-4">
              {complianceMetrics.map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold">
                    <span className="text-slate-700">{m.label}</span>
                    <span className="text-[#0f2c56] shrink-0">
                      {m.value} ({m.pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#edf2f9] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#f4f7fb] p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-[#0f2c56]">
              <Clock className="w-3.5 h-3.5" />
              <p className="text-[11px] font-extrabold uppercase tracking-wider">
                Catatan Audit Periode {periodLabel}
              </p>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seluruh 24 company mitra aktif telah terverifikasi legalitasnya dan menerapkan mode blind screening secara penuh. Tiga pengajuan company baru sedang berada dalam antrean audit Admin.
            </p>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

