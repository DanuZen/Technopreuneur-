"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  FileCheck,
  Briefcase,
  LayoutDashboard,
  Home,
  FileText,
  FileSpreadsheet,
  User as UserIcon,
  LogOut,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
} from "lucide-react";
import { User, CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get("tab");

  const [user, setUser] = useState<User | null>(null);
  const [daftarRiwayat, setDaftarRiwayat] = useState<ItemRiwayatEvaluasi[]>(CONTOH_RIWAYAT_DEFAULT);
  const [cariTerbuka, setCariTerbuka] = useState(false);
  const [kataKunci, setKataKunci] = useState("");
  const [konfirmasiLogout, setKonfirmasiLogout] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("cm_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedAnalysis = localStorage.getItem("cm_analysis");
      if (storedAnalysis) {
        const parsed: CVAnalysisResult = JSON.parse(storedAnalysis);
        if (parsed?.profile?.fullName) {
          const itemAktif: ItemRiwayatEvaluasi = {
            id: parsed.cvId || "eval-terbaru",
            judul: `CV ${parsed.profile.fullName}`,
            skor: parsed.overallScore || 85,
            tanggal: "Aktif",
          };
          setDaftarRiwayat((prev) => {
            const disaring = prev.filter((p) => p.id !== itemAktif.id);
            return [itemAktif, ...disaring];
          });
        }
      }
    } catch {
      // ignore parse error
    }
  }, [pathname]);

  const handleLogout = () => {
    api.removeToken();
    setUser(null);
    setKonfirmasiLogout(false);
    router.push("/");
  };

  const handleSelectNewEvaluation = () => {
    onCloseMobile();
    router.push("/evaluate");
  };

  const handlePilihRiwayat = () => {
    onCloseMobile();
    router.push("/dashboard");
  };

  const handleHapusRiwayat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDaftarRiwayat((prev) => prev.filter((item) => item.id !== id));
  };

  const riwayatTersaring = daftarRiwayat.filter((item) =>
    item.judul.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const navLinks = [
    {
      label: "Dashboard Skor ATS",
      href: "/dashboard",
      icon: LayoutDashboard,
      desc: "Analisis profil 5 dimensi",
      isActive: pathname === "/dashboard" && (!currentTab || currentTab === "dimensions"),
    },
    {
      label: "Dokumen CV ATS",
      href: "/dashboard?tab=preview",
      icon: FileText,
      desc: "Pratinjau & cetak CV standar ATS",
      isActive: pathname === "/dashboard" && currentTab === "preview",
    },
    {
      label: "Lowongan Cocok",
      href: "/dashboard?tab=jobs",
      icon: Briefcase,
      desc: "Rekomendasi karir di dashboard",
      isActive: pathname === "/dashboard" && currentTab === "jobs",
    },
    {
      label: "Evaluasi CV",
      href: "/evaluate",
      icon: FileCheck,
      desc: "Unggah berkas PDF / DOCX",
      isActive: pathname === "/evaluate",
    },
    {
      label: "Onboarding CV ATS",
      href: "/onboarding",
      icon: FileSpreadsheet,
      desc: "Susun CV dari kuesioner",
      isActive: pathname === "/onboarding",
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
            ? "translate-x-0 shadow-2xl w-[280px]"
            : "-translate-x-full lg:translate-x-0"
        } ${isDesktopCollapsed ? "lg:w-[68px]" : "lg:w-[280px]"} w-[280px]`}
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

              {/* Action (+) Button */}
              <button
                type="button"
                onClick={handleSelectNewEvaluation}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f2c56] hover:bg-[#ce2731] text-white transition-colors cursor-pointer"
                title="Mulai Evaluasi CV Baru (+)"
                aria-label="Mulai evaluasi CV baru"
              >
                <Plus className="w-5 h-5 text-white" aria-hidden="true" />
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

            {/* Bottom Rail: Back to Home + User + Expand Toggle */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0f2c56] hover:bg-[#ce2731] hover:text-white border border-slate-200 transition-colors"
                title="Kembali ke Beranda"
                aria-label="Kembali ke Beranda"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={onToggleDesktopCollapse}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-primary hover:bg-white/80 transition-colors"
                title="Perluas Menu Samping"
                aria-label="Perluas menu samping"
              >
                <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />
              </button>

              {user ? (
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f2c56] text-white text-xs font-bold shadow-xs cursor-pointer"
                  title={`Akun: ${user.name}`}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white hover:bg-blue-50 text-primary shadow-xs"
                  title="Masuk Akun"
                >
                  <UserIcon className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* FULL EXPANDED SIDEBAR (Tampil saat isDesktopCollapsed = false) */}
          {/* ============================================================= */}
          <div
            className={`flex flex-col h-full w-[280px] min-w-[280px] transition-opacity duration-200 ${
              isDesktopCollapsed
                ? "lg:opacity-0 lg:pointer-events-none"
                : "opacity-100 pointer-events-auto"
            }`}
          >
            {/* Header: Brand Logo & Collapse Button */}
            <div className="shrink-0 px-4 pt-4 pb-2 bg-[#edf2f9]">
              <div className="flex items-center justify-between gap-2">
                <Link
                  href="/"
                  onClick={onCloseMobile}
                  className="flex items-center gap-2.5 group"
                >
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <Image
                      src="/logo-navy.webp"
                      alt="Pasbana AI"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading font-extrabold text-[#0f2c56] text-sm tracking-tight leading-tight">
                      Pasbana<span className="text-secondary"> AI</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-tight truncate">
                      Karir yang Pas Bana
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onCloseMobile();
                    } else {
                      onToggleDesktopCollapse();
                    }
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:text-primary hover:bg-white/80 transition-colors"
                  aria-label="Tutup panel samping"
                  title="Lipat panel samping (Rail mode)"
                >
                  <PanelLeftClose className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Primary Action Button (Mulai Evaluasi CV Baru) */}
              <div className="mt-3.5">
                <button
                  type="button"
                  onClick={handleSelectNewEvaluation}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white shrink-0" aria-hidden="true" />
                  <span>Evaluasi CV Baru</span>
                </button>
              </div>
            </div>

            {/* Scrollable Middle Body: Navigation & Evaluation History */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
              {/* Navigation Menu */}
              <div className="space-y-1">
                <p className="px-2 pb-1 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Menu Utama
                </p>
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        item.isActive
                          ? "bg-[#0f2c56] text-white"
                          : "text-slate-700 hover:bg-white hover:text-[#0f2c56]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate leading-tight">{item.label}</p>
                      </div>
                      {item.isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#ce2731] shrink-0" />
                      )}
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
                <div className="space-y-1">
                  {riwayatTersaring.length === 0 ? (
                    <p className="px-2 py-3 text-[11px] text-slate-500 bg-white/60 rounded-xl">
                      Tidak ada riwayat evaluasi yang sesuai.
                    </p>
                  ) : (
                    riwayatTersaring.map((item) => (
                      <div
                        key={item.id}
                        onClick={handlePilihRiwayat}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handlePilihRiwayat();
                        }}
                        className="group flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs bg-white hover:bg-[#0f2c56] text-slate-700 hover:text-white border border-slate-200 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCheck className="w-3.5 h-3.5 text-[#0f2c56] group-hover:text-white shrink-0" />
                          <span className="truncate font-medium">{item.judul}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="px-1.5 py-0.5 rounded bg-[#ce2731] text-white font-mono text-[10px] font-bold">
                            {item.skor}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleHapusRiwayat(item.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-white/70 hover:text-white transition-opacity"
                            title="Hapus riwayat ini"
                            aria-label={`Hapus ${item.judul}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* 1 Button Route Keluar */}
              <div className="pt-2 border-t border-slate-200/80">
                <Link
                  href="/"
                  onClick={onCloseMobile}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#0f2c56] bg-white hover:bg-[#0f2c56] hover:text-white border border-slate-200 transition-colors"
                >
                  <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Kembali ke Beranda</span>
                </Link>
              </div>
            </div>

            {/* Bottom Footer Section: User Profile & Account (Hanya tombol Keluar Akun) */}
            <div className="shrink-0 p-3 bg-white border-t border-slate-200 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#0f2c56] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0f2c56] truncate leading-tight">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate leading-tight">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!konfirmasiLogout ? (
                    <button
                      type="button"
                      onClick={() => setKonfirmasiLogout(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold text-white bg-[#ce2731] hover:bg-[#0f2c56] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar Akun</span>
                    </button>
                  ) : (
                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 space-y-1.5 text-center">
                      <p className="text-[11px] font-bold text-[#0f2c56]">Yakin ingin keluar?</p>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex-1 py-1 rounded-lg bg-[#ce2731] text-white text-[11px] font-bold hover:bg-[#0f2c56] transition"
                        >
                          Ya, Keluar
                        </button>
                        <button
                          type="button"
                          onClick={() => setKonfirmasiLogout(false)}
                          className="flex-1 py-1 rounded-lg bg-white text-[#0f2c56] border border-slate-200 text-[11px] font-semibold hover:bg-slate-50 transition"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0f2c56] truncate">Tamu / Pengunjung</p>
                      <p className="text-[10px] text-slate-500">Sesi Lokal Aman</p>
                    </div>
                  </div>
                  <Link
                    href="/login"
                    onClick={onCloseMobile}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#ce2731] hover:bg-[#0f2c56] px-2.5 py-1.5 rounded-xl transition"
                  >
                    <span>Masuk</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

