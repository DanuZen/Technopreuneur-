"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FileCheck,
  Briefcase,
  Home,
  FileText,
  FileSpreadsheet,
  Building2,
  ShieldCheck,
  Users,
  MessageSquareText,
} from "lucide-react";
import { getRoleFromPathname, getDashboardBasePath, getRoleSegment } from "@/lib/routes";

export interface ItemRiwayatEvaluasi {
  id: string;
  judul: string;
  skor: number;
  tanggal: string;
}

interface AppSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDesktopCollapsed: boolean;
  onToggleDesktopCollapse: () => void;
}

export function AppSidebar({
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
}: AppSidebarProps) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("cm_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.role) setUserRole(parsed.role);
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  const roleInUrl = /^\/(user|company|admin)\/dashboard(\/|$)/.test(pathname)
    ? getRoleFromPathname(pathname)
    : null;
  const activeRole = roleInUrl || getRoleSegment(userRole);
  const baseDashboardPath = roleInUrl
    ? `/${roleInUrl}/dashboard`
    : getDashboardBasePath(userRole);

  const navLinks =
    activeRole === "company"
      ? [
          {
            label: "Beranda Perusahaan",
            href: baseDashboardPath,
            icon: Building2,
            desc: "Ringkasan rekrutmen & kandidat",
            isActive: pathname === baseDashboardPath,
          },
          {
            label: "Kelola Lowongan",
            href: `${baseDashboardPath}/lowongan`,
            icon: Briefcase,
            desc: "Pasang & kelola posisi aktif",
            isActive: pathname.startsWith(`${baseDashboardPath}/lowongan`),
          },
          {
            label: "Seleksi Kandidat",
            href: `${baseDashboardPath}/evaluasi`,
            icon: Users,
            desc: "Tinjau skor ATS pelamar",
            isActive: pathname.startsWith(`${baseDashboardPath}/evaluasi`),
          },
          {
            label: "Profil Perusahaan",
            href: `${baseDashboardPath}/dokumen`,
            icon: FileText,
            desc: "Identitas & standar mitra",
            isActive:
              pathname.startsWith(`${baseDashboardPath}/dokumen`) ||
              pathname.startsWith(`${baseDashboardPath}/onboarding`),
          },
        ]
      : activeRole === "admin"
      ? [
          {
            label: "Ringkasan Sistem",
            href: baseDashboardPath,
            icon: ShieldCheck,
            desc: "Jumlah jobseeker, company & mitra",
            isActive: pathname === baseDashboardPath,
          },
          {
            label: "Monitoring Mitra",
            href: `${baseDashboardPath}/lowongan`,
            icon: Building2,
            desc: "Pantau company calon mitra",
            isActive: pathname.startsWith(`${baseDashboardPath}/lowongan`),
          },
          {
            label: "Standarisasi Platform",
            href: `${baseDashboardPath}/evaluasi`,
            icon: FileCheck,
            desc: "Atur standar ATS & kepatuhan",
            isActive: pathname.startsWith(`${baseDashboardPath}/evaluasi`),
          },
          {
            label: "Laporan Ekosistem",
            href: `${baseDashboardPath}/dokumen`,
            icon: FileSpreadsheet,
            desc: "Ringkasan eksekutif & kepatuhan",
            isActive:
              pathname.startsWith(`${baseDashboardPath}/dokumen`) ||
              pathname.startsWith(`${baseDashboardPath}/onboarding`),
          },
        ]
      : [
          {
            label: "Evaluasi CV",
            href: `${baseDashboardPath}/evaluasi`,
            icon: FileCheck,
            desc: "Unggah berkas PDF / DOCX",
            isActive:
              pathname === baseDashboardPath ||
              pathname === "/dashboard" ||
              pathname.startsWith(`${baseDashboardPath}/evaluasi`) ||
              pathname.startsWith(`${baseDashboardPath}/onboarding`) ||
              pathname === "/evaluate" ||
              pathname === "/onboarding",
          },
          {
            label: "Hasil Evaluasi",
            href: `${baseDashboardPath}/hasil-evaluasi`,
            icon: MessageSquareText,
            desc: "Skor 5 dimensi & konsultasi AI",
            isActive:
              pathname.startsWith(`${baseDashboardPath}/hasil-evaluasi`) ||
              pathname.startsWith(`${baseDashboardPath}/riwayat`),
          },
          {
            label: "Dokumen CV ATS",
            href: `${baseDashboardPath}/dokumen`,
            icon: FileText,
            desc: "Pratinjau & cetak CV standar ATS",
            isActive:
              pathname.startsWith(`${baseDashboardPath}/dokumen`) ||
              pathname.startsWith("/dashboard/dokumen"),
          },
          {
            label: "Lowongan Cocok",
            href: `${baseDashboardPath}/lowongan`,
            icon: Briefcase,
            desc: "Rekomendasi karir di dashboard",
            isActive:
              pathname.startsWith(`${baseDashboardPath}/lowongan`) ||
              pathname.startsWith("/dashboard/lowongan"),
          },
        ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Tutup panel navigasi"
          onClick={onCloseMobile}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onCloseMobile();
          }}
          className="fixed inset-0 z-40 bg-[#0f2c56]/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Navigasi aplikasi dan riwayat evaluasi"
        className={`fixed top-0 bottom-0 left-0 z-50 flex shrink-0 flex-col bg-[#edf2f9] text-primary overflow-hidden lg:static transition-[width,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileOpen
            ? "translate-x-0 shadow-2xl w-[310px]"
            : "-translate-x-full lg:translate-x-0"
        } ${isDesktopCollapsed ? "lg:w-[72px]" : "lg:w-[310px]"} w-[310px]`}
      >
        <div className="relative h-full w-full overflow-hidden flex flex-col justify-between">
          {/* ============================================================= */}
          {/* DESKTOP RAIL MODE (Tampil saat isDesktopCollapsed = true) */}
          {/* ============================================================= */}
          <div
            className={`hidden lg:flex absolute inset-0 flex-col items-center justify-between py-3 px-1.5 transition-opacity duration-200 ${
              isDesktopCollapsed
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Top Rail: Logo, Plus Button, Nav Icons */}
            <div className="flex flex-col items-center gap-2.5 w-full">
              {/* Logo icon button (click to expand) */}
              <button
                type="button"
                onClick={onToggleDesktopCollapse}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white hover:bg-blue-50 shadow-xs transition-transform hover:scale-105"
                title="Buka panel samping Pasbana AI"
                aria-label="Buka panel samping"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <Image
                    src="/logo-navy.webp"
                    alt="Pasbana AI"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              </button>

              {/* Quick Nav Icons */}
              <div className="w-full flex flex-col items-center gap-1.5 pt-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`morph-pill flex h-10 w-10 items-center justify-center rounded-xl ${
                        item.isActive
                          ? "bg-[#0f2c56] text-white shadow-xs font-bold rounded-full"
                          : "text-slate-600 hover:text-primary hover:bg-white/80"
                      }`}
                      title={`${item.label}: ${item.desc}`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Rail: Back to Home */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white transition-colors"
                title="Kembali ke Beranda"
                aria-label="Kembali ke Beranda"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* ============================================================= */}
          {/* FULL EXPANDED SIDEBAR (Tampil saat isDesktopCollapsed = false) */}
          {/* ============================================================= */}
          <div
            className={`flex flex-col h-full w-[310px] min-w-[310px] transition-opacity duration-200 ${
              isDesktopCollapsed
                ? "lg:opacity-0 lg:pointer-events-none"
                : "opacity-100 pointer-events-auto"
            }`}
          >
            {/* Header: Centered Brand Logo (click to collapse/close sidebar) */}
            <div className="relative shrink-0 px-5 pt-5 pb-3.5 bg-[#edf2f9] border-b border-slate-200/70">
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onCloseMobile();
                    } else {
                      onToggleDesktopCollapse();
                    }
                  }}
                  className="flex items-center justify-center group cursor-pointer"
                  aria-label="Tutup atau lipat panel samping"
                  title="Lipat panel samping"
                >
                  <Image
                    src="/logo-text-navy.webp"
                    alt="Pasbana - Kerja Pas, Karir Naik Class"
                    width={168}
                    height={56}
                    className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Scrollable Middle Body: Navigation & Evaluation History */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 py-4 space-y-5">
              {/* Navigation Menu */}
              <div className="space-y-1.5">
                <p className="px-2.5 pb-1 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Menu Utama
                </p>
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                        item.isActive
                          ? "bg-[#0f2c56] text-white"
                          : "text-slate-700 hover:bg-white hover:text-[#0f2c56]"
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate leading-tight">{item.label}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Pinned Footer: Kembali ke Beranda */}
            <div className="shrink-0 p-4 border-t border-slate-200/80 bg-[#edf2f9]">
              <Link
                href="/"
                onClick={onCloseMobile}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-bold text-white bg-[#ce2731] hover:bg-[#b01e27] transition-colors"
              >
                <Home className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

