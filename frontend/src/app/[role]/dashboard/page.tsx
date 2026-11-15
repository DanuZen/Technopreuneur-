"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Users,
  ShieldCheck,
  ArrowUpRight,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Building2,
  Plus,
} from "lucide-react";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { DashboardPageSkeleton } from "@/components/ui/dashboard-skeleton";
import {
  CompanyFunnelDiagram,
  CompanyTrendDiagram,
  AdminModerationDiagram,
  AdminPipelineDiagram,
} from "@/components/dashboard/dashboard-diagrams";
import { isValidDashboardRole } from "@/lib/routes";

type ApplicantStatus = "submitted" | "reviewed" | "shortlisted" | "rejected";

interface CompanyApplicant {
  id: string;
  codeName: string;
  roleApplied: string;
  atsScore: number;
  matchReason: string;
  status: ApplicantStatus;
}

interface CompanyJobItem {
  id: string;
  title: string;
  location: string;
  type: string;
  applicants: number;
}

const INITIAL_COMPANY_JOBS: CompanyJobItem[] = [
  {
    id: "job-1",
    title: "Junior Frontend Developer",
    location: "Jakarta (Hybrid)",
    type: "Full-time",
    applicants: 14,
  },
  {
    id: "job-2",
    title: "UI/UX Product Designer",
    location: "Remote",
    type: "Full-time",
    applicants: 9,
  },
  {
    id: "job-3",
    title: "Backend Node.js Engineer",
    location: "Bandung (On-site)",
    type: "Contract",
    applicants: 7,
  },
];

const INITIAL_APPLICANTS: CompanyApplicant[] = [
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
];

