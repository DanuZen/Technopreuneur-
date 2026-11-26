"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { User } from "@/types";
import { api } from "@/lib/api";
import { getDashboardBasePath, getRoleFromPathname } from "@/lib/routes";
import { UserProfilePopup } from "./user-profile-popup";

interface AppHeaderProps {
  isMobileOpen?: boolean;
  onToggleMobile: () => void;
  isDesktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
}

export function AppHeader({
  isMobileOpen = false,
  onToggleMobile,
}: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    api.removeToken();
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  };

  const roleInUrl = /^\/(user|company|admin)\/dashboard(\/|$)/.test(pathname)
    ? getRoleFromPathname(pathname)
    : null;
  const baseDashboardPath = roleInUrl
    ? `/${roleInUrl}/dashboard`
    : getDashboardBasePath(user?.role);

  return (
    <header className="sticky top-0 z-30 flex min-h-[52px] lg:min-h-[50px] w-full shrink-0 items-center justify-between gap-3 bg-white px-4 sm:px-6 py-2 lg:py-1.5">
      {/* Left: Mobile Brand Logo (Hidden on Desktop lg+, does not route to landing page) */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex lg:hidden items-center py-0.5 shrink-0 select-none">
          <Image
            src="/logo-text-navy.webp"
            alt="Pasbana - Kerja Pas, Karir Naik Class"
            width={136}
            height={44}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Right: Mobile Hamburger Menu Toggle (< lg) & Desktop Profile Dropdown (lg+) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Mobile Hamburger Toggle on the Right (Clean icon only, no card background) */}
        <button
          type="button"
          onClick={onToggleMobile}
          className="flex lg:hidden w-10 h-10 items-center justify-center text-[#0f2c56] hover:text-[#ce2731] transition-colors cursor-pointer"
          aria-label="Buka menu samping navigasi"
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? (
            <X className="w-6 h-6 shrink-0" />
          ) : (
            <Menu className="w-6 h-6 shrink-0" />
          )}
        </button>

        {/* Desktop Account Menu (lg+ only, moved to Sidebar on mobile) */}
        <div className="hidden lg:flex items-center gap-2.5">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              className="flex items-center gap-2 min-h-[44px] py-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-[#0f2c56] transition-colors cursor-pointer"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <div className="w-6 h-6 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline max-w-[120px] truncate">{user.name}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2.5 w-64 rounded-[24px] bg-white border border-slate-200 text-[#0f2c56] shadow-2xl p-2.5 z-50">
                {/* User Profile Header */}
                <div className="px-4 py-3 rounded-2xl bg-[#0f2c56] text-white mb-2">
                  <div className="text-xs font-extrabold text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-300 truncate mt-0.5">
                    {user.email || "Akun Terverifikasi"}
                  </div>
                  <span className="inline-block mt-2 uppercase text-[9px] bg-[#ce2731] text-white px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {user.role}
                  </span>
                </div>

                {/* Dropdown Items: Dashboard & Detail Profil */}
                <div className="space-y-1">
                  <Link
                    href={baseDashboardPath}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-[#0f2c56] hover:bg-[#edf2f9] transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                    </span>
                    <span>Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setProfilePopupOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-[#0f2c56] hover:bg-[#edf2f9] transition-colors cursor-pointer text-left"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#ce2731] text-white flex items-center justify-center shrink-0">
                      <UserIcon className="w-3.5 h-3.5" />
                    </span>
                    <span>Detail Profil</span>
                  </button>
                </div>

                <div className="my-2 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-bold text-white bg-[#ce2731] hover:bg-[#b01e27] transition-colors cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <LogOut className="w-3.5 h-3.5" />
                  </span>
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            )}

            {profilePopupOpen && (
              <UserProfilePopup
                user={user}
                baseDashboardPath={baseDashboardPath}
                onClose={() => setProfilePopupOpen(false)}
                onLogout={handleLogout}
                onUserUpdated={(updated) => setUser(updated)}
              />
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
      </div>
      {/* Soft bottom white gradient fade (Desktop lg+ only so it never overlaps mobile badges) */}
      <div
        aria-hidden="true"
        className="hidden lg:block pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-white via-white/80 to-transparent"
      />
    </header>
  );
}

