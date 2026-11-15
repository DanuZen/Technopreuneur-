"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  FileCheck,
  Briefcase,
  Home,
  FileText,
  FileSpreadsheet,
  X,
  Trash2,
} from "lucide-react";
import { CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";
import { getRoleFromPathname, getDashboardBasePath } from "@/lib/routes";

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

const CONTOH_RIWAYAT_DEFAULT: ItemRiwayatEvaluasi[] = [
  {
    id: "demo-ats-wira",
    judul: "CV Wira Fikri - Standar ATS",
    skor: 88,
    tanggal: "Hari ini",
  },
  {
    id: "demo-frontend-freshgrad",
    judul: "Resume Frontend Fresh Graduate",
    skor: 82,
    tanggal: "Kemarin",
  },
];

export function AppSidebar({
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [daftarRiwayat, setDaftarRiwayat] = useState<ItemRiwayatEvaluasi[]>(CONTOH_RIWAYAT_DEFAULT);
  const [cariTerbuka, setCariTerbuka] = useState(false);
  const [kataKunci, setKataKunci] = useState("");
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
  const baseDashboardPath = roleInUrl
    ? `/${roleInUrl}/dashboard`
    : getDashboardBasePath(userRole);

  useEffect(() => {
    const syncHistory = () => {
      try {
        const storedHistory = api.getHistory();
        const fallbackCurrent = api.getCurrentAnalysis();
        const combined = [...storedHistory];
        if (
          fallbackCurrent &&
          !combined.some((entry) => entry.cvId === fallbackCurrent.cvId)
        ) {
          combined.unshift(fallbackCurrent);
        }

        const mappedFromStorage: ItemRiwayatEvaluasi[] = combined
          .map((parsed) => {
            const rawCvName = parsed?.fileName
              ? parsed.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim()
              : parsed?.profile?.fullName?.trim();
            if (!rawCvName) return null;
            const judul = parsed?.fileName
              ? rawCvName
              : /^(cv|resume)\b/i.test(rawCvName)
              ? rawCvName
              : `CV ${rawCvName}`;
            return {
              id: parsed.cvId || "eval-terbaru",
              judul,
              skor: parsed.overallScore || 85,
              tanggal: "Aktif",
            };
          })
          .filter((item): item is ItemRiwayatEvaluasi => item !== null);

        const defaultFiltered = CONTOH_RIWAYAT_DEFAULT.filter(
          (demo) => !mappedFromStorage.some((m) => m.id === demo.id)
        );
        setDaftarRiwayat([...mappedFromStorage, ...defaultFiltered]);
      } catch {
        // ignore parse error
      }
    };

    syncHistory();
    window.addEventListener("pasbana:history-updated", syncHistory);
    return () => {
      window.removeEventListener("pasbana:history-updated", syncHistory);
    };
  }, [pathname]);

  const handlePilihRiwayat = (id: string) => {
    onCloseMobile();
    router.push(`${baseDashboardPath}/riwayat/${encodeURIComponent(id)}`);
  };

  const handleHapusRiwayat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    api.removeHistory(id);
    setDaftarRiwayat((prev) => prev.filter((item) => item.id !== id));
  };

  const riwayatTersaring = daftarRiwayat.filter((item) =>
    item.judul.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const navLinks = [
    {
      label: "Evaluasi CV",
      href: `${baseDashboardPath}/evaluasi`,
      icon: FileCheck,
      desc: "Unggah berkas PDF / DOCX",
      isActive:
        pathname === baseDashboardPath ||
        pathname === "/dashboard" ||
        pathname.startsWith(`${baseDashboardPath}/evaluasi`) ||
        pathname === "/evaluate",
    },
    {
      label: "Onboarding CV",
      href: `${baseDashboardPath}/onboarding`,
      icon: FileSpreadsheet,
      desc: "Susun CV dari kuesioner",
      isActive:
        pathname.startsWith(`${baseDashboardPath}/onboarding`) ||
        pathname === "/onboarding",
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
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                        item.isActive
                          ? "bg-[#0f2c56] text-white shadow-xs font-bold"
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
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
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

              {/* Riwayat Evaluasi CV (Like ChatGPT Chats!) */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Riwayat Sesi ({daftarRiwayat.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCariTerbuka((s) => !s);
                      setKataKunci("");
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-primary hover:bg-white/80 transition-colors"
                    title="Cari riwayat CV"
                    aria-label="Cari riwayat evaluasi"
                  >
                    <Search className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                {/* Filter Search Input */}
                {cariTerbuka && (
                  <div className="relative px-1">
                    <div className="flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 shadow-xs">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={kataKunci}
                        onChange={(e) => setKataKunci(e.target.value)}
                        placeholder="Cari riwayat evaluasi..."
                        className="w-full text-xs text-primary bg-transparent focus:outline-none placeholder:text-slate-400"
                        autoFocus
                      />
                      {kataKunci && (
                        <button
                          type="button"
                          onClick={() => setKataKunci("")}
                          className="text-slate-400 hover:text-slate-600"
                          aria-label="Bersihkan pencarian"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* History Items List */}
                <div className="space-y-1.5">
                  {riwayatTersaring.length === 0 ? (
                    <p className="px-2 py-3 text-[11px] text-slate-500 bg-white/60 rounded-xl">
                      Tidak ada riwayat evaluasi yang sesuai.
                    </p>
                  ) : (
                    riwayatTersaring.map((item) => {
                      const sessionHref = `${baseDashboardPath}/riwayat/${encodeURIComponent(
                        item.id
                      )}`;
                      const isSessionActive =
                        pathname === sessionHref ||
                        decodeURIComponent(pathname) ===
                          `${baseDashboardPath}/riwayat/${item.id}`;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handlePilihRiwayat(item.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handlePilihRiwayat(item.id);
                            }
                          }}
                          className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                            isSessionActive
                              ? "bg-[#0f2c56] text-white"
                              : "text-slate-700 hover:bg-white hover:text-[#0f2c56]"
                          }`}
                        >
                          <FileCheck className="w-[18px] h-[18px] shrink-0" aria-hidden="true" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate leading-tight">{item.judul}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleHapusRiwayat(item.id, e)}
                            className={`opacity-0 group-hover:opacity-100 p-1 transition-opacity shrink-0 ${
                              isSessionActive
                                ? "text-white/75 hover:text-white"
                                : "text-slate-400 hover:text-[#ce2731]"
                            }`}
                            title="Hapus riwayat ini"
                            aria-label={`Hapus ${item.judul}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
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

