"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { User } from "@/types";
import { api } from "@/lib/api";
import { getDashboardBasePath, getRoleFromPathname } from "@/lib/routes";
import { UserProfilePopup } from "./user-profile-popup";

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
    router.push("/login");
  };

  const roleInUrl = /^\/(user|company|admin)\/dashboard(\/|$)/.test(pathname)
    ? getRoleFromPathname(pathname)
    : null;
  const baseDashboardPath = roleInUrl
    ? `/${roleInUrl}/dashboard`
    : getDashboardBasePath(user?.role);

  return (
    <header className="sticky top-0 z-30 flex min-h-[46px] sm:min-h-[50px] w-full shrink-0 items-center justify-between gap-3 bg-white px-3.5 sm:px-6 py-1.5">
      {/* Left: Mobile Toggle */}
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
      </div>

      {/* Right: Dashboard Button & Profile Dropdown */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Link
          href={baseDashboardPath}
          className="morph-pill hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-white" />
          <span>Dashboard</span>
        </Link>

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
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <UserProfilePopup
                user={user}
                baseDashboardPath={baseDashboardPath}
                onClose={() => setMenuOpen(false)}
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
      {/* Soft bottom white gradient fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-full h-3 bg-gradient-to-b from-white via-white/80 to-transparent"
      />
    </header>
  );
}

