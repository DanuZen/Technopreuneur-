"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Briefcase,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { User } from "@/types";
import { api } from "@/lib/api";

interface AppHeaderProps {
  onToggleMobile: () => void;
  isDesktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
}

export function AppHeader({
  onToggleMobile,
}: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cm_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    api.removeToken();
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  };

  const getViewTitle = () => {
    if (pathname.startsWith("/evaluate")) return "Ruang Evaluasi CV & Kesiapan Karir";
    if (pathname.startsWith("/onboarding")) return "Onboarding Pembuatan CV Standar ATS";
    if (pathname.startsWith("/dashboard")) return "Dashboard Hasil Evaluasi 5 Dimensi";
    if (pathname.startsWith("/jobs")) return "Rekomendasi Lowongan Kerja Cerdas";
    if (pathname.startsWith("/about")) return "Tentang Kami • Visi & Nilai Pasbana";
    if (pathname.startsWith("/login")) return "Masuk ke Akun Pasbana AI";
    if (pathname.startsWith("/register")) return "Registrasi Talenta Baru";
    return "Beranda • Platform Karir Cerdas";
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-[58px] sm:min-h-[64px] w-full shrink-0 items-center justify-between gap-3 bg-white px-3.5 sm:px-6 py-2">
      {/* Left: Toggles & Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onToggleMobile}
          className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-100 hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white transition-colors cursor-pointer"
          aria-label="Buka menu samping navigasi"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb / Location Title */}
        <div className="flex items-center min-w-0">
          <h2 className="text-xs sm:text-sm font-bold text-[#0f2c56] truncate tracking-tight font-heading">
            {getViewTitle()}
          </h2>
        </div>
      </div>

      {/* Right: Quick Action & User Dropdown */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Quick CTA if not on evaluate */}
        {pathname !== "/evaluate" && (
          <Link
            href="/evaluate"
            className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-white" />
            <span>Mulai Evaluasi</span>
          </Link>
        )}

        {/* Account Menu */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              className="flex items-center gap-2 py-1.5 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-[#0f2c56] transition-colors cursor-pointer"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <div className="w-6 h-6 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">{user.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-lg py-2 z-50">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#0f2c56] truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0f2c56] transition"
                  >
                    <FileCheck className="w-4 h-4 text-[#0f2c56]" />
                    <span>Dashboard Evaluasi ATS</span>
                  </Link>
                  <Link
                    href="/jobs"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0f2c56] transition"
                  >
                    <Briefcase className="w-4 h-4 text-[#ce2731]" />
                    <span>Rekomendasi Karir</span>
                  </Link>
                </div>
                <div className="pt-1 border-t border-slate-100 px-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#ce2731] hover:bg-[#0f2c56] transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          </div>
        )}
      </div>
      {/* Soft bottom white gradient fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full h-6 bg-gradient-to-b from-white via-white/80 to-transparent"
      />
    </header>
  );
}

