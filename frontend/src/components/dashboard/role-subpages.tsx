"use client";

import React, { useState } from "react";
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
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";

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
  },
  {
    id: "cand-02",
    codeName: "Kandidat #ATS-7520",
    roleApplied: "UI/UX Product Designer",
    atsScore: 86,
    matchReason: "Struktur pengalaman desain sistem rapi dan metrik konversi jelas.",
    status: "reviewed",
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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setJobs((prev) => [
      {
        id: `job-${Date.now()}`,
        title: title.trim(),
        location: location.trim() || "Indonesia (Remote)",
        type,
        applicants: 0,
        active: true,
      },
      ...prev,
    ]);
    setTitle("");
    setLocation("");
    setShowForm(false);
  };

  const toggleActive = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, active: !j.active } : j))
    );
  };

  return (
    <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-5">
      <DashboardPageHeading
        badge="Manajemen Lowongan"
        titleLine1="Kelola posisi kerja"
        titleLine2Prefix="untuk menjaring"
        titleHighlight="talenta terbaik!"
        rightSlot={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="morph-pill inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showForm ? "Tutup Form" : "Pasang Lowongan"}</span>
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs"
        >
          <p className="text-xs font-extrabold text-[#0f2c56] uppercase tracking-wider">
            Publikasikan Lowongan Baru
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama posisi (misal: Data Analyst)"
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
              required
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lokasi (misal: Jakarta / Remote)"
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
            >
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="morph-pill px-5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold cursor-pointer"
            >
              Simpan &amp; Terbitkan
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="morph-surface rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    job.active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0f2c56] text-[11px] font-bold text-[#0f2c56] transition-colors cursor-pointer"
              >
                {job.active ? "Jeda Lowongan" : "Aktifkan"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export function CompanyCandidatesSubpage() {
  const [candidates, setCandidates] = useState<CompanyCandidateItem[]>(INITIAL_COMPANY_CANDIDATES);
  const [filter, setFilter] = useState<"all" | ApplicantStatus>("all");
  const [selectedId, setSelectedId] = useState<string>(INITIAL_COMPANY_CANDIDATES[0].id);

  const updateStatus = (id: string, status: ApplicantStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const visible =
    filter === "all" ? candidates : candidates.filter((c) => c.status === filter);
  const selected =
    visible.find((c) => c.id === selectedId) || visible[0] || candidates[0];

  return (
    <main className="h-full min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4 lg:overflow-hidden">
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
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
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
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold capitalize">
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
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold capitalize">
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
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Ubah Status Pelamar
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "reviewed")}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] font-bold cursor-pointer ${
                    selected.status === "reviewed"
                      ? "bg-[#0f2c56] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Tinjau</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "shortlisted")}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] font-bold cursor-pointer ${
                    selected.status === "shortlisted"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Shortlist</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, "rejected")}
                  className={`inline-flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-[11px] font-bold cursor-pointer ${
                    selected.status === "rejected"
                      ? "bg-[#ce2731] text-white"
                      : "bg-red-50 text-[#ce2731] hover:bg-red-100"
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
  const [description, setDescription] = useState(
    "Perusahaan teknologi yang berfokus pada pengembangan talenta digital dan solusi perangkat lunak modern di Indonesia."
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-5">
      <DashboardPageHeading
        badge="Profil Mitra"
        titleLine1="Identitas perusahaan"
        titleLine2Prefix="untuk pencocokan"
        titleHighlight="talenta akurat!"
      />

      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 w-full shadow-xs"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#0f2c56]">{companyName}</p>
            <p className="text-xs text-slate-500">Mitra Rekrutmen Terverifikasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              Deskripsi Singkat Perusahaan
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
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
  const [selectedId, setSelectedId] = useState<string>(MONITORED_COMPANY_APPLICATIONS[0].id);

  const selected =
    MONITORED_COMPANY_APPLICATIONS.find((it) => it.id === selectedId) ||
    MONITORED_COMPANY_APPLICATIONS[0];

  return (
    <main className="h-full min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4 lg:overflow-hidden">
      <DashboardPageHeading
        badge="Monitoring Mitra (FR-50)"
        titleLine1="Monitoring pengajuan"
        titleLine2Prefix="kemitraan company"
        titleHighlight="calon mitra!"
      />

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 lg:overflow-hidden">
        {/* Tabel List Ringkas (Read-only Monitoring) */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="shrink-0 grid grid-cols-12 gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            <span className="col-span-5">Perusahaan</span>
            <span className="col-span-4">Sektor &amp; Lokasi</span>
            <span className="col-span-3 text-right">Status Kemitraan</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none divide-y divide-slate-100">
            {MONITORED_COMPANY_APPLICATIONS.map((item) => {
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
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === "verified"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "incomplete"
                          ? "bg-red-50 text-[#ce2731]"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status === "verified"
                        ? "Terverifikasi"
                        : item.status === "incomplete"
                        ? "Perlu Kelengkapan"
                        : "Dipantau"}
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
                className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  selected.status === "verified"
                    ? "bg-emerald-50 text-emerald-700"
                    : selected.status === "incomplete"
                    ? "bg-red-50 text-[#ce2731]"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {selected.status === "verified"
                  ? "Mitra Bekerja Sama"
                  : selected.status === "incomplete"
                  ? "Belum Memenuhi Standar"
                  : "Dalam Pemantauan Pengajuan"}
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
                  <strong className="text-[#0f2c56]">Legalitas:</strong> {selected.legalityDoc}
                </p>
                <p>
                  <strong className="text-[#0f2c56]">Kepatuhan PDP:</strong> {selected.pdpCompliance}
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{selected.note}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Batasan Wewenang Admin
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Admin hanya memantau pemenuhan standar kemitraan company tanpa masuk ke pengelolaan lowongan atau seleksi kandidat perusahaan.
              </p>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}

export function AdminAuditSubpage() {
  const [minAtsScore, setMinAtsScore] = useState<number>(75);
  const [blindScreeningRequired, setBlindScreeningRequired] = useState<boolean>(true);
  const [maxCvSizeMb, setMaxCvSizeMb] = useState<number>(5);
  const [savedStandard, setSavedStandard] = useState<boolean>(false);

  const ecosystemStats = [
    {
      id: "s1",
      metric: "Total Jobseeker Terdaftar",
      value: "1.248 Akun",
      note: "Data agregat pencari kerja aktif di platform",
    },
    {
      id: "s2",
      metric: "Company Bekerja Sama",
      value: "24 Perusahaan",
      note: "Mitra terverifikasi yang memenuhi standar platform",
    },
    {
      id: "s3",
      metric: "Calon Mitra Dipantau",
      value: "3 Pengajuan",
      note: "Sedang dipantau kelengkapan legalitas & standar PDP",
    },
  ];

  return (
    <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-5">
      <DashboardPageHeading
        badge="Standarisasi Platform (FR-51)"
        titleLine1="Tetapkan standarisasi"
        titleLine2Prefix="dan pantau agregat"
        titleHighlight="ekosistem Pasbana!"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ecosystemStats.map((a) => (
          <div
            key={a.id}
            className="morph-surface rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-500">{a.metric}</p>
            <p className="text-2xl font-black text-[#0f2c56]">{a.value}</p>
            <p className="text-xs text-slate-500">{a.note}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSavedStandard(true);
        }}
        className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold text-[#0f2c56] uppercase tracking-wider">
              Parameter Standarisasi Global Platform
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Kebijakan standar yang berlaku untuk seluruh evaluasi CV dan kemitraan company.
            </p>
          </div>
          {savedStandard && (
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
              Standar Disimpan
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          </label>

          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold uppercase text-slate-500">
              Standar Blind Screening PDP
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
              {blindScreeningRequired ? "Wajib Aktif untuk Semua Mitra" : "Opsional"}
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="morph-pill px-5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold cursor-pointer"
          >
            Simpan Standarisasi
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#ce2731] shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-[#0f2c56]">
              Pemantauan Pipeline AI &amp; Ekstraksi Teks
            </p>
            <p className="text-xs text-slate-500">
              Seluruh parser PDF/DOCX dan validasi standar dokumen berjalan normal tanpa kendala.
            </p>
          </div>
        </div>
        <Link
          href="/admin/dashboard"
          className="morph-pill px-4 py-2 rounded-xl bg-[#0f2c56] text-white text-xs font-bold shrink-0"
        >
          Kembali ke Ringkasan
        </Link>
      </div>
    </main>
  );
}

export function AdminReportSubpage() {
  return (
    <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-5">
      <DashboardPageHeading
        badge="Laporan Eksekutif"
        titleLine1="Ringkasan kepatuhan"
        titleLine2Prefix="dan performa"
        titleHighlight="ekosistem Pasbana!"
        rightSlot={
          <button
            type="button"
            onClick={() => window.print()}
            className="morph-pill inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#0f2c56]">
            <Users className="w-4 h-4" />
            <span className="text-xs font-extrabold uppercase">Pertumbuhan Pengguna</span>
          </div>
          <p className="text-2xl font-black text-[#0f2c56]">3.420 Akun</p>
          <p className="text-xs text-slate-500">
            Mencakup pencari kerja aktif, mitra perusahaan, dan administrator kampus.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#ce2731]">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-extrabold uppercase">Kepatuhan Privasi</span>
          </div>
          <p className="text-2xl font-black text-[#0f2c56]">100% Anonimisasi</p>
          <p className="text-xs text-slate-500">
            Data kandidat pada portal perusahaan ditampilkan dengan kode ATS terenkripsi.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#0f2c56] shrink-0" />
        <p className="text-xs text-slate-600">
          Gunakan tombol <strong>Cetak Laporan</strong> di kanan atas untuk mengekspor ringkasan periodik dalam format PDF A4.
        </p>
      </div>
    </main>
  );
}

