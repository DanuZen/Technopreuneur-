"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Briefcase, Users, ShieldCheck, ArrowUpRight, FileCheck } from "lucide-react";
import DashboardPage from "@/app/dashboard/page";
import { isValidDashboardRole } from "@/lib/routes";

function CompanyDashboardView() {
  return (
    <main className="min-h-full max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Portal Perusahaan</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading">
            Dashboard Rekrutmen Perusahaan
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            Kelola lowongan kerja aktif, pantau kandidat terverifikasi ATS, dan temukan talenta yang paling sesuai dengan kebutuhan tim Anda.
          </p>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#ce2731] text-[#0f2c56] hover:text-white text-xs font-extrabold transition-colors shrink-0"
        >
          <span>Lihat Daftar Lowongan</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-400 font-bold">Lowongan Aktif</p>
          <p className="text-2xl font-black text-[#0f2c56]">3 Posisi</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#ce2731] text-white flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-400 font-bold">Kandidat Terkurasi</p>
          <p className="text-2xl font-black text-[#0f2c56]">Siap Tinjau</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
          <p className="text-xs font-mono uppercase text-slate-400 font-bold">Standar CV</p>
          <p className="text-2xl font-black text-[#0f2c56]">ATS 5 Dimensi</p>
        </div>
      </div>
    </main>
  );
}

function AdminDashboardView() {
  return (
    <main className="min-h-full max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ce2731] text-white text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Administrator</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading">
            Dashboard Admin Pasbana AI
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            Pantau aktivitas evaluasi CV, moderasi lowongan mitra perusahaan, dan kelola kesehatan ekosistem platform.
          </p>
        </div>

        <Link
          href="/user/dashboard"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#ce2731] text-[#0f2c56] hover:text-white text-xs font-extrabold transition-colors shrink-0"
        >
          <span>Pratinjau Dashboard User</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}

export default function RoleDashboardPage() {
  const params = useParams<{ role: string }>();
  const role = params?.role || "";

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  if (role === "company") {
    return <CompanyDashboardView />;
  }

  if (role === "admin") {
    return <AdminDashboardView />;
  }

  return <DashboardPage />;
}
