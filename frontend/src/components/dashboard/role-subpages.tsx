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
          className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-xs"
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
            className="morph-surface rounded-2xl border border-slate-200/80 bg-white p-5 flex flex-col justify-between gap-4 shadow-xs"
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

  const updateStatus = (id: string, status: ApplicantStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  };

  const visible =
    filter === "all" ? candidates : candidates.filter((c) => c.status === filter);

  return (
    <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-5">
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

      <div className="space-y-3">
        {visible.map((cand) => (
          <div
            key={cand.id}
            className="morph-surface rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-extrabold text-[#0f2c56]">
                  {cand.codeName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0f2c56]/10 text-[#0f2c56] text-[11px] font-bold">
                  Skor ATS: {cand.atsScore}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                  {cand.roleApplied}
                </span>
              </div>
              <p className="text-xs text-slate-600">{cand.matchReason}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => updateStatus(cand.id, "reviewed")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer ${
                  cand.status === "reviewed"
                    ? "bg-[#0f2c56] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Tinjau</span>
              </button>
              <button
                type="button"
                onClick={() => updateStatus(cand.id, "shortlisted")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer ${
                  cand.status === "shortlisted"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Shortlist</span>
              </button>
              <button
                type="button"
                onClick={() => updateStatus(cand.id, "rejected")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer ${
                  cand.status === "rejected"
                    ? "bg-[#ce2731] text-white"
                    : "bg-red-50 text-[#ce2731] hover:bg-red-100"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Tolak</span>
              </button>
            </div>
          </div>
        ))}
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
        className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 space-y-4 max-w-3xl shadow-xs"
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

interface AdminJobModeration {
  id: string;
  company: string;
  title: string;
  status: "approved" | "pending" | "rejected" | "disabled";
}

const INITIAL_ADMIN_JOBS: AdminJobModeration[] = [
  { id: "m-1", company: "PT Nusantara Inovasi", title: "Junior Frontend Developer", status: "approved" },
  { id: "m-2", company: "Studio Karya Digital", title: "UI/UX Product Designer", status: "pending" },
  { id: "m-3", company: "CV Sentosa Abadi", title: "Admin Operasional Magang", status: "rejected" },
];

export function AdminModerationSubpage() {
  const [items, setItems] = useState<AdminJobModeration[]>(INITIAL_ADMIN_JOBS);

  const setStatus = (id: string, status: AdminJobModeration["status"]) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
  };

  return (
    <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-5">
      <DashboardPageHeading
        badge="Moderasi Platform (FR-50)"
        titleLine1="Verifikasi lowongan mitra"
        titleLine2Prefix="demi keamanan"
        titleHighlight="pencari kerja!"
      />

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="morph-surface rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0f2c56]" />
                <span className="text-sm font-extrabold text-[#0f2c56]">
                  {item.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    item.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "rejected"
                      ? "bg-red-50 text-[#ce2731]"
                      : item.status === "disabled"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.status === "approved"
                    ? "Disetujui (Embedding Aktif)"
                    : item.status === "rejected"
                    ? "Ditolak (Perlu Revisi)"
                    : item.status === "disabled"
                    ? "Dinonaktifkan"
                    : "Menunggu Review"}
                </span>
              </div>
              <p className="text-xs text-slate-500">Mitra: {item.company}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus(item.id, "approved")}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Setujui
              </button>
              <button
                type="button"
                onClick={() => setStatus(item.id, "rejected")}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Tolak / Revisi
              </button>
              <button
                type="button"
                onClick={() => setStatus(item.id, "disabled")}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-[#ce2731] hover:text-white text-[#ce2731] text-[11px] font-bold transition-colors cursor-pointer"
              >
                Nonaktifkan
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

interface ManagedAccount {
  id: string;
  name: string;
  email: string;
  role: "user" | "company";
  active: boolean;
}

const INITIAL_ACCOUNTS: ManagedAccount[] = [
  { id: "u-1", name: "Wira Fikri Ramadanu", email: "wira@student.unp.ac.id", role: "user", active: true },
  { id: "u-2", name: "PT Nusantara Inovasi", email: "hr@nusantara.co.id", role: "company", active: true },
  { id: "u-3", name: "CV Sentosa Abadi", email: "rekrutmen@sentosa.id", role: "company", active: false },
];

export function AdminAuditSubpage() {
  const [accounts, setAccounts] = useState<ManagedAccount[]>(INITIAL_ACCOUNTS);

  const toggleAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, active: !acc.active } : acc))
    );
  };

  const audits = [
    { id: "a1", metric: "Rata-rata Skor ATS Platform", value: "82.4 / 100", note: "Stabil dalam 7 hari terakhir" },
    { id: "a2", metric: "Total Evaluasi CV Selesai", value: "1.248 berkas", note: "94% diproses di bawah 60 detik (G1)" },
    { id: "a3", metric: "Anomali Parsing Terdeteksi", value: "3 berkas", note: "PDF hasil scan / non-teks (FR-11)" },
  ];

  return (
    <main className="min-h-full w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-5 sm:pb-6 space-y-5">
      <DashboardPageHeading
        badge="Pengguna & Audit (FR-51)"
        titleLine1="Kelola akun pengguna"
        titleLine2Prefix="dan pantau kualitas"
        titleHighlight="sistem ATS!"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {audits.map((a) => (
          <div
            key={a.id}
            className="morph-surface rounded-2xl border border-slate-200/80 bg-white p-5 space-y-2 shadow-xs"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0f2c56]/10 text-[#0f2c56] flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-500">{a.metric}</p>
            <p className="text-2xl font-black text-[#0f2c56]">{a.value}</p>
            <p className="text-xs text-slate-500">{a.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
        <p className="text-xs font-extrabold text-[#0f2c56] uppercase tracking-wider">
          Manajemen Akun &amp; Status Aktivasi
        </p>
        <div className="space-y-2.5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#0f2c56]">{acc.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold uppercase text-slate-600">
                    {acc.role === "company" ? "Employer" : "Pencari Kerja"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{acc.email}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleAccount(acc.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                  acc.active
                    ? "bg-red-50 hover:bg-[#ce2731] hover:text-white text-[#ce2731]"
                    : "bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700"
                }`}
              >
                {acc.active ? "Nonaktifkan Akun" : "Aktifkan Kembali"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#ce2731] shrink-0" />
          <div>
            <p className="text-xs sm:text-sm font-extrabold text-[#0f2c56]">
              Pemantauan Pipeline AI &amp; Ekstraksi Teks
            </p>
            <p className="text-xs text-slate-500">
              Seluruh parser PDF/DOCX dan job queue berjalan normal tanpa antrean tertunda.
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-[#0f2c56]">
            <Users className="w-4 h-4" />
            <span className="text-xs font-extrabold uppercase">Pertumbuhan Pengguna</span>
          </div>
          <p className="text-2xl font-black text-[#0f2c56]">3.420 Akun</p>
          <p className="text-xs text-slate-500">
            Mencakup pencari kerja aktif, mitra perusahaan, dan administrator kampus.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-2 shadow-xs">
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

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#0f2c56] shrink-0" />
        <p className="text-xs text-slate-600">
          Gunakan tombol <strong>Cetak Laporan</strong> di kanan atas untuk mengekspor ringkasan periodik dalam format PDF A4.
        </p>
      </div>
    </main>
  );
}