function CompanyDashboardView() {
  const [jobs, setJobs] = useState<CompanyJobItem[]>(INITIAL_COMPANY_JOBS);
  const [applicants] = useState<CompanyApplicant[]>(INITIAL_APPLICANTS);
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("");

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;
    setJobs((prev) => [
      {
        id: `job-${Date.now()}`,
        title: newJobTitle.trim(),
        location: newJobLocation.trim() || "Indonesia (Remote)",
        type: "Full-time",
        applicants: 0,
      },
      ...prev,
    ]);
    setNewJobTitle("");
    setNewJobLocation("");
    setShowNewJobForm(false);
  };

  const shortlistedCount = applicants.filter((a) => a.status === "shortlisted").length;
  const reviewedCount = applicants.filter((a) => a.status === "reviewed").length;
  const rejectedCount = applicants.filter((a) => a.status === "rejected").length;

  return (
    <main className="h-full min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4">
      <DashboardPageHeading
        badge="Portal Perusahaan"
        titleLine1="Temukan talenta muda"
        titleLine2Prefix="dengan kesiapan"
        titleHighlight="paling sesuai!"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNewJobForm((v) => !v)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pasang Lowongan</span>
            </button>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
            >
              <span>Portal Lowongan</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      {showNewJobForm && (
        <form
          onSubmit={handleAddJob}
          className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row items-stretch sm:items-end gap-3 text-[#0f2c56]"
        >
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold block">Judul Posisi Lowongan</label>
            <input
              type="text"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              placeholder="Contoh: Junior Product Manager"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0f2c56]"
              required
            />
          </div>
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold block">Lokasi / Sistem Kerja</label>
            <input
              type="text"
              value={newJobLocation}
              onChange={(e) => setNewJobLocation(e.target.value)}
              placeholder="Contoh: Jakarta (Hybrid)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0f2c56]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-extrabold transition-colors cursor-pointer shrink-0"
          >
            Publikasikan
          </button>
        </form>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Kolom Kiri: Panel Navy Ringkasan Rekrutmen + Daftar Lowongan Aktif */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="bg-[#0f2c56] text-white rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>AI Blind Screening</span>
              </span>
              <span className="text-xs font-extrabold text-white">Aktif</span>
            </div>

            <div className="flex items-center gap-4">
              <svg
                viewBox="0 0 96 84"
                className="w-20 h-auto shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="6" y="8" width="84" height="68" rx="10" fill="#FFFFFF" />
                <rect x="16" y="18" width="38" height="6" rx="3" fill="#0F2C56" />
                <rect x="16" y="30" width="64" height="4" rx="2" fill="#CBD5E1" />
                <rect x="16" y="38" width="52" height="4" rx="2" fill="#CBD5E1" />
                <rect x="16" y="50" width="28" height="14" rx="7" fill="#CE2731" />
                <rect x="48" y="50" width="32" height="14" rx="7" fill="#EDF2F9" />
              </svg>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight leading-snug text-white">
                  Ringkasan Rekrutmen Perusahaan
                </h2>
                <p className="text-xs text-white mt-1 leading-relaxed">
                  Kandidat diperingkat otomatis berdasarkan kecocokan kompetensi tanpa atribut sensitif.
                </p>
              </div>
            </div>

            <div className="border-t border-white/15 divide-y divide-white/10 text-xs text-white">
              <div className="py-2 flex items-center justify-between gap-3">
                <span>Lowongan Aktif</span>
                <span className="font-bold">{jobs.length} Posisi</span>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <span>Pelamar Terkurasi</span>
                <span className="font-bold">{applicants.length} Kandidat</span>
              </div>
              <div className="pt-2 flex items-center justify-between gap-3">
                <span>Masuk Shortlist</span>
                <span className="font-bold">{shortlistedCount} Kandidat</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex-1 space-y-3 text-[#0f2c56]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-wider">
                Lowongan Aktif Anda
              </p>
            </div>

            <div className="divide-y divide-slate-200/80">
              {jobs.map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold truncate">{job.title}</p>
                    <p className="text-xs truncate">
                      {job.location} &middot; {job.type}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#edf2f9] text-[#0f2c56] text-[11px] font-bold shrink-0">
                    {job.applicants} Pelamar
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Diagram Analitik Rekrutmen */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          <CompanyTrendDiagram />
          <CompanyFunnelDiagram
            totalJobs={jobs.length}
            totalApplicants={applicants.length}
            reviewedCount={reviewedCount}
            shortlistedCount={shortlistedCount}
            rejectedCount={rejectedCount}
          />
        </div>
      </div>
    </main>
  );
}

interface ModerationJob {
  id: string;
  title: string;
  company: string;
  location: string;
  status: "pending" | "approved" | "rejected";
}

const INITIAL_MODERATION_JOBS: ModerationJob[] = [
  {
    id: "mod-1",
    title: "Frontend React Developer",
    company: "PT Teknologi Nusantara",
    location: "Jakarta Selatan",
    status: "pending",
  },
  {
    id: "mod-2",
    title: "Data Analyst Intern",
    company: "Studio Analitik Indonesia",
    location: "Remote",
    status: "pending",
  },
  {
    id: "mod-3",
    title: "Mobile Flutter Engineer",
    company: "Karya Digital Mandiri",
    location: "Yogyakarta",
    status: "approved",
  },
];

function AdminDashboardView() {
  const [moderationList, setModerationList] = useState<ModerationJob[]>(
    INITIAL_MODERATION_JOBS
  );

  const handleModeration = (id: string, status: "approved" | "rejected") => {
    setModerationList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const pendingCount = moderationList.filter((m) => m.status === "pending").length;
  const approvedCount = moderationList.filter((m) => m.status === "approved").length;
  const rejectedCount = moderationList.filter((m) => m.status === "rejected").length;

  return (
    <main className="h-full min-h-0 w-full px-3.5 sm:px-6 pt-1 sm:pt-1.5 pb-4 sm:pb-5 flex flex-col gap-4">
      <DashboardPageHeading
        badge="Panel Administrator"
        titleLine1="Kelola ekosistem karir"
        titleLine2Prefix="secara terpusat &"
        titleHighlight="terukur!"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/user/dashboard/evaluasi"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Pratinjau User</span>
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
            >
              <span>Portal Lowongan</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Kolom Kiri: Panel Navy Ringkasan Platform + Status Pipeline AI */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="bg-[#0f2c56] text-white rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Kendali Platform</span>
              </span>
              <span className="text-xs font-extrabold text-white">Sistem Sehat</span>
            </div>

            <div className="flex items-center gap-4">
              <svg
                viewBox="0 0 96 84"
                className="w-20 h-auto shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="6" y="8" width="84" height="68" rx="10" fill="#FFFFFF" />
                <circle cx="28" cy="30" r="10" fill="#0F2C56" />
                <path
                  d="M24 30L27 33L33 27"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="44" y="24" width="36" height="5" rx="2.5" fill="#0F2C56" />
                <rect x="44" y="33" width="26" height="4" rx="2" fill="#CBD5E1" />
                <rect x="16" y="50" width="64" height="14" rx="7" fill="#EDF2F9" />
                <rect x="16" y="50" width="44" height="14" rx="7" fill="#CE2731" />
              </svg>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight leading-snug text-white">
                  Ringkasan Ekosistem Pasbana AI
                </h2>
                <p className="text-xs text-white mt-1 leading-relaxed">
                  Pantau moderasi lowongan mitra, performa pipeline evaluasi CV, dan kepatuhan UU PDP.
                </p>
              </div>
            </div>

            <div className="border-t border-white/15 divide-y divide-white/10 text-xs text-white">
              <div className="py-2 flex items-center justify-between gap-3">
                <span>Menunggu Moderasi</span>
                <span className="font-bold">{pendingCount} Lowongan</span>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <span>Lowongan Disetujui</span>
                <span className="font-bold">{approvedCount} Lowongan</span>
              </div>
              <div className="pt-2 flex items-center justify-between gap-3">
                <span>Kepatuhan Consent PDP</span>
                <span className="font-bold">100% Aktif</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex-1 space-y-3 text-[#0f2c56]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-wider">
                Status Layanan &amp; Pipeline AI
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="font-bold">Ekstraksi Teks PDF/DOCX</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold">
                  Optimal
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="font-bold">Two-Stage Vector Matching</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold">
                  Optimal
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-bold">Sanitasi PII &amp; Blind Scoring</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold">
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Antrean Moderasi Lowongan Mitra */}
        <div className="xl:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4 text-[#0f2c56]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider">
                    Antrean Moderasi Lowongan
                  </p>
                  <p className="text-xs font-medium">
                    Kurasi lowongan perusahaan sebelum tampil di Portal Lowongan
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-200/80 border-y border-slate-200/80">
              {moderationList.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-extrabold">{item.title}</p>
                    <p className="text-xs font-medium">
                      {item.company} &middot; {item.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleModeration(item.id, "approved")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Setujui</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModeration(item.id, "rejected")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Tolak</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          item.status === "approved" ? "bg-[#0f2c56]" : "bg-[#ce2731]"
                        }`}
                      >
                        {item.status === "approved" ? "Disetujui" : "Ditolak"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs font-medium">
            Lowongan yang disetujui otomatis dibuatkan embedding vektor untuk pencocokan kandidat.
          </p>
        </div>
      </div>

      {/* Baris Diagram Analitik Platform & Pipeline AI */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-5">
          <AdminModerationDiagram
            pendingCount={pendingCount}
            approvedCount={approvedCount}
            rejectedCount={rejectedCount}
          />
        </div>
        <div className="xl:col-span-7">
          <AdminPipelineDiagram />
        </div>
      </div>
    </main>
  );
}

export default function RoleDashboardPage() {
  const params = useParams<{ role: string }>();
  const router = useRouter();
  const role = params?.role || "";

  useEffect(() => {
    if (role === "user") {
      router.replace("/user/dashboard/evaluasi");
    }
  }, [role, router]);

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  if (role === "company") {
    return <CompanyDashboardView />;
  }

  if (role === "admin") {
    return <AdminDashboardView />;
  }

  return <DashboardPageSkeleton />;
}

